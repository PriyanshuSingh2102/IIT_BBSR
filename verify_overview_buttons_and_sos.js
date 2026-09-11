// ================================================================
// VERIFICATION: Overview Buttons Removal & SOS Count Display = 2
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
console.log("TEST: Overview Header Action Buttons Removed & Active SOS = 2");
console.log("================================================================");

const overviewContent = fs.readFileSync('./js/views/overview.js', 'utf8');

// 1. Static Checks on overview.js
console.log("\n1. Overview Header Buttons Check:");
const headerMatch = overviewContent.match(/<div class="page-header-row"[\s\S]*?<\/div>\s*<\/div>/);
assert(headerMatch !== null, "Page header row found in overview.js");

if (headerMatch) {
  const headerHtml = headerMatch[0];
  assert(!headerHtml.includes('System Self-Test'), "Header does NOT contain 'System Self-Test' button");
  assert(!headerHtml.includes('Simulate SOS Alert'), "Header does NOT contain 'Simulate SOS Alert' button");
  assert(!headerHtml.includes('CAD Console'), "Header does NOT contain 'CAD Console' button");
  assert(!headerHtml.includes('btn-primary'), "Header has no action button elements");
}

console.log("\n2. Active SOS Alerts Card Check:");
assert(overviewContent.includes('Active SOS Alerts'), "Stat tile contains 'Active SOS Alerts' heading");
assert(overviewContent.includes('id="landing-sos-count"'), "Contains #landing-sos-count element");
assert(overviewContent.includes('<div id="landing-sos-count" class="stat-tile-val text-danger">2</div>'), "Active SOS Alerts displays count 2 with text-danger class");
assert(overviewContent.includes('2 active distress triggers'), "Card displays '2 active distress triggers' subtext");
assert(overviewContent.includes('2 ACTIVE') || overviewContent.includes('badge-critical'), "Tile displays critical active badge");

// 3. Functional DOM render test
console.log("\n3. DOM Simulation of Overview Render:");
let view;
const mockContainer = { innerHTML: '' };
const mockDoc = {
  getElementById: () => null,
  createElement: () => ({ style: {} }),
  body: { appendChild: () => {} }
};

try {
  const fn = new Function('window', 'document', `${overviewContent}; return window.RakshakOverviewView;`);
  view = fn({}, mockDoc);
} catch (e) {
  console.error("Evaluation error:", e);
}

if (view) {
  view.render(mockContainer);
  assert(!mockContainer.innerHTML.includes('>System Self-Test<'), "Rendered DOM does not contain System Self-Test button");
  assert(!mockContainer.innerHTML.includes('>Simulate SOS Alert<'), "Rendered DOM does not contain Simulate SOS Alert button");
  assert(!mockContainer.innerHTML.includes('>CAD Console<'), "Rendered DOM does not contain CAD Console button");
  assert(mockContainer.innerHTML.includes('id="landing-sos-count" class="stat-tile-val text-danger">2</div>'), "Rendered DOM contains #landing-sos-count with value 2 and danger text");
}

// 4. Live Server HTTP Verification
console.log("\n4. Checking Live Dev Server (http://127.0.0.1:3000):");
http.get('http://127.0.0.1:3000/js/views/overview.js', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    assert(res.statusCode === 200, "Server returns 200 OK for js/views/overview.js");
    
    // Check that served script has buttons removed from header
    const servedHeaderMatch = body.match(/<div class="page-header-row"[\s\S]*?<\/div>\s*<\/div>/);
    assert(servedHeaderMatch !== null, "Served script has page-header-row");
    if (servedHeaderMatch) {
      assert(!servedHeaderMatch[0].includes('System Self-Test'), "Served header does not contain System Self-Test");
      assert(!servedHeaderMatch[0].includes('Simulate SOS Alert'), "Served header does not contain Simulate SOS Alert");
      assert(!servedHeaderMatch[0].includes('CAD Console'), "Served header does not contain CAD Console");
    }
    
    assert(body.includes('<div id="landing-sos-count" class="stat-tile-val text-danger">2</div>'), "Served script displays active SOS count 2");

    console.log("\n================================================================");
    console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log("================================================================");
    process.exit(failed > 0 ? 1 : 0);
  });
}).on('error', (err) => {
  console.error("HTTP error:", err.message);
  process.exit(1);
});
