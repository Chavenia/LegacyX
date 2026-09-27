import React, { useState, useEffect } from 'react';
import {
  Play,
  Cpu,
  Terminal,
  CheckCircle2,
  Boxes,
  Loader2
} from 'lucide-react';

// Subagent definitions
const SUBAGENTS = [
  {
    id: 'A',
    title: 'javax.* → jakarta.* & Java 21 Records',
    description: 'Replaces deprecated javax servlet/persistence APIs with Jakarta EE 10 and converts mutable DTOs into compact Records.',
    color: 'text-blue-600',
    activeBorder: 'border-blue-400',
    doneBorder: 'border-emerald-500',
    tasks: ['Scan javax.* import trees', 'Replace with jakarta.* equivalents', 'Detect mutable DTO candidates', 'Emit Java 21 record declarations'],
  },
  {
    id: 'B',
    title: 'pom.xml & OSV Vulnerability Remediation',
    description: 'Bumps Java version to 21, upgrades Spring Boot to 3.3.4, and replaces vulnerable dependencies (Log4Shell, etc.).',
    color: 'text-purple-600',
    activeBorder: 'border-purple-400',
    doneBorder: 'border-emerald-500',
    tasks: ['Parse pom.xml dependency tree', 'Apply Java 21 compiler target', 'Upgrade Spring Boot → 3.3.4', 'Patch OSV-flagged CVE libraries'],
  },
  {
    id: 'C',
    title: 'JUnit 4 → JUnit 5 Regression Suite',
    description: 'Migrates @Test, @Before, assertions to org.junit.jupiter engine and ensures regression safety.',
    color: 'text-emerald-600',
    activeBorder: 'border-emerald-400',
    doneBorder: 'border-emerald-500',
    tasks: ['Detect @RunWith / @Test JUnit 4 usages', 'Remap to JUnit Jupiter annotations', 'Convert Assert.* to Assertions.*', 'Verify @BeforeEach / @AfterEach migration'],
  },
];

function SubagentCard({ agent, status }) {
  const isDone    = status === 'done';
  const isRunning = status === 'running';

  return (
    <div className={`p-4 rounded-lg border text-xs transition-colors bg-gray-50 ${
      isDone    ? agent.doneBorder :
      isRunning ? agent.activeBorder :
                  'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className={`font-mono font-semibold flex items-center gap-1.5 ${agent.color}`}>
          <Boxes className="w-3.5 h-3.5" />
          <span className="text-gray-800">Subagent {agent.id}</span>
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1.5 ${
          isDone    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
          isRunning ? `${agent.color} bg-white border border-gray-200` :
                      'text-gray-400 bg-white border border-gray-200'
        }`}>
          {isDone    ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> DONE</> :
           isRunning ? <><Loader2 className="w-3 h-3 animate-spin" /> RUNNING</> :
                       'STANDBY'}
        </span>
      </div>

      <div className="font-semibold text-gray-800 text-xs mb-1">{agent.title}</div>
      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{agent.description}</p>

      <div className="h-px w-full bg-gray-200 mb-3" />

      {/* Task checklist */}
      <div className="space-y-1.5">
        {agent.tasks.map((task, i) => (
          <div key={i} className={`flex items-center gap-2 text-[11px] transition-colors ${
            isDone    ? 'text-emerald-600' :
            isRunning ? (i === 0 ? 'text-gray-800 font-medium' : 'text-gray-400') :
                        'text-gray-400'
          }`}>
            {isDone
              ? <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
              : isRunning && i === 0
              ? <Loader2 className="w-3 h-3 shrink-0 animate-spin text-blue-500" />
              : <div className="w-2.5 h-2.5 shrink-0 border border-gray-300 rounded-sm" />
            }
            <span>{task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BobAgentConsole({
  sandboxId,
  isRefactoring,
  refactorResult: rawRefactorResult,
  onRunRefactor
}) {
  const refactorResult = rawRefactorResult?.refactorResult || rawRefactorResult;
  const [showLogs, setShowLogs] = useState(true);
  const [agentStatuses, setAgentStatuses] = useState(['standby', 'standby', 'standby']);

  useEffect(() => {
    if (isRefactoring) {
      setAgentStatuses(['running', 'standby', 'standby']);
      const t1 = setTimeout(() => setAgentStatuses(['running', 'running', 'standby']), 900);
      const t2 = setTimeout(() => setAgentStatuses(['running', 'running', 'running']), 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (refactorResult) {
      setAgentStatuses(['done', 'done', 'done']);
    } else {
      setAgentStatuses(['standby', 'standby', 'standby']);
    }
  }, [isRefactoring, refactorResult]);

  if (!sandboxId) return null;

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 mb-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                IBM Bob 2.0 Developer Execution Layer
                <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 rounded font-mono px-2 py-0.5 font-medium">
                  Multi-Agent
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Parallel Subagents: Namespace AST Shift (A) • Dependency Modernizer (B) • JUnit 5 Synthesizer (C)
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onRunRefactor}
          disabled={isRefactoring}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
            isRefactoring
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRefactoring ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Orchestrating Subagents…</span>
            </>
          ) : refactorResult ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Re-run Bob 2.0 Modernization</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Execute Modernization via Bob 2.0</span>
            </>
          )}
        </button>
      </div>

      {/* Subagent status grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-4">
        {SUBAGENTS.map((agent, i) => (
          <SubagentCard key={agent.id} agent={agent} status={agentStatuses[i]} />
        ))}
      </div>

      {/* Execution log */}
      {refactorResult?.logs && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3.5 py-2 border-b border-gray-200 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-gray-700">
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium">Bob 2.0 Execution Log</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-emerald-600 font-medium">
                Completed in {refactorResult.durationMs}ms
              </span>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer text-[11px]"
              >
                {showLogs ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>

          {showLogs && (
            <div className="p-3.5 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
              {refactorResult.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-gray-400 text-[10px] select-none shrink-0 pt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] shrink-0 font-medium ${
                    log.status === 'SUCCESS' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                    log.status === 'ERROR'   ? 'text-red-700 bg-red-50 border border-red-200' :
                                              'text-blue-700 bg-blue-50 border border-blue-200'
                  }`}>
                    [{log.subagent}]
                  </span>
                  <span className={`${
                    log.status === 'SUCCESS' ? 'text-gray-700' :
                    log.status === 'ERROR'   ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result summary strip */}
      {refactorResult && (
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: 'Files Modified',   value: refactorResult.totalFilesModified,   color: 'text-blue-600' },
            { label: 'Transforms',       value: refactorResult.totalTransformations, color: 'text-purple-600' },
            { label: 'Diffs Generated',  value: refactorResult.diffs?.length || 0,   color: 'text-cyan-600' },
            { label: 'Subagents Used',   value: 3,                                   color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center">
              <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value ?? '—'}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
