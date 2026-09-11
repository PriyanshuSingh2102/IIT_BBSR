// verify_tier2_nearest_camera.js
// Automated verification for Tier 2 Half-Page Map, Nearest Camera Ranking & Multi-User GPS Tracking

const fs = require('fs');
const path = require('path');

const tier2Js = fs.readFileSync(path.join(__dirname, 'js/views/tier2_lora.js'), 'utf8');
const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');

const tests = [
  {
    name: '1. Removed Relay Nodes table from Tier 2',
    pass: !tier2Js.includes('Nearby Municipal Streetlight Relay Nodes (Infocity Corridor)') &&
          !tier2Js.includes('table-row-Node12')
  },
  {
    name: '2. Removed Cellular Coverage Status & LoRa Mesh Route cards from Tier 2',
    pass: !tier2Js.includes('Public Telco Cellular Link') &&
          !tier2Js.includes('Cellular Coverage Status') &&
          !tier2Js.includes('coverage-status-strip') &&
          !tier2Js.includes('badge-mesh-route')
  },
  {
    name: '3. Half-Page Map layout (440px height & full-width card)',
    pass: tier2Js.includes('id="tier2-leaflet-map"') &&
          stylesCss.includes('height: 440px;') &&
          tier2Js.includes('Half-Page View')
  },
  {
    name: '4. CCTV Cameras section positioned below map & ranked by nearest distance',
    pass: tier2Js.includes('id="tier2-cctv-container"') &&
          (tier2Js.includes('Nearby CCTV Cameras • Optical Intercept Matrix') || tier2Js.includes('Nearby CCTV Cameras &bull; Optical Intercept Matrix')) &&
          tier2Js.includes('getCamerasSortedByDistance') &&
          tier2Js.includes('getDistanceMeters') &&
          tier2Js.includes('cctv-distance-grid') &&
          tier2Js.includes('cctv-distance-card')
  },
  {
    name: '5. Unique real GPS coordinates for all unique fleet users',
    pass: tier2Js.includes('RN-WR-9204') &&
          tier2Js.includes('RN-WR-8812') &&
          tier2Js.includes('RN-WR-4401') &&
          tier2Js.includes('RN-WR-7719') &&
          tier2Js.includes('20.3562, 85.8174') && // Priyanka (Infocity)
          tier2Js.includes('20.3516, 85.8152') && // Subhashree (KIIT)
          tier2Js.includes('20.3475, 85.8180') && // Pattnaik (Patia)
          tier2Js.includes('20.3340, 85.8190')    // Mishra (Damana)
  },
  {
    name: '6. Citizen switcher dropdown in Tier 2 header',
    pass: tier2Js.includes('id="tier2-citizen-select"') &&
          tier2Js.includes('tracked-user-select') &&
          tier2Js.includes('window.RakshakTier2View.trackUser(this.value)')
  },
  {
    name: '7. trackUser method defined on window.RakshakTier2View',
    pass: tier2Js.includes('trackUser: function(deviceId)') &&
          tier2Js.includes('this.map.flyTo')
  },
  {
    name: '8. Tier 1 trackLocation calls trackUser(deviceId) and switches tab to tier2_lora',
    pass: tier1Js.includes('window.RakshakTier2View.trackUser(deviceId)') &&
          tier1Js.includes("switchTab('tier2_lora')")
  }
];

// Test runtime distance calculation logic
eval(`
  const window = { RakshakTier2View: {} };
  ${tier2Js}
  
  // Test Priyanka (Infocity) -> Closest should be CAM-PATIA-14B
  const priyankaCams = window.RakshakTier2View.getCamerasSortedByDistance([20.3562, 85.8174]);
  tests.push({
    name: '9. Distance logic: Priyanka Mohapatra closest camera is CAM-PATIA-14B (< 50m)',
    pass: priyankaCams[0].id === 'CAM-PATIA-14B' && priyankaCams[0].distanceMeters < 50
  });

  // Test Subhashree (KIIT) -> Closest should be CAM-KIIT-09
  const subhashreeCams = window.RakshakTier2View.getCamerasSortedByDistance([20.3516, 85.8152]);
  tests.push({
    name: '10. Distance logic: Subhashree Jena closest camera is CAM-KIIT-09 (< 50m)',
    pass: subhashreeCams[0].id === 'CAM-KIIT-09' && subhashreeCams[0].distanceMeters < 50
  });
`);

console.log('\n=== TIER 2 HALF-PAGE MAP & NEAREST CAMERA MATRIX VERIFICATION ===\n');
let failed = 0;
tests.forEach(t => {
  if (t.pass) {
    console.log(`[PASS] ${t.name}`);
  } else {
    console.error(`[FAIL] ${t.name}`);
    failed++;
  }
});

console.log(`\nResults: ${tests.length - failed}/${tests.length} passed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL TIER 2 NEAREST CAMERA & GPS TRACKING CHECKS PASSED <<<\n');
}
