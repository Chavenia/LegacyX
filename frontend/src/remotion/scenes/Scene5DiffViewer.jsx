import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
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
      <VideoBackground glowColor="#0f62fe" />
      <HeaderBar sceneNumber={5} sceneTitle="Side-by-Side Monaco AST Code Diff Viewer" />

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
        {/* Diff Viewer Window Card */}
        <div
          style={{
            width: '100%',
            maxWidth: 1540,
            height: 640,
            backgroundColor: '#161616',
            border: '1px solid #393939',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            transform: `scale(${Math.max(0, containerSpring)})`,
            opacity: Math.max(0, Math.min(1, containerSpring)),
          }}
        >
          {/* Header Bar with Tabs */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              borderBottom: '1px solid #393939',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              height: 48,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  backgroundColor: activeTab === 0 ? '#161616' : 'transparent',
                  borderTop: activeTab === 0 ? '2px solid #0f62fe' : '2px solid transparent',
                  color: activeTab === 0 ? '#ffffff' : '#8d8d8d',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                <span>📄 AccountDto.java</span>
                <span style={{ fontSize: 10, backgroundColor: 'rgba(36, 161, 72, 0.2)', color: '#42be65', padding: '1px 6px', borderRadius: 4 }}>
                  DTO ➔ Record
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  backgroundColor: activeTab === 1 ? '#161616' : 'transparent',
                  borderTop: activeTab === 1 ? '2px solid #8a3ffc' : '2px solid transparent',
                  color: activeTab === 1 ? '#ffffff' : '#8d8d8d',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                <span>⚙️ pom.xml</span>
                <span style={{ fontSize: 10, backgroundColor: 'rgba(15, 98, 254, 0.2)', color: '#78a9ff', padding: '1px 6px', borderRadius: 4 }}>
                  Java 21 + Spring Boot 3
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, fontFamily: '"IBM Plex Mono", monospace' }}>
              <span style={{ color: '#da1e28' }}>● Red: Legacy (Java 8 / Spring Boot 2)</span>
              <span style={{ color: '#24a148' }}>● Green: Modern (Java 21 LTS / Spring Boot 3)</span>
            </div>
          </div>

          {/* Side by Side Diff Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
            {/* Left: Legacy Code */}
            <div
              style={{
                backgroundColor: '#12151b',
                borderRight: '1px solid #393939',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(218, 30, 40, 0.1)',
                  borderBottom: '1px solid rgba(218, 30, 40, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#ff8389',
                }}
              >
                <span>ORIGINAL (LEGACY JAVA 8)</span>
                <span>48 Lines of Mutable Boilerplate</span>
              </div>

              <div style={{ padding: '16px', overflowY: 'hidden', color: '#c6c6c6' }}>
                {activeTab === 0 ? (
                  <>
                    <div style={{ color: '#6f6f6f' }}>// Legacy Mutable POJO with boilerplate</div>
                    <div>package com.enterprise.account.dto;</div>
                    <div style={{ height: 8 }} />
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - import javax.persistence.Entity;
                    </div>
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - import javax.validation.constraints.NotNull;
                    </div>
                    <div style={{ height: 8 }} />
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - public class AccountDto implements Serializable &#123;
                    </div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;private Long id;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;private String accountNumber;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;private BigDecimal balance;</div>
                    <div style={{ height: 8 }} />
                    <div style={{ color: '#6f6f6f' }}>&nbsp;&nbsp;// 30 lines of getters, setters, hashCode, equals...</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;public Long getId() &#123; return id; &#125;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;public void setId(Long id) &#123; this.id = id; &#125;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;public String getAccountNumber() &#123; return accountNumber; &#125;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;public void setAccountNumber(String acc) &#123; this.accountNumber = acc; &#125;</div>
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - &#125;
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#6f6f6f' }}>&lt;!-- Legacy Maven POM --&gt;</div>
                    <div style={{ color: '#8d8d8d' }}>&lt;parent&gt;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</div>
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - &nbsp;&nbsp;&lt;version&gt;2.1.8.RELEASE&lt;/version&gt;
                    </div>
                    <div style={{ color: '#8d8d8d' }}>&lt;/parent&gt;</div>
                    <div style={{ height: 8 }} />
                    <div style={{ color: '#8d8d8d' }}>&lt;properties&gt;</div>
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - &nbsp;&nbsp;&lt;java.version&gt;1.8&lt;/java.version&gt;
                    </div>
                    <div style={{ backgroundColor: 'rgba(218,30,40,0.25)', color: '#ffb3b8' }}>
                      - &nbsp;&nbsp;&lt;log4j2.version&gt;2.14.1&lt;/log4j2.version&gt; &lt;!-- CVE-2021-44228 --&gt;
                    </div>
                    <div style={{ color: '#8d8d8d' }}>&lt;/properties&gt;</div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Modernized Code */}
            <div
              style={{
                backgroundColor: '#121815',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(36, 161, 72, 0.1)',
                  borderBottom: '1px solid rgba(36, 161, 72, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#42be65',
                }}
              >
                <span>MODERNIZED (JAVA 21 LTS)</span>
                <span>Concise Immutable Record • Zero Boilerplate</span>
              </div>

              <div style={{ padding: '16px', overflowY: 'hidden', color: '#c6c6c6' }}>
                {activeTab === 0 ? (
                  <>
                    <div style={{ color: '#6f6f6f' }}>// Modern Java 21 Record with Jakarta Validation</div>
                    <div>package com.enterprise.account.dto;</div>
                    <div style={{ height: 8 }} />
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + import jakarta.persistence.Entity;
                    </div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + import jakarta.validation.constraints.NotNull;
                    </div>
                    <div style={{ height: 8 }} />
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + public record AccountDto(
                    </div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + &nbsp;&nbsp;Long id,
                    </div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + &nbsp;&nbsp;@NotNull String accountNumber,
                    </div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + &nbsp;&nbsp;BigDecimal balance
                    </div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + ) &#123;&#125;
                    </div>
                    <div style={{ height: 16 }} />
                    <div style={{ color: '#42be65', fontSize: 12, fontStyle: 'italic' }}>
                      ✨ 85% Code Reduction: Built-in immutability, canonical constructor, equals(), and toString().
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#6f6f6f' }}>&lt;!-- Modernized Maven POM --&gt;</div>
                    <div style={{ color: '#8d8d8d' }}>&lt;parent&gt;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</div>
                    <div style={{ color: '#8d8d8d' }}>&nbsp;&nbsp;&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + &nbsp;&nbsp;&lt;version&gt;3.3.4&lt;/version&gt;
                    </div>
                    <div style={{ color: '#8d8d8d' }}>&lt;/parent&gt;</div>
                    <div style={{ height: 8 }} />
                    <div style={{ color: '#8d8d8d' }}>&lt;properties&gt;</div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + &nbsp;&nbsp;&lt;java.version&gt;21&lt;/java.version&gt;
                    </div>
                    <div style={{ backgroundColor: 'rgba(36,161,72,0.25)', color: '#a7f0ba' }}>
                      + &nbsp;&nbsp;&lt;log4j2.version&gt;2.23.1&lt;/log4j2.version&gt; &lt;!-- Safe --&gt;
                    </div>
                    <div style={{ color: '#8d8d8d' }}>&lt;/properties&gt;</div>
                    <div style={{ height: 16 }} />
                    <div style={{ color: '#42be65', fontSize: 12, fontStyle: 'italic' }}>
                      🛡️ All Critical CVEs remediated. Modern Jakarta EE dependency trees injected.
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
