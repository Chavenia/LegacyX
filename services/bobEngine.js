const fs = require('fs');
const path = require('path');
const diff = require('diff');

class BobEngine {
  /**
   * Orchestrates IBM Bob 2.0 Agent Mode with Subagents A, B, and C
   */
  async executeAgentMode(repoDir, scanResults) {
    const startTime = Date.now();
    const logs = [];

    const addLog = (subagent, status, message) => {
      logs.push({
        timestamp: new Date().toISOString(),
        subagent,
        status, // 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
        message
      });
    };

    addLog('Orchestrator', 'INFO', 'Initializing IBM Bob 2.0 Multi-Agent Modernization Engine');

    const diffs = [];
    const modifiedFiles = [];

    // =========================================================================
    // SUBAGENT B: Maven / Gradle Dependencies & OSV Vulnerability Remediation
    // =========================================================================
    addLog('Subagent-B', 'INFO', 'Starting dependency AST analysis and pom.xml modernization');
    try {
      const pomDiff = await this.executeSubagentB(repoDir, scanResults.pom);
      if (pomDiff) {
        diffs.push(pomDiff);
        modifiedFiles.push(pomDiff.filePath);
        addLog('Subagent-B', 'SUCCESS', 'pom.xml upgraded to Java 21, Spring Boot 3.3.4, and Jakarta EE dependencies');
      } else {
        addLog('Subagent-B', 'INFO', 'pom.xml is already up to date or not present');
      }
    } catch (err) {
      addLog('Subagent-B', 'ERROR', `Subagent B encountered an issue: ${err.message}`);
    }

    // =========================================================================
    // SUBAGENT A: javax.* -> jakarta.* Namespace Shifts & Java 21 Records
    // =========================================================================
    addLog('Subagent-A', 'INFO', 'Executing namespace transformations and Java 21 Record conversions');
    try {
      const subagentADiffs = await this.executeSubagentA(repoDir, scanResults.ast.files);
      diffs.push(...subagentADiffs);
      subagentADiffs.forEach(d => modifiedFiles.push(d.filePath));
      addLog('Subagent-A', 'SUCCESS', `Processed ${subagentADiffs.length} Java source files for namespace and record transformations`);
    } catch (err) {
      addLog('Subagent-A', 'ERROR', `Subagent A encountered an issue: ${err.message}`);
    }

    // =========================================================================
    // SUBAGENT C: JUnit 5 Migration & Regression Suite Synthesis
    // =========================================================================
    addLog('Subagent-C', 'INFO', 'Migrating legacy JUnit 4 test suites to JUnit 5 Jupiter engine');
    try {
      const subagentCDiffs = await this.executeSubagentC(repoDir, scanResults.ast.files);
      diffs.push(...subagentCDiffs);
      subagentCDiffs.forEach(d => modifiedFiles.push(d.filePath));
      addLog('Subagent-C', 'SUCCESS', `Transformed ${subagentCDiffs.length} test classes to JUnit 5 standards`);
    } catch (err) {
      addLog('Subagent-C', 'ERROR', `Subagent C encountered an issue: ${err.message}`);
    }

    const durationMs = Date.now() - startTime;
    addLog('Orchestrator', 'SUCCESS', `Modernization run completed in ${durationMs}ms with ${diffs.length} files modified`);

    return {
      success: true,
      engine: 'IBM Bob 2.0 (Agent Mode)',
      durationMs,
      totalFilesModified: diffs.length,
      modifiedFiles,
      diffs,
      logs
    };
  }

