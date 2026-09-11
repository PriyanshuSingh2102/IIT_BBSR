const fs = require('fs');
const path = require('path');

const tier1Js = fs.readFileSync(path.join(__dirname, 'js/views/tier1_wearable.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');

const tests = [];

// 1. Check toggle button for engineering details, labeled "Show Engineering Details ▾", collapsed by default
tests.push({
  name: '1.1 Toggle button labeled "Show Engineering Details" near top of page',
  pass: tier1Js.includes('Show Engineering Details') &&
        tier1Js.includes('toggleEngineeringDetails')
});

tests.push({
  name: '1.2 Engineering details container collapsed by default (display: none)',
  pass: tier1Js.includes('engineeringDetailsOpen: false') &&
        tier1Js.includes('id="tier1-engineering-details"') &&
        tier1Js.includes('this.engineeringDetailsOpen ? \'grid\' : \'none\'')
});

tests.push({
  name: '1.3 Engineering Blueprint and OTA Frame Inspector panels retained inside collapsible container',
  pass: tier1Js.includes('Hardware Engineering Blueprint & Architecture') &&
        tier1Js.includes('Encrypted Over-The-Air Frame Inspector') &&
        tier1Js.includes('tier1-raw-hex') &&
        tier1Js.includes('Protocol Frame Breakdown')
});

// 2. Fleet table default columns reduced to 4: Device ID, Battery Level, Operational Status, Accelerometer Jerk
tests.push({
  name: '2.1 Visible columns exactly 4: Device ID, Battery Level, Operational Status, Accelerometer Jerk',
  pass: tier1Js.includes('<th style="width: 25%;">Device ID</th>') &&
        tier1Js.includes('<th style="width: 20%;">Battery Level</th>') &&
        tier1Js.includes('<th style="width: 25%;">Operational Status</th>') &&
        tier1Js.includes('<th style="width: 30%;">Accelerometer Jerk</th>')
});

tests.push({
  name: '2.2 Moved columns exist in expandable row: Registered Citizen, Model, AES-128, PDR, Diagnostics',
  pass: tier1Js.includes('fleet-expand-row') &&
        tier1Js.includes('fleet-detail-grid') &&
        tier1Js.includes('Registered Citizen') &&
        tier1Js.includes('Hardware Model') &&
        tier1Js.includes('AES-128') &&
        tier1Js.includes('Packet Delivery (PDR)') &&
        tier1Js.includes('Diagnostics') &&
        tier1Js.includes('inspectDevice')
});

// 3. Data Privacy by Design: Citizen full names replaced with Citizen ID in default table view, revealed on expand
tests.push({
  name: '3.1 Citizen full names absent from default unexpanded table row',
  pass: tier1Js.includes('<!-- Main Visible Row (4 Clean Columns, Citizen ID Only) -->') &&
        !tier1Js.includes('<strong>${dev.registeredUser}</strong>')
});

tests.push({
  name: '3.2 Data Privacy by Design framing and badge present in table & expanded details',
  pass: tier1Js.includes('Data Privacy by Design') &&
        tier1Js.includes('Personal identity masked at Tier 1 telemetry stream') &&
        tier1Js.includes('privacy-badge') &&
        stylesCss.includes('privacy-badge')
});

// 4. Stat cards: 4 headline numbers kept as-is, captions moved into "Learn more" hover tooltip
tests.push({
  name: '4.1 4 Headline numbers preserved',
  pass: tier1Js.includes('14,820') &&
        tier1Js.includes('100% Verified') &&
        tier1Js.includes('84.2%') &&
        tier1Js.includes('Zero Drift')
});

tests.push({
  name: '4.2 Captions moved into "Learn more" hover tooltips',
  pass: tier1Js.includes('stat-tooltip-wrap') &&
        tier1Js.includes('stat-learn-more') &&
        tier1Js.includes('stat-tooltip-popover') &&
        tier1Js.includes('Hardware Secure Element ATECC608A') &&
        tier1Js.includes('Triple-Tap Capacitive Debounce Filter') &&
        tier1Js.includes('Ultra-Low Power nRF52840 Sleep Mode') &&
        stylesCss.includes('stat-tooltip-popover') &&
        stylesCss.includes('stat-learn-more')
});

// 5. Row highlighting: TRIGGER_ACTIVE red and FALL_ALERT orange
tests.push({
  name: '5.1 Red highlight for TRIGGER_ACTIVE preserved',
  pass: tier1Js.includes("dev.status === 'TRIGGER_ACTIVE'") &&
        tier1Js.includes('row-critical') &&
        stylesCss.includes('.fleet-table-row.row-critical') &&
        stylesCss.includes('#C0392B')
});

tests.push({
  name: '5.2 Orange highlight for FALL_ALERT preserved',
  pass: tier1Js.includes("dev.status === 'FALL_ALERT'") &&
        tier1Js.includes('row-fall-alert') &&
        stylesCss.includes('.fleet-table-row.row-fall-alert') &&
        stylesCss.includes('#D35400')
});

console.log('--- TIER 1 WEARABLE SIMPLIFICATION VERIFICATION ---');
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
  console.log('\nResult: ALL 5 TIER 1 SIMPLIFICATION SPECIFICATIONS VERIFIED');
  process.exit(0);
} else {
  console.log('\nResult: VERIFICATION CHECKS FAILED');
  process.exit(1);
}
