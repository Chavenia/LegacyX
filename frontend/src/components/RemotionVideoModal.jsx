import React, { useRef } from 'react';
import { Player } from '@remotion/player';
import { MainVideo } from '../remotion/MainVideo';
import { X, Terminal } from 'lucide-react';

export const RemotionVideoModal = ({ isOpen, onClose }) => {
  const playerRef = useRef(null);

  if (!isOpen) return null;

  const chapters = [
    { title: 'Intro', frame: 0, time: '0:00' },
    { title: 'Architecture', frame: 750, time: '0:25' },
    { title: 'Scan Scorecard', frame: 1500, time: '0:50' },
    { title: 'Bob 2.0 Swarm', frame: 2400, time: '1:20' },
    { title: 'AST Diff', frame: 3450, time: '1:55' },
    { title: 'Build Loop', frame: 4350, time: '2:25' },
    { title: 'Delivery', frame: 4950, time: '2:45' },
  ];

  const seekTo = (frame) => {
    if (playerRef.current) playerRef.current.seekTo(frame);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1200,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
              LegacyX Demo Video
            </span>
            <span
              style={{
                fontSize: 11,
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid #e5e7eb',
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              1080p · 30fps · 3 min
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#f4f5f7', overflow: 'hidden' }}>
          <Player
            ref={playerRef}
            component={MainVideo}
            durationInFrames={5400}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            controls
            autoPlay={false}
            loop={false}
            style={{ width: '100%', aspectRatio: '16/9' }}
          />
        </div>

        {/* Chapter Bar */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
            Jump to:
          </span>
          {chapters.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => seekTo(ch.frame)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#2563eb', fontFamily: '"IBM Plex Mono", monospace' }}>{ch.time}</span>
              <span>{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={14} color="#6b7280" />
            <span>Render: <code style={{ color: '#374151', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e7eb', fontFamily: '"IBM Plex Mono", monospace' }}>npm run remotion:render</code></span>
          </div>
          <span style={{ fontSize: 11 }}>Remotion v4 · 5400 frames</span>
        </div>
      </div>
    </div>
  );
};
