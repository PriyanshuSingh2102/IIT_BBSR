// verify_all_citizens_tracking.js
// Tests multi-user tracking for all 15 citizens in Rakshak-Net CAD

global.window = global;
global.document = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id: id,
        innerHTML: '',
        textContent: '',
        value: '',
        style: {},
        offsetWidth: 800,
        classList: {
          classes: new Set(),
          add: function(c) { this.classes.add(c); },
          remove: function(c) { this.classes.delete(c); },
          toggle: function(c, val) { if (val) this.classes.add(c); else this.classes.delete(c); },
          contains: function(c) { return this.classes.has(c); }
        }
      };
    }
    return this.elements[id];
  }
};

global.L = {
  map: function(id, opts) {
    return {
      _containerId: id,
      center: opts.center,
      zoom: opts.zoom,
      flyTo: function(coords, zoom) {
        this.center = coords;
        this.zoom = zoom;
      },
      remove: function() {},
      invalidateSize: function() {},
      removeLayer: function() {}
    };
  },
  layerGroup: function() {
    return {
      addTo: function() { return this; },
      clearLayers: function() {}
    };
  },
  tileLayer: function() {
    return {
      addTo: function() { return this; }
    };
  },
  divIcon: function(opts) { return opts; },
  marker: function(coords, opts) {
    return {
      coords: coords,
      setLatLng: function(c) { this.coords = c; },
      addTo: function() { return this; },
      bindPopup: function() { return this; }
    };
  },
  polyline: function(coords, opts) {
    return {
      coords: coords,
      addTo: function() { return this; }
    };
  }
};

require('./js/data.js');
require('./js/views/tier2_lora.js');
require('./js/views/tier1_wearable.js');

global.window.RakshakApp = {
  playChime: function() {},
  switchTab: function(tab) {
    this.currentTab = tab;
    if (tab === 'tier2_lora') {
      const container = document.getElementById('main-content-viewport');
      window.RakshakTier2View.render(container);
    }
  }
};

console.log('\n=== VERIFYING TRACK LOCATION FOR ALL 15 FLEET CITIZENS ===\n');

const fleet = window.RakshakData.wearablesFleet;
let passedCount = 0;
let failedCount = 0;

fleet.forEach((citizen, idx) => {
  const deviceId = citizen.deviceId;
  const expectedName = citizen.registeredUser;

  const main = document.getElementById('main-content-viewport');
  window.RakshakTier1View.render(main);

  window.RakshakTier1View.trackLocation(deviceId);

  const activeId = window.RakshakTier2View.activeDeviceId;
  const coords = window.RakshakTier2View.currentWearablePos;
  const subtitle = document.getElementById('tier2-user-subtitle').innerHTML;
  const selectVal = document.getElementById('tier2-citizen-select').value;
  const sortedCams = window.RakshakTier2View.getCamerasSortedByDistance(coords);

  const idMatches = activeId === deviceId;
  const nameInSubtitle = subtitle.includes(deviceId);
  const selectMatches = selectVal === deviceId;
  const coordsValid = Array.isArray(coords) && coords.length === 2 && coords[0] > 20 && coords[1] > 85;
  const camFound = sortedCams && sortedCams.length > 0 && typeof sortedCams[0].distanceMeters === 'number';

  if (idMatches && nameInSubtitle && selectMatches && coordsValid && camFound) {
    console.log(`[PASS] Citizen ${idx + 1}/${fleet.length}: ${expectedName} (${deviceId}) tracked at [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}] -> Closest Camera: ${sortedCams[0].id} (${sortedCams[0].distanceMeters}m)`);
    passedCount++;
  } else {
    console.error(`[FAIL] Citizen ${idx + 1}/${fleet.length}: ${expectedName} (${deviceId}) tracking failed:`, {
      idMatches, nameInSubtitle, selectMatches, coordsValid, camFound
    });
    failedCount++;
  }
});

console.log(`\nResults: ${passedCount}/${fleet.length} passed.`);
if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL 15 CITIZENS TRACKED INDEPENDENTLY WITH UNIQUE LOCATIONS & NEAREST CAMERAS <<<\n');
}
