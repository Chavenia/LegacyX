import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  GitPullRequest, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
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
    <div className="bg-carbon-90 border border-carbon-80 p-6 shadow-carbon mb-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-carbon-80">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-carbon-purple-60" />
            <h2 className="text-base font-bold text-white">
              Governed Delivery & watsonx Orchestrate Slack Approval
            </h2>
            <span className="text-[11px] bg-carbon-purple-60/20 text-carbon-purple-60 border border-carbon-purple-60/40 font-mono px-2 py-0.5">
              Layer 3 Gateway
            </span>
          </div>
          <p className="text-xs text-carbon-50 mt-1">
            Pushes transformed code to branch <code className="text-carbon-teal-50">feature/legacyx-modernization</code>, generates GitHub PR metadata, and dispatches interactive Slack Block Kit cards.
          </p>
        </div>

        {/* Deliver Button */}
        <button
          onClick={onDeliver}
          disabled={isDelivering || !refactorResult}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
            isDelivering
              ? 'bg-carbon-blue-70 text-white cursor-not-allowed'
              : !refactorResult
              ? 'bg-carbon-80 text-carbon-50 cursor-not-allowed'
              : 'bg-carbon-blue-60 hover:bg-carbon-blue-70 text-white'
          }`}
        >
          {isDelivering ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Delivering & Dispatching...</span>
            </>
          ) : (
            <>
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Deliver & Request Slack Approval</span>
            </>
          )}
        </button>
      </div>

      {/* Simulated Interactive Slack Block Kit Card Preview */}
      {deliveryResult && (
        <div className="mt-5 space-y-4">
          
          <div className="text-xs font-mono text-carbon-30 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-carbon-green-50 animate-pulse" />
              watsonx Orchestrate Interactive Slack Notification Card (#engineering-governance)
            </span>
            <span className="text-carbon-50 font-normal">Channel: #engineering-governance</span>
          </div>

          {/* Slack Message Card Box */}
          <div className="bg-[#1b1d21] border-l-4 border-carbon-blue-60 p-5 rounded-sm shadow-md font-sans text-xs space-y-3">
            
            {/* Bot Identity Header */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-carbon-purple-60 flex items-center justify-center text-white text-[11px] font-bold rounded">
                LX
              </div>
              <span className="font-bold text-white text-sm">LegacyX Sidecar</span>
              <span className="bg-[#2c3136] text-[#abacad] px-1.5 py-0.5 text-[10px] rounded uppercase font-mono">
                APP
              </span>
              <span className="text-[#868686] text-[11px]">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Title Block */}
            <div className="text-white text-sm font-semibold">
              🚀 Automated Modernization Pull Request Ready for Approval
            </div>

            {/* Context Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#222529] p-3 rounded text-[11px] font-mono">
              <div>
                <span className="text-[#868686] block">TARGET REPO:</span>
                <span className="text-white truncate block">{scanData?.repoUrl}</span>
              </div>
              <div>
                <span className="text-[#868686] block">MODERNIZATION INDEX:</span>
                <span className="text-carbon-green-50 font-bold block">{scanData?.scorecard?.modernizationIndex} / 100</span>
              </div>
              <div>
                <span className="text-[#868686] block">CVEs ELIMINATED:</span>
                <span className="text-carbon-teal-50 font-bold block">{scanData?.scorecard?.cveCounter?.total} CVEs</span>
              </div>
              <div>
                <span className="text-[#868686] block">FILES TRANSFORMED:</span>
                <span className="text-white block">{refactorResult?.totalFilesModified || 6} files</span>
              </div>
            </div>

            {/* Branch and Commit Details */}
            <div className="text-[#abacad] text-[11px] flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-carbon-teal-50" />
              <span>Branch: <strong className="text-white">feature/legacyx-modernization</strong></span>
              <span className="text-[#868686]">|</span>
              <span>Commit: <code className="bg-[#2c3136] px-1.5 py-0.5 rounded text-white">{deliveryResult?.commit?.commitHash?.substring(0, 8) || '3a03a585'}</code></span>
              <button 
                onClick={handleCopyBranch}
                className="hover:text-white ml-2 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-carbon-green-50" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Interactive Block Kit Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSlackActionApproved(true)}
                disabled={slackActionApproved}
                className={`px-4 py-2 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-1.5 ${
                  slackActionApproved 
                    ? 'bg-carbon-green-50 text-white font-bold' 
                    : 'bg-[#007a5a] hover:bg-[#148567] text-white shadow'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{slackActionApproved ? '✓ PR Approved & Merge Triggered' : 'Approve & Merge PR'}</span>
              </button>

              <button
                onClick={() => setAuditRequested(true)}
                disabled={auditRequested}
                className={`px-4 py-2 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-1.5 ${
                  auditRequested
                    ? 'bg-carbon-orange-40 text-white font-bold'
                    : 'bg-[#e01e5a] hover:bg-[#d01850] text-white shadow'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{auditRequested ? '✓ Security Audit Dispatched' : 'Request Security Audit'}</span>
              </button>

              <a
                href={`${scanData?.repoUrl || 'https://github.com/org/repo'}/pull/new/feature/legacyx-modernization`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#2c3136] hover:bg-[#383f45] text-white px-3 py-2 text-xs rounded transition flex items-center gap-1.5"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3 text-[#abacad]" />
              </a>
            </div>

            {slackActionApproved && (
              <div className="bg-carbon-green-90/50 border border-carbon-green-50 p-2.5 rounded text-carbon-green-50 text-[11px] font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>watsonx Orchestrate webhook fired: GitHub Pull Request auto-approved and queued for deployment pipeline.</span>
              </div>
            )}

            {auditRequested && (
              <div className="bg-carbon-orange-40/20 border border-carbon-orange-40 p-2.5 rounded text-carbon-orange-40 text-[11px] font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>watsonx Security audit ticket created: SecOps notification dispatched for deep AST inspection.</span>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
