// Automated Verification: Tier 3 Smart Dispatch, Live Unit Tracking & Auto-Reassignment
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
console.log('TEST SUITE: Tier 3 Smart Dispatch & Live Unit Reassignment');
console.log('================================================================\n');

// 1. Static Source Code Checks in js/views/tier3_dispatch.js
console.log('1. Checking js/views/tier3_dispatch.js Implementation:');
const dispatchPath = path.join(__dirname, 'js', 'views', 'tier3_dispatch.js');
const dispatchCode = fs.readFileSync(dispatchPath, 'utf8');

assert(!dispatchCode.includes('id="btn-dispatch-nearest-pcr"'), 'Verified removal of #btn-dispatch-nearest-pcr per user instruction');
assert(dispatchCode.includes('id="btn-broadcast-pcr-15km"'), 'Defines button #btn-broadcast-pcr-15km');
assert(dispatchCode.includes('Broadcast to All PCR'), 'Button contains text "Broadcast to All PCR"');
assert(dispatchCode.includes('First to Accept Wins'), 'Shows badge "First to Accept Wins"');
assert(dispatchCode.includes('dispatch-rule-note'), 'Contains always-visible rule note container (.dispatch-rule-note)');
assert(dispatchCode.includes('Auto-Reassignment Rule:'), 'Contains Auto-Reassignment Rule heading');
assert(dispatchCode.includes('fails to arrive within 20 min or is traffic-delayed, the next nearest available unit is auto-dispatched'), 
  'Contains explicit rule text matching user specification');

assert(dispatchCode.includes('dispatchNearestPcr:'), 'Defines dispatchNearestPcr method');
assert(dispatchCode.includes('broadcastToAllPcrVans15Km:'), 'Defines broadcastToAllPcrVans15Km method');
assert(dispatchCode.includes('simulateTrafficDelayAndReassign:'), 'Defines simulateTrafficDelayAndReassign method');
assert(dispatchCode.includes('startLiveUnitTracking:'), 'Defines startLiveUnitTracking method');
assert(dispatchCode.includes('generateRouteWaypoints:'), 'Defines generateRouteWaypoints method');
assert(dispatchCode.includes('cad-system-log-terminal'), 'Defines system decision audit log terminal');

// 2. Checking css/styles.css
console.log('\n2. Checking css/styles.css for Flat Corporate Styling:');
const cssPath = path.join(__dirname, 'css', 'styles.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(cssCode.includes('.dispatch-rule-note'), 'css defines .dispatch-rule-note');
assert(cssCode.includes('.badge-first-wins'), 'css defines .badge-first-wins');
assert(cssCode.includes('.badge-status-enroute'), 'css defines .badge-status-enroute');
assert(cssCode.includes('.badge-status-delayed'), 'css defines .badge-status-delayed');
assert(cssCode.includes('.badge-status-reassigned'), 'css defines .badge-status-reassigned');
assert(cssCode.includes('.badge-status-reassigned-active'), 'css defines .badge-status-reassigned-active');
assert(cssCode.includes('.badge-status-onscene'), 'css defines .badge-status-onscene');
assert(cssCode.includes('.cad-system-log-box'), 'css defines .cad-system-log-box');

// 3. Functional Simulation & State Machine Testing
console.log('\n3. Functional Simulation & State Machine Verification:');

const simulatedDOM = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id: id,
        innerHTML: '',
        textContent: '',
        value: '',
        style: {},
        className: ''
      };
    }
    return this.elements[id];
  },
  createElement: function(tag) {
    return {
      tagName: tag,
      style: {},
      innerHTML: '',
      appendChild: function() {}
    };
  },
  body: {
    appendChild: function() {}
  }
};

const globalSandbox = {
  window: {
    RakshakApp: {
      playChime: function() {},
      switchTab: function() {}
    },
    RakshakTier3DispatchView: {},
    RakshakTier2View: {
      activeDeviceId: "RN-WR-9204",
      getUser: function() {
        return {
          deviceId: "RN-WR-9204",
          name: "Priyanka Mohapatra",
          area: "Infocity West Pedestrian Corridor",
          coords: [20.3562, 85.8174]
        };
      }
    }
  },
  document: simulatedDOM
};

eval(`
  (function() {
    const window = globalSandbox.window;
    const document = globalSandbox.document;
    ${dispatchCode}
    globalSandbox.window.RakshakTier3DispatchView = window.RakshakTier3DispatchView;
  })();
`);

const dispatch = globalSandbox.window.RakshakTier3DispatchView;

