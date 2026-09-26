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
    color: 'text-blue-400',
    activeBorder: 'border-blue-500',
    doneBorder: 'border-emerald-600',
    tasks: ['Scan javax.* import trees', 'Replace with jakarta.* equivalents', 'Detect mutable DTO candidates', 'Emit Java 21 record declarations'],
  },
  {
    id: 'B',
    title: 'pom.xml & OSV Vulnerability Remediation',
    description: 'Bumps Java version to 21, upgrades Spring Boot to 3.3.4, and replaces vulnerable dependencies (Log4Shell, etc.).',
    color: 'text-purple-400',
    activeBorder: 'border-purple-500',
    doneBorder: 'border-emerald-600',
    tasks: ['Parse pom.xml dependency tree', 'Apply Java 21 compiler target', 'Upgrade Spring Boot → 3.3.4', 'Patch OSV-flagged CVE libraries'],
  },
  {
    id: 'C',
    title: 'JUnit 4 → JUnit 5 Regression Suite',
    description: 'Migrates @Test, @Before, assertions to org.junit.jupiter engine and ensures regression safety.',
    color: 'text-emerald-400',
    activeBorder: 'border-emerald-500',
    doneBorder: 'border-emerald-600',
    tasks: ['Detect @RunWith / @Test JUnit 4 usages', 'Remap to JUnit Jupiter annotations', 'Convert Assert.* to Assertions.*', 'Verify @BeforeEach / @AfterEach migration'],
  },
];

function SubagentCard({ agent, status }) {
  const isDone    = status === 'done';
  const isRunning = status === 'running';

  return (
    <div className={`p-4 rounded-lg border text-xs transition-colors ${
      isDone    ? `bg-[#0B0C0E] ${agent.doneBorder}` :
      isRunning ? `bg-[#0B0C0E] ${agent.activeBorder}` :
                  'bg-[#0B0C0E] border-[#23262D]'
    }`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className={`font-mono font-semibold flex items-center gap-1.5 ${agent.color}`}>
          <Boxes className="w-3.5 h-3.5" />
          <span className="text-white">Subagent {agent.id}</span>
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1.5 ${
          isDone    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/60' :
          isRunning ? `${agent.color} bg-white/5 border border-white/10` :
                      'text-neutral-400 bg-[#16181E] border border-[#23262D]'
        }`}>
          {isDone    ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> DONE</> :
           isRunning ? <><Loader2 className="w-3 h-3 animate-spin" /> RUNNING</> :
                       'STANDBY'}
        </span>
      </div>

      <div className="font-semibold text-white text-xs mb-1">{agent.title}</div>
      <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">{agent.description}</p>

      {/* Flat solid separator */}
      <div className="h-px w-full bg-[#202227] mb-3" />

      {/* Task checklist */}
      <div className="space-y-1.5">
        {agent.tasks.map((task, i) => (
          <div key={i} className={`flex items-center gap-2 text-[11px] transition-colors ${
            isDone    ? 'text-emerald-400' :
            isRunning ? (i === 0 ? 'text-white font-medium' : 'text-neutral-400') :
                        'text-neutral-400'
          }`}>
            {isDone
              ? <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
              : isRunning && i === 0
              ? <Loader2 className="w-3 h-3 shrink-0 animate-spin text-blue-400" />
              : <div className="w-2.5 h-2.5 shrink-0 border border-[#3b3f49] rounded-sm" />
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
    <div className="rounded-xl bg-[#121418] border border-[#23262D] p-5 mb-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#202227]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-800/50 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                IBM Bob 2.0 Developer Execution Layer
                <span className="text-[11px] bg-purple-950/40 text-purple-300 border border-purple-800/50 rounded font-mono px-2 py-0.5 font-medium">
                  Multi-Agent Swarm
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
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
              ? 'bg-purple-900/40 text-white cursor-not-allowed border border-purple-700/50'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isRefactoring ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Orchestrating Subagents…</span>
            </>
          ) : refactorResult ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
        <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg overflow-hidden">
          <div className="bg-[#14161A] px-3.5 py-2 border-b border-[#23262D] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">IBM Bob 2.0 Multi-Agent Execution Log</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-emerald-400 font-medium">
                Completed in {refactorResult.durationMs}ms
              </span>
              <button 
                onClick={() => setShowLogs(!showLogs)} 
                className="text-neutral-400 hover:text-white cursor-pointer text-[11px]"
              >
                {showLogs ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>

          {showLogs && (
            <div className="p-3.5 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
              {refactorResult.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-neutral-400 text-[10px] select-none shrink-0 pt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] shrink-0 font-medium ${
                    log.status === 'SUCCESS' ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/50' :
                    log.status === 'ERROR'   ? 'text-red-300 bg-red-950/60 border border-red-800/50' :
                                              'text-blue-300 bg-blue-950/60 border border-blue-800/50'
                  }`}>
                    [{log.subagent}]
                  </span>
                  <span className={`${
                    log.status === 'SUCCESS' ? 'text-neutral-200' :
                    log.status === 'ERROR'   ? 'text-red-300' : 'text-neutral-400'
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
            { label: 'Files Modified',   value: refactorResult.totalFilesModified,    color: 'text-blue-400' },
            { label: 'Transforms',       value: refactorResult.totalTransformations,  color: 'text-purple-400' },
            { label: 'Diffs Generated',  value: refactorResult.diffs?.length || 0,    color: 'text-cyan-400' },
            { label: 'Subagents Used',   value: 3,                                    color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-2.5 text-center">
              <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value ?? '—'}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
