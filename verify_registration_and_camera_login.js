// ====================================================================
// VERIFICATION TEST SUITE: OFFICER REGISTRATION & CAMERA BIOMETRIC LOGIN
// Tests: Registration Link, Ordered Form Fields (1-6), Biometric Stepper
// (Face Capture -> Eye/Iris Capture), Summary Card & Admin Approval,
// Prototype Mode Transparency Badge, Audit Trail Events & Live HTTP
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

console.log("====================================================================");
console.log("TEST SUITE: OFFICER REGISTRATION & CAMERA BIOMETRIC LOGIN ENGINE");
console.log("====================================================================");

const indexHtml = fs.readFileSync('./index.html', 'utf8');
const authJs = fs.readFileSync('./js/views/auth.js', 'utf8');
const auditJs = fs.readFileSync('./js/views/audit_trail.js', 'utf8');
const stylesCss = fs.readFileSync('./css/styles.css', 'utf8');

// -------------------------------------------------------------
// TEST 1: index.html & CSS Structure
// -------------------------------------------------------------
console.log("\n1. Verifying HTML & CSS Definitions:");
assert(indexHtml.includes('id="camera-biometric-modal"'), "index.html includes #camera-biometric-modal");
assert(stylesCss.includes('.login-register-link'), "CSS defines .login-register-link");
assert(stylesCss.includes('.registration-card'), "CSS defines .registration-card");
assert(stylesCss.includes('.reg-stepper'), "CSS defines .reg-stepper");
assert(stylesCss.includes('.cad-camera-container'), "CSS defines .cad-camera-container");
assert(stylesCss.includes('.camera-guide-face'), "CSS defines .camera-guide-face");
assert(stylesCss.includes('.camera-guide-iris'), "CSS defines .camera-guide-iris");
assert(stylesCss.includes('.prototype-mode-badge'), "CSS defines .prototype-mode-badge");
assert(stylesCss.includes('.prototype-disclaimer-text'), "CSS defines .prototype-disclaimer-text");
assert(stylesCss.includes('.badge-approval-pending'), "CSS defines .badge-approval-pending");
assert(stylesCss.includes('.badge-approval-approved'), "CSS defines .badge-approval-approved");

// -------------------------------------------------------------
// TEST 2: Static Verification of auth.js Specifications
// -------------------------------------------------------------
console.log("\n2. Verifying auth.js Implementation Requirements:");
assert(authJs.includes('New Officer? Register Device & Biometrics →') || authJs.includes('New Officer? Register Device &amp; Biometrics &rarr;'), "Login card includes 'New Officer? Register Device & Biometrics →' link");
assert(authJs.includes('id="reg-officer-id"'), "Registration card contains Officer ID input (#reg-officer-id)");
assert(authJs.includes('id="reg-fullname"'), "Registration card contains Full Name input (#reg-fullname)");
assert(authJs.includes('id="reg-rank"'), "Registration card contains Rank input (#reg-rank)");
assert(authJs.includes('id="reg-station"'), "Registration card contains Station input (#reg-station)");
assert(authJs.includes('id="reg-password"'), "Registration card contains Password input (#reg-password)");
assert(authJs.includes('id="reg-confirm-password"'), "Registration card contains Confirm Password input (#reg-confirm-password)");
assert(authJs.includes('id="reg-contact"'), "Registration card contains Contact Number input (#reg-contact)");
assert(authJs.includes('Step 1: Face Capture'), "Stepper includes Step 1: Face Capture");
assert(authJs.includes('Step 2: Eye/Iris Capture'), "Stepper includes Step 2: Eye/Iris Capture");
assert(authJs.includes('Position your face within the frame'), "Guide overlay includes 'Position your face within the frame'");
assert(authJs.includes('Look directly into the camera'), "Guide overlay includes 'Look directly into the camera'");
assert(authJs.includes('Face Captured ✓'), "Displays 'Face Captured ✓' confirmation");
assert(authJs.includes('Iris Pattern Captured ✓'), "Displays 'Iris Pattern Captured ✓' confirmation");
assert(authJs.includes('Registration Complete — Pending Admin Approval') || authJs.includes('Registration Complete &mdash; Pending Admin Approval'), "Summary includes 'Registration Complete — Pending Admin Approval' badge");
assert(authJs.includes('Simulate Admin Approval'), "Summary card includes 'Simulate Admin Approval' button");
assert(authJs.includes('Approved — Trusted Officer') || authJs.includes('Approved &mdash; Trusted Officer'), "Approval flip badge 'Approved — Trusted Officer'");
assert(authJs.includes('PROTOTYPE MODE — Biometric Matching Simulated for Demo') || authJs.includes('PROTOTYPE MODE &mdash; Biometric Matching Simulated for Demo'), "Biometric modal includes 'PROTOTYPE MODE — Biometric Matching Simulated for Demo'");
assert(authJs.includes('Camera capture is live and functional. Face/iris matching against enrolled biometric data is simulated in this prototype'), "Includes transparency disclaimer for demo account");
assert(authJs.includes('BIOMETRIC_DEMO_MODE_FLAGGED — OD-CP-1023 — matching bypassed (prototype).'), "Audit Trail logs BIOMETRIC_DEMO_MODE_FLAGGED event");
assert(authJs.includes('Identity Verified ✓ — Welcome,') || authJs.includes('Identity Verified ✓ &mdash; Welcome,'), "Face scan verifies with 'Identity Verified ✓ — Welcome,'");
assert(authJs.includes('Iris Verified ✓'), "Eye scan completes with 'Iris Verified ✓'");
assert(authJs.includes('Face Not Recognized — Access Denied') || authJs.includes('Face Not Recognized &mdash; Access Denied'), "Un-enrolled IDs trigger 'Face Not Recognized — Access Denied'");
assert(authJs.includes('Camera access required for biometric verification'), "Fallback notice present when camera access is denied");
assert(authJs.includes('Skip Biometric (Demo Mode Only)'), "Fallback provides 'Skip Biometric (Demo Mode Only)' button");

