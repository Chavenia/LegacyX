import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';

export const Scene2Architecture = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const layer1Spring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const layer2Spring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const pipelineSpring = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 75 },
  });

  const pipelineSteps = [
    { num: '01', title: 'Repository Ingestion', desc: 'Git clone into isolated sandbox', color: '#60a5fa' },
    { num: '02', title: 'AST & POM Deep Scan', desc: 'Pre-flight risk score (0-100) & CVE audit', color: '#c084fc' },
    { num: '03', title: 'Bob 2.0 Agent Swarm', desc: 'Subagents A, B, C AST refactoring', color: '#38bdf8' },
    { num: '04', title: 'Deterministic Build Loop', desc: 'Autonomous mvn test verification', color: '#34d399' },
    { num: '05', title: 'watsonx Slack Gateway', desc: 'Interactive approval card & PR delivery', color: '#fbbf24' },
  ];

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={2} sceneTitle="Dual-Layer Enterprise Architecture & Pipeline" startFrame={750} />

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
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        {/* Section Heading */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24,
            transform: `scale(${titleSpring})`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 14px',
              borderRadius: 20,
              backgroundColor: '#14161A',
              border: '1px solid #23262D',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#9CA3AF', textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace' }}>
              System Design &amp; Autonomous Workflow
            </span>
          </div>

          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            Dual-Layer Enterprise Architecture
          </h2>
        </div>

        {/* Dual Layers Display (Side by Side Cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            width: '100%',
            maxWidth: 1500,
            marginBottom: 20,
          }}
        >
          {/* Layer 1: Governance & Visual Interface */}
          <div
            style={{
              transform: `translateY(${interpolate(layer1Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, layer1Spring)),
            }}
          >
            <UseLayoutsCard
              badge="Layer 1: Governance & Visual Interface"
              badgeColor="#60a5fa"
              metric="React + Express"
              metricColor="#38bdf8"
              title="Autonomous Control Plane"
              footerAuthor="Developer Governance Sidecar"
              footerRole="Visual telemetry, AST diff, watsonx approval"
              footerAvatar={
                <div style={{ backgroundColor: '#2563eb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  L1
                </div>
              }
            >
              <ul style={{ margin: '6px 0 12px 0', paddingLeft: 18, color: '#9CA3AF', fontSize: 14, lineHeight: 1.75 }}>
                <li><strong style={{ color: '#ffffff' }}>Repository Ingestion:</strong> Connects to public/private Git repositories in sandboxes</li>
                <li><strong style={{ color: '#ffffff' }}>Risk Scorecard:</strong> Real-time 0–100 index, CVE badges &amp; migration effort breakdown</li>
                <li><strong style={{ color: '#ffffff' }}>Interactive Monaco Diff Viewer:</strong> Red/green AST side-by-side syntactic verification</li>
                <li><strong style={{ color: '#ffffff' }}>watsonx Orchestrate Gateway:</strong> Slack Block Kit cards with 1-click approvals</li>
              </ul>
            </UseLayoutsCard>
          </div>

          {/* Layer 2: Developer Execution Engine */}
          <div
            style={{
              transform: `translateY(${interpolate(layer2Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, layer2Spring)),
            }}
          >
            <UseLayoutsCard
              badge="Layer 2: Developer Execution Engine"
              badgeColor="#c084fc"
              metric="IBM Bob 2.0"
              metricColor="#a855f7"
              title="Multi-Agent Refactoring Core"
              footerAuthor="Autonomous Swarm Core"
              footerRole="AST parser, deterministic mvn test loop, CVE fixer"
              footerAvatar={
                <div style={{ backgroundColor: '#7c3aed', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  L2
                </div>
              }
            >
              <ul style={{ margin: '6px 0 12px 0', paddingLeft: 18, color: '#9CA3AF', fontSize: 14, lineHeight: 1.75 }}>
                <li><strong style={{ color: '#ffffff' }}>Isolated Sandboxes:</strong> Ephemeral, zero-collision directory provisioning on disk</li>
                <li><strong style={{ color: '#ffffff' }}>Java AST &amp; POM Parser:</strong> Structural lexical scanning of types &amp; dependencies</li>
                <li><strong style={{ color: '#ffffff' }}>Bob 2.0 Multi-Agent Swarm:</strong> Subagents A (AST), B (POM), and C (JUnit 5)</li>
                <li><strong style={{ color: '#ffffff' }}>Deterministic Build Runner:</strong> Automated <code style={{ color: '#38bdf8' }}>mvn clean test</code> loop</li>
              </ul>
            </UseLayoutsCard>
          </div>
        </div>

        {/* 5-Step Pipeline Flow Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 1500,
            transform: `scale(${Math.max(0, pipelineSpring)})`,
            opacity: Math.max(0, Math.min(1, pipelineSpring)),
          }}
        >
          <div
            style={{
              backgroundColor: '#121418',
              border: '1px solid #23262D',
              borderRadius: 12,
              padding: '18px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9CA3AF', fontFamily: '"IBM Plex Mono", monospace' }}>
                End-to-End Modernization Pipeline Sequence
              </span>
              <span style={{ fontSize: 12, color: '#10b981', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                ● 100% Deterministic &amp; Governed
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
              {pipelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#0B0C0E',
                    border: '1px solid #23262D',
                    borderRadius: 8,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 16, fontWeight: 700, color: step.color }}>
                      {step.num}
                    </span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: step.color }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
