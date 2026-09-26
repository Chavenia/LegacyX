import React from 'react';
import { useCurrentFrame } from 'remotion';

export const HeaderBar = ({ sceneNumber, sceneTitle, totalScenes = 7, startFrame = 0 }) => {
  const localFrame = useCurrentFrame();
  const frame = startFrame + localFrame;

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
        height: 60,
        backgroundColor: '#0E1013',
        borderBottom: '1px solid #23262D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 100,
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Brand logo & sidecar badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 30,
            height: 30,
            backgroundColor: '#2563eb',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            color: '#fff',
          }}
        >
          LX
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
            LegacyX
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: '#16181E',
              color: '#9CA3AF',
              border: '1px solid #262830',
              letterSpacing: '0.04em',
            }}
          >
            Autonomous Modernization Sidecar
          </span>
        </div>
      </div>

      {/* Center scene indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#10b981',
          }}
        />
        <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
          <strong style={{ color: '#ffffff', fontWeight: 600 }}>Scene {sceneNumber}/{totalScenes}:</strong> {sceneTitle}
        </span>
      </div>

      {/* Right timer & progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 12,
            color: '#9CA3AF',
            backgroundColor: '#14161A',
            padding: '4px 10px',
            borderRadius: 4,
            border: '1px solid #23262D',
          }}
        >
          <span style={{ color: '#60a5fa', fontWeight: 600 }}>{formattedTime}</span>
          <span style={{ color: '#4b5563' }}>/</span>
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
          backgroundColor: '#3b82f6',
        }}
      />
    </div>
  );
};
