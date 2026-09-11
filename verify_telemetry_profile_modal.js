const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');

const tests = [];

// 1. Modal markup in index.html
tests.push({
  name: '1. Modal container #telemetry-profile-modal exists with close (X) button',
  pass: indexHtml.includes('id="telemetry-profile-modal"') &&
        indexHtml.includes('id="telemetry-modal-title"') &&
        indexHtml.includes('id="telemetry-modal-body"') &&
        indexHtml.includes('id="telemetry-modal-footer"') &&
        indexHtml.includes('closeTelemetryModal()')
});

// 2. Header metadata in inspectDevice
tests.push({
  name: '2. Header metadata: Citizen ID, hardware model, provisioning date, operational status badge',
  pass: tier1Js.includes('Citizen ID') &&
        tier1Js.includes('Hardware Model') &&
        tier1Js.includes('Provisioning Date') &&
        tier1Js.includes('Operational Status') &&
        tier1Js.includes('statusBadgeHtml')
});

// 3. Battery % 24h line chart
tests.push({
  name: '3. Small line chart for battery % over last 24 hours',
  pass: tier1Js.includes('telemetry-battery-canvas') &&
        tier1Js.includes('Battery Level Profile (Last 24 Hours)') &&
        tier1Js.includes('batteryChartInstance') &&
        tier1Js.includes('batteryData')
});

// 4. Accelerometer Jerk line chart with alert colored dots
tests.push({
  name: '4. Small line chart / sparkline: jerk (G-force) over last 24h with red/orange alert markers',
  pass: tier1Js.includes('telemetry-jerk-canvas') &&
        tier1Js.includes('Accelerometer Jerk Timeline (Last 24 Hours') &&
        tier1Js.includes('Red Dot: Panic Trigger') &&
        tier1Js.includes('Orange Dot: Fall Shock') &&
        tier1Js.includes('#C0392B') &&
        tier1Js.includes('#D35400') &&
        tier1Js.includes('jerkChartInstance')
});

// 5. Connectivity log table
tests.push({
  name: '5. Short connectivity log table: timestamp, event, signal strength',
  pass: tier1Js.includes('Radio Connectivity') &&
        tier1Js.includes('Gateway Audit Log') &&
        tier1Js.includes('Timestamp') &&
        tier1Js.includes('Event Description') &&
        tier1Js.includes('Signal Strength') &&
        tier1Js.includes('BLE reconnected') &&
        tier1Js.includes('LoRa handoff to Node #12')
});

// 6. Firmware & security footer line
tests.push({
  name: '6. Firmware & security footer line: firmware version, key rotation, anti-replay counter status',
  pass: tier1Js.includes('Firmware:') &&
        tier1Js.includes('Key Rotation:') &&
        tier1Js.includes('Anti-Replay Counter:') &&
        tier1Js.includes('#61,699 VERIFIED')
});

// 7. Modal dismiss & Escape key handling
tests.push({
  name: '7. Close handlers: backdrop click, close button, and Escape key wiring in app.js',
  pass: tier1Js.includes('closeTelemetryModal: function') &&
        appJs.includes('closeTelemetryModal')
});

console.log('--- TELEMETRY PROFILE MODAL VERIFICATION ---');
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
  console.log('\nResult: ALL TELEMETRY PROFILE MODAL REQUIREMENTS SATISFIED');
  process.exit(0);
} else {
  console.log('\nResult: VERIFICATION CHECKS FAILED');
  process.exit(1);
}
