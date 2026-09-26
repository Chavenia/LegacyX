import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene3Scorecard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const scanProgress = interpolate(frame, [0, 60], [0, 100], { extrapolateRight: 'clamp' });
  const showResults = frame > 60;

  // Animated gauge calculation
  const gaugeScore = Math.floor(interpolate(frame, [60, 140], [0, 24], { extrapolateRight: 'clamp' }));
  const gaugeOffset = interpolate(frame, [60, 140], [440, 440 - (440 * 0.24)], { extrapolateRight: 'clamp' });

  // Spring animation for metric cards
  const cardsSpring = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground glowColor="#da1e28" />
      <HeaderBar sceneNumber={3} sceneTitle="Pre-Flight Scan & Risk Scorecard (0–100)" />

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
          padding: '0 80px',
        }}
      >
        {/* Repo Input Simulation Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 1540,
            backgroundColor: '#1e1e1e',
            border: '1px solid #393939',
            borderRadius: 10,
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 12,
                color: '#78a9ff',
                backgroundColor: 'rgba(15, 98, 254, 0.15)',
                padding: '4px 10px',
                borderRadius: 4,
                border: '1px solid rgba(15, 98, 254, 0.3)',
              }}
            >
              REPOSITORY TARGET
            </span>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 16,
                color: '#ffffff',
                backgroundColor: '#161616',
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid #393939',
                flex: 1,
                maxWidth: 600,
              }}
            >
              https://github.com/enterprise/account-service.git
            </span>
            <span
              style={{
                fontSize: 12,
                fontFamily: '"IBM Plex Mono", monospace',
                color: '#a8a8a8',
                backgroundColor: '#262626',
                padding: '6px 12px',
                borderRadius: 4,
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
                backgroundColor: showResults ? '#198038' : '#0f62fe',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                padding: '8px 18px',
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  boxShadow: '0 0 8px #fff',
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
              gridTemplateColumns: '400px 1fr',
              gap: 28,
              width: '100%',
              maxWidth: 1540,
              transform: `scale(${Math.max(0, cardsSpring)})`,
              opacity: Math.max(0, Math.min(1, cardsSpring)),
            }}
          >
            {/* Left: Modernization Index Gauge */}
            <div
              style={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #393939',
                borderRadius: 12,
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#ff8389', letterSpacing: '0.08em', marginBottom: 16 }}>
                Pre-Flight Modernization Index
              </span>

              {/* SVG Radial Gauge */}
              <div style={{ position: 'relative', width: 200, height: 200, margin: '8px 0 20px 0' }}>
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    stroke="#393939"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    stroke="#da1e28"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="440"
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
                  <span style={{ fontSize: 52, fontWeight: 900, color: '#da1e28', lineHeight: 1 }}>
                    {gaugeScore}
                  </span>
                  <span style={{ fontSize: 14, color: '#8d8d8d', fontWeight: 600, marginTop: 4 }}>
                    / 100
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(218, 30, 40, 0.2)',
                  color: '#ff8389',
                  border: '1px solid #da1e28',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                CRITICAL REFACTORING REQUIRED
              </div>

              <p style={{ fontSize: 13, color: '#8d8d8d', margin: 0, lineHeight: 1.5 }}>
                Legacy Java 8 constructs, deprecated Spring Boot 2 APIs, and unpatched critical CVEs detected.
              </p>
            </div>

            {/* Right: Detected vs Target Runtime & CVE Analysis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Runtime Comparison Box */}
              <div
                style={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #393939',
                  borderRadius: 12,
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: 20,
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ff8389', textTransform: 'uppercase' }}>
                    Current Detected Stack
                  </span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f4f4f4', marginTop: 4 }}>
                    Java 1.8 (Java 8 LTS)
                  </div>
                  <div style={{ fontSize: 14, color: '#8d8d8d', marginTop: 4, fontFamily: '"IBM Plex Mono", monospace' }}>
                    Spring Boot 2.1.8.RELEASE • javax.*
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#262626',
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: '1px solid #525252',
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#00d2ff',
                  }}
                >
                  ➔ UPGRADE TARGET
                </div>

                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#42be65', textTransform: 'uppercase' }}>
                    Modernization Target
                  </span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#42be65', marginTop: 4 }}>
                    Java 21 LTS
                  </div>
                  <div style={{ fontSize: 14, color: '#8d8d8d', marginTop: 4, fontFamily: '"IBM Plex Mono", monospace' }}>
                    Spring Boot 3.3.4 • jakarta.* • Records
                  </div>
                </div>
              </div>

              {/* Critical CVEs Flagged & Effort Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* CVE Card */}
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #393939',
                    borderRadius: 12,
                    padding: '20px 24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ff8389', textTransform: 'uppercase' }}>
                      Security Vulnerabilities
                    </span>
                    <span style={{ backgroundColor: '#da1e28', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                      2 CRITICAL
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ backgroundColor: '#262626', padding: '10px 14px', borderRadius: 6, borderLeft: '3px solid #da1e28' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#f4f4f4' }}>
                        <span>CVE-2021-44228 (Log4Shell)</span>
                        <span style={{ color: '#ff8389' }}>CVSS 10.0</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#8d8d8d' }}>log4j-core 2.14.1 Remote Code Execution</div>
                    </div>
                    <div style={{ backgroundColor: '#262626', padding: '10px 14px', borderRadius: 6, borderLeft: '3px solid #ff832b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#f4f4f4' }}>
                        <span>CVE-2022-22965 (Spring4Shell)</span>
                        <span style={{ color: '#ffb784' }}>CVSS 9.8</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#8d8d8d' }}>spring-beans RCE via DataBinder parameter binding</div>
                    </div>
                  </div>
                </div>

                {/* Effort Savings Card */}
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #393939',
                    borderRadius: 12,
                    padding: '20px 24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#78a9ff', textTransform: 'uppercase' }}>
                      ROI &amp; Dev Savings
                    </span>
                    <span style={{ backgroundColor: '#0f62fe', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                      97.5% SAVINGS
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#c6c6c6' }}>Estimated Manual Migration:</span>
                      <strong style={{ fontSize: 16, color: '#ff8389' }}>168 Dev Hours ($25,200)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#c6c6c6' }}>LegacyX Automated Execution:</span>
                      <strong style={{ fontSize: 16, color: '#42be65' }}>4.2 Minutes ($42)</strong>
                    </div>
                    <div style={{ height: 1, backgroundColor: '#393939' }} />
                    <div style={{ fontSize: 12, color: '#a8a8a8', lineHeight: 1.4 }}>
                      ⚡ Refactoring roadmap: 14 mutable DTOs, 38 package imports, 4 Maven parents, and 12 JUnit tests.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
