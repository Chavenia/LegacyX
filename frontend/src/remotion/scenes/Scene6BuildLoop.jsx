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
    '[INFO] --- maven-compiler-plugin:3.13.0:compile (default-compile) ---',
    '[INFO] Recompiling the module with javac 21 [release 21]',
    '[INFO] Compiling 18 source files with javac 21 LTS - 0 ERRORS, 0 WARNINGS',
    '[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) ---',
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
    '[INFO] ------------------------------------------------------------------------',
  ];

  const visibleLogs = mavenLogs.slice(0, Math.min(mavenLogs.length, step + 1));
  const isFinished  = frame > 180;

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={6} sceneTitle="Autonomous Build-Test-Fix Verification Loop" startFrame={4350} />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px' }}>
        {/* Status Bar */}
        <div style={{ width: '100%', maxWidth: 1500, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ backgroundColor: isFinished ? '#059669' : '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.06em', fontFamily: '"IBM Plex Mono", monospace' }}>
              {isFinished ? 'BUILD PASS' : 'EXECUTING'}
            </span>
            <span style={{ fontSize: 15, color: '#111827', fontWeight: 600 }}>
              Sandbox Verification: <code style={{ color: '#2563eb', fontFamily: '"IBM Plex Mono", monospace' }}>mvn clean test</code>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <span>Compiler:</span>
              <strong style={{ color: '#111827', fontFamily: '"IBM Plex Mono", monospace' }}>Java 21 LTS</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <span>Test Runner:</span>
              <strong style={{ color: '#111827', fontFamily: '"IBM Plex Mono", monospace' }}>JUnit 5 Jupiter</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <span>Status:</span>
              <strong style={{ color: isFinished ? '#059669' : '#2563eb', fontFamily: '"IBM Plex Mono", monospace' }}>
                {isFinished ? '✓ 0 REGRESSIONS' : '● RUNNING'}
              </strong>
            </div>
          </div>
        </div>

        {/* Grid: Console + Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, width: '100%', maxWidth: 1500 }}>
          {/* Maven Terminal */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 520 }}>
            <div style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: '"IBM Plex Mono", monospace' }}>
                isolated-sandbox-9843a:~/project
              </span>
              <span style={{ fontSize: 11, color: isFinished ? '#059669' : '#2563eb', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                {isFinished ? '✓ VERIFICATION COMPLETE' : '● STREAMING OUTPUT'}
              </span>
            </div>
            <div style={{ padding: '16px 18px', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, lineHeight: 1.6, flex: 1, overflow: 'hidden', backgroundColor: '#f9fafb', color: '#6b7280', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {visibleLogs.map((log, idx) => (
                <div key={idx} style={{
                  color: log.includes('BUILD SUCCESS') ? '#059669'
                    : log.includes('ERRORS') || log.includes('Failures') ? '#ef4444'
                    : log.includes('Compiling') ? '#2563eb'
                    : '#6b7280',
                  fontWeight: log.includes('BUILD SUCCESS') ? 700 : 400,
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Right Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UseLayoutsCard badge="Deterministic Gate" badgeColor="#059669" metric="34 / 34" metricColor="#059669" title="Test Suite Pass Rate"
              footerAuthor="JUnit 5 Surefire Runner" footerRole="0 Failures, 0 Errors, 0 Flaky tests"
              footerAvatar={<div style={{ backgroundColor: '#059669', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>✓</div>}
            >
              <div style={{ margin: '6px 0 10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                  <span>Code Coverage Integrity</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>98.4%</span>
                </div>
                <div style={{ width: '100%', height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '98.4%', height: '100%', backgroundColor: '#10b981' }} />
                </div>
              </div>
            </UseLayoutsCard>

            <UseLayoutsCard badge="Self-Healing Loop" badgeColor="#2563eb" metric="1 Attempt" metricColor="#2563eb" title="Zero-Touch Convergence"
              footerAuthor="Autonomous Engine" footerRole="Deterministic AST recipe convergence"
              footerAvatar={<div style={{ backgroundColor: '#2563eb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>AST</div>}
            >
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55, margin: '6px 0 10px 0' }}>
                If a test or compilation failure occurs, Bob 2.0 inspects surefire reports, generates precise AST delta patches, and re-executes tests automatically.
              </p>
            </UseLayoutsCard>
          </div>
        </div>
      </div>
    </div>
  );
};
