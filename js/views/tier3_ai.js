// Rakshak-Net CAD - Tier 3: AI Threat Verification Studio
// Multi-Modal Forensic Video & Audio Corroboration Engine
// Strict Constraints: Restrained, Factual Evidence Tool, Flat Corporate Design, No AI Glow

window.RakshakTier3AIView = {
  isVerifying: false,
  activeDeviceId: "RN-WR-9204",
  activeCamera: null,

  // Real CCTV Video Library in /cctv/
  // Videos 1 & 2 assigned to the two critical users in danger; remaining 9 adjusted by location
  citizenVideoRegistry: {
    "RN-WR-9204": "/cctv/1..mp4",
    "RN-WR-8812": "/cctv/2..mp4",
    "RN-WR-4401": "/cctv/3428152233-preview.mp4",
    "RN-WR-7719": "/cctv/4008145829-preview.mp4",
    "RN-WR-5014": "/cctv/4062791841-preview.mp4",
    "RN-WR-3389": "/cctv/gettyimages-1995818584-640_adpp.mp4",
    "RN-WR-6102": "/cctv/gettyimages-1995820194-640_adpp.mp4",
    "RN-WR-5521": "/cctv/gettyimages-872512026-640_adpp.mp4",
    "RN-WR-4889": "/cctv/Lancaster%20sexual%20assault%20and%20burglary%20CCTV.mp4",
    "RN-WR-3844": "/cctv/North%20Korean%20Girls%20Walking%20in%20Step.mp4",
    "RN-WR-2975": "/cctv/Road%20safety%20video%20_%20Example%20of%20blind%20spot%20in%20truck%20car%20road%20accident...mp4",
    "RN-WR-2510": "/cctv/4008145829-preview.mp4",
    "RN-WR-1940": "/cctv/gettyimages-1995818584-640_adpp.mp4",
    "RN-WR-1622": "/cctv/gettyimages-872512026-640_adpp.mp4",
    "RN-WR-1437": "/cctv/3428152233-preview.mp4",
    "RN-WR-1185": "/cctv/Lancaster%20sexual%20assault%20and%20burglary%20CCTV.mp4"
  },

  getVideoForCitizen: function(deviceId) {
    if (this.citizenVideoRegistry[deviceId]) {
      return this.citizenVideoRegistry[deviceId];
    }
    const vids = Object.values(this.citizenVideoRegistry);
    const num = parseInt((deviceId || "1000").replace(/\D/g, "") || "1000", 10);
    return vids[num % vids.length];
  },

  getActiveCitizen: function() {
    let devId = this.activeDeviceId || (window.RakshakTier2View && window.RakshakTier2View.activeDeviceId) || "RN-WR-9204";
    if (window.RakshakTier2View && window.RakshakTier2View.getUser) {
      const u = window.RakshakTier2View.getUser(devId);
      if (u) return u;
    }
    return {
      deviceId: "RN-WR-9204",
      name: "Priyanka Mohapatra",
      area: "Infocity West Pedestrian Corridor",
      street: "Infocity Ave / Magnetics Crossing",
      ward: "Ward 14 (Patia - Infocity Zone)",
      coords: [20.3562, 85.8174],
      battery: 89,
      status: "TRIGGER_ACTIVE",
      carrierSignal: "0 Bars (Cellular Dead Zone)"
    };
  },

  getAllCitizens: function() {
    if (window.RakshakTier2View && window.RakshakTier2View.userLocations) {
      return Object.values(window.RakshakTier2View.userLocations);
    }
    return [
      { deviceId: "RN-WR-9204", name: "Priyanka Mohapatra", area: "Infocity West Pedestrian Corridor", coords: [20.3562, 85.8174], status: "TRIGGER_ACTIVE" },
      { deviceId: "RN-WR-8812", name: "Subhashree Jena", area: "KIIT Square Residential Perimeter", coords: [20.3516, 85.8152], status: "FALL_ALERT" },
      { deviceId: "RN-WR-4401", name: "Ananya Mishra", area: "Damana Square BDA Colony", coords: [20.3340, 85.8190], status: "STANDBY" }
    ];
  },

  getNearestCameraForCitizen: function(coords) {
    if (window.RakshakTier2View && window.RakshakTier2View.getCamerasSortedByDistance) {
      const sorted = window.RakshakTier2View.getCamerasSortedByDistance(coords);
      if (sorted && sorted.length > 0) {
        const topCam = sorted[0];
        const distText = topCam.distanceMeters < 1000 ? `${topCam.distanceMeters}m from signal origin` : `${(topCam.distanceMeters / 1000).toFixed(2)}km from signal origin`;
        return {
          ...topCam,
          distanceText: distText,
          streamIp: `10.14.${(topCam.distanceMeters % 80) + 12}.${(topCam.distanceMeters % 90) + 15}`,
          channel: "CH-01"
        };
      }
    }
    return {
      id: "CAM-0472",
      name: "MG Road Junction",
      poleId: "OD-BMC-0472",
      distanceText: "40m from signal origin",
      anomalyScore: 87,
      resolution: "1920x1080 @ 30 FPS",
      streamIp: "10.14.88.20",
      channel: "CH-01"
    };
  },

  switchCitizen: function(deviceId) {
    this.activeDeviceId = deviceId;
    if (window.RakshakTier2View) {
      window.RakshakTier2View.activeDeviceId = deviceId;
    }

    const citizen = this.getActiveCitizen();
    this.activeCamera = this.getNearestCameraForCitizen(citizen.coords);

    const container = document.getElementById("main-content-viewport");
    if (container) {
      this.render(container);
    }

    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }
  },

  loadCamera: function(cameraData, citizenId) {
    if (citizenId) {
      this.activeDeviceId = citizenId;
      if (window.RakshakTier2View) {
        window.RakshakTier2View.activeDeviceId = citizenId;
      }
    }
    this.activeCamera = cameraData;

    if (window.RakshakApp && window.RakshakApp.switchTab) {
      window.RakshakApp.switchTab('tier3_ai');
    }
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }
  },

  toggleVideoPlay: function() {
    const video = document.getElementById("tier3-cctv-video");
    const btn = document.getElementById("btn-toggle-video");
    if (!video) return;
    if (video.paused) {
      video.play();
      if (btn) btn.innerHTML = "❚❚ PAUSE";
    } else {
      video.pause();
      if (btn) btn.innerHTML = "▶ PLAY";
    }
  },

  render: function(container) {
    const citizen = this.getActiveCitizen();
    this.activeDeviceId = citizen.deviceId;
    const allCitizens = this.getAllCitizens();
    const cam = this.activeCamera || this.getNearestCameraForCitizen(citizen.coords);
    const videoSrc = this.getVideoForCitizen(citizen.deviceId);

    const isDanger = citizen.status === 'TRIGGER_ACTIVE' || citizen.status === 'FALL_ALERT';
    const isFall = citizen.status === 'FALL_ALERT';
    const threatPct = isFall ? 88 : (isDanger ? (cam.anomalyScore || 87) : 18);

    container.innerHTML = `
      <!-- 5. Small Progress Stepper at the Top -->
      <div class="stepper-container" aria-label="Incident Escalation Stepper">
        <div class="stepper-step completed" id="step-1">
          <div class="stepper-step-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span>1. SOS Received</span>
        </div>

        <div class="stepper-divider"></div>

        <div class="stepper-step completed" id="step-2">
          <div class="stepper-step-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span>2. Camera Located</span>
        </div>

        <div class="stepper-divider"></div>

        <div class="stepper-step completed" id="step-3">
          <div class="stepper-step-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span>3. AI Analyzing</span>
        </div>

        <div class="stepper-divider"></div>

        <div class="stepper-step active" id="step-4">
          <div class="stepper-step-circle">4</div>
          <span style="color: ${isDanger ? 'var(--alert-red)' : 'var(--primary-blue)'};">4. Verified (${threatPct}%)</span>
        </div>

        <div class="stepper-divider"></div>

        <div class="stepper-step" id="step-5">
          <div class="stepper-step-circle">5</div>
          <span>5. Dispatched (CAD)</span>
        </div>
      </div>

      <!-- 1. Header showing Camera Location & Citizen Switcher Dropdown (Matching Screenshot) -->
      <div class="page-header-row" style="margin-bottom: 12px;">
        <div class="page-title-group">
          <div id="ai-status-subtitle" class="mono text-bold" style="color: var(--primary-blue); font-size: 11px; margin-bottom: 2px;">
            TARGET ACQUISITION: 100% COMPLETE &bull; TARGET: <strong>${citizen.name}</strong> (${citizen.deviceId}) &bull; GPS: ${citizen.coords[0].toFixed(4)}° N, ${citizen.coords[1].toFixed(4)}° E
          </div>
          <h1 id="ai-main-heading" style="font-size: 19px; font-weight: 700; color: var(--text-main);">
            Camera ${cam.id} (${cam.name}) — ${cam.distanceText || '40m from signal origin'}
          </h1>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- Citizen Selector Dropdown (matches Tier 2 styling perfectly) -->
          <div class="tracked-user-pill">
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Citizen:</span>
            <select id="tier3-citizen-select" class="tracked-user-select" onchange="window.RakshakTier3AIView.switchCitizen(this.value)">
              ${allCitizens.map(u => `
                <option value="${u.deviceId}" ${u.deviceId === citizen.deviceId ? 'selected' : ''}>
                  ${u.name} (${u.deviceId}) &mdash; ${u.area}
                </option>
              `).join('')}
            </select>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3AIView.simulateCameraMatching()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            Re-Run Verification Pipeline
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3AIView.exportEvidence()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Forensic Packet
          </button>
        </div>
      </div>

      <!-- 4. Final Verdict Banner: Flat Red / Blue Banner Bar -->
      <div class="verdict-banner-bar" style="${isDanger ? '' : 'background-color: #F8FAFC; border-color: #CBD5E1; color: var(--text-main);'}">
        <div class="verdict-title" style="${isDanger ? '' : 'color: var(--primary-blue);'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 22 22 22 12 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${isDanger ? 'THREAT VERIFIED — Escalating to Dispatch' : 'NOMINAL MONITORING — Baseline Corridor Scan'}
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="mono" style="font-size: 11.5px; opacity: 0.95;">Threat Confidence: <strong>${threatPct}% &bull; ${isDanger ? 'Code 3 Directive' : 'Nominal Baseline'}</strong></span>
          <button class="btn btn-sm" style="background-color: #FFFFFF; color: var(--alert-red); border-color: #FFFFFF; font-weight: 700;" onclick="window.RakshakApp.switchTab('tier3_dispatch')">
            Open CAD Dispatch Terminal &rarr;
          </button>
          <button id="btn-ai-broadcast-pcr" class="btn btn-sm" style="background-color: #0F4C81; color: #FFFFFF; border-color: #0F4C81; font-weight: 700;" onclick="window.RakshakTier3DispatchView.broadcastFromAI()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            Broadcast to All PCR Vans (&lt; 15 km) &rarr;
          </button>
        </div>
      </div>

      <!-- Main Visual Section: CCTV Real Video Frame + AI Analysis Panel -->
      <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px;">
        <!-- Left: 2. CCTV Video-Frame Real Player Box -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              Optical Sensor Feed &bull; Pole Mount #${cam.poleId || 'OD-BMC-0472'}
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge badge-online">${cam.status ? cam.status.replace('_', ' ') : 'STREAM VERIFIED'}</span>
            </div>
          </div>
          <div class="card-body-flush">
            <div id="cctv-monitor-box-ai" class="cctv-monitor-box" title="Double click for Full Screen" ondblclick="window.RakshakTier3AIView.toggleFullscreen('cctv-monitor-box-ai')" style="background: #000000; position: relative; overflow: hidden;">
              <!-- Top Timestamp & Metadata Overlay + Full Screen -->
              <div class="cctv-overlay-top" style="z-index: 10;">
                <div>
                  <span class="cctv-rec-dot"></span>
                  <strong>${cam.id} | 12:41:09</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="mono">${(cam.name || 'MG ROAD JUNCTION').toUpperCase()} &bull; ${cam.channel || 'CH-01'}</span>
                  <button class="cctv-fullscreen-btn" title="Full Screen ${cam.id}" onclick="window.RakshakTier3AIView.toggleFullscreen('cctv-monitor-box-ai')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    <span>Full Screen</span>
                  </button>
                </div>
              </div>

              <!-- Real HTML5 Video Stream Player (Streaming from /cctv/) -->
              <video id="tier3-cctv-video" src="${videoSrc}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; background: #000000; z-index: 1;"></video>

              <!-- Bottom Stream Metadata Overlay with Play/Pause Toggle -->
              <div class="cctv-overlay-bottom" style="z-index: 10; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button id="btn-toggle-video" class="btn btn-outline btn-xs" style="background: rgba(15,23,42,0.7); color: #FFF; border-color: rgba(255,255,255,0.25); padding: 1px 7px; font-size: 10px;" onclick="window.RakshakTier3AIView.toggleVideoPlay()">
                    ❚❚ PAUSE
                  </button>
                  <span>RTSP ${cam.streamIp || '10.14.88.20'} &bull; ${cam.resolution || '1920x1080 @ 30 FPS'} &bull; H.264 HARDWARE DECODE</span>
                </div>
                <span>OPTICAL FLOW: ${isFall ? 'IMPACT COLLAPSE' : (isDanger ? 'RAPID DECELERATION' : 'NOMINAL CORRIDOR SCAN')} &bull; LATENCY: 42ms</span>
              </div>
            </div>

            <!-- CCTV Feed Forensic Caption with Mounted Pole Camera Unit Photo -->
            <div style="padding: 10px 14px; font-size: 11.5px; color: var(--text-secondary); background-color: #FAFAFA; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 14px;">
              <img src="/assets/cctv-camera-mounted.jpg" alt="Mounted CCTV Unit #${cam.poleId || 'OD-BMC-0472'}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 2px; border: 1px solid var(--border-color); flex-shrink: 0;"/>
              <div>
                <strong>Automated Camera Correlation:</strong> Camera ${cam.id} (${cam.name}) was automatically correlated to ${citizen.name}'s location (${citizen.area}) via LoRa TDoA geofence (${cam.distanceText || '40m from wearable origin'}). Video feed verified against behavioral neural model.
              </div>
            </div>
          </div>
        </div>

        <!-- Right: 3. "AI Analysis" Panel Listing Detected Behavioral Flags -->
        <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              AI Behavioral Verification Analysis
            </div>
            <span class="badge ${isDanger ? 'badge-critical' : 'badge-online'}">CONFIDENCE: ${threatPct}%</span>
          </div>

          <div class="card-body" style="flex: 1; display: flex; flex-direction: column;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px;">
              Corroborated Threat Indicators:
            </div>

            <!-- Checklist Item 1 -->
            <div class="analysis-check-item">
              <div class="check-label-left">
                <div class="check-icon-box">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>${isFall ? 'Abrupt vertical impact deceleration' : 'Rapid multi-person movement detected'}</span>
              </div>
              <span class="badge ${isDanger ? 'badge-online' : 'badge-neutral'}">${isDanger ? 'Confirmed' : 'Baseline'}</span>
            </div>

            <!-- Checklist Item 2 -->
            <div class="analysis-check-item">
              <div class="check-label-left">
                <div class="check-icon-box">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>${isFall ? 'Pedestrian fall collapse pattern' : 'Physical struggle / pursuit pattern'}</span>
              </div>
              <span class="badge ${isDanger ? 'badge-critical' : 'badge-online'}">${isDanger ? `Confirmed (${threatPct}%)` : 'None Detected'}</span>
            </div>

            <!-- Checklist Item 3 -->
            <div class="analysis-check-item">
              <div class="check-label-left">
                <div class="check-icon-box">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>${citizen.area} Safety Corridor</span>
              </div>
              <span class="badge badge-online">Verified</span>
            </div>

            <!-- Multi-Modal Supporting Forensic Signals -->
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
              <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">
                Sensor Fusion Telemetry Corroboration:
              </div>
              <table class="cad-table" style="font-size: 11px; border: 1px solid var(--border-color);">
                <tbody>
                  <tr>
                    <td class="text-bold">Wearable Kinematics</td>
                    <td class="mono">${isFall ? '5.76G Impact Decel • 142 bpm' : (isDanger ? '3.56G Jerk Decel • 138 bpm' : '0.98G Nominal Resting • 74 bpm')}</td>
                  </tr>
                  <tr>
                    <td class="text-bold">Pole Audio Sensor</td>
                    <td class="mono">${isFall ? '78 dB SPL Impact Transient' : (isDanger ? '86 dB SPL @ 3.1 kHz (Human Scream Formant)' : '48 dB SPL Ambient Traffic')}</td>
                  </tr>
                  <tr>
                    <td class="text-bold">False Alarm Rejection</td>
                    <td class="mono ${isDanger ? 'text-success' : 'text-primary'}">${isDanger ? 'Accidental Press Ruled Out (p < 0.04)' : 'Nominal Monitoring (p > 0.85)'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Operator Verification Controls -->
            <div style="margin-top: auto; padding-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-danger btn-sm" style="flex: 1; min-width: 140px;" onclick="window.RakshakApp.switchTab('tier3_dispatch')">
                Authorize Police Dispatch
              </button>
              <button class="btn btn-primary btn-sm" style="background-color: var(--primary-blue); font-weight: 600;" onclick="window.RakshakTier3DispatchView.broadcastFromAI()">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
                Alert All PCR Vans (&lt; 15 km)
              </button>
              <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3AIView.markFalseAlarm()">
                Flag False Positive
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  simulateCameraMatching: function() {
    if (this.isVerifying) return;
    this.isVerifying = true;

    const subtitle = document.getElementById("ai-status-subtitle");
    const heading = document.getElementById("ai-main-heading");
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");
    const step4 = document.getElementById("step-4");

    if (subtitle && heading) {
      subtitle.textContent = "SEARCHING MUNICIPAL CCTV REGISTRY...";
      subtitle.style.color = "#D97706";
      heading.textContent = "SOS Received — Locating Nearest Camera...";
    }

    if (step2) step2.className = "stepper-step active";
    if (step3) step3.className = "stepper-step";
    if (step4) step4.className = "stepper-step";

    window.RakshakApp.playChime();

    // After 1.2s -> Camera located
    setTimeout(() => {
      const citizen = this.getActiveCitizen();
      const cam = this.activeCamera || this.getNearestCameraForCitizen(citizen.coords);
      if (subtitle && heading) {
        subtitle.textContent = "CAMERA ACQUIRED • RUNNING BEHAVIORAL AI...";
        subtitle.style.color = "#0F4C81";
        heading.textContent = `Camera ${cam.id} (${cam.name}) — ${cam.distanceText || '40m from signal origin'}`;
      }
      if (step2) step2.className = "stepper-step completed";
      if (step3) step3.className = "stepper-step active";
      window.RakshakApp.playChime();
    }, 1200);

    // After 2.4s -> AI Analysis completes
    setTimeout(() => {
      if (subtitle && heading) {
        subtitle.textContent = "TARGET ACQUISITION: 100% COMPLETE • GEOFENCE ACCURACY 14.2M";
        subtitle.style.color = "#2E7D32";
      }
      if (step3) step3.className = "stepper-step completed";
      if (step4) step4.className = "stepper-step active";
      window.RakshakApp.playChime();
      window.RakshakTier3AIView.isVerifying = false;
    }, 2400);
  },

  markFalseAlarm: function() {
    alert("AUDIT OVERRIDE:\n----------------\nIncident flagged for supervisor review as potential non-emergency.\nDispatch hold applied.");
  },

  exportEvidence: function() {
    alert("FORENSIC EXPORT GENERATED:\n--------------------------\n1. Optical Frame: CAM-0472-20260909-124109.raw\n2. Spectrogram Audio: MIC-1402-3100Hz.wav\n3. LoRa TDoA Telemetry: GW-01-GW-02.log\nArchive encrypted and signed with Odisha Police Judicial Key.");
  },

  toggleFullscreen: function(containerId) {
    const el = document.getElementById(containerId) || document.querySelector('.cctv-monitor-box');
    if (!el) return;

    const isFs = document.fullscreenElement === el ||
                 document.webkitFullscreenElement === el ||
                 document.mozFullScreenElement === el ||
                 document.msFullscreenElement === el;

    if (!isFs) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
};
