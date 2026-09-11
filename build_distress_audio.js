// build_distress_audio.js
// Generates realistic 15-second ambient distress audio buffers with authentic voices & background sound

const fs = require('fs');
const path = require('path');

function readWav(filePath) {
  const buf = fs.readFileSync(filePath);
  // Find 'fmt ' and 'data' subchunks
  let offset = 12;
  let fmt = null;
  let data = null;

  while (offset < buf.length) {
    const chunkId = buf.toString('ascii', offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    if (chunkId === 'fmt ') {
      fmt = {
        format: buf.readUInt16LE(offset + 8),
        channels: buf.readUInt16LE(offset + 10),
        sampleRate: buf.readUInt32LE(offset + 12),
        bitsPerSample: buf.readUInt16LE(offset + 22)
      };
    } else if (chunkId === 'data') {
      data = buf.slice(offset + 8, offset + 8 + chunkSize);
      break;
    }
    offset += 8 + chunkSize;
  }

  // Convert 16-bit PCM to Float32 [-1, 1]
  const numSamples = data.length / 2;
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const s = data.readInt16LE(i * 2);
    samples[i] = s / 32768.0;
  }

  return { fmt, samples };
}

function writeWav(filePath, samples, sampleRate) {
  const numSamples = samples.length;
  const bytesPerSample = 2; // 16-bit
  const dataSize = numSamples * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22); // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    let s = samples[i];
    // Clamp
    if (s > 1.0) s = 1.0;
    if (s < -1.0) s = -1.0;
    const val = Math.round(s * 32767);
    buffer.writeInt16LE(val, 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
  console.log(`[WAV CREATED] ${filePath} (${(numSamples / sampleRate).toFixed(1)}s, ${buffer.length} bytes)`);
}

function resample(srcSamples, srcRate, destRate, targetDurationSec) {
  const targetSamples = Math.round(destRate * targetDurationSec);
  const out = new Float32Array(targetSamples);
  const ratio = srcRate / destRate;

  for (let i = 0; i < targetSamples; i++) {
    const srcIdx = i * ratio;
    const baseIdx = Math.floor(srcIdx);
    const frac = srcIdx - baseIdx;
    if (baseIdx + 1 < srcSamples.length) {
      out[i] = srcSamples[baseIdx] * (1 - frac) + srcSamples[baseIdx + 1] * frac;
    } else if (baseIdx < srcSamples.length) {
      out[i] = srcSamples[baseIdx];
    } else {
      out[i] = 0;
    }
  }
  return out;
}

// Generate realistic background sound effects
function generateFootstep(sampleRate, durationSec, intensity) {
  const numSamples = Math.round(sampleRate * durationSec);
  const out = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 28) * (1 - Math.exp(-t * 400));
    // Low frequency thud + rustle
    const thud = Math.sin(2 * Math.PI * 85 * t) + 0.5 * Math.sin(2 * Math.PI * 140 * t);
    const noise = (Math.random() * 2 - 1) * 0.4;
    out[i] = (thud * 0.7 + noise * 0.3) * env * intensity;
  }
  return out;
}

function generateHeavyBreath(sampleRate, durationSec, intensity) {
  const numSamples = Math.round(sampleRate * durationSec);
  const out = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Inhale / exhale envelope
    const env = Math.sin(Math.PI * (t / durationSec));
    // Filtered noise
    const noise = (Math.random() * 2 - 1);
    out[i] = noise * Math.pow(env, 2) * intensity;
  }
  return out;
}

