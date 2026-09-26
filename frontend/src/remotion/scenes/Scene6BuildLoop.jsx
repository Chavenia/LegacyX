import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene6BuildLoop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const successSpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

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
      <VideoBackground glowColor="#24a148" />
      <HeaderBar sceneNumber={6} sceneTitle="Autonomous Build-Test-Fix Verification Loop" />

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
        {/* Verification Overview Bar */}
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
            marginBottom: 20,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                backgroundColor: isFinished ? '#198038' : '#0f62fe',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 4,
                letterSpacing: '0.08em',
              }}
            >
              {isFinished ? 'BUILD PASS' : 'EXECUTING'}
            </span>
            <span style={{ fontSize: 16, color: '#f4f4f4', fontWeight: 700 }}>
              Deterministic Sandbox Verification: <code style={{ color: '#00d2ff', fontFamily: '"IBM Plex Mono", monospace' }}>mvn clean test</code>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#c6c6c6' }}>
              <span>Compiler:</span>
              <strong style={{ color: '#42be65', fontFamily: '"IBM Plex Mono", monospace' }}>JDK 21 LTS</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#c6c6c6' }}>
              <span>Test Runner:</span>
              <strong style={{ color: '#78a9ff', fontFamily: '"IBM Plex Mono", monospace' }}>JUnit 5 Jupiter</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#c6c6c6' }}>
              <span>Tests:</span>
              <strong style={{ color: '#42be65', fontFamily: '"IBM Plex Mono", monospace' }}>34 / 34 PASSED</strong>
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div
          style={{
            width: '100%',
            maxWidth: 1540,
            height: 440,
            backgroundColor: '#0d1117',
            border: '1px solid #393939',
            borderRadius: 10,
            padding: '20px 24px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 13,
            color: '#a8a8a8',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid #262626', marginBottom: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#da1e28' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f1c21b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#24a148' }} />
            <span style={{ fontSize: 12, color: '#6f6f6f', marginLeft: 8 }}>
              LegacyX Sandbox Terminal • /tmp/legacyx-sandbox/sandbox_9843a
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'hidden' }}>
            {visibleLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: log.includes('BUILD SUCCESS')
                    ? '#42be65'
                    : log.includes('0 ERRORS')
                    ? '#00d2ff'
                    : log.includes('Running')
                    ? '#f4f4f4'
                    : '#8d8d8d',
                  fontWeight: log.includes('BUILD SUCCESS') ? 800 : 400,
                  fontSize: log.includes('BUILD SUCCESS') ? 16 : 13,
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Verification Guarantee Badges */}
        {isFinished && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              width: '100%',
              maxWidth: 1540,
              transform: `scale(${Math.max(0, successSpring)})`,
              opacity: Math.max(0, Math.min(1, successSpring)),
            }}
          >
            <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #24a148', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>🛡️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Zero Binary Regressions</div>
                <div style={{ fontSize: 12, color: '#8d8d8d' }}>100% test assertions satisfied on Java 21</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #24a148', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Self-Healing Compiler Loop</div>
                <div style={{ fontSize: 12, color: '#8d8d8d' }}>Automatic AST error diagnosis and instant patch injection</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #24a148', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>100% CVE Remediation</div>
                <div style={{ fontSize: 12, color: '#8d8d8d' }}>Log4Shell &amp; Spring4Shell completely eliminated</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
