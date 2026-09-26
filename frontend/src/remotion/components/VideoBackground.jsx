import React from 'react';

export const VideoBackground = ({
  glowColor = '#3b82f6',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#0B0C0E',
        backgroundImage: 'radial-gradient(ellipse 80% 40% at 50% -5%, #151822 0%, #0B0C0E 100%)',
        overflow: 'hidden',
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    />
  );
};
