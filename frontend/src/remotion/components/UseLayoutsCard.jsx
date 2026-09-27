import React from 'react';

/**
 * Card component used across Remotion video scenes.
 */
export const UseLayoutsCard = ({
  children,
  style = {},
  badge = null,
  badgeColor = '#9CA3AF',
  metric = null,
  metricColor = '#ffffff',
  title = null,
  hideDivider = false,
  footerAuthor = null,
  footerRole = null,
  footerAvatar = null,
  footerRight = null,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      }}
    >
      {/* Badge + Metric row */}
      {(badge || metric) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          {badge && (
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: badgeColor,
              fontFamily: '"IBM Plex Mono", monospace',
            }}>
              {badge}
            </span>
          )}
          {metric && (
            <span style={{
              fontSize: 16,
              fontWeight: 700,
              color: metricColor,
              fontFamily: '"IBM Plex Mono", monospace',
            }}>
              {metric}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      {title && (
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
          {title}
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Footer */}
      {(footerAuthor || footerRight) && (
        <>
          {!hideDivider && (
            <div style={{ height: 1, backgroundColor: '#e5e7eb', margin: '12px 0' }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {footerAvatar && (
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #e5e7eb',
                }}>
                  {footerAvatar}
                </div>
              )}
              <div>
                {footerAuthor && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{footerAuthor}</div>
                )}
                {footerRole && (
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>{footerRole}</div>
                )}
              </div>
            </div>
            {footerRight && (
              <div>{footerRight}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UseLayoutsCard;
