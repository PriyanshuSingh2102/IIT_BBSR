const fs = require('fs');
const path = require('path');

const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');

const tests = [];

// 1. Simulate Voice Trigger button
tests.push({
  name: '1.1 Voice Trigger simulation button present in header',
  pass: tier1Js.includes('Simulate Voice Trigger') &&
        tier1Js.includes("simulateTrigger('VOICE_KEYWORD')")
});

// 2. Hardware stat cards row: 3 new sensors matching card style
tests.push({
  name: '2.1 Heart Rate Sensor (PPG) stat card present with badge and tooltip',
  pass: tier1Js.includes('Heart Rate Sensor (PPG)') &&
        tier1Js.includes('OPTICAL PPG') &&
        tier1Js.includes('74 BPM') &&
        tier1Js.includes('MAX30102 PPG Optical Biosensor')
});

tests.push({
  name: '2.2 Skin Temp Sensor stat card present with badge and tooltip',
  pass: tier1Js.includes('Skin Temp Sensor') &&
        tier1Js.includes('&plusmn;0.1&deg;C ACC') &&
        tier1Js.includes('33.8&deg;C') &&
        tier1Js.includes('High-Precision Medical NTC Thermistor')
});

tests.push({
  name: '2.3 GSR Stress Sensor stat card present with badge and tooltip',
  pass: tier1Js.includes('GSR Stress Sensor') &&
        tier1Js.includes('EDA TELEMETRY') &&
        tier1Js.includes('18 / 100') &&
        tier1Js.includes('Galvanic Skin Response (EDA)')
});

// 3. 3rd trigger source in architecture blueprint
tests.push({
  name: '3.1 Voice Keyword Detection present in hardware blueprint cards',
  pass: tier1Js.includes('Voice Keyword Detection') &&
        tier1Js.includes('Small on-device MEMS microphone listens locally for distress keywords')
});

// 4. Inline Biometric Stress Verification Panel
tests.push({
  name: '4.1 Biometric Stress Verification panel present and collapsed/hidden by default',
  pass: tier1Js.includes('id="tier1-biometric-panel"') &&
        tier1Js.includes('class="biometric-verification-card"') &&
        tier1Js.includes('style="display: none;"')
});

tests.push({
  name: '4.2 3 Live-updating mini gauges present (HR, Skin Temp, GSR) with NORMAL/ELEVATED badges',
  pass: tier1Js.includes('Heart Rate (BPM)') &&
        tier1Js.includes('Skin Temperature (&deg;C)') &&
        tier1Js.includes('GSR / Sweat Response') &&
        tier1Js.includes('id="bio-hr-val"') &&
        tier1Js.includes('id="bio-temp-val"') &&
        tier1Js.includes('id="bio-gsr-val"') &&
        tier1Js.includes('bio-hr-badge') &&
        tier1Js.includes('bio-temp-badge') &&
        tier1Js.includes('bio-gsr-badge')
});

tests.push({
  name: '4.3 Stress Signature Confirmed & Background Audio Capture block with REC badge and 15s buffer notice',
  pass: tier1Js.includes('Stress Signature Confirmed &mdash; Starting Background Audio Capture') &&
        tier1Js.includes('badge-flat-rec') &&
        tier1Js.includes('REC') &&
        tier1Js.includes('waveform-container') &&
        tier1Js.includes('waveform-bar') &&
        tier1Js.includes('15-second rolling buffer &bull; Encrypted &bull; Auto-deleted if alert is dismissed as false')
});

tests.push({
  name: '4.4 Final verdict line combining all 4 signals escalating to Tier 3',
  pass: tier1Js.includes('Multimodal Confidence: 96% &mdash; Escalating to AI Verification (Tier 3)') &&
        tier1Js.includes('Motion: Calm / Involuntary Stillness') &&
        tier1Js.includes('Voice: Keyword "HELP"') &&
        tier1Js.includes('Biometrics: 3/3 Elevated') &&
        tier1Js.includes('Audio Pattern: High-Stress Acoustic Tone') &&
        tier1Js.includes("switchTab('tier3_ai')")
});

tests.push({
  name: '4.5 Dynamic simulation methods defined (triggerVoiceBiometricsSimulation and resetBiometricVerification)',
  pass: tier1Js.includes('triggerVoiceBiometricsSimulation') &&
        tier1Js.includes('resetBiometricVerification') &&
        tier1Js.includes('bioTimer1') &&
        tier1Js.includes('bioTimer2') &&
        tier1Js.includes('bioTimer3')
});

// 5. CSS styles in styles.css
tests.push({
  name: '5.1 Flat CAD styling for biometric panel, gauges, REC badge, and waveforms in styles.css',
  pass: stylesCss.includes('.biometric-verification-card') &&
        stylesCss.includes('.biometric-gauge-tile') &&
        stylesCss.includes('.badge-flat-rec') &&
        stylesCss.includes('.waveform-container') &&
        stylesCss.includes('.waveform-bar') &&
        stylesCss.includes('@keyframes wavePulse') &&
        stylesCss.includes('.multimodal-verdict-card')
});

// Run Tests
console.log('--- TIER 1 VOICE KEYWORD & BIOMETRIC VERIFICATION SUITE ---');
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
  console.log('\n>>> ALL 10 TIER 1 VOICE & BIOMETRIC VERIFICATION SPECIFICATIONS VERIFIED <<<\n');
  process.exit(0);
} else {
  console.error('\n>>> SOME TESTS FAILED <<<\n');
  process.exit(1);
}
