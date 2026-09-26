import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene2Architecture = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const layer1Spring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const layer2Spring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const pipelineSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 12, stiffness: 75 },
  });

  // Animated pipeline progress beam
  const beamProgress = interpolate(frame % 180, [0, 180], [0, 100]);

  const pipelineSteps = [
    { num: '01', title: 'Repository Ingestion', desc: 'Git clone with OAuth / PAT into sandbox', color: '#0f62fe' },
    { num: '02', title: 'AST & POM Deep Scan', desc: 'Pre-flight risk score (0-100) & CVE checks', color: '#8a3ffc' },
    { num: '03', title: 'Bob 2.0 Agent Swarm', desc: 'Subagents A, B, C AST refactoring', color: '#00d2ff' },
    { num: '04', title: 'Deterministic Build Loop', desc: 'Autonomous mvn clean test verification', color: '#24a148' },
    { num: '05', title: 'watsonx Slack Gateway', desc: 'Interactive approval card & PR delivery', color: '#f1c21b' },
  ];

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground glowColor="#8a3ffc" />
      <HeaderBar sceneNumber={2} sceneTitle="Dual-Layer Architecture & Pipeline" />

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
        {/* Section Heading */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
            transform: `scale(${titleSpring})`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#a7f0ba',
              marginBottom: 8,
            }}
          >
            System Design &amp; Autonomous Workflow
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Dual-Layer Enterprise Architecture
          </h2>
        </div>

        {/* Dual Layers Display (Side by Side) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            width: '100%',
            maxWidth: 1540,
            marginBottom: 32,
          }}
        >
          {/* Layer 1: Governance & Visual Interface */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderTop: '4px solid #0f62fe',
              borderRadius: 12,
              padding: '28px 32px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              transform: `translateY(${interpolate(layer1Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, layer1Spring)),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#78a9ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Layer 1: Governance &amp; Experience
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: '"IBM Plex Mono", monospace',
                  backgroundColor: '#161616',
                  padding: '2px 8px',
                  borderRadius: 4,
                  color: '#00d2ff',
                  border: '1px solid #393939',
                }}
              >
                React + Express API
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0' }}>
              Governance &amp; Visual Interface Layer
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#c6c6c6', fontSize: 15, lineHeight: 1.8 }}>
              <li><strong style={{ color: '#ffffff' }}>Reusable Repo URL Ingestion:</strong> Connects to public/private GitHub &amp; GitLab</li>
              <li><strong style={{ color: '#ffffff' }}>Modernization Scorecard:</strong> Real-time 0–100 index, CVE badges &amp; effort hours</li>
              <li><strong style={{ color: '#ffffff' }}>Interactive Monaco Diff Viewer:</strong> Red/green AST side-by-side verification</li>
              <li><strong style={{ color: '#ffffff' }}>watsonx Orchestrate Gateway:</strong> Slack Block Kit cards with 1-click approvals</li>
            </ul>
          </div>

          {/* Layer 2: Developer Execution Engine */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderTop: '4px solid #8a3ffc',
              borderRadius: 12,
              padding: '28px 32px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              transform: `translateY(${interpolate(layer2Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, layer2Spring)),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#d4bbff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Layer 2: Execution &amp; Refactoring
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: '"IBM Plex Mono", monospace',
                  backgroundColor: '#161616',
                  padding: '2px 8px',
                  borderRadius: 4,
                  color: '#8a3ffc',
                  border: '1px solid #393939',
                }}
              >
                IBM Bob 2.0 Engine
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0' }}>
              Autonomous Multi-Agent Refactoring
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#c6c6c6', fontSize: 15, lineHeight: 1.8 }}>
              <li><strong style={{ color: '#ffffff' }}>Isolated Sandboxes:</strong> Ephemeral, zero-collision directory provisioning</li>
              <li><strong style={{ color: '#ffffff' }}>Java AST &amp; POM Parser:</strong> Structural lexical scanning of types &amp; dependencies</li>
              <li><strong style={{ color: '#ffffff' }}>Bob 2.0 Multi-Agent Swarm:</strong> Subagents A (AST), B (POM), and C (JUnit 5)</li>
              <li><strong style={{ color: '#ffffff' }}>Deterministic Build Runner:</strong> Automated <code style={{ color: '#00d2ff' }}>mvn clean test</code> loop</li>
            </ul>
          </div>
        </div>

        {/* 5-Step Pipeline Flow Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 1540,
            backgroundColor: '#161616',
            border: '1px solid #393939',
            borderRadius: 12,
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden',
            transform: `scale(${Math.max(0, pipelineSpring)})`,
            opacity: Math.max(0, Math.min(1, pipelineSpring)),
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#8d8d8d',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Autonomous Modernization Pipeline</span>
            <span style={{ color: '#00d2ff', fontFamily: '"IBM Plex Mono", monospace' }}>
              Live Flow Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, position: 'relative' }}>
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#262626',
                  border: '1px solid #393939',
                  borderRadius: 8,
                  padding: '14px 16px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontWeight: 800,
                      color: step.color,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {step.num}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f4f4f4' }}>{step.title}</span>
                </div>
                <p style={{ fontSize: 12, color: '#8d8d8d', margin: 0, lineHeight: 1.4 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Animated beam at the bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 3,
              width: `${beamProgress}%`,
              background: 'linear-gradient(90deg, #0f62fe, #8a3ffc, #00d2ff)',
              boxShadow: '0 0 10px rgba(0, 210, 255, 0.8)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
