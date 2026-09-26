import React from 'react';
import { ShieldAlert, X, AlertTriangle, ExternalLink, ShieldCheck, Check } from 'lucide-react';

export default function CveSecurityModal({ isOpen, onClose, vulnerabilities = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-carbon-90 border border-carbon-80 w-full max-w-4xl shadow-carbon-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-carbon-80 flex items-center justify-between bg-carbon-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-carbon-red-90 text-carbon-red-60 border border-carbon-red-60 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                Security Intelligence: Detected Enterprise CVEs ({vulnerabilities.length})
              </h3>
              <p className="text-xs text-carbon-50">
                Cross-referenced with Google OSV database & LegacyX Security Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-carbon-50 hover:text-white p-1 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3">
          {vulnerabilities.length === 0 ? (
            <div className="text-center py-8 text-carbon-50 text-xs">
              <ShieldCheck className="w-12 h-12 text-carbon-green-50 mx-auto mb-2" />
              <span>No critical or high severity CVEs detected in scanned dependencies.</span>
            </div>
          ) : (
            vulnerabilities.map((vuln, i) => (
              <div 
                key={i} 
                className="bg-carbon-100 border border-carbon-80 p-4 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${
                      vuln.severity === 'CRITICAL' ? 'bg-carbon-red-90 text-carbon-red-60 border border-carbon-red-60' :
                      'bg-carbon-orange-40/20 text-carbon-orange-40 border border-carbon-orange-40'
                    }`}>
                      {vuln.severity}
                    </span>
                    <strong className="text-white font-bold">{vuln.cve}</strong>
                    <span className="text-carbon-50">• {vuln.name}</span>
                  </div>
                  <div className="text-[11px] text-carbon-30">
                    Package: <span className="text-carbon-teal-50">{vuln.package}</span> • Installed: <span className="text-carbon-red-60">{vuln.installedVersion}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] text-carbon-50 block">Remediation Target:</span>
                  <span className="text-carbon-green-50 font-bold block">{vuln.fixedVersion}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-carbon-80 bg-carbon-100 flex items-center justify-between text-xs font-mono">
          <span className="text-carbon-50">
            Subagent B automatically bumps dependencies to secure patch versions.
          </span>
          <button
            onClick={onClose}
            className="bg-carbon-80 hover:bg-carbon-70 text-white px-4 py-1.5 cursor-pointer font-semibold"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
