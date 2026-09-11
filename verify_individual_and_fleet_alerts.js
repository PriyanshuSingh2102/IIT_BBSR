// verify_individual_and_fleet_alerts.js
// Test suite for:
// 1. "Send Alert to All" button functionality
// 2. Individual "Send Alert" buttons on each PCR fleet card
// 3. Individual "Location" buttons on each PCR fleet card

const fs = require('fs');
const path = require('path');

console.log("================================================================");
console.log("TEST: Fleet 'Send Alert to All' & Individual 'Send Alert' / 'Location'");
console.log("================================================================\n");

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

// 1. Static Source Code Checks
console.log("1. Checking CSS and Markup:");
assert(cssCode.includes('.pcr-card-actions'), "CSS defines .pcr-card-actions container");
assert(cssCode.includes('.pcr-btn-alert'), "CSS defines .pcr-btn-alert button styling");
assert(cssCode.includes('.pcr-btn-loc'), "CSS defines .pcr-btn-loc button styling");

assert(dispatchCode.includes('Send Alert to All PCR Vans'), "Header contains 'Send Alert to All PCR Vans'");
assert(dispatchCode.includes('id="btn-fleet-alert-all"'), "Fleet grid section header contains #btn-fleet-alert-all");
assert(dispatchCode.includes('Send Alert to All'), "Button contains text 'Send Alert to All'");
assert(dispatchCode.includes('dispatchIndividualUnit: function'), "Defines dispatchIndividualUnit method");
assert(dispatchCode.includes('focusUnitOnMap: function'), "Defines focusUnitOnMap method");
assert(dispatchCode.includes('pcr-btn-alert'), "Fleet card template renders pcr-btn-alert ('Send Alert')");
assert(dispatchCode.includes('pcr-btn-loc'), "Fleet card template renders pcr-btn-loc ('Location')");

// 2. Functional DOM Simulation
console.log("\n2. Functional State Simulation:");

const mockElements = {};
function createMockEl(id, tag = 'div') {
  const el = {
    id,
    tagName: tag.toUpperCase(),
    innerHTML: '',
    textContent: '',
    className: '',
    style: { display: 'block' },
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
  'pcr-broadcast-modal',
  'pcr-broadcast-modal-content',
  'pcr-fleet-grid-container',
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

let boundsSet = null;
let popupContent = null;

globalSandbox.window.L = {
  marker: function(coords, opts) {
    return {
      setLatLng: function() {},
      bindTooltip: function() { return this; },
      bindPopup: function() { return this; },
      setTooltipContent: function() {},
      openTooltip: function() {},
      addTo: function() { return this; }
    };
  },
  polyline: function() {
    return {
      setLatLngs: function() {},
      addTo: function() { return this; }
    };
  },
  circle: function() {
    return {
      bindPopup: function() { return this; },
      addTo: function() { return this; }
    };
  },
  popup: function() {
    return {
      setLatLng: function() { return this; },
      setContent: function(html) { popupContent = html; return this; },
      openOn: function() { return this; }
    };
  },
  latLngBounds: function(coords) {
    return { coords };
  },
  divIcon: function(opts) { return opts; }
};

const mapInstance = {
  removeLayer: function() {},
  fitBounds: function(b) { boundsSet = b; }
};

const broadcastGroup = {
  clearLayers: function() {},
  addLayer: function() {},
  removeLayer: function() {}
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

// Render fleet cards
view.renderFleetCards();
const renderedHtml = mockElements['pcr-fleet-grid-container'].innerHTML;

assert(renderedHtml.includes('pcr-btn-alert'), "Cards contain 'Send Alert' button");
assert(renderedHtml.includes('pcr-btn-loc'), "Cards contain 'Location' button");
assert(renderedHtml.includes("dispatchIndividualUnit('PCR-09')"), "Cards bind click to dispatchIndividualUnit('PCR-09')");
assert(renderedHtml.includes("focusUnitOnMap('PCR-09')"), "Cards bind click to focusUnitOnMap('PCR-09')");

// Test Individual Send Alert on PCR-09
mockElements['dispatch-route-map'].scrolled = false;
view.dispatchIndividualUnit('PCR-09');

assert(view.assignedUnitId === 'PCR-09', "PCR-09 is set as assignedUnitId");
assert(view.activeUnitStatus === 'EN ROUTE', "Active status is EN ROUTE");
assert(mockElements['accepted-pcr-name'].textContent.includes('PCR-09'), "Acceptance banner shows PCR-09");
assert(mockElements['accepted-officer-name'].textContent.includes('SI R. K. Behera'), "Acceptance banner shows SI R. K. Behera");
assert(mockElements['dispatch-route-map'].scrolled === true, "Auto-scrolled view to map on individual dispatch");
assert(view.routeWaypoints.length > 10, `Generated ${view.routeWaypoints.length} road waypoints for PCR-09`);
assert(Math.abs(view.routeWaypoints[0][0] - 20.3545) < 0.001, "Route starts at PCR-09 coordinates (20.3545)");

// Test Individual Location button on PCR-04
mockElements['dispatch-route-map'].scrolled = false;
boundsSet = null;
view.focusUnitOnMap('PCR-04');

assert(mockElements['dispatch-route-map'].scrolled === true, "Auto-scrolled to map on Location click");
assert(boundsSet !== null, "Map bounds fitted to PCR-04 and citizen coordinates");
assert(popupContent !== null && popupContent.includes('PCR-04'), "Popup opened on map displaying PCR-04 details");

// Test "Send Alert to All" broadcast
view.broadcastToAllPcrVans15Km();
assert(view.broadcastActive === true, "Send Alert to All triggers broadcastActive = true");
assert(view.dispatchMode === 'BROADCAST_ALL', "Mode set to BROADCAST_ALL");

console.log("\n================================================================");
console.log(`RESULTS: ${passCount} Passed, ${failCount} Failed`);
console.log("================================================================");

view.cleanupTrackingIntervals();
process.exit(failCount > 0 ? 1 : 0);
