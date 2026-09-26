const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class AstParser {
  /**
   * Scans a repository directory for Java files and parses AST/syntax patterns
   */
  async scanRepository(repoDir) {
    // Find all .java files excluding build artifacts and git folders
    const javaFiles = await glob('**/*.java', {
      cwd: repoDir,
      nodir: true,
      ignore: ['**/target/**', '**/build/**', '**/.git/**', '**/bin/**']
    });

    const fileResults = [];
    const aggregatedStats = {
      totalJavaFiles: javaFiles.length,
      totalLinesOfCode: 0,
      filesWithJavax: 0,
      totalJavaxOccurrences: 0,
      filesWithRecordCandidates: 0,
      totalRecordCandidates: 0,
      filesWithJUnit4: 0,
      totalJUnit4Occurrences: 0,
      filesWithDeprecatedApis: 0,
      totalDeprecatedOccurrences: 0,
      namespaceShifts: []
    };

    for (const relFile of javaFiles) {
      const fullPath = path.join(repoDir, relFile);
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const analysis = this.analyzeJavaFile(content, relFile);

        aggregatedStats.totalLinesOfCode += analysis.loc;

        if (analysis.javaxMatches.length > 0) {
          aggregatedStats.filesWithJavax++;
          aggregatedStats.totalJavaxOccurrences += analysis.javaxMatches.length;
          aggregatedStats.namespaceShifts.push({
            file: relFile,
            count: analysis.javaxMatches.length,
            packages: [...new Set(analysis.javaxMatches.map(m => m.packageName))]
          });
        }

        if (analysis.isRecordCandidate) {
          aggregatedStats.filesWithRecordCandidates++;
          aggregatedStats.totalRecordCandidates++;
        }

        if (analysis.junit4Matches.length > 0) {
          aggregatedStats.filesWithJUnit4++;
          aggregatedStats.totalJUnit4Occurrences += analysis.junit4Matches.length;
        }

        if (analysis.deprecatedMatches.length > 0) {
          aggregatedStats.filesWithDeprecatedApis++;
          aggregatedStats.totalDeprecatedOccurrences += analysis.deprecatedMatches.length;
        }

        fileResults.push(analysis);
      } catch (err) {
        console.warn(`Error reading/parsing Java file ${relFile}:`, err.message);
      }
    }

    return {
      repoDir,
      fileCount: javaFiles.length,
      aggregatedStats,
      files: fileResults
    };
  }

  /**
   * Analyzes an individual Java source file
   */
  analyzeJavaFile(content, filePath) {
    const lines = content.split(/\r?\n/);
    const loc = lines.length;

    // Detect Package & Class name
    const packageMatch = content.match(/package\s+([a-zA-Z0-9_.]+);/);
    const packageName = packageMatch ? packageMatch[1] : '';

    const classMatch = content.match(/(?:public|protected|private)?\s*(?:final\s+|abstract\s+)?(class|interface|enum|record)\s+([a-zA-Z0-9_]+)/);
    const typeKind = classMatch ? classMatch[1] : 'class';
    const className = classMatch ? classMatch[2] : path.basename(filePath, '.java');

    // 1. Detect javax.* imports and usage
    const javaxMatches = [];
    const javaxRegex = /(?:import\s+(?:static\s+)?|(?:new\s+)|(?:extends\s+)|(?:implements\s+)|(?:@))?(javax\.(servlet|persistence|annotation|validation|transaction|ws\.rs|xml\.bind|ejb|inject|mail)[a-zA-Z0-9_.*]*)/g;

    lines.forEach((line, index) => {
      let match;
      const lineNum = index + 1;
      while ((match = javaxRegex.exec(line)) !== null) {
        const fullMatch = match[1];
        const subPkg = match[2];
        javaxMatches.push({
          line: lineNum,
          raw: line.trim(),
          importStr: fullMatch,
          packageName: `javax.${subPkg}`,
          suggestedReplacement: fullMatch.replace(/^javax\./, 'jakarta.')
        });
      }
    });

    // 2. Detect mutable DTO pattern -> Java 21 Record candidate
    const recordAnalysis = this.analyzeRecordCandidate(content, lines, className, typeKind, filePath);

    // 3. Detect JUnit 4 legacy annotations
    const junit4Matches = [];
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      if (line.includes('org.junit.Test') || line.includes('@Test') && !content.includes('org.junit.jupiter')) {
        junit4Matches.push({ line: lineNum, type: 'Test', raw: line.trim(), replacement: '@org.junit.jupiter.api.Test' });
      }
      if (line.includes('@Before') && !line.includes('@BeforeEach') && !line.includes('@BeforeAll')) {
        junit4Matches.push({ line: lineNum, type: 'Before', raw: line.trim(), replacement: '@BeforeEach' });
      }
      if (line.includes('@After') && !line.includes('@AfterEach') && !line.includes('@AfterAll')) {
        junit4Matches.push({ line: lineNum, type: 'After', raw: line.trim(), replacement: '@AfterEach' });
      }
      if (line.includes('@BeforeClass')) {
        junit4Matches.push({ line: lineNum, type: 'BeforeClass', raw: line.trim(), replacement: '@BeforeAll' });
      }
      if (line.includes('@AfterClass')) {
        junit4Matches.push({ line: lineNum, type: 'AfterClass', raw: line.trim(), replacement: '@AfterAll' });
      }
      if (line.includes('org.junit.Assert')) {
        junit4Matches.push({ line: lineNum, type: 'Assert', raw: line.trim(), replacement: 'org.junit.jupiter.api.Assertions' });
      }
    });

    // 4. Detect deprecated Java 8/11 idioms
    const deprecatedMatches = [];
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      if (/new\s+(?:Integer|Long|Double|Float|Boolean|Byte|Short)\s*\(/.test(line)) {
        deprecatedMatches.push({
          line: lineNum,
          type: 'BOXED_PRIMITIVE_CONSTRUCTOR',
          raw: line.trim(),
          description: 'Boxing constructors (e.g. new Integer(x)) deprecated since Java 9, replaced with static valueOf(x)'
        });
      }
      if (/java\.util\.Date\b/.test(line) && !line.includes('//')) {
        deprecatedMatches.push({
          line: lineNum,
          type: 'LEGACY_DATE_API',
          raw: line.trim(),
          description: 'java.util.Date can be upgraded to modern java.time.Instant or LocalDateTime'
        });
      }
    });

    const isTestFile = filePath.toLowerCase().includes('test') || className.endsWith('Test') || className.endsWith('Tests');

    return {
      filePath,
      fileName: path.basename(filePath),
      className,
      packageName,
      typeKind,
      loc,
      isTestFile,
      hasJavax: javaxMatches.length > 0,
      javaxMatches,
      isRecordCandidate: recordAnalysis.isCandidate,
      recordDetails: recordAnalysis,
      junit4Matches,
      deprecatedMatches,
      modernizationIssuesCount: javaxMatches.length + (recordAnalysis.isCandidate ? 1 : 0) + junit4Matches.length + deprecatedMatches.length
    };
  }

  /**
   * Analyzes if a class meets the criteria for conversion into a Java 21 Record
   */
  analyzeRecordCandidate(content, lines, className, typeKind, filePath) {
    // Entities, Spring Services/Controllers, Interfaces, Abstract classes are not records
    if (typeKind !== 'class') return { isCandidate: false };
    if (content.includes('@Entity') || content.includes('@Table') || content.includes('@Service') || content.includes('@Controller') || content.includes('@RestController') || content.includes('@Repository') || content.includes('@Configuration')) {
      return { isCandidate: false, reason: 'Spring bean or JPA entity' };
    }
    if (content.includes('abstract class') || content.includes('extends ')) {
      return { isCandidate: false, reason: 'Extends another class or is abstract' };
    }

    const isDtoName = /(Dto|DTO|Request|Response|Payload|Model|Vo|VO|Event)$/.test(className);
    const hasFields = /private\s+(?:final\s+)?([a-zA-Z0-9<>_,\s]+)\s+([a-zA-Z0-9_]+);/g;

    const fields = [];
    let fieldMatch;
    while ((fieldMatch = hasFields.exec(content)) !== null) {
      fields.push({
        type: fieldMatch[1].trim(),
        name: fieldMatch[2].trim()
      });
    }

    // Must have at least 1 field and either getters/setters or DTO suffix
    const hasGetters = /public\s+[a-zA-Z0-9<>_]+\s+get[A-Z0-9_]/.test(content);
    const hasSetters = /public\s+void\s+set[A-Z0-9_]/.test(content);

    const isCandidate = fields.length > 0 && (isDtoName || (hasGetters && hasSetters));

    return {
      isCandidate,
      fields,
      fieldsCount: fields.length,
      isDtoName,
      hasGetters,
      hasSetters,
      targetRecordSyntax: isCandidate 
        ? `public record ${className}(${fields.map(f => `${f.type} ${f.name}`).join(', ')}) {}`
        : null
    };
  }
}

module.exports = new AstParser();
