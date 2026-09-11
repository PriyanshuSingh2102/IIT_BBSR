// test_e2e_dom_simulation.js
// Complete headless runtime simulation of window.RakshakTier1View

const fs = require('fs');
const path = require('path');

// Setup mock window & document
global.window = global;
global.document = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id: id,
        innerHTML: '',
        style: {},
        classList: {
          classes: new Set(),
          add: function(c) { this.classes.add(c); },
          remove: function(c) { this.classes.delete(c); },
          toggle: function(c, val) { if (val) this.classes.add(c); else this.classes.delete(c); },
          contains: function(c) { return this.classes.has(c); }
        }
      };
    }
    return this.elements[id];
  },
  querySelector: function(sel) {
    return { remove: function() {} };
  }
};

// Mock data
global.window.RakshakData = {
  wearablesFleet: [
    {
      deviceId: "RN-WR-9204",
      registeredUser: "P. Mohapatra",
      model: "Band X1",
      batteryPercent: 89,
      voltage: "4.12V",
      status: "STANDBY",
      accelState: "0.98G (Nominal)",
      buttonClicks: 0,
      bleRssi: -58,
      pdrRate: "99.8%",
      lastHeartbeat: "12s ago",
      aesKeyStatus: "SYNCED"
    },
    {
      deviceId: "RN-WR-8812",
      registeredUser: "Subhashree Jena",
      model: "Pendant Pro",
      batteryPercent: 74,
      voltage: "3.98V",
      status: "FALL_ALERT",
      accelState: "FALL_IMPACT (5.76G)",
      buttonClicks: 0,
      bleRssi: -64,
      pdrRate: "99.4%",
      lastHeartbeat: "4s ago",
      aesKeyStatus: "SYNCED"
    },
    {
      deviceId: "RN-WR-4401",
      registeredUser: "S. Pattnaik",
      model: "Pendant Pro",
      batteryPercent: 74,
      voltage: "3.98V",
      status: "STANDBY",
      accelState: "1.02G (Nominal)",
      buttonClicks: 0,
      bleRssi: -64,
      pdrRate: "99.4%",
      lastHeartbeat: "4s ago",
      aesKeyStatus: "SYNCED"
    },
    {
      deviceId: "RN-WR-7719",
      registeredUser: "A. Mishra",
      model: "Band X1",
      batteryPercent: 18,
      voltage: "3.42V",
      status: "LOW_BATTERY_WARNING",
      accelState: "0.99G (Nominal)",
      buttonClicks: 0,
      bleRssi: -72,
      pdrRate: "98.1%",
      lastHeartbeat: "30s ago",
      aesKeyStatus: "SYNCED"
    }
  ]
};

global.window.RakshakApp = {
  playChime: function() { console.log('   [Audio] Alert chime played'); },
  switchTab: function(tab) { console.log('   [Navigation] Switched tab to:', tab); }
};

global.Chart = function() {
  return { destroy: function() {} };
};

// Load tier1_wearable.js
require('./js/views/tier1_wearable.js');

console.log('--- STARTING RUNTIME E2E DOM SIMULATION ---');

const container = { innerHTML: '' };
window.RakshakTier1View.render(container);

// Verify container rendered
console.log('1. Initial Render Test:');
if (container.innerHTML.includes("Simulate Voice Distress ('Help')") &&
    container.innerHTML.includes("Simulate Physical Panic Button")) {
  console.log('   [PASS] Unified buttons rendered properly in header row');
} else {
  console.error('   [FAIL] Unified buttons missing in initial render');
  process.exit(1);
}

// Check initial order
let sorted = window.RakshakTier1View.getSortedFleet();
console.log('2. Initial Fleet Sorting:');
console.log('   Top device:', sorted[0].deviceId, 'Status:', sorted[0].status);
if (sorted[0].status === 'LOW_BATTERY_WARNING') {
  console.log('   [PASS] LOW_BATTERY_WARNING (priority 2) is above STANDBY (priority 1)');
}

// Simulate Voice Trigger
console.log('3. Simulating Voice Distress Trigger:');
window.RakshakTier1View.triggerUnified('VOICE');

