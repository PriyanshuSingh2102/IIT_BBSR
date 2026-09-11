// ====================================================================
// VERIFICATION TEST SUITE: RAKSHAK-NET CAD LOGIN & SECURITY SYSTEM
// Tests: Auth Gating, Brute-Force Escalating Lockout, Windows Hello,
// Inactivity Watchdog, Audit Trail Logging & Live HTTP Endpoint
// ====================================================================

const fs = require('fs');
const http = require('http');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("================================================================");
console.log("TEST SUITE: RAKSHAK-NET CAD LOGIN & ENTERPRISE SECURITY SYSTEM");
console.log("================================================================");

const indexHtml = fs.readFileSync('./index.html', 'utf8');
const authJs = fs.readFileSync('./js/views/auth.js', 'utf8');
const auditJs = fs.readFileSync('./js/views/audit_trail.js', 'utf8');
const appJs = fs.readFileSync('./js/app.js', 'utf8');
const dispatchJs = fs.readFileSync('./js/views/tier3_dispatch.js', 'utf8');
const stylesCss = fs.readFileSync('./css/styles.css', 'utf8');

// -------------------------------------------------------------
// TEST 1: index.html Structure & Gating
// -------------------------------------------------------------
console.log("\n1. Verifying HTML DOM Structure & Script Inclusions:");
assert(indexHtml.includes('id="login-screen"'), "index.html contains #login-screen container");
assert(indexHtml.includes('id="app-root" style="display: none;"') || indexHtml.includes('id="app-root"'), "index.html contains #app-root");
assert(indexHtml.includes('id="biometric-modal"'), "index.html contains #biometric-modal");
assert(indexHtml.includes('id="screen-lock-modal"'), "index.html contains #screen-lock-modal");
assert(indexHtml.includes('id="inactivity-toast"'), "index.html contains #inactivity-toast");
assert(indexHtml.includes('data-tab="audit_trail"'), "index.html has Audit Trail tab in navigation bar");
assert(indexHtml.includes('js/views/auth.js'), "index.html includes auth.js");
assert(indexHtml.includes('js/views/audit_trail.js'), "index.html includes audit_trail.js");

// -------------------------------------------------------------
// TEST 2: Demo Credentials & Auth State Logic in auth.js
// -------------------------------------------------------------
console.log("\n2. Verifying Demo Credentials and Auth State Logic:");
assert(authJs.includes('officerId: "OD-CP-1023"'), "Pre-configured Officer ID is OD-CP-1023");
assert(authJs.includes('password: "Rakshak@2026"'), "Pre-configured Password is Rakshak@2026");
assert(authJs.includes('BBSR-CAD-TERMINAL-01'), "Current terminal is BBSR-CAD-TERMINAL-01");
assert(authJs.includes('INACTIVITY_TIMEOUT_SEC: 120'), "Inactivity auto-lock threshold configured to 120s (2 minutes)");
assert(authJs.includes('WARNING_LEAD_TIME_SEC: 15'), "Inactivity warning lead time configured to 15s");

// -------------------------------------------------------------
// TEST 3: Smart Brute-Force Escalating Lockout Logic
// -------------------------------------------------------------
console.log("\n3. Verifying Escalating Brute-Force Protection:");
assert(authJs.includes('lockoutDuration = 30'), "Tier 1 lockout sets 30 seconds delay (5 failed attempts)");
assert(authJs.includes('lockoutDuration = 60'), "Tier 2 lockout sets 60 seconds delay (10 failed attempts)");
assert(authJs.includes('lockoutDuration = 300'), "Tier 3 lockout sets 300 seconds delay (15 failed attempts)");
assert(authJs.includes('Too many attempts — try again in'), "Lockout banner includes user-facing countdown notice");
assert(authJs.includes('this.state.failedAttempts = 0'), "Successful login clears failed attempts counter");

// -------------------------------------------------------------
// TEST 4: Windows Hello Biometric Login Simulation
// -------------------------------------------------------------
console.log("\n4. Verifying Windows Hello Biometric Simulation:");
assert(authJs.includes('simulateBiometricLogin: function()'), "simulateBiometricLogin method implemented");
assert(authJs.includes('Verifying fingerprint...'), "Displays initial 'Verifying fingerprint...' status");
assert(authJs.includes('Verified ✓'), "Displays successful 'Verified ✓' confirmation");
assert(authJs.includes('Available only on this Registered Control Room Terminal'), "Includes restriction notice badge");
assert(authJs.includes('New Device Detected — Admin Approval Required') || authJs.includes('untrusted-device-alert'), "Displays untrusted device detection notice");

