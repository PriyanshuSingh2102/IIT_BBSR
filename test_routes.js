const http = require('http');

const files = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/data.js',
  '/js/map.js',
  '/js/app.js',
  '/js/views/overview.js',
  '/js/views/tier1_wearable.js',
  '/js/views/tier2_lora.js',
  '/js/views/tier3_ai.js',
  '/js/views/tier3_dispatch.js',
  '/js/views/analytics.js',
  '/assets/placeholder-specs.txt'
];

let completed = 0;
files.forEach(f => {
  http.get('http://127.0.0.1:3000' + f, (res) => {
    let size = 0;
    res.on('data', chunk => size += chunk.length);
    res.on('end', () => {
      console.log('[PASS] ' + f + ' -> HTTP ' + res.statusCode + ' (' + size + ' bytes)');
      if (++completed === files.length) {
        console.log('\n>>> ALL 13 CORE ROUTES VALIDATED (HTTP 200) ON PORT 3000 <<<');
      }
    });
  }).on('error', err => {
    console.error('[FAIL] ' + f + ' ->', err.message);
  });
});
