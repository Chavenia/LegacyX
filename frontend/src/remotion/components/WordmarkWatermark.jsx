import React from 'react';

export const WordmarkWatermark = ({
  text = 'LegacyX',
  subtitle = 'Autonomous Developer Governance Sidecar',
  showNav = true,
  showCopyright = true,
  style = {},
  className = '',
}) => {
  const navItems = [
    'Dual-Layer Architecture',
    'Pre-Flight Risk Scanner',
    'Bob 2.0 Agent Swarm',
    'AST Diff Review',
    'Autonomous Build Loop',
    'watsonx Slack Gate',
  ];

  return (
    <footer
      className={`w-full bg-[#0E1013] border-t border-[#23262D] ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center justify-center text-center">
        {/* Brand identity */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            LX
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            {text}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1B1D22] text-neutral-400 border border-[#2B2E35]">
            v1.0.0
          </span>
        </div>

        {subtitle && (
          <p className="text-xs text-neutral-400 max-w-lg mb-6 leading-relaxed">
            {subtitle} • Enterprise Java Modernization (Java 8/11 → 21 LTS)
          </p>
        )}

        {/* Navigation links */}
        {showNav && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 border-y border-[#1E2026] w-full max-w-3xl mb-6">
            {navItems.map((item, i) => (
              <span
                key={i}
                className="text-xs text-neutral-400 hover:text-white transition-colors cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Copyright */}
        {showCopyright && (
          <div className="text-[11px] text-neutral-500 font-mono">
            © 2026 LegacyX • Autonomous Developer Governance. Deterministic AST Refactoring Engine.
          </div>
        )}
      </div>
    </footer>
  );
};
