import React from 'react';
import { Player } from '@remotion/player';
import { MainVideo } from '../remotion/MainVideo';
import { X, Play, Video, Terminal } from 'lucide-react';

export const RemotionVideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          backgroundColor: '#161616',
          border: '1px solid #393939',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#1e1e1e',
            borderBottom: '1px solid #393939',
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
                background: 'linear-gradient(135deg, #0f62fe 0%, #8a3ffc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              <Video size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f4' }}>
                  LegacyX Video Demo (Remotion Player)
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: 'rgba(15, 98, 254, 0.2)',
                    color: '#78a9ff',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid rgba(15, 98, 254, 0.3)',
                  }}
                >
                  3:00 • 30 FPS • 1080p
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#8d8d8d' }}>
                Programmatic video created with Remotion (5,400 frames across 7 chapters)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#8d8d8d',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8d8d8d')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
          <Player
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

        {/* Footer / CLI Instructions */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#1e1e1e',
            borderTop: '1px solid #393939',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            color: '#8d8d8d',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={16} color="#00d2ff" />
            <span>Launch Studio: <code style={{ color: '#f4f4f4', backgroundColor: '#161616', padding: '2px 8px', borderRadius: 4 }}>npm run remotion:studio</code></span>
            <span style={{ color: '#525252' }}>•</span>
            <span>Render MP4: <code style={{ color: '#f4f4f4', backgroundColor: '#161616', padding: '2px 8px', borderRadius: 4 }}>npm run remotion:render</code></span>
          </div>

          <span style={{ fontSize: 12, color: '#6f6f6f' }}>
            Built with Remotion v4 &amp; React 18
          </span>
        </div>
      </div>
    </div>
  );
};
