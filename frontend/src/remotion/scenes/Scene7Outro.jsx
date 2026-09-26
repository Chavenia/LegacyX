import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene7Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const outroSpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const isFinalOutro = frame > 180;

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground glowColor="#8a3ffc" />
      <HeaderBar sceneNumber={7} sceneTitle="watsonx Slack Delivery & Governance Approval" />

      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        {!isFinalOutro ? (
          /* watsonx Orchestrate & Slack Card View */
          <div
            style={{
              width: '100%',
              maxWidth: 900,
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderRadius: 14,
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              transform: `scale(${Math.max(0, cardSpring)}) translateY(${interpolate(cardSpring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, cardSpring)),
            }}
          >
            {/* Slack Notification Top Bar */}
            <div
              style={{
                backgroundColor: '#161616',
                borderBottom: '1px solid #393939',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: '#8a3ffc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#fff',
                  }}
                >
                  w
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f4' }}>
                  watsonx Orchestrate • Slack Bot
                </span>
                <span style={{ fontSize: 11, color: '#8d8d8d' }}>APP • just now</span>
              </div>

              <span
                style={{
                  fontSize: 11,
                  fontFamily: '"IBM Plex Mono", monospace',
                  backgroundColor: 'rgba(36, 161, 72, 0.2)',
                  color: '#42be65',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid rgba(36, 161, 72, 0.4)',
                }}
              >
                GOVERNANCE GATE
              </span>
            </div>

            {/* Slack Card Body */}
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>🚀</span>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  LegacyX Modernization Complete: account-service
                </h3>
              </div>

              <p style={{ fontSize: 15, color: '#c6c6c6', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                Autonomous modernization pipeline executed successfully in sandbox <code style={{ color: '#00d2ff', fontFamily: '"IBM Plex Mono", monospace' }}>sandbox_9843a</code>. Pull request branch staged for engineering review.
              </p>

              {/* Score Shift Card */}
              <div
                style={{
                  backgroundColor: '#161616',
                  border: '1px solid #393939',
                  borderRadius: 8,
                  padding: '18px 24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: '#8d8d8d', textTransform: 'uppercase', fontWeight: 700 }}>
                    Modernization Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 20, color: '#da1e28', textDecoration: 'line-through' }}>24</span>
                    <span style={{ fontSize: 28, fontWeight: 900, color: '#42be65' }}>98 / 100</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#8d8d8d', textTransform: 'uppercase', fontWeight: 700 }}>
                    Runtime Verified
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f4', marginTop: 8 }}>
                    Java 21 LTS + Spring 3.3.4
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#8d8d8d', textTransform: 'uppercase', fontWeight: 700 }}>
                    Critical CVEs Remaining
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#42be65', marginTop: 4 }}>
                    0 (Resolved)
                  </div>
                </div>
              </div>

              {/* Interactive Slack Action Buttons */}
              <div style={{ display: 'flex', gap: 14 }}>
                <button
                  style={{
                    backgroundColor: '#0f62fe',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 98, 254, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>✓</span> Approve &amp; Merge Pull Request #42
                </button>

                <button
                  style={{
                    backgroundColor: '#262626',
                    color: '#f4f4f4',
                    border: '1px solid #525252',
                    borderRadius: 6,
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Download Security Audit PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grand Outro Call To Action */
          <div
            style={{
              textAlign: 'center',
              transform: `scale(${Math.max(0, outroSpring)})`,
              opacity: Math.max(0, Math.min(1, outroSpring)),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #0f62fe 0%, #8a3ffc 100%)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 42,
                color: '#fff',
                boxShadow: '0 0 40px rgba(15, 98, 254, 0.8)',
                marginBottom: 28,
              }}
            >
              LX
            </div>

            <h1
              style={{
                fontSize: 68,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 16px 0',
                background: 'linear-gradient(135deg, #ffffff 40%, #00d2ff 70%, #8a3ffc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LegacyX
            </h1>

            <p style={{ fontSize: 24, color: '#c6c6c6', maxWidth: 840, lineHeight: 1.5, margin: '0 0 32px 0' }}>
              Autonomous Developer Governance Sidecar &amp; Enterprise Java Modernization Engine
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: '#161616',
                border: '1px solid #393939',
                padding: '12px 28px',
                borderRadius: 30,
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              <span style={{ fontSize: 16, color: '#f4f4f4', fontWeight: 600 }}>
                Open Source &amp; Enterprise Ready:
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 16, color: '#00d2ff', fontWeight: 700 }}>
                github.com/Chavenia/LegacyX
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
