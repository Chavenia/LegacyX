import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';

export const Scene4BobAgents = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const executionPercent   = Math.min(100, Math.floor(interpolate(frame, [0, 800], [0, 100], { extrapolateRight: 'clamp' })));
  const filesProcessed     = Math.min(48,  Math.floor(interpolate(frame, [0, 800], [0, 48],  { extrapolateRight: 'clamp' })));
  const astTransformations = Math.min(142, Math.floor(interpolate(frame, [0, 800], [0, 142], { extrapolateRight: 'clamp' })));
  const recordsGenerated   = Math.min(12,  Math.floor(interpolate(frame, [0, 800], [0, 12],  { extrapolateRight: 'clamp' })));

  const agent1Spring = spring({ frame,        fps, config: { damping: 14, stiffness: 80 } });
  const agent2Spring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 80 } });
  const agent3Spring = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 80 } });

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
      <VideoBackground />
      <HeaderBar sceneNumber={4} sceneTitle="IBM Bob 2.0 Multi-Agent Modernization Swarm" startFrame={2400} />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px' }}>
        {/* Swarm Status Bar */}
        <div style={{ width: '100%', maxWidth: 1500, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.06em', fontFamily: '"IBM Plex Mono", monospace' }}>
              BOB 2.0 SWARM
            </span>
            <span style={{ fontSize: 15, color: '#111827', fontWeight: 600 }}>Autonomous Multi-Agent Refactoring in Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <span>Files:</span>
              <strong style={{ color: '#2563eb', fontFamily: '"IBM Plex Mono", monospace' }}>{filesProcessed} / 48</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <span>AST Edits:</span>
              <strong style={{ color: '#059669', fontFamily: '"IBM Plex Mono", monospace' }}>{astTransformations}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <span>Java 21 Records:</span>
              <strong style={{ color: '#7c3aed', fontFamily: '"IBM Plex Mono", monospace' }}>{recordsGenerated}</strong>
            </div>
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '4px 10px', borderRadius: 4, fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, fontWeight: 600, color: '#2563eb' }}>
              {executionPercent}%
            </div>
          </div>
        </div>

        {/* 3 Subagents */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%', maxWidth: 1500, marginBottom: 20 }}>
          <div style={{ transform: `scale(${Math.max(0, agent1Spring)})`, opacity: Math.max(0, Math.min(1, agent1Spring)) }}>
            <UseLayoutsCard badge="Subagent Alpha" badgeColor="#2563eb" metric="AST Core" metricColor="#0891b2" title="Java 21 Syntax & Records"
              footerAuthor="AST Modernizer" footerRole="javax -> jakarta, pattern matching"
              footerAvatar={<div style={{ backgroundColor: '#2563eb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>α</div>}
            >
              <ul style={{ margin: '6px 0 12px 0', paddingLeft: 16, color: '#6b7280', fontSize: 13, lineHeight: 1.7 }}>
                <li>Rewrites POJOs into immutable <strong style={{ color: '#2563eb' }}>Java 21 records</strong></li>
                <li>Migrates <code style={{ color: '#ef4444' }}>javax.*</code> to <code style={{ color: '#059669' }}>jakarta.*</code></li>
                <li>Replaces deprecated APIs with modern equivalents</li>
              </ul>
            </UseLayoutsCard>
          </div>
          <div style={{ transform: `scale(${Math.max(0, agent2Spring)})`, opacity: Math.max(0, Math.min(1, agent2Spring)) }}>
            <UseLayoutsCard badge="Subagent Beta" badgeColor="#7c3aed" metric="Spring 3.3" metricColor="#7c3aed" title="POM & Dependency Graph"
              footerAuthor="Dependency Resolver" footerRole="Parent POM, plugins, CVE patching"
              footerAvatar={<div style={{ backgroundColor: '#7c3aed', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>β</div>}
            >
              <ul style={{ margin: '6px 0 12px 0', paddingLeft: 16, color: '#6b7280', fontSize: 13, lineHeight: 1.7 }}>
                <li>Upgrades Spring Boot <code style={{ color: '#ef4444' }}>2.1.8</code> to <strong style={{ color: '#7c3aed' }}>3.3.4</strong></li>
                <li>Updates Maven compiler release to Java 21</li>
                <li>Patches CVSS 10.0 Log4j vulnerability to <strong style={{ color: '#059669' }}>2.23.1</strong></li>
              </ul>
            </UseLayoutsCard>
          </div>
          <div style={{ transform: `scale(${Math.max(0, agent3Spring)})`, opacity: Math.max(0, Math.min(1, agent3Spring)) }}>
            <UseLayoutsCard badge="Subagent Gamma" badgeColor="#059669" metric="Jupiter" metricColor="#059669" title="JUnit 5 & Mockito 5"
              footerAuthor="Test Modernizer" footerRole="JUnit 4 to Jupiter assertions & annotations"
              footerAvatar={<div style={{ backgroundColor: '#059669', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>γ</div>}
            >
              <ul style={{ margin: '6px 0 12px 0', paddingLeft: 16, color: '#6b7280', fontSize: 13, lineHeight: 1.7 }}>
                <li>Transforms <code style={{ color: '#ef4444' }}>@Test</code> to JUnit Jupiter</li>
                <li>Rewrites lifecycle hooks (<code style={{ color: '#2563eb' }}>@BeforeEach</code>)</li>
                <li>Upgrades Mockito 2 to Mockito 5 with Java 21 compatibility</li>
              </ul>
            </UseLayoutsCard>
          </div>
        </div>

        {/* Terminal */}
        <div style={{ width: '100%', maxWidth: 1500, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: '"IBM Plex Mono", monospace' }}>
              legacyx-agent-worker-01 (AST Engine stdout)
            </span>
            <span style={{ fontSize: 11, color: '#059669', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>● LIVE STREAMING</span>
          </div>
          <div style={{ padding: '12px 18px', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, lineHeight: 1.6, height: 140, overflow: 'hidden', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {visibleLogs.slice(-5).map((log, idx) => (
              <div key={idx} style={{ color: log.includes('Alpha') ? '#2563eb' : log.includes('Beta') ? '#7c3aed' : log.includes('Gamma') ? '#059669' : '#6b7280' }}>
                <span style={{ color: '#d1d5db', marginRight: 8 }}>&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
