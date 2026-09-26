import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const HeaderBar = ({ sceneNumber, sceneTitle, totalScenes = 7 }) => {
  const frame = useCurrentFrame();

  const minutes = Math.floor(frame / (30 * 60));
  const seconds = Math.floor((frame / 30) % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalFrames = 5400; // 3 minutes
  const progressPercent = Math.min(100, Math.max(0, (frame / totalFrames) * 100));

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        backgroundColor: 'rgba(22, 22, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #393939',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Brand logo & sidecar badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #0f62fe 0%, #8a3ffc 100%)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 20,
            color: '#fff',
            boxShadow: '0 0 16px rgba(15, 98, 254, 0.6)',
          }}
        >
          LX
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f4', letterSpacing: '-0.02em' }}>
              LegacyX
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: 'rgba(15, 98, 254, 0.2)',
                color: '#78a9ff',
                border: '1px solid rgba(15, 98, 254, 0.4)',
                letterSpacing: '0.05em',
              }}
            >
              Enterprise Java Modernization
            </span>
          </div>
        </div>
      </div>

      {/* Center scene indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#24a148',
            boxShadow: '0 0 8px #24a148',
          }}
        />
        <span style={{ fontSize: 14, color: '#c6c6c6', fontWeight: 500 }}>
          <strong style={{ color: '#0f62fe' }}>Scene {sceneNumber}/{totalScenes}:</strong> {sceneTitle}
        </span>
      </div>

      {/* Right timer & progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 14,
            color: '#a8a8a8',
            backgroundColor: '#161616',
            padding: '4px 12px',
            borderRadius: 4,
            border: '1px solid #393939',
          }}
        >
          <span style={{ color: '#00d2ff' }}>{formattedTime}</span>
          <span style={{ color: '#525252' }}>/</span>
          <span>03:00</span>
        </div>
      </div>

      {/* Bottom thin progress line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 2,
          width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, #0f62fe, #8a3ffc, #00d2ff)',
          boxShadow: '0 0 8px rgba(15, 98, 254, 0.8)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};
