import React from 'react';
import { Sequence, Audio, staticFile } from 'remotion';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2Architecture } from './scenes/Scene2Architecture';
import { Scene3Scorecard } from './scenes/Scene3Scorecard';
import { Scene4BobAgents } from './scenes/Scene4BobAgents';
import { Scene5DiffViewer } from './scenes/Scene5DiffViewer';
import { Scene6BuildLoop } from './scenes/Scene6BuildLoop';
import { Scene7Outro } from './scenes/Scene7Outro';
import { VoiceoverSubtitles } from './components/VoiceoverSubtitles';
import { VOICEOVER_SCENES } from './voiceoverData';

export const MainVideo = ({
  enableVoiceover = true,
  enableSubtitles = true,
  voiceName = 'Gemini Charon',
  volume = 1.0,
}) => {
  return (
    <div style={{ flex: 1, backgroundColor: '#0d1117', width: 1920, height: 1080, position: 'relative' }}>
      {/* Scene 1: Introduction & The Enterprise Crisis (0s - 25s) */}
      <Sequence from={VOICEOVER_SCENES[0].startFrame} durationInFrames={VOICEOVER_SCENES[0].durationInFrames} name="Scene 1: Introduction">
        <Scene1Intro />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene1.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[0].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[0].durationInFrames}
          />
        )}
      </Sequence>

      {/* Scene 2: Dual-Layer Architecture & Pipeline (25s - 50s) */}
      <Sequence from={VOICEOVER_SCENES[1].startFrame} durationInFrames={VOICEOVER_SCENES[1].durationInFrames} name="Scene 2: Architecture">
        <Scene2Architecture />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene2.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[1].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[1].durationInFrames}
          />
        )}
      </Sequence>

      {/* Scene 3: Pre-Flight Scan & Risk Scorecard (50s - 80s) */}
      <Sequence from={VOICEOVER_SCENES[2].startFrame} durationInFrames={VOICEOVER_SCENES[2].durationInFrames} name="Scene 3: Scorecard">
        <Scene3Scorecard />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene3.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[2].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[2].durationInFrames}
          />
        )}
      </Sequence>

      {/* Scene 4: IBM Bob 2.0 Multi-Agent Swarm (80s - 115s) */}
      <Sequence from={VOICEOVER_SCENES[3].startFrame} durationInFrames={VOICEOVER_SCENES[3].durationInFrames} name="Scene 4: Bob Agents">
        <Scene4BobAgents />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene4.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[3].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[3].durationInFrames}
          />
        )}
      </Sequence>

      {/* Scene 5: Monaco AST Code Diff Viewer (115s - 145s) */}
      <Sequence from={VOICEOVER_SCENES[4].startFrame} durationInFrames={VOICEOVER_SCENES[4].durationInFrames} name="Scene 5: Code Diffs">
        <Scene5DiffViewer />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene5.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[4].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[4].durationInFrames}
          />
        )}
      </Sequence>

      {/* Scene 6: Deterministic Build-Test Loop (145s - 165s) */}
      <Sequence from={VOICEOVER_SCENES[5].startFrame} durationInFrames={VOICEOVER_SCENES[5].durationInFrames} name="Scene 6: Build Verification">
        <Scene6BuildLoop />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene6.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[5].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[5].durationInFrames}
          />
        )}
      </Sequence>

      {/* Scene 7: watsonx Slack Delivery & Outro (165s - 180s) */}
      <Sequence from={VOICEOVER_SCENES[6].startFrame} durationInFrames={VOICEOVER_SCENES[6].durationInFrames} name="Scene 7: watsonx Approval & Outro">
        <Scene7Outro />
        {enableVoiceover && (
          <Audio src={staticFile('audio/scene7.wav')} volume={volume} />
        )}
        {enableSubtitles && (
          <VoiceoverSubtitles
            text={VOICEOVER_SCENES[6].dialogText}
            voiceName={voiceName}
            startOffsetFrame={15}
            durationFrames={VOICEOVER_SCENES[6].durationInFrames}
          />
        )}
      </Sequence>
    </div>
  );
};
