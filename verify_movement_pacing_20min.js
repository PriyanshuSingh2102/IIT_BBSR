// verify_movement_pacing_20min.js
// Verification for:
// 1. Movement pacing calibrated to max 20 minutes (Dial 112 SLA ceiling)
// 2. Smooth waypoint interpolation (180 micro-steps)
// 3. Interactive simulation speed switcher (1x Real-Time 20m, 5x, 10x, 20x)
// 4. Real-time clock decrementing from max 20 min down to 00:00

const fs = require('fs');
const path = require('path');

console.log("================================================================");
console.log("TEST: PCR Movement Pacing (Max 20 min) & Speed Controls");
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

// 1. Static Checks
console.log("1. Static Implementation Checks:");
assert(cssCode.includes('.sim-speed-btn'), "CSS defines .sim-speed-btn");
assert(cssCode.includes('.sim-speed-btn.active'), "CSS defines .sim-speed-btn.active");
assert(dispatchCode.includes('setSimulationSpeed: function'), "tier3_dispatch.js defines setSimulationSpeed method");
assert(dispatchCode.includes('totalTransitDurationSeconds'), "Defines totalTransitDurationSeconds state variable");
assert(dispatchCode.includes('Math.min(20.0'), "Transit duration calculation is strictly capped at 20.0 minutes");
assert(dispatchCode.includes('speed-btn-1x'), "Renders 1x Real-Time speed button");
assert(dispatchCode.includes('speed-btn-5x'), "Renders 5x speed button");
assert(dispatchCode.includes('speed-btn-10x'), "Renders 10x speed button");
assert(dispatchCode.includes('speed-btn-20x'), "Renders 20x demo speed button");

// 2. State & Math Simulation
console.log("\n2. Functional Simulation:");

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
      add: (c) => { el.className += ' ' + c; },
      remove: (c) => { el.className = el.className.replace(c, '').trim(); }
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
  'erss-dist-label',
  'erss-elapsed-label',
  'map-tracking-indicator',
  'active-speed-badge',
  'speed-btn-1x',
  'speed-btn-5x',
  'speed-btn-10x',
  'speed-btn-20x',
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

let markerLatLng = null;

globalSandbox.window.L = {
  marker: function(coords, opts) {
    markerLatLng = coords;
    return {
      setLatLng: function(newPos) { markerLatLng = newPos; },
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
      setContent: function() { return this; },
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
  fitBounds: function() {}
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

// Test lead unit dispatch
const citizen = view.getActiveCitizen();
const units = view.getUnitsWithin15Km(citizen.coords);
const leadUnit = units[0]; // PCR-14

view.startLiveUnitTracking(leadUnit, citizen);

assert(view.totalTransitDurationSeconds <= 120, `Close unit (0.7 km) moves fast: duration (${view.totalTransitDurationSeconds}s) is fast (~1.2 min)`);
assert(view.totalTransitDurationSeconds >= 60, `Close unit duration (${view.totalTransitDurationSeconds}s) is >= 60s`);
assert(view.routeWaypoints.length >= 100, `Generated smooth micro-steps: ${view.routeWaypoints.length} waypoints`);

// Check initial clock readout
const clockText = mockElements['erss-eta-clock'].textContent;
console.log(`  Initial ETA clock text for close unit: ${clockText}`);
assert(clockText.match(/^\d{2}:\d{2}$/), "ETA clock is in MM:SS format");
const initMins = parseInt(clockText.split(':')[0], 10);
assert(initMins <= 20, `ETA minutes (${initMins}) is <= 20 min`);

// Test speed switching
view.setSimulationSpeed(5);
assert(view.simulationSpeed === 5, "Simulation speed updated to 5x");
assert(mockElements['active-speed-badge'].textContent.includes('5x'), "Speed badge updated to 5x");

view.setSimulationSpeed(20);
assert(view.simulationSpeed === 20, "Simulation speed updated to 20x Demo");

view.setSimulationSpeed(1);
assert(view.simulationSpeed === 1, "Simulation speed restored to 1x Real-Time");

// Test farthest unit PCR-21 (11.1 km)
const farthestUnit = units.find(u => u.id === 'PCR-21');
view.startLiveUnitTracking(farthestUnit, citizen);
assert(view.totalTransitDurationSeconds <= 1200, `Farthest unit transit (${view.totalTransitDurationSeconds}s) is strictly <= 1200s (20 min max SLA)`);
assert(view.totalTransitDurationSeconds >= 1000, `Farthest unit transit (${view.totalTransitDurationSeconds}s) moves at normal speed taking ~19 min`);

console.log("\n================================================================");
console.log(`RESULTS: ${passCount} Passed, ${failCount} Failed`);
console.log("================================================================");

view.cleanupTrackingIntervals();
process.exit(failCount > 0 ? 1 : 0);
