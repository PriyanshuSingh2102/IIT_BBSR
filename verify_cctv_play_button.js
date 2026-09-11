// Automated Verification: Tier 2 CCTV Play Button & Tier 3 Footage Inspection
const fs = require('fs');
const path = require('path');
const http = require('http');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('================================================================');
console.log('TEST SUITE: CCTV Play Button & Tier 3 Footage Inspection');
console.log('================================================================\n');

// 1. Check js/views/tier2_lora.js
console.log('1. Checking js/views/tier2_lora.js:');
const tier2Path = path.join(__dirname, 'js', 'views', 'tier2_lora.js');
const tier2Code = fs.readFileSync(tier2Path, 'utf8');

assert(tier2Code.includes('btn-play-cctv'), 'Each camera card contains button with class "btn-play-cctv"');
assert(tier2Code.includes('Play Footage'), 'Camera card button contains label "Play Footage"');
assert(tier2Code.includes('playCameraFootageInTier3:'), 'tier2_lora.js defines playCameraFootageInTier3 method');
assert(tier2Code.includes('window.RakshakTier2View.playCameraFootageInTier3'), 'Button onclick wires to playCameraFootageInTier3(cam.id)');

// 2. Check js/views/tier3_ai.js
console.log('\n2. Checking js/views/tier3_ai.js:');
const tier3Path = path.join(__dirname, 'js', 'views', 'tier3_ai.js');
const tier3Code = fs.readFileSync(tier3Path, 'utf8');

assert(tier3Code.includes('activeCamera:'), 'tier3_ai.js defines activeCamera property');
assert(tier3Code.includes('loadCamera:'), 'tier3_ai.js defines loadCamera method');
assert(tier3Code.includes('${cam.id}'), 'tier3_ai.js dynamically injects ${cam.id}');
assert(tier3Code.includes('${cam.name}'), 'tier3_ai.js dynamically injects ${cam.name}');
assert(tier3Code.includes('${cam.poleId'), 'tier3_ai.js dynamically injects ${cam.poleId}');

// 3. Check css/styles.css
console.log('\n3. Checking css/styles.css:');
const cssPath = path.join(__dirname, 'css', 'styles.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(cssCode.includes('.btn-play-cctv'), 'css defines .btn-play-cctv button styles');
assert(cssCode.includes('.btn-play-cctv:hover'), 'css defines .btn-play-cctv:hover state');

// 4. Functional Execution Simulation
console.log('\n4. Functional Simulation (Navigating from Tier 2 Camera -> Tier 3 AI Footage):');

// Execute sandbox
let switchedToTab = null;
let chimePlayed = false;
const globalSandbox = {
  window: {
    RakshakApp: {
      switchTab: function(tabId) { switchedToTab = tabId; },
      playChime: function() { chimePlayed = true; }
    },
    RakshakTier3AIView: {},
    RakshakTier2View: {}
  }
};

eval(`
  (function() {
    const window = globalSandbox.window;
    ${tier3Code}
    ${tier2Code}
    globalSandbox.window.RakshakTier3AIView = window.RakshakTier3AIView;
    globalSandbox.window.RakshakTier2View = window.RakshakTier2View;
  })();
`);

const tier2 = globalSandbox.window.RakshakTier2View;
const tier3 = globalSandbox.window.RakshakTier3AIView;

// Test clicking CAM-PATIA-14B (Closest camera)
switchedToTab = null;
chimePlayed = false;
tier2.playCameraFootageInTier3('CAM-PATIA-14B');

assert(switchedToTab === 'tier3_ai', 'Clicking play button automatically switches tab to "tier3_ai"');
assert(chimePlayed === true, 'Audio chime played upon clicking play button');
assert(tier3.activeCamera !== null, 'Tier 3 AI activeCamera was populated');
assert(tier3.activeCamera.id === 'CAM-PATIA-14B', 'Active camera ID is CAM-PATIA-14B');
assert(tier3.activeCamera.poleId === 'OD-BMC-CCTV-1402', 'Active camera poleId is OD-BMC-CCTV-1402');

// Test clicking CAM-KIIT-09
switchedToTab = null;
tier2.playCameraFootageInTier3('CAM-KIIT-09');

assert(switchedToTab === 'tier3_ai', 'Clicking CAM-KIIT-09 switches tab to "tier3_ai"');
assert(tier3.activeCamera.id === 'CAM-KIIT-09', 'Active camera ID updated to CAM-KIIT-09');
assert(tier3.activeCamera.name === 'KIIT Square Lane 4 Corner', 'Active camera name is KIIT Square Lane 4 Corner');

// 5. Test Live Server Endpoint
console.log('\n5. Checking Live Dev Server (http://127.0.0.1:3000):');
const req = http.get('http://127.0.0.1:3000/js/views/tier2_lora.js', (res) => {
  assert(res.statusCode === 200, 'Server returns 200 OK for js/views/tier2_lora.js');
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    assert(data.includes('btn-play-cctv'), 'Served tier2 script contains btn-play-cctv');
    assert(data.includes('playCameraFootageInTier3'), 'Served tier2 script contains playCameraFootageInTier3');

    console.log('\n================================================================');
    console.log(`RESULTS: ${testsPassed} Passed, ${testsFailed} Failed`);
    console.log('================================================================\n');

    process.exit(testsFailed > 0 ? 1 : 0);
  });
});

req.on('error', (err) => {
  console.warn(`Server request warning: ${err.message}`);
  console.log(`RESULTS: ${testsPassed} Passed, ${testsFailed} Failed`);
  process.exit(testsFailed > 0 ? 1 : 0);
});
