import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  Code2, 
  FileWarning, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Zap
} from 'lucide-react';

// ─── Radial Gauge SVG ──────────────────────────────────────────────────────
function RadialGauge({ value = 0, max = 100, label, color }) {
  const radius      = 46;
  const circ        = 2 * Math.PI * radius;          // ~289
  const fill        = circ - (value / max) * circ;
  const strokeColor =
    color === 'red'    ? '#da1e28' :
    color === 'orange' ? '#ff832b' :
    color === 'yellow' ? '#f1c21b' : '#24a148';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Track */}
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#393939" strokeWidth="10" />
        {/* Value arc */}
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="butt"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out', animation: 'gaugeGrow 1.2s ease-out' }}
        />
        {/* Centre value */}
        <text x="55" y="51" textAnchor="middle" fill="white" fontSize="18" fontFamily="IBM Plex Mono,monospace" fontWeight="700">
          {value}
        </text>
        <text x="55" y="66" textAnchor="middle" fill="#8d8d8d" fontSize="10" fontFamily="IBM Plex Sans,sans-serif">
          / {max}
        </text>
      </svg>
      {label && <span className="text-[11px] text-carbon-50 font-mono">{label}</span>}
    </div>
  );
}

// ─── Colour theme helpers ──────────────────────────────────────────────────
function getBadgeBg(level) {
  switch (level) {
    case 'CRITICAL': return 'bg-carbon-red-90 text-carbon-red-60 border-carbon-red-60';
    case 'HIGH':     return 'bg-carbon-orange-40/10 text-carbon-orange-40 border-carbon-orange-40';
    case 'MEDIUM':   return 'bg-carbon-yellow-30/10 text-carbon-yellow-30 border-carbon-yellow-30';
    default:         return 'bg-carbon-green-90 text-carbon-green-50 border-carbon-green-50';
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

  const { scorecard, runtime, projectInfo, astSummary } = scanData;
  const riskScore  = scorecard.modernizationRiskScore;
  const modernIndex = scorecard.modernizationIndex;

  return (
    <div className="bg-carbon-90 border border-carbon-80 p-6 shadow-carbon mb-6">
      
      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-carbon-80 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-carbon-blue-60" />
              Modernization Readiness Scorecard
            </h2>
            <span className={`text-xs px-2.5 py-0.5 font-mono font-bold border ${getBadgeBg(scorecard.riskLevel)}`}>
              {scorecard.riskLevel} RISK ({riskScore}/100)
            </span>
          </div>
          <p className="text-xs text-carbon-50 mt-1 font-mono">
            Target: <span className="text-carbon-10">{scorecard.targetPlatform}</span>
            {' '}•{' '}
            Repository: <span className="text-carbon-teal-50 truncate">{scanData.repoUrl}</span>
          </p>
        </div>
        <div className="text-right text-xs font-mono text-carbon-50">
          <div>Artifact: <span className="text-white">{projectInfo?.artifactId || 'java-service'}</span></div>
          <div>Version: <span className="text-carbon-30">{projectInfo?.version || '1.0.0'}</span></div>
        </div>
      </div>

      {/* ── Gauge + KPI grid ───────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        
        {/* Radial gauges */}
        <div className="flex items-center justify-center gap-6 shrink-0">
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
              color={gaugeColor(100 - riskScore)}   /* invert — high risk = red */
              label="Risk Score"
            />
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">

          {/* Java Runtime */}
          <div className="bg-carbon-100 border border-carbon-80 p-4 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-carbon-50 flex items-center justify-between">
              <span>Java Runtime</span>
              <Code2 className="w-3.5 h-3.5 text-carbon-blue-60" />
            </div>
            <div className="my-2">
              <div className="text-xs text-carbon-red-60 font-mono line-through">Java {runtime.currentJava}</div>
              <div className="text-2xl font-bold text-white font-mono flex items-center gap-1.5">
                <span>Java 21</span>
                <span className="text-xs text-carbon-teal-50 font-normal">LTS</span>
              </div>
            </div>
            <div className="text-[11px] text-carbon-green-50 font-mono">Virtual Threads & Records</div>
          </div>

          {/* Spring Boot */}
          <div className="bg-carbon-100 border border-carbon-80 p-4 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-carbon-50 flex items-center justify-between">
              <span>Framework</span>
              <TrendingUp className="w-3.5 h-3.5 text-carbon-green-50" />
            </div>
            <div className="my-2">
              <div className="text-xs text-carbon-red-60 font-mono line-through truncate">{runtime.currentSpringBoot || 'v2.x'}</div>
              <div className="text-2xl font-bold text-white font-mono truncate">v{runtime.targetSpringBoot}</div>
            </div>
            <div className="text-[11px] text-carbon-teal-50 font-mono">Spring 6 + Jakarta EE 10</div>
          </div>

          {/* CVE Counter */}
          <div
            onClick={onOpenCveModal}
            className="bg-carbon-100 border border-carbon-80 hover:border-carbon-red-60 p-4 flex flex-col justify-between cursor-pointer transition group col-span-2 lg:col-span-1"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-carbon-50 flex items-center justify-between">
              <span>Security CVEs</span>
              <ShieldAlert className="w-3.5 h-3.5 text-carbon-red-60 group-hover:scale-110 transition" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-carbon-red-60 font-mono">{scorecard.cveCounter.total}</span>
              <span className="text-xs text-carbon-50 font-mono">Vulnerabilities</span>
            </div>
            <div className="text-[11px] text-carbon-50 font-mono flex items-center justify-between group-hover:text-carbon-red-60">
              <span>{scorecard.cveCounter.critical} Critical • {scorecard.cveCounter.high} High</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Effort */}
          <div className="bg-carbon-100 border border-carbon-80 p-4 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-carbon-50 flex items-center justify-between">
              <span>Migration Effort</span>
              <Clock className="w-3.5 h-3.5 text-carbon-teal-50" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-white font-mono">{scorecard.estimatedEffortHours} <span className="text-xs font-normal text-carbon-50">Hours</span></div>
              <div className="text-xs text-carbon-green-50 font-mono mt-0.5">⚡ {scorecard.estimatedHoursSavedWithLegacyX} hrs automated</div>
            </div>
            <div className="text-[11px] text-carbon-30 font-mono">88% engineering savings</div>
          </div>

          {/* AST Stats */}
          <div className="bg-carbon-100 border border-carbon-80 p-4 flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-carbon-50 flex items-center justify-between">
              <span>AST Findings</span>
              <Zap className="w-3.5 h-3.5 text-carbon-yellow-30" />
            </div>
            <div className="my-2 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-carbon-50">Files:</span>
                <span className="text-white font-bold">{astSummary?.totalFiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-50">javax.* hits:</span>
                <span className="text-carbon-red-60 font-bold">{astSummary?.totalJavaxOccurrences}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-50">Record candidates:</span>
                <span className="text-carbon-purple-60 font-bold">{astSummary?.totalRecordCandidates}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Diagnostic breakdown bars ──────────────────────────────── */}
      <div className="bg-carbon-100 border border-carbon-80 p-5 mb-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-carbon-30 mb-4 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-carbon-blue-60" />
          Risk Score Diagnostic Breakdown (0–100 Scale)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: '1. Java Runtime & Language EOL',
              score: scorecard.breakdown.javaRuntime.score,
              max:   scorecard.breakdown.javaRuntime.max,
              detail: scorecard.breakdown.javaRuntime.details[0],
              barColor: 'bg-carbon-red-60',
            },
            {
              label: '2. Namespace Shift (javax.* → jakarta.*)',
              score: scorecard.breakdown.namespaceAndFramework.score,
              max:   scorecard.breakdown.namespaceAndFramework.max,
              detail: scorecard.breakdown.namespaceAndFramework.details[1] || scorecard.breakdown.namespaceAndFramework.details[0],
              barColor: 'bg-carbon-orange-40',
            },
            {
              label: '3. Known Enterprise Vulnerabilities',
              score: scorecard.breakdown.securityVulnerabilities.score,
              max:   scorecard.breakdown.securityVulnerabilities.max,
              detail: scorecard.breakdown.securityVulnerabilities.details[0],
              barColor: 'bg-carbon-red-60',
            },
            {
              label: '4. Test Suite Modernity & DTOs',
              score: scorecard.breakdown.testAndArchitecture.score,
              max:   scorecard.breakdown.testAndArchitecture.max,
              detail: scorecard.breakdown.testAndArchitecture.details[0],
              barColor: 'bg-carbon-yellow-30',
            },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-carbon-30">{item.label}</span>
                <span className="text-white font-bold">{item.score} / {item.max} pts</span>
              </div>
              <div className="w-full bg-carbon-80 h-2">
                <div
                  className={`${item.barColor} h-full transition-all duration-1000`}
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-carbon-50 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Execution plan recommendations ────────────────────────── */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-carbon-30 mb-3 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-carbon-teal-50" />
          Bob 2.0 Autonomous Modernization Execution Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scorecard.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-carbon-100 border border-carbon-80 p-3 text-xs flex flex-col justify-between hover:border-carbon-70 transition">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                    rec.priority === 'P0' ? 'bg-carbon-red-90 text-carbon-red-60 border border-carbon-red-60' :
                    rec.priority === 'P1' ? 'bg-carbon-orange-40/20 text-carbon-orange-40 border border-carbon-orange-40' :
                                           'bg-carbon-blue-60/20 text-carbon-blue-60 border border-carbon-blue-60'
                  }`}>
                    {rec.priority}
                  </span>
                  <span className="text-[11px] text-carbon-50 font-mono">
                    {idx === 0 ? 'Subagent B' : idx === 1 ? 'Subagent A' : idx === 3 ? 'Subagent A' : 'Subagent C'}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                <p className="text-carbon-50 leading-relaxed text-[11px]">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