// -------------------------------------------------------------
// TEST 3: Audit Trail Engine Event Types
// -------------------------------------------------------------
console.log("\n3. Verifying Audit Trail Badges & Filters:");
assert(auditJs.includes('OFFICER_REGISTERED'), "audit_trail.js handles OFFICER_REGISTERED");
assert(auditJs.includes('BIOMETRIC_ENROLLED'), "audit_trail.js handles BIOMETRIC_ENROLLED");
assert(auditJs.includes('ADMIN_APPROVED'), "audit_trail.js handles ADMIN_APPROVED");
assert(auditJs.includes('BIOMETRIC_VERIFIED'), "audit_trail.js handles BIOMETRIC_VERIFIED");
assert(auditJs.includes('BIOMETRIC_MISMATCH'), "audit_trail.js handles BIOMETRIC_MISMATCH");
assert(auditJs.includes('BIOMETRIC_DEMO_MODE_FLAGGED'), "audit_trail.js handles BIOMETRIC_DEMO_MODE_FLAGGED");

// -------------------------------------------------------------
// TEST 4: Functional Simulation of Registration & Login
// -------------------------------------------------------------
console.log("\n4. Executing Functional DOM & Logic Simulation:");

const mockElements = {
  'login-screen': { style: { display: 'none' }, innerHTML: '' },
  'app-root': { style: { display: 'none' } },
  'biometric-modal': { style: { display: 'none' }, innerHTML: '' },
  'camera-biometric-modal': { style: { display: 'none' }, innerHTML: '' },
  'screen-lock-modal': { style: { display: 'none' }, innerHTML: '' },
  'inactivity-toast': { style: { display: 'none' }, innerHTML: '' },
  'login-officer-id': { value: 'OD-CP-1023' },
  'login-password': { value: 'Rakshak@2026', type: 'password' },
  'login-error-banner': { style: { display: 'none' } },
  'login-error-text': { innerHTML: '' },
  'audit-trail-table-body': { innerHTML: '' }
};

const mockDoc = {
  getElementById: (id) => mockElements[id] || { style: {}, innerHTML: '', value: '', classList: { add: ()=>{}, remove: ()=>{} }, querySelector: () => ({ textContent: '' }) },
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: (tag) => {
    const el = { id: '', style: {}, innerHTML: '', className: '' };
    return el;
  },
  body: { appendChild: (el) => { mockElements[el.id] = el; } }
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
  setItem(k, v) { this.items[k] = v; },
  removeItem(k) { delete this.items[k]; }
};

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

const auditFn = new Function('window', 'document', `${auditJs}; return window.RakshakAudit;`);
mockWindow.RakshakAudit = auditFn(mockWindow, mockDoc);

const authFn = new Function('window', 'document', 'sessionStorage', 'localStorage', `${authJs}; return window.RakshakAuth;`);
mockWindow.RakshakAuth = authFn(mockWindow, mockDoc, mockSessionStorage, mockLocalStorage);

mockWindow.RakshakAuth.init();