// -------------------------------------------------------------
// TEST 5: Screen Lock & Inactivity Watchdog
// -------------------------------------------------------------
console.log("\n5. Verifying 120s Inactivity Screen Lock & State Preservation:");
assert(authJs.includes('lockScreen: function('), "lockScreen method implemented");
assert(authJs.includes('unlockScreen: function('), "unlockScreen method implemented");
assert(authJs.includes('Current tab & scroll position preserved') || authJs.includes('Current tab &amp; scroll position preserved'), "Lock modal confirms state preservation");
assert(authJs.includes('bindGlobalActivityListeners: function()'), "Binds global mouse/key/touch/scroll activity listeners");

// -------------------------------------------------------------
// TEST 6: Audit Trail Logging Engine
// -------------------------------------------------------------
console.log("\n6. Verifying Audit Trail Logging System:");
assert(auditJs.includes('window.RakshakAudit'), "window.RakshakAudit defined");
assert(auditJs.includes('EVT-2026-9941'), "Pre-populated realistic historical events exist");
assert(auditJs.includes('log: function('), "RakshakAudit.log() method available for appending live events");
assert(auditJs.includes('LOGIN_SUCCESS'), "Audits LOGIN_SUCCESS events");
assert(auditJs.includes('LOGIN_FAILED'), "Audits LOGIN_FAILED events");
assert(auditJs.includes('SCREEN_LOCKED'), "Audits SCREEN_LOCKED events");
assert(auditJs.includes('SCREEN_UNLOCKED'), "Audits SCREEN_UNLOCKED events");
assert(auditJs.includes('DISPATCH_SOS'), "Audits DISPATCH_SOS events");
assert(auditJs.includes('ACKNOWLEDGE_UNIT'), "Audits ACKNOWLEDGE_UNIT events");
assert(auditJs.includes('exportCsv: function()'), "CSV export functionality available");

// -------------------------------------------------------------
// TEST 7: Integration with app.js and tier3_dispatch.js
// -------------------------------------------------------------
console.log("\n7. Verifying App Integration & Dispatch Event Hooks:");
assert(appJs.includes('window.RakshakAuth.init()'), "js/app.js initializes RakshakAuth");
assert(appJs.includes('window.RakshakAuth.isAuthenticated()'), "js/app.js checks isAuthenticated() before switching tabs");
assert(appJs.includes('"audit_trail"'), "js/app.js recognizes audit_trail in validTabs");
assert(dispatchJs.includes('window.RakshakAudit.log("DISPATCH_SOS"'), "tier3_dispatch.js hooks DISPATCH_SOS into RakshakAudit");
assert(dispatchJs.includes('window.RakshakAudit.log("ACKNOWLEDGE_UNIT"'), "tier3_dispatch.js hooks ACKNOWLEDGE_UNIT into RakshakAudit");

// -------------------------------------------------------------
// TEST 8: CSS Styling Rules (Corporate Flat CAD Design)
// -------------------------------------------------------------
console.log("\n8. Verifying CSS Rules & Flat Police Design:");
assert(stylesCss.includes('.login-card'), "CSS contains .login-card styles");
assert(stylesCss.includes('.btn-biometric'), "CSS contains .btn-biometric styles");
assert(stylesCss.includes('.lock-modal-window'), "CSS contains .lock-modal-window styles");
assert(stylesCss.includes('.inactivity-toast'), "CSS contains .inactivity-toast styles");
assert(stylesCss.includes('.audit-table'), "CSS contains .audit-table styles");
assert(stylesCss.includes('.audit-filter-btn'), "CSS contains .audit-filter-btn styles");

// -------------------------------------------------------------
// TEST 9: Functional Simulation of Auth & Audit Mechanics
// -------------------------------------------------------------
console.log("\n9. Executing Functional DOM & Logic Simulation:");