function buildScenario(voicePath, outPath, scenarioType) {
  const sampleRate = 22050;
  const durationSec = 15.0;
  const totalSamples = sampleRate * durationSec;
  const output = new Float32Array(totalSamples);

  // 1. Ambient street / room background noise (pink-ish rumble)
  let lastNoise = 0;
  for (let i = 0; i < totalSamples; i++) {
    const white = Math.random() * 2 - 1;
    lastNoise = (lastNoise * 0.94) + (white * 0.06); // Low-pass filter for night atmosphere
    const hum = Math.sin(2 * Math.PI * 50 * (i / sampleRate)) * 0.015; // 50Hz mains hum
    output[i] += (lastNoise * 0.045) + hum;
  }

  // 2. Heavy distressed breathing cycles throughout 15s
  const breathTimes = [0.8, 2.2, 5.8, 7.5, 9.8, 12.0, 13.6];
  breathTimes.forEach(bt => {
    const breath = generateHeavyBreath(sampleRate, 0.7, 0.18);
    const startIdx = Math.round(bt * sampleRate);
    for (let j = 0; j < breath.length && (startIdx + j) < totalSamples; j++) {
      output[startIdx + j] += breath[j];
    }
  });

  // 3. Panicked rapid footsteps (running / scuffling)
  const stepTimes = [
    0.3, 0.7, 1.1, 1.5, 1.9,
    4.2, 4.6, 5.0, 5.4, 5.9,
    8.2, 8.6, 9.1, 9.5, 10.0, 10.5,
    11.8, 12.3, 12.8, 13.3, 13.9, 14.4
  ];
  stepTimes.forEach(st => {
    const step = generateFootstep(sampleRate, 0.12, 0.22);
    const startIdx = Math.round(st * sampleRate);
    for (let j = 0; j < step.length && (startIdx + j) < totalSamples; j++) {
      output[startIdx + j] += step[j];
    }
  });

  // 4. Distress heart thumping (intermittent autonomic stress cue)
  const heartBeatTimes = [1.2, 1.6, 2.0, 2.4, 2.8, 6.0, 6.4, 6.8, 7.2, 10.4, 10.8, 11.2];
  heartBeatTimes.forEach(ht => {
    const startIdx = Math.round(ht * sampleRate);
    const beatLen = Math.round(sampleRate * 0.08);
    for (let j = 0; j < beatLen && (startIdx + j) < totalSamples; j++) {
      const t = j / sampleRate;
      output[startIdx + j] += Math.sin(2 * Math.PI * 65 * t) * Math.exp(-t * 50) * 0.24;
    }
  });

  // 5. Load and overlay the voice shouts
  if (fs.existsSync(voicePath)) {
    const wavData = readWav(voicePath);
    const voiceSamples = resample(wavData.samples, wavData.fmt.sampleRate, sampleRate, 10.0);
    
    // Position voice shouting from second 2.5 to 12.5
    const voiceStart = Math.round(2.5 * sampleRate);
    for (let i = 0; i < voiceSamples.length && (voiceStart + i) < totalSamples; i++) {
      // Voice with slight wearable mic saturation
      let v = voiceSamples[i] * 1.15;
      output[voiceStart + i] += v;
    }
  }

  // 6. Wearable microphone codec bandpass filter (300Hz - 3400Hz voiceband)
  // Simple 2-pole IIR filter emulation
  let y1 = 0, y2 = 0;
  for (let i = 0; i < totalSamples; i++) {
    const s = output[i];
    // Gentle high-pass to remove DC & sub-bass rumble
    const hp = s - lastNoise * 0.3;
    // Soft limiter / compression
    output[i] = Math.tanh(hp * 1.25) * 0.88;
  }

  writeWav(outPath, output, sampleRate);
}

// Build 3 distinct scenarios
const ziraPath = path.join(__dirname, 'assets/distress-voice-zira.wav');
const davidPath = path.join(__dirname, 'assets/distress-voice-david.wav');

buildScenario(ziraPath, path.join(__dirname, 'assets/distress-sample-1.wav'), 'female_help');
buildScenario(davidPath, path.join(__dirname, 'assets/distress-sample-2.wav'), 'male_confrontation');

// Scenario 3: Mixed voices (confrontation struggle with both voices)
function buildConfrontation(outPath) {
  const sampleRate = 22050;
  const durationSec = 15.0;
  const totalSamples = sampleRate * durationSec;
  const output = new Float32Array(totalSamples);

  // Load both
  const zira = readWav(ziraPath);
  const david = readWav(davidPath);

  const ziraResampled = resample(zira.samples, zira.fmt.sampleRate, sampleRate, 6.0);
  const davidResampled = resample(david.samples, david.fmt.sampleRate, sampleRate, 6.0);

  // Background noise & scuffle
  let lastNoise = 0;
  for (let i = 0; i < totalSamples; i++) {
    const white = Math.random() * 2 - 1;
    lastNoise = (lastNoise * 0.93) + (white * 0.07);
    output[i] += (lastNoise * 0.05);
  }

  // Rapid struggling scuffle
  for (let t = 0.5; t < 14.5; t += 0.35 + Math.random() * 0.3) {
    const step = generateFootstep(sampleRate, 0.15, 0.28);
    const start = Math.round(t * sampleRate);
    for (let j = 0; j < step.length && (start + j) < totalSamples; j++) {
      output[start + j] += step[j];
    }
  }

  // David shouts first at 1.5s: "Hey! Stop right there!"
  const dStart = Math.round(1.5 * sampleRate);
  for (let i = 0; i < davidResampled.length && (dStart + i) < totalSamples; i++) {
    output[dStart + i] += davidResampled[i] * 1.0;
  }

  // Zira screams at 6.0s: "Help! Please help me! Get away!"
  const zStart = Math.round(6.2 * sampleRate);
  for (let i = 0; i < ziraResampled.length && (zStart + i) < totalSamples; i++) {
    output[zStart + i] += ziraResampled[i] * 1.25;
  }

  // Final normalize & soft clamp
  for (let i = 0; i < totalSamples; i++) {
    output[i] = Math.tanh(output[i] * 1.3) * 0.90;
  }

  writeWav(outPath, output, sampleRate);
}

buildConfrontation(path.join(__dirname, 'assets/distress-sample-3.wav'));
console.log('All 3 distress audio scenarios built successfully.');
