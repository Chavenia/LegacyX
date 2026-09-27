import React from 'react';
import {
  ShieldAlert,
  Activity,
  Clock,
  Code2,
  ChevronRight,
  TrendingUp,
  Cpu,
  Zap
} from 'lucide-react';

// ─── Colour theme helpers ──────────────────────────────────────────────────
function getRiskBadge(level) {
  switch (level) {
    case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
    case 'HIGH':     return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'MEDIUM':   return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:         return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

function barColor(score, max) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct > 66) return 'bg-red-500';
  if (pct > 33) return 'bg-orange-400';
  return 'bg-yellow-400';
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function ModernizationScorecard({ scanData, onOpenCveModal }) {
  if (!scanData) return null;

  const scorecard   = scanData.scorecard || {};
  const runtime     = scanData.runtime || {};
  const projectInfo = scanData.projectInfo || {};
  const astSummary  = scanData.astSummary || {};
  const breakdown   = scorecard.breakdown || {};
  const cveCounter  = scorecard.cveCounter || { total: 0, critical: 0, high: 0 };

  const riskScore   = scorecard.modernizationRiskScore ?? 0;
  const modernIndex = scorecard.modernizationIndex ?? (100 - riskScore);
  const targetPlatform = scorecard.targetPlatform || 'Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10';
  const riskLevel   = scorecard.riskLevel || 'LOW';

  const javaVer       = runtime.currentJava || '8';
  const targetJavaVer = runtime.targetJava || '21 LTS';
  const springVer     = runtime.currentSpringBoot || 'v2.x';
  const targetSpringVer = runtime.targetSpringBoot || '3.3.4';

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 mb-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 mb-5 gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Modernization Readiness Scorecard
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-medium border ${getRiskBadge(riskLevel)}`}>
              {riskLevel} RISK ({riskScore}/100)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Target: <span className="text-gray-800 font-medium">{targetPlatform}</span>
            {' '}•{' '}
            Repository: <span className="text-blue-600 truncate">{scanData.repoUrl}</span>
          </p>
        </div>
        <div className="text-right text-xs font-mono text-gray-400">
          <div>Artifact: <span className="text-gray-700 font-medium">{projectInfo?.artifactId || 'java-service'}</span></div>
          <div>Version: <span className="text-gray-600">{projectInfo?.version || '1.0.0'}</span></div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">

        {/* Modernization Index */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Modernization Index</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-gray-900 font-mono">{modernIndex}<span className="text-sm font-normal text-gray-400">/100</span></div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${modernIndex}%` }} />
          </div>
        </div>

        {/* Risk Score */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Risk Score</span>
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-gray-900 font-mono">{riskScore}<span className="text-sm font-normal text-gray-400">/100</span></div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-orange-400" style={{ width: `${riskScore}%` }} />
          </div>
        </div>

        {/* Java Runtime */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Java Runtime</span>
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-1.5">
            <div className="text-xs text-red-500 font-mono line-through">Java {javaVer}</div>
            <div className="text-xl font-bold text-gray-900 font-mono flex items-center gap-1.5">
              <span>Java 21</span>
              <span className="text-xs text-blue-500 font-normal">LTS</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 font-mono">Virtual Threads &amp; Records</div>
        </div>

        {/* CVE Counter */}
        <div
          onClick={onOpenCveModal}
          className="bg-gray-50 border border-gray-200 hover:border-red-300 rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Security CVEs</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600 font-mono">{cveCounter.total ?? 0}</span>
            <span className="text-xs text-gray-400 font-mono">found</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between">
            <span>{cveCounter.critical ?? 0} Critical • {cveCounter.high ?? 0} High</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 mb-5">

        {/* Framework */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Framework</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="my-1.5">
            <div className="text-xs text-red-500 font-mono line-through truncate">{springVer}</div>
            <div className="text-xl font-bold text-gray-900 font-mono truncate">v{targetSpringVer}</div>
          </div>
          <div className="text-[11px] text-blue-600 font-mono">Spring 6 + Jakarta EE 10</div>
        </div>

        {/* Effort */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Migration Effort</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-bold text-gray-900 font-mono">{scorecard.estimatedEffortHours ?? 0} <span className="text-xs font-normal text-gray-400">Hours</span></div>
            <div className="text-xs text-emerald-600 font-mono mt-0.5">{scorecard.estimatedHoursSavedWithLegacyX ?? 0} hrs automated</div>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">88% engineering savings</div>
        </div>

        {/* AST Stats */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>AST Findings</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-1.5 space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Files:</span>
              <span className="text-gray-800 font-medium">{astSummary?.totalFiles ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">javax.* hits:</span>
              <span className="text-red-600 font-medium">{astSummary?.totalJavaxOccurrences ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Record candidates:</span>
              <span className="text-purple-600 font-medium">{astSummary?.totalRecordCandidates ?? 0}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Diagnostic breakdown bars */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          Risk Score Diagnostic Breakdown (0–100 Scale)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: '1. Java Runtime & Language EOL',
              score: breakdown.javaRuntime?.score ?? 0,
              max:   breakdown.javaRuntime?.max ?? 30,
              detail: breakdown.javaRuntime?.details?.[0] || 'Java runtime analysis',
            },
            {
              label: '2. Namespace Shift (javax.* → jakarta.*)',
              score: breakdown.namespaces?.score ?? breakdown.namespaceAndFramework?.score ?? 0,
              max:   breakdown.namespaces?.max ?? 35,
              detail: breakdown.namespaces?.details?.[0] ?? breakdown.namespaceAndFramework?.details?.[0] ?? 'javax.* namespace checks',
            },
            {
              label: '3. Spring Boot Framework Upgrade',
              score: breakdown.framework?.score ?? (breakdown.namespaceAndFramework?.score ? Math.round(breakdown.namespaceAndFramework.score / 2) : 0),
              max:   breakdown.framework?.max ?? 35,
              detail: breakdown.framework?.details?.[0] ?? breakdown.namespaceAndFramework?.details?.[1] ?? 'Spring Boot framework upgrade',
            },
            {
              label: '4. Security Vulnerabilities (OSV/CVE)',
              score: breakdown.security?.score ?? breakdown.securityVulnerabilities?.score ?? 0,
              max:   breakdown.security?.max ?? breakdown.securityVulnerabilities?.max ?? 20,
              detail: breakdown.security?.details?.[0] ?? breakdown.securityVulnerabilities?.details?.[0] ?? 'Vulnerability scanning',
            },
          ].map((item, idx) => {
            const maxVal = item.max > 0 ? item.max : 1;
            const pct = Math.min(100, Math.max(0, (item.score / maxVal) * 100));
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className="text-blue-600 font-medium">{item.score} / {item.max}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${barColor(item.score, item.max)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
