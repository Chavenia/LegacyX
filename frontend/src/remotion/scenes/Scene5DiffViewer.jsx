import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';
import { HeaderBar } from '../components/HeaderBar';

export const Scene5DiffViewer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeTab = frame < 450 ? 0 : 1;
  const containerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      <VideoBackground />
      <HeaderBar sceneNumber={5} sceneTitle="Side-by-Side AST Code Diff Viewer" startFrame={3450} />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px' }}>
        {/* Diff Window */}
        <div style={{ width: '100%', maxWidth: 1500, height: 650, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transform: `scale(${Math.max(0, containerSpring)})`, opacity: Math.max(0, Math.min(1, containerSpring)) }}>
          {/* Tab Bar */}
          <div style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', backgroundColor: activeTab === 0 ? '#fff' : 'transparent', borderRadius: 6, border: activeTab === 0 ? '1px solid #e5e7eb' : '1px solid transparent', color: activeTab === 0 ? '#111827' : '#9ca3af', fontSize: 12, fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                <span>AccountDto.java</span>
                <span style={{ fontSize: 10, backgroundColor: '#f0fdf4', color: '#059669', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>DTO ➔ Record</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', backgroundColor: activeTab === 1 ? '#fff' : 'transparent', borderRadius: 6, border: activeTab === 1 ? '1px solid #e5e7eb' : '1px solid transparent', color: activeTab === 1 ? '#111827' : '#9ca3af', fontSize: 12, fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                <span>pom.xml</span>
                <span style={{ fontSize: 10, backgroundColor: '#eff6ff', color: '#2563eb', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>Java 21 + Spring Boot 3</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, fontFamily: '"IBM Plex Mono", monospace' }}>
              <span style={{ color: '#ef4444' }}>● Red: Legacy (Java 8 / Spring Boot 2)</span>
              <span style={{ color: '#059669' }}>● Green: Modern (Java 21 LTS / Spring Boot 3)</span>
            </div>
          </div>

          {/* Side-by-Side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
            {/* Left: Legacy */}
            <div style={{ backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, lineHeight: 1.6 }}>
              <div style={{ padding: '6px 18px', backgroundColor: '#fef2f2', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 600, color: '#ef4444' }}>
                <span>ORIGINAL (LEGACY JAVA 8)</span>
                <span>48 Lines of Mutable Boilerplate</span>
              </div>
              <div style={{ padding: '16px 18px', overflowY: 'hidden', color: '#6b7280' }}>
                {activeTab === 0 ? (
                  <>
                    <div style={{ color: '#d1d5db' }}>// Legacy Mutable POJO with boilerplate</div>
                    <div style={{ color: '#374151' }}>package com.enterprise.account.dto;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- import javax.persistence.Entity;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- import javax.validation.constraints.NotNull;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- public class AccountDto implements Serializable &#123;</div>
                    <div style={{ color: '#9ca3af' }}>&nbsp;&nbsp;private Long id;</div>
                    <div style={{ color: '#9ca3af' }}>&nbsp;&nbsp;private String accountNumber;</div>
                    <div style={{ color: '#9ca3af' }}>&nbsp;&nbsp;private BigDecimal balance;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ color: '#d1d5db' }}>&nbsp;&nbsp;// 30 lines of getters, setters, hashCode, equals...</div>
                    <div style={{ color: '#9ca3af' }}>&nbsp;&nbsp;public Long getId() &#123; return id; &#125;</div>
                    <div style={{ color: '#9ca3af' }}>&nbsp;&nbsp;public void setId(Long id) &#123; this.id = id; &#125;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- &#125;</div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#d1d5db' }}>&lt;!-- Legacy Maven POM --&gt;</div>
                    <div style={{ color: '#374151' }}>&lt;parent&gt;</div>
                    <div style={{ color: '#6b7280' }}>&nbsp;&nbsp;&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- &nbsp;&nbsp;&lt;version&gt;2.1.8.RELEASE&lt;/version&gt;</div>
                    <div style={{ color: '#374151' }}>&lt;/parent&gt;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- &nbsp;&nbsp;&lt;java.version&gt;1.8&lt;/java.version&gt;</div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>- &nbsp;&nbsp;&lt;log4j2.version&gt;2.14.1&lt;/log4j2.version&gt; &lt;!-- CVE-2021-44228 --&gt;</div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Modernized */}
            <div style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, lineHeight: 1.6 }}>
              <div style={{ padding: '6px 18px', backgroundColor: '#f0fdf4', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 600, color: '#059669' }}>
                <span>MODERNIZED (JAVA 21 LTS)</span>
                <span>Concise Immutable Record • Zero Boilerplate</span>
              </div>
              <div style={{ padding: '16px 18px', overflowY: 'hidden', color: '#374151' }}>
                {activeTab === 0 ? (
                  <>
                    <div style={{ color: '#d1d5db' }}>// Modern Java 21 Record with Jakarta Validation</div>
                    <div style={{ color: '#374151' }}>package com.enterprise.account.dto;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ import jakarta.persistence.Entity;</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ import jakarta.validation.constraints.NotNull;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ public record AccountDto(</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ &nbsp;&nbsp;Long id,</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ &nbsp;&nbsp;@NotNull String accountNumber,</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ &nbsp;&nbsp;BigDecimal balance</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ ) implements Serializable &#123;&#125;</div>
                    <div style={{ height: 12 }} />
                    <div style={{ color: '#059669', fontWeight: 600 }}>// ✓ 70% Less Code • Immutable &amp; Thread-Safe by Default</div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#d1d5db' }}>&lt;!-- Modernized Maven POM --&gt;</div>
                    <div style={{ color: '#374151' }}>&lt;parent&gt;</div>
                    <div style={{ color: '#6b7280' }}>&nbsp;&nbsp;&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ &nbsp;&nbsp;&lt;version&gt;3.3.4&lt;/version&gt;</div>
                    <div style={{ color: '#374151' }}>&lt;/parent&gt;</div>
                    <div style={{ height: 6 }} />
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ &nbsp;&nbsp;&lt;java.version&gt;21&lt;/java.version&gt;</div>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderLeft: '3px solid #10b981', paddingLeft: 8 }}>+ &nbsp;&nbsp;&lt;log4j2.version&gt;2.23.1&lt;/log4j2.version&gt; &lt;!-- ZERO CVE --&gt;</div>
                    <div style={{ height: 12 }} />
                    <div style={{ color: '#059669', fontWeight: 600 }}>&lt;!-- ✓ Spring Boot 3.3.4 + Java 21 LTS Verified --&gt;</div>
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
