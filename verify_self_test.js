const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
const overviewJs = fs.readFileSync(path.join(__dirname, 'js/views/overview.js'), 'utf8');

const tests = [];

// 1. Button wiring in overview.js
tests.push({
  name: '1. Button wired to runSelfTest() in overview.js and calls RakshakApp.runSelfTest()',
  pass: overviewJs.includes('window.RakshakOverviewView.runSelfTest()') &&
        overviewJs.includes('window.RakshakApp.runSelfTest()')
});

// 2. Modal markup in index.html
tests.push({
  name: '2. Modal markup #self-test-modal exists in index.html with dismiss & autoclose',
  pass: indexHtml.includes('id="self-test-modal"') &&
        indexHtml.includes('id="self-test-list"') &&
        indexHtml.includes('id="self-test-result-banner"') &&
        indexHtml.includes('id="self-test-timestamp"') &&
        indexHtml.includes('btn-self-test-dismiss')
});

// 3. Checklist items specified in user prompt
const requiredItems = [
  'LoRa Mesh Network: Reachable',
  'CAD/Dispatch API Bridge: Connected',
  'Wearable Heartbeat Signals: Nominal (1,204/1,215 responding)',
  'AI Verification Model: Loaded & Responsive',
  'Cryptographic Integrity (AES-128 GCM): Verified'
];

requiredItems.forEach((item, idx) => {
  tests.push({
    name: `3.${idx + 1} Checklist item: "${item}" present in app.js`,
    pass: appJs.includes(item)
  });
});

// 4. Spinner to green checkmark animation logic (~0.5s interval)
tests.push({
  name: '4. Spinner to green checkmark flip animation after ~0.5s (500ms)',
  pass: appJs.includes('self-test-spinner') &&
        appJs.includes('self-test-checkmark') &&
        appJs.includes('500') &&
        stylesCss.includes('self-test-spinner') &&
        stylesCss.includes('self-test-checkmark')
});

// 5. Final green banner with exact text and timestamp
tests.push({
  name: '5. Green banner: "All Systems Operational — Self-Test Passed (100%)" and timestamp',
  pass: (indexHtml.includes('All Systems Operational &mdash; Self-Test Passed (100%)') ||
         indexHtml.includes('All Systems Operational — Self-Test Passed (100%)')) &&
        stylesCss.includes('self-test-banner') &&
        appJs.includes('Diagnostic Session #RN-ST-4091')
});

// 6. Auto-close and user dismiss capability
tests.push({
  name: '6. Auto-close timer and user dismiss button',
  pass: appJs.includes('selfTestAutoCloseTimer') &&
        appJs.includes('closeSelfTestModal') &&
        indexHtml.includes('closeSelfTestModal')
});

console.log('--- SYSTEM SELF-TEST VERIFICATION ---');
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
  console.log('\nVerification Result: ALL SYSTEM SELF-TEST REQUIREMENTS SATISFIED');
  process.exit(0);
} else {
  console.log('\nVerification Result: SOME SYSTEM SELF-TEST CHECKS FAILED');
  process.exit(1);
}
