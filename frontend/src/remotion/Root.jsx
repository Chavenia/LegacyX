import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';
import '../index.css';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="LegacyXDemo"
        component={MainVideo}
        durationInFrames={5400} // 3 minutes at 30fps (180 seconds)
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'LegacyX',
          version: '1.0.0',
          enableVoiceover: true,
          volume: 1.0,
        }}
      />
    </>
  );
};
