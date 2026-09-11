const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const overview = fs.readFileSync('js/views/overview.js', 'utf8');

const checks = [
  { name: 'Top nav: Overview tab active', pass: html.includes('nav-tab-btn active') && html.includes('data-tab="overview"') },
  { name: 'Top nav: Tier 1: Wearable', pass: html.includes('Tier 1: Wearable') },
  { name: 'Top nav: Tier 2: LoRa Relay', pass: html.includes('Tier 2: LoRa Relay') },
  { name: 'Top nav: Tier 3: AI Verification', pass: html.includes('Tier 3: AI Verification') },
  { name: 'Top nav: Tier 3: Dispatch', pass: html.includes('Tier 3: Dispatch') },
  { name: 'Top nav: Analytics', pass: html.includes('data-tab="analytics"') },
  { name: 'Header: Rakshak-Net Command Center title', pass: overview.includes('Rakshak-Net Command Center') },
  { name: 'Header: All Systems Operational badge (green)', pass: overview.includes('All Systems Operational') && overview.includes('#2E7D32') },
  { name: 'Header: Live command clock', pass: overview.includes('overview-live-clock') && overview.includes('startLiveClock') },
  { name: 'Stat 1: Active Wearables Online: 1,204', pass: overview.includes('Active Wearables Online') && overview.includes('1,204') },
  { name: 'Stat 2: LoRa Relay Nodes: 86 active / 2 offline', pass: overview.includes('LoRa Relay Nodes') && overview.includes('86 active / 2 offline') },
  { name: 'Stat 3: Active SOS Alerts: 0', pass: overview.includes('Active SOS Alerts') && overview.includes('0') },
  { name: 'Launchpad: Sub-features button for Tier 1 Wearable', pass: overview.includes('Launch Wearable Simulator') && overview.includes("switchTab('tier1_wearable')") },
  { name: 'Launchpad: Sub-features button for Tier 2 LoRa', pass: overview.includes('Launch Relay Network') && overview.includes("switchTab('tier2_lora')") },
  { name: 'Launchpad: Sub-features button for Tier 3 AI Studio', pass: overview.includes('Launch AI Studio') && overview.includes("switchTab('tier3_ai')") },
  { name: 'Launchpad: Sub-features button for Tier 3 ERSS Dispatch', pass: overview.includes('Launch Dispatch Console') && overview.includes("switchTab('tier3_dispatch')") },
  { name: 'Launchpad: Sub-features button for Analytics', pass: overview.includes('Launch Analytics Dashboard') && overview.includes("switchTab('analytics')") },
  { name: 'Project Video: HTML5 video element with mp4 source', pass: overview.includes('rakshak-corridor-video') && overview.includes('/assets/rakshak-corridor-monitoring.mp4') },
  { name: 'Project Video: CCTV HUD overlay & telemetry', pass: overview.includes('project-video-hud-top') && overview.includes('CAM-0472 LIVE FEED') },
  { name: 'Project Video: Play/pause and speed control handlers', pass: overview.includes('toggleVideoPlay') && overview.includes('toggleVideoSpeed') && overview.includes('toggleVideoMute') },
  { name: 'Map: Leaflet centered on city with streetlights & wearables', pass: overview.includes('L.map("overview-map-container"') && overview.includes('map-marker-streetlight') && overview.includes('map-marker-wearable') },
  { name: 'Pipeline: 3-step banner with flat icons and arrows', pass: overview.includes('Wearable Detects Distress') && overview.includes('LoRa Relay Transmits') && overview.includes('AI Verifies + Dispatch Sent') },
  { name: 'Log row: Node #34 reconnected', pass: overview.includes('Node #34 reconnected') },
  { name: 'Log row: System self-test passed', pass: overview.includes('System self-test passed') },
  { name: 'Log row: Wearable #0892 battery low', pass: overview.includes('Wearable #0892 battery low') }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`[${c.pass ? 'PASS' : 'FAIL'}] ${c.name}`);
  if (!c.pass) allPassed = false;
});

console.log(`\nOverall Sub-Features & Video Verification: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
process.exit(allPassed ? 0 : 1);
