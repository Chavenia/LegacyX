import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileCode,
  Boxes,
  Loader2,
  ArrowRight,
  ListChecks
} from 'lucide-react';

// Subagent definitions
const SUBAGENTS = [
  {
    id: 'A',
    title: 'javax.* → jakarta.* & Java 21 Records',
    description: 'Replaces deprecated javax servlet/persistence APIs with Jakarta EE 10 and converts mutable DTOs into compact Records.',
    color: 'text-carbon-blue-60',
    activeBorder: 'border-carbon-blue-60',
    doneBorder: 'border-carbon-green-50/40',
    tasks: ['Scan javax.* import trees', 'Replace with jakarta.* equivalents', 'Detect mutable DTO candidates', 'Emit Java 21 record declarations'],
  },
  {
    id: 'B',
    title: 'pom.xml & OSV Vulnerability Remediation',
    description: 'Bumps Java version to 21, upgrades Spring Boot to 3.3.4, and replaces vulnerable dependencies (Log4Shell, etc.).',
    color: 'text-carbon-teal-50',
    activeBorder: 'border-carbon-teal-50',
    doneBorder: 'border-carbon-green-50/40',
    tasks: ['Parse pom.xml dependency tree', 'Apply Java 21 compiler target', 'Upgrade Spring Boot → 3.3.4', 'Patch OSV-flagged CVE libraries'],
  },
  {
    id: 'C',
    title: 'JUnit 4 → JUnit 5 Regression Suite',
    description: 'Migrates @Test, @Before, assertions to org.junit.jupiter engine and ensures regression safety.',
    color: 'text-carbon-purple-60',
    activeBorder: 'border-carbon-purple-60',
    doneBorder: 'border-carbon-green-50/40',
    tasks: ['Detect @RunWith / @Test JUnit 4 usages', 'Remap to JUnit Jupiter annotations', 'Convert Assert.* to Assertions.*', 'Verify @BeforeEach / @AfterEach migration'],
  },
];

