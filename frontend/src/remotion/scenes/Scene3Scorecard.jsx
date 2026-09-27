import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';

export const Scene3Scorecard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanProgress = interpolate(frame, [0, 60], [0, 100], { extrapolateRight: 'clamp' });
  const showResults  = frame > 60;
  const gaugeScore   = Math.floor(interpolate(frame, [60, 140], [0, 24], { extrapolateRight: 'clamp' }));
  const gaugeOffset  = interpolate(frame, [60, 140], [408, 408 - (408 * 0.24)], { extrapolateRight: 'clamp' });
  const cardsSpring  = spring({ frame: frame - 75, fps, config: { damping: 12, stiffness: 80 } });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={3} sceneTitle="Pre-Flight Scan & Risk Scorecard (0–100)" startFrame={1500} />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px' }}>
        {/* Repo Input Bar */}
        <div style={{ width: '100%', maxWidth: 1500, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#9ca3af', backgroundColor: '#f9fafb', padding: '4px 10px', borderRadius: 4, border: '1px solid #e5e7eb', fontWeight: 600, textTransform: 'uppercase' }}>
              Repository Target
            </span>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, color: '#374151', backgroundColor: '#f9fafb', padding: '6px 14px', borderRadius: 6, border: '1px solid #e5e7eb', flex: 1, maxWidth: 560 }}>
              https://github.com/enterprise/account-service.git
            </span>
            <span style={{ fontSize: 12, fontFamily: '"IBM Plex Mono", monospace', color: '#9ca3af', backgroundColor: '#f9fafb', padding: '5px 10px', borderRadius: 4, border: '1px solid #e5e7eb' }}>
              branch: main
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: showResults ? '#059669' : '#2563eb', color: '#fff', fontWeight: 600, fontSize: 12, padding: '6px 14px', borderRadius: 6, fontFamily: '"IBM Plex Mono", monospace' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
              {showResults ? 'SCAN COMPLETE (AST & POM PARSED)' : `SCANNING AST (${Math.floor(scanProgress)}%)`}
            </div>
          </div>
        </div>

        {/* Scorecard */}
        {showResults && (
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, width: '100%', maxWidth: 1500, transform: `scale(${Math.max(0, cardsSpring)})`, opacity: Math.max(0, Math.min(1, cardsSpring)) }}>
            {/* Gauge Card */}
            <UseLayoutsCard badge="Pre-Flight Modernization Index" badgeColor="#ef4444" metric="24/100" metricColor="#dc2626" title="Critical Debt"
              footerAuthor="AST Pre-Flight Engine" footerRole="Scorecard based on 47 rules"
              footerAvatar={<div style={{ backgroundColor: '#dc2626', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>24</div>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 12px 0' }}>
                <div style={{ position: 'relative', width: 160, height: 160 }}>
                  <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="80" cy="80" r="65" stroke="#e5e7eb" strokeWidth="10" fill="transparent" />
                    <circle cx="80" cy="80" r="65" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="408" strokeDashoffset={gaugeOffset} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>{gaugeScore}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginTop: 2 }}>/ 100</span>
                  </div>
                </div>
                <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginTop: 8, fontFamily: '"IBM Plex Mono", monospace' }}>
                  HIGH RISK RUNTIME
                </div>
              </div>
            </UseLayoutsCard>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <UseLayoutsCard badge="Runtime Environment Shift" badgeColor="#2563eb" title="Current State vs LegacyX Target" hideDivider={true}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginTop: 6 }}>
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '14px 18px' }}>
                    <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, fontFamily: '"IBM Plex Mono", monospace' }}>CURRENT MONOLITH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Java 8 / Java 11</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Spring Boot 2.7.18 • javax.*</div>
                    <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6, fontFamily: '"IBM Plex Mono", monospace' }}>4 End-of-Life Dependencies</div>
                  </div>
                  <div style={{ fontSize: 20, color: '#7c3aed', fontWeight: 700 }}>➔</div>
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '14px 18px' }}>
                    <div style={{ fontSize: 10, color: '#059669', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, fontFamily: '"IBM Plex Mono", monospace' }}>LEGACYX TARGET</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Java 21 LTS</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Spring Boot 3.3.4 • jakarta.*</div>
                    <div style={{ fontSize: 11, color: '#059669', marginTop: 6, fontFamily: '"IBM Plex Mono", monospace' }}>Virtual Threads + Native Image</div>
                  </div>
                </div>
              </UseLayoutsCard>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <UseLayoutsCard badge="CVE Exposure" badgeColor="#ef4444" metric="4 Critical" metricColor="#dc2626" hideDivider={true}>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0 0' }}>CVSS 10.0 Log4Shell &amp; Spring4Shell identified in pom.xml dependencies.</p>
                </UseLayoutsCard>
                <UseLayoutsCard badge="Estimated Effort" badgeColor="#f97316" metric="320 hrs" metricColor="#ea580c" hideDivider={true}>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0 0' }}>Calculated developer hours for manual migration across 142 source files.</p>
                </UseLayoutsCard>
                <UseLayoutsCard badge="AST Recipe" badgeColor="#0891b2" metric="OpenRewrite" metricColor="#0891b2" hideDivider={true}>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0 0' }}>org.openrewrite.java.spring.boot3 ready for Bob 2.0 multi-agent execution.</p>
                </UseLayoutsCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
