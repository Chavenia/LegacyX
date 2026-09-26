import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const cardsStart = 80;

  const card1Spring = spring({
    frame: frame - cardsStart,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const card2Spring = spring({
    frame: frame - (cardsStart + 35),
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const card3Spring = spring({
    frame: frame - (cardsStart + 70),
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const bannerOpacity = interpolate(frame, [280, 320], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground glowColor="#0f62fe" />
      <HeaderBar sceneNumber={1} sceneTitle="The Enterprise Java Modernization Crisis" />

      {/* Main Container */}
      <div
        style={{
          position: 'absolute',
          top: 100,
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
        {/* Hero Title Section */}
        <div
          style={{
            textAlign: 'center',
            transform: `scale(${logoSpring}) translateY(${interpolate(logoSpring, [0, 1], [40, 0])}px)`,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 20,
              backgroundColor: 'rgba(15, 98, 254, 0.15)',
              border: '1px solid rgba(15, 98, 254, 0.4)',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#00d2ff',
                boxShadow: '0 0 8px #00d2ff',
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#78a9ff', textTransform: 'uppercase' }}>
              Autonomous Developer Governance Sidecar
            </span>
          </div>

          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #ffffff 30%, #78a9ff 70%, #8a3ffc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 40px rgba(15, 98, 254, 0.3)',
            }}
          >
            LegacyX Modernization Engine
          </h1>

          <p
            style={{
              fontSize: 24,
              color: '#c6c6c6',
              maxWidth: 960,
              margin: '0 auto',
              lineHeight: 1.4,
              opacity: subtitleOpacity,
            }}
          >
            Automating the migration of enterprise Java 8 &amp; 11 codebases to <strong style={{ color: '#00d2ff' }}>Java 21 LTS</strong>,{' '}
            <strong style={{ color: '#00d2ff' }}>Spring Boot 3</strong>, and <strong style={{ color: '#00d2ff' }}>Jakarta EE</strong>.
          </p>
        </div>

        {/* 3 Crisis Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
            width: '100%',
            maxWidth: 1540,
            marginTop: 10,
          }}
        >
          {/* Card 1: Trapped Monoliths */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderRadius: 12,
              padding: '32px 28px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              transform: `scale(${Math.max(0, card1Spring)}) translateY(${interpolate(card1Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, card1Spring)),
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: '#da1e28',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ff8389', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Technical Debt
              </span>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#da1e28' }}>65%+</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f4', marginBottom: 12 }}>
              Trapped in Legacy Runtime
            </h3>
            <p style={{ fontSize: 15, color: '#8d8d8d', lineHeight: 1.5, margin: 0 }}>
              Over 65% of Fortune 500 enterprise workloads remain trapped on Java 8/11 and Spring Boot 2 due to complex manual refactoring risks.
            </p>
          </div>

          {/* Card 2: Security & CVE Exposure */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderRadius: 12,
              padding: '32px 28px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              transform: `scale(${Math.max(0, card2Spring)}) translateY(${interpolate(card2Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, card2Spring)),
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: '#ff832b',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffb784', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Vulnerability Exposure
              </span>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#ff832b' }}>CVSS 10.0</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f4', marginBottom: 12 }}>
              Critical Unpatched CVEs
            </h3>
            <p style={{ fontSize: 15, color: '#8d8d8d', lineHeight: 1.5, margin: 0 }}>
              Severe exploits such as Log4Shell (CVE-2021-44228) and Spring4Shell (CVE-2022-22965) leave legacy microservices vulnerable to RCE.
            </p>
          </div>

          {/* Card 3: Engineering Cost */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderRadius: 12,
              padding: '32px 28px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              transform: `scale(${Math.max(0, card3Spring)}) translateY(${interpolate(card3Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, card3Spring)),
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: '#0f62fe',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#78a9ff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Migration Cost
              </span>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#0f62fe' }}>6–18 Mo</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f4', marginBottom: 12 }}>
              Prohibitive Dev Overhead
            </h3>
            <p style={{ fontSize: 15, color: '#8d8d8d', lineHeight: 1.5, margin: 0 }}>
              Manual refactoring of package namespaces, JUnit frameworks, and Maven hierarchies costs hundreds of developer hours per service.
            </p>
          </div>
        </div>

        {/* Bottom Solution Statement Banner */}
        <div
          style={{
            marginTop: 36,
            width: '100%',
            maxWidth: 1540,
            backgroundColor: 'rgba(15, 98, 254, 0.08)',
            border: '1px solid rgba(15, 98, 254, 0.3)',
            borderRadius: 10,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: bannerOpacity,
            boxShadow: '0 0 30px rgba(15, 98, 254, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                backgroundColor: '#0f62fe',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 4,
                letterSpacing: '0.05em',
              }}
            >
              SOLUTION
            </span>
            <span style={{ fontSize: 18, color: '#f4f4f4', fontWeight: 600 }}>
              LegacyX eliminates manual toil with multi-agent AST orchestration, deterministic build loops, and governance gates.
            </span>
          </div>
          <span style={{ fontSize: 14, color: '#00d2ff', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
            ⚡ 97.5% Faster Delivery
          </span>
        </div>
      </div>
    </div>
  );
};
