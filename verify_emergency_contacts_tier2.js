// Automated Verification: Tier 2 Send Location to Emergency Contacts Feature
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
console.log('TEST SUITE: Tier 2 Send Location to Emergency Contacts');
console.log('================================================================\n');

// 1. Check js/views/tier2_lora.js
console.log('1. Checking js/views/tier2_lora.js:');
const tier2Path = path.join(__dirname, 'js', 'views', 'tier2_lora.js');
const tier2Code = fs.readFileSync(tier2Path, 'utf8');

assert(tier2Code.includes('id="btn-send-emergency-contacts"'), 'Contains button with id "btn-send-emergency-contacts"');
assert(tier2Code.includes('Send Location to Emergency Contacts'), 'Contains button label "Send Location to Emergency Contacts"');
assert(!tier2Code.includes('id="btn-simulate-hop"'), 'Old button "btn-simulate-hop" removed from UI markup');
assert(tier2Code.includes('sendLocationToEmergencyContacts:'), 'Defines sendLocationToEmergencyContacts method');
assert(tier2Code.includes('getEmergencyContacts:'), 'Defines getEmergencyContacts directory method');
assert(tier2Code.includes('openEmergencyContactsModal:'), 'Defines openEmergencyContactsModal method');
assert(tier2Code.includes('closeEmergencyContactsModal:'), 'Defines closeEmergencyContactsModal method');
assert(tier2Code.includes('resendAlertSms:'), 'Defines resendAlertSms method');
assert(tier2Code.includes('simulateSignalHop:'), 'Preserves simulateSignalHop method for regression compatibility');

// 2. Check Emergency Contacts Data Resolution
console.log('\n2. Checking Emergency Contacts Directory Resolution:');
// Create a sandbox execution of getEmergencyContacts
const sandbox = {
  activeDeviceId: "RN-WR-9204",
  getUser: function(id) {
    return { name: "Priyanka Mohapatra", deviceId: id, area: "Patia" };
  }
};
const contactsFuncMatch = tier2Code.match(/getEmergencyContacts:\s*function\s*\(([\s\S]*?)\)\s*\{([\s\S]*?)\n  \},/);
assert(contactsFuncMatch !== null, 'getEmergencyContacts function successfully extracted');

if (contactsFuncMatch) {
  const getEmergencyContacts = new Function("deviceId", contactsFuncMatch[2]);
  
  // Test Priyanka Mohapatra
  const priyankaContacts = getEmergencyContacts.call(sandbox, "RN-WR-9204");
  assert(Array.isArray(priyankaContacts) && priyankaContacts.length === 3, 'Priyanka has 3 emergency contacts');
  assert(priyankaContacts[0].name === "Prasanta Mohapatra" && priyankaContacts[0].relation === "Father", 'Priyanka contact 1 is Father Prasanta Mohapatra');
  assert(priyankaContacts[0].phone === "+91 94370 88219", 'Priyanka father phone is +91 94370 88219');
  assert(priyankaContacts[1].name === "Minati Mohapatra" && priyankaContacts[1].relation === "Mother", 'Priyanka contact 2 is Mother Minati Mohapatra');
  assert(priyankaContacts[2].name === "Ananya Sen", 'Priyanka contact 3 is Ananya Sen');

  // Test Subhashree Jena
  const subhashreeContacts = getEmergencyContacts.call(sandbox, "RN-WR-8812");
  assert(Array.isArray(subhashreeContacts) && subhashreeContacts.length === 3, 'Subhashree has 3 emergency contacts');
  assert(subhashreeContacts[0].name === "Rashmi Jena" && subhashreeContacts[0].relation === "Mother", 'Subhashree contact 1 is Mother Rashmi Jena');
  assert(subhashreeContacts[1].name === "Biswanath Jena" && subhashreeContacts[1].relation === "Father", 'Subhashree contact 2 is Father Biswanath Jena');

  // Test Ananya Mishra
  const ananyaContacts = getEmergencyContacts.call(sandbox, "RN-WR-4401");
  assert(Array.isArray(ananyaContacts) && ananyaContacts.length >= 2, 'Ananya has configured emergency contacts');
  assert(ananyaContacts[0].name === "Debasis Mishra" && ananyaContacts[0].relation === "Brother", 'Ananya contact 1 is Brother Debasis Mishra');

  // Test Fallback for another fleet citizen
  sandbox.getUser = function(id) { return { name: "Tanvi Tripathy", deviceId: id, area: "CSPUR" }; };
  const tanviContacts = getEmergencyContacts.call(sandbox, "RN-WR-5014");
  assert(Array.isArray(tanviContacts) && tanviContacts.length === 3, 'Tanvi Tripathy dynamically receives 3 emergency contacts');
  assert(tanviContacts[0].name.includes("Tripathy") && tanviContacts[0].relation === "Father", 'Tanvi contact 1 matches surname Tripathy');
}

// 3. Check index.html & css/styles.css
console.log('\n3. Checking index.html and css/styles.css:');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const cssCode = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf8');

assert(indexHtml.includes('id="emergency-contacts-modal"'), 'index.html defines modal container "#emergency-contacts-modal"');
assert(cssCode.includes('.sms-preview-card'), 'css defines .sms-preview-card');
assert(cssCode.includes('.sms-preview-bubble'), 'css defines .sms-preview-bubble');
assert(cssCode.includes('.contact-avatar-pill'), 'css defines .contact-avatar-pill');
assert(cssCode.includes('.badge-channel-sms'), 'css defines .badge-channel-sms');
assert(cssCode.includes('.badge-channel-ivr'), 'css defines .badge-channel-ivr');
assert(cssCode.includes('.badge-channel-whatsapp'), 'css defines .badge-channel-whatsapp');

// 4. Check Live Server Endpoint
console.log('\n4. Checking Live Dev Server (http://127.0.0.1:3000):');
const req = http.get('http://127.0.0.1:3000/js/views/tier2_lora.js', (res) => {
  assert(res.statusCode === 200, 'Server returns 200 OK for js/views/tier2_lora.js');
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    assert(data.includes('btn-send-emergency-contacts'), 'Served tier2 script contains btn-send-emergency-contacts');
    assert(data.includes('sendLocationToEmergencyContacts'), 'Served tier2 script contains sendLocationToEmergencyContacts');

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
