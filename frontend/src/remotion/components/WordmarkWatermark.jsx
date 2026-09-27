import React from 'react';

export const WordmarkWatermark = ({
  text = 'LegacyX',
  subtitle = 'Autonomous Developer Governance Sidecar',
  showNav = true,
  showCopyright = true,
  style = {},
  className = '',
}) => {
  return (
    <footer
      className={`w-full bg-white border-t border-gray-200 ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center text-center">
        {/* Brand identity */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-base font-bold tracking-tight text-gray-900">
            {text}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-400 border border-gray-200">
            v1.0.0
          </span>
        </div>

        {subtitle && (
          <p className="text-xs text-gray-400 max-w-lg mb-4">
            Enterprise Java Modernization — Java 8/11 → 21 LTS
          </p>
        )}

        {showCopyright && (
          <div className="text-[11px] text-gray-400 font-mono">
            © 2026 LegacyX — Deterministic AST Refactoring Engine
          </div>
        )}
      </div>
    </footer>
  );
};
