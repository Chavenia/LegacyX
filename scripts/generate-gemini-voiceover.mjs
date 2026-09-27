#!/usr/bin/env node

/**
 * ==============================================================================
 * LegacyX — Gemini Voiceover Generator for Remotion
 * ==============================================================================
 * Generates natural enterprise voiceovers for the 7 video presentation scenes
 * using Gemini 3.1 Flash TTS (gemini-3.1-flash-tts-preview) with expressive
 * director's chair prompting and selectable Gemini voices.
 *
 * Supported Gemini Voices:
 *   - Charon (Informative / Technical Authority) [DEFAULT]
 *   - Kore (Firm / Executive Leadership)
 *   - Puck (Upbeat / Engaging)
 *   - Fenrir (Excitable / Dynamic)
 *   - Aoede (Breezy / Accessible)
 *   - Sadaltager (Knowledgeable / Academic)
 *   - Zephyr (Bright / Modern)
 *
 * Usage:
 *   node scripts/generate-gemini-voiceover.mjs
 *   node scripts/generate-gemini-voiceover.mjs --voice=Kore
 *   node scripts/generate-gemini-voiceover.mjs --voice=Charon --scene=1
 *   node scripts/generate-gemini-voiceover.mjs --key=YOUR_API_KEY
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Resolve project root & load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env') });

// Load scenes metadata
const { VOICEOVER_SCENES } = await import('./voiceoverScenes.js');

// Parse CLI flags
const args = process.argv.slice(2);
const getArg = (prefix) => {
  const match = args.find((a) => a.startsWith(prefix));
  return match ? match.split('=')[1] : null;
};

const selectedVoice = getArg('--voice') || process.env.GEMINI_VOICE || 'Charon';
const selectedScene = getArg('--scene') || 'all';
const forceLocalFallback = args.includes('--local-fallback');
const apiKey = getArg('--key') || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const PUBLIC_AUDIO_DIR = path.join(rootDir, 'frontend', 'public', 'audio');
const REMOTION_AUDIO_DIR = path.join(rootDir, 'frontend', 'src', 'remotion', 'audio');

// Ensure output directories exist
fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
fs.mkdirSync(REMOTION_AUDIO_DIR, { recursive: true });

console.log('=================================================================');
console.log('   🎙️  LegacyX Presentation Voiceover Generator (Remotion)');
console.log('   ⚡  Gemini TTS Model: gemini-3.1-flash-tts-preview');
console.log(`   🗣️  Selected Voice:   ${selectedVoice}`);
console.log(`   📂  Public Audio:     ${PUBLIC_AUDIO_DIR}`);
console.log('=================================================================\n');

/**
 * Creates standard 44-byte WAV header for raw 24kHz 16-bit mono PCM bytes
 */
function pcmToWav(pcmBuffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // subchunk1 size
  header.writeUInt16LE(1, 20); // PCM = 1
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

/**
 * Formats Director's Chair prompt according to Google Gemini TTS specifications
 */
function buildDirectorsPrompt(scene, voice) {
  return `# AUDIO PROFILE: Enterprise Technology Presenter & Modernization Architect
## Voice Persona: ${voice} (Informative, authoritative, confident, executive clarity)
## The Scene: Executive enterprise tech presentation demo for LegacyX

### DIRECTOR'S NOTES
Style: Confident, authoritative enterprise tech leadership. The speaker presents an autonomous enterprise modernization engine to VPs of Engineering and CISOs.
Pace: Measured and clear, pacing around 140–160 words per minute to synchronize with Remotion animated cards and terminal logs.
Dynamics: Articulate technical symbols cleanly (e.g. "Java 21", "CVSS 10.0", "jakarta-dot-star", "34/34 tests").
Scene Guidance: ${scene.directorNotes}

#### TRANSCRIPT
${scene.dialogText}`;
}

/**
 * Generates audio via Google Gemini 3.1 Flash TTS API
 */
async function generateGeminiSpeech(scene, voice, key) {
  const prompt = buildDirectorsPrompt(scene, voice);

  // Model endpoint for Gemini 3.1 Flash TTS Preview
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${key}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice
          }
        }
      }
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const part = json.candidates?.[0]?.content?.parts?.[0];

  if (!part?.inlineData?.data) {
    throw new Error(`No audio data returned by Gemini API: ${JSON.stringify(json)}`);
  }

  const base64Data = part.inlineData.data;
  const mimeType = part.inlineData.mimeType || 'audio/pcm';
  const rawBuffer = Buffer.from(base64Data, 'base64');

  // If already WAV or MP3 (contains RIFF or ID3/sync byte), return buffer directly
  if (rawBuffer.slice(0, 4).toString('ascii') === 'RIFF') {
    return rawBuffer;
  }

  // Otherwise convert raw PCM 24kHz to standard WAV
  return pcmToWav(rawBuffer, 24000, 1, 16);
}

