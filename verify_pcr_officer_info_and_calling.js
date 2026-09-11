// ================================================================
// VERIFICATION TEST SUITE: PCR Officer Crew Info & Direct Calling
// ================================================================

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
console.log("TEST: PCR Officer Crew Info Modal & Direct Call Integration");
console.log("================================================================");

// 1. Static File Verification
console.log("\n1. Static Markup and Stylesheet Validation:");
const indexHtml = fs.readFileSync('./index.html', 'utf8');
const stylesCss = fs.readFileSync('./css/styles.css', 'utf8');
const dispatchJs = fs.readFileSync('./js/views/tier3_dispatch.js', 'utf8');

assert(indexHtml.includes('id="pcr-officer-modal"'), "index.html defines #pcr-officer-modal container");
assert(indexHtml.includes('closeOfficerInfoModal'), "index.html binds backdrop click to closeOfficerInfoModal");

assert(stylesCss.includes('.pcr-btn-info'), "styles.css defines .pcr-btn-info button styling");
assert(stylesCss.includes('.officer-unit-summary-box'), "styles.css defines .officer-unit-summary-box");
assert(stylesCss.includes('.officer-card'), "styles.css defines .officer-card");
assert(stylesCss.includes('.officer-avatar'), "styles.css defines .officer-avatar");
assert(stylesCss.includes('.btn-officer-call'), "styles.css defines .btn-officer-call");
assert(stylesCss.includes('.btn-officer-dial'), "styles.css defines .btn-officer-dial");
assert(stylesCss.includes('.officer-active-call-alert'), "styles.css defines .officer-active-call-alert");

assert(dispatchJs.includes('pcr-btn-info'), "tier3_dispatch.js renders .pcr-btn-info in fleet cards");
assert(dispatchJs.includes('openOfficerInfoModal'), "tier3_dispatch.js defines openOfficerInfoModal method");
assert(dispatchJs.includes('closeOfficerInfoModal'), "tier3_dispatch.js defines closeOfficerInfoModal method");
assert(dispatchJs.includes('callOfficer'), "tier3_dispatch.js defines callOfficer method");
assert(dispatchJs.includes('endOfficerCall'), "tier3_dispatch.js defines endOfficerCall method");
assert(dispatchJs.includes('playRadioChime'), "tier3_dispatch.js defines playRadioChime method");
assert(dispatchJs.includes('getOfficersForUnit'), "tier3_dispatch.js defines getOfficersForUnit helper");
assert(dispatchJs.includes('officerDirectory:'), "tier3_dispatch.js defines officerDirectory roster");

// 2. Functional Evaluation of Officer Rosters across all 9 PCR Vans
console.log("\n2. PCR Crew Data & Roster Coverage:");

const mockElements = {
  'pcr-officer-modal': {
    style: { display: 'none' },
    innerHTML: ''
  },
  'officer-active-call-bar': {
    style: { display: 'none' },
    innerHTML: ''
  },
  'call-duration-timer': {
    textContent: '00:00'
  }
};

const mockDoc = {
  getElementById: (id) => mockElements[id] || null,
  createElement: (tag) => ({ style: {}, classList: { add: () => {} } }),
  body: { appendChild: () => {} }
};

let view;
try {
  const sandboxCode = `let view; ${dispatchJs}; view = window.RakshakTier3DispatchView; return view;`;
  const fn = new Function('window', 'document', sandboxCode);
  view = fn({}, mockDoc);
} catch (err) {
  console.error("Evaluation error:", err);
}

if (view) {
  const units = view.pcrFleet;
  assert(units.length === 9, `Fleet contains 9 units (found: ${units.length})`);

  units.forEach(u => {
    const officers = view.getOfficersForUnit(u.id);
    assert(officers.length === u.crew, `${u.id} has exactly ${u.crew} officers matching crew count (found: ${officers.length})`);
    
    // Check lead officer matches
    const lead = officers.find(o => o.isLead);
    assert(lead && lead.name === u.officer, `${u.id} lead officer is ${u.officer} (found: ${lead ? lead.name : 'none'})`);
    
    // Check each officer has phone number
    const allHavePhones = officers.every(o => o.phone && o.phone.startsWith('+91'));
    assert(allHavePhones, `All officers in ${u.id} have official +91 CUG contact numbers`);
    
    // Check badge IDs
    const allHaveBadges = officers.every(o => o.badge && o.badge.startsWith('OD-'));
    assert(allHaveBadges, `All officers in ${u.id} have registered Odisha Police badge numbers`);
  });
}

