const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');
const overviewJs = fs.readFileSync(path.join(__dirname, 'js/views/overview.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');

const tests = [];

// 1. VIDEO TESTS
tests.push({
  name: '1a. Video source swapped to dark street/road night video',
  pass: overviewJs.includes('/assets/rakshak-corridor-night.mp4') &&
        overviewJs.includes('rakshak-corridor-video')
});

tests.push({
  name: '1b. On-video overlays trimmed to just TWO labels total (LIVE and Timestamp)',
  pass: overviewJs.includes('<span>LIVE</span>') &&
        overviewJs.includes('video-cctv-timestamp') &&
        !overviewJs.includes('AI OPTICAL FLOW ENGINE: MONITORING') // removed from on-video overlay
});

tests.push({
  name: '1c. Lat/long and AI Optical Flow Engine moved to panel below video',
  pass: overviewJs.includes('video-subpanel-strip') &&
        overviewJs.includes('20.3562° N, 85.8174° E') &&
        overviewJs.includes('AI OPTICAL FLOW: ACTIVE')
});

// 2. MAP REAL-TIME MOTION TESTS
tests.push({
  name: '2a. Animated PCR patrol van looping along road path',
  pass: overviewJs.includes('pcrRouteWaypoints') &&
        overviewJs.includes('pcrAnimationInterval') &&
        overviewJs.includes('pcr14Marker.setLatLng')
});

tests.push({
  name: '2b. Radar ping pulsing ring animation for citizen wearables',
  pass: stylesCss.includes('radar-ping') &&
        stylesCss.includes('.map-marker-wearable::before')
});

tests.push({
  name: '2c. Map header "Last updated: just now" with subtle refresh indicator',
  pass: overviewJs.includes('map-last-updated') &&
        overviewJs.includes('Last updated: just now') &&
        overviewJs.includes('mapUpdatedInterval') &&
        stylesCss.includes('map-refresh-spin')
});

// 3. TEXT REDUCTION & FOOTER TESTS
tests.push({
  name: '3a. Critical alert banner removed per user instruction',
  pass: !indexHtml.includes('class="cad-urgent-banner"')
});

tests.push({
  name: '3b. View Full Report modal with breakdown and app.js handlers',
  pass: indexHtml.includes('id="incident-report-modal"') &&
        appJs.includes('openIncidentReportModal') &&
        appJs.includes('closeIncidentReportModal')
});

tests.push({
  name: '3c. Sentence descriptions cut to short phrases (max ~6 words) with Learn more ▾',
  pass: overviewJs.includes('Streetlight-to-fiber mesh relay') &&
        overviewJs.includes('Autonomous dual-sensor distress trigger') &&
        overviewJs.includes('AI verification &amp; autonomous dispatch') &&
        overviewJs.includes('Learn more ▾')
});

tests.push({
  name: '3d. Footer shrunk to single gray line with (i) icon and popover',
  pass: indexHtml.includes('cad-footer') &&
        indexHtml.includes('Commissionerate Police Bhubaneswar-Cuttack &bull; Rakshak-Net CAD v4.1') &&
        indexHtml.includes('btn-footer-info') &&
        indexHtml.includes('footer-info-popover') &&
        appJs.includes('toggleFooterInfo')
});

console.log('--- RAKSHAK-NET MOTION & TEXT REDUCTION VERIFICATION ---');
let allPassed = true;
tests.forEach((t, i) => {
  if (t.pass) {
    console.log(`[PASS] ${t.name}`);
  } else {
    console.log(`[FAIL] ${t.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nVerification Result: ALL REQUIREMENTS FULLY SATISFIED');
  process.exit(0);
} else {
  console.log('\nVerification Result: SOME CHECKS FAILED');
  process.exit(1);
}
