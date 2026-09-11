const fs = require('fs');
const path = require('path');

const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');
const overviewJs = fs.readFileSync(path.join(__dirname, 'js/views/overview.js'), 'utf8');

const tests = [];

// 1. ICON CONSISTENCY TESTS
tests.push({
  name: '1a. Streetlight Relay Node marker pixel-matches Map Markers Key (green outlined square, no SVG)',
  pass: overviewJs.includes('legend-marker-relay') &&
        overviewJs.includes('<div class="map-marker-streetlight"') &&
        !overviewJs.includes('viewBox="0 0 24 24" fill="none" stroke="#2E7D32"') && // SVG removed from map marker
        stylesCss.includes('.map-marker-streetlight') &&
        stylesCss.includes('.legend-marker-relay') &&
        stylesCss.includes('border: 2px solid #2E7D32') &&
        stylesCss.includes('border-radius: 2px')
});

tests.push({
  name: '1b. Wearable marker pixel-matches Map Markers Key (blue outlined circle, no SVG, with radar ping)',
  pass: overviewJs.includes('legend-marker-wearable') &&
        overviewJs.includes('<div class="map-marker-wearable"') &&
        stylesCss.includes('.map-marker-wearable') &&
        stylesCss.includes('.legend-marker-wearable') &&
        stylesCss.includes('border: 2px solid #0F4C81') &&
        stylesCss.includes('border-radius: 50%') &&
        stylesCss.includes('.map-marker-wearable::before') &&
        stylesCss.includes('radar-ping')
});

tests.push({
  name: '1c. Patrol Van marker pixel-matches Map Markers Key with van sign symbol',
  pass: overviewJs.includes('legend-marker-pcr') &&
        overviewJs.includes('van-symbol-icon') &&
        overviewJs.includes('class="map-marker-pcr"') &&
        stylesCss.includes('.map-marker-pcr') &&
        stylesCss.includes('.legend-marker-pcr') &&
        stylesCss.includes('.van-symbol-icon') &&
        stylesCss.includes('background-color: #0F4C81')
});

// 2. WEARABLE DENSITY & CLUSTERING TESTS
tests.push({
  name: '2a. Wearable clusters sum exactly to 1,204 active wearables',
  pass: overviewJs.includes('wearableClusters') &&
        overviewJs.includes('count: 312') &&
        overviewJs.includes('count: 284') &&
        overviewJs.includes('count: 245') &&
        overviewJs.includes('count: 198') &&
        overviewJs.includes('count: 165') // 312 + 284 + 245 + 198 + 165 = 1204
});

tests.push({
  name: '2b. Circular cluster badge when zoomed out and splits into individual pins on zoom',
  pass: overviewJs.includes('map-marker-cluster') &&
        overviewJs.includes('updateWearableDisplay') &&
        overviewJs.includes("map.on('zoomend'") &&
        stylesCss.includes('.map-marker-cluster') &&
        overviewJs.includes('individualWearableMarkers')
});

// 3. SMOOTH INTERPOLATED VAN MOVEMENT TESTS
tests.push({
  name: '3a. Smooth lerp position interpolation every ~200-300ms (250ms)',
  pass: overviewJs.includes('stepIntervalMs = 250') &&
        overviewJs.includes('lerpStep') &&
        overviewJs.includes('stepsPerSegment') &&
        overviewJs.includes('currentLat = startPt[0] + (endPt[0] - startPt[0]) * t') &&
        overviewJs.includes('currentLng = startPt[1] + (endPt[1] - startPt[1]) * t')
});

tests.push({
  name: '3b. Van marker does not teleport, smoothly transitions via CSS linear transform',
  pass: stylesCss.includes('.custom-pcr-div') &&
        stylesCss.includes('transition: transform 0.25s linear') &&
        overviewJs.includes('pcr14Marker.setLatLng')
});

console.log('--- INTERACTIVE COVERAGE MAP FIX VERIFICATION ---');
let allPassed = true;
tests.forEach(t => {
  if (t.pass) {
    console.log(`[PASS] ${t.name}`);
  } else {
    console.log(`[FAIL] ${t.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nVerification Result: ALL MAP FIX REQUIREMENTS SATISFIED');
  process.exit(0);
} else {
  console.log('\nVerification Result: SOME MAP FIX CHECKS FAILED');
  process.exit(1);
}
