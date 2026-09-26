import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene5DiffViewer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tab switching: File 1 (AccountDto.java) from 0 to 450 frames, File 2 (pom.xml) from 450 to 900 frames
  const activeTab = frame < 450 ? 0 : 1;

  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={5} sceneTitle="Side-by-Side Monaco AST Code Diff Viewer" startFrame={3450} />

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
        {/* Diff Viewer Window */}
        <div
          style={{
            width: '100%',
            maxWidth: 1500,
            height: 650,
            backgroundColor: '#121418',
            border: '1px solid #23262D',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transform: `scale(${Math.max(0, containerSpring)})`,
            opacity: Math.max(0, Math.min(1, containerSpring)),
          }}
        >
          {/* Header Bar with Tabs */}
          <div
            style={{
              backgroundColor: '#0E1013',
              borderBottom: '1px solid #23262D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              height: 48,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  backgroundColor: activeTab === 0 ? '#16181E' : 'transparent',
                  borderRadius: 6,
                  border: activeTab === 0 ? '1px solid #262830' : '1px solid transparent',
                  color: activeTab === 0 ? '#ffffff' : '#6B7280',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                <span>AccountDto.java</span>
                <span style={{ fontSize: 10, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                  DTO ➔ Record
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  backgroundColor: activeTab === 1 ? '#16181E' : 'transparent',
                  borderRadius: 6,
                  border: activeTab === 1 ? '1px solid #262830' : '1px solid transparent',
                  color: activeTab === 1 ? '#ffffff' : '#6B7280',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                <span>pom.xml</span>
                <span style={{ fontSize: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                  Java 21 + Spring Boot 3
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, fontFamily: '"IBM Plex Mono", monospace' }}>
              <span style={{ color: '#f87171' }}>● Red: Legacy (Java 8 / Spring Boot 2)</span>
              <span style={{ color: '#34d399' }}>● Green: Modern (Java 21 LTS / Spring Boot 3)</span>
            </div>
          </div>

          {/* Side by Side Diff Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
            {/* Left: Legacy Code */}
            <div
              style={{
                backgroundColor: '#0B0C0E',
                borderRight: '1px solid #23262D',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  padding: '6px 18px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  borderBottom: '1px solid #23262D',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#f87171',
                }}
              >
                <span>ORIGINAL (LEGACY JAVA 8)</span>
                <span>48 Lines of Mutable Boilerplate</span>
              </div>

              <div style={{ padding: '16px 18px', overflowY: 'hidden', color: '#9CA3AF' }}>
                {activeTab === 0 ? (
                  <>
                    <div style={{ color: '#4B5563' }}>// Legacy Mutable POJO with boilerplate</div>
                    <div>package com.enterprise.account.dto;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - import javax.persistence.Entity;
                    </div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - import javax.validation.constraints.NotNull;
                    </div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - public class AccountDto implements Serializable &#123;
                    </div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;private Long id;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;private String accountNumber;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;private BigDecimal balance;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ color: '#4B5563' }}>&nbsp;&nbsp;// 30 lines of getters, setters, hashCode, equals...</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;public Long getId() &#123; return id; &#125;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;public void setId(Long id) &#123; this.id = id; &#125;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;public String getAccountNumber() &#123; return accountNumber; &#125;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;public void setAccountNumber(String acc) &#123; this.accountNumber = acc; &#125;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - &#125;
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#4B5563' }}>&lt;!-- Legacy Maven POM --&gt;</div>
                    <div style={{ color: '#6B7280' }}>&lt;parent&gt;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - &nbsp;&nbsp;&lt;version&gt;2.1.8.RELEASE&lt;/version&gt;
                    </div>
                    <div style={{ color: '#6B7280' }}>&lt;/parent&gt;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ color: '#6B7280' }}>&lt;properties&gt;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - &nbsp;&nbsp;&lt;java.version&gt;1.8&lt;/java.version&gt;
                    </div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                      - &nbsp;&nbsp;&lt;log4j2.version&gt;2.14.1&lt;/log4j2.version&gt; &lt;!-- CVE-2021-44228 --&gt;
                    </div>
                    <div style={{ color: '#6B7280' }}>&lt;/properties&gt;</div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Modernized Code */}
            <div
              style={{
                backgroundColor: '#080B09',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  padding: '6px 18px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  borderBottom: '1px solid #23262D',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#34d399',
                }}
              >
                <span>MODERNIZED (JAVA 21 LTS)</span>
                <span>Concise Immutable Record • Zero Boilerplate</span>
              </div>

              <div style={{ padding: '16px 18px', overflowY: 'hidden', color: '#D1D5DB' }}>
                {activeTab === 0 ? (
                  <>
                    <div style={{ color: '#4B5563' }}>// Modern Java 21 Record with Jakarta Validation</div>
                    <div>package com.enterprise.account.dto;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + import jakarta.persistence.Entity;
                    </div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + import jakarta.validation.constraints.NotNull;
                    </div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + public record AccountDto(
                    </div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + &nbsp;&nbsp;Long id,
                    </div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + &nbsp;&nbsp;@NotNull String accountNumber,
                    </div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + &nbsp;&nbsp;BigDecimal balance
                    </div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + ) implements Serializable &#123;&#125;
                    </div>
                    <div style={{ height: 12 }} />
                    <div style={{ color: '#34d399', fontWeight: 600 }}>
                      // ✓ 70% Less Code • Immutable &amp; Thread-Safe by Default
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#4B5563' }}>&lt;!-- Modernized Maven POM --&gt;</div>
                    <div style={{ color: '#6B7280' }}>&lt;parent&gt;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</div>
                    <div style={{ color: '#6B7280' }}>&nbsp;&nbsp;&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + &nbsp;&nbsp;&lt;version&gt;3.3.4&lt;/version&gt;
                    </div>
                    <div style={{ color: '#6B7280' }}>&lt;/parent&gt;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ color: '#6B7280' }}>&lt;properties&gt;</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + &nbsp;&nbsp;&lt;java.version&gt;21&lt;/java.version&gt;
                    </div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                      + &nbsp;&nbsp;&lt;log4j2.version&gt;2.23.1&lt;/log4j2.version&gt; &lt;!-- ZERO CVE --&gt;
                    </div>
                    <div style={{ color: '#6B7280' }}>&lt;/properties&gt;</div>
                    <div style={{ height: 12 }} />
                    <div style={{ color: '#34d399', fontWeight: 600 }}>
                      &lt;!-- ✓ Spring Boot 3.3.4 + Java 21 LTS Verified --&gt;
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