function SubagentCard({ agent, status }) {
  // status: 'standby' | 'running' | 'done'
  const isDone    = status === 'done';
  const isRunning = status === 'running';

  return (
    <div className={`p-4 border text-xs transition-all duration-500 ${
      isDone    ? `bg-carbon-100 ${agent.doneBorder}` :
      isRunning ? `bg-carbon-100 ${agent.activeBorder} shadow-sm` :
                  'bg-carbon-100 border-carbon-80 opacity-60'
    }`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className={`font-mono font-bold text-white flex items-center gap-1.5 ${agent.color}`}>
          <Boxes className="w-4 h-4" />
          <span className="text-white">Subagent {agent.id}</span>
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 font-mono font-semibold flex items-center gap-1 ${
          isDone    ? 'text-carbon-green-50 bg-carbon-green-90' :
          isRunning ? `${agent.color} bg-carbon-80` :
                      'text-carbon-60 bg-carbon-80'
        }`}>
          {isDone    ? <><CheckCircle2 className="w-3 h-3" /> DONE</> :
           isRunning ? <><Loader2 className="w-3 h-3 animate-spin" /> RUNNING</> :
                       'STANDBY'}
        </span>
      </div>
      <div className="font-semibold text-carbon-10 mb-1.5">{agent.title}</div>
      <p className="text-[11px] text-carbon-50 leading-relaxed mb-3">{agent.description}</p>

      {/* Task checklist */}
      <div className="space-y-1">
        {agent.tasks.map((task, i) => (
          <div key={i} className={`flex items-center gap-2 text-[11px] transition-colors duration-300 ${
            isDone    ? 'text-carbon-green-50' :
            isRunning ? (i === 0 ? 'text-white' : 'text-carbon-60') :
                        'text-carbon-70'
          }`}>
            {isDone
              ? <CheckCircle2 className="w-3 h-3 shrink-0" />
              : isRunning && i === 0
              ? <Loader2 className="w-3 h-3 shrink-0 animate-spin" />
              : <div className="w-3 h-3 shrink-0 border border-current rounded-full opacity-40" />
            }
            {task}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BobAgentConsole({ 
  sandboxId, 
  isRefactoring, 
  refactorResult, 
  onRunRefactor 
}) {
  const [showLogs, setShowLogs] = useState(true);
  // Simulate staggered subagent activation during a run
  const [agentStatuses, setAgentStatuses] = useState(['standby', 'standby', 'standby']);

  useEffect(() => {
    if (isRefactoring) {
      // Stagger A → B → C
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
    <div className="bg-carbon-90 border border-carbon-80 p-6 shadow-carbon mb-6">
      
      {/* ── Top Banner ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-carbon-80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-carbon-purple-60/20 text-carbon-purple-60 border border-carbon-purple-60/40 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                IBM Bob 2.0 Developer Execution Layer
                <span className="text-[11px] bg-carbon-purple-60 text-white font-mono px-2 py-0.5 font-normal">
                  Agent Mode
                </span>
              </h2>
              <p className="text-xs text-carbon-50">
                Parallel Subagents: Namespace AST Shift (A) • Dependency Modernizer (B) • JUnit 5 Synthesizer (C)
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onRunRefactor}
          disabled={isRefactoring}
          className={`flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg cursor-pointer whitespace-nowrap ${
            isRefactoring 
              ? 'bg-carbon-purple-60/50 text-white cursor-not-allowed'
              : 'bg-carbon-purple-60 hover:bg-carbon-purple-70 text-white hover:shadow-carbon-lg active:translate-y-0.5'
          }`}
        >
          {isRefactoring ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Orchestrating Subagents…</span>
            </>
          ) : refactorResult ? (
            <>
              <CheckCircle2 className="w-4 h-4 fill-current" />
              <span>Execute Governed Modernization via Bob 2.0</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Execute Governed Modernization via Bob 2.0</span>
            </>
          )}
        </button>
      </div>

      {/* ── Subagent status grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {SUBAGENTS.map((agent, i) => (
          <SubagentCard key={agent.id} agent={agent} status={agentStatuses[i]} />
        ))}
      </div>

      {/* ── Execution log ──────────────────────────────────────────── */}
      {refactorResult?.logs && (
        <div className="bg-carbon-100 border border-carbon-80">
          <div className="bg-carbon-80/50 px-4 py-2 border-b border-carbon-80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-carbon-30">
              <Terminal className="w-3.5 h-3.5 text-carbon-teal-50" />
              <span>IBM Bob 2.0 Multi-Agent Execution Log</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-carbon-green-50">
                Completed in {refactorResult.durationMs}ms
              </span>
              <button 
                onClick={() => setShowLogs(!showLogs)} 
                className="text-carbon-50 hover:text-white cursor-pointer text-[11px]"
              >
                {showLogs ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>

          {showLogs && (
            <div className="p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
              {refactorResult.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-carbon-60 text-[10px] select-none shrink-0 pt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 py-0.2 text-[10px] shrink-0 font-bold ${
                    log.status === 'SUCCESS' ? 'text-carbon-green-50 bg-carbon-green-90' :
                    log.status === 'ERROR'   ? 'text-carbon-red-60 bg-carbon-red-90' :
                                              'text-carbon-blue-60 bg-carbon-80'
                  }`}>
                    [{log.subagent}]
                  </span>
                  <span className={`${
                    log.status === 'SUCCESS' ? 'text-white font-medium' :
                    log.status === 'ERROR'   ? 'text-carbon-red-60' : 'text-carbon-30'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Result summary strip ───────────────────────────────────── */}
      {refactorResult && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Files Modified',   value: refactorResult.totalFilesModified,    color: 'text-carbon-blue-60' },
            { label: 'Transforms',       value: refactorResult.totalTransformations,  color: 'text-carbon-purple-60' },
            { label: 'Diffs Generated',  value: refactorResult.diffs?.length || 0,    color: 'text-carbon-teal-50' },
            { label: 'Subagents Used',   value: 3,                                    color: 'text-carbon-green-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-carbon-100 border border-carbon-80 p-3 text-center">
              <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value ?? '—'}</div>
              <div className="text-[11px] text-carbon-50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