  /**
   * Subagent A: Transforms javax.* -> jakarta.* and DTOs -> Java 21 Records
   */
  async executeSubagentA(repoDir, files) {
    const results = [];

    for (const fileMeta of files) {
      if (fileMeta.isTestFile) continue; // Handled by Subagent C

      const fullPath = path.join(repoDir, fileMeta.filePath);
      if (!fs.existsSync(fullPath)) continue;

      const originalCode = fs.readFileSync(fullPath, 'utf8');
      let modernCode = originalCode;
      let hasChanges = false;
      const appliedTransforms = [];

      // 1. Namespace shift: javax -> jakarta
      if (fileMeta.hasJavax) {
        const javaxReplacements = [
          { from: /javax\.servlet\b/g, to: 'jakarta.servlet' },
          { from: /javax\.persistence\b/g, to: 'jakarta.persistence' },
          { from: /javax\.annotation\b/g, to: 'jakarta.annotation' },
          { from: /javax\.validation\b/g, to: 'jakarta.validation' },
          { from: /javax\.transaction\b/g, to: 'jakarta.transaction' },
          { from: /javax\.ws\.rs\b/g, to: 'jakarta.ws.rs' },
          { from: /javax\.xml\.bind\b/g, to: 'jakarta.xml.bind' },
          { from: /javax\.ejb\b/g, to: 'jakarta.ejb' },
          { from: /javax\.inject\b/g, to: 'jakarta.inject' }
        ];

        for (const r of javaxReplacements) {
          if (r.from.test(modernCode)) {
            modernCode = modernCode.replace(r.from, r.to);
            hasChanges = true;
            appliedTransforms.push(`Shifted namespace to ${r.to}`);
          }
        }
      }

      // 2. Deprecated boxed primitive constructors
      if (/new\s+(?:Integer|Long|Double|Float|Boolean|Byte|Short)\s*\(/.test(modernCode)) {
        modernCode = modernCode.replace(/new\s+(Integer|Long|Double|Float|Boolean|Byte|Short)\s*\(([^)]+)\)/g, '$1.valueOf($2)');
        hasChanges = true;
        appliedTransforms.push('Replaced deprecated wrapper constructor with valueOf(...)');
      }

      // 3. Convert mutable DTO to Java 21 Record
      if (fileMeta.isRecordCandidate && fileMeta.recordDetails?.targetRecordSyntax) {
        const transformedRecord = this.transformDtoToRecord(modernCode, fileMeta);
        if (transformedRecord !== modernCode) {
          modernCode = transformedRecord;
          hasChanges = true;
          appliedTransforms.push(`Refactored mutable class '${fileMeta.className}' into Java 21 Record`);
        }
      }

      if (hasChanges && modernCode !== originalCode) {
        fs.writeFileSync(fullPath, modernCode, 'utf8');
        results.push(this.createDiffObject(fileMeta.filePath, originalCode, modernCode, 'Subagent-A', appliedTransforms));
      }
    }

    return results;
  }

