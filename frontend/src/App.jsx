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
import { ToastProvider, useToast } from './components/ToastNotification';
import api from './api';
import { Layers } from 'lucide-react';

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
    setScanStep('Provisioning isolated sandbox…');
    setRefactorResult(null);
    setBuildResult(null);
    setDeliveryResult(null);
    setEvents([]);

    const evId = addEvent('scan', 'Pre-Flight Scan', `Scanning ${repoUrl}`);

    try {
      setTimeout(() => setScanStep('Cloning codebase & parsing Java ASTs…'), 800);
      setTimeout(() => setScanStep('Cross-referencing CVE intelligence (OSV)…'), 1800);
      setTimeout(() => setScanStep('Computing Modernization Risk Score…'), 2600);

      const data = await api.scanRepo(repoUrl, branch, token);

      if (data.success) {
        setScanData(data);
        setSandboxId(data.sandboxId);
        resolveEvent(evId, 'done', `Risk score: ${data.scorecard?.modernizationRiskScore}/100 • ${data.astSummary?.totalFiles} files scanned`);
        toast({
          type: 'success',
          title: 'Pre-Flight Scan Complete',
          message: `${data.astSummary?.totalFiles} Java files scanned. Risk score: ${data.scorecard?.modernizationRiskScore}/100 (${data.scorecard?.riskLevel})`,
        });
      } else {
        resolveEvent(evId, 'error', data.error);
        toast({ type: 'error', title: 'Scan Failed', message: data.error || 'Unknown error from backend.' });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      resolveEvent(evId, 'error', msg);
      toast({ type: 'error', title: 'Scan Error', message: msg });
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  // ── Bob 2.0 Refactor handler ──────────────────────────────────────────
  const handleRunRefactor = async () => {
    if (!sandboxId) return;
    setIsRefactoring(true);

    const evId = addEvent('refactor', 'Bob 2.0 Agent Refactoring', 'Running Subagents A, B, C…');

    try {
      const data = await api.refactor(sandboxId);
      if (data.success) {
        setRefactorResult(data.refactorResult);
        resolveEvent(evId, 'done', `${data.refactorResult?.totalFilesModified} files modified, ${data.refactorResult?.diffs?.length} diffs generated`);
        toast({
          type: 'success',
          title: 'Modernization Complete',
          message: `${data.refactorResult?.totalFilesModified} files refactored across ${data.refactorResult?.diffs?.length} diffs.`,
        });
      } else {
        resolveEvent(evId, 'error', data.error);
        toast({ type: 'error', title: 'Refactoring Failed', message: data.error || 'Unknown error.' });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      resolveEvent(evId, 'error', msg);
      toast({ type: 'error', title: 'Refactor Error', message: msg });
    } finally {
      setIsRefactoring(false);
    }
  };

  // ── Build-Test Loop handler ───────────────────────────────────────────
  const handleRunBuild = async () => {
    if (!sandboxId) return;
    setIsBuilding(true);

    const evId = addEvent('build', 'Autonomous Build-Test Loop', 'Running mvn clean test…');

    try {
      const data = await api.buildTest(sandboxId);
      if (data.success) {
        setBuildResult(data.buildResult);
        const passed = data.buildResult?.buildPassed;
        resolveEvent(evId, passed ? 'done' : 'error', passed ? 'BUILD SUCCESS — all tests passed' : 'BUILD FAILED');
        toast({
          type: passed ? 'success' : 'warning',
          title: passed ? 'Build Passed ✓' : 'Build Failed',
          message: passed
            ? `All ${data.buildResult?.loopHistory?.[0]?.testsRun?.total ?? '?'} regression tests passed.`
            : `Build loop failed after ${data.buildResult?.attemptsTotal} attempt(s).`,
        });
      } else {
        resolveEvent(evId, 'error', data.error);
        toast({ type: 'error', title: 'Build Error', message: data.error || 'Unknown error.' });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      resolveEvent(evId, 'error', msg);
      toast({ type: 'error', title: 'Build Error', message: msg });
    } finally {
      setIsBuilding(false);
    }
  };

  // ── Deliver handler ───────────────────────────────────────────────────
  const handleDeliver = async () => {
    if (!sandboxId) return;
    setIsDelivering(true);

    const evId = addEvent('deliver', 'Governed Delivery', 'Creating branch & dispatching Slack card…');

    try {
      const data = await api.deliver(sandboxId);
      if (data.success) {
        setDeliveryResult(data);
        resolveEvent(evId, 'done', `Branch: ${data.branch} • Commit: ${data.commit?.commitHash?.substring(0, 8)}`);
        toast({
          type: 'success',
          title: 'Delivery Ready',
          message: `Branch feature/legacyx-modernization created. Slack approval card dispatched.`,
        });
      } else {
        resolveEvent(evId, 'error', data.error);
        toast({ type: 'error', title: 'Delivery Failed', message: data.error || 'Unknown error.' });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      resolveEvent(evId, 'error', msg);
      toast({ type: 'error', title: 'Delivery Error', message: msg });
    } finally {
      setIsDelivering(false);
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
  };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-carbon-100 text-carbon-10 flex flex-col">

      {/* ── Header ───────────────────────────────────────────────── */}
      <Header
        backendConnected={backendConnected}
        onReset={handleReset}
        isProcessing={isRunning}
        onOpenSandboxManager={() => setIsSandboxManagerOpen(true)}
      />

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6">

        {/* Repo Input */}
        <RepoInput onScan={handleScan} isScanning={isScanning} scanStep={scanStep} />

        {/* Pipeline Progress Bar — shown once any step is active */}
        {(scanData || isScanning) && (
          <PipelineProgressBar
            steps={PIPELINE_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            isRunning={isRunning}
          />
        )}

        {/* Empty State */}
        {!scanData && !isScanning && (
          <div className="bg-carbon-90 border border-carbon-80 p-12 text-center shadow-carbon my-8">
            <div className="w-16 h-16 bg-carbon-blue-60/20 text-carbon-blue-60 border border-carbon-blue-60/40 mx-auto flex items-center justify-center mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Ready to Modernize Enterprise Java Applications
            </h3>
            <p className="text-xs text-carbon-50 max-w-xl mx-auto mb-6 leading-relaxed">
              LegacyX eliminates manual Java migration risk. Enter a Git URL above or click{' '}
              <strong>[Sample Spring Boot 2 App]</strong> to calculate pre-flight risk scores, inspect
              AST diffs, and orchestrate automated Pull Requests with IBM Bob 2.0.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left text-xs font-mono">
              <div className="bg-carbon-100 p-4 border border-carbon-80">
                <div className="text-carbon-blue-60 font-bold mb-1">1. Pre-Flight Scan</div>
                <div className="text-carbon-50 text-[11px]">
                  Scans pom.xml, dependencies &amp; Java ASTs to compute risk score (0–100).
                </div>
              </div>
              <div className="bg-carbon-100 p-4 border border-carbon-80">
                <div className="text-carbon-purple-60 font-bold mb-1">2. Bob 2.0 Refactor</div>
                <div className="text-carbon-50 text-[11px]">
                  Executes Subagents A, B, C for javax→jakarta shifts and Record conversions.
                </div>
              </div>
              <div className="bg-carbon-100 p-4 border border-carbon-80">
                <div className="text-carbon-teal-50 font-bold mb-1">3. Governed Delivery</div>
                <div className="text-carbon-50 text-[11px]">
                  Build loop verification &amp; watsonx Orchestrate Slack approval cards.
                </div>
              </div>
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

        {/* Activity Timeline — shown after first action */}
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

      {/* Footer */}
      <footer className="bg-carbon-90 border-t border-carbon-80 py-4 px-6 text-center text-xs text-carbon-50 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LegacyX Modernization Platform • Powered by IBM Bob 2.0 &amp; watsonx.ai</span>
          <span className="text-carbon-60">Java 21 LTS • Spring Boot 3.3.4 • Jakarta EE 10</span>
        </div>
      </footer>
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
