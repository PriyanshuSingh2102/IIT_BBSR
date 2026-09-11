// Rakshak-Net CAD - Analytics & Coverage Admin Page
// Designed for Judges and Senior Command Evaluators
// Strict Constraints: Plain, Flat Chart Styling (No 3D bars, No gradient fills), White Background, Flat Numbers

window.RakshakAnalyticsView = {
  chartsInitialized: false,

  render: function(container) {
    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>Analytics &amp; Coverage Admin</h1>
          <div class="page-subtitle">Metropolitan public safety impact, LoRa mesh propagation benchmarks, and fleet-wide response analytics</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="window.RakshakAnalyticsView.exportAuditCSV()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Audit CSV
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Executive Brief
          </button>
        </div>
      </div>

      <!-- City Impact Aerial Banner Photo -->
      <div style="border: 1px solid var(--border-color); border-radius: 3px; overflow: hidden; margin-bottom: 16px; background: #FFFFFF; display: flex; align-items: stretch;">
        <div style="width: 220px; min-height: 80px; position: relative; flex-shrink: 0;">
          <img src="/assets/city-skyline-banner.jpg" alt="Bhubaneswar Urban Coverage Grid" style="width: 100%; height: 100%; object-fit: cover; display: block;"/>
        </div>
        <div style="padding: 12px 18px; display: flex; flex-direction: column; justify-content: center; flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: var(--primary-blue); font-size: 13px;">Bhubaneswar Smart City Public Safety Grid &bull; Operational Audit</strong>
            <span class="badge badge-online">STATE GOV AUDIT READY</span>
          </div>
          <div style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.4;">
            Autonomous 3-Tier Multi-Hazard Architecture deployed across 67 municipal wards. Eliminates cellular dead-zone vulnerability through LoRa mesh relays and stops false alarms via multimodal AI verification.
          </div>
        </div>
      </div>

      <!-- 1. Row of KPI Cards: Flat Number Cards, Small Trend Arrows Only, No Glow -->
      <div class="stat-grid-4">
        <!-- KPI 1 -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Total SOS Events Handled</span>
            <span class="trend-indicator up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              +12 this week
            </span>
          </div>
          <div class="stat-tile-val">248</div>
          <div class="stat-tile-sub">
            <span class="text-bold text-success">100% CAD resolved</span> &bull; 0 lost distress packets
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Avg Response Time</span>
            <span class="trend-indicator up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
              -42s vs target
            </span>
          </div>
          <div class="stat-tile-val text-primary">3.2 min</div>
          <div class="stat-tile-sub">
            <span class="text-bold">SLA: &lt; 5.0 min</span> &bull; Bhubaneswar Urban Police
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>False Positive Rate</span>
            <span class="trend-indicator up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
              1.6% residual
            </span>
          </div>
          <div class="stat-tile-val text-success">1.6%</div>
          <div class="stat-tile-sub">
            <span class="text-bold">98.4% filtered</span> by Tier 3 multimodal AI
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Dead-Zone Coverage via LoRa Mesh</span>
            <span class="trend-indicator up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              +6.2% shadow ext.
            </span>
          </div>
          <div class="stat-tile-val">94.8%</div>
          <div class="stat-tile-sub">
            <span class="text-bold">86 active poles</span> covering cellular blind spots
          </div>
        </div>
      </div>

      <!-- 2 & 3. Charts Row: Flat Bar Chart & Flat Line Chart -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <!-- 2. Bar Chart: SOS Events by Area / Zone (Plain Flat Bars, No Gradients, No 3D) -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              SOS Events by Area / Zone (Last 30 Days)
            </div>
            <span class="mono" style="font-size: 11px; color: var(--text-muted);">Total: 248 Incidents</span>
          </div>
          <div class="card-body" style="padding: 16px;">
            <div style="position: relative; height: 260px; width: 100%;">
              <canvas id="chart-events-by-zone" style="display: block; width: 100%; height: 100%;"></canvas>
            </div>
          </div>
        </div>

        <!-- 3. Line Chart: Average Response Time Trend Over the Last 7 Days (Plain Flat Line) -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Average Response Time Trend (Last 7 Days)
            </div>
            <span class="mono text-success" style="font-size: 11px; font-weight: 600;">SLA MET (3.2 MIN CURRENT)</span>
          </div>
          <div class="card-body" style="padding: 16px;">
            <div style="position: relative; height: 260px; width: 100%;">
              <canvas id="chart-response-trend" style="display: block; width: 100%; height: 100%;"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Simple Table: Relay Node Health Across the City -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
            Relay Node Health Across the City &bull; Municipal Smart Pole Grid
          </div>
          <span class="mono" style="font-size: 11px; color: var(--text-muted);">IN865 Band &bull; Telemetry Interval: 3000ms</span>
        </div>
        <div class="card-body-flush" style="overflow-x: auto;">
          <table class="cad-table">
            <thead>
              <tr>
                <th style="width: 25%;">Node ID</th>
                <th style="width: 25%;">Uptime %</th>
                <th style="width: 25%;">Battery</th>
                <th style="width: 25%;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="mono text-bold">
                  Node #01 <span class="text-muted" style="font-size: 10.5px;">(Patia High-Mast &bull; #OD-1401)</span>
                </td>
                <td class="mono text-bold text-success">99.94%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">98%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Solar Float 27.4V)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #02 <span class="text-muted" style="font-size: 10.5px;">(KIIT Square Traffic Mast &bull; #OD-1402)</span>
                </td>
                <td class="mono text-bold text-success">99.98%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">100%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Mains + UPS Buffer)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #03 <span class="text-muted" style="font-size: 10.5px;">(CSPUR BDA Housing Tower &bull; #OD-1403)</span>
                </td>
                <td class="mono text-bold text-success">99.89%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">96%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Solar Float 26.8V)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #04 <span class="text-muted" style="font-size: 10.5px;">(Saheed Nagar Janpath Overhead &bull; #OD-1404)</span>
                </td>
                <td class="mono text-bold text-success">99.91%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">99%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Mains + LiFePO4)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #05 <span class="text-muted" style="font-size: 10.5px;">(Master Canteen Smart City Pole &bull; #OD-1405)</span>
                </td>
                <td class="mono text-bold text-success">99.85%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">94%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Grid Connected)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #06 <span class="text-muted" style="font-size: 10.5px;">(Khandagiri Square Junction &bull; #OD-1406)</span>
                </td>
                <td class="mono text-bold text-success">99.72%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">91%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Solar Array 400W)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #07 <span class="text-muted" style="font-size: 10.5px;">(Jayadev Vihar Flyover Pole &bull; #OD-1407)</span>
                </td>
                <td class="mono text-bold text-success">99.95%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">99%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Mains Feed)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #12 <span class="text-muted" style="font-size: 10.5px;">(Infocity West Pedestrian Corridor &bull; #OD-1412)</span>
                </td>
                <td class="mono text-bold text-success">99.64%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">88%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Solar Float 25.9V)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr>
                <td class="mono text-bold">
                  Node #34 <span class="text-muted" style="font-size: 10.5px;">(Infocity West Pole #OD-1408)</span>
                </td>
                <td class="mono text-bold text-success">98.80%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold">84%</span>
                    <span class="text-muted" style="font-size: 10.5px;">(Auxiliary Cell)</span>
                  </div>
                </td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr style="background-color: #FFFBF0;">
                <td class="mono text-bold">
                  Node #47 <span class="text-muted" style="font-size: 10.5px;">(Sailashree Vihar Secondary &bull; #OD-1447)</span>
                </td>
                <td class="mono text-bold text-warning">97.40%</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono text-bold text-danger">19%</span>
                    <span class="badge badge-high" style="font-size: 9.5px;">Low Battery</span>
                  </div>
                </td>
                <td><span class="badge badge-high">RECHARGE_PENDING</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Render Plain Flat Charts
    setTimeout(() => {
      window.RakshakAnalyticsView.initCharts();
    }, 50);
  },

  initCharts: function() {
    // 1. Plain Flat Bar Chart: SOS Events by Zone
    const barCanvas = document.getElementById("chart-events-by-zone");
    if (barCanvas) {
      if (typeof Chart !== "undefined") {
        new Chart(barCanvas, {
          type: "bar",
          data: {
            labels: [
              "Patia / Infocity",
              "KIIT Corridor",
              "Chandrasekharpur",
              "Saheed Nagar",
              "Master Canteen",
              "Khandagiri",
              "Nayapalli"
            ],
            datasets: [{
              label: "SOS Events",
              data: [54, 42, 31, 48, 38, 22, 13],
              backgroundColor: "#0F4C81", // Solid corporate blue, strictly no gradients
              borderColor: "#0F4C81",
              borderWidth: 1,
              borderRadius: 2,
              maxBarThickness: 32
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1E293B",
                titleFont: { family: "'Inter', sans-serif", size: 12 },
                bodyFont: { family: "monospace", size: 11 },
                padding: 8,
                cornerRadius: 2
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  font: { family: "'Inter', sans-serif", size: 10.5 },
                  color: "#4A5568"
                }
              },
              y: {
                beginAtZero: true,
                grid: { color: "#E2E8F0" },
                ticks: {
                  font: { family: "monospace", size: 10.5 },
                  color: "#718096",
                  stepSize: 10
                }
              }
            }
          }
        });
      } else {
        // Pure SVG Fallback for Bar Chart (Guaranteed zero-dependency flat rendering)
        this.renderSvgBarChart(barCanvas.parentElement);
      }
    }

    // 2. Plain Flat Line Chart: Average Response Time Trend (Last 7 Days)
    const lineCanvas = document.getElementById("chart-response-trend");
    if (lineCanvas) {
      if (typeof Chart !== "undefined") {
        new Chart(lineCanvas, {
          type: "line",
          data: {
            labels: ["03 Sep", "04 Sep", "05 Sep", "06 Sep", "07 Sep", "08 Sep", "09 Sep (Today)"],
            datasets: [
              {
                label: "Avg Response Time (Minutes)",
                data: [4.6, 4.2, 3.9, 3.7, 3.4, 3.3, 3.2],
                borderColor: "#0F4C81", // Flat corporate blue
                backgroundColor: "#0F4C81",
                borderWidth: 2.5,
                pointRadius: 4,
                pointBackgroundColor: "#0F4C81",
                pointBorderColor: "#FFFFFF",
                pointBorderWidth: 1.5,
                fill: false, // Strictly no gradient fill under line
                tension: 0.1
              },
              {
                label: "Target SLA (5.0 min)",
                data: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
                borderColor: "#C0392B", // Flat red SLA reference line
                borderWidth: 1.5,
                borderDash: [6, 4],
                pointRadius: 0,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                  boxWidth: 12,
                  boxHeight: 2,
                  font: { family: "'Inter', sans-serif", size: 11 },
                  color: "#4A5568"
                }
              },
              tooltip: {
                backgroundColor: "#1E293B",
                titleFont: { family: "'Inter', sans-serif", size: 12 },
                bodyFont: { family: "monospace", size: 11 },
                padding: 8,
                cornerRadius: 2
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  font: { family: "'Inter', sans-serif", size: 10.5 },
                  color: "#4A5568"
                }
              },
              y: {
                min: 2.0,
                max: 6.0,
                grid: { color: "#E2E8F0" },
                ticks: {
                  font: { family: "monospace", size: 10.5 },
                  color: "#718096",
                  callback: (val) => val + " min"
                }
              }
            }
          }
        });
      } else {
        // Pure SVG Fallback for Line Chart
        this.renderSvgLineChart(lineCanvas.parentElement);
      }
    }
  },

  renderSvgBarChart: function(container) {
    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 540 240">
        <line x1="50" y1="20" x2="50" y2="200" stroke="#CBD5E1" stroke-width="1"/>
        <line x1="50" y1="200" x2="520" y2="200" stroke="#CBD5E1" stroke-width="1"/>
        <line x1="50" y1="150" x2="520" y2="150" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3, 3"/>
        <line x1="50" y1="100" x2="520" y2="100" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3, 3"/>
        <line x1="50" y1="50" x2="520" y2="50" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3, 3"/>
        <text x="35" y="55" font-family="monospace" font-size="10" fill="#718096" text-anchor="end">50</text>
        <text x="35" y="105" font-family="monospace" font-size="10" fill="#718096" text-anchor="end">35</text>
        <text x="35" y="155" font-family="monospace" font-size="10" fill="#718096" text-anchor="end">20</text>
        <text x="35" y="205" font-family="monospace" font-size="10" fill="#718096" text-anchor="end">0</text>
        <!-- Flat Bars -->
        <rect x="70" y="38" width="34" height="162" fill="#0F4C81" rx="1"/>
        <text x="87" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">Patia</text>
        <rect x="135" y="74" width="34" height="126" fill="#0F4C81" rx="1"/>
        <text x="152" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">KIIT</text>
        <rect x="200" y="107" width="34" height="93" fill="#0F4C81" rx="1"/>
        <text x="217" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">CSPUR</text>
        <rect x="265" y="56" width="34" height="144" fill="#0F4C81" rx="1"/>
        <text x="282" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">Saheed</text>
        <rect x="330" y="86" width="34" height="114" fill="#0F4C81" rx="1"/>
        <text x="347" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">Station</text>
        <rect x="395" y="134" width="34" height="66" fill="#0F4C81" rx="1"/>
        <text x="412" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">Khanda</text>
        <rect x="460" y="161" width="34" height="39" fill="#0F4C81" rx="1"/>
        <text x="477" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">Nayapalli</text>
      </svg>
    `;
  },

  renderSvgLineChart: function(container) {
    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 540 240">
        <line x1="50" y1="20" x2="50" y2="200" stroke="#CBD5E1" stroke-width="1"/>
        <line x1="50" y1="200" x2="520" y2="200" stroke="#CBD5E1" stroke-width="1"/>
        <!-- Target SLA Reference Line -->
        <line x1="50" y1="50" x2="520" y2="50" stroke="#C0392B" stroke-width="1.5" stroke-dasharray="4, 4"/>
        <text x="515" y="44" font-family="monospace" font-size="9.5" fill="#C0392B" text-anchor="end">SLA 5.0 min</text>
        <!-- Flat Line Trend Path -->
        <polyline points="70,68 140,88 210,102 280,114 350,132 420,138 490,144" fill="none" stroke="#0F4C81" stroke-width="2.5"/>
        <circle cx="70" cy="68" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="140" cy="88" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="210" cy="102" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="280" cy="114" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="350" cy="132" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="420" cy="138" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="490" cy="144" r="4" fill="#0F4C81" stroke="#FFF" stroke-width="1.5"/>
        <!-- Labels -->
        <text x="70" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">03 Sep</text>
        <text x="140" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">04 Sep</text>
        <text x="210" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">05 Sep</text>
        <text x="280" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">06 Sep</text>
        <text x="350" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">07 Sep</text>
        <text x="420" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">08 Sep</text>
        <text x="490" y="215" font-family="'Inter', sans-serif" font-size="9" fill="#4A5568" text-anchor="middle">09 Sep</text>
      </svg>
    `;
  },

  exportAuditCSV: function() {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Node_ID,Location,Uptime_Pct,Battery_Level,Power_Source,Status\n"
      + "Node #01,Patia High-Mast #OD-1401,99.94%,98%,Solar Float,ONLINE\n"
      + "Node #02,KIIT Square Traffic Mast #OD-1402,99.98%,100%,Mains+UPS,ONLINE\n"
      + "Node #03,CSPUR BDA Housing Tower #OD-1403,99.89%,96%,Solar Float,ONLINE\n"
      + "Node #04,Saheed Nagar Janpath Overhead #OD-1404,99.91%,99%,Mains+LiFePO4,ONLINE\n"
      + "Node #05,Master Canteen Smart City Pole #OD-1405,99.85%,94%,Grid Connected,ONLINE\n"
      + "Node #06,Khandagiri Square Junction #OD-1406,99.72%,91%,Solar Array,ONLINE\n"
      + "Node #07,Jayadev Vihar Flyover Pole #OD-1407,99.95%,99%,Mains Feed,ONLINE\n"
      + "Node #12,Infocity West Pedestrian Corridor #OD-1412,99.64%,88%,Solar Float,ONLINE\n"
      + "Node #34,Infocity West Pole #OD-1408,98.80%,84%,Auxiliary Cell,ONLINE\n"
      + "Node #47,Sailashree Vihar Secondary #OD-1447,97.40%,19%,Low Battery,RECHARGE_PENDING\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "RAKSHAK_NET_RELAY_HEALTH_AUDIT.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
