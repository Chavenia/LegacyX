import React from 'react';
import { ShieldAlert, X, ShieldCheck } from 'lucide-react';

export default function CveSecurityModal({ isOpen, onClose, vulnerabilities = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#121418] border border-[#23262D] w-full max-w-4xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-[#23262D] flex items-center justify-between bg-[#0E1013]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-red-950/60 text-red-400 border border-red-800/60 rounded flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white font-mono">
                Security Intelligence: Detected Enterprise CVEs ({vulnerabilities.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Cross-referenced with Google OSV database &amp; LegacyX Security Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {vulnerabilities.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <span>No critical or high severity CVEs detected in scanned dependencies.</span>
            </div>
          ) : (
            vulnerabilities.map((vuln, i) => (
              <div 
                key={i} 
                className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-3 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                      vuln.severity === 'CRITICAL' ? 'bg-red-950/60 text-red-300 border border-red-800/60' :
                      'bg-orange-950/60 text-orange-300 border border-orange-800/60'
                    }`}>
                      {vuln.severity}
                    </span>
                    <strong className="text-white font-semibold">{vuln.cve}</strong>
                    <span className="text-neutral-400">• {vuln.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Package: <span className="text-blue-400">{vuln.package}</span> • Installed: <span className="text-red-400">{vuln.installedVersion}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] text-neutral-400 block">Remediation Target:</span>
                  <span className="text-emerald-400 font-medium block">{vuln.fixedVersion}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#23262D] bg-[#0E1013] flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400">
            Subagent B automatically bumps dependencies to secure patch versions.
          </span>
          <button
            onClick={onClose}
            className="bg-[#1C1F26] hover:bg-[#282B33] text-white px-3 py-1.5 rounded cursor-pointer font-medium border border-[#2E3138] transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
