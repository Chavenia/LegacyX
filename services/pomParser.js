const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

class PomParser {
  /**
   * Reads and parses a pom.xml file in the given repository path
   */
  async parsePom(repoDir) {
    const pomPath = path.join(repoDir, 'pom.xml');
    if (!fs.existsSync(pomPath)) {
      return {
        exists: false,
        isMaven: false,
        message: 'pom.xml not found (might be Gradle or non-Maven project)'
      };
    }

    const xmlContent = fs.readFileSync(pomPath, 'utf8');
    const parser = new xml2js.Parser({ explicitArray: false, trim: true });

    try {
      const result = await parser.parseStringPromise(xmlContent);
      const project = result.project || {};

      // 1. Detect Java Version
      const javaVersion = this.detectJavaVersion(project);

      // 2. Detect Spring Boot Version
      const springBootInfo = this.detectSpringBoot(project);

      // 3. Extract and categorize dependencies
      const dependencies = this.extractDependencies(project);

      // 4. Detect Javax vs Jakarta dependencies
      const javaxDeps = dependencies.filter(d => 
        (d.groupId && d.groupId.includes('javax')) || 
        (d.artifactId && d.artifactId.includes('javax'))
      );

      const jakartaDeps = dependencies.filter(d => 
        (d.groupId && d.groupId.includes('jakarta')) || 
        (d.artifactId && d.artifactId.includes('jakarta'))
      );

      // 5. Detect Test Framework (JUnit 4 vs JUnit 5)
      const testFramework = this.detectTestFramework(dependencies);

      return {
        exists: true,
        isMaven: true,
        pomPath,
        rawXml: xmlContent,
        projectInfo: {
          groupId: project.groupId || (project.parent && project.parent.groupId) || 'unknown',
          artifactId: project.artifactId || 'unknown',
          version: project.version || (project.parent && project.parent.version) || '1.0.0'
        },
        javaVersion,
        springBoot: springBootInfo,
        dependencies,
        javaxDeps,
        jakartaDeps,
        testFramework,
        compilerPlugins: this.extractPlugins(project)
      };
    } catch (err) {
      return {
        exists: true,
        isMaven: true,
        error: `Failed to parse pom.xml: ${err.message}`
      };
    }
  }

  detectJavaVersion(project) {
    const props = project.properties || {};
    let version = props['java.version'] || 
                  props['maven.compiler.source'] || 
                  props['maven.compiler.target'] || 
                  props['source'] || 
                  props['target'] || 
                  props['java.specification.version'] ||
                  null;

    // Check plugins configuration if not in properties
    if (!version && project.build && project.build.plugins) {
      const plugins = Array.isArray(project.build.plugins.plugin) 
        ? project.build.plugins.plugin 
        : [project.build.plugins.plugin].filter(Boolean);

      const compilerPlugin = plugins.find(p => p.artifactId === 'maven-compiler-plugin');
      if (compilerPlugin && compilerPlugin.configuration) {
        version = compilerPlugin.configuration.source || 
                  compilerPlugin.configuration.target || 
                  compilerPlugin.configuration.release;
      }
    }

    // Normalize version: "1.8" -> "8", "8" -> "8", "11" -> "11", "17" -> "17", "21" -> "21"
    let normalized = '8'; // default legacy assumption
    if (version) {
      const vStr = String(version).trim();
      if (vStr === '1.8' || vStr === '8') normalized = '8';
      else if (vStr === '1.7' || vStr === '7') normalized = '7';
      else if (vStr === '1.6' || vStr === '6') normalized = '6';
      else if (vStr.startsWith('11')) normalized = '11';
      else if (vStr.startsWith('17')) normalized = '17';
      else if (vStr.startsWith('21')) normalized = '21';
      else normalized = vStr;
    }

    return {
      raw: version || 'Not explicitly specified (defaults to Java 8)',
      normalized,
      isLegacy: normalized !== '21',
      targetVersion: '21 LTS'
    };
  }

  detectSpringBoot(project) {
    let version = null;
    let isSpringBoot = false;

    // Check parent
    if (project.parent && project.parent.artifactId === 'spring-boot-starter-parent') {
      isSpringBoot = true;
      version = project.parent.version;
    }

    // Check dependencies
    const deps = this.extractDependencies(project);
    const sbDep = deps.find(d => d.groupId === 'org.springframework.boot');
    if (sbDep) {
      isSpringBoot = true;
      if (!version && sbDep.version) {
        version = sbDep.version;
      }
    }

    let major = 2;
    if (version) {
      const match = String(version).match(/^(\d+)/);
      if (match) major = parseInt(match[1], 10);
    }

    return {
      isSpringBoot,
      version: version || (isSpringBoot ? '2.x (unspecified)' : null),
      major,
      isLegacy: isSpringBoot && major < 3,
      targetVersion: '3.3.4'
    };
  }

  extractDependencies(project) {
    const list = [];
    if (!project.dependencies || !project.dependencies.dependency) {
      return list;
    }

    const rawDeps = Array.isArray(project.dependencies.dependency)
      ? project.dependencies.dependency
      : [project.dependencies.dependency];

    for (const d of rawDeps) {
      if (d) {
        list.push({
          groupId: d.groupId || '',
          artifactId: d.artifactId || '',
          version: d.version || 'managed',
          scope: d.scope || 'compile'
        });
      }
    }

    return list;
  }

  detectTestFramework(dependencies) {
    const hasJUnit4 = dependencies.some(d => d.groupId === 'junit' && d.artifactId === 'junit');
    const hasJUnit5 = dependencies.some(d => d.groupId && d.groupId.includes('org.junit.jupiter'));
    const hasTestNG = dependencies.some(d => d.groupId === 'org.testng');

    let current = 'None';
    if (hasJUnit5) current = 'JUnit 5';
    else if (hasJUnit4) current = 'JUnit 4';
    else if (hasTestNG) current = 'TestNG';

    return {
      current,
      hasJUnit4,
      hasJUnit5,
      isLegacy: hasJUnit4 || (!hasJUnit5 && !hasTestNG),
      target: 'JUnit 5 (Jupiter)'
    };
  }

  extractPlugins(project) {
    const list = [];
    if (!project.build || !project.build.plugins || !project.build.plugins.plugin) {
      return list;
    }

    const rawPlugins = Array.isArray(project.build.plugins.plugin)
      ? project.build.plugins.plugin
      : [project.build.plugins.plugin];

    for (const p of rawPlugins) {
      if (p) {
        list.push({
          groupId: p.groupId || 'org.apache.maven.plugins',
          artifactId: p.artifactId || '',
          version: p.version || 'inherited'
        });
      }
    }
    return list;
  }
}

module.exports = new PomParser();
