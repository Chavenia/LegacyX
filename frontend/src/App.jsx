import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import RepoInput from './components/RepoInput';
import ModernizationScorecard from './components/ModernizationScorecard';
import DiffViewer from './components/DiffViewer';
import BobAgentConsole from './components/BobAgentConsole';
import BuildTestConsole from './components/BuildTestConsole';
import WatsonxSlackModal from './components/WatsonxSlackModal';
import FileAuditTable from './components/FileAuditTable';
import CveSecurityModal from './components/CveSecurityModal';
import PipelineProgressBar from './components/PipelineProgressBar';
import ActivityTimeline from './components/ActivityTimeline';
import SandboxManager from './components/SandboxManager';
import { RemotionVideoModal } from './components/RemotionVideoModal';
import { ToastProvider, useToast } from './components/ToastNotification';
import { WordmarkWatermark } from './remotion/components/WordmarkWatermark';
import api from './api';

// ─── Pipeline step definitions ────────────────────────────────────────────
const PIPELINE_STEPS = [
  { label: 'Pre-Flight Scan',    sublabel: 'AST + pom.xml + CVEs'      },
  { label: 'Bob 2.0 Refactor',   sublabel: 'Subagents A • B • C'       },
  { label: 'AST Diff Review',    sublabel: 'Side-by-Side Viewer'        },
  { label: 'Build & Test',       sublabel: 'mvn clean test loop'        },
  { label: 'Governed Delivery',  sublabel: 'Branch + Slack Approval'    },
];

// ─── Helper to derive pipeline state ─────────────────────────────────────
function getPipelineState(scanData, refactorResult, buildResult, deliveryResult) {
  const completed = [];
  let current = 0;

  if (scanData)        { completed.push(0); current = 1; }
  if (refactorResult)  { completed.push(1); current = 2; }
  if (refactorResult)  { current = 3; }           // diff review is passive
  if (buildResult)     { completed.push(2, 3); current = 4; }
  if (deliveryResult)  { completed.push(4); }

  return { completed, current };
}

