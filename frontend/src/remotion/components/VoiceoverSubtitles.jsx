import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

/**
 * Splits transcript text into timed subtitle segments proportional to sentence lengths,
 * merging short fragments so each line has sufficient reading duration.
 */
function getSubtitleSegments(text, durationFrames) {
  if (!text) return [];

  // Strip audio tags [serious], [excitedly], etc. and clean extra whitespace
  const cleaned = text.replace(/\[\w+\]/g, '').replace(/\s+/g, ' ').trim();

  // Split on sentence boundaries (. ? !)
  const rawSentences = cleaned
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (rawSentences.length === 0) return [];

  // Merge short fragments (< 35 chars) with adjacent sentences for natural subtitle pacing
  const merged = [];
  for (let i = 0; i < rawSentences.length; i++) {
    const s = rawSentences[i];
    if (merged.length > 0 && (s.length < 35 || merged[merged.length - 1].length < 35)) {
      merged[merged.length - 1] += ' ' + s;
    } else {
      merged.push(s);
    }
  }

  const totalChars = merged.reduce((acc, s) => acc + s.length, 0);
  const startPadding = 10; // brief pause before first subtitle
  const endPadding = 15;   // brief pause before scene cut
  const usableDuration = Math.max(1, durationFrames - startPadding - endPadding);

  let currentStart = startPadding;
  return merged.map((sentence) => {
    const fraction = sentence.length / totalChars;
    const dur = Math.max(20, Math.round(fraction * usableDuration));
    const startFrame = currentStart;
    const endFrame = Math.min(durationFrames - endPadding, startFrame + dur);
    currentStart = endFrame;

    return {
      text: sentence,
      startFrame,
      endFrame,
    };
  });
}

export const VoiceoverSubtitles = ({
  text,
  durationFrames = 750,
}) => {
  const frame = useCurrentFrame();
  const segments = React.useMemo(
    () => getSubtitleSegments(text, durationFrames),
    [text, durationFrames]
  );

  // Find active segment for the current frame
  const currentSegment = segments.find(
    (seg) => frame >= seg.startFrame && frame < seg.endFrame
  );

  if (!currentSegment) return null;

  // Safe fade duration calculation (at most 6 frames, or 1/4 of segment length)
  const segmentLength = currentSegment.endFrame - currentSegment.startFrame;
  const fade = Math.max(1, Math.min(6, Math.floor(segmentLength / 4)));
  const fadeInEnd = currentSegment.startFrame + fade;
  const fadeOutStart = currentSegment.endFrame - fade;

  let opacity = 1;
  if (frame < fadeInEnd && currentSegment.startFrame < fadeInEnd) {
    opacity = interpolate(frame, [currentSegment.startFrame, fadeInEnd], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (frame > fadeOutStart && fadeOutStart < currentSegment.endFrame) {
    opacity = interpolate(frame, [fadeOutStart, currentSegment.endFrame], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
        pointerEvents: 'none',
        padding: '0 48px',
      }}
    >
      <div
        style={{
          opacity,
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 8,
          padding: '10px 24px',
          maxWidth: 1180,
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            color: '#f9fafb',
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
          }}
        >
          {currentSegment.text}
        </p>
      </div>
    </div>
  );
};