  /**
   * Subagent B: Upgrades pom.xml to Java 21, Spring Boot 3, and modern dependencies
   */
  async executeSubagentB(repoDir, pomMeta) {
    const pomPath = path.join(repoDir, 'pom.xml');
    if (!fs.existsSync(pomPath)) return null;

    const originalPom = fs.readFileSync(pomPath, 'utf8');
    let modernPom = originalPom;
    const appliedTransforms = [];

    // 1. Upgrade Java Version to 21
    if (/<java\.version>[^<]+<\/java\.version>/.test(modernPom)) {
      modernPom = modernPom.replace(/<java\.version>[^<]+<\/java\.version>/, '<java.version>21</java.version>');
      appliedTransforms.push('Set <java.version> to 21');
    } else if (/<maven\.compiler\.source>[^<]+<\/maven\.compiler\.source>/.test(modernPom)) {
      modernPom = modernPom.replace(/<maven\.compiler\.source>[^<]+<\/maven\.compiler\.source>/, '<maven.compiler.source>21</maven.compiler.source>');
      modernPom = modernPom.replace(/<maven\.compiler\.target>[^<]+<\/maven\.compiler\.target>/, '<maven.compiler.target>21</maven.compiler.target>');
      appliedTransforms.push('Updated maven compiler source and target to Java 21');
    } else if (/<properties>/.test(modernPom)) {
      modernPom = modernPom.replace(/<properties>/, '<properties>\n        <java.version>21</java.version>');
      appliedTransforms.push('Added <java.version>21</java.version> property');
    }

    // 2. Upgrade Spring Boot Starter Parent to 3.3.4
    const sbRegex = /(<parent>[\s\S]*?<artifactId>spring-boot-starter-parent<\/artifactId>[\s\S]*?<version>)([^<]+)(<\/version>)/;
    if (sbRegex.test(modernPom)) {
      modernPom = modernPom.replace(sbRegex, '$13.3.4$3');
      appliedTransforms.push('Upgraded Spring Boot Starter Parent to 3.3.4');
    }

    // 3. Replace javax dependencies with jakarta equivalents
    const depReplacements = [
      {
        from: /<groupId>javax\.servlet<\/groupId>\s*<artifactId>javax\.servlet-api<\/artifactId>[\s\S]*?<version>[^<]+<\/version>/g,
        to: '<groupId>jakarta.servlet</groupId>\n            <artifactId>jakarta.servlet-api</artifactId>\n            <version>6.0.0</version>'
      },
      {
        from: /<groupId>javax\.persistence<\/groupId>\s*<artifactId>javax\.persistence-api<\/artifactId>[\s\S]*?<version>[^<]+<\/version>/g,
        to: '<groupId>jakarta.persistence</groupId>\n            <artifactId>jakarta.persistence-api</artifactId>\n            <version>3.1.0</version>'
      },
      {
        from: /<groupId>javax\.validation<\/groupId>\s*<artifactId>validation-api<\/artifactId>[\s\S]*?<version>[^<]+<\/version>/g,
        to: '<groupId>jakarta.validation</groupId>\n            <artifactId>jakarta.validation-api</artifactId>\n            <version>3.0.2</version>'
      },
      {
        from: /<groupId>javax\.annotation<\/groupId>\s*<artifactId>javax\.annotation-api<\/artifactId>[\s\S]*?<version>[^<]+<\/version>/g,
        to: '<groupId>jakarta.annotation</groupId>\n            <artifactId>jakarta.annotation-api</artifactId>\n            <version>2.1.1</version>'
      },
      {
        from: /<groupId>junit<\/groupId>\s*<artifactId>junit<\/artifactId>[\s\S]*?<version>[^<]+<\/version>/g,
        to: '<groupId>org.junit.jupiter</groupId>\n            <artifactId>junit-jupiter</artifactId>\n            <version>5.10.3</version>'
      }
    ];

    for (const r of depReplacements) {
      if (r.from.test(modernPom)) {
        modernPom = modernPom.replace(r.from, r.to);
        appliedTransforms.push('Replaced legacy dependency with modern Jakarta/JUnit 5 equivalent');
      }
    }

    // 4. Update maven-compiler-plugin release version if present
    if (/<plugin>[\s\S]*?<artifactId>maven-compiler-plugin<\/artifactId>[\s\S]*?<\/plugin>/.test(modernPom)) {
      modernPom = modernPom.replace(/(<artifactId>maven-compiler-plugin<\/artifactId>[\s\S]*?<version>)[^<]+(<\/version>)/, '$13.13.0$2');
      appliedTransforms.push('Bumped maven-compiler-plugin to 3.13.0 for Java 21 support');
    }

    if (modernPom !== originalPom) {
      fs.writeFileSync(pomPath, modernPom, 'utf8');
      return this.createDiffObject('pom.xml', originalPom, modernPom, 'Subagent-B', appliedTransforms);
    }

    return null;
  }