// Test: Switch to registration screen
mockWindow.RakshakAuth.showRegistrationScreen();
assert(mockElements['login-screen'].innerHTML.includes('Officer Registration'), "showRegistrationScreen() renders Registration card");
assert(mockElements['login-screen'].innerHTML.includes('reg-officer-id'), "Registration card contains reg-officer-id");
assert(mockElements['login-screen'].innerHTML.includes('reg-fullname'), "Registration card contains reg-fullname");
assert(mockElements['login-screen'].innerHTML.includes('reg-rank'), "Registration card contains reg-rank");
assert(mockElements['login-screen'].innerHTML.includes('reg-station'), "Registration card contains reg-station");
assert(mockElements['login-screen'].innerHTML.includes('reg-password'), "Registration card contains reg-password");
assert(mockElements['login-screen'].innerHTML.includes('reg-confirm-password'), "Registration card contains reg-confirm-password");
assert(mockElements['login-screen'].innerHTML.includes('reg-contact'), "Registration card contains reg-contact");

// Test: Simulate registration data & approval
mockWindow.RakshakAuth.tempRegistration = {
  officerId: "OD-CP-2099",
  name: "Inspector Sunita Mishra",
  rank: "Sub-Inspector",
  station: "KIIT Square PS",
  password: "Rakshak@2026",
  contact: "+91 94370 99999",
  faceCaptured: true,
  irisCaptured: true,
  approved: false,
  trusted: false,
  enrolledBiometrics: true
};

mockWindow.RakshakAuth.simulateAdminApproval();
assert(mockWindow.RakshakAuth.tempRegistration.approved === true, "simulateAdminApproval() marks officer as approved");
assert(mockWindow.RakshakAuth.tempRegistration.trusted === true, "simulateAdminApproval() marks officer as trusted");
const savedOfficer = mockWindow.RakshakAuth.findOfficer("OD-CP-2099");
assert(savedOfficer !== null, "Newly registered officer is retrievable via findOfficer()");
assert(savedOfficer.name === "Inspector Sunita Mishra", "Officer name preserved correctly");

// Test: Verify Audit Trail recorded registration events
const recentEvents = mockWindow.RakshakAudit.events.map(e => e.eventType);
assert(recentEvents.includes("ADMIN_APPROVED"), "Audit trail recorded ADMIN_APPROVED event");

// Test: Demo account face verification modal
const demoOfficer = mockWindow.RakshakAuth.findOfficer("OD-CP-1023");
mockWindow.RakshakAuth.startCameraBiometricVerification(demoOfficer);
assert(mockElements['camera-biometric-modal'].style.display === "flex", "Camera biometric modal opens for demo account");
assert(mockElements['camera-biometric-modal'].innerHTML.includes("PROTOTYPE MODE"), "Demo account modal shows PROTOTYPE MODE banner");
assert(mockElements['camera-biometric-modal'].innerHTML.includes("matching against enrolled biometric data is simulated"), "Demo account modal displays transparency disclaimer");

// Test: Audit log recorded demo mode flagged
assert(mockWindow.RakshakAudit.events[0].eventType === "BIOMETRIC_DEMO_MODE_FLAGGED", "Audit trail logged BIOMETRIC_DEMO_MODE_FLAGGED event");

// Test: Non-demo registered officer modal
mockWindow.RakshakAuth.startCameraBiometricVerification(savedOfficer);
assert(!mockElements['camera-biometric-modal'].innerHTML.includes("PROTOTYPE MODE"), "Registered non-demo officer does NOT show PROTOTYPE MODE banner");

// Test: Skip Biometric fallback
mockWindow.RakshakAuth.skipBiometricDemo("OD-CP-2099");
assert(mockWindow.RakshakAuth.isAuthenticated() === true, "skipBiometricDemo() completes authentication");
assert(mockWindow.RakshakAuth.getCurrentUser().officerId === "OD-CP-2099", "Current user is set to authenticated officer");

// -------------------------------------------------------------
// TEST 5: Live HTTP Server Endpoint Test
// -------------------------------------------------------------
console.log("\n5. Testing Live HTTP Server (http://127.0.0.1:3000):");
const req = http.get('http://127.0.0.1:3000/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    assert(res.statusCode === 200, `Live server status 200 (received: ${res.statusCode})`);
    assert(data.includes('id="camera-biometric-modal"'), "Live server response includes #camera-biometric-modal");
    assert(data.includes('js/views/auth.js'), "Live server response loads auth.js");

    console.log("\n====================================================================");
    console.log(`TEST SUMMARY: Passed ${passed} / ${passed + failed} assertions`);
    if (failed === 0) {
      console.log("ALL TESTS PASSED SUCCESSFULLY! ✓");
      console.log("====================================================================\n");
      process.exit(0);
    } else {
      console.error(`FAILED: ${failed} assertions failed.`);
      console.log("====================================================================\n");
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error(`  ✗ Live server request failed: ${err.message}`);
  failed++;
  process.exit(1);
});
