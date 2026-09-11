// Rakshak-Net CAD - Tier 1: Wearable Trigger Hardware Diagnostics (Simplified View)

window.RakshakTier1View = {
  engineeringDetailsOpen: false,
  expandedDeviceIds: new Set(),
  fleetData: null,

  initFleetData: function() {
    if (!this.fleetData) {
      this.fleetData = JSON.parse(JSON.stringify(window.RakshakData.wearablesFleet));
    }
  },

  getSortedFleet: function() {
    this.initFleetData();
    const priority = {
      'TRIGGER_ACTIVE': 4,
      'FALL_ALERT': 3,
      'LOW_BATTERY_WARNING': 2,
      'STANDBY': 1
    };
    return [...this.fleetData].sort((a, b) => {
      if (a.recentEscalated && !b.recentEscalated) return -1;
      if (!a.recentEscalated && b.recentEscalated) return 1;
      const pA = priority[a.status] || 0;
      const pB = priority[b.status] || 0;
      if (pB !== pA) return pB - pA;
      return 0;
    });
  },

  render: function(container) {
    this.initFleetData();
    const data = window.RakshakData;
    const fleet = this.getSortedFleet();

    container.innerHTML = `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>Tier 1: Wearable Trigger Telemetry & Diagnostics</h1>
          <div class="page-subtitle">Priority-sorted triage stream &bull; Unified voice &amp; hardware triggers &bull; Telemetry profile biometric verification</div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button id="tier1-eng-toggle-btn" class="btn-toggle-engineering ${this.engineeringDetailsOpen ? 'is-active' : ''}" onclick="window.RakshakTier1View.toggleEngineeringDetails()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span id="tier1-eng-toggle-label">${this.engineeringDetailsOpen ? 'Hide Engineering Details &#9652;' : 'Show Engineering Details &#9662;'}</span>
          </button>
          <button id="btn-sim-voice" class="btn btn-outline btn-sm" onclick="window.RakshakTier1View.triggerUnified('VOICE')" title="Simulate Voice Trigger (Voice Keyword Distress 'Help')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            Simulate Voice Distress ('Help')
          </button>
          <button id="btn-sim-panic" class="btn btn-outline btn-sm" onclick="window.RakshakTier1View.triggerUnified('BUTTON')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Simulate Physical Panic Button
          </button>
        </div>
      </div>

      <!-- 4 Quick Hardware Specs Tiles with 'Learn more' hover tooltips -->
      <div class="stat-grid-4">
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Registered Wearables</span>
            <span class="badge badge-online">PROVISIONED</span>
          </div>
          <div class="stat-tile-val">14,820</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">Band X1 (9,410) | Pendant Pro (5,410)</div>
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Hardware Cryptography</span>
            <span class="badge badge-online">AES-128 GCM</span>
          </div>
          <div class="stat-tile-val text-primary">100% Verified</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">Hardware Secure Element ATECC608A</div>
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Mean Battery Longevity</span>
            <span class="badge badge-neutral">18.4 Mo.</span>
          </div>
          <div class="stat-tile-val">84.2%</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">Ultra-Low Power nRF52840 Sleep Mode</div>
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Trigger Debounce Reliability</span>
            <span class="badge badge-online">99.98%</span>
          </div>
          <div class="stat-tile-val text-success">Zero Drift</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">Triple-Tap Capacitive Debounce Filter</div>
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Heart Rate Sensor (PPG)</span>
            <span class="badge badge-online">OPTICAL PPG</span>
          </div>
          <div class="stat-tile-val mono">74 BPM</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">MAX30102 PPG Optical Biosensor &bull; 50Hz continuous pulse rate &amp; HRV telemetry</div>
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Skin Temp Sensor</span>
            <span class="badge badge-online">&plusmn;0.1&deg;C ACC</span>
          </div>
          <div class="stat-tile-val mono">33.8&deg;C</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">High-Precision Medical NTC Thermistor &bull; Micro-climatic thermoregulation tracker</div>
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>GSR Stress Sensor</span>
            <span class="badge badge-online">EDA TELEMETRY</span>
          </div>
          <div class="stat-tile-val mono">18 / 100</div>
          <div class="stat-tooltip-wrap">
            <span class="stat-learn-more" tabindex="0">
              Learn more
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div class="stat-tooltip-popover">Galvanic Skin Response (EDA) &bull; Micro-Siemens sympathetic sweat response index</div>
          </div>
        </div>
      </div>

      <!-- Collapsible Engineering Details Row (Collapsed by default) -->
      <div id="tier1-engineering-details" style="display: ${this.engineeringDetailsOpen ? 'grid' : 'none'}; grid-template-columns: 1.1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <!-- Left: Device Engineering Specifications & Technical Wireframe Placeholder -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
              Hardware Engineering Blueprint & Architecture
            </div>
            <span class="badge badge-neutral">REV 3.2 HARDWARE</span>
          </div>
          <div class="card-body">
            <!-- Real Stock Photos: Generic Wearable & TinyML PCB Hardware -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
              <div style="border: 1px solid var(--border-color); border-radius: 3px; overflow: hidden; background: #FFFFFF;">
                <div style="height: 120px; overflow: hidden; position: relative;">
                  <img src="/assets/wearable-bracelet.jpg" alt="Generic Discrete Wearable on Wrist" style="width: 100%; height: 100%; object-fit: cover; display: block;"/>
                  <span class="badge badge-neutral" style="position: absolute; bottom: 6px; left: 6px; font-size: 9.5px; background: rgba(255,255,255,0.9);">FORM FACTOR: BRACELET</span>
                </div>
                <div style="padding: 6px 8px; font-size: 11px;">
                  <strong style="color: var(--primary-blue);">Rakshak Band X1</strong>
                  <div class="text-muted" style="font-size: 10px;">Discrete capacitive switch &bull; Zero false-click debounce</div>
                </div>
              </div>

              <div style="border: 1px solid var(--border-color); border-radius: 3px; overflow: hidden; background: #FFFFFF;">
                <div style="height: 120px; overflow: hidden; position: relative;">
                  <img src="/assets/pcb-microcontroller.jpg" alt="TinyML Microcontroller PCB" style="width: 100%; height: 100%; object-fit: cover; display: block;"/>
                  <span class="badge badge-neutral" style="position: absolute; bottom: 6px; left: 6px; font-size: 9.5px; background: rgba(255,255,255,0.9);">CORE: SX1262 + nRF52840</span>
                </div>
                <div style="padding: 6px 8px; font-size: 11px;">
                  <strong style="color: var(--primary-blue);">TinyML Sensor Module</strong>
                  <div class="text-muted" style="font-size: 10px;">Hardware AES-128 GCM &bull; 865 MHz Sub-GHz RF</div>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; font-size: 11.5px;">
              <div style="background-color: #FAFAFA; border: 1px solid var(--border-color); padding: 8px 10px; border-radius: 2px;">
                <div class="text-bold" style="color: var(--primary-blue); margin-bottom: 2px;">Panic Activation Logic</div>
                <div style="color: var(--text-secondary);">3 physical button depressions within 1,200ms window. Prevents false triggers in bags or pockets.</div>
              </div>
              <div style="background-color: #FAFAFA; border: 1px solid var(--border-color); padding: 8px 10px; border-radius: 2px;">
                <div class="text-bold" style="color: var(--primary-blue); margin-bottom: 2px;">Dual-Band Fall Kinematics</div>
                <div style="color: var(--text-secondary);">LIS3DHTR 3-axis accelerometer evaluates free-fall followed by impact spike (&gt;4.5G) and stillness window.</div>
              </div>
              <div style="background-color: #FAFAFA; border: 1px solid var(--border-color); padding: 8px 10px; border-radius: 2px;">
                <div class="text-bold" style="color: var(--primary-blue); margin-bottom: 2px;">Voice Keyword Detection</div>
                <div style="color: var(--text-secondary);">Small on-device MEMS microphone listens locally for distress keywords ("help", "alert", configurable).</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Hex Payload Dissector & Live Simulated Waveform -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              Encrypted Over-The-Air Frame Inspector
            </div>
            <span class="mono" style="font-size: 11px; color: var(--status-green);">FRAME VALID</span>
          </div>
          <div class="card-body">
            <div id="tier1-raw-frame-label" style="margin-bottom: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-secondary);">
              Raw LoRaWAN Radio Frame (Device: RN-WR-9204):
            </div>
            <div id="tier1-raw-hex" class="raw-hex-box" style="margin-bottom: 12px;">
0x7F4A92040188E4B192E0F103A899C74E
            </div>

            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px;">
              Protocol Frame Breakdown:
            </div>
            <table class="cad-table" style="font-size: 11px; border: 1px solid var(--border-color);">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Bytes</th>
                  <th>Hex Data</th>
                  <th>Parsed Value</th>
                </tr>
              </thead>
              <tbody id="tier1-protocol-tbody">
                <tr>
                  <td class="text-bold">Sync Header</td>
                  <td class="mono">0-1</td>
                  <td class="mono">7F 4A</td>
                  <td>Rakshak Net Protocol v2.1</td>
                </tr>
                <tr>
                  <td class="text-bold">Device EUI</td>
                  <td class="mono">2-5</td>
                  <td class="mono text-primary">92 04</td>
                  <td class="mono">RN-WR-9204 (Citizen: P. Mohapatra)</td>
                </tr>
                <tr>
                  <td class="text-bold">Event Code</td>
                  <td class="mono">6</td>
                  <td class="mono text-danger">01</td>
                  <td><span class="badge badge-critical">PANIC_TRIPLE_CLICK</span></td>
                </tr>
                <tr>
                  <td class="text-bold">Battery &amp; Temp</td>
                  <td class="mono">7</td>
                  <td class="mono">88</td>
                  <td>4.12 V (89% Capacity / 28°C)</td>
                </tr>
                <tr>
                  <td class="text-bold">Jerk Vector</td>
                  <td class="mono">8-11</td>
                  <td class="mono">E4 B1 92 E0</td>
                  <td>X: +2.84G, Y: -1.95G, Z: +0.88G (3.56G)</td>
                </tr>
                <tr>
                  <td class="text-bold">Replay Counter</td>
                  <td class="mono">12-13</td>
                  <td class="mono">F1 03</td>
                  <td>Seq #61,699 (Anti-Replay Passed)</td>
                </tr>
                <tr>
                  <td class="text-bold">Crypto MIC</td>
                  <td class="mono">14-17</td>
                  <td class="mono">A8 99 C7 4E</td>
                  <td>AES-128 GCM Tag + CRC16 OK</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Hidden compatibility container for biometric panel -->
      <div id="tier1-biometric-panel" class="biometric-verification-card" style="display: none;">
        <!-- Legacy compatibility: Simulate Voice Trigger and simulateTrigger('VOICE_KEYWORD') -->
        <span>Heart Rate (BPM)</span>
        <span>Skin Temperature (&deg;C)</span>
        <span>GSR / Sweat Response</span>
        <span id="bio-hr-val">74 BPM</span>
        <span id="bio-temp-val">33.8°C</span>
        <span id="bio-gsr-val">18 / 100</span>
        <span id="bio-hr-badge" class="badge badge-neutral">NORMAL</span>
        <span id="bio-temp-badge" class="badge badge-neutral">NORMAL</span>
        <span id="bio-gsr-badge" class="badge badge-neutral">NORMAL</span>
        <span class="badge-flat-rec"><span class="badge-flat-rec-dot"></span> REC</span>
        <div class="waveform-container"><div class="waveform-bar"></div></div>
        <div>Stress Signature Confirmed &mdash; Starting Background Audio Capture</div>
        <div>15-second rolling buffer &bull; Encrypted &bull; Auto-deleted if alert is dismissed as false</div>
        <div>Multimodal Confidence: 96% &mdash; Escalating to AI Verification (Tier 3)</div>
        <div>Motion: Calm / Involuntary Stillness</div>
        <div>Voice: Keyword "HELP"</div>
        <div>Biometrics: 3/3 Elevated</div>
        <div>Audio Pattern: High-Stress Acoustic Tone</div>
      </div>

      <!-- Fleet Telemetry Table: 4 Default Columns + Expandable Rows -->
      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Active Wearable Devices Fleet Telemetry
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="privacy-badge" title="Data privacy by design: identity masked in telemetry streams until dispatch approval">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Data Privacy by Design
            </span>
            <span class="mono" style="font-size: 11px; color: var(--text-muted);">${fleet.length} Nodes Monitored &bull; Click any row to expand details</span>
          </div>
        </div>
        <div class="card-body-flush" style="overflow-x: auto;">
          <table class="cad-table">
            <thead>
              <tr>
                <th style="width: 25%;">Device ID</th>
                <th style="width: 20%;">Battery Level</th>
                <th style="width: 25%;">Operational Status</th>
                <th style="width: 30%;">Accelerometer Jerk</th>
              </tr>
            </thead>
            <tbody id="tier1-fleet-tbody">
              ${this.renderFleetTableRowsHtml()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  toggleEngineeringDetails: function() {
    this.engineeringDetailsOpen = !this.engineeringDetailsOpen;
    const container = document.getElementById("tier1-engineering-details");
    const label = document.getElementById("tier1-eng-toggle-label");
    const btn = document.getElementById("tier1-eng-toggle-btn");
    if (container) {
      container.style.display = this.engineeringDetailsOpen ? "grid" : "none";
    }
    if (label) {
      label.innerHTML = this.engineeringDetailsOpen ? "Hide Engineering Details &#9652;" : "Show Engineering Details &#9662;";
    }
    if (btn) {
      btn.classList.toggle("is-active", this.engineeringDetailsOpen);
    }
  },

  toggleRow: function(deviceId) {
    const row = document.getElementById(`fleet-row-${deviceId}`);
    const expandRow = document.getElementById(`fleet-expand-${deviceId}`);
    if (!expandRow) return;

    const isCurrentlyOpen = expandRow.style.display !== 'none';
    if (isCurrentlyOpen) {
      expandRow.style.display = 'none';
      if (row) row.classList.remove('is-expanded');
      this.expandedDeviceIds.delete(deviceId);
    } else {
      expandRow.style.display = 'table-row';
      if (row) row.classList.add('is-expanded');
      this.expandedDeviceIds.add(deviceId);
    }
  },

  renderFleetTableRowsHtml: function() {
    const sorted = this.getSortedFleet();
    return sorted.map(dev => {
      const isCritical = dev.status === 'TRIGGER_ACTIVE';
      const isFallAlert = dev.status === 'FALL_ALERT';
      const rowClass = isCritical ? 'row-critical' : (isFallAlert ? 'row-fall-alert' : '');
      const isExpanded = this.expandedDeviceIds.has(dev.deviceId);

      return `
        <!-- Main Visible Row (4 Clean Columns, Citizen ID Only) -->
        <tr id="fleet-row-${dev.deviceId}"
            class="fleet-table-row ${rowClass} ${isExpanded ? 'is-expanded' : ''} ${dev.recentEscalated ? 'row-escalated-flash' : ''}"
            onclick="window.RakshakTier1View.toggleRow('${dev.deviceId}')"
            title="Click row to inspect decrypted citizen profile and telemetry">
          <td class="mono text-bold" style="white-space: nowrap;">
            <span class="fleet-expand-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
            ${dev.deviceId}
            ${dev.recentEscalated ? '<span class="badge-escalated-tag">&uarr; Escalated</span>' : ''}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="mono text-bold">${dev.batteryPercent}%</span>
              <span class="text-muted" style="font-size: 10.5px;">(${dev.voltage})</span>
            </div>
          </td>
          <td>
            <span class="badge ${isCritical ? 'badge-critical' : (isFallAlert ? 'badge-high' : (dev.status === 'LOW_BATTERY_WARNING' ? 'badge-warning' : 'badge-neutral'))}">
              ${dev.status}
            </span>
          </td>
          <td class="mono">${dev.accelState}</td>
        </tr>

        <!-- Expandable Inline Drawer (Reveals Citizen Name, Model, AES-128, PDR, Diagnostics) -->
        <tr id="fleet-expand-${dev.deviceId}"
            class="fleet-expand-row ${rowClass}"
            style="display: ${isExpanded ? 'table-row' : 'none'};">
          <td colspan="4">
            <div class="fleet-expand-content">
              <!-- Privacy Notice Banner -->
              <div style="display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; border: 1px solid var(--border-color); border-left: 3px solid var(--primary-blue); padding: 8px 12px; border-radius: 2px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="privacy-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Data Privacy by Design
                  </span>
                  <span style="font-size: 11px; color: var(--text-secondary);">
                    Personal identity masked at Tier 1 telemetry stream. Decrypted for authorized emergency dispatch &amp; field triage.
                  </span>
                </div>
                <div class="mono text-muted" style="font-size: 10.5px;">
                  Secured via ATECC608A KDF2
                </div>
              </div>

              <!-- 5 Moved Columns Detailed Inline with Merged Single Action -->
              <div class="fleet-detail-grid">
                <div class="fleet-detail-box">
                  <div class="fleet-detail-label">Registered Citizen</div>
                  <div class="fleet-detail-value" style="color: var(--primary-blue); font-size: 13px;">
                    ${dev.registeredUser}
                  </div>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
                    Citizen ID: <span class="mono">${dev.deviceId}</span>
                  </div>
                </div>

                <div class="fleet-detail-box">
                  <div class="fleet-detail-label">Hardware Model</div>
                  <div class="fleet-detail-value">${dev.model}</div>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
                    BLE RSSI: <span class="mono">${dev.bleRssi} dBm</span> &bull; Clicks: <span class="mono">${dev.buttonClicks}</span>
                  </div>
                </div>

                <div class="fleet-detail-box">
                  <div class="fleet-detail-label">AES-128 Cryptographic Status</div>
                  <div class="fleet-detail-value">
                    <span class="badge badge-online">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ${dev.aesKeyStatus}
                    </span>
                  </div>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
                    Hardware AES-128 GCM (Zero Drift)
                  </div>
                </div>

                <div class="fleet-detail-box">
                  <div class="fleet-detail-label">Packet Delivery (PDR)</div>
                  <div class="fleet-detail-value mono">${dev.pdrRate}</div>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
                    Heartbeat: ${dev.lastHeartbeat}
                  </div>
                </div>

                <div class="fleet-detail-box" style="display: flex; flex-direction: column; justify-content: center; gap: 4px;">
                  <div class="fleet-detail-label">Diagnostics &amp; Triage Action</div>
                  <div style="display: flex; gap: 6px; margin-top: 2px;">
                    <button class="btn btn-outline btn-xs" style="flex: 1; font-weight: 600; white-space: nowrap; padding: 5px 6px; font-size: 11px;" onclick="event.stopPropagation(); window.RakshakTier1View.inspectDevice('${dev.deviceId}')">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      Telemetry Profile
                    </button>
                    <button id="btn-track-location-${dev.deviceId}" class="btn btn-primary btn-xs" style="flex: 1; font-weight: 600; white-space: nowrap; padding: 5px 6px; font-size: 11px; background-color: var(--primary-blue);" onclick="event.stopPropagation(); window.RakshakTier1View.trackLocation('${dev.deviceId}')">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                      Track Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderFleetTableRows: function() {
    const tbody = document.getElementById("tier1-fleet-tbody");
    if (!tbody) return;
    tbody.innerHTML = this.renderFleetTableRowsHtml();
  },

  triggerUnified: function(type) {
    this.initFleetData();

    // Select target device:
    // If VOICE: escalate RN-WR-9204 (Priyanka Mohapatra) or RN-WR-4401
    // If BUTTON: escalate RN-WR-8812 (Subhashree Jena) or RN-WR-7719
    let target = null;
    if (type === 'VOICE') {
      target = this.fleetData.find(d => d.deviceId === 'RN-WR-9204' || (d.registeredUser && d.registeredUser.includes('Mohapatra'))) || this.fleetData.find(d => d.deviceId === 'RN-WR-4401') || this.fleetData[0];
    } else {
      target = this.fleetData.find(d => d.deviceId === 'RN-WR-8812' || (d.registeredUser && d.registeredUser.includes('Jena'))) || this.fleetData.find(d => d.deviceId === 'RN-WR-7719') || this.fleetData[1];
    }

    if (!target) target = this.fleetData[0];

    // Clear previous recentEscalated
    this.fleetData.forEach(d => { d.recentEscalated = false; });

    const timeStr = new Date().toLocaleTimeString('en-GB') + " IST";

    target.status = 'TRIGGER_ACTIVE';
    target.recentEscalated = true;
    target.triggerTime = "Today " + timeStr;

    if (type === 'VOICE') {
      target.triggerSource = "Voice Distress ('Help')";
      target.accelState = 'ELEVATED_HR / VOICE_KW (98.4%)';
      target.biometrics = {
        hr: 134,
        temp: 35.6,
        gsr: 88,
        hrStatus: 'ELEVATED',
        tempStatus: 'ELEVATED',
        gsrStatus: 'ELEVATED'
      };
    } else {
      target.triggerSource = "Physical Panic Button";
      target.accelState = 'MANUAL_PANIC (Hardware Switch)';
      target.buttonClicks = (target.buttonClicks || 0) + 1;
      target.biometrics = {
        hr: 138,
        temp: 35.8,
        gsr: 92,
        hrStatus: 'ELEVATED',
        tempStatus: 'ELEVATED',
        gsrStatus: 'ELEVATED'
      };
    }

    // Re-render fleet table so this device is dynamically moved to the top
    this.renderFleetTableRows();

    // Subtle audio chime
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    // Update raw LoRa Radio frame in engineering details
    const rawBox = document.getElementById("tier1-raw-hex");
    const frameLabel = document.getElementById("tier1-raw-frame-label");
    const tbody = document.getElementById("tier1-protocol-tbody");
    if (rawBox) {
      const codeHex = type === 'VOICE' ? '03' : '01';
      const labelText = type === 'VOICE' ? 'VOICE DISTRESS ("HELP")' : 'PHYSICAL PANIC BUTTON';
      rawBox.innerHTML = `0x7F4A${target.deviceId.replace(/[^0-9]/g, '')}${codeHex}86E0A192E0F104C184E912 [TRANSMITTED: ${timeStr} | ${labelText} | PRIORITY ESCALATION]`;
      rawBox.style.borderColor = "#C0392B";
      rawBox.style.backgroundColor = "#FFF5F5";
    }
    if (frameLabel) {
      frameLabel.innerHTML = `Raw LoRaWAN Radio Frame (Device: ${target.deviceId} &bull; ${type === 'VOICE' ? 'Voice Distress' : 'Hardware Panic Button'}):`;
    }
    if (tbody) {
      tbody.innerHTML = `
        <tr><td class="text-bold">Sync Header</td><td class="mono">0-1</td><td class="mono">7F 4A</td><td>Rakshak Net Protocol v2.1</td></tr>
        <tr><td class="text-bold">Device EUI</td><td class="mono">2-5</td><td class="mono text-primary">${target.deviceId.slice(-4)}</td><td class="mono">${target.deviceId} (${target.registeredUser})</td></tr>
        <tr><td class="text-bold">Event Code</td><td class="mono">6</td><td class="mono text-danger">${type === 'VOICE' ? '03' : '01'}</td><td><span class="badge badge-critical">${type === 'VOICE' ? 'VOICE_DISTRESS_KEYWORD ("HELP")' : 'PANIC_PHYSICAL_BUTTON'}</span></td></tr>
        <tr><td class="text-bold">Battery &amp; Temp</td><td class="mono">7</td><td class="mono">${target.batteryPercent}</td><td>${target.voltage} (${target.batteryPercent}% Capacity / 35.6°C)</td></tr>
        <tr><td class="text-bold">Jerk Vector</td><td class="mono">8-11</td><td class="mono">E0 A1 92 E0</td><td>X: +0.42G, Y: +0.28G, Z: +0.94G (Triage Priority 1)</td></tr>
        <tr><td class="text-bold">Replay Counter</td><td class="mono">12-13</td><td class="mono">F1 04</td><td>Seq #61,701 (Anti-Replay Passed)</td></tr>
        <tr><td class="text-bold">Crypto MIC</td><td class="mono">14-17</td><td class="mono">C1 84 E9 12</td><td>AES-128 GCM Tag + CRC16 OK</td></tr>
      `;
    }

    // Fade out / remove escalated tag after 4.5s
    setTimeout(() => {
      target.recentEscalated = false;
      const tag = document.querySelector(`#fleet-row-${target.deviceId} .badge-escalated-tag`);
      if (tag) tag.remove();
    }, 4500);
  },

  simulateTrigger: function(type) {
    if (type === 'VOICE_KEYWORD') {
      this.triggerUnified('VOICE');
    } else {
      this.triggerUnified('BUTTON');
    }
  },

  triggerVoiceBiometricsSimulation: function() {
    this.triggerUnified('VOICE');
  },

  bioTimer1: null,
  bioTimer2: null,
  bioTimer3: null,

  resetBiometricVerification: function() {
    if (this.bioTimer1) clearTimeout(this.bioTimer1);
    if (this.bioTimer2) clearTimeout(this.bioTimer2);
    if (this.bioTimer3) clearTimeout(this.bioTimer3);
  },

  batteryChartInstance: null,
  jerkChartInstance: null,
  audioPlaying: false,
  audioInterval: null,

  toggleAudioPlayback: function() {
    const audio = document.getElementById("telemetry-distress-audio");
    const playBtn = document.getElementById("btn-play-distress-audio");
    const playLabel = document.getElementById("audio-play-label");
    const playIcon = document.getElementById("audio-play-icon");
    const waveform = document.getElementById("distress-waveform");
    const progress = document.getElementById("distress-audio-progress-bar");
    const counter = document.getElementById("audio-time-counter");

    if (!audio) return;

    if (this.audioPlaying) {
      audio.pause();
      this.audioPlaying = false;
      if (playLabel) playLabel.innerText = "Listen to Audio Buffer (15s)";
      if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
      if (playBtn) playBtn.classList.remove("btn-active-recording");
      if (waveform) waveform.classList.remove("is-playing");
      if (this.audioInterval) {
        clearInterval(this.audioInterval);
        this.audioInterval = null;
      }
    } else {
      audio.play().then(() => {
        this.audioPlaying = true;
        if (playLabel) playLabel.innerText = "Stop / Pause Buffer";
        if (playIcon) playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        if (playBtn) playBtn.classList.add("btn-active-recording");
        if (waveform) waveform.classList.add("is-playing");

        if (this.audioInterval) clearInterval(this.audioInterval);
        this.audioInterval = setInterval(() => {
          if (!audio.paused && !audio.ended) {
            const cur = audio.currentTime || 0;
            const dur = audio.duration || 15;
            const pct = Math.min(100, (cur / dur) * 100);
            if (progress) progress.style.width = pct + "%";
            if (counter) {
              const curSec = Math.floor(cur);
              const durSec = Math.floor(dur);
              counter.innerText = `00:${curSec < 10 ? '0' + curSec : curSec} / 00:${durSec < 10 ? '0' + durSec : durSec}`;
            }
          }
        }, 100);
      }).catch(err => {
        console.warn("Audio playback error:", err);
      });

      audio.onended = () => {
        this.audioPlaying = false;
        if (playLabel) playLabel.innerText = "Listen to Audio Buffer (15s)";
        if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        if (playBtn) playBtn.classList.remove("btn-active-recording");
        if (waveform) waveform.classList.remove("is-playing");
        if (progress) progress.style.width = "0%";
        const durSec = Math.floor(audio.duration || 15);
        if (counter) counter.innerText = `00:00 / 00:${durSec < 10 ? '0' + durSec : durSec}`;
        if (this.audioInterval) {
          clearInterval(this.audioInterval);
          this.audioInterval = null;
        }
      };
    }
  },

  selectDistressAudio: function(src) {
    const audio = document.getElementById("telemetry-distress-audio");
    if (!audio) return;
    const wasPlaying = this.audioPlaying;
    if (this.audioPlaying) {
      this.toggleAudioPlayback();
    }
    audio.src = src;
    audio.load();
    const progress = document.getElementById("distress-audio-progress-bar");
    const counter = document.getElementById("audio-time-counter");
    if (progress) progress.style.width = "0%";
    audio.onloadedmetadata = () => {
      const durSec = Math.floor(audio.duration || 15);
      if (counter) counter.innerText = `00:00 / 00:${durSec < 10 ? '0' + durSec : durSec}`;
    };
    if (counter) counter.innerText = "00:00 / --:--";
    if (wasPlaying) {
      setTimeout(() => { this.toggleAudioPlayback(); }, 150);
    }
  },

  seekAudio: function(event) {
    const audio = document.getElementById("telemetry-distress-audio");
    if (!audio || !audio.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = pct * audio.duration;
    const progress = document.getElementById("distress-audio-progress-bar");
    if (progress) progress.style.width = (pct * 100) + "%";
  },

  closeTelemetryModal: function(event) {
    if (event && event.target && event.target.closest && event.target.closest(".cad-modal-window") && event.target.className !== "cad-modal-close") {
      return;
    }
    const modal = document.getElementById("telemetry-profile-modal");
    if (modal) modal.style.display = "none";
    if (this.batteryChartInstance) {
      this.batteryChartInstance.destroy();
      this.batteryChartInstance = null;
    }
    if (this.jerkChartInstance) {
      this.jerkChartInstance.destroy();
      this.jerkChartInstance = null;
    }
    // Stop any playing audio on modal close
    const audio = document.getElementById("telemetry-distress-audio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.audioPlaying = false;
    if (this.audioInterval) {
      clearInterval(this.audioInterval);
      this.audioInterval = null;
    }
  },

  trackLocation: function(deviceId) {
    if (window.RakshakTier2View) {
      window.RakshakTier2View.activeDeviceId = deviceId;
      if (window.RakshakTier2View.getUser) {
        const u = window.RakshakTier2View.getUser(deviceId);
        if (u && u.coords) {
          window.RakshakTier2View.baseWearablePos = [...u.coords];
          window.RakshakTier2View.currentWearablePos = [...u.coords];
        }
      }
      if (window.RakshakTier2View.trackUser) {
        window.RakshakTier2View.trackUser(deviceId);
      }
    }
    if (window.RakshakApp && window.RakshakApp.switchTab) {
      window.RakshakApp.switchTab('tier2_lora');
    }
  },

  inspectDevice: function(deviceId) {
    this.initFleetData();
    const dev = this.fleetData.find(d => d.deviceId === deviceId) || window.RakshakData.wearablesFleet.find(d => d.deviceId === deviceId);
    if (!dev) return;

    const modal = document.getElementById("telemetry-profile-modal");
    if (!modal) return;
    modal.style.display = "flex";

    // Clean up previous charts if present
    if (this.batteryChartInstance) {
      this.batteryChartInstance.destroy();
      this.batteryChartInstance = null;
    }
    if (this.jerkChartInstance) {
      this.jerkChartInstance.destroy();
      this.jerkChartInstance = null;
    }

    // 1. Update Title
    const titleEl = document.getElementById("telemetry-modal-title");
    if (titleEl) {
      titleEl.innerHTML = `Telemetry Profile &amp; Biometric Verification &mdash; ${dev.deviceId}`;
    }

    // Provisioning Date (simulated)
    const numPart = parseInt(dev.deviceId.replace(/\D/g, '') || '1000', 10);
    const day = (numPart % 25) + 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const provDate = `${day < 10 ? '0' + day : day}-${months[numPart % 12]}-2025 09:30 IST`;

    // Status Badge
    let statusBadgeHtml = '<span class="badge badge-neutral">STANDBY</span>';
    if (dev.status === 'TRIGGER_ACTIVE') {
      statusBadgeHtml = '<span class="badge badge-critical">TRIGGER_ACTIVE</span>';
    } else if (dev.status === 'FALL_ALERT') {
      statusBadgeHtml = '<span class="badge badge-high">FALL_ALERT</span>';
    } else if (dev.status === 'LOW_BATTERY_WARNING') {
      statusBadgeHtml = '<span class="badge badge-warning">LOW_BATTERY_WARNING</span>';
    }

    const isTrigger = dev.status === 'TRIGGER_ACTIVE';
    const isFall = dev.status === 'FALL_ALERT';
    const isTriggeredAny = isTrigger || isFall;

    // Trigger Source & Timestamp
    const triggerSourceText = dev.triggerSource || (isTrigger ? "Voice Distress ('Help')" : (isFall ? "Fall Impact Shock (>4.5G)" : "Standby Nominal"));
    const incidentTimestamp = dev.triggerTime || "Today 22:54:10 IST";

    // Biometrics values
    const hrVal = isTriggeredAny ? (dev.biometrics ? dev.biometrics.hr : 134) : 74;
    const hrBadgeText = isTriggeredAny ? "ELEVATED" : "NORMAL";
    const hrBadgeClass = isTriggeredAny ? "badge-critical" : "badge-neutral";
    const hrMeterWidth = isTriggeredAny ? "86%" : "38%";
    const hrSparkPath = isTriggeredAny ? "M0,18 L15,17 L30,15 L45,10 L60,5 L75,2 L90,3 L100,2" : "M0,18 L15,17 L30,19 L45,16 L60,18 L75,17 L90,18 L100,17";
    const hrSparkColor = isTriggeredAny ? "#C0392B" : "#2563EB";

    const tempVal = isTriggeredAny ? (dev.biometrics ? dev.biometrics.temp : 35.6) : 33.8;
    const tempBadgeText = isTriggeredAny ? "ELEVATED" : "NORMAL";
    const tempBadgeClass = isTriggeredAny ? "badge-high" : "badge-neutral";
    const tempMeterWidth = isTriggeredAny ? "72%" : "42%";
    const tempSparkPath = isTriggeredAny ? "M0,16 L20,16 L40,13 L60,10 L80,7 L100,6" : "M0,16 L20,16 L40,15 L60,16 L80,15 L100,15";
    const tempSparkColor = isTriggeredAny ? "#D35400" : "#2563EB";

    const gsrVal = isTriggeredAny ? (dev.biometrics ? dev.biometrics.gsr : 88) : 18;
    const gsrBadgeText = isTriggeredAny ? "ELEVATED" : "NORMAL";
    const gsrBadgeClass = isTriggeredAny ? "badge-critical" : "badge-neutral";
    const gsrMeterWidth = isTriggeredAny ? "88%" : "18%";
    const gsrSparkPath = isTriggeredAny ? "M0,20 L20,19 L40,14 L60,7 L80,3 L100,2" : "M0,20 L20,21 L40,19 L60,20 L80,20 L100,21";
    const gsrSparkColor = isTriggeredAny ? "#C0392B" : "#2563EB";

    // 24-hour timeline labels
    const hours24 = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "Now"];
    
    // Battery history (last 24h discharge curve)
    const startBatt = Math.min(100, dev.batteryPercent + 7);
    const stepBatt = (startBatt - dev.batteryPercent) / 12;
    const batteryData = hours24.map((_, i) => Math.round((startBatt - (stepBatt * i)) * 10) / 10);

    // Jerk timeline with alert markers
    const jerkData = [0.99, 1.01, 0.98, 1.02, 1.00, 1.05, 1.01, 1.03, 1.00, 1.02, 1.04, 1.01, 1.00];
    const pointColors = Array(13).fill("#94A3B8");
    const pointRadii = Array(13).fill(2.5);

    if (isTrigger) {
      jerkData[11] = 3.56;
      pointColors[11] = "#C0392B";
      pointRadii[11] = 6.5;
    } else if (isFall) {
      jerkData[11] = 5.76;
      pointColors[11] = "#D35400";
      pointRadii[11] = 6.5;
    }

    // Connectivity Audit Log
    const connLogs = [
      isTrigger
        ? { time: "Today 22:54:10 IST", event: "EMERGENCY: Triple-Click Panic Uplink Transmitted (Priority Code 01)", signal: "-88 dBm (Critical Uplink)" }
        : isFall
        ? { time: "Today 22:54:12 IST", event: "EMERGENCY: 5.76G Impact Shock Frame Transmitted (Priority Code 02)", signal: "-94 dBm (Critical Uplink)" }
        : { time: "Today 22:48:14 IST", event: "LoRa frame ACK received via Gateway GW-BBSR-01", signal: `${dev.bleRssi || -58} dBm (SNR +9.4 dB)` },
      { time: "Today 22:15:20 IST", event: "LoRa handoff to Node #12 (Patia Pole OD-1402)", signal: "-64 dBm (SNR +8.1 dB)" },
      { time: "Today 21:30:05 IST", event: "BLE reconnected to companion transceiver", signal: "-52 dBm (Nominal)" },
      { time: "Today 18:45:10 IST", event: "Periodic heartbeat uplink #61,698 (AES-128 GCM OK)", signal: "-60 dBm (SNR +10.2 dB)" },
      { time: "Today 14:10:44 IST", event: "Gateway GW-BBSR-03 route negotiation (1-hop relay)", signal: "-66 dBm (SNR +7.6 dB)" }
    ];

    // Determine Citizen-Specific Audio Recording (Fixed per citizen profile, no dropdown arrow)
    const regName = (dev.registeredUser || '').toLowerCase();
    const devId = (dev.deviceId || '').toUpperCase();
    let audioSrc = '/audio/user-distress-audio-1.wav';
    let audioLabel = 'Priyanka Mohapatra — Live Distress Audio #1';
    let audioDurationSec = 27;

    if (regName.includes('subhashree') || regName.includes('jena') || devId === 'RN-WR-8812') {
      audioSrc = '/audio/user-distress-audio-2.wav';
      audioLabel = 'Subhashree Jena — Live Distress Audio #2';
      audioDurationSec = 41;
    } else if (regName.includes('priyanka') || regName.includes('mohapatra') || devId === 'RN-WR-9204') {
      audioSrc = '/audio/user-distress-audio-1.wav';
      audioLabel = 'Priyanka Mohapatra — Live Distress Audio #1';
      audioDurationSec = 27;
    } else {
      audioSrc = '/audio/user-distress-audio-1.wav';
      audioLabel = `${dev.registeredUser} — Live Distress Audio #1`;
      audioDurationSec = 27;
    }

    // Build Modal Body
    const bodyEl = document.getElementById("telemetry-modal-body");
    if (bodyEl) {
      bodyEl.innerHTML = `
        <!-- Section a: Header (Citizen ID, Device Model, Trigger Source, Timestamp) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(135px, 1fr)); gap: 12px; margin-bottom: 16px; background: #F8FAFC; border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 3px;">
          <div>
            <div style="font-size: 10px; font-weight: 650; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Citizen ID</div>
            <div class="mono text-bold" style="font-size: 13px; color: var(--primary-blue); margin-top: 3px;">${dev.deviceId}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 650; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Hardware Model</div>
            <div style="font-size: 12.5px; font-weight: 600; color: var(--text-main); margin-top: 3px;">${dev.model}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 650; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Trigger Source</div>
            <div class="mono text-bold" style="font-size: 12px; color: ${isTriggeredAny ? '#C0392B' : 'var(--text-main)'}; margin-top: 3px;">${triggerSourceText}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 650; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Timestamp</div>
            <div class="mono" style="font-size: 12px; color: var(--text-secondary); margin-top: 3px;">${incidentTimestamp}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 650; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Operational Status</div>
            <div style="margin-top: 3px;">${statusBadgeHtml}</div>
          </div>
          <div style="display: none;">Provisioning Date: ${provDate}</div>
        </div>

        <!-- Section b: Biometric Panel (Live Gauges with NORMAL/ELEVATED badges) -->
        <div class="modal-biometric-section">
          <div class="modal-biometric-header">
            <span style="display: flex; align-items: center; gap: 6px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Biometric Stress Verification Gauges
            </span>
            <span class="badge ${isTriggeredAny ? 'badge-critical' : 'badge-online'}">
              ${isTriggeredAny ? 'ELEVATED STRESS DETECTED' : 'RESTING BASELINE'}
            </span>
          </div>

          <div class="biometric-grid" style="margin-bottom: 0;">
            <!-- Gauge 1: Heart Rate (BPM) -->
            <div class="biometric-gauge-tile">
              <div class="biometric-gauge-header">
                <span class="biometric-gauge-title">Heart Rate (BPM)</span>
                <span class="badge ${hrBadgeClass}">${hrBadgeText}</span>
              </div>
              <div class="biometric-val-row">
                <span class="biometric-val ${isTriggeredAny ? 'is-elevated' : ''}">${hrVal} <span style="font-size: 12px; font-weight: 500;">BPM</span></span>
                <span class="biometric-baseline">Resting: ~75 BPM</span>
              </div>
              <div class="biometric-meter">
                <div class="biometric-meter-fill ${isTriggeredAny ? 'is-elevated' : ''}" style="width: ${hrMeterWidth};"></div>
              </div>
              <div class="biometric-sparkline-wrap">
                <svg class="biometric-sparkline-svg" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path d="${hrSparkPath}" fill="none" stroke="${hrSparkColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <!-- Gauge 2: Skin Temperature (°C) -->
            <div class="biometric-gauge-tile">
              <div class="biometric-gauge-header">
                <span class="biometric-gauge-title">Skin Temperature (&deg;C)</span>
                <span class="badge ${tempBadgeClass}">${tempBadgeText}</span>
              </div>
              <div class="biometric-val-row">
                <span class="biometric-val ${isTriggeredAny ? 'is-elevated' : ''}">${tempVal} <span style="font-size: 12px; font-weight: 500;">&deg;C</span></span>
                <span class="biometric-baseline">Baseline: 33.8&deg;C</span>
              </div>
              <div class="biometric-meter">
                <div class="biometric-meter-fill ${isTriggeredAny ? 'is-elevated' : ''}" style="width: ${tempMeterWidth};"></div>
              </div>
              <div class="biometric-sparkline-wrap">
                <svg class="biometric-sparkline-svg" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path d="${tempSparkPath}" fill="none" stroke="${tempSparkColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <!-- Gauge 3: GSR Stress Index (0-100) -->
            <div class="biometric-gauge-tile">
              <div class="biometric-gauge-header">
                <span class="biometric-gauge-title">GSR Stress Index (0-100)</span>
                <span class="badge ${gsrBadgeClass}">${gsrBadgeText}</span>
              </div>
              <div class="biometric-val-row">
                <span class="biometric-val ${isTriggeredAny ? 'is-elevated' : ''}">${gsrVal} <span style="font-size: 12px; font-weight: 500;">/ 100</span></span>
                <span class="biometric-baseline">Scale: 0-100</span>
              </div>
              <div class="biometric-meter">
                <div class="biometric-meter-fill ${isTriggeredAny ? 'is-elevated' : ''}" style="width: ${gsrMeterWidth};"></div>
              </div>
              <div class="biometric-sparkline-wrap">
                <svg class="biometric-sparkline-svg" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path d="${gsrSparkPath}" fill="none" stroke="${gsrSparkColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        ${isTriggeredAny ? `
          <!-- Section c: Verdict Line -->
          <div style="background: #FFF5F5; border: 1px solid #FECACA; padding: 10px 14px; border-radius: 3px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div style="font-size: 12px; font-weight: 700; color: #991B1B; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              2/3 biometric signals elevated &mdash; starting background audio verification
            </div>
            <span class="mono text-bold" style="font-size: 10.5px; color: #991B1B;">SIGNATURE CONFIRMED</span>
          </div>

          <!-- Section d: Audio Verification Panel & Live Buffer Player -->
          <div class="audio-capture-panel" style="margin-bottom: 14px; flex-direction: column; align-items: stretch; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div class="audio-capture-left">
                <div class="audio-capture-headline">
                  <span class="badge-flat-rec"><span class="badge-flat-rec-dot"></span> REC</span>
                  <span>Audio Verification: Acoustic Distress Analysis</span>
                  <span class="badge badge-critical" style="font-size: 9.5px; padding: 1px 6px; letter-spacing: 0.3px;">● RECORDING BACKGROUND AUDIO</span>
                </div>
                <div class="audio-capture-caption">
                  15s rolling buffer &bull; Analyzing against trained distress-speech model &bull; Encrypted, auto-deleted if dismissed
                </div>
              </div>
              <div class="audio-capture-right">
                <div id="distress-waveform" class="waveform-container" title="15s rolling audio buffer capture stream">
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                  <div class="waveform-bar"></div>
                </div>
                <span id="distress-buffer-time-tag" class="mono" style="font-size: 11px; font-weight: 600; color: #991B1B;">BUFFER: 00:15 / AES-128</span>
              </div>
            </div>

            <!-- Fixed Citizen Audio Stream & Playback Bar (No dropdown arrow) -->
            <div style="background: #FFFFFF; border: 1px solid #FECACA; border-radius: 2px; padding: 8px 12px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 260px;">
                  <button id="btn-play-distress-audio" class="btn btn-sm btn-critical" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600; padding: 5px 12px;" onclick="window.RakshakTier1View.toggleAudioPlayback()">
                    <svg id="audio-play-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span id="audio-play-label">Listen to Audio Buffer (15s)</span>
                  </button>
                  <span id="audio-time-counter" class="mono" style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">00:00 / 00:${audioDurationSec < 10 ? '0' + audioDurationSec : audioDurationSec}</span>
                </div>

                <!-- Fixed Citizen Audio Stream Badge (No Dropdown Arrow) -->
                <div style="display: flex; align-items: center; gap: 6px; background: #FFF5F5; border: 1px solid #FECACA; padding: 4px 10px; border-radius: 2px;">
                  <span class="badge badge-critical" style="font-size: 9px; padding: 1px 5px; letter-spacing: 0.3px;">CITIZEN FEED</span>
                  <span style="font-size: 11px; font-weight: 600; color: #991B1B;">
                    ${audioLabel}
                  </span>
                </div>
              </div>

              <!-- Audio progress track -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="flex: 1; height: 5px; background: #FEE2E2; border-radius: 3px; overflow: hidden; cursor: pointer; position: relative;" onclick="window.RakshakTier1View.seekAudio(event)" title="Click to scrub audio">
                  <div id="distress-audio-progress-bar" style="width: 0%; height: 100%; background: #DC2626; transition: width 0.1s linear;"></div>
                </div>
                <span class="mono" style="font-size: 10px; color: #991B1B;">ENCRYPTED 24.00kHz PCM &bull; ${dev.deviceId}</span>
              </div>
            </div>

            <!-- HTML5 Audio Element fixed to this citizen's recording -->
            <audio id="telemetry-distress-audio" preload="auto" src="${audioSrc}" style="display: none;"></audio>

            <!-- Hidden compatibility tags -->
            <div id="distress-audio-select" style="display:none;" data-current="${audioSrc}" data-sample1="distress-sample-1.wav" data-sample2="distress-sample-2.wav" data-sample3="distress-sample-3.wav"></div>
          </div>

          <!-- Section e: Final AI Confidence Line -->
          <div class="multimodal-verdict-card" style="margin-bottom: 18px; border-left: 3px solid #16A34A;">
            <div class="verdict-info">
              <div class="verdict-headline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Multimodal Confidence: 96% &mdash; Escalating to Tier 3 AI Verification
              </div>
              <div class="verdict-chip-row">
                <span class="verdict-chip">Motion: Low Jerk / Stillness (0.94G)</span>
                <span class="verdict-chip">Voice: Keyword "HELP" Confirmed (98.4%)</span>
                <span class="verdict-chip">Biometrics: Autonomic Surge (HR 134, GSR 88)</span>
                <span class="verdict-chip">Audio Pattern: Distress Acoustic Pitch</span>
              </div>
            </div>
            <div class="verdict-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-outline btn-sm" onclick="window.RakshakTier1View.closeTelemetryModal(); window.RakshakApp.switchTab('tier3_ai');">
                Proceed to Tier 3 AI Verification &rarr;
              </button>
              <button class="btn btn-primary btn-sm" style="background-color: var(--primary-blue);" onclick="window.RakshakTier1View.closeTelemetryModal(); window.RakshakTier1View.trackLocation('${dev.deviceId}');">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                Track Live Location in Tier 2 &rarr;
              </button>
            </div>
          </div>
        ` : `
          <!-- Standby Nominal Banner -->
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 10px 14px; border-radius: 3px; margin-bottom: 18px; font-size: 12px; color: #166534; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span>All 3 autonomic biosignals within resting baseline limits. No audio verification required.</span>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span class="badge badge-online">NOMINAL MONITORING</span>
              <button class="btn btn-primary btn-xs" style="background-color: var(--primary-blue); padding: 4px 8px; font-size: 11px; font-weight: 600;" onclick="window.RakshakTier1View.closeTelemetryModal(); window.RakshakTier1View.trackLocation('${dev.deviceId}')">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                Track Location
              </button>
            </div>
          </div>
        `}

        <!-- Section f: Existing Battery & Jerk History Charts & Connectivity Logs (Unchanged) -->
        <div style="margin-bottom: 18px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.5px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>Battery Level Profile (Last 24 Hours)</span>
            <span class="mono text-bold" style="font-size: 11px; color: var(--text-main);">Current: ${dev.batteryPercent}% (${dev.voltage})</span>
          </div>
          <div style="height: 125px; border: 1px solid var(--border-color); padding: 8px 12px; background: #FFFFFF; border-radius: 2px;">
            <canvas id="telemetry-battery-canvas"></canvas>
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.5px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span>Accelerometer Jerk Timeline (Last 24 Hours &bull; Baseline: 1.0G)</span>
            <div style="display: flex; gap: 8px;">
              <span class="badge badge-critical" style="font-size: 9.5px; padding: 1px 6px;">Red Dot: Panic Trigger</span>
              <span class="badge badge-high" style="font-size: 9.5px; padding: 1px 6px;">Orange Dot: Fall Shock</span>
            </div>
          </div>
          <div style="height: 125px; border: 1px solid var(--border-color); padding: 8px 12px; background: #FFFFFF; border-radius: 2px;">
            <canvas id="telemetry-jerk-canvas"></canvas>
          </div>
        </div>

        <div style="margin-bottom: 4px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.5px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>Radio Connectivity &amp; Gateway Audit Log</span>
            <span class="mono" style="font-size: 10px; color: var(--text-muted);">Protocol: IN865 Sub-GHz + Dual BLE</span>
          </div>
          <table class="cad-table" style="font-size: 11.5px; border: 1px solid var(--border-color);">
            <thead>
              <tr>
                <th style="width: 24%;">Timestamp</th>
                <th style="width: 50%;">Event Description</th>
                <th style="width: 26%;">Signal Strength</th>
              </tr>
            </thead>
            <tbody>
              ${connLogs.map(log => `
                <tr>
                  <td class="mono">${log.time}</td>
                  <td>${log.event}</td>
                  <td class="mono">${log.signal}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // 5. Firmware & Security Footer Line
    const footerEl = document.getElementById("telemetry-modal-footer");
    if (footerEl) {
      footerEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; font-size: 11.5px;">
          <span><strong style="color: var(--text-secondary);">Firmware:</strong> <span class="mono text-bold" style="color: var(--primary-blue);">v2.1.8-sec (SX1262+ATECC608A)</span></span>
          <span><strong style="color: var(--text-secondary);">Key Rotation:</strong> <span class="mono">2026-09-08 04:00 IST (KDF2 OK)</span></span>
          <span><strong style="color: var(--text-secondary);">Anti-Replay Counter:</strong> <span class="badge badge-online">#61,699 VERIFIED</span></span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.RakshakTier1View.closeTelemetryModal()">Close</button>
      `;
    }

    // Initialize Chart.js instances
    setTimeout(() => {
      // Battery Chart
      const battCanvas = document.getElementById("telemetry-battery-canvas");
      if (battCanvas && typeof Chart !== "undefined") {
        this.batteryChartInstance = new Chart(battCanvas, {
          type: "line",
          data: {
            labels: hours24,
            datasets: [{
              label: "Battery %",
              data: batteryData,
              borderColor: dev.batteryPercent < 25 ? "#C0392B" : "#0F4C81",
              backgroundColor: "rgba(15, 76, 129, 0.04)",
              borderWidth: 1.8,
              pointRadius: 2.5,
              pointHoverRadius: 4.5,
              pointBackgroundColor: dev.batteryPercent < 25 ? "#C0392B" : "#0F4C81",
              tension: 0.15,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1E293B",
                titleFont: { family: "'Inter', sans-serif", size: 11 },
                bodyFont: { family: "'JetBrains Mono', monospace", size: 10.5 },
                padding: 6,
                cornerRadius: 2,
                callbacks: {
                  label: (ctx) => ` Battery: ${ctx.parsed.y}%`
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 9.5 }, color: "#718096" }
              },
              y: {
                min: 0,
                max: 100,
                grid: { color: "#F1F5F9" },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 9.5 }, color: "#718096", stepSize: 25 }
              }
            }
          }
        });
      }

      // Jerk Chart
      const jerkCanvas = document.getElementById("telemetry-jerk-canvas");
      if (jerkCanvas && typeof Chart !== "undefined") {
        this.jerkChartInstance = new Chart(jerkCanvas, {
          type: "line",
          data: {
            labels: hours24,
            datasets: [{
              label: "Accelerometer Jerk (G)",
              data: jerkData,
              borderColor: "#475569",
              borderWidth: 1.5,
              pointRadius: pointRadii,
              pointHoverRadius: 6,
              pointBackgroundColor: pointColors,
              pointBorderColor: "#FFFFFF",
              pointBorderWidth: 1.5,
              tension: 0.2,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1E293B",
                titleFont: { family: "'Inter', sans-serif", size: 11 },
                bodyFont: { family: "'JetBrains Mono', monospace", size: 10.5 },
                padding: 6,
                cornerRadius: 2,
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.parsed.y;
                    if (val > 3.0 && dev.status === 'TRIGGER_ACTIVE') {
                      return ` Jerk: ${val}G — [TRIGGER_ACTIVE Panic Button]`;
                    }
                    if (val > 3.0 && dev.status === 'FALL_ALERT') {
                      return ` Jerk: ${val}G — [FALL_ALERT Impact Shock]`;
                    }
                    return ` Jerk: ${val}G (Nominal)`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 9.5 }, color: "#718096" }
              },
              y: {
                min: 0,
                suggestedMax: Math.max(4.0, ...jerkData) + 0.5,
                grid: { color: "#F1F5F9" },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 9.5 }, color: "#718096", stepSize: 1 }
              }
            }
          }
        });
      }
    }, 40);
  }
};
