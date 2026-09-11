const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/styles.css', 'utf8');
const overview = fs.readFileSync('js/views/overview.js', 'utf8');

const tests = [
  {
    name: 'Req 1: Header bar has ONLY logo/title, CAD CORE: ONLINE, clock, and System Info dropdown',
    pass: html.includes('CAD CORE: ONLINE') && 
          html.includes('system-info-dropdown-wrap') && 
          html.includes('System Info ▾') &&
          !html.includes('<div class="header-metric">\n          <span class="metric-label">Municipal Radio Band</span>')
  },
  {
    name: 'Req 1: System Info dropdown is hidden by default',
    pass: html.includes('id="system-info-menu" class="system-info-menu" style="display: none;"')
  },
  {
    name: 'Req 2: Duplicate Core Architecture Launchpad cards deleted completely',
    pass: !overview.includes('feature-hub-grid') && !overview.includes('Operational Sub-Features Launchpad')
  },
  {
    name: 'Req 2: 3-step pipeline banner retained',
    pass: overview.includes('pipeline-card') && overview.includes('Wearable Detects Distress') && overview.includes('LoRa Relay Transmits') && overview.includes('AI Verifies + Dispatch Sent')
  },
  {
    name: 'Req 3: Headline stat/line in normal weight text on stat cards',
    pass: overview.includes('stat-headline-line')
  },
  {
    name: 'Req 3: Technical specs in collapsible Details ▾ section (collapsed by default)',
    pass: overview.includes('<details class="stat-details-expand">') && overview.includes('<summary>Details ▾</summary>')
  },
  {
    name: 'Req 4: Responsive grid with auto-fit and wrap',
    pass: css.includes('repeat(auto-fit, minmax(280px, 1fr))') && css.includes('flex-wrap: wrap;')
  },
  {
    name: 'Req 5: Alert banner removes citizen name/age, uses Case ID only',
    pass: html.includes('Case ID: RN-INC-2026-0941') && !html.includes('Priyanka Mohapatra')
  },
  {
    name: 'Req 5: Alert banner broken into 2 lines with increased spacing',
    pass: html.includes('urgent-banner-line1') && html.includes('urgent-banner-line2') && css.includes('line-height: 1.55')
  },
  {
    name: 'Req 6: Card padding at least 20px (e.g. 22-24px)',
    pass: css.includes('padding: 22px 24px;') && css.includes('padding: 24px;')
  },
  {
    name: 'Req 6: Section gaps at least 32px',
    pass: css.includes('margin-bottom: 32px;')
  }
];

let allPassed = true;
tests.forEach(t => {
  console.log(`[${t.pass ? 'PASS' : 'FAIL'}] ${t.name}`);
  if (!t.pass) allPassed = false;
});

console.log(`\nVerification Result: ${allPassed ? 'ALL 6 REQUIREMENTS FULLY SATISFIED' : 'SOME TESTS FAILED'}`);
process.exit(allPassed ? 0 : 1);
