import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const VideoBackground = ({ glowColor = '#0f62fe' }) => {
  const frame = useCurrentFrame();

  // Subtle floating background orbs
  const orb1Y = interpolate(frame % 300, [0, 150, 300], [0, 40, 0]);
  const orb2X = interpolate(frame % 400, [0, 200, 400], [0, -50, 0]);
  const gridOpacity = interpolate(frame % 120, [0, 60, 120], [0.15, 0.25, 0.15]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#0d1117',
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(15, 98, 254, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 100% 100%, rgba(138, 63, 252, 0.12) 0%, transparent 50%),
          linear-gradient(rgba(255, 255, 255, ${gridOpacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, ${gridOpacity}) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
        overflow: 'hidden',
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Dynamic glowing orbs */}
      <div
        style={{
          position: 'absolute',
          top: `calc(10% + ${orb1Y}px)`,
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(90px)',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: `calc(10% + ${orb2X}px)`,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #8a3ffc 0%, transparent 70%)',
          filter: 'blur(100px)',
          opacity: 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Top subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 14, 23, 0.85) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
