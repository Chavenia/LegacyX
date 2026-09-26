import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';
import { WordmarkWatermark } from '../components/WordmarkWatermark';

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
      <VideoBackground />
      <HeaderBar sceneNumber={7} sceneTitle="watsonx Slack Delivery & Governance Approval" startFrame={4950} />

      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isFinalOutro ? '0' : '0 80px',
        }}
      >
        {!isFinalOutro ? (
          /* watsonx Orchestrate & Slack Card View */
          <div
            style={{
              width: '100%',
              maxWidth: 920,
              transform: `scale(${Math.max(0, cardSpring)}) translateY(${interpolate(cardSpring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, cardSpring)),
            }}
          >
            <UseLayoutsCard
              badge="Governance Gate Approval"
              badgeColor="#c084fc"
              metric="PR #42 Ready"
              metricColor="#10b981"
              title="watsonx Orchestrate Delivery"
              footerAuthor="Enterprise Compliance Officer"
              footerRole="SOC2 / FedRAMP Verified Policy Gate"
              footerAvatar={
                <div style={{ backgroundColor: '#7c3aed', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  W
                </div>
              }
              footerRight={
                <span style={{ fontSize: 11, color: '#10b981', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                  ● 100% AUDITABLE
                </span>
              }
            >
              <div style={{ marginTop: 6 }}>
                <p style={{ fontSize: 15, color: '#E5E7EB', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Autonomous modernization pipeline executed successfully in sandbox{' '}
                  <code style={{ color: '#60a5fa', fontFamily: '"IBM Plex Mono", monospace' }}>sandbox_9843a</code>.
                  Pull request branch staged for engineering review with zero manual toil.
                </p>

                {/* Score Shift Grid */}
                <div
                  style={{
                    backgroundColor: '#0B0C0E',
                    border: '1px solid #23262D',
                    borderRadius: 8,
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                      Modernization Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 16, color: '#ef4444', textDecoration: 'line-through' }}>24</span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>98 / 100</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                      Runtime Verified
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginTop: 6 }}>
                      Java 21 LTS + Spring 3.3.4
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                      Critical CVEs Remaining
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                      0 (Resolved)
                    </div>
                  </div>
                </div>

                {/* Interactive Slack Action Buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 20px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>✓</span> Approve &amp; Merge Pull Request #42
                  </button>

                  <button
                    style={{
                      backgroundColor: '#16181E',
                      color: '#9CA3AF',
                      border: '1px solid #282B33',
                      borderRadius: 6,
                      padding: '10px 18px',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Download Security Audit PDF
                  </button>
                </div>
              </div>
            </UseLayoutsCard>
          </div>
        ) : (
          /* Grand Finale */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transform: `scale(${Math.max(0, outroSpring)})`,
              opacity: Math.max(0, Math.min(1, outroSpring)),
            }}
          >
            {/* Outro Call To Action Header */}
            <div style={{ textAlign: 'center', padding: '0 40px', marginBottom: 24 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  borderRadius: 20,
                  backgroundColor: '#14161A',
                  border: '1px solid #23262D',
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#D1D5DB', textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace' }}>
                  Enterprise Java Modernization Reimagined
                </span>
              </div>

              <h2
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  margin: '0 0 10px 0',
                }}
              >
                Zero Regressions. 100% Deterministic.
              </h2>

              <p style={{ fontSize: 18, color: '#9CA3AF', maxWidth: 740, margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Autonomous developer governance sidecar automating Java 8 &amp; 11 migration to Java 21 LTS and Spring Boot 3.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: '#121418',
                  border: '1px solid #23262D',
                  padding: '8px 20px',
                  borderRadius: 20,
                }}
              >
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>
                  Open Source on GitHub:
                </span>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, color: '#60a5fa', fontWeight: 600 }}>
                  github.com/Chavenia/LegacyX
                </span>
              </div>
            </div>

            {/* Clean Minimalist Wordmark Footer */}
            <WordmarkWatermark
              text="LegacyX"
              subtitle="Autonomous Developer Governance Sidecar"
              showNav={true}
              showCopyright={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
