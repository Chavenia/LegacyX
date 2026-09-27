import React from 'react';
import { useCurrentFrame } from 'remotion';

export const HeaderBar = ({ sceneNumber, sceneTitle, totalScenes = 7, startFrame = 0 }) => {
  const localFrame = useCurrentFrame();
  const frame = startFrame + localFrame;

  const minutes = Math.floor(frame / (30 * 60));
  const seconds = Math.floor((frame / 30) % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalFrames = 5400;
  const progressPercent = Math.min(100, Math.max(0, (frame / totalFrames) * 100));

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 100,
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
          LegacyX
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            letterSpacing: '0.04em',
          }}
        >
          Java Modernization
        </span>
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
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
          <strong style={{ color: '#111827', fontWeight: 600 }}>Scene {sceneNumber}/{totalScenes}:</strong> {sceneTitle}
        </span>
      </div>

      {/* Right: timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 12,
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          padding: '4px 10px',
          borderRadius: 4,
          border: '1px solid #e5e7eb',
        }}
      >
        <span style={{ color: '#2563eb', fontWeight: 600 }}>{formattedTime}</span>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span>03:00</span>
      </div>

      {/* Bottom progress line */}
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