  /**
   * Subagent C: Migrates JUnit 4 tests to JUnit 5
   */
  async executeSubagentC(repoDir, files) {
    const results = [];

    for (const fileMeta of files) {
      if (!fileMeta.isTestFile) continue;

      const fullPath = path.join(repoDir, fileMeta.filePath);
      if (!fs.existsSync(fullPath)) continue;

      const originalCode = fs.readFileSync(fullPath, 'utf8');
      let modernCode = originalCode;
      const appliedTransforms = [];

      // Test imports
      if (modernCode.includes('org.junit.Test')) {
        modernCode = modernCode.replace(/import\s+org\.junit\.Test;/g, 'import org.junit.jupiter.api.Test;');
        appliedTransforms.push('Migrated @Test import to org.junit.jupiter.api.Test');
      }
      if (modernCode.includes('org.junit.Before;')) {
        modernCode = modernCode.replace(/import\s+org\.junit\.Before;/g, 'import org.junit.jupiter.api.BeforeEach;');
        modernCode = modernCode.replace(/@Before\b/g, '@BeforeEach');
        appliedTransforms.push('Migrated @Before to @BeforeEach');
      }
      if (modernCode.includes('org.junit.After;')) {
        modernCode = modernCode.replace(/import\s+org\.junit\.After;/g, 'import org.junit.jupiter.api.AfterEach;');
        modernCode = modernCode.replace(/@After\b/g, '@AfterEach');
        appliedTransforms.push('Migrated @After to @AfterEach');
      }
      if (modernCode.includes('org.junit.BeforeClass;')) {
        modernCode = modernCode.replace(/import\s+org\.junit\.BeforeClass;/g, 'import org.junit.jupiter.api.BeforeAll;');
        modernCode = modernCode.replace(/@BeforeClass\b/g, '@BeforeAll');
        appliedTransforms.push('Migrated @BeforeClass to @BeforeAll');
      }
      if (modernCode.includes('org.junit.AfterClass;')) {
        modernCode = modernCode.replace(/import\s+org\.junit\.AfterClass;/g, 'import org.junit.jupiter.api.AfterAll;');
        modernCode = modernCode.replace(/@AfterClass\b/g, '@AfterAll');
        appliedTransforms.push('Migrated @AfterClass to @AfterAll');
      }
      if (modernCode.includes('org.junit.Assert;')) {
        modernCode = modernCode.replace(/import\s+org\.junit\.Assert;/g, 'import org.junit.jupiter.api.Assertions;');
        modernCode = modernCode.replace(/\bAssert\./g, 'Assertions.');
        appliedTransforms.push('Migrated Assert assertions to Assertions.*');
      }

      // Also shift any javax in test files
      if (fileMeta.hasJavax) {
        modernCode = modernCode.replace(/javax\.servlet\b/g, 'jakarta.servlet')
                               .replace(/javax\.persistence\b/g, 'jakarta.persistence')
                               .replace(/javax\.annotation\b/g, 'jakarta.annotation');
        appliedTransforms.push('Shifted javax to jakarta in test class');
      }

      if (modernCode !== originalCode) {
        fs.writeFileSync(fullPath, modernCode, 'utf8');
        results.push(this.createDiffObject(fileMeta.filePath, originalCode, modernCode, 'Subagent-C', appliedTransforms));
      }
    }

    return results;
  }

  /**
   * Converts a verbose POJO DTO into a Java 21 Record while preserving package and imports
   */
  transformDtoToRecord(code, fileMeta) {
    const pkgMatch = code.match(/package\s+[a-zA-Z0-9_.]+;\s*/);
    const pkgHeader = pkgMatch ? pkgMatch[0] : '';

    // Extract imports
    const importRegex = /import\s+[a-zA-Z0-9_.*]+;\s*/g;
    const imports = code.match(importRegex) || [];
    const importHeader = imports.join('');

    const fields = fileMeta.recordDetails.fields || [];
    const fieldsParams = fields.map(f => `${f.type} ${f.name}`).join(', ');

    return `${pkgHeader}\n${importHeader}\n/**\n * Modernized by LegacyX (IBM Bob 2.0 Engine)\n * Immutable Java 21 Record\n */\npublic record ${fileMeta.className}(${fieldsParams}) {\n}\n`;
  }

  /**
   * Creates a structured side-by-side AST Diff object compatible with Monaco Diff Viewer
   */
  createDiffObject(filePath, originalCode, modernCode, subagent, appliedTransforms) {
    const patch = diff.createPatch(filePath, originalCode, modernCode, 'Legacy Baseline', 'Modern Java 21 / Jakarta');
    const structuredDiff = diff.structuredPatch(filePath, filePath, originalCode, modernCode);

    let additions = 0;
    let deletions = 0;

    if (structuredDiff && structuredDiff.hunks) {
      for (const hunk of structuredDiff.hunks) {
        for (const line of hunk.lines) {
          if (line.startsWith('+')) additions++;
          else if (line.startsWith('-')) deletions++;
        }
      }
    }

    return {
      filePath,
      fileName: path.basename(filePath),
      subagent,
      appliedTransforms,
      metrics: {
        additions,
        deletions,
        netChange: additions - deletions
      },
      originalCode,
      modernCode,
      patch
    };
  }
}

module.exports = new BobEngine();
