import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const cardsStart = 70;

  const card1Spring = spring({ frame: frame - cardsStart,      fps, config: { damping: 14, stiffness: 80 } });
  const card2Spring = spring({ frame: frame - (cardsStart+30), fps, config: { damping: 14, stiffness: 80 } });
  const card3Spring = spring({ frame: frame - (cardsStart+60), fps, config: { damping: 14, stiffness: 80 } });
  const bannerOpacity = interpolate(frame, [260, 300], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={1} sceneTitle="The Enterprise Java Modernization Challenge" startFrame={0} />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', transform: `scale(${logoSpring}) translateY(${interpolate(logoSpring, [0, 1], [30, 0])}px)`, marginBottom: 28 }}>
          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 12px 0', color: '#111827', lineHeight: 1.1 }}>
            LegacyX Modernization Engine
          </h1>
          <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 900, margin: '0 auto', lineHeight: 1.45, opacity: subtitleOpacity, fontWeight: 400 }}>
            Automating enterprise Java 8 &amp; 11 migration to <strong style={{ color: '#2563eb' }}>Java 21 LTS</strong>,{' '}
            <strong style={{ color: '#7c3aed' }}>Spring Boot 3</strong>, and <strong style={{ color: '#059669' }}>Jakarta EE</strong>.
          </p>
        </div>

        {/* 3 Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, width: '100%', maxWidth: 1500 }}>
          <div style={{ transform: `scale(${Math.max(0, card1Spring)}) translateY(${interpolate(card1Spring, [0, 1], [30, 0])}px)`, opacity: Math.max(0, Math.min(1, card1Spring)) }}>
            <UseLayoutsCard badge="Technical Debt" badgeColor="#ef4444" metric="65%+" metricColor="#dc2626" title="Trapped in Legacy Runtime"
              footerAuthor="Enterprise Architect" footerRole="Tier 1 Financial Monolith"
              footerAvatar={<div style={{ backgroundColor: '#dc2626', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>EA</div>}
            >
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.55, margin: '6px 0 14px 0' }}>
                Over 65% of enterprise workloads remain locked to Java 8/11 and Spring Boot 2 due to high manual regression risk and breaking namespace changes.
              </p>
            </UseLayoutsCard>
          </div>
          <div style={{ transform: `scale(${Math.max(0, card2Spring)}) translateY(${interpolate(card2Spring, [0, 1], [30, 0])}px)`, opacity: Math.max(0, Math.min(1, card2Spring)) }}>
            <UseLayoutsCard badge="Security Exposure" badgeColor="#f97316" metric="CVSS 10" metricColor="#ea580c" title="Critical Unpatched CVEs"
              footerAuthor="Chief Information Security Officer" footerRole="Global Payment Infrastructure"
              footerAvatar={<div style={{ backgroundColor: '#ea580c', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>SEC</div>}
            >
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.55, margin: '6px 0 14px 0' }}>
                Unpatched dependencies harbor zero-day exploits like Log4Shell (CVE-2021-44228) and Spring4Shell (CVE-2022-22965), exposing critical services to RCE.
              </p>
            </UseLayoutsCard>
          </div>
          <div style={{ transform: `scale(${Math.max(0, card3Spring)}) translateY(${interpolate(card3Spring, [0, 1], [30, 0])}px)`, opacity: Math.max(0, Math.min(1, card3Spring)) }}>
            <UseLayoutsCard badge="Migration Friction" badgeColor="#3b82f6" metric="6–18 Mo" metricColor="#2563eb" title="Prohibitive Developer Toil"
              footerAuthor="VP of Engineering" footerRole="Core Banking Systems"
              footerAvatar={<div style={{ backgroundColor: '#2563eb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>VP</div>}
            >
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.55, margin: '6px 0 14px 0' }}>
                Manual refactoring across javax.* namespaces, JUnit 5 upgrades, and Maven plugin graphs consumes hundreds of developer hours per repository.
              </p>
            </UseLayoutsCard>
          </div>
        </div>

        {/* Solution Banner */}
        <div style={{ marginTop: 24, width: '100%', maxWidth: 1500, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: bannerOpacity }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.06em', fontFamily: '"IBM Plex Mono", monospace' }}>
              SOLUTION
            </span>
            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>
              LegacyX eliminates manual toil with multi-agent AST orchestration, deterministic build loops, and governance gates.
            </span>
          </div>
          <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
            97.5% Faster Delivery
          </span>
        </div>
      </div>
    </div>
  );
};