/**
 * Local fallback synthesizer using Windows SAPI (Microsoft Speech Synthesizer)
 * Ensures valid audio files exist even before GEMINI_API_KEY is configured
 */
function generateLocalFallbackSpeech(scene, outputPath) {
  // Strip audio tags like [excitedly], [serious] for clean local speech
  const cleanText = scene.dialogText
    .replace(/\[\w+\]/g, '')
    .replace(/[@#*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Escape single quotes for PowerShell
  const psText = cleanText.replace(/'/g, "''");
  const psOutputPath = outputPath.replace(/'/g, "''");

  const psScript = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.SetOutputToWaveFile('${psOutputPath}')
$synth.Speak('${psText}')
$synth.Dispose()
`;

  execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, '; ')}"`, { stdio: 'pipe' });
}

async function run() {
  const scenesToProcess =
    selectedScene === 'all'
      ? VOICEOVER_SCENES
      : VOICEOVER_SCENES.filter((s) => s.sceneNumber === parseInt(selectedScene, 10));

  if (!apiKey && !forceLocalFallback) {
    console.warn('⚠️  GEMINI_API_KEY is not set in environment or .env!');
    console.warn('💡 To generate real Gemini AI voices:');
    console.warn('    Add GEMINI_API_KEY=your_key_here to your .env file, or pass --key=YOUR_KEY\n');
    console.warn('🔄 Running local speech synthesizer fallback to generate preview WAVs for Remotion...\n');
  }

  for (const scene of scenesToProcess) {
    const filename = `${scene.id}.wav`;
    const publicPath = path.join(PUBLIC_AUDIO_DIR, filename);
    const remotionPath = path.join(REMOTION_AUDIO_DIR, filename);

    console.log(`▶ Processing Scene ${scene.sceneNumber}: "${scene.title}" (${scene.timeRange})`);

    let audioBuffer;
    let methodUsed = '';

    if (apiKey && !forceLocalFallback) {
      try {
        process.stdout.write(`   📡 Calling Gemini 3.1 Flash TTS (${selectedVoice})... `);
        audioBuffer = await generateGeminiSpeech(scene, selectedVoice, apiKey);
        methodUsed = `Gemini 3.1 Flash TTS (${selectedVoice})`;
        console.log('✓ Success');
      } catch (err) {
        console.log(`✗ Failed: ${err.message}`);
        console.log('   🔄 Falling back to local synthesizer...');
        generateLocalFallbackSpeech(scene, publicPath);
        audioBuffer = fs.readFileSync(publicPath);
        methodUsed = 'Local SAPI Synthesizer (Fallback)';
      }
    } else {
      generateLocalFallbackSpeech(scene, publicPath);
      audioBuffer = fs.readFileSync(publicPath);
      methodUsed = 'Local SAPI Synthesizer';
    }

    // Save to public/audio and src/remotion/audio
    fs.writeFileSync(publicPath, audioBuffer);
    fs.writeFileSync(remotionPath, audioBuffer);

    const sizeKb = (audioBuffer.length / 1024).toFixed(1);
    console.log(`   💾 Saved ${filename} (${sizeKb} KB) via ${methodUsed}`);
    console.log(`      -> ${publicPath}`);
    console.log(`      -> ${remotionPath}\n`);
  }

  console.log('=================================================================');
  console.log('🎉 Voiceover Generation Complete!');
  console.log('   All 7 scenes are ready for Remotion playback and rendering.');
  console.log('   Preview in Remotion Studio: npm run remotion:studio');
  console.log('   Render video:               npm run remotion:render');
  console.log('=================================================================');
}

run().catch((err) => {
  console.error('\n❌ Fatal error during voiceover generation:', err);
  process.exit(1);
});
