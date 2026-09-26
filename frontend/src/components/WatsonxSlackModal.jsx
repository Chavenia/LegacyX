import React, { useState } from 'react';
import { 
  CheckCircle2, 
  GitPullRequest, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  MessageSquare, 
  GitBranch 
} from 'lucide-react';

export default function WatsonxSlackModal({ 
  sandboxId, 
  scanData, 
  refactorResult, 
  onDeliver, 
  isDelivering, 
  deliveryResult 
}) {
  const [copied, setCopied] = useState(false);
  const [slackActionApproved, setSlackActionApproved] = useState(false);
  const [auditRequested, setAuditRequested] = useState(false);

  if (!sandboxId) return null;

  const handleCopyBranch = () => {
    navigator.clipboard.writeText('feature/legacyx-modernization');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-[#121418] border border-[#23262D] p-5 mb-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202227]">
        <div>
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">
              Governed Delivery &amp; watsonx Orchestrate Slack Approval
            </h2>
            <span className="text-[11px] bg-purple-950/60 text-purple-300 border border-purple-800/50 font-mono px-2 py-0.5 rounded font-medium">
              Layer 3 Gateway
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Pushes transformed code to branch <code className="text-blue-400">feature/legacyx-modernization</code>, generates GitHub PR metadata, and dispatches interactive Slack Block Kit cards.
          </p>
        </div>

        {/* Deliver Button */}
        <button
          onClick={onDeliver}
          disabled={isDelivering || !refactorResult}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            isDelivering
              ? 'bg-blue-900/40 text-white cursor-not-allowed border border-blue-700/50'
              : !refactorResult
              ? 'bg-[#16181E] text-neutral-600 border border-[#23262D] cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isDelivering ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Delivering &amp; Dispatching...</span>
            </>
          ) : (
            <>
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Deliver &amp; Request Approval</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Slack Block Kit Card Preview */}
      {deliveryResult && (
        <div className="mt-4 space-y-3">
          
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              watsonx Orchestrate Interactive Slack Notification Card (#engineering-governance)
            </span>
            <span className="text-neutral-500 font-normal">Channel: #engineering-governance</span>
          </div>

          {/* Slack Message Card Box */}
          <div className="bg-[#0B0C0E] border border-[#23262D] border-l-4 border-l-purple-500 p-5 rounded-lg font-sans text-xs space-y-3.5">
            
            {/* Bot Identity Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-purple-600 flex items-center justify-center text-white text-[11px] font-bold rounded">
                LX
              </div>
              <span className="font-semibold text-white text-sm">LegacyX Sidecar</span>
              <span className="bg-[#14161A] text-neutral-400 border border-[#23262D] px-1.5 py-0.2 text-[10px] rounded font-mono font-medium">
                APP
              </span>
              <span className="text-neutral-500 text-[11px]">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Title Block */}
            <div className="text-white text-sm font-semibold">
              Automated Modernization Pull Request Ready for Approval
            </div>

            {/* Context Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-[#121418] border border-[#23262D] p-3 rounded text-[11px] font-mono">
              <div>
                <span className="text-neutral-500 block text-[10px] font-medium">TARGET REPO:</span>
                <span className="text-white font-normal truncate block mt-0.5">{scanData?.repoUrl}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] font-medium">MODERNIZATION INDEX:</span>
                <span className="text-emerald-400 font-medium block mt-0.5">{scanData?.scorecard?.modernizationIndex} / 100</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] font-medium">CVEs ELIMINATED:</span>
                <span className="text-blue-400 font-medium block mt-0.5">{scanData?.scorecard?.cveCounter?.total} CVEs</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] font-medium">FILES TRANSFORMED:</span>
                <span className="text-white font-normal block mt-0.5">{refactorResult?.totalFilesModified || 6} files</span>
              </div>
            </div>

            {/* Branch and Commit Details */}
            <div className="text-neutral-400 text-[11px] flex items-center gap-2 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" />
              <span>Branch: <strong className="text-white font-normal">feature/legacyx-modernization</strong></span>
              <span className="text-neutral-600">•</span>
              <span>Commit: <code className="bg-[#14161A] border border-[#23262D] px-1.5 py-0.5 rounded text-white">{deliveryResult?.commit?.commitHash?.substring(0, 8) || '3a03a585'}</code></span>
              <button 
                onClick={handleCopyBranch}
                className="hover:text-white ml-2 flex items-center gap-1 cursor-pointer text-blue-400"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Interactive Block Kit Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setSlackActionApproved(true)}
                disabled={slackActionApproved}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  slackActionApproved 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{slackActionApproved ? '✓ PR Approved & Merge Triggered' : 'Approve & Merge PR'}</span>
              </button>

              <button
                onClick={() => setAuditRequested(true)}
                disabled={auditRequested}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  auditRequested
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#1E2026] hover:bg-[#282B33] text-neutral-300 border border-[#2E3138]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{auditRequested ? '✓ Security Audit Dispatched' : 'Request Security Audit'}</span>
              </button>

              <a
                href={`${scanData?.repoUrl || 'https://github.com/org/repo'}/pull/new/feature/legacyx-modernization`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#14161A] hover:bg-[#1C1F26] border border-[#23262D] text-neutral-300 hover:text-white px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>

            {slackActionApproved && (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg text-emerald-300 text-[11px] font-mono flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>watsonx Orchestrate webhook fired: GitHub Pull Request auto-approved and queued for deployment pipeline.</span>
              </div>
            )}

            {auditRequested && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-lg text-amber-300 text-[11px] font-mono flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>watsonx Security audit ticket created: SecOps notification dispatched for deep AST inspection.</span>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