// Mock browser environment
const mockWindow = {
  RakshakAuth: null,
  RakshakAudit: null,
  location: { hash: "" },
  addEventListener: () => {},
  AudioContext: class {
    createOscillator() { return { frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
    createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    get destination() { return {}; }
    get currentTime() { return 0; }
  }
};

const mockElements = {
  'login-screen': { style: { display: 'none' }, innerHTML: '' },
  'app-root': { style: { display: 'none' } },
  'biometric-modal': { style: { display: 'none' }, innerHTML: '' },
  'screen-lock-modal': { style: { display: 'none' }, innerHTML: '' },
  'inactivity-toast': { style: { display: 'none' }, innerHTML: '' },
  'login-officer-id': { value: 'OD-CP-1023' },
  'login-password': { value: 'Rakshak@2026', type: 'password' },
  'unlock-password': { value: 'Rakshak@2026', type: 'password' },
  'login-error-banner': { style: { display: 'none' } },
  'login-error-text': { innerHTML: '' },
  'login-lockout-banner': { style: { display: 'none' } },
  'lockout-timer-text': { textContent: '' },
  'audit-trail-table-body': { innerHTML: '' }
};

const mockDoc = {
  getElementById: (id) => mockElements[id] || { style: {}, innerHTML: '', value: '' },
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => ({ style: {} }),
  body: { appendChild: () => {} }
};

const mockSessionStorage = {
  items: {},
  getItem(k) { return this.items[k] || null; },
  setItem(k, v) { this.items[k] = v; },
  removeItem(k) { delete this.items[k]; }
};

const mockLocalStorage = {
  items: {},
  getItem(k) { return this.items[k] || null; },
  setItem(k, v) { this.items[k] = v; }
};

// Evaluate Audit and Auth modules in mock sandbox
const auditFn = new Function('window', 'document', `${auditJs}; return window.RakshakAudit;`);
mockWindow.RakshakAudit = auditFn(mockWindow, mockDoc);

const authFn = new Function('window', 'document', 'sessionStorage', 'localStorage', `${authJs}; return window.RakshakAuth;`);
mockWindow.RakshakAuth = authFn(mockWindow, mockDoc, mockSessionStorage, mockLocalStorage);

assert(typeof mockWindow.RakshakAudit.log === 'function', "RakshakAudit.log is initialized and callable");
assert(typeof mockWindow.RakshakAuth.init === 'function', "RakshakAuth.init is initialized and callable");

// Test: Initial unauthenticated state
mockWindow.RakshakAuth.init();
assert(mockWindow.RakshakAuth.isAuthenticated() === false, "User is initially unauthenticated");
assert(mockElements['login-screen'].style.display === 'flex', "Login screen is displayed initially");
assert(mockElements['app-root'].style.display === 'none', "App root is hidden initially");

// Test: Password toggle
const mockEyeBtn = {
  open: { style: { display: 'block' } },
  closed: { style: { display: 'none' } },
  querySelector(selector) {
    return selector === '.eye-open-icon' ? this.open : this.closed;
  }
};
mockWindow.RakshakAuth.togglePasswordVisibility('login-password', mockEyeBtn);
assert(mockElements['login-password'].type === 'text', "togglePasswordVisibility switches password to text");
mockWindow.RakshakAuth.togglePasswordVisibility('login-password', mockEyeBtn);
assert(mockElements['login-password'].type === 'password', "togglePasswordVisibility switches text back to password");

// Test: Failed password attempt
const failResult = mockWindow.RakshakAuth.loginWithPassword('OD-CP-1023', 'WrongPass');
assert(failResult === false, "loginWithPassword rejects incorrect credentials");
assert(mockWindow.RakshakAuth.state.failedAttempts === 1, "Failed attempt counter incremented to 1");

// Test: Brute-Force lockout escalation at 5 failures
for (let i = 2; i <= 5; i++) {
  mockWindow.RakshakAuth.loginWithPassword('OD-CP-1023', 'WrongPass');
}
assert(mockWindow.RakshakAuth.state.failedAttempts === 5, "Failed attempt counter reaches 5");
assert(mockWindow.RakshakAuth.isLockedOut() === true, "Brute-force lockout activated at 5 failed attempts");
assert(mockWindow.RakshakAuth.state.lockoutTier === 1, "Lockout tier is set to 1 (30 seconds)");
assert(mockWindow.RakshakAuth.getRemainingLockoutSeconds() > 0, "Lockout countdown seconds > 0");

// Clear lockout for remaining functional tests
mockWindow.RakshakAuth.clearLockout();
assert(mockWindow.RakshakAuth.isLockedOut() === false, "Lockout cleared successfully");

// Test: Successful Login with Demo Credentials
const successResult = mockWindow.RakshakAuth.loginWithPassword('OD-CP-1023', 'Rakshak@2026');
assert(successResult === true, "loginWithPassword succeeds with demo credentials");
assert(mockWindow.RakshakAuth.isAuthenticated() === true, "RakshakAuth.isAuthenticated() returns true after login");
assert(mockWindow.RakshakAuth.state.failedAttempts === 0, "Failed attempts counter reset to 0 after success");
assert(mockElements['login-screen'].style.display === 'none', "Login screen is hidden after successful login");
assert(mockElements['app-root'].style.display === 'block', "App root is revealed after successful login");

// Test: Audit log recorded the successful login
const loginAudit = mockWindow.RakshakAudit.events[0];
assert(loginAudit.eventType === "LOGIN_SUCCESS", "Audit trail recorded LOGIN_SUCCESS event");
assert(loginAudit.officerId === "OD-CP-1023", "Audit event recorded correct officer ID");

// Test: Screen Lock
mockWindow.RakshakAuth.lockScreen("INACTIVITY_TIMEOUT");
assert(mockWindow.RakshakAuth.state.isLocked === true, "lockScreen sets state.isLocked to true");
assert(mockElements['screen-lock-modal'].style.display === 'flex', "Screen lock overlay modal displayed");
assert(mockWindow.RakshakAudit.events[0].eventType === "SCREEN_LOCKED", "Audit trail recorded SCREEN_LOCKED event");

// Test: Screen Unlock
const unlockResult = mockWindow.RakshakAuth.unlockScreen("Rakshak@2026");
assert(unlockResult === true, "unlockScreen succeeds with correct officer password");
assert(mockWindow.RakshakAuth.state.isLocked === false, "Screen unlocked, isLocked is false");
assert(mockElements['screen-lock-modal'].style.display === 'none', "Screen lock modal hidden after unlock");
assert(mockWindow.RakshakAudit.events[0].eventType === "SCREEN_UNLOCKED", "Audit trail recorded SCREEN_UNLOCKED event");

// Test: Audit Trail Filtering
mockWindow.RakshakAudit.setFilter("AUTH");
assert(mockWindow.RakshakAudit.currentFilter === "AUTH", "Audit filter set to AUTH");
const authFiltered = mockWindow.RakshakAudit.getFilteredEvents();
assert(authFiltered.every(e => e.eventType.includes("LOGIN") || e.eventType === "LOGOUT"), "AUTH filter only includes login/logout events");

mockWindow.RakshakAudit.setFilter("DISPATCH");
const dispatchFiltered = mockWindow.RakshakAudit.getFilteredEvents();
assert(dispatchFiltered.every(e => e.eventType.includes("DISPATCH") || e.eventType.includes("ACKNOWLEDGE")), "DISPATCH filter only includes dispatch/ack events");

// Test: Audit Search
mockWindow.RakshakAudit.setFilter("ALL");
mockWindow.RakshakAudit.handleSearch("PCR-14");
const searchResults = mockWindow.RakshakAudit.getFilteredEvents();
assert(searchResults.length > 0 && searchResults.every(e => JSON.stringify(e).includes("PCR-14")), "Audit search correctly matches queries");

// Test: Logout
mockWindow.RakshakAuth.logout();
assert(mockWindow.RakshakAuth.isAuthenticated() === false, "isAuthenticated() is false after logout");
assert(mockElements['login-screen'].style.display === 'flex', "Login screen restored on logout");
assert(mockElements['app-root'].style.display === 'none', "App root hidden on logout");
assert(mockWindow.RakshakAudit.events[0].eventType === "LOGOUT", "Audit trail recorded LOGOUT event");

// -------------------------------------------------------------
// TEST 10: Live HTTP Server Endpoint Test
// -------------------------------------------------------------
console.log("\n10. Testing Live Server (http://localhost:3000):");
const req = http.get('http://localhost:3000', (res) => {
  assert(res.statusCode === 200, `HTTP GET / returns status 200 (received: ${res.statusCode})`);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    assert(data.includes('id="login-screen"'), "Live server response includes #login-screen");
    assert(data.includes('js/views/auth.js'), "Live server response loads auth.js");
    assert(data.includes('js/views/audit_trail.js'), "Live server response loads audit_trail.js");
    assert(data.includes('data-tab="audit_trail"'), "Live server response includes Audit Trail navigation tab");

    console.log("\n================================================================");
    console.log(`TEST SUMMARY: Passed ${passed} / ${passed + failed} assertions`);
    if (failed === 0) {
      console.log("ALL TESTS PASSED SUCCESSFULLY! ✓");
    } else {
      console.error(`FAILED: ${failed} assertions failed.`);
    }
    console.log("================================================================");
    process.exit(failed === 0 ? 0 : 1);
  });
});

req.on('error', (err) => {
  console.error("HTTP connection to dev server failed:", err.message);
  assert(false, "Failed to connect to dev server on port 3000");
  process.exit(1);
});
