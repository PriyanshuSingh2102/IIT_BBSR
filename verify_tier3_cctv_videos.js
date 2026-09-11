// Automated Verification: Tier 3 Multi-Video CCTV Integration & Citizen Switcher
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
console.log('TEST SUITE: Tier 3 CCTV Video Playback & Citizen Switcher');
console.log('================================================================\n');

// 1. Check video files on disk in cctv/
console.log('1. Checking Video Assets on Disk (cctv/):');
const cctvDir = path.join(__dirname, 'cctv');
const cctvFiles = fs.readdirSync(cctvDir);

const expectedCriticalVideos = ['1..mp4', '2..mp4'];
expectedCriticalVideos.forEach(v => {
  assert(cctvFiles.includes(v), `Required video file "${v}" exists in cctv/ directory`);
});

assert(cctvFiles.length >= 11, `cctv/ contains all 11 real video files (found: ${cctvFiles.length})`);

// 2. Check js/views/tier3_ai.js static source code
console.log('\n2. Checking js/views/tier3_ai.js Implementation:');
const tier3Path = path.join(__dirname, 'js', 'views', 'tier3_ai.js');
const tier3Code = fs.readFileSync(tier3Path, 'utf8');

assert(tier3Code.includes('citizenVideoRegistry:'), 'tier3_ai.js defines citizenVideoRegistry');
assert(tier3Code.includes('"RN-WR-9204": "/cctv/1..mp4"'), 'RN-WR-9204 (Priyanka Mohapatra) mapped to /cctv/1..mp4');
assert(tier3Code.includes('"RN-WR-8812": "/cctv/2..mp4"'), 'RN-WR-8812 (Subhashree Jena) mapped to /cctv/2..mp4');
assert(tier3Code.includes('id="tier3-citizen-select"'), 'tier3_ai.js contains citizen switcher dropdown (#tier3-citizen-select)');
assert(tier3Code.includes('class="tracked-user-select"'), 'Dropdown uses tracked-user-select styling matching screenshot');
assert(tier3Code.includes('class="tracked-user-pill"'), 'Dropdown is wrapped in tracked-user-pill container');
assert(tier3Code.includes('<video id="tier3-cctv-video"'), 'tier3_ai.js contains HTML5 video player element (#tier3-cctv-video)');
assert(tier3Code.includes('switchCitizen:'), 'tier3_ai.js defines switchCitizen(deviceId) method');
assert(tier3Code.includes('toggleVideoPlay:'), 'tier3_ai.js defines toggleVideoPlay() method');
assert(tier3Code.includes('loadCamera: function(cameraData, citizenId)'), 'tier3_ai.js loadCamera accepts citizenId parameter');

// 3. Check js/views/tier2_lora.js integration
console.log('\n3. Checking Tier 2 Handoff (js/views/tier2_lora.js):');
const tier2Path = path.join(__dirname, 'js', 'views', 'tier2_lora.js');
const tier2Code = fs.readFileSync(tier2Path, 'utf8');

assert(tier2Code.includes('playCameraFootageInTier3:'), 'tier2_lora.js defines playCameraFootageInTier3');
assert(tier2Code.includes('window.RakshakTier3AIView.loadCamera(camPayload, this.activeDeviceId)'), 
  'tier2 passes this.activeDeviceId to window.RakshakTier3AIView.loadCamera');

// 4. Functional Simulation & DOM Verification
console.log('\n4. Functional Simulation (DOM & State Execution):');

let switchedTab = null;
let chimePlayed = false;

const simulatedDOM = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id: id,
        value: '',
        innerHTML: '',
        textContent: '',
        src: '',
        paused: false,
        play: function() { this.paused = false; },
        pause: function() { this.paused = true; }
      };
    }
    return this.elements[id];
  }
};

const globalSandbox = {
  window: {
    RakshakApp: {
      switchTab: function(t) { switchedTab = t; },
      playChime: function() { chimePlayed = true; }
    },
    RakshakTier3AIView: {},
    RakshakTier2View: {}
  },
  document: simulatedDOM
};

eval(`
  (function() {
    const window = globalSandbox.window;
    const document = globalSandbox.document;
    ${tier3Code}
    ${tier2Code}
    globalSandbox.window.RakshakTier3AIView = window.RakshakTier3AIView;
    globalSandbox.window.RakshakTier2View = window.RakshakTier2View;
  })();
`);

const tier3 = globalSandbox.window.RakshakTier3AIView;
const tier2 = globalSandbox.window.RakshakTier2View;

// Test video mapping for all 16 fleet users
const allUsers = Object.keys(tier2.userLocations);
assert(allUsers.length === 16, `Tier 2 userLocations contains 16 registered users (found: ${allUsers.length})`);

