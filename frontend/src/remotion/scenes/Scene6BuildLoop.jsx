import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';
import { UseLayoutsCard } from '../components/UseLayoutsCard';

export const Scene6BuildLoop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step = Math.floor(frame / 20);
  const mavenLogs = [
    '[INFO] Scanning for projects...',
    '[INFO] -------------------< com.enterprise:account-service >--------------------',
    '[INFO] Building account-service 1.0.0-SNAPSHOT',
    '[INFO] --------------------------------[ jar ]---------------------------------',
    '[INFO] --- maven-resources-plugin:3.3.1:resources (default-resources) ---',
    '[INFO] Copying 3 resources from src/main/resources to target/classes',
    '[INFO] --- maven-compiler-plugin:3.13.0:compile (default-compile) ---',
    '[INFO] Recompiling the module with javac 21 [release 21]',
    '[INFO] Compiling 18 source files with javac 21 LTS - 0 ERRORS, 0 WARNINGS',
    '[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) ---',
    '[INFO] Using auto detected provider: org.apache.maven.surefire.junitplatform.JUnitPlatformProvider',
    '[INFO] Running com.enterprise.account.AccountServiceTest',
    '[INFO] Tests run: 18, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.421 s',
    '[INFO] Running com.enterprise.account.AccountControllerTest',
    '[INFO] Tests run: 16, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.384 s',
    '[INFO] ',
    '[INFO] Results:',
    '[INFO] Tests run: 34, Failures: 0, Errors: 0, Skipped: 0',
    '[INFO] ------------------------------------------------------------------------',
    '[INFO] BUILD SUCCESS',
    '[INFO] Total time:  3.214 s',
    '[INFO] Finished at: 2026-09-26T22:08:00+08:00',
    '[INFO] ------------------------------------------------------------------------',
  ];

  const visibleLogs = mavenLogs.slice(0, Math.min(mavenLogs.length, step + 1));
  const isFinished = frame > 180;

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={6} sceneTitle="Autonomous Build-Test-Fix Verification Loop" startFrame={4350} />

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
        {/* Verification Overview Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: isFinished ? '#059669' : '#2563eb',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 4,
                letterSpacing: '0.06em',
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              {isFinished ? 'BUILD PASS' : 'EXECUTING'}
            </span>
            <span style={{ fontSize: 15, color: '#ffffff', fontWeight: 600 }}>
              Deterministic Sandbox Verification: <code style={{ color: '#60a5fa', fontFamily: '"IBM Plex Mono", monospace' }}>mvn clean test</code>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9CA3AF' }}>
              <span>Compiler:</span>
              <strong style={{ color: '#ffffff', fontFamily: '"IBM Plex Mono", monospace' }}>Java 21 LTS</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9CA3AF' }}>
              <span>Test Runner:</span>
              <strong style={{ color: '#ffffff', fontFamily: '"IBM Plex Mono", monospace' }}>JUnit 5 Jupiter</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9CA3AF' }}>
              <span>Status:</span>
              <strong style={{ color: isFinished ? '#34d399' : '#60a5fa', fontFamily: '"IBM Plex Mono", monospace' }}>
                {isFinished ? '✓ 0 REGRESSIONS' : '● RUNNING'}
              </strong>
            </div>
          </div>
        </div>

        {/* Main Grid: Console & Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: 20,
            width: '100%',
            maxWidth: 1500,
          }}
        >
          {/* Left: Maven Build Terminal */}
          <div
            style={{
              backgroundColor: '#121418',
              border: '1px solid #23262D',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: 520,
            }}
          >
            <div
              style={{
                backgroundColor: '#0E1013',
                borderBottom: '1px solid #23262D',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: '#6B7280', fontFamily: '"IBM Plex Mono", monospace' }}>
                  isolated-sandbox-9843a:~/project
                </span>
              </div>
              <span style={{ fontSize: 11, color: isFinished ? '#34d399' : '#60a5fa', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                {isFinished ? '✓ VERIFICATION COMPLETE' : '● STREAMING OUTPUT'}
              </span>
            </div>

            <div
              style={{
                padding: '16px 18px',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 12,
                lineHeight: 1.6,
                flex: 1,
                overflow: 'hidden',
                backgroundColor: '#0B0C0E',
                color: '#9CA3AF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {visibleLogs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    color: log.includes('BUILD SUCCESS')
                      ? '#34d399'
                      : log.includes('ERRORS') || log.includes('Failures')
                      ? '#f87171'
                      : log.includes('Compiling')
                      ? '#60a5fa'
                      : '#9CA3AF',
                    fontWeight: log.includes('BUILD SUCCESS') ? 700 : 400,
                  }}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 2 Cards for Verification Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Card 1: Regression Test Pass Rate */}
            <UseLayoutsCard
              badge="Deterministic Gate"
              badgeColor="#34d399"
              metric="34 / 34"
              metricColor="#10b981"
              title="Test Suite Pass Rate"
              footerAuthor="JUnit 5 Surefire Runner"
              footerRole="0 Failures, 0 Errors, 0 Flaky tests"
              footerAvatar={
                <div style={{ backgroundColor: '#059669', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  ✓
                </div>
              }
            >
              <div style={{ margin: '6px 0 10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
                  <span>Code Coverage Integrity</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>98.4%</span>
                </div>
                <div style={{ width: '100%', height: 4, backgroundColor: '#1F2228', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '98.4%', height: '100%', backgroundColor: '#10b981' }} />
                </div>
              </div>
            </UseLayoutsCard>

            {/* Card 2: Self-Healing Build Loop */}
            <UseLayoutsCard
              badge="Self-Healing Loop"
              badgeColor="#60a5fa"
              metric="1 Attempt"
              metricColor="#38bdf8"
              title="Zero-Touch Convergence"
              footerAuthor="Autonomous Engine"
              footerRole="Deterministic AST recipe convergence"
              footerAvatar={
                <div style={{ backgroundColor: '#2563eb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  AST
                </div>
              }
            >
              <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.55, margin: '6px 0 10px 0' }}>
                If a test or compilation failure occurs, Bob 2.0 inspects surefire reports, generates precise AST delta patches, and re-executes tests automatically.
              </p>
            </UseLayoutsCard>
          </div>
        </div>
      </div>
    </div>
  );
};