sorted = window.RakshakTier1View.getSortedFleet();
console.log('   New top device after voice trigger:', sorted[0].deviceId, 'Status:', sorted[0].status);
if ((sorted[0].deviceId === 'RN-WR-9204' || sorted[0].deviceId === 'RN-WR-4401') && sorted[0].status === 'TRIGGER_ACTIVE') {
  console.log('   [PASS] Triggered device', sorted[0].deviceId, 'moved to the TOP of the fleet table!');
} else {
  console.error('   [FAIL] Expected triggered device at top with TRIGGER_ACTIVE');
  process.exit(1);
}

// Check table HTML rendering
const tableHtml = window.RakshakTier1View.renderFleetTableRowsHtml();
if (tableHtml.includes('&uarr; Escalated')) {
  console.log('   [PASS] Escalated badge "↑ Escalated" successfully generated in top row HTML');
} else {
  console.error('   [FAIL] Missing ↑ Escalated badge');
  process.exit(1);
}

// Inspect Telemetry Profile Modal for Priyanka Mohapatra
console.log('4. Inspecting Telemetry Profile Modal (Priyanka Mohapatra - RN-WR-9204):');
window.RakshakTier1View.inspectDevice('RN-WR-9204');

const modal = document.getElementById('telemetry-profile-modal');
const modalTitle = document.getElementById('telemetry-modal-title');
const modalBody = document.getElementById('telemetry-modal-body');

if (modal.style.display === 'flex') {
  console.log('   [PASS] Modal display set to flex');
}

if (modalTitle.innerHTML.includes('RN-WR-9204')) {
  console.log('   [PASS] Modal title contains device ID RN-WR-9204');
}

// Check sections (a) through (f) in modalBody
const bHtml = modalBody.innerHTML;

const hasSectionA = bHtml.includes('Citizen ID') && bHtml.includes("Voice Distress ('Help')");
const hasSectionB = bHtml.includes('Heart Rate (BPM)') && bHtml.includes('Skin Temperature (&deg;C)') && bHtml.includes('GSR Stress Index (0-100)') && bHtml.includes('ELEVATED');
const hasSectionC = bHtml.includes('2/3 biometric signals elevated &mdash; starting background audio verification');
const hasSectionD = bHtml.includes('15s rolling buffer &bull; Analyzing against trained distress-speech model &bull; Encrypted, auto-deleted if dismissed') && bHtml.includes('badge-flat-rec');
const hasSectionE = bHtml.includes('Multimodal Confidence: 96% &mdash; Escalating to Tier 3 AI Verification');
const hasSectionF = bHtml.includes('telemetry-battery-canvas') && bHtml.includes('telemetry-jerk-canvas');
const hasAudio1 = bHtml.includes('user-distress-audio-1.wav') && bHtml.includes('Priyanka Mohapatra');

console.log('   (a) Header Section:', hasSectionA ? '[PASS]' : '[FAIL]');
console.log('   (b) Biometric Gauges Section:', hasSectionB ? '[PASS]' : '[FAIL]');
console.log('   (c) Biometric Verdict Line:', hasSectionC ? '[PASS]' : '[FAIL]');
console.log('   (d) 15s Audio Capture Panel:', hasSectionD ? '[PASS]' : '[FAIL]');
console.log('   (e) Multimodal AI Confidence Line:', hasSectionE ? '[PASS]' : '[FAIL]');
console.log('   (f) Battery & Jerk Canvas Sections:', hasSectionF ? '[PASS]' : '[FAIL]');
console.log('   (g) Priyanka Mohapatra fixed Audio 1:', hasAudio1 ? '[PASS]' : '[FAIL]');

// Also test Subhashree Jena (RN-WR-8812) binding to Audio 2
console.log('5. Inspecting Telemetry Profile Modal (Subhashree Jena - RN-WR-8812):');
window.RakshakTier1View.inspectDevice('RN-WR-8812');
const sHtml = modalBody.innerHTML;
const hasAudio2 = sHtml.includes('user-distress-audio-2.wav') && sHtml.includes('Subhashree Jena');
console.log('   (h) Subhashree Jena fixed Audio 2:', hasAudio2 ? '[PASS]' : '[FAIL]');

if (hasSectionA && hasSectionB && hasSectionC && hasSectionD && hasSectionE && hasSectionF && hasAudio1 && hasAudio2) {
  console.log('\n>>> E2E RUNTIME DOM SIMULATION PASSED COMPLETELY! <<<');
} else {
  console.error('\n>>> SOME SECTIONS FAILED IN MODAL BODY <<<');
  process.exit(1);
}
