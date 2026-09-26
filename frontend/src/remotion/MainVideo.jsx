import React from 'react';
import { Sequence } from 'remotion';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2Architecture } from './scenes/Scene2Architecture';
import { Scene3Scorecard } from './scenes/Scene3Scorecard';
import { Scene4BobAgents } from './scenes/Scene4BobAgents';
import { Scene5DiffViewer } from './scenes/Scene5DiffViewer';
import { Scene6BuildLoop } from './scenes/Scene6BuildLoop';
import { Scene7Outro } from './scenes/Scene7Outro';

export const MainVideo = () => {
  return (
    <div style={{ flex: 1, backgroundColor: '#0d1117', width: 1920, height: 1080 }}>
      {/* Scene 1: Introduction & The Enterprise Crisis (0s - 25s) */}
      <Sequence from={0} durationInFrames={750} name="Scene 1: Introduction">
        <Scene1Intro />
      </Sequence>

      {/* Scene 2: Dual-Layer Architecture & Pipeline (25s - 50s) */}
      <Sequence from={750} durationInFrames={750} name="Scene 2: Architecture">
        <Scene2Architecture />
      </Sequence>

      {/* Scene 3: Pre-Flight Scan & Risk Scorecard (50s - 80s) */}
      <Sequence from={1500} durationInFrames={900} name="Scene 3: Scorecard">
        <Scene3Scorecard />
      </Sequence>

      {/* Scene 4: IBM Bob 2.0 Multi-Agent Swarm (80s - 115s) */}
      <Sequence from={2400} durationInFrames={1050} name="Scene 4: Bob Agents">
        <Scene4BobAgents />
      </Sequence>

      {/* Scene 5: Monaco AST Code Diff Viewer (115s - 145s) */}
      <Sequence from={3450} durationInFrames={900} name="Scene 5: Code Diffs">
        <Scene5DiffViewer />
      </Sequence>

      {/* Scene 6: Deterministic Build-Test Loop (145s - 165s) */}
      <Sequence from={4350} durationInFrames={600} name="Scene 6: Build Verification">
        <Scene6BuildLoop />
      </Sequence>

      {/* Scene 7: watsonx Slack Delivery & Outro (165s - 180s) */}
      <Sequence from={4950} durationInFrames={450} name="Scene 7: watsonx Approval & Outro">
        <Scene7Outro />
      </Sequence>
    </div>
  );
};
