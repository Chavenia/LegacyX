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

// ─── Radial Gauge SVG ──────────────────────────────────────────────────────
function RadialGauge({ value = 0, max = 100, label, color }) {
  const radius      = 46;
  const circ        = 2 * Math.PI * radius;
  const fill        = circ - (value / max) * circ;
  const strokeColor =
    color === 'red'    ? '#ef4444' :
    color === 'orange' ? '#f97316' :
    color === 'yellow' ? '#eab308' : '#10b981';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 110 110">
        {/* Track */}
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#23262D" strokeWidth="8" />
        {/* Value arc */}
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        {/* Centre value */}
        <text x="55" y="52" textAnchor="middle" fill="white" fontSize="20" fontFamily="IBM Plex Mono,monospace" fontWeight="700">
          {value}
        </text>
        <text x="55" y="67" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="IBM Plex Sans,sans-serif">
          / {max}
        </text>
      </svg>
      {label && <span className="text-[11px] text-neutral-400 font-mono mt-1">{label}</span>}
    </div>
  );
}

// ─── Colour theme helpers ──────────────────────────────────────────────────
function getBadgeBg(level) {
  switch (level) {
    case 'CRITICAL': return 'bg-red-950/40 text-red-300 border-red-800/60';
    case 'HIGH':     return 'bg-orange-950/40 text-orange-300 border-orange-800/60';
    case 'MEDIUM':   return 'bg-yellow-950/40 text-yellow-300 border-yellow-800/60';
    default:         return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60';
  }
}

function gaugeColor(score) {
  if (score < 30) return 'red';
  if (score < 55) return 'orange';
  if (score < 75) return 'yellow';
  return 'green';
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

  const javaVer = runtime.currentJava || '8';
  const targetJavaVer = runtime.targetJava || '21 LTS';
  const springVer = runtime.currentSpringBoot || 'v2.x';
  const targetSpringVer = runtime.targetSpringBoot || '3.3.4';

  return (
    <div className="rounded-xl bg-[#121418] border border-[#23262D] p-5 mb-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#202227] mb-5 gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Modernization Readiness Scorecard
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-medium border ${getBadgeBg(riskLevel)}`}>
              {riskLevel} RISK ({riskScore}/100)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Target: <span className="text-white font-medium">{targetPlatform}</span>
            {' '}•{' '}
            Repository: <span className="text-blue-400 truncate">{scanData.repoUrl}</span>
          </p>
        </div>
        <div className="text-right text-xs font-mono text-neutral-400">
          <div>Artifact: <span className="text-white font-medium">{projectInfo?.artifactId || 'java-service'}</span></div>
          <div>Version: <span className="text-neutral-300">{projectInfo?.version || '1.0.0'}</span></div>
        </div>
      </div>

      {/* Gauge + KPI grid */}
      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        
        {/* Radial gauges */}
        <div className="flex items-center justify-center gap-6 shrink-0 bg-[#0B0C0E] border border-[#23262D] rounded-lg p-4">
          <div className="flex flex-col items-center">
            <RadialGauge
              value={modernIndex}
              max={100}
              color={gaugeColor(modernIndex)}
              label="Modernization Index"
            />
          </div>
          <div className="flex flex-col items-center">
            <RadialGauge
              value={riskScore}
              max={100}
              color={gaugeColor(100 - riskScore)}
              label="Risk Score"
            />
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">

          {/* Java Runtime */}
          <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-3.5 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Java Runtime</span>
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="my-1.5">
              <div className="text-xs text-red-400 font-mono line-through">Java {javaVer}</div>
              <div className="text-xl font-bold text-white font-mono flex items-center gap-1.5">
                <span>Java 21</span>
                <span className="text-xs text-blue-400 font-normal">LTS</span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">Virtual Threads &amp; Records</div>
          </div>

          {/* Spring Boot */}
          <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-3.5 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Framework</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="my-1.5">
              <div className="text-xs text-red-400 font-mono line-through truncate">{springVer}</div>
              <div className="text-xl font-bold text-white font-mono truncate">v{targetSpringVer}</div>
            </div>
            <div className="text-[11px] text-blue-400 font-mono">Spring 6 + Jakarta EE 10</div>
          </div>

          {/* CVE Counter */}
          <div
            onClick={onOpenCveModal}
            className="bg-[#0B0C0E] border border-[#23262D] hover:border-red-600/60 rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-colors col-span-2 lg:col-span-1"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Security CVEs</span>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-400 font-mono">{cveCounter.total ?? 0}</span>
              <span className="text-xs text-neutral-400 font-mono">Vulnerabilities</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono flex items-center justify-between">
              <span>{cveCounter.critical ?? 0} Critical • {cveCounter.high ?? 0} High</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Effort */}
          <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-3.5 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Migration Effort</span>
              <Clock className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="my-1.5">
              <div className="text-xl font-bold text-white font-mono">{scorecard.estimatedEffortHours ?? 0} <span className="text-xs font-normal text-neutral-400">Hours</span></div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">⚡ {scorecard.estimatedHoursSavedWithLegacyX ?? 0} hrs automated</div>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">88% engineering savings</div>
          </div>

          {/* AST Stats */}
          <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-3.5 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>AST Findings</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-1.5 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Files:</span>
                <span className="text-white font-medium">{astSummary?.totalFiles ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">javax.* hits:</span>
                <span className="text-red-400 font-medium">{astSummary?.totalJavaxOccurrences ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Record candidates:</span>
                <span className="text-purple-400 font-medium">{astSummary?.totalRecordCandidates ?? 0}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Diagnostic breakdown bars */}
      <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
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
              barColor: 'bg-red-500',
            },
            {
              label: '2. Namespace Shift (javax.* → jakarta.*)',
              score: breakdown.namespaces?.score ?? breakdown.namespaceAndFramework?.score ?? 0,
              max:   breakdown.namespaces?.max ?? 35,
              detail: breakdown.namespaces?.details?.[0] ?? breakdown.namespaceAndFramework?.details?.[0] ?? 'javax.* namespace checks',
              barColor: 'bg-orange-500',
            },
            {
              label: '3. Spring Boot Framework Upgrade',
              score: breakdown.framework?.score ?? (breakdown.namespaceAndFramework?.score ? Math.round(breakdown.namespaceAndFramework.score / 2) : 0),
              max:   breakdown.framework?.max ?? 35,
              detail: breakdown.framework?.details?.[0] ?? breakdown.namespaceAndFramework?.details?.[1] ?? 'Spring Boot framework upgrade',
              barColor: 'bg-yellow-500',
            },
            {
              label: '4. Security Vulnerabilities (OSV/CVE)',
              score: breakdown.security?.score ?? breakdown.securityVulnerabilities?.score ?? 0,
              max:   breakdown.security?.max ?? breakdown.securityVulnerabilities?.max ?? 20,
              detail: breakdown.security?.details?.[0] ?? breakdown.securityVulnerabilities?.details?.[0] ?? 'Vulnerability scanning',
              barColor: 'bg-red-500',
            },
          ].map((item, idx) => {
            const maxVal = item.max > 0 ? item.max : 1;
            const pct = Math.min(100, Math.max(0, (item.score / maxVal) * 100));
            return (
              <div key={idx} className="bg-[#121418] border border-[#23262D] rounded p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-white font-medium">{item.label}</span>
                    <span className="text-blue-400 font-medium">{item.score} / {item.max}</span>
                  </div>
                  <div className="w-full bg-[#1A1C22] h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${item.barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
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
