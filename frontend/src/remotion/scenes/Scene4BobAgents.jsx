import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene4BobAgents = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress of agent swarm execution
  const executionPercent = Math.min(100, Math.floor(interpolate(frame, [0, 800], [0, 100], { extrapolateRight: 'clamp' })));

  const filesProcessed = Math.min(48, Math.floor(interpolate(frame, [0, 800], [0, 48], { extrapolateRight: 'clamp' })));
  const astTransformations = Math.min(142, Math.floor(interpolate(frame, [0, 800], [0, 142], { extrapolateRight: 'clamp' })));
  const recordsGenerated = Math.min(12, Math.floor(interpolate(frame, [0, 800], [0, 12], { extrapolateRight: 'clamp' })));

  // Subagent card entrances
  const agent1Spring = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const agent2Spring = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 80 } });
  const agent3Spring = spring({ frame: frame - 80, fps, config: { damping: 14, stiffness: 80 } });

  // Terminal active line index
  const logStep = Math.floor(frame / 35);
  const terminalLogs = [
    'Initializing isolated sandbox at /tmp/legacyx-sandbox/sandbox_9843a...',
    'Cloning repository target branch [main] via OAuth token...',
    'AST Lexical tree initialized: parsed 48 Java source files...',
    '[Subagent Alpha] Parsing AccountDto.java - Detected mutable POJO candidate',
    '[Subagent Alpha] Converting AccountDto into immutable Java 21 Record...',
    '[Subagent Alpha] Migrating javax.persistence.* -> jakarta.persistence.*',
    '[Subagent Alpha] Refactoring deprecated new Integer() -> Integer.valueOf()...',
    '[Subagent Beta] Ingesting pom.xml Maven hierarchy...',
    '[Subagent Beta] Bumping spring-boot-starter-parent 2.1.8 -> 3.3.4',
    '[Subagent Beta] Upgrading compiler target <java.version>1.8</java.version> -> 21',
    '[Subagent Beta] Remediating Log4j CVE-2021-44228 -> bump to 2.23.1',
    '[Subagent Gamma] Scanning test suites: AccountServiceTest.java',
    '[Subagent Gamma] Migrating org.junit.Test -> org.junit.jupiter.api.Test',
    '[Subagent Gamma] Rewriting @Before setup methods to @BeforeEach',
    '[Subagent Gamma] Replacing JUnit 4 Assert.assertEquals -> Assertions.assertEquals',
    'AST and Dependency Modernization 100% COMPLETE. Staging changes for build test...',
  ];

  const visibleLogs = terminalLogs.slice(0, Math.min(terminalLogs.length, logStep + 1));

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground glowColor="#00d2ff" />
      <HeaderBar sceneNumber={4} sceneTitle="IBM Bob 2.0 Multi-Agent Modernization Swarm" />

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
        {/* Swarm Status Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 1540,
            backgroundColor: '#1e1e1e',
            border: '1px solid #393939',
            borderRadius: 10,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
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
                letterSpacing: '0.08em',
              }}
            >
              BOB 2.0 SWARM
            </span>
            <span style={{ fontSize: 16, color: '#f4f4f4', fontWeight: 700 }}>
              Autonomous Multi-Agent Refactoring in Progress
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#a8a8a8' }}>
              <span>Files:</span>
              <strong style={{ color: '#00d2ff', fontFamily: '"IBM Plex Mono", monospace' }}>{filesProcessed} / 48</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#a8a8a8' }}>
              <span>AST Edits:</span>
              <strong style={{ color: '#8a3ffc', fontFamily: '"IBM Plex Mono", monospace' }}>{astTransformations}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#a8a8a8' }}>
              <span>Records:</span>
              <strong style={{ color: '#24a148', fontFamily: '"IBM Plex Mono", monospace' }}>{recordsGenerated}</strong>
            </div>

            <div
              style={{
                width: 140,
                height: 8,
                backgroundColor: '#161616',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid #393939',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${executionPercent}%`,
                  backgroundColor: '#00d2ff',
                  boxShadow: '0 0 8px #00d2ff',
                }}
              />
            </div>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, fontWeight: 700, color: '#00d2ff' }}>
              {executionPercent}%
            </span>
          </div>
        </div>

        {/* 3 Specialized Subagent Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            width: '100%',
            maxWidth: 1540,
            marginBottom: 24,
          }}
        >
          {/* Subagent Alpha: AST & Syntax */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderTop: '4px solid #00d2ff',
              borderRadius: 12,
              padding: '20px 24px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
              transform: `translateY(${interpolate(agent1Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, agent1Spring)),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#00d2ff', textTransform: 'uppercase' }}>
                Subagent Alpha
              </span>
              <span style={{ fontSize: 10, backgroundColor: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff', padding: '2px 6px', borderRadius: 4 }}>
                ACTIVE
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>
              Syntax &amp; AST Transformer
            </h3>
            <p style={{ fontSize: 13, color: '#8d8d8d', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Walks Java AST, migrates package declarations, transforms boilerplate DTOs into records.
            </p>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#a8a8a8', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>✓ javax.* ➔ jakarta.*</div>
              <div>✓ Mutable POJO ➔ Java 21 Record</div>
              <div>✓ Deprecated constructors cleaned</div>
            </div>
          </div>

          {/* Subagent Beta: Build & POM */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderTop: '4px solid #8a3ffc',
              borderRadius: 12,
              padding: '20px 24px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
              transform: `translateY(${interpolate(agent2Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, agent2Spring)),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#d4bbff', textTransform: 'uppercase' }}>
                Subagent Beta
              </span>
              <span style={{ fontSize: 10, backgroundColor: 'rgba(138, 63, 252, 0.15)', color: '#d4bbff', padding: '2px 6px', borderRadius: 4 }}>
                ACTIVE
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>
              POM &amp; Dependency Modernizer
            </h3>
            <p style={{ fontSize: 13, color: '#8d8d8d', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Parses Maven XML, upgrades Spring Boot parent, and bumps compiler targets to Java 21.
            </p>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#a8a8a8', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>✓ Spring Boot 2.1.8 ➔ 3.3.4</div>
              <div>✓ Compiler target 1.8 ➔ 21</div>
              <div>✓ CVE-2021-44228 resolved</div>
            </div>
          </div>

          {/* Subagent Gamma: Test Suite */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #393939',
              borderTop: '4px solid #24a148',
              borderRadius: 12,
              padding: '20px 24px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
              transform: `translateY(${interpolate(agent3Spring, [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, Math.min(1, agent3Spring)),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#42be65', textTransform: 'uppercase' }}>
                Subagent Gamma
              </span>
              <span style={{ fontSize: 10, backgroundColor: 'rgba(36, 161, 72, 0.15)', color: '#42be65', padding: '2px 6px', borderRadius: 4 }}>
                ACTIVE
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>
              JUnit 5 Jupiter Migrator
            </h3>
            <p style={{ fontSize: 13, color: '#8d8d8d', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Modernizes test annotations, lifecycle hooks, and assertion libraries to modern Jupiter standards.
            </p>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#a8a8a8', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>✓ org.junit.Test ➔ jupiter.api.Test</div>
              <div>✓ @Before ➔ @BeforeEach</div>
              <div>✓ Assertions.* modernized</div>
            </div>
          </div>
        </div>

        {/* Live Terminal Console Stream */}
        <div
          style={{
            width: '100%',
            maxWidth: 1540,
            height: 260,
            backgroundColor: '#0c0f14',
            border: '1px solid #393939',
            borderRadius: 10,
            padding: '16px 20px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 13,
            color: '#a8a8a8',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: '1px solid #262626', marginBottom: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#da1e28' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f1c21b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#24a148' }} />
            <span style={{ fontSize: 12, color: '#6f6f6f', marginLeft: 8 }}>
              IBM Bob 2.0 Execution Terminal • Multi-Agent Stream
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'hidden' }}>
            {visibleLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: '#525252' }}>{`00:${String(i * 2 + 10).padStart(2, '0')}`}</span>
                <span style={{ color: log.includes('Subagent Alpha') ? '#00d2ff' : log.includes('Subagent Beta') ? '#d4bbff' : log.includes('Subagent Gamma') ? '#42be65' : log.includes('COMPLETE') ? '#f1c21b' : '#c6c6c6' }}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
