// verify_tier2_real_map.js
// Automated verification suite for Tier 2 Leaflet interactive map implementation

const fs = require('fs');
const path = require('path');

const tier2JsPath = path.join(__dirname, 'js', 'views', 'tier2_lora.js');
const stylesCssPath = path.join(__dirname, 'css', 'styles.css');

const tier2Js = fs.readFileSync(tier2JsPath, 'utf8');
const stylesCss = fs.readFileSync(stylesCssPath, 'utf8');

const checks = [
  {
    name: '1. Complete removal of schematic / SVG illustration map',
    pass: !tier2Js.includes('id="corridor-svg"') &&
          !tier2Js.includes('schematic-svg-canvas') &&
          !tier2Js.includes('id="link-0-1"') &&
          !tier2Js.includes('id="link-1-2"') &&
          !tier2Js.includes('M 40 230 C 220 230')
  },
  {
    name: '2. Real Leaflet map container #tier2-leaflet-map in HTML and CSS',
    pass: tier2Js.includes('id="tier2-leaflet-map"') &&
          stylesCss.includes('#tier2-leaflet-map')
  },
  {
    name: '3. OpenStreetMap tile layer integration',
    pass: tier2Js.includes('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') ||
          tier2Js.includes('https://tile.openstreetmap.org/{z}/{x}/{y}.png')
  },
  {
    name: '4. Center on real GPS coordinates for Bhubaneswar (Infocity corridor)',
    pass: (tier2Js.includes('20.3562') && tier2Js.includes('85.8174')) ||
          (tier2Js.includes('20.3548') && tier2Js.includes('85.8182'))
  },
  {
    name: '5. Default zoom level is street-level (zoom 15-17)',
    pass: /zoom:\s*(15|16|17)/.test(tier2Js)
  },
  {
    name: '6. Wearable marker: pulsing red marker DivIcon with CSS ring animation (no blur/glow)',
    pass: tier2Js.includes('map-marker-wearable-pulse') &&
          stylesCss.includes('.map-marker-wearable-pulse') &&
          stylesCss.includes('@keyframes flatRedPulseRing') &&
          !stylesCss.includes('.map-marker-wearable-pulse { box-shadow:')
  },
  {
    name: '7. LoRa relay node markers: streetlight icon along real street & minimal flat popup',
    pass: tier2Js.includes('map-marker-lora-pole') &&
          stylesCss.includes('.map-marker-lora-pole') &&
          tier2Js.includes('battery') &&
          tier2Js.includes('last ping') &&
          tier2Js.includes('tier2-flat-popup')
  },
  {
    name: '8. Internet-connected hub marker with distinct tower/antenna icon',
    pass: tier2Js.includes('map-marker-lora-hub') &&
          stylesCss.includes('.map-marker-lora-hub') &&
          tier2Js.includes('Municipal Hub')
  },
  {
    name: '9. CCTV camera markers at real junctions and Nearby CCTV Cameras list',
    pass: tier2Js.includes('map-marker-cctv-flat') &&
          stylesCss.includes('.map-marker-cctv-flat') &&
          tier2Js.includes('Nearby CCTV Cameras') &&
          tier2Js.includes('CAM-PATIA-14B')
  },
  {
    name: '10. Standard Leaflet controls & flat corporate popup styling',
    pass: tier2Js.includes('zoomControl: true') &&
          stylesCss.includes('.tier2-flat-popup')
  },
  {
    name: '11. Live wearable movement GPS jitter (setInterval 3-5s updating position)',
    pass: tier2Js.includes('startLiveGpsTracking') &&
          tier2Js.includes('setInterval') &&
          tier2Js.includes('wearableMarker.setLatLng') &&
          (tier2Js.includes('3500') || tier2Js.includes('3000') || tier2Js.includes('4000') || tier2Js.includes('5000'))
  },
  {
    name: '12. Polyline-based signal hop simulation through real coordinates',
    pass: tier2Js.includes('simulateSignalHop') &&
          tier2Js.includes('L.polyline') &&
          tier2Js.includes('hopPolylineGroup')
  },
  {
    name: '13. Preservation of Live Hop Trace status bar and clean half-page layout',
    pass: tier2Js.includes('hop-trace-label') &&
          tier2Js.includes('hop-timing-label') &&
          tier2Js.includes('Half-Page View')
  }
];

console.log('\n=== TIER 2 REAL LEAFLET MAP VERIFICATION ===\n');
let failed = 0;
checks.forEach(c => {
  if (c.pass) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.log(`[FAIL] ${c.name}`);
    failed++;
  }
});

console.log(`\nResults: ${checks.length - failed}/${checks.length} passed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL TIER 2 REAL LEAFLET MAP CHECKS PASSED <<<\n');
}