// 3. Functional Simulation of Modal Opening, Direct Calling, and Call Lifecycle
console.log("\n3. Modal Opening & Audio Call Life Cycle Simulation:");

if (view) {
  // Test modal opening for PCR-14
  view.openOfficerInfoModal('PCR-14');
  assert(mockElements['pcr-officer-modal'].style.display === 'flex', "Opening officer modal sets display to 'flex'");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('PCR-14'), "Modal displays unit ID PCR-14");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('ASI M. Pattnaik'), "Modal displays Lead Officer ASI M. Pattnaik");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('Havildar B. K. Jena'), "Modal displays Driver Havildar B. K. Jena");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('Constable P. C. Das'), "Modal displays Escort Constable P. C. Das");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('+91 94389 11214'), "Modal contains officer phone number +91 94389 11214");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('Call Officer'), "Modal contains 'Call Officer' action button");
  assert(mockElements['pcr-officer-modal'].innerHTML.includes('tel:+919438911214'), "Modal contains tel: quick-dial link");

  // Test callOfficer on ASI M. Pattnaik
  view.callOfficer('PCR-14', 'ASI M. Pattnaik', '+91 94389 11214');
  assert(mockElements['officer-active-call-bar'].style.display === 'flex', "Calling officer activates active call banner");
  assert(mockElements['officer-active-call-bar'].innerHTML.includes('ASI M. Pattnaik'), "Active call banner displays officer name");
  assert(mockElements['officer-active-call-bar'].innerHTML.includes('+91 94389 11214'), "Active call banner displays CUG phone number");
  assert(mockElements['officer-active-call-bar'].innerHTML.includes('End Call'), "Active call banner displays 'End Call' button");
  assert(view.systemLogs[0].msg.includes('VOIP DISPATCH CALL connected to ASI M. Pattnaik'), "System audit log records VoIP call connection");

  // Test ending the call
  view.endOfficerCall('ASI M. Pattnaik');
  assert(view.activeCallTimer === null, "Ending call clears active call timer");
  assert(mockElements['officer-active-call-bar'].innerHTML.includes('Call terminated'), "Banner indicates call terminated");
  assert(view.systemLogs[0].msg.includes('CAD Voice call with ASI M. Pattnaik disconnected'), "System audit log records call disconnect");

  // Test closing the modal
  view.closeOfficerInfoModal();
  assert(mockElements['pcr-officer-modal'].style.display === 'none', "Closing modal sets display to 'none'");
}

// 4. Live Server HTTP Verification
console.log("\n4. Checking Live Dev Server (http://127.0.0.1:3000):");
http.get('http://127.0.0.1:3000/js/views/tier3_dispatch.js', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    assert(res.statusCode === 200, "Server returns 200 OK for js/views/tier3_dispatch.js");
    assert(body.includes('pcr-btn-info'), "Served script contains pcr-btn-info");
    assert(body.includes('openOfficerInfoModal'), "Served script contains openOfficerInfoModal");
    assert(body.includes('callOfficer'), "Served script contains callOfficer");

    http.get('http://127.0.0.1:3000/index.html', (resHtml) => {
      let htmlBody = '';
      resHtml.on('data', chunk => htmlBody += chunk);
      resHtml.on('end', () => {
        assert(resHtml.statusCode === 200, "Server returns 200 OK for index.html");
        assert(htmlBody.includes('id="pcr-officer-modal"'), "Served index.html contains #pcr-officer-modal");

        console.log("\n================================================================");
        console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
        console.log("================================================================");
        if (failed > 0) process.exit(1);
      });
    });
  });
}).on('error', (err) => {
  console.error("HTTP error:", err.message);
  process.exit(1);
});
