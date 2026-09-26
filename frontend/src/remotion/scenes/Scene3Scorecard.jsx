import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';

export const Scene3Scorecard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const scanProgress = interpolate(frame, [0, 60], [0, 100], { extrapolateRight: 'clamp' });
  const showResults = frame > 60;

  // Animated gauge calculation
  const gaugeScore = Math.floor(interpolate(frame, [60, 140], [0, 24], { extrapolateRight: 'clamp' }));
  const gaugeOffset = interpolate(frame, [60, 140], [408, 408 - (408 * 0.24)], { extrapolateRight: 'clamp' });

  // Spring animation for metric cards
  const cardsSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={3} sceneTitle="Pre-Flight Scan & Risk Scorecard (0–100)" startFrame={1500} />

      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 80px',
        }}
      >
        {/* Repo Input Simulation Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 1500,
            backgroundColor: '#121418',
            border: '1px solid #23262D',
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 11,
                color: '#9CA3AF',
                backgroundColor: '#181A1F',
                padding: '4px 10px',
                borderRadius: 4,
                border: '1px solid #282B33',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Repository Target
            </span>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 14,
                color: '#ffffff',
                backgroundColor: '#0B0C0E',
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid #23262D',
                flex: 1,
                maxWidth: 560,
              }}
            >
              https://github.com/enterprise/account-service.git
            </span>
            <span
              style={{
                fontSize: 12,
                fontFamily: '"IBM Plex Mono", monospace',
                color: '#6B7280',
                backgroundColor: '#0B0C0E',
                padding: '5px 10px',
                borderRadius: 4,
                border: '1px solid #23262D',
              }}
            >
              branch: main
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: showResults ? '#059669' : '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: 6,
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                }}
              />
              {showResults ? 'SCAN COMPLETE (AST & POM PARSED)' : `SCANNING AST (${Math.floor(scanProgress)}%)`}
            </div>
          </div>
        </div>

        {/* Scorecard Dashboard View */}
        {showResults && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '380px 1fr',
              gap: 20,
              width: '100%',
              maxWidth: 1500,
              transform: `scale(${Math.max(0, cardsSpring)})`,
              opacity: Math.max(0, Math.min(1, cardsSpring)),
            }}
          >
            {/* Left: Modernization Index Gauge Card */}
            <UseLayoutsCard
              badge="Pre-Flight Modernization Index"
              badgeColor="#f87171"
              metric="24/100"
              metricColor="#ef4444"
              title="Critical Debt"
              footerAuthor="AST Pre-Flight Engine"
              footerRole="Scorecard based on 47 rules"
              footerAvatar={
                <div style={{ backgroundColor: '#dc2626', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  24
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 12px 0' }}>
                {/* SVG Radial Gauge */}
                <div style={{ position: 'relative', width: 160, height: 160 }}>
                  <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="#23262D"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="#ef4444"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="408"
                      strokeDashoffset={gaugeOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 40, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
                      {gaugeScore}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                      / 100
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginTop: 8,
                    fontFamily: '"IBM Plex Mono", monospace',
                  }}
                >
                  HIGH RISK RUNTIME
                </div>
              </div>
            </UseLayoutsCard>

            {/* Right: Detected vs Target Runtime & CVE Analysis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Runtime Comparison Box */}
              <UseLayoutsCard
                badge="Runtime Environment Shift"
                badgeColor="#60a5fa"
                title="Current State vs LegacyX Target"
                hideDivider={true}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: 16,
                    alignItems: 'center',
                    marginTop: 6,
                  }}
                >
                  {/* Current Legacy */}
                  <div
                    style={{
                      backgroundColor: '#0B0C0E',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: 8,
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, fontFamily: '"IBM Plex Mono", monospace' }}>
                      CURRENT MONOLITH
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Java 8 / Java 11</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Spring Boot 2.7.18 • javax.*</div>
                    <div style={{ fontSize: 11, color: '#f87171', marginTop: 6, fontFamily: '"IBM Plex Mono", monospace' }}>4 End-of-Life Dependencies</div>
                  </div>

                  <div style={{ fontSize: 20, color: '#a855f7', fontWeight: 700 }}>➔</div>

                  {/* Modernized Target */}
                  <div
                    style={{
                      backgroundColor: '#0B0C0E',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 8,
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ fontSize: 10, color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, fontFamily: '"IBM Plex Mono", monospace' }}>
                      LEGACYX TARGET
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Java 21 LTS</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Spring Boot 3.3.4 • jakarta.*</div>
                    <div style={{ fontSize: 11, color: '#34d399', marginTop: 6, fontFamily: '"IBM Plex Mono", monospace' }}>Virtual Threads + Native Image</div>
                  </div>
                </div>
              </UseLayoutsCard>

              {/* 3 Metrics Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <UseLayoutsCard
                  badge="CVE Exposure"
                  badgeColor="#f87171"
                  metric="4 Critical"
                  metricColor="#ef4444"
                  hideDivider={true}
                >
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0 0' }}>
                    CVSS 10.0 Log4Shell &amp; Spring4Shell identified in pom.xml dependencies.
                  </p>
                </UseLayoutsCard>

                <UseLayoutsCard
                  badge="Estimated Effort"
                  badgeColor="#fb923c"
                  metric="320 hrs"
                  metricColor="#f97316"
                  hideDivider={true}
                >
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0 0' }}>
                    Calculated developer hours for manual migration across 142 source files.
                  </p>
                </UseLayoutsCard>

                <UseLayoutsCard
                  badge="AST Recipe"
                  badgeColor="#38bdf8"
                  metric="OpenRewrite"
                  metricColor="#38bdf8"
                  hideDivider={true}
                >
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0 0' }}>
                    org.openrewrite.java.spring.boot3 ready for Bob 2.0 multi-agent execution.
                  </p>
                </UseLayoutsCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
