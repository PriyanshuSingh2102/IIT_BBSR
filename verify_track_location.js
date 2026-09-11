// verify_track_location.js
// Verifies presence and wiring of the Track Location button in Tier 1 Wearable view

const fs = require('fs');
const path = require('path');

const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');

const tests = [
  {
    name: '1. Track Location button present in fleet table drawer under Diagnostics & Triage Action',
    pass: tier1Js.includes('btn-track-location') &&
          tier1Js.includes('Track Location') &&
          tier1Js.includes("trackLocation('${dev.deviceId}')")
  },
  {
    name: '2. Track Location method defined on window.RakshakTier1View',
    pass: tier1Js.includes('trackLocation: function(deviceId)')
  },
  {
    name: '3. Track Location switches tab to tier2_lora (Interactive Leaflet Safe Corridor real-time GIS map)',
    pass: tier1Js.includes("switchTab('tier2_lora')")
  },
  {
    name: '4. Telemetry Profile button preserved alongside Track Location',
    pass: tier1Js.includes('Telemetry Profile') &&
          tier1Js.includes("inspectDevice('${dev.deviceId}')")
  },
  {
    name: '5. Track Live Location in Tier 2 button available in Telemetry Profile Modal verdict actions',
    pass: tier1Js.includes('Track Live Location in Tier 2')
  }
];

console.log('\n=== VERIFY TRACK LOCATION BUTTON IN TIER 1 ===\n');
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
  console.log('\n>>> ALL TRACK LOCATION VERIFICATIONS PASSED <<<\n');
}
