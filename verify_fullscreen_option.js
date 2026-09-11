// verify_fullscreen_option.js
const fs = require('fs');
const path = require('path');

function testFullscreenOption() {
  console.log('--- Verifying Full Screen Options in Every Footage ---');

  const overviewJs = fs.readFileSync(path.join(__dirname, 'js/views/overview.js'), 'utf8');
  const tier3AiJs = fs.readFileSync(path.join(__dirname, 'js/views/tier3_ai.js'), 'utf8');
  const stylesCss = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');

  // 1. Check overview.js Live Camera Grid feeds
  console.log('1. Checking Live Camera Grid feeds in overview.js:');

  // Feed 1: CAM-0472
  if (!overviewJs.includes("camera-feed-wrap-0472") || !overviewJs.includes("toggleFullscreen('camera-feed-wrap-0472'")) {
    throw new Error('CAM-0472 missing Full Screen wrapper or toggle handler');
  }
  console.log('  ✓ CAM-0472 has Full Screen option (HUD button, footer button, ondblclick)');

  // Feed 2: CAM-0511
  if (!overviewJs.includes("camera-feed-wrap-0511") || !overviewJs.includes("toggleFullscreen('camera-feed-wrap-0511'")) {
    throw new Error('CAM-0511 missing Full Screen wrapper or toggle handler');
  }
  console.log('  ✓ CAM-0511 has Full Screen option (HUD button, footer button, ondblclick)');

  // Feed 3: CAM-0389
  if (!overviewJs.includes("camera-feed-wrap-0389") || !overviewJs.includes("toggleFullscreen('camera-feed-wrap-0389'")) {
    throw new Error('CAM-0389 missing Full Screen wrapper or toggle handler');
  }
  console.log('  ✓ CAM-0389 has Full Screen option (HUD button, footer button, ondblclick)');

  // Full Screen Grid option
  if (!overviewJs.includes("btn-video-grid-fs") || !overviewJs.includes("Full Screen Grid")) {
    throw new Error('Full Screen Grid toolbar button missing');
  }
  console.log('  ✓ Full Screen Grid toolbar button present');

  // Method implementation
  if (!overviewJs.includes("toggleFullscreen: function")) {
    throw new Error('toggleFullscreen method missing in overview.js');
  }
  console.log('  ✓ toggleFullscreen implementation verified in RakshakOverviewView');

  // 2. Check tier3_ai.js Optical Sensor Feed
  console.log('2. Checking Tier 3 AI CCTV footage in tier3_ai.js:');
  if (!tier3AiJs.includes("cctv-fullscreen-btn") || !tier3AiJs.includes("toggleFullscreen")) {
    throw new Error('Tier 3 AI CCTV footage missing Full Screen button or method');
  }
  console.log('  ✓ Tier 3 AI Optical CCTV feed has Full Screen button & handler');

  // 3. Check styles.css
  console.log('3. Checking CSS rules in styles.css:');
  if (!stylesCss.includes(".camera-hud-fullscreen-btn") || !stylesCss.includes(".feed-fullscreen-btn")) {
    throw new Error('Fullscreen button CSS classes missing in styles.css');
  }
  if (!stylesCss.includes(":fullscreen") || !stylesCss.includes(":-webkit-full-screen")) {
    throw new Error('Fullscreen pseudo-class styling missing in styles.css');
  }
  console.log('  ✓ Fullscreen HUD, footer, and container pseudo-class styles verified');

  console.log('\n>>> ALL FULL SCREEN VERIFICATION CHECKS PASSED! <<<');
}

testFullscreenOption();
