import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const VoiceoverSubtitles = ({
  text,
  voiceName = 'Charon',
  showWave = true,
  startOffsetFrame = 10,
  durationFrames = 700
}) => {
  const frame = useCurrentFrame();

  // Opacity fade in and fade out
  const opacity = interpolate(
    frame,
    [startOffsetFrame, startOffsetFrame + 15, durationFrames - 25, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (opacity <= 0.01) return null;

  // Animated audio bars
  const waveBars = [0, 1, 2, 3, 4].map((i) => {
    const freq = (frame * 0.25 + i * 1.2);
    const height = 6 + Math.abs(Math.sin(freq)) * 14;
    return height;
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 30,
          padding: '10px 24px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
          maxWidth: 1400,
        }}
      >
        {/* Voiceover Badge & Waveform */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              height: 20,
              padding: '0 6px',
            }}
          >
            {waveBars.map((h, idx) => (
              <div
                key={idx}
                style={{
                  width: 3,
                  height: showWave ? h : 4,
                  backgroundColor: '#38bdf8',
                  borderRadius: 2,
                  transition: 'height 0.05s ease',
                }}
              />
            ))}
          </div>

          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: '"IBM Plex Mono", monospace',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              padding: '2px 8px',
              borderRadius: 12,
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            {voiceName}
          </span>
        </div>

        {/* Subtitle Narration Text */}
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            color: '#f8fafc',
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
