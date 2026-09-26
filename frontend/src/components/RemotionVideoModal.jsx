import React, { useRef } from 'react';
import { Player } from '@remotion/player';
import { MainVideo } from '../remotion/MainVideo';
import { X, Terminal } from 'lucide-react';

export const RemotionVideoModal = ({ isOpen, onClose }) => {
  const playerRef = useRef(null);

  if (!isOpen) return null;

  const chapters = [
    { title: 'Intro Crisis', frame: 0, time: '0:00' },
    { title: 'Architecture', frame: 750, time: '0:25' },
    { title: 'Scan Scorecard', frame: 1500, time: '0:50' },
    { title: 'Bob 2.0 Swarm', frame: 2400, time: '1:20' },
    { title: 'Monaco AST Diff', frame: 3450, time: '1:55' },
    { title: 'Build Loop', frame: 4350, time: '2:25' },
    { title: 'watsonx Outro', frame: 4950, time: '2:45' },
  ];

  const seekTo = (frame) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          backgroundColor: '#121418',
          border: '1px solid #23262D',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            position: 'relative',
            padding: '16px 24px',
            backgroundColor: '#0E1013',
            borderBottom: '1px solid #23262D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              LX
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  LegacyX 3-Minute Video Demo
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: '#181A1F',
                    color: '#9CA3AF',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid #282B33',
                    letterSpacing: '0.04em',
                  }}
                >
                  1080P • 30 FPS
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#9CA3AF' }}>
                Full programmatic Remotion composition (5,400 frames, 3 minutes)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#16181E',
              border: '1px solid #262830',
              color: '#9CA3AF',
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

        {/* Video Player Area */}
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
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
            style={{
              width: '100%',
              aspectRatio: '16/9',
            }}
          />
        </div>

        {/* Chapter Quick-Jump Bar */}
        <div
          style={{
            position: 'relative',
            padding: '10px 20px',
            backgroundColor: '#0E1013',
            borderTop: '1px solid #23262D',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
            Jump to:
          </span>
          {chapters.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => seekTo(ch.frame)}
              style={{
                backgroundColor: '#16181E',
                border: '1px solid #262830',
                color: '#9CA3AF',
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
              <span style={{ color: '#60a5fa', fontFamily: '"IBM Plex Mono", monospace' }}>{ch.time}</span>
              <span>{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Footer / CLI Instructions */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#0A0B0D',
            borderTop: '1px solid #23262D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#6B7280',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={14} color="#60a5fa" />
            <span>Launch Studio: <code style={{ color: '#E5E7EB', backgroundColor: '#14161A', padding: '2px 6px', borderRadius: 4, border: '1px solid #23262D' }}>npm run remotion:studio</code></span>
            <span style={{ color: '#374151' }}>•</span>
            <span>Render MP4: <code style={{ color: '#E5E7EB', backgroundColor: '#14161A', padding: '2px 6px', borderRadius: 4, border: '1px solid #23262D' }}>npm run remotion:render</code></span>
          </div>

          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            Remotion v4 • 1080p 30fps
          </span>
        </div>
      </div>
    </div>
  );
};