// Test Unit Filtering
const citizen = dispatch.getActiveCitizen();
assert(citizen.name === 'Priyanka Mohapatra', 'Citizen is Priyanka Mohapatra');
const units = dispatch.getUnitsWithin15Km(citizen.coords);
assert(units.length === 9, 'All 9 PCR units evaluated');
assert(units[0].id === 'PCR-14', 'Nearest unit to Priyanka is PCR-14');
assert(units[1].id === 'PCR-09', 'Second nearest unit is PCR-09');

// Test Route Waypoint Generation
const waypoints = dispatch.generateRouteWaypoints([units[0].lat, units[0].lng], citizen.coords, 28);
assert(Array.isArray(waypoints) && waypoints.length === 29, `Generated ${waypoints.length} smooth interpolation waypoints`);
assert(waypoints[0][0] === units[0].lat && waypoints[0][1] === units[0].lng, 'First waypoint matches unit start location');
assert(waypoints[waypoints.length - 1][0] === citizen.coords[0], 'Final waypoint matches incident destination');

// Test Dispatch Nearest PCR
dispatch.dispatchNearestPcr();
assert(dispatch.dispatchMode === 'NEAREST_ONLY', 'dispatchNearestPcr sets mode to NEAREST_ONLY');
assert(dispatch.assignedUnitId === 'PCR-14', 'PCR-14 selected as assigned nearest unit');
assert(dispatch.activeUnitStatus === 'EN ROUTE', 'Unit status set to EN ROUTE');
assert(dispatch.systemLogs.length > 0, 'System audit log entry recorded');
assert(dispatch.systemLogs[0].msg.includes('PCR-14'), 'Log documents PCR-14 dispatch');

// Test Broadcast to All (<15km)
dispatch.broadcastToAllPcrVans15Km();
assert(dispatch.dispatchMode === 'BROADCAST_ALL', 'broadcastToAllPcrVans15Km sets mode to BROADCAST_ALL');
assert(dispatch.broadcastActive === true, 'broadcastActive is true');

// Test Auto-Reassignment Simulation (Traffic Delay)
dispatch.simulateTrafficDelayAndReassign();
assert(dispatch.delayedUnitId === 'PCR-14', 'Initial unit PCR-14 marked delayed');
assert(dispatch.activeUnitStatus === 'DELAYED', 'Status updated to DELAYED — Possible Traffic Congestion');
assert(dispatch.systemLogs[0].msg.includes('traffic congestion detected'), 'System log records traffic congestion detection');

// Wait 1.3s for automated reassignment timeout to complete
setTimeout(() => {
  assert(dispatch.assignedUnitId === 'PCR-09', 'Auto-reassignment picked next-nearest unit PCR-09');
  assert(dispatch.reassignedFromUnitId === 'PCR-14', 'reassignedFromUnitId recorded as PCR-14');
  assert(dispatch.activeUnitStatus === 'EN ROUTE', 'PCR-09 set to EN ROUTE (Reassigned)');

  const hasReassignLog = dispatch.systemLogs.some(l => l.msg.includes('Auto-reassigned to PCR-09'));
  assert(hasReassignLog, 'System audit log contains formatted auto-reassignment entry');

  // Test Arrival Simulation (markArrived)
  dispatch.markArrived(true);
  assert(dispatch.activeUnitStatus === 'ON SCENE', 'markArrived sets status to ON SCENE');

  // 4. Test Live Server Endpoint
  console.log('\n4. Checking Live Dev Server (http://127.0.0.1:3000):');
  const req = http.get('http://127.0.0.1:3000/js/views/tier3_dispatch.js', (res) => {
    assert(res.statusCode === 200, 'Server returns 200 OK for js/views/tier3_dispatch.js');
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      assert(!data.includes('id="btn-dispatch-nearest-pcr"'), 'Served script has btn-dispatch-nearest-pcr removed');
      assert(data.includes('btn-broadcast-pcr-15km'), 'Served script contains btn-broadcast-pcr-15km');
      assert(data.includes('simulateTrafficDelayAndReassign'), 'Served script contains simulateTrafficDelayAndReassign');

      console.log('\n================================================================');
      console.log(`RESULTS: ${testsPassed} Passed, ${testsFailed} Failed`);
      console.log('================================================================\n');

      process.exit(testsFailed > 0 ? 1 : 0);
    });
  });

  req.on('error', (err) => {
    assert(false, `Request failed: ${err.message}`);
    process.exit(1);
  });
}, 1400);