// ─── Inner app that can use useToast ─────────────────────────────────────
function Dashboard() {
  const { toast } = useToast();

  // ── Core states ──────────────────────────────────────────────────────
  const [backendConnected, setBackendConnected] = useState(false);
  const [isScanning,       setIsScanning]       = useState(false);
  const [scanStep,         setScanStep]         = useState('');
  const [scanData,         setScanData]         = useState(null);
  const [sandboxId,        setSandboxId]        = useState(null);

  const [isRefactoring,    setIsRefactoring]    = useState(false);
  const [refactorResult,   setRefactorResult]   = useState(null);

  const [isBuilding,       setIsBuilding]       = useState(false);
  const [buildResult,      setBuildResult]      = useState(null);

  const [isDelivering,     setIsDelivering]     = useState(false);
  const [deliveryResult,   setDeliveryResult]   = useState(null);

  const [isCveModalOpen,       setIsCveModalOpen]       = useState(false);
  const [isSandboxManagerOpen, setIsSandboxManagerOpen] = useState(false);
  const [isVideoModalOpen,     setIsVideoModalOpen]     = useState(false);

  // Activity timeline events
  const [events, setEvents] = useState([]);
  const evtId = useRef(0);

  // ── Helpers ──────────────────────────────────────────────────────────
  const addEvent = useCallback((type, label, detail, status = 'running') => {
    const id = ++evtId.current;
    setEvents(prev => [...prev, { id, type, label, detail, status, timestamp: Date.now() }]);
    return id;
  }, []);

  const resolveEvent = useCallback((id, status = 'done', detail = null) => {
    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, status, ...(detail ? { detail } : {}) } : ev
    ));
  }, []);

  // ── Health polling ────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      const res = await api.checkHealth();
      setBackendConnected(res.connected);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Pipeline state ────────────────────────────────────────────────────
  const { completed: completedSteps, current: currentStep } =
    getPipelineState(scanData, refactorResult, buildResult, deliveryResult);

  const isRunning = isScanning || isRefactoring || isBuilding || isDelivering;

  // ── Scan handler ──────────────────────────────────────────────────────
  const handleScan = async (repoUrl, branch, token) => {
    setIsScanning(true);
    setScanStep('Allocating isolated sandbox environment…');
    setScanData(null);
    setRefactorResult(null);
    setBuildResult(null);
    setDeliveryResult(null);

    const evId = addEvent('scan', 'Repository Scan Initiated', `Target: ${repoUrl} [${branch || 'main'}]`);

    try {
      setScanStep('Cloning repository & parsing pom.xml dependencies…');
      await new Promise(r => setTimeout(r, 600));

      setScanStep('Scanning Java ASTs & identifying javax.* / Record candidates…');
      const data = await api.scanRepository(repoUrl, branch, token);

      setScanData(data);
      setSandboxId(data.sandboxId);
      setIsScanning(false);
      setScanStep('');

      resolveEvent(evId, 'done', `Calculated Risk Score: ${data.scorecard?.modernizationRiskScore ?? 0}/100`);
      toast({
        type: 'success',
        title: 'Pre-Flight Scan Complete',
        message: `Parsed ${data.astSummary?.totalFiles || 0} Java files. Modernization index: ${data.scorecard?.modernizationIndex ?? 0}/100.`,
      });
    } catch (err) {
      setIsScanning(false);
      setScanStep('');
      resolveEvent(evId, 'error', err.message);
      toast({
        type: 'error',
        title: 'Scan Failed',
        message: err.response?.data?.error || err.message || 'Failed to connect to backend',
      });
    }
  };

  // ── Refactor handler ──────────────────────────────────────────────────
  const handleRunRefactor = async () => {
    if (!sandboxId) return;
    setIsRefactoring(true);
    const evId = addEvent('refactor', 'Bob 2.0 Multi-Agent Execution', 'Executing Subagents A, B, and C');

    try {
      const res = await api.refactorSandbox(sandboxId);
      const result = res.refactorResult || res;
      setRefactorResult(result);
      setIsRefactoring(false);

      resolveEvent(evId, 'done', `Transformed ${result.totalFilesModified ?? 0} files in ${result.durationMs ?? 0}ms`);
      toast({
        type: 'success',
        title: 'Bob 2.0 Refactor Finished',
        message: `Modified ${result.totalFilesModified ?? 0} files. ${result.diffs?.length || 0} side-by-side diffs generated.`,
      });
    } catch (err) {
      setIsRefactoring(false);
      resolveEvent(evId, 'error', err.message);
      toast({
        type: 'error',
        title: 'Refactoring Failed',
        message: err.response?.data?.error || err.message,
      });
    }
  };

  // ── Build handler ─────────────────────────────────────────────────────
  const handleRunBuild = async () => {
    if (!sandboxId) return;
    setIsBuilding(true);
    const evId = addEvent('build', 'Autonomous mvn clean test Loop', 'Executing compiler and JUnit 5 regression suite');

    try {
      const res = await api.buildAndTestSandbox(sandboxId);
      const result = res.buildResult || res;
      setBuildResult(result);
      setIsBuilding(false);

      if (result.buildPassed) {
        resolveEvent(evId, 'done', 'BUILD SUCCESS: 100% tests passed on Java 21');
        toast({
          type: 'success',
          title: 'Build Verification Passed',
          message: 'Zero regressions detected. Code compiled and verified on Java 21 runtime.',
        });
      } else {
        resolveEvent(evId, 'error', 'Build loop encountered failures');
        toast({
          type: 'error',
          title: 'Build Failed',
          message: 'Compilation errors detected during verification.',
        });
      }
    } catch (err) {
      setIsBuilding(false);
      resolveEvent(evId, 'error', err.message);
      toast({
        type: 'error',
        title: 'Build Execution Failed',
        message: err.response?.data?.error || err.message,
      });
    }
  };

  // ── Deliver handler ───────────────────────────────────────────────────
  const handleDeliver = async () => {
    if (!sandboxId) return;
    setIsDelivering(true);
    const evId = addEvent('deliver', 'Staging Branch & Dispatching watsonx Slack Card', 'Branch: feature/legacyx-modernization');

    try {
      const result = await api.deliverPullRequest(sandboxId);
      setDeliveryResult(result);
      setIsDelivering(false);

      resolveEvent(evId, 'done', `Branch staged with commit ${result.commit?.commitHash?.substring(0, 8)}`);
      toast({
        type: 'success',
        title: 'Governed Delivery Dispatched',
        message: 'Pull request branch ready & watsonx Slack Block Kit approval notification fired.',
      });
    } catch (err) {
      setIsDelivering(false);
      resolveEvent(evId, 'error', err.message);
      toast({
        type: 'error',
        title: 'Delivery Failed',
        message: err.response?.data?.error || err.message,
      });
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────
  const handleReset = () => {
    setScanData(null);
    setSandboxId(null);
    setRefactorResult(null);
    setBuildResult(null);
    setDeliveryResult(null);
    setEvents([]);
    toast({ type: 'info', title: 'Dashboard Reset', message: 'Ready for new repository ingestion.' });
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0B0C0E] text-neutral-200 overflow-x-hidden">
      {/* Header */}
      <Header
        backendConnected={backendConnected}
        onReset={handleReset}
        isProcessing={isRunning}
        onOpenSandboxManager={() => setIsSandboxManagerOpen(true)}
        onOpenVideoDemo={() => setIsVideoModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 relative z-10">

        {/* Repo Input */}
        <RepoInput onScan={handleScan} isScanning={isScanning} scanStep={scanStep} />

        {/* Pipeline Progress Bar */}
        {(scanData || isScanning) && (
          <PipelineProgressBar
            steps={PIPELINE_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            isRunning={isRunning}
          />
        )}

        {/* Empty State Hero & 3 Feature Cards */}
        {!scanData && !isScanning && (
          <div className="my-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14161A] border border-[#23262D] mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold tracking-wider text-neutral-300 uppercase font-mono">
                  Autonomous Developer Governance Sidecar
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2.5">
                Ready to Modernize Enterprise Java Workloads.
              </h2>
              <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                LegacyX automates the high-risk migration of Java 8 &amp; 11 codebases to{' '}
                <strong className="text-blue-400 font-medium">Java 21 LTS</strong>,{' '}
                <strong className="text-purple-400 font-medium">Spring Boot 3.3</strong>, and{' '}
                <strong className="text-emerald-400 font-medium">Jakarta EE 10</strong> with multi-agent AST orchestration.
              </p>
            </div>

            {/* 3 Flat Clean Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              
              {/* Card 1: Pre-Flight Scan */}
              <article className="relative flex flex-col justify-between rounded-xl bg-[#121418] p-5 border border-[#23262D]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 font-mono">
                      Phase 01
                    </span>
                    <span className="text-lg font-mono font-bold text-red-400">
                      0–100
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    Pre-Flight Risk Scorecard
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Scans pom.xml dependencies, EOL runtimes, and Java AST structures to compute risk metrics and identify Log4Shell/Spring4Shell CVEs.
                  </p>
                </div>
                <div className="border-t border-[#202227] pt-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                      01
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">AST Pre-Flight Engine</div>
                      <div className="text-[11px] text-neutral-400">Automated Lexical Scanner</div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Card 2: Bob 2.0 Refactor */}
              <article className="relative flex flex-col justify-between rounded-xl bg-[#121418] p-5 border border-[#23262D]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 font-mono">
                      Phase 02
                    </span>
                    <span className="text-lg font-mono font-bold text-purple-400">
                      Swarm
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    IBM Bob 2.0 Swarm
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Autonomous subagents execute AST refactoring in parallel: Subagent Alpha (AST Records), Subagent Beta (POM), Subagent Gamma (JUnit 5).
                  </p>
                </div>
                <div className="border-t border-[#202227] pt-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                      02
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Multi-Agent Core</div>
                      <div className="text-[11px] text-neutral-400">OpenRewrite + Deterministic AST</div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Card 3: Governed Delivery */}
              <article className="relative flex flex-col justify-between rounded-xl bg-[#121418] p-5 border border-[#23262D]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                      Phase 03
                    </span>
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      100%
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    Governed Slack Delivery
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Validates code with an autonomous mvn test loop, commits to a clean branch, and sends watsonx Slack Block Kit cards for 1-click merge approvals.
                  </p>
                </div>
                <div className="border-t border-[#202227] pt-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                      03
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">watsonx Gateway</div>
                      <div className="text-[11px] text-neutral-400">Deterministic Governance Gate</div>
                    </div>
                  </div>
                </div>
              </article>

            </div>
          </div>
        )}

        {/* Modernization Scorecard */}
        {scanData && (
          <ModernizationScorecard
            scanData={scanData}
            onOpenCveModal={() => setIsCveModalOpen(true)}
          />
        )}

        {/* IBM Bob 2.0 Agent Console */}
        {scanData && (
          <BobAgentConsole
            sandboxId={sandboxId}
            isRefactoring={isRefactoring}
            refactorResult={refactorResult}
            onRunRefactor={handleRunRefactor}
          />
        )}

        {/* AST Diff Viewer */}
        {scanData && (
          <DiffViewer diffs={refactorResult?.diffs || []} />
        )}

        {/* Build-Test Console */}
        {refactorResult && (
          <BuildTestConsole
            sandboxId={sandboxId}
            isBuilding={isBuilding}
            buildResult={buildResult}
            onRunBuild={handleRunBuild}
          />
        )}

        {/* Governed Delivery & Slack */}
        {refactorResult && (
          <WatsonxSlackModal
            sandboxId={sandboxId}
            scanData={scanData}
            refactorResult={refactorResult}
            onDeliver={handleDeliver}
            isDelivering={isDelivering}
            deliveryResult={deliveryResult}
          />
        )}

        {/* File Audit Table */}
        {scanData?.files && <FileAuditTable files={scanData.files} />}

        {/* Activity Timeline */}
        {events.length > 0 && <ActivityTimeline events={events} />}

      </main>

      {/* CVE Modal */}
      <CveSecurityModal
        isOpen={isCveModalOpen}
        onClose={() => setIsCveModalOpen(false)}
        vulnerabilities={scanData?.security?.vulnerabilities || []}
      />

      {/* Sandbox Manager Panel */}
      {isSandboxManagerOpen && (
        <SandboxManager
          activeSandboxId={sandboxId}
          onSelectSandbox={(id) => {
            setSandboxId(id);
            setIsSandboxManagerOpen(false);
            toast({ type: 'info', title: 'Sandbox Switched', message: `Now using sandbox: ${id.substring(0, 20)}…` });
          }}
          onClose={() => setIsSandboxManagerOpen(false)}
        />
      )}

      {/* Remotion 3-Minute Video Demo Player Modal */}
      <RemotionVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Clean Minimalist Footer */}
      <WordmarkWatermark
        text="LegacyX"
        subtitle="Autonomous Developer Governance Sidecar"
        showNav={true}
        showCopyright={true}
        className="mt-12"
      />
    </div>
  );
}

// ─── Root: wrap with ToastProvider ───────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
