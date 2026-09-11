const fs = require('fs');
const path = require('path');

const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');
const overviewJs = fs.readFileSync(path.join(__dirname, 'js/views/overview.js'), 'utf8');

const tests = [];

// 1. ICONS ON LEFT OF EACH ROW MATCHING EVENT TYPE
tests.push({
  name: '1a. Row 1: Signal/WiFi icon for network events (green)',
  pass: overviewJs.includes('activity-icon-cell') &&
        overviewJs.includes('M5 13a10 10 0 0 1 14 0') && // wifi arc
        overviewJs.includes('icon-status-green')
});

tests.push({
  name: '1b. Row 2: Checkmark-shield icon for self-tests (green)',
  pass: overviewJs.includes('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') && // shield
        overviewJs.includes('points="9 12 11 14 15 10"') // checkmark polyline
});

tests.push({
  name: '1c. Row 3: Battery icon for battery warnings (orange)',
  pass: overviewJs.includes('rect x="2" y="7" width="16" height="10"') && // battery
        overviewJs.includes('icon-status-warning') &&
        stylesCss.includes('icon-status-warning')
});

tests.push({
  name: '1d. Row 4: Routing/arrows icon for mesh optimization (gray)',
  pass: overviewJs.includes('M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15') && // route curve
        overviewJs.includes('icon-status-info')
});

tests.push({
  name: '1e. Row 5: Camera icon for CCTV events (green)',
  pass: overviewJs.includes('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z') && // camera
        overviewJs.includes('circle cx="12" cy="13" r="4"')
});

// 2. 4PX LEFT-BORDER STRIP ON ENTIRE ROW MATCHING STATUS COLOR
tests.push({
  name: '2a. Normal status rows have 4px solid green border (#16A34A)',
  pass: overviewJs.includes('row-status-normal') &&
        overviewJs.includes('border-left: 4px solid #16A34A') &&
        stylesCss.includes('row-status-normal') &&
        stylesCss.includes('border-left: 4px solid #16A34A')
});

tests.push({
  name: '2b. Warning status rows have 4px solid orange border (#F59E0B)',
  pass: overviewJs.includes('row-status-warning') &&
        overviewJs.includes('border-left: 4px solid #F59E0B') &&
        stylesCss.includes('row-status-warning') &&
        stylesCss.includes('border-left: 4px solid #F59E0B')
});

tests.push({
  name: '2c. Info status rows have 4px solid gray border (#94A3B8)',
  pass: overviewJs.includes('row-status-info') &&
        overviewJs.includes('border-left: 4px solid #94A3B8') &&
        stylesCss.includes('row-status-info') &&
        stylesCss.includes('border-left: 4px solid #94A3B8')
});

// 3. SHORTEN EVENT TYPE LINES
tests.push({
  name: '3. Event type lines are concise and punchy across all rows',
  pass: overviewJs.includes('Node #34 reconnected') &&
        overviewJs.includes('System self-test passed') &&
        overviewJs.includes('Wearable #0892 battery low') &&
        overviewJs.includes('Mesh route optimized') &&
        overviewJs.includes('CCTV optical flow refreshed')
});

// 4. SUBTLE AUTO-REFRESHING PULSING DOT
tests.push({
  name: '4. Subtle live pulsing dot next to "Real-time Telemetric Audit Feed"',
  pass: overviewJs.includes('live-pulse-dot') &&
        overviewJs.includes('Real-time Telemetric Audit Feed') &&
        stylesCss.includes('.live-pulse-dot') &&
        stylesCss.includes('live-dot-ping')
});

// 5. ROW HOVER EFFECT SHOWS SLIGHTLY DARKER BACKGROUND
tests.push({
  name: '5. Row hover shows slightly darker background (#EDF2F7)',
  pass: stylesCss.includes('.activity-row:hover') &&
        stylesCss.includes('#EDF2F7')
});

console.log('--- RECENT ACTIVITY LOG READABILITY VERIFICATION ---');
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
  console.log('\nVerification Result: ALL 5 RECENT ACTIVITY TABLE IMPROVEMENTS FULLY SATISFIED');
  process.exit(0);
} else {
  console.log('\nVerification Result: SOME ACTIVITY TABLE CHECKS FAILED');
  process.exit(1);
}
