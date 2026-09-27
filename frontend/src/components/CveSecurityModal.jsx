import React from 'react';
import { ShieldAlert, X, ShieldCheck } from 'lucide-react';

export default function CveSecurityModal({ isOpen, onClose, vulnerabilities = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-4xl rounded-xl overflow-hidden flex flex-col max-h-[90vh] shadow-lg">

        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-red-50 text-red-500 border border-red-200 rounded flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 font-mono">
                Detected CVEs ({vulnerabilities.length})
              </h3>
              <p className="text-xs text-gray-500">
                Cross-referenced with Google OSV database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {vulnerabilities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <span>No critical or high severity CVEs detected in scanned dependencies.</span>
            </div>
          ) : (
            vulnerabilities.map((vuln, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                      vuln.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {vuln.severity}
                    </span>
                    <strong className="text-gray-900 font-semibold">{vuln.cve}</strong>
                    <span className="text-gray-500">• {vuln.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Package: <span className="text-blue-600">{vuln.package}</span> • Installed: <span className="text-red-600">{vuln.installedVersion}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] text-gray-400 block">Remediation Target:</span>
                  <span className="text-emerald-600 font-medium block">{vuln.fixedVersion}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">
            Subagent B automatically bumps dependencies to secure patch versions.
          </span>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded cursor-pointer font-medium border border-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
