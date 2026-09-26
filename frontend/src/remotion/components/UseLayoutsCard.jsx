import React from 'react';

/**
 * Flat clean card component used across Remotion video scenes.
 */
export const UseLayoutsCard = ({
  children,
  className = '',
  style = {},
  tag = null,
  glow = false,
  badge = null,
  showAuthor = false,
  title = null,
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl bg-[#121418] border border-[#23262D] p-6 text-neutral-200 ${className}`}
      style={{
        boxShadow: 'none',
        ...style,
      }}
    >
      {/* Header if tag or badge */}
      {(tag || badge) && (
        <div className="flex items-center justify-between mb-3 w-full">
          {tag && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 font-mono">
              {tag}
            </span>
          )}
          {badge && (
            <span className="text-xs font-mono font-medium text-neutral-400 bg-[#16181E] border border-[#23262D] px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Title if provided */}
      {title && (
        <h3 className="text-sm font-semibold text-white mb-2 font-mono">
          {title}
        </h3>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
};

export default UseLayoutsCard;