let allHaveVideos = true;
allUsers.forEach(uid => {
  const vid = tier3.getVideoForCitizen(uid);
  if (!vid || !vid.startsWith('/cctv/')) {
    allHaveVideos = false;
  }
});
assert(allHaveVideos, 'All 16 fleet citizens resolve to valid /cctv/ video stream paths');

// Test danger user 1
assert(tier3.getVideoForCitizen('RN-WR-9204') === '/cctv/1..mp4', 
  'User 1 in danger (Priyanka Mohapatra RN-WR-9204) strictly resolves to /cctv/1..mp4');

// Test danger user 2
assert(tier3.getVideoForCitizen('RN-WR-8812') === '/cctv/2..mp4', 
  'User 2 in danger (Subhashree Jena RN-WR-8812) strictly resolves to /cctv/2..mp4');

// Test Render Output
const container = { innerHTML: '' };
tier3.activeDeviceId = 'RN-WR-9204';
tier3.render(container);

assert(container.innerHTML.includes('id="tier3-citizen-select"'), 'Rendered HTML contains #tier3-citizen-select');
assert(container.innerHTML.includes('value="RN-WR-9204" selected'), 'Selected option is RN-WR-9204');
assert(container.innerHTML.includes('src="/cctv/1..mp4"'), 'Rendered <video> src is /cctv/1..mp4 for RN-WR-9204');
assert(container.innerHTML.includes('Priyanka Mohapatra'), 'Rendered HTML displays Priyanka Mohapatra');

// Test Switching Citizen to Subhashree Jena (RN-WR-8812)
tier3.switchCitizen('RN-WR-8812');
assert(tier3.activeDeviceId === 'RN-WR-8812', 'tier3.activeDeviceId switched to RN-WR-8812');
assert(tier3.getVideoForCitizen('RN-WR-8812') === '/cctv/2..mp4', 'Subhashree Jena video is /cctv/2..mp4');
assert(tier3.activeCamera !== null, 'Active camera was updated for RN-WR-8812');
assert(tier3.activeCamera.id === 'CAM-KIIT-09', 'Nearest camera for RN-WR-8812 is CAM-KIIT-09');

// Test Video Play/Pause Toggle
const mockVideo = simulatedDOM.getElementById('tier3-cctv-video');
const mockBtn = simulatedDOM.getElementById('btn-toggle-video');
mockVideo.paused = false;
tier3.toggleVideoPlay();
assert(mockVideo.paused === true, 'toggleVideoPlay() pauses currently playing video');
assert(mockBtn.innerHTML.includes('PLAY'), 'Button label updates to PLAY');

tier3.toggleVideoPlay();
assert(mockVideo.paused === false, 'toggleVideoPlay() resumes playback');
assert(mockBtn.innerHTML.includes('PAUSE'), 'Button label updates to PAUSE');

// 5. Test Live HTTP Server Streaming of Videos
console.log('\n5. Testing Live HTTP Video Endpoints (http://127.0.0.1:3000):');

const videosToTest = [
  '/cctv/1..mp4',
  '/cctv/2..mp4',
  '/cctv/3428152233-preview.mp4',
  '/cctv/4008145829-preview.mp4',
  '/cctv/4062791841-preview.mp4',
  '/cctv/gettyimages-1995818584-640_adpp.mp4',
  '/cctv/gettyimages-1995820194-640_adpp.mp4',
  '/cctv/gettyimages-872512026-640_adpp.mp4',
  '/cctv/Lancaster%20sexual%20assault%20and%20burglary%20CCTV.mp4',
  '/cctv/North%20Korean%20Girls%20Walking%20in%20Step.mp4',
  '/cctv/Road%20safety%20video%20_%20Example%20of%20blind%20spot%20in%20truck%20car%20road%20accident...mp4'
];

let pendingRequests = videosToTest.length;

videosToTest.forEach(videoUrl => {
  const req = http.get(`http://127.0.0.1:3000${videoUrl}`, (res) => {
    assert(res.statusCode === 200 || res.statusCode === 206, 
      `Server serves "${videoUrl}" with HTTP ${res.statusCode} (${res.headers['content-type']})`);
    
    res.resume(); // consume stream
    pendingRequests--;
    if (pendingRequests === 0) {
      console.log('\n================================================================');
      console.log(`RESULTS: ${testsPassed} Passed, ${testsFailed} Failed`);
      console.log('================================================================\n');
      process.exit(testsFailed > 0 ? 1 : 0);
    }
  });

  req.on('error', (err) => {
    assert(false, `Request to ${videoUrl} failed: ${err.message}`);
    pendingRequests--;
    if (pendingRequests === 0) {
      process.exit(1);
    }
  });
});
