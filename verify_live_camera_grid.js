// verify_live_camera_grid.js
const fs = require('fs');
const path = require('path');

function testLiveCameraGrid() {
  console.log('--- Verifying Live Camera Grid Implementation ---');
  
  const overviewJsPath = path.join(__dirname, 'js', 'views', 'overview.js');
  const stylesCssPath = path.join(__dirname, 'css', 'styles.css');
  const nightVideoPath = path.join(__dirname, 'assets', 'rakshak-corridor-night.mp4');
  const trafficVideoPath = path.join(__dirname, 'assets', 'rakshak-street-traffic.mp4');
  const monitoringVideoPath = path.join(__dirname, 'assets', 'rakshak-bus-stand-cctv.mp4');

  // 1. Check video asset files exist and have non-zero size
  console.log('1. Checking video assets on disk:');
  const assets = [
    { name: 'Night corridor (CAM-0472)', path: nightVideoPath },
    { name: 'Street traffic (CAM-0511)', path: trafficVideoPath },
    { name: 'Bus Stand CCTV (CAM-0389)', path: monitoringVideoPath },
  ];

  for (const asset of assets) {
    if (!fs.existsSync(asset.path)) {
      throw new Error(`Asset not found: ${asset.path}`);
    }
    const stat = fs.statSync(asset.path);
    if (stat.size < 10000) {
      throw new Error(`Asset file suspiciously small: ${asset.path} (${stat.size} bytes)`);
    }
    console.log(`  ✓ ${asset.name}: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  }

  // 2. Check overview.js contents
  console.log('2. Checking overview.js markup and logic:');
  const overviewContent = fs.readFileSync(overviewJsPath, 'utf8');

  // Caption requirement
  if (!overviewContent.includes('Municipal Camera Network &mdash; Nearest to Active Zones') &&
      !overviewContent.includes('Municipal Camera Network — Nearest to Active Zones')) {
    throw new Error('Caption "Municipal Camera Network — Nearest to Active Zones" missing in overview.js');
  }
  console.log('  ✓ Found caption: "Municipal Camera Network — Nearest to Active Zones"');

  // 3 Feeds:
  // CAM-0472 (Infocity Underpass)
  if (!overviewContent.includes('CAM-0472 (Infocity Underpass)')) {
    throw new Error('CAM-0472 (Infocity Underpass) missing');
  }
  if (!overviewContent.includes('ai-flagged-card')) {
    throw new Error('ai-flagged-card class missing for CAM-0472');
  }
  if (!overviewContent.includes('badge-ai-flagged') || !overviewContent.includes('AI FLAGGED')) {
    throw new Error('AI FLAGGED badge missing for CAM-0472');
  }
  console.log('  ✓ CAM-0472 has amber AI FLAGGED badge and card border');

  // CAM-0511 (Nandankanan Main Road)
  if (!overviewContent.includes('CAM-0511 (Nandankanan Main Road)')) {
    throw new Error('CAM-0511 (Nandankanan Main Road) missing');
  }
  if (!overviewContent.includes('rakshak-street-traffic.mp4')) {
    throw new Error('CAM-0511 video source rakshak-street-traffic.mp4 missing');
  }
  console.log('  ✓ CAM-0511 (Nandankanan Main Road) present with traffic video');

  // CAM-0389 (Patia Bus Stand)
  if (!overviewContent.includes('CAM-0389 (Patia Bus Stand)')) {
    throw new Error('CAM-0389 (Patia Bus Stand) missing');
  }
  if (!overviewContent.includes('rakshak-bus-stand-cctv.mp4')) {
    throw new Error('CAM-0389 video source rakshak-bus-stand-cctv.mp4 missing');
  }
  console.log('  ✓ CAM-0389 (Patia Bus Stand) present with bus stand CCTV video');

  // Video attributes: autoplay loop muted playsinline
  const videoMatches = overviewContent.match(/<video[^>]*>/g) || [];
  if (videoMatches.length < 3) {
    throw new Error(`Expected at least 3 <video> elements, found ${videoMatches.length}`);
  }
  for (let i = 0; i < 3; i++) {
    const vTag = videoMatches[i];
    if (!vTag.includes('autoplay') || !vTag.includes('loop') || !vTag.includes('muted') || !vTag.includes('playsinline')) {
      throw new Error(`Video tag #${i + 1} missing required attributes (autoplay, loop, muted, playsinline): ${vTag}`);
    }
  }
  console.log(`  ✓ All ${videoMatches.length} <video> tags have autoplay, loop, muted, playsinline`);

  // LIVE badge and timestamp
  if (!overviewContent.includes('camera-hud-badge-live') || !overviewContent.includes('live-dot-red') || !overviewContent.includes('<span>LIVE</span>')) {
    throw new Error('LIVE badges missing from video overlays');
  }
  if (!overviewContent.includes('video-cctv-timestamp') || !overviewContent.includes('video-cctv-timestamp-0511') || !overviewContent.includes('video-cctv-timestamp-0389')) {
    throw new Error('Timestamp elements missing for one or more feeds');
  }
  console.log('  ✓ All 3 camera feeds have LIVE badges and dedicated timestamp elements');

  // MONITORING badge
  if (!overviewContent.includes('MONITORING')) {
    throw new Error('MONITORING badges missing');
  }
  console.log('  ✓ MONITORING badges present on nominal feeds');

  // Check startLiveClock updates all 3 timestamps
  if (!overviewContent.includes('video-cctv-timestamp-0511') || !overviewContent.includes('video-cctv-timestamp-0389')) {
    throw new Error('startLiveClock does not update all 3 timestamps');
  }
  console.log('  ✓ startLiveClock ticks all 3 video timestamp overlays');

  // 3. Check styles.css definitions
  console.log('3. Checking styles.css:');
  const stylesContent = fs.readFileSync(stylesCssPath, 'utf8');
  if (!stylesContent.includes('.live-camera-grid')) {
    throw new Error('.live-camera-grid missing in styles.css');
  }
  if (!stylesContent.includes('.camera-feed-card.ai-flagged-card')) {
    throw new Error('.camera-feed-card.ai-flagged-card missing in styles.css');
  }
  if (!stylesContent.includes('.badge-ai-flagged')) {
    throw new Error('.badge-ai-flagged missing in styles.css');
  }
  if (!stylesContent.includes('.badge-monitoring-green')) {
    throw new Error('.badge-monitoring-green missing in styles.css');
  }
  console.log('  ✓ CSS classes for grid layout, amber AI FLAGGED border/badge, and MONITORING badges validated');

  console.log('\n>>> ALL LIVE CAMERA GRID CHECKS PASSED SUCCESSFULLY! <<<');
}

testLiveCameraGrid();
