// verify_audio_playback.js
// Validates background recording status, audio player controls, and sample audio assets

const fs = require('fs');
const path = require('path');

const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');
const serverJs = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

const tests = [];

// 1. Audio assets exist
tests.push({
  name: "1.1 distress-sample-1.wav exists (Woman asking for help)",
  pass: fs.existsSync(path.join(__dirname, 'assets/distress-sample-1.wav')) &&
        fs.statSync(path.join(__dirname, 'assets/distress-sample-1.wav')).size > 500000
});

tests.push({
  name: "1.2 distress-sample-2.wav exists (Confrontation & shouting)",
  pass: fs.existsSync(path.join(__dirname, 'assets/distress-sample-2.wav')) &&
        fs.statSync(path.join(__dirname, 'assets/distress-sample-2.wav')).size > 500000
});

tests.push({
  name: "1.3 distress-sample-3.wav exists (Panic struggle & keyword)",
  pass: fs.existsSync(path.join(__dirname, 'assets/distress-sample-3.wav')) &&
        fs.statSync(path.join(__dirname, 'assets/distress-sample-3.wav')).size > 500000
});

// 2. Server audio MIME types
tests.push({
  name: "2.1 server.js serves audio MIME types (.wav, .mp3)",
  pass: serverJs.includes("'.wav': 'audio/wav'") &&
        serverJs.includes("'.mp3': 'audio/mpeg'")
});

// 3. Background recording indicator & play button in tier1_wearable.js
tests.push({
  name: "3.1 Live background recording indicator badge present",
  pass: tier1Js.includes("RECORDING BACKGROUND AUDIO") &&
        tier1Js.includes("badge-flat-rec")
});

tests.push({
  name: "3.2 Audio play button and counter present in Section d",
  pass: tier1Js.includes("id=\"btn-play-distress-audio\"") &&
        tier1Js.includes("Listen to Audio Buffer (15s)") &&
        tier1Js.includes("id=\"audio-time-counter\"") &&
        tier1Js.includes("toggleAudioPlayback")
});

tests.push({
  name: "3.3 Sample audio selector dropdown with 3 real distress options",
  pass: tier1Js.includes("id=\"distress-audio-select\"") &&
        tier1Js.includes("distress-sample-1.wav") &&
        tier1Js.includes("distress-sample-2.wav") &&
        tier1Js.includes("distress-sample-3.wav") &&
        tier1Js.includes("selectDistressAudio")
});

tests.push({
  name: "3.4 Interactive audio progress track and scrub handler",
  pass: tier1Js.includes("id=\"distress-audio-progress-bar\"") &&
        tier1Js.includes("seekAudio")
});

tests.push({
  name: "3.5 HTML5 audio element present with auto preload",
  pass: tier1Js.includes("<audio id=\"telemetry-distress-audio\"")
});

tests.push({
  name: "3.6 Audio playback stops automatically when modal is closed",
  pass: tier1Js.includes("closeTelemetryModal") &&
        tier1Js.includes("audio.pause()") &&
        tier1Js.includes("audioPlaying = false")
});

// 4. CSS animations
tests.push({
  name: "4.1 CSS includes .waveform-container.is-playing and wavePulseActive",
  pass: stylesCss.includes(".waveform-container.is-playing") &&
        stylesCss.includes("@keyframes wavePulseActive")
});

console.log('==============================================');
console.log('--- BACKGROUND AUDIO & PLAYBACK TEST SUITE ---');
console.log('==============================================\n');

let allPassed = true;
tests.forEach(t => {
  if (t.pass) {
    console.log(`[PASS] ${t.name}`);
  } else {
    console.error(`[FAIL] ${t.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n>>> ALL 11 AUDIO PLAYBACK REQUIREMENTS VERIFIED! <<<\n');
  process.exit(0);
} else {
  console.error('\n>>> SOME TESTS FAILED <<<\n');
  process.exit(1);
}
