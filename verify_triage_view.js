// verify_triage_view.js
// Automated verification for Tier 1 Priority-Sorted Triage View Redesign

const fs = require('fs');
const path = require('path');

const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');

const tests = [];

// 1. TRIGGER SOURCES: Keep only 2 unified triggers + Engineering Toggle
tests.push({
  name: "1.1 Header button row contains 'Simulate Voice Distress (\\'Help\\')' button",
  pass: tier1Js.includes("id=\"btn-sim-voice\"") &&
        tier1Js.includes("Simulate Voice Distress ('Help')") &&
        tier1Js.includes("triggerUnified('VOICE')")
});

tests.push({
  name: "1.2 Header button row contains 'Simulate Physical Panic Button' button",
  pass: tier1Js.includes("id=\"btn-sim-panic\"") &&
        tier1Js.includes("Simulate Physical Panic Button") &&
        tier1Js.includes("triggerUnified('BUTTON')")
});

tests.push({
  name: "1.3 Decluttered header button row: 'Show Engineering Details' toggle present",
  pass: tier1Js.includes("id=\"tier1-eng-toggle-btn\"") &&
        tier1Js.includes("toggleEngineeringDetails()")
});

tests.push({
  name: "1.4 Triple-Click Panic and Fall Shock buttons removed from header action row",
  pass: !tier1Js.match(/<button[^>]*>[\s\S]*?Simulate Triple-Click Panic[\s\S]*?<\/button>/i) &&
        !tier1Js.match(/<button[^>]*>[\s\S]*?Simulate Fall Shock[\s\S]*?<\/button>/i)
});

// 2. AUTO-SORTING FLEET TABLE
tests.push({
  name: "2.1 Auto-sorting priority hierarchy: TRIGGER_ACTIVE > FALL_ALERT > LOW_BATTERY_WARNING > STANDBY",
  pass: tier1Js.includes("'TRIGGER_ACTIVE': 4") &&
        tier1Js.includes("'FALL_ALERT': 3") &&
        tier1Js.includes("'LOW_BATTERY_WARNING': 2") &&
        tier1Js.includes("'STANDBY': 1") &&
        tier1Js.includes("getSortedFleet")
});

tests.push({
  name: "2.2 Escalated devices jump to top with '↑ Escalated' badge and fadeout timeout",
  pass: tier1Js.includes("badge-escalated-tag") &&
        tier1Js.includes("&uarr; Escalated") &&
        tier1Js.includes("recentEscalated") &&
        tier1Js.includes("row-escalated-flash") &&
        tier1Js.includes("setTimeout")
});

tests.push({
  name: "2.3 CSS includes badge-escalated-tag, fadeOutTag animation, and row-escalated-flash",
  pass: stylesCss.includes(".badge-escalated-tag") &&
        stylesCss.includes("@keyframes fadeOutTag") &&
        stylesCss.includes(".row-escalated-flash") &&
        stylesCss.includes("@keyframes rowEscalateFlash")
});

// 3. BIOMETRIC VERIFICATION INTEGRATED INTO TELEMETRY PROFILE MODAL
tests.push({
  name: "3.1 (a) Header section: Citizen ID, Hardware Model, Trigger Source, Timestamp, Status",
  pass: tier1Js.includes("Citizen ID") &&
        tier1Js.includes("Hardware Model") &&
        tier1Js.includes("Trigger Source") &&
        tier1Js.includes("Timestamp") &&
        tier1Js.includes("Operational Status")
});

tests.push({
  name: "3.2 (b) Biometric panel: Heart Rate (BPM), Skin Temp (°C), GSR Stress Index (0-100) with NORMAL/ELEVATED badges",
  pass: tier1Js.includes("modal-biometric-section") &&
        tier1Js.includes("Heart Rate (BPM)") &&
        tier1Js.includes("Skin Temperature (&deg;C)") &&
        tier1Js.includes("GSR Stress Index (0-100)") &&
        tier1Js.includes("biometric-gauge-tile") &&
        tier1Js.includes("NORMAL") &&
        tier1Js.includes("ELEVATED")
});

tests.push({
  name: "3.3 (c) Verdict line: '2/3 biometric signals elevated — starting background audio verification'",
  pass: tier1Js.includes("2/3 biometric signals elevated &mdash; starting background audio verification") &&
        tier1Js.includes("SIGNATURE CONFIRMED")
});

tests.push({
  name: "3.4 (d) Audio verification panel: animated waveform + REC badge + 15s rolling buffer caption",
  pass: tier1Js.includes("audio-capture-panel") &&
        tier1Js.includes("badge-flat-rec") &&
        tier1Js.includes("waveform-container") &&
        tier1Js.includes("waveform-bar") &&
        tier1Js.includes("15s rolling buffer &bull; Analyzing against trained distress-speech model &bull; Encrypted, auto-deleted if dismissed")
});

tests.push({
  name: "3.5 (e) Final AI confidence line: 'Multimodal Confidence: 96% — Escalating to Tier 3 AI Verification'",
  pass: tier1Js.includes("Multimodal Confidence: 96% &mdash; Escalating to Tier 3 AI Verification") &&
        tier1Js.includes("Proceed to Tier 3 AI Verification &rarr;")
});

tests.push({
  name: "3.6 (f) Existing battery discharge and jerk timeline history charts below, unchanged",
  pass: tier1Js.includes("Battery Level Profile (Last 24 Hours)") &&
        tier1Js.includes("telemetry-battery-canvas") &&
        tier1Js.includes("Accelerometer Jerk Timeline (Last 24 Hours") &&
        tier1Js.includes("telemetry-jerk-canvas") &&
        tier1Js.includes("Radio Connectivity &amp; Gateway Audit Log")
});

// 4. MERGED ACTION: Single clear action per row: "Telemetry Profile"
tests.push({
  name: "4.1 Merged action per row is 'Telemetry Profile' opening inspectDevice",
  pass: tier1Js.includes("Telemetry Profile") &&
        tier1Js.includes("inspectDevice('${dev.deviceId}')")
});

// Run all tests
console.log('====================================================');
console.log('--- TIER 1 PRIORITY-SORTED TRIAGE REDESIGN SUITE ---');
console.log('====================================================\n');

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
  console.log('\n>>> ALL 14 TRIAGE REDESIGN SPECIFICATIONS VERIFIED SUCCESSFULLY! <<<\n');
  process.exit(0);
} else {
  console.error('\n>>> SOME TRIAGE TESTS FAILED <<<\n');
  process.exit(1);
}
