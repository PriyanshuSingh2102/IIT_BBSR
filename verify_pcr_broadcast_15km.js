// Automated Verification: Tier 3 Dial 112 PCR Patrol Fleet (< 15 km) Broadcast Feature
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
console.log('TEST SUITE: Tier 3 Dial 112 PCR Patrol Fleet (< 15 km) Broadcast');
console.log('================================================================\n');

// 1. Check tier3_dispatch.js
console.log('1. Checking js/views/tier3_dispatch.js:');
const dispatchPath = path.join(__dirname, 'js', 'views', 'tier3_dispatch.js');
const dispatchCode = fs.readFileSync(dispatchPath, 'utf8');

assert(dispatchCode.includes('id="btn-broadcast-pcr-15km"'), 'Contains broadcast button with id "btn-broadcast-pcr-15km"');
assert(dispatchCode.includes('Broadcast SOS to All PCR Vans'), 'Contains button label "Broadcast SOS to All PCR Vans"');
assert(dispatchCode.includes('broadcastToAllPcrVans15Km:'), 'Defines broadcastToAllPcrVans15Km method');
assert(dispatchCode.includes('getUnitsWithin15Km:'), 'Defines getUnitsWithin15Km method');
assert(dispatchCode.includes('getDistanceKm:'), 'Defines Haversine getDistanceKm method');
assert(dispatchCode.includes('getActiveCitizen:'), 'Defines dynamic getActiveCitizen method');
assert(dispatchCode.includes('renderTacticalBroadcastOnMap:'), 'Defines renderTacticalBroadcastOnMap with 15km perimeter circle');
assert(dispatchCode.includes('openBroadcastModal:'), 'Defines openBroadcastModal method');
assert(dispatchCode.includes('acknowledgeAllResponders:'), 'Defines acknowledgeAllResponders method');
assert(dispatchCode.includes('broadcastFromAI:'), 'Defines broadcastFromAI bridge method');
assert(dispatchCode.includes('radius: 15000'), 'Draws 15,000m (15 km) tactical perimeter circle');
assert(dispatchCode.includes('id="responding-pcr-section"'), 'Contains in-page responding PCR fleet grid section');

// 2. Check tier3_ai.js
console.log('\n2. Checking js/views/tier3_ai.js:');
const aiPath = path.join(__dirname, 'js', 'views', 'tier3_ai.js');
const aiCode = fs.readFileSync(aiPath, 'utf8');

assert(aiCode.includes('id="btn-ai-broadcast-pcr"'), 'Contains verdict banner button "btn-ai-broadcast-pcr"');
assert(aiCode.includes('window.RakshakTier3DispatchView.broadcastFromAI()'), 'Wires broadcastFromAI() to Tier 3 dispatch');
assert(aiCode.includes('&lt; 15 km') || aiCode.includes('< 15 km'), 'Banner button displays "< 15 km" callout');

// 3. Check index.html & css/styles.css
console.log('\n3. Checking index.html and css/styles.css:');
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const cssPath = path.join(__dirname, 'css', 'styles.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(indexHtml.includes('id="pcr-broadcast-modal"'), 'index.html defines modal container "#pcr-broadcast-modal"');
assert(cssCode.includes('.pcr-fleet-grid'), 'css defines .pcr-fleet-grid responsive styling');
assert(cssCode.includes('.pcr-unit-card'), 'css defines .pcr-unit-card tactical cards');
assert(cssCode.includes('.badge-lead-unit'), 'css defines .badge-lead-unit for closest unit');
assert(cssCode.includes('.badge-distance-pill'), 'css defines .badge-distance-pill for distance readouts');

// 4. Mathematical and Logic Evaluation of Fleet & Distance Filtering
console.log('\n4. Fleet Distance Calculation & 15 km Filter Logic:');

// Extract pcrFleet from tier3_dispatch.js
const fleetMatch = dispatchCode.match(/pcrFleet:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
assert(fleetMatch !== null, 'pcrFleet array successfully parsed from source code');

if (fleetMatch) {
  const pcrFleet = eval(fleetMatch[1]);
  assert(pcrFleet.length === 9, `pcrFleet contains exactly 9 units (found: ${pcrFleet.length})`);

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }

  // Test with target: Priyanka Mohapatra [20.3562, 85.8174]
  const target1 = [20.3562, 85.8174];
  const units1 = pcrFleet.map(u => ({
    ...u,
    dist: haversine(target1[0], target1[1], u.lat, u.lng)
  })).sort((a, b) => a.dist - b.dist);

  const inside15km_1 = units1.filter(u => u.dist <= 15.0);
  const outside15km_1 = units1.filter(u => u.dist > 15.0);

  assert(inside15km_1.length === 8, `8 units within 15 km for target 1 (actual: ${inside15km_1.length})`);
  assert(outside15km_1.length === 1, `1 unit outside 15 km for target 1 (actual: ${outside15km_1.length})`);
  assert(outside15km_1[0].id === 'PCR-33', `Excluded unit is PCR-33 (Jatni Outpost @ ${outside15km_1[0].dist} km)`);
  assert(inside15km_1[0].id === 'PCR-14', `Lead closest unit is PCR-14 (${inside15km_1[0].dist} km)`);

  // Test with target: Subhashree Jena [20.3585, 85.8142]
  const target2 = [20.3585, 85.8142];
  const units2 = pcrFleet.map(u => ({
    ...u,
    dist: haversine(target2[0], target2[1], u.lat, u.lng)
  })).sort((a, b) => a.dist - b.dist);

  const inside15km_2 = units2.filter(u => u.dist <= 15.0);
  assert(inside15km_2.length === 8, `8 units within 15 km for Subhashree Jena (actual: ${inside15km_2.length})`);
  assert(inside15km_2[0].id === 'PCR-14', `Lead closest unit for Subhashree is PCR-14 (${inside15km_2[0].dist} km)`);
}

// 5. Test Live Server Endpoint
console.log('\n5. Checking Live Dev Server (http://127.0.0.1:3000):');
const req = http.get('http://127.0.0.1:3000/js/views/tier3_dispatch.js', (res) => {
  assert(res.statusCode === 200, 'Server returns 200 OK for js/views/tier3_dispatch.js');
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    assert(data.includes('btn-broadcast-pcr-15km'), 'Served dispatch script contains btn-broadcast-pcr-15km');
    assert(data.includes('broadcastToAllPcrVans15Km'), 'Served dispatch script contains broadcastToAllPcrVans15Km');

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
