// verify_pcr_movement_and_acceptance.js
// Automated verification for:
// 1. Showing the name of the PCR that accepted the alert (both in modal and on-page banner)
// 2. Animating the movement of that PCR marker on the map toward the citizen incident location

const fs = require('fs');
const path = require('path');

console.log("================================================================");
console.log("TEST: PCR Acceptance Display & Map Movement Verification");
console.log("================================================================\n");

// 1. Read files
const dispatchCode = fs.readFileSync(path.join(__dirname, 'js', 'views', 'tier3_dispatch.js'), 'utf-8');
const cssCode = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf-8');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

// Check CSS classes
console.log("1. Checking CSS for Acceptance Banner and Map Marker Movement:");
assert(cssCode.includes('.pcr-acceptance-banner'), "CSS defines .pcr-acceptance-banner container");
assert(cssCode.includes('.acceptance-pulse-icon'), "CSS defines .acceptance-pulse-icon");
assert(cssCode.includes('.pcr-live-tooltip'), "CSS defines .pcr-live-tooltip for permanent on-map tracking label");
assert(cssCode.includes('.pcr-unit-card'), "CSS defines .pcr-unit-card");

// Check JS implementation
console.log("\n2. Checking tier3_dispatch.js implementation:");
assert(dispatchCode.includes('id="pcr-acceptance-banner"'), "tier3_dispatch.js defines #pcr-acceptance-banner in DOM template");
assert(dispatchCode.includes('id="accepted-pcr-name"'), "Defines #accepted-pcr-name element for unit name");
assert(dispatchCode.includes('id="accepted-officer-name"'), "Defines #accepted-officer-name element for officer in charge");
assert(dispatchCode.includes('id="accepted-vehicle-model"'), "Defines #accepted-vehicle-model element");
assert(dispatchCode.includes('updateAcceptanceBanner: function'), "Defines updateAcceptanceBanner method");
assert(dispatchCode.includes('startLiveUnitTracking: function'), "Defines startLiveUnitTracking method");
assert(!dispatchCode.includes('id="btn-dispatch-nearest-pcr"'), "Verified removal of #btn-dispatch-nearest-pcr button per user request");
assert(dispatchCode.includes('Send Dispatch & Track'), "Modal broadcast confirmation button labeled 'Send Dispatch & Track'");

// 3. Functional Simulation
console.log("\n3. Simulating Acceptance and Movement Logic:");

// Create mock DOM environment
const mockElements = {};
function createMockEl(id, tag = 'div') {
  const el = {
    id,
    tagName: tag.toUpperCase(),
    innerHTML: '',
    textContent: '',
    className: '',
    style: { display: 'block' },
    classList: {
      add: (c) => {},
      remove: (c) => {}
    },
    scrollIntoView: () => { el.scrolled = true; },
    scrolled: false
  };
  mockElements[id] = el;
  return el;
}

[
  'dispatch-route-map',
  'pcr-acceptance-banner',
  'accepted-pcr-name',
  'accepted-officer-name',
  'accepted-vehicle-model',
  'accepted-plate',
  'accepted-dist',
  'dispatch-status-badge',
  'lead-unit-desc',
  'lead-unit-mdt',
  'lead-unit-model',
  'erss-eta-clock',
  'eta-time-val',
  'eta-dist-val',
  'eta-unit-pill',
  'eta-status-pill',
  'pcr-broadcast-modal',
  'pcr-broadcast-modal-content',
  'responding-fleet-container',
  'cad-system-audit-log'
].forEach(id => createMockEl(id));

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
  document: {
    getElementById: (id) => mockElements[id] || null,
    querySelector: (sel) => null,
    querySelectorAll: (sel) => []
  }
};

let capturedWaypoints = [];
let markerMovedCoords = [];

globalSandbox.window.L = {
  marker: function(coords, opts) {
    let currentCoords = coords;
    return {
      setLatLng: function(newCoords) {
        currentCoords = newCoords;
        markerMovedCoords.push(newCoords);
      },
      bindTooltip: function(text, opts) {
        this.tooltip = text;
        return this;
      },
      bindPopup: function(text) {
        this.popup = text;
        return this;
      },
      setTooltipContent: function(text) {
        this.tooltip = text;
      },
      openTooltip: function() {},
      addTo: function(map) { return this; }
    };
  },
  polyline: function(pts, opts) {
    return {
      setLatLngs: function(newPts) { this.pts = newPts; },
      addTo: function(map) { return this; }
    };
  },
  divIcon: function(opts) { return opts; }
};

const mapInstance = {
  removeLayer: function() {},
  fitBounds: function(bounds, opts) { this.bounds = bounds; }
};

const broadcastGroup = {
  clearLayers: function() {},
  addLayer: function() {},
  removeLayer: function() {}
};

globalSandbox.window.L.circle = function() {
  return {
    bindPopup: function() { return this; },
    addTo: function() { return this; }
  };
};
globalSandbox.window.L.latLngBounds = function(coords) {
  return { coords };
};

eval(`
  (function() {
    const window = globalSandbox.window;
    const document = globalSandbox.document;
    const L = globalSandbox.window.L;
    ${dispatchCode}
    globalSandbox.window.RakshakTier3DispatchView = window.RakshakTier3DispatchView;
  })();
`);

const view = globalSandbox.window.RakshakTier3DispatchView;
view.routeMapInstance = mapInstance;
view.broadcastLayersGroup = broadcastGroup;

// Test Nearest Dispatch
view.dispatchNearestPcr();

assert(mockElements['accepted-pcr-name'].textContent.includes('PCR-14'), "Accepted PCR name shows PCR-14");
assert(mockElements['accepted-officer-name'].textContent.includes('ASI M. Pattnaik'), "Accepted officer name shows ASI M. Pattnaik");
assert(mockElements['dispatch-route-map'].scrolled === true, "Auto-scrolled view to map upon dispatch");
assert(view.assignedUnitId === 'PCR-14', "Assigned lead unit is PCR-14");
assert(view.routeWaypoints.length > 10, `Generated ${view.routeWaypoints.length} road route waypoints`);

// Verify waypoint interpolation
const start = view.routeWaypoints[0];
const finish = view.routeWaypoints[view.routeWaypoints.length - 1];
assert(Math.abs(start[0] - 20.3620) < 0.001, "Route starts at PCR-14 patrol location (20.3620)");
assert(Math.abs(finish[0] - 20.3562) < 0.001, "Route ends at Priyanka Mohapatra location (20.3562)");

// Verify live movement step simulation
const firstStep = view.routeWaypoints[1];
assert(firstStep !== undefined, "Route contains progressive intermediate steps");

// Test Broadcast Modal "Send Dispatch" flow
mockElements['dispatch-route-map'].scrolled = false;
view.broadcastToAllPcrVans15Km();
assert(mockElements['accepted-pcr-name'].textContent.includes('PCR-14'), "Broadcast lead unit PCR-14 accepted the alert");

view.acknowledgeAllResponders();
assert(mockElements['pcr-broadcast-modal'].style.display === 'none', "Modal dismissed smoothly upon Send Dispatch");
assert(mockElements['dispatch-route-map'].scrolled === true, "Auto-scrolled to map upon Send Dispatch from modal");
assert(mockElements['accepted-pcr-name'].textContent.includes('PCR-14'), "Top banner displays accepted PCR name PCR-14");

console.log("\n================================================================");
console.log(`RESULTS: ${passCount} Passed, ${failCount} Failed`);
console.log("================================================================");

view.cleanupTrackingIntervals();
process.exit(failCount > 0 ? 1 : 0);
