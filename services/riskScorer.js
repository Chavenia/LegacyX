class RiskScorer {
  /**
   * Calculates the overall Modernization Risk Score (0-100) and scorecard metrics
   */
  calculateScore(pomData, astData, securityData) {
    let riskScore = 0;
    const breakdown = {
      javaRuntime: { score: 0, max: 30, details: [] },
      namespaceAndFramework: { score: 0, max: 35, details: [] },
      securityVulnerabilities: { score: 0, max: 20, details: [] },
      testAndArchitecture: { score: 0, max: 15, details: [] }
    };

    // 1. Java Runtime Analysis (max 30 pts)
    const javaVer = pomData?.javaVersion?.normalized || '8';
    if (javaVer === '8' || javaVer === '7' || javaVer === '6') {
      breakdown.javaRuntime.score = 30;
      breakdown.javaRuntime.details.push(`Legacy Java ${javaVer} detected. End-of-Life runtime with no modern LTS language features.`);
    } else if (javaVer === '11') {
      breakdown.javaRuntime.score = 18;
      breakdown.javaRuntime.details.push('Java 11 detected. Lacks Java 21 Virtual Threads, Records enhancements, and Pattern Matching.');
    } else if (javaVer === '17') {
      breakdown.javaRuntime.score = 8;
      breakdown.javaRuntime.details.push('Java 17 detected. Minor upgrade needed to reach target Java 21 LTS.');
    } else if (javaVer === '21') {
      breakdown.javaRuntime.score = 0;
      breakdown.javaRuntime.details.push('Target Java 21 LTS already configured.');
    } else {
      breakdown.javaRuntime.score = 20;
      breakdown.javaRuntime.details.push(`Non-standard Java version '${javaVer}'. Assumed legacy risk.`);
    }

    // 2. Namespace & Spring Boot Framework (max 35 pts)
    const isSpringBoot = pomData?.springBoot?.isSpringBoot;
    const sbMajor = pomData?.springBoot?.major;
    const javaxCount = astData?.aggregatedStats?.totalJavaxOccurrences || 0;
    const javaxFiles = astData?.aggregatedStats?.filesWithJavax || 0;

    let frameworkScore = 0;
    if (isSpringBoot) {
      if (sbMajor < 3) {
        frameworkScore += 20;
        breakdown.namespaceAndFramework.details.push(`Spring Boot ${pomData.springBoot.version} requires major overhaul to Spring Boot 3.3.4.`);
      } else {
        breakdown.namespaceAndFramework.details.push(`Spring Boot 3+ detected.`);
      }
    } else {
      frameworkScore += 10;
      breakdown.namespaceAndFramework.details.push('Non-Spring Boot enterprise stack requires manual dependency alignment.');
    }

    // Javax occurrences
    if (javaxCount > 0) {
      const javaxPenalty = Math.min(15, Math.ceil(javaxCount * 1.5));
      frameworkScore += javaxPenalty;
      breakdown.namespaceAndFramework.details.push(`${javaxCount} legacy javax.* namespace references found across ${javaxFiles} files.`);
    } else {
      breakdown.namespaceAndFramework.details.push('Clean namespace: No legacy javax.* references found.');
    }
    breakdown.namespaceAndFramework.score = Math.min(35, frameworkScore);

    // 3. Security Vulnerabilities (max 20 pts)
    const criticalCves = securityData?.critical || 0;
    const highCves = securityData?.high || 0;
    const totalCves = securityData?.totalCves || 0;

    let secScore = (criticalCves * 10) + (highCves * 4) + (totalCves > 0 ? 2 : 0);
    secScore = Math.min(20, secScore);
    breakdown.securityVulnerabilities.score = secScore;

    if (totalCves > 0) {
      breakdown.securityVulnerabilities.details.push(`${totalCves} security CVEs identified (${criticalCves} Critical, ${highCves} High).`);
    } else {
      breakdown.securityVulnerabilities.details.push('No known critical or high CVEs identified in analyzed dependencies.');
    }

    // 4. Test Framework & Architecture Debt (max 15 pts)
    let archScore = 0;
    const isJunitLegacy = pomData?.testFramework?.isLegacy || (astData?.aggregatedStats?.filesWithJUnit4 > 0);
    if (isJunitLegacy) {
      archScore += 7;
      breakdown.testAndArchitecture.details.push('JUnit 4 legacy test suite detected. Needs migration to JUnit 5 Jupiter engine.');
    } else {
      breakdown.testAndArchitecture.details.push('Modern test suite or JUnit 5 already configured.');
    }

    const recordCandidates = astData?.aggregatedStats?.totalRecordCandidates || 0;
    if (recordCandidates > 0) {
      const recordScore = Math.min(5, recordCandidates);
      archScore += recordScore;
      breakdown.testAndArchitecture.details.push(`${recordCandidates} mutable DTO classes identified as candidates for Java 21 Records.`);
    }

    const deprecatedApis = astData?.aggregatedStats?.totalDeprecatedOccurrences || 0;
    if (deprecatedApis > 0) {
      const depScore = Math.min(3, deprecatedApis);
      archScore += depScore;
      breakdown.testAndArchitecture.details.push(`${deprecatedApis} deprecated API calls (e.g. boxed primitives, legacy Date).`);
    }
    breakdown.testAndArchitecture.score = Math.min(15, archScore);

    // Aggregate total
    riskScore = breakdown.javaRuntime.score +
                breakdown.namespaceAndFramework.score +
                breakdown.securityVulnerabilities.score +
                breakdown.testAndArchitecture.score;

    riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

    // Categorization
    let riskLevel = 'LOW';
    let riskColor = '#24a148'; // Carbon Green
    if (riskScore >= 75) {
      riskLevel = 'CRITICAL';
      riskColor = '#da1e28'; // Carbon Red
    } else if (riskScore >= 50) {
      riskLevel = 'HIGH';
      riskColor = '#ff832b'; // Carbon Orange
    } else if (riskScore >= 25) {
      riskLevel = 'MEDIUM';
      riskColor = '#f1c21b'; // Carbon Yellow
    }

    // Estimated engineering effort calculation
    const loc = astData?.aggregatedStats?.totalLinesOfCode || 1000;
    const baseHours = Math.ceil(loc / 400); // 1 hr per 400 LOC baseline
    const javaxHours = Math.ceil(javaxCount * 0.4);
    const cveHours = totalCves * 1.5;
    const testHours = isJunitLegacy ? 6 : 0;
    const estimatedEffortHours = Math.max(4, Math.round(baseHours + javaxHours + cveHours + testHours));

    return {
      modernizationRiskScore: riskScore, // 0 - 100 scale (higher = more risk)
      modernizationIndex: 100 - riskScore, // 0 - 100 scale (higher = more modernized)
      riskLevel,
      riskColor,
      targetPlatform: 'Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10',
      estimatedEffortHours,
      estimatedHoursSavedWithLegacyX: Math.round(estimatedEffortHours * 0.88), // 88% automated saving
      cveCounter: {
        total: totalCves,
        critical: criticalCves,
        high: highCves
      },
      breakdown,
      recommendations: this.generateRecommendations(breakdown, pomData, astData)
    };
  }

  generateRecommendations(breakdown, pomData, astData) {
    const list = [];
    if (breakdown.javaRuntime.score > 0) {
      list.push({
        priority: 'P0',
        title: 'Upgrade Java Runtime to 21 LTS',
        description: 'Update <java.version> in pom.xml to 21, leverage Virtual Threads and pattern matching.'
      });
    }
    if (breakdown.namespaceAndFramework.score > 0) {
      list.push({
        priority: 'P0',
        title: 'Perform javax.* to jakarta.* Namespace Shift',
        description: 'Migrate javax.servlet, javax.persistence, javax.validation to modern Jakarta EE 10 packages.'
      });
      list.push({
        priority: 'P1',
        title: 'Upgrade Spring Boot to 3.3.x',
        description: 'Bump spring-boot-starter-parent to 3.3.4 and resolve deprecated configuration properties.'
      });
    }
    if (astData?.aggregatedStats?.totalRecordCandidates > 0) {
      list.push({
        priority: 'P2',
        title: 'Refactor Mutable DTOs into Java 21 Records',
        description: `Convert ${astData.aggregatedStats.totalRecordCandidates} boilerplate POJO classes into immutable records.`
      });
    }
    if (breakdown.testAndArchitecture.score > 5) {
      list.push({
        priority: 'P1',
        title: 'Migrate JUnit 4 to JUnit 5 (Jupiter)',
        description: 'Replace org.junit.Test with org.junit.jupiter.api.Test and update assertions.'
      });
    }
    return list;
  }
}

module.exports = new RiskScorer();
