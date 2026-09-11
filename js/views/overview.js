// Rakshak-Net CAD - Main Landing Dashboard ("Overview") Module
// Primary executive & operations screen for Commissionerate Police Bhubaneswar-Cuttack (Dial 112)
// Decluttered, high-clarity layout: 5-second comprehensibility, >=20px card padding, >=32px section gaps, responsive wrap

window.RakshakOverviewView = {
  activeSectorFilter: "ALL",

  render: function(container) {
    container.innerHTML = `
      <!-- Page Title & Operational Controls Row -->
      <div class="page-header-row" style="align-items: center; margin-bottom: 24px;">
        <div class="page-title-group">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: var(--text-main); letter-spacing: -0.3px;">
            Metropolitan Safety Command Overview
          </h1>
          <div class="page-subtitle" style="margin-top: 4px; font-size: 12px; color: var(--text-secondary);">
            Bhubaneswar Metropolitan Area &bull; Real-time telemetric monitoring, municipal coverage grid, and automated response pipeline
          </div>
        </div>
      </div>

      <!-- 3. Three Stat Cards in a Row: ONE headline stat in normal weight, technical specs in collapsible Details ▾ --      <!-- 3. Three Stat Cards in a Row: ONE headline stat in normal weight, technical specs in collapsible Learn more ▾ -->
      <div class="stat-grid-3">
        <!-- Card 1: Active Wearables Online (Clickable -> Tier 1) -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Active Wearables Online</span>
            <span class="trend-indicator up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              +18 this hr
            </span>
          </div>
          <div class="stat-tile-val">1,204</div>
          <div class="stat-headline-line">
            99.1% citywide active connectivity
          </div>
          <details class="stat-details-expand">
            <summary>Learn more ▾</summary>
            <div class="details-content">
              1,215 provisioned devices with hardware AES-128 GCM encryption and dual BLE / LoRa transceivers. &bull;
              <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier1_wearable')" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">
                Open Wearable Simulator &rarr;
              </a>
            </div>
          </details>
        </div>

        <!-- Card 2: LoRa Relay Nodes (Clickable -> Tier 2) -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>LoRa Relay Nodes</span>
            <span class="trend-indicator warn">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              2 offline
            </span>
          </div>
          <div class="stat-tile-val">86 active / 2 offline</div>
          <div class="stat-headline-line">
            97.7% corridor mesh active
          </div>
          <details class="stat-details-expand">
            <summary>Learn more ▾</summary>
            <div class="details-content">
              Sub-GHz IN865 band (865.2 MHz). 2 nodes pending scheduled solar recharge. &bull;
              <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier2_lora')" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">
                Open Relay Mesh Map &rarr;
              </a>
            </div>
          </details>
        </div>

        <!-- Card 3: Active SOS Alerts (Clickable -> Tier 3) -->
        <div class="stat-tile">
          <div class="stat-tile-title">
            <span>Active SOS Alerts</span>
            <span class="badge badge-critical">2 ACTIVE</span>
          </div>
          <div id="landing-sos-count" class="stat-tile-val text-danger">2</div>
          <div class="stat-headline-line">
            2 active distress triggers
          </div>
          <details class="stat-details-expand">
            <summary>Learn more ▾</summary>
            <div class="details-content">
              2 emergency distress triggers active in Patia & Infocity corridors. Priority-1 CAD dispatch in progress. &bull;
              <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier3_dispatch')" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">
                Open Dispatch Terminal &rarr;
              </a>
            </div>
          </details>
        </div>
      </div>

      <!-- 2. Keep ONLY the 3-Step Visual Pipeline Banner (Duplicate Launchpad Cards Removed) -->
      <div class="pipeline-card">
        <div class="pipeline-header">
          <span>End-to-End System Architecture &bull; 3-Tier Rapid Response Flow</span>
          <span class="mono text-bold" style="color: var(--primary-blue); font-size: 11px;">MEAN RESPONSE TIME: 1.8 MIN</span>
        </div>

        <div class="pipeline-flow">
          <!-- Step 1: Wearable Detects Distress -->
          <div class="pipeline-step clickable" onclick="window.RakshakApp.switchTab('tier1_wearable')" title="Click to open Tier 1: Wearable Simulator">
            <div class="pipeline-step-top">
              <div class="pipeline-step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div class="pipeline-step-num">Tier 1 &bull; Citizen Edge</div>
                <div class="pipeline-step-title">Wearable Detects Distress</div>
              </div>
            </div>
            <div class="stat-headline-line" style="margin-top: 2px;">
              Autonomous dual-sensor distress trigger
            </div>
            <details class="stat-details-expand" onclick="event.stopPropagation()">
              <summary>Learn more ▾</summary>
              <div class="details-content">
                nRF52840 + SX1262 with capacitive debounce and 4.5G fall impact detection via TinyML. &bull;
                <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier1_wearable')" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">
                  Launch Simulator &rarr;
                </a>
              </div>
            </details>
          </div>

          <!-- Flat Connecting Arrow -->
          <div class="pipeline-arrow-separator">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>

          <!-- Step 2: LoRa Relay Transmits -->
          <div class="pipeline-step clickable" onclick="window.RakshakApp.switchTab('tier2_lora')" title="Click to open Tier 2: LoRa Relay Mesh">
            <div class="pipeline-step-top">
              <div class="pipeline-step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
                </svg>
              </div>
              <div>
                <div class="pipeline-step-num">Tier 2 &bull; Municipal Mesh</div>
                <div class="pipeline-step-title">LoRa Relay Transmits</div>
              </div>
            </div>
            <div class="stat-headline-line" style="margin-top: 2px;">
              Streetlight-to-fiber mesh relay
            </div>
            <details class="stat-details-expand" onclick="event.stopPropagation()">
              <summary>Learn more ▾</summary>
              <div class="details-content">
                Sub-GHz 865.2 MHz off-grid packet hops municipal poles to fiber gateway with &lt;150ms latency. &bull;
                <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier2_lora')" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">
                  Launch Relay Mesh &rarr;
                </a>
              </div>
            </details>
          </div>

          <!-- Flat Connecting Arrow -->
          <div class="pipeline-arrow-separator">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>

          <!-- Step 3: AI Verifies + Dispatch Sent -->
          <div class="pipeline-step clickable" onclick="window.RakshakApp.switchTab('tier3_dispatch')" title="Click to open Tier 3: AI Verification & Dispatch">
            <div class="pipeline-step-top">
              <div class="pipeline-step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div>
                <div class="pipeline-step-num">Tier 3 &bull; AI &amp; Police CAD</div>
                <div class="pipeline-step-title">AI Verifies + Dispatch Sent</div>
              </div>
            </div>
            <div class="stat-headline-line" style="margin-top: 2px;">
              AI verification &amp; autonomous dispatch
            </div>
            <details class="stat-details-expand" onclick="event.stopPropagation()">
              <summary>Learn more ▾</summary>
              <div class="details-content">
                CCTV optical flow and 86 dB scream formant fusion injects payload into Dial 112 CAD. &bull;
                <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier3_dispatch')" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">
                  Launch Dispatch &rarr;
                </a>
              </div>
            </details>
          </div>        </div>
        </div>
      </div>

      <!-- Project Video: Safe Corridor Optical Surveillance Stream -->
      <!-- Live Camera Grid: 3 Visually Distinct Feeds -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              Live Camera Grid
            </div>
            <div class="camera-grid-caption" style="font-size: 11.5px; color: var(--text-secondary); font-weight: 500; margin-top: 3px;">
              Municipal Camera Network &mdash; Nearest to Active Zones
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="badge" style="background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D;">1 AI FLAGGED</span>
            <span class="badge badge-online">2 NOMINAL</span>
            <span class="mono" style="font-size: 11px; color: var(--text-muted);">3/3 FEEDS ONLINE</span>
          </div>
        </div>

        <div class="card-body-flush">
          <!-- 3-Feed Camera Grid -->
          <div class="live-camera-grid" id="live-camera-grid-container">
            <!-- Feed 1: CAM-0472 (Infocity Underpass) — dark, low-light, isolated area feed (Amber AI FLAGGED) -->
            <div class="camera-feed-card ai-flagged-card">
              <div id="camera-feed-wrap-0472" class="camera-feed-media-wrap" title="Double click for Full Screen" ondblclick="window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0472', 'rakshak-corridor-video')">
                <video id="rakshak-corridor-video" class="camera-feed-video" autoplay loop muted playsinline poster="/assets/empty-street-night.jpg">
                  <source src="/assets/rakshak-corridor-night.mp4" type="video/mp4">
                  Your browser does not support HTML5 video.
                </video>

                <!-- LIVE Badge -->
                <div class="camera-hud-badge-live">
                  <span class="live-dot-red"></span>
                  <span>LIVE</span>
                </div>

                <!-- Amber "AI FLAGGED" Badge -->
                <div class="camera-hud-badge-status badge-ai-flagged">
                  AI FLAGGED
                </div>

                <!-- Bottom HUD Overlay: Camera ID & Location + Timestamp + Fullscreen -->
                <div class="camera-hud-bottom-overlay">
                  <div>
                    <div class="camera-hud-cam-id">
                      CAM-0472 (Infocity Underpass)
                    </div>
                    <div id="video-cctv-timestamp" class="camera-hud-timestamp">
                      --:--:-- IST &bull; CAM-0472
                    </div>
                  </div>
                  <button class="camera-hud-fullscreen-btn" title="Full Screen CAM-0472" onclick="event.stopPropagation(); window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0472', 'rakshak-corridor-video')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    <span>Full Screen</span>
                  </button>
                </div>
              </div>

              <div class="camera-feed-footer-meta">
                <div>
                  <span class="text-bold" style="color: #B45309;">High-Risk Isolated Area</span> &bull; Optical flow struggle pattern 87%
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="mono" style="font-size: 10px; color: var(--text-muted);">RTSP 10.14.88.20</span>
                  <button class="feed-fullscreen-btn" title="Full Screen CAM-0472" onclick="window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0472', 'rakshak-corridor-video')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    Full Screen
                  </button>
                </div>
              </div>
            </div>

            <!-- Feed 2: CAM-0511 (Nandankanan Main Road) — open street with streetlights, light traffic (MONITORING) -->
            <div class="camera-feed-card">
              <div id="camera-feed-wrap-0511" class="camera-feed-media-wrap" title="Double click for Full Screen" ondblclick="window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0511', 'video-nandankanan')">
                <video id="video-nandankanan" class="camera-feed-video" autoplay loop muted playsinline poster="/assets/cctv-empty-street-frame.jpg">
                  <source src="/assets/rakshak-street-traffic.mp4" type="video/mp4">
                  Your browser does not support HTML5 video.
                </video>

                <!-- LIVE Badge -->
                <div class="camera-hud-badge-live">
                  <span class="live-dot-red"></span>
                  <span>LIVE</span>
                </div>

                <!-- Green "MONITORING" Badge -->
                <div class="camera-hud-badge-status badge-monitoring-green">
                  MONITORING
                </div>

                <!-- Bottom HUD Overlay: Camera ID & Location + Timestamp + Fullscreen -->
                <div class="camera-hud-bottom-overlay">
                  <div>
                    <div class="camera-hud-cam-id">
                      CAM-0511 (Nandankanan Main Road)
                    </div>
                    <div id="video-cctv-timestamp-0511" class="camera-hud-timestamp">
                      --:--:-- IST &bull; CAM-0511
                    </div>
                  </div>
                  <button class="camera-hud-fullscreen-btn" title="Full Screen CAM-0511" onclick="event.stopPropagation(); window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0511', 'video-nandankanan')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    <span>Full Screen</span>
                  </button>
                </div>
              </div>

              <div class="camera-feed-footer-meta">
                <div>
                  <span class="text-bold text-success">Open Arterial Street</span> &bull; Normal vehicular traffic
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="mono" style="font-size: 10px; color: var(--text-muted);">RTSP 10.14.88.24</span>
                  <button class="feed-fullscreen-btn" title="Full Screen CAM-0511" onclick="window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0511', 'video-nandankanan')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    Full Screen
                  </button>
                </div>
              </div>
            </div>

            <!-- Feed 3: CAM-0389 (Patia Bus Stand) — busier public area with municipal buses & passengers (MONITORING) -->
            <div class="camera-feed-card">
              <div id="camera-feed-wrap-0389" class="camera-feed-media-wrap" title="Double click for Full Screen" ondblclick="window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0389', 'video-patia-bus-stand')">
                <video id="video-patia-bus-stand" class="camera-feed-video" autoplay loop muted playsinline poster="/assets/patia-bus-stand-poster.jpg">
                  <source src="/assets/rakshak-bus-stand-cctv.mp4" type="video/mp4">
                  Your browser does not support HTML5 video.
                </video>

                <!-- LIVE Badge -->
                <div class="camera-hud-badge-live">
                  <span class="live-dot-red"></span>
                  <span>LIVE</span>
                </div>

                <!-- Green/Gray "MONITORING" Badge -->
                <div class="camera-hud-badge-status badge-monitoring-green">
                  MONITORING
                </div>

                <!-- Bottom HUD Overlay: Camera ID & Location + Timestamp + Fullscreen -->
                <div class="camera-hud-bottom-overlay">
                  <div>
                    <div class="camera-hud-cam-id">
                      CAM-0389 (Patia Bus Stand)
                    </div>
                    <div id="video-cctv-timestamp-0389" class="camera-hud-timestamp">
                      --:--:-- IST &bull; CAM-0389
                    </div>
                  </div>
                  <button class="camera-hud-fullscreen-btn" title="Full Screen CAM-0389" onclick="event.stopPropagation(); window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0389', 'video-patia-bus-stand')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    <span>Full Screen</span>
                  </button>
                </div>
              </div>

              <div class="camera-feed-footer-meta">
                <div>
                  <span class="text-bold text-primary">Municipal Bus Terminal Bay</span> &bull; Active transit &amp; passenger footfall
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="mono" style="font-size: 10px; color: var(--text-muted);">RTSP 10.14.88.31</span>
                  <button class="feed-fullscreen-btn" title="Full Screen CAM-0389" onclick="window.RakshakOverviewView.toggleFullscreen('camera-feed-wrap-0389', 'video-patia-bus-stand')">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    Full Screen
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Playback & Inspection Controls -->
          <div style="padding: 10px 16px; background: #F8FAFC; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btn-video-play" class="video-ctrl-btn" onclick="window.RakshakOverviewView.toggleVideoPlay()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                Pause
              </button>
              <button id="btn-video-mute" class="video-ctrl-btn" onclick="window.RakshakOverviewView.toggleVideoMute()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>
                Unmute
              </button>
              <button id="btn-video-speed" class="video-ctrl-btn" onclick="window.RakshakOverviewView.toggleVideoSpeed()">
                1.0x Speed
              </button>
              <button id="btn-video-grid-fs" class="video-ctrl-btn" title="Full Screen Camera Grid" onclick="window.RakshakOverviewView.toggleFullscreen('live-camera-grid-container')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                Full Screen Grid
              </button>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-primary btn-sm" onclick="window.RakshakApp.switchTab('tier3_ai')" style="font-size: 11px; padding: 3px 8px;">
                Inspect AI Verification Overlay &rarr;
              </button>
            </div>
          </div>

          <!-- Video Text Panel: Contains moved Lat/Long & AI Optical Flow Engine status -->
          <div class="video-subpanel-strip">
            <div class="video-subpanel-row">
              <div style="font-size: 12px; font-weight: 600; color: var(--text-main);">
                Optical surveillance along Infocity corridor
              </div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="mono" style="font-size: 10.5px; color: var(--text-secondary); background: #F1F5F9; border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 2px;">
                  CAM-0472 &bull; 20.3562° N, 85.8174° E
                </span>
                <span class="badge badge-online">AI OPTICAL FLOW: ACTIVE</span>
              </div>
            </div>
            <details class="stat-details-expand" style="margin-top: 2px; padding-top: 6px;">
              <summary>Learn more ▾</summary>
              <div class="details-content">
                Continuous pedestrian optical flow monitoring along Infocity safe corridor. System automatically correlates camera stream with LoRa TDoA triangulation radius (40m) upon distress packet reception.
              </div>
            </details>
          </div>
        </div>
      </div>

      <!-- Interactive Map (Leaflet + OpenStreetMap) Centered on Bhubaneswar -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            Interactive Municipal Coverage Map &bull; Bhubaneswar Safety Grid
          </div>
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Live Last updated indicator with subtle refresh spinner -->
            <div class="map-last-updated" id="map-last-updated">
              <svg class="refresh-spin-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span id="map-last-updated-text">Last updated: just now</span>
            </div>
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">Filter:</span>
            <button class="btn btn-outline btn-sm active" id="btn-zone-all" onclick="window.RakshakOverviewView.filterSector('ALL')">All Sectors</button>
            <button class="btn btn-outline btn-sm" id="btn-zone-north" onclick="window.RakshakOverviewView.filterSector('NORTH')">North (Patia)</button>
            <button class="btn btn-outline btn-sm" id="btn-zone-central" onclick="window.RakshakOverviewView.filterSector('CENTRAL')">Central (CSPUR)</button>
          </div>
        </div>

        <div class="card-body-flush">
          <div class="map-container-wrapper" style="height: 440px;">
            <div id="overview-map-container" class="leaflet-map-element"></div>
            <!-- Floating Map Legend -->
            <div class="map-floating-legend">
              <div style="font-weight: 700; font-size: 10px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px;">Map Markers Key</div>
              <div class="legend-item">
                <span class="legend-marker-relay"></span>
                <span>Streetlight LoRa Relay Node</span>
              </div>
              <div class="legend-item">
                <span class="legend-marker-wearable"></span>
                <span>Connected Citizen Wearable (Live Ping)</span>
              </div>
              <div class="legend-item">
                <span class="legend-marker-pcr" title="Dial 112 PCR Patrol Van">
                  <svg class="van-symbol-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="14" height="12" rx="1"/>
                    <polygon points="15 8 19 8 22 11 22 16 15 16 15 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="17.5" cy="18.5" r="2.5"/>
                  </svg>
                </span>
                <span>Dial 112 PCR Patrol Van (In Motion)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Below Map Panel: Single short phrase (max ~6 words) with Learn more ▾ expandable -->
        <div style="padding: 12px 20px; background-color: #FAFAFA; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="/assets/city-street-dusk.jpg" alt="Safe Corridor Street at Dusk" style="width: 54px; height: 34px; object-fit: cover; border-radius: 2px; border: 1px solid var(--border-color); flex-shrink: 0;"/>
              <div style="font-size: 12px; font-weight: 600; color: var(--text-main);">
                Bhubaneswar Safe Corridor &bull; 86 Smart Poles
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.RakshakApp.switchTab('tier2_lora')">
              Inspect Mesh Details &rarr;
            </button>
          </div>
          <details class="stat-details-expand" style="margin-top: 2px; padding-top: 6px;">
            <summary>Learn more ▾</summary>
            <div class="details-content">
              Municipal smart poles equipped with high-efficiency LED luminaires, Sub-GHz LoRa mesh transceivers, and emergency acoustic sensors for continuous women's safety corridor monitoring.
            </div>
          </details>
        </div>
      </div>

      <!-- Recent Activity Log Table: Instant 2-second visual scan via 4px left-border strip and flat line icons -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Recent Activity Log
          </div>
          <div style="display: inline-flex; align-items: center; gap: 7px;">
            <span class="live-pulse-dot" title="Live Auto-Refreshing Audit Feed" aria-label="Auto-refreshing audit feed active"></span>
            <span class="mono" style="font-size: 11px; color: var(--text-muted);">Real-time Telemetric Audit Feed (Latest 5 Events)</span>
          </div>
        </div>
        <div class="card-body-flush" style="overflow-x: auto;">
          <table class="cad-table activity-log-table">
            <thead>
              <tr>
                <th style="width: 32px; padding-left: 10px; padding-right: 4px;"></th>
                <th style="width: 14%;">Time</th>
                <th style="width: 34%;">Event Type</th>
                <th style="width: 32%;">Location</th>
                <th style="width: 20%;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr class="activity-row row-status-normal" style="border-left: 4px solid #16A34A;">
                <td class="activity-icon-cell">
                  <span class="activity-icon-wrap" title="Network Event">
                    <svg class="activity-type-icon icon-status-green" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Network Event"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                  </span>
                </td>
                <td class="mono">23:02:44 IST</td>
                <td>
                  <div class="text-bold">Node #34 reconnected</div>
                  <div class="text-muted" style="font-size: 10.5px;">Aux battery path active</div>
                </td>
                <td>Ward 14 (Infocity West #OD-1408)</td>
                <td><span class="badge badge-online">ONLINE</span></td>
              </tr>
              <tr class="activity-row row-status-normal" style="border-left: 4px solid #16A34A;">
                <td class="activity-icon-cell">
                  <span class="activity-icon-wrap" title="Self-Test Event">
                    <svg class="activity-type-icon icon-status-green" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Self-Test Event"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                  </span>
                </td>
                <td class="mono">22:58:19 IST</td>
                <td>
                  <div class="text-bold">System self-test passed</div>
                  <div class="text-muted" style="font-size: 10.5px;">All 5 subsystems OK</div>
                </td>
                <td>Central Hub (Commissionerate HQ)</td>
                <td><span class="badge badge-online">PASS (100% OK)</span></td>
              </tr>
              <tr class="activity-row row-status-warning" style="border-left: 4px solid #F59E0B;">
                <td class="activity-icon-cell">
                  <span class="activity-icon-wrap" title="Battery Warning">
                    <svg class="activity-type-icon icon-status-warning" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Battery Warning"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>
                  </span>
                </td>
                <td class="mono">22:51:02 IST</td>
                <td>
                  <div class="text-bold">Wearable #0892 battery low</div>
                  <div class="text-muted" style="font-size: 10.5px;">3.42V (12% remaining)</div>
                </td>
                <td>Device #RN-WR-0892 (KIIT Sector)</td>
                <td><span class="badge badge-high">WARNING (12%)</span></td>
              </tr>
              <tr class="activity-row row-status-info" style="border-left: 4px solid #94A3B8;">
                <td class="activity-icon-cell">
                  <span class="activity-icon-wrap" title="Mesh Optimization Routing">
                    <svg class="activity-type-icon icon-status-info" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Mesh Routing Event"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><polyline points="12 2 15 5 12 8"/></svg>
                  </span>
                </td>
                <td class="mono">22:45:30 IST</td>
                <td>
                  <div class="text-bold">Mesh route optimized</div>
                  <div class="text-muted" style="font-size: 10.5px;">Latency 138ms (3 hops)</div>
                </td>
                <td>Relay Cluster Alpha (CSPUR Sector)</td>
                <td><span class="badge badge-neutral">LATENCY 138ms</span></td>
              </tr>
              <tr class="activity-row row-status-normal" style="border-left: 4px solid #16A34A;">
                <td class="activity-icon-cell">
                  <span class="activity-icon-wrap" title="CCTV Optical Flow Event">
                    <svg class="activity-type-icon icon-status-green" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="CCTV Event"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </span>
                </td>
                <td class="mono">22:38:15 IST</td>
                <td>
                  <div class="text-bold">CCTV optical flow refreshed</div>
                  <div class="text-muted" style="font-size: 10.5px;">Night model recalibrated</div>
                </td>
                <td>Pole #1402 (Patia CAM-14B)</td>
                <td><span class="badge badge-online">SYNCED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Start Real-Time Clock & CCTV Overlay Ticker
    this.startLiveClock();

    // Initialize Interactive Leaflet Map Centered on Bhubaneswar
    setTimeout(() => {
      window.RakshakOverviewView.initCoverageMap();
    }, 50);
  },

  startLiveClock: function() {
    if (this.clockInterval) clearInterval(this.clockInterval);

    const update = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const timeStr = `${hrs}:${mins}:${secs} IST`;
      
      const videoTs = document.getElementById("video-cctv-timestamp");
      if (videoTs) videoTs.textContent = `${timeStr} • CAM-0472`;

      const videoTs0511 = document.getElementById("video-cctv-timestamp-0511");
      if (videoTs0511) videoTs0511.textContent = `${timeStr} • CAM-0511`;

      const videoTs0389 = document.getElementById("video-cctv-timestamp-0389");
      if (videoTs0389) videoTs0389.textContent = `${timeStr} • CAM-0389`;
    };

    update();
    this.clockInterval = setInterval(update, 1000);
  },

  toggleVideoPlay: function() {
    const vList = [
      document.getElementById("rakshak-corridor-video"),
      document.getElementById("video-nandankanan"),
      document.getElementById("video-patia-bus-stand")
    ].filter(Boolean);
    const btn = document.getElementById("btn-video-play");
    if (!vList.length) return;

    const isAnyPaused = vList.some(v => v.paused);
    vList.forEach(v => {
      if (isAnyPaused) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });

    if (btn) {
      if (isAnyPaused) {
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
      } else {
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play';
      }
    }
  },

  toggleVideoMute: function() {
    const vList = [
      document.getElementById("rakshak-corridor-video"),
      document.getElementById("video-nandankanan"),
      document.getElementById("video-patia-bus-stand")
    ].filter(Boolean);
    const btn = document.getElementById("btn-video-mute");
    if (!vList.length) return;

    const newMuted = !vList[0].muted;
    vList.forEach(v => { v.muted = newMuted; });

    if (btn) {
      btn.innerHTML = newMuted ? 
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg> Unmute' : 
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> Mute';
    }
  },

  toggleVideoSpeed: function() {
    const vList = [
      document.getElementById("rakshak-corridor-video"),
      document.getElementById("video-nandankanan"),
      document.getElementById("video-patia-bus-stand")
    ].filter(Boolean);
    const btn = document.getElementById("btn-video-speed");
    if (!vList.length) return;

    const newRate = vList[0].playbackRate === 1.0 ? 2.0 : 1.0;
    vList.forEach(v => { v.playbackRate = newRate; });

    if (btn) {
      btn.textContent = newRate === 2.0 ? "2.0x Speed" : "1.0x Speed";
    }
  },

  toggleFullscreen: function(containerId, videoId) {
    const el = document.getElementById(containerId) || (videoId ? document.getElementById(videoId) : null);
    if (!el) return;

    const isFs = document.fullscreenElement === el ||
                 document.webkitFullscreenElement === el ||
                 document.mozFullScreenElement === el ||
                 document.msFullscreenElement === el;

    if (!isFs) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          const v = videoId ? document.getElementById(videoId) : el.querySelector('video');
          if (v && v.requestFullscreen) v.requestFullscreen();
        });
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
  },

  initCoverageMap: function() {
    if (typeof L === "undefined") return;

    const mapContainer = document.getElementById("overview-map-container");
    if (!mapContainer) return;

    if (window.RakshakOverviewMapInstance) {
      try {
        window.RakshakOverviewMapInstance.remove();
      } catch (e) {}
    }

    const map = L.map("overview-map-container", {
      center: [20.3540, 85.8170],
      zoom: 13.5,
      zoomControl: true,
      attributionControl: true
    });

    window.RakshakOverviewMapInstance = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap &bull; Odisha Police Rakshak Grid'
    }).addTo(map);

    const relayLayer = L.layerGroup().addTo(map);
    const wearableLayer = L.layerGroup().addTo(map);
    const pcrLayer = L.layerGroup().addTo(map);

    const relayNodes = [
      { id: "Node #12", pole: "OD-1402", lat: 20.3565, lng: 85.8182, street: "Infocity Ave / Magnetics Crossing", status: "ONLINE", battery: "98% Solar", uptime: "99.8%", rssi: "-78 dBm", wearables: 14 },
      { id: "Node #14", pole: "OD-1405", lat: 20.3538, lng: 85.8164, street: "KIIT Road / DLF Cybercity Post", status: "ONLINE", battery: "94% Solar", uptime: "99.4%", rssi: "-82 dBm", wearables: 19 },
      { id: "Node #18", pole: "OD-1409", lat: 20.3508, lng: 85.8198, street: "Patia Junction Overhead Smart Mast", status: "ONLINE", battery: "100% Mains", uptime: "100%", rssi: "-74 dBm", wearables: 24 },
      { id: "Node #04", pole: "OD-1412", lat: 20.3475, lng: 85.8150, street: "KIIT Square North Light Pole", status: "ONLINE", battery: "91% Solar", uptime: "99.1%", rssi: "-86 dBm", wearables: 8 },
      { id: "Node #22", pole: "OD-1415", lat: 20.3420, lng: 85.8180, street: "Silicon Residency West Perimeter", status: "ONLINE", battery: "89% LiFePO4", uptime: "98.9%", rssi: "-89 dBm", wearables: 11 },
      { id: "Node #31", pole: "OD-1418", lat: 20.3340, lng: 85.8190, street: "Damana Square Smart Mast Post", status: "ONLINE", battery: "97% Solar", uptime: "99.6%", rssi: "-76 dBm", wearables: 16 },
      { id: "Node #34", pole: "OD-1422", lat: 20.3245, lng: 85.8220, street: "CSPUR Telecom Circle Post", status: "ONLINE", battery: "92% Solar", uptime: "99.2%", rssi: "-80 dBm", wearables: 15 },
      { id: "Node #47", pole: "OD-1425", lat: 20.3120, lng: 85.8270, street: "Nalco Square Municipal Post", status: "STANDBY", battery: "24% Low Solar", uptime: "96.4%", rssi: "-91 dBm", wearables: 4 }
    ];

    // 1. Streetlight Relay Markers (Pixel-matching plain green outlined square in key)
    relayNodes.forEach(node => {
      const streetlightHtml = `<div class="map-marker-streetlight" title="${node.id} (${node.pole})"></div>`;

      const icon = L.divIcon({
        html: streetlightHtml,
        className: "custom-streetlight-div",
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([node.lat, node.lng], { icon: icon });
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.45; min-width: 210px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #0F4C81; font-size: 12px;">${node.id} &bull; Streetlight Relay</strong>
            <span class="badge ${node.status === 'ONLINE' ? 'badge-online' : 'badge-high'}" style="font-size: 9.5px;">${node.status}</span>
          </div>
          <div><strong>Pole ID:</strong> <code>${node.pole}</code></div>
          <div><strong>Location:</strong> ${node.street}</div>
          <div><strong>Power Supply:</strong> ${node.battery}</div>
          <div><strong>Mesh Telemetry:</strong> Uptime ${node.uptime} &bull; ${node.rssi}</div>
          <div><strong>Connected Wearables:</strong> <span class="text-bold text-primary">${node.wearables} devices</span> in radio radius</div>
          <div style="margin-top: 8px; padding-top: 5px; border-top: 1px dashed #E2E8F0; text-align: right;">
            <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier2_lora')" style="color: #0F4C81; font-weight: 600; text-decoration: none; font-size: 11px;">
              Open Tier 2 LoRa Corridor &rarr;
            </a>
          </div>
        </div>
      `);
      marker.addTo(relayLayer);
    });

    // 2. Wearable Density & Clustering (Sums up to 1,204 Active Wearables Online)
    // When zoomed out (zoom <= 14): Circular count badge clusters (e.g. 312, 284, 245, 198, 165 = 1,204)
    // When zoomed in (zoom > 14): Clusters split into individual pixel-matched wearable pins
    const wearableClusters = [
      { id: "CL-INFOCITY", name: "Infocity Tech Corridor (Ward 14)", lat: 20.3568, lng: 85.8174, count: 312, gateway: "Smart Mast #OD-1402 & #OD-1405" },
      { id: "CL-KIIT", name: "KIIT University Enclave (Ward 12)", lat: 20.3526, lng: 85.8156, count: 284, gateway: "Municipal Pole #OD-1409 & #OD-1412" },
      { id: "CL-PATIA", name: "Patia Smart Corridor (Ward 13)", lat: 20.3475, lng: 85.8180, count: 245, gateway: "Overhead Mast #OD-1415" },
      { id: "CL-DAMANA", name: "Damana Municipal Zone (Ward 15)", lat: 20.3340, lng: 85.8190, count: 198, gateway: "Smart Mast #OD-1418 & #OD-1422" },
      { id: "CL-CSPUR", name: "CSPUR Telecom Circle (Ward 16)", lat: 20.3210, lng: 85.8235, count: 165, gateway: "Gateway Tower #OD-1425" }
    ];

    const clusterMarkers = [];
    wearableClusters.forEach(c => {
      const clusterHtml = `
        <div class="map-marker-cluster" title="${c.name}: ${c.count} Active Wearables Online (Click to Zoom)">
          <span>${c.count}</span>
        </div>
      `;
      const clusterIcon = L.divIcon({
        html: clusterHtml,
        className: "custom-cluster-div",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const cMarker = L.marker([c.lat, c.lng], { icon: clusterIcon });
      cMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.45; min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #0F4C81; font-size: 12px;">${c.name}</strong>
            <span class="badge badge-online" style="font-size: 9.5px;">ONLINE</span>
          </div>
          <div><strong>Active Density:</strong> <span class="text-bold text-primary" style="font-size: 13px;">${c.count} Connected Wearables</span></div>
          <div><strong>Cryptographic Integrity:</strong> 100% AES-128 GCM Heartbeat Nominal</div>
          <div><strong>Serving Corridor:</strong> ${c.gateway}</div>
          <div style="margin-top: 8px; padding-top: 5px; border-top: 1px dashed #E2E8F0; text-align: right;">
            <span style="color: #0F4C81; font-weight: 600; font-size: 11px;">Zoom in or click badge to view individual nodes &rarr;</span>
          </div>
        </div>
      `);
      cMarker.on('click', () => {
        map.setView([c.lat, c.lng], 15, { animate: true });
      });
      clusterMarkers.push(cMarker);
    });

    // Individual Citizen Wearables (rendered when zoomed in past threshold > 14)
    const individualWearableData = [
      // Infocity Sector
      { id: "RN-WR-9204", citizen: "Priyanka M. (Reg #CIT-9921)", lat: 20.3562, lng: 85.8174, street: "Infocity Ave (Near Magnetics)", battery: "91% (3.98V)", vitals: "HR 74 bpm &bull; Jerk 0.04G", relay: "Node #12", status: "CONNECTED" },
      { id: "RN-WR-9208", citizen: "Archana B. (Reg #CIT-9925)", lat: 20.3575, lng: 85.8168, street: "DLF Cybercity North Gate", battery: "95% (4.12V)", vitals: "HR 71 bpm &bull; Jerk 0.02G", relay: "Node #12", status: "CONNECTED" },
      { id: "RN-WR-9215", citizen: "Meenakshi T. (Reg #CIT-9932)", lat: 20.3582, lng: 85.8180, street: "Infocity Square East Feeder", battery: "89% (3.94V)", vitals: "HR 79 bpm &bull; Jerk 0.03G", relay: "Node #12", status: "CONNECTED" },
      { id: "RN-WR-9221", citizen: "Sharmila S. (Reg #CIT-9938)", lat: 20.3550, lng: 85.8160, street: "Magnetics Lane 2", battery: "93% (4.04V)", vitals: "HR 68 bpm &bull; Jerk 0.01G", relay: "Node #12", status: "CONNECTED" },
      { id: "RN-WR-9234", citizen: "Bhavna P. (Reg #CIT-9951)", lat: 20.3590, lng: 85.8155, street: "Infocity Tech Tower Perimeter", battery: "87% (3.90V)", vitals: "HR 75 bpm &bull; Jerk 0.02G", relay: "Node #12", status: "CONNECTED" },

      // KIIT Campus Sector
      { id: "RN-WR-1102", citizen: "Ananya P. (Reg #CIT-8410)", lat: 20.3524, lng: 85.8158, street: "KIIT Campus 3 Road", battery: "88% (3.92V)", vitals: "HR 78 bpm &bull; Jerk 0.02G", relay: "Node #14", status: "CONNECTED" },
      { id: "RN-WR-1109", citizen: "Ritika G. (Reg #CIT-8417)", lat: 20.3538, lng: 85.8145, street: "KIIT Campus 5 West Gate", battery: "94% (4.08V)", vitals: "HR 72 bpm &bull; Jerk 0.03G", relay: "Node #14", status: "CONNECTED" },
      { id: "RN-WR-1115", citizen: "Swati D. (Reg #CIT-8423)", lat: 20.3546, lng: 85.8170, street: "KIIT International School Feeder", battery: "90% (3.96V)", vitals: "HR 76 bpm &bull; Jerk 0.02G", relay: "Node #14", status: "CONNECTED" },
      { id: "RN-WR-1122", citizen: "Nandini R. (Reg #CIT-8430)", lat: 20.3512, lng: 85.8150, street: "KIIT Law School Corner", battery: "86% (3.88V)", vitals: "HR 80 bpm &bull; Jerk 0.04G", relay: "Node #14", status: "CONNECTED" },
      { id: "RN-WR-1130", citizen: "Aditi N. (Reg #CIT-8438)", lat: 20.3502, lng: 85.8164, street: "KIMS Hospital Approaching Road", battery: "96% (4.15V)", vitals: "HR 69 bpm &bull; Jerk 0.01G", relay: "Node #14", status: "CONNECTED" },

      // Patia Smart Corridor
      { id: "RN-WR-3341", citizen: "Sneha R. (Reg #CIT-7119)", lat: 20.3508, lng: 85.8198, street: "Patia Junction Overhead Smart Mast", battery: "95% (4.10V)", vitals: "HR 71 bpm &bull; Jerk 0.01G", relay: "Node #18", status: "CONNECTED" },
      { id: "RN-WR-3348", citizen: "Kavita M. (Reg #CIT-7126)", lat: 20.3495, lng: 85.8210, street: "Patia Station Road Crossing", battery: "91% (3.98V)", vitals: "HR 77 bpm &bull; Jerk 0.02G", relay: "Node #18", status: "CONNECTED" },
      { id: "RN-WR-3354", citizen: "Monika J. (Reg #CIT-7132)", lat: 20.3518, lng: 85.8225, street: "Patia BDA Commercial Complex", battery: "85% (3.86V)", vitals: "HR 83 bpm &bull; Jerk 0.03G", relay: "Node #18", status: "CONNECTED" },
      { id: "RN-WR-3362", citizen: "Sunita C. (Reg #CIT-7140)", lat: 20.3482, lng: 85.8190, street: "Patia Feeder Lane 4", battery: "92% (4.02V)", vitals: "HR 73 bpm &bull; Jerk 0.02G", relay: "Node #18", status: "CONNECTED" },

      // KIIT Square & Silicon Residency
      { id: "RN-WR-2204", citizen: "Lopamudra B. (Reg #CIT-6501)", lat: 20.3475, lng: 85.8150, street: "KIIT Square North Light Pole", battery: "90% (3.95V)", vitals: "HR 70 bpm &bull; Jerk 0.01G", relay: "Node #04", status: "CONNECTED" },
      { id: "RN-WR-2212", citizen: "Prerna T. (Reg #CIT-6509)", lat: 20.3458, lng: 85.8162, street: "Silicon Residency West Feeder", battery: "87% (3.89V)", vitals: "HR 79 bpm &bull; Jerk 0.03G", relay: "Node #04", status: "CONNECTED" },
      { id: "RN-WR-2219", citizen: "Gayatri P. (Reg #CIT-6516)", lat: 20.3442, lng: 85.8172, street: "Silicon Residency West Perimeter", battery: "94% (4.06V)", vitals: "HR 74 bpm &bull; Jerk 0.02G", relay: "Node #22", status: "CONNECTED" },
      { id: "RN-WR-2228", citizen: "Deepa S. (Reg #CIT-6525)", lat: 20.3420, lng: 85.8180, street: "Damana South Connecting Mast", battery: "89% (3.93V)", vitals: "HR 72 bpm &bull; Jerk 0.02G", relay: "Node #22", status: "CONNECTED" },

      // Damana Municipal Zone
      { id: "RN-WR-4419", citizen: "Pooja D. (Reg #CIT-6204)", lat: 20.3340, lng: 85.8190, street: "Damana Square Smart Mast Post", battery: "84% (3.86V)", vitals: "HR 82 bpm &bull; Jerk 0.03G", relay: "Node #31", status: "CONNECTED" },
      { id: "RN-WR-4425", citizen: "Kalyani N. (Reg #CIT-6210)", lat: 20.3325, lng: 85.8202, street: "Damana Residential Ave 3", battery: "93% (4.04V)", vitals: "HR 75 bpm &bull; Jerk 0.02G", relay: "Node #31", status: "CONNECTED" },
      { id: "RN-WR-4432", citizen: "Rashmi M. (Reg #CIT-6217)", lat: 20.3360, lng: 85.8175, street: "Sailashree Vihar North Feeder", battery: "88% (3.91V)", vitals: "HR 78 bpm &bull; Jerk 0.03G", relay: "Node #31", status: "CONNECTED" },
      { id: "RN-WR-4440", citizen: "Sujata K. (Reg #CIT-6225)", lat: 20.3310, lng: 85.8215, street: "Damana Post Office Road", battery: "97% (4.18V)", vitals: "HR 67 bpm &bull; Jerk 0.01G", relay: "Node #31", status: "CONNECTED" },

      // CSPUR Telecom Circle & Nalco
      { id: "RN-WR-5510", citizen: "Mousumi D. (Reg #CIT-5112)", lat: 20.3245, lng: 85.8220, street: "CSPUR Telecom Circle Post", battery: "92% (4.02V)", vitals: "HR 73 bpm &bull; Jerk 0.02G", relay: "Node #34", status: "CONNECTED" },
      { id: "RN-WR-5518", citizen: "Tanuja H. (Reg #CIT-5120)", lat: 20.3220, lng: 85.8235, street: "Niladri Vihar Outer Ring", battery: "86% (3.87V)", vitals: "HR 81 bpm &bull; Jerk 0.03G", relay: "Node #34", status: "CONNECTED" },
      { id: "RN-WR-5527", citizen: "Smita P. (Reg #CIT-5129)", lat: 20.3180, lng: 85.8250, street: "Chandrasekharpur BD Market", battery: "95% (4.11V)", vitals: "HR 70 bpm &bull; Jerk 0.01G", relay: "Node #34", status: "CONNECTED" },
      { id: "RN-WR-5535", citizen: "Geetanjali R. (Reg #CIT-5137)", lat: 20.3120, lng: 85.8270, street: "Nalco Square Municipal Post", battery: "90% (3.96V)", vitals: "HR 76 bpm &bull; Jerk 0.02G", relay: "Node #47", status: "CONNECTED" }
    ];

    const individualWearableMarkers = [];
    individualWearableData.forEach(w => {
      // Pixel-matching plain blue outlined circle with radar-ping in key
      const wearableHtml = `<div class="map-marker-wearable" title="Wearable #${w.id} (${w.status})"></div>`;

      const wIcon = L.divIcon({
        html: wearableHtml,
        className: "custom-wearable-div",
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const wMarker = L.marker([w.lat, w.lng], { icon: wIcon });
      wMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.45; min-width: 210px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #0F4C81; font-size: 12px;">Wearable #${w.id}</strong>
            <span class="badge badge-online" style="font-size: 9.5px;">CONNECTED</span>
          </div>
          <div><strong>Registered Citizen:</strong> ${w.citizen}</div>
          <div><strong>Location:</strong> ${w.street}</div>
          <div><strong>Battery Level:</strong> ${w.battery}</div>
          <div><strong>Vitals / Accel:</strong> ${w.vitals}</div>
          <div><strong>Serving Mesh Relay:</strong> <code>${w.relay}</code></div>
          <div style="margin-top: 8px; padding-top: 5px; border-top: 1px dashed #E2E8F0; text-align: right;">
            <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier1_wearable')" style="color: #0F4C81; font-weight: 600; text-decoration: none; font-size: 11px;">
              Open Wearable Diagnostics &rarr;
            </a>
          </div>
        </div>
      `);
      individualWearableMarkers.push(wMarker);
    });

    // Dynamic zoom threshold: >= 14.5 splits clusters into individual pins, < 14.5 groups into count clusters
    const updateWearableDisplay = () => {
      wearableLayer.clearLayers();
      const currentZoom = map.getZoom();
      if (currentZoom >= 14.5) {
        individualWearableMarkers.forEach(m => m.addTo(wearableLayer));
      } else {
        clusterMarkers.forEach(c => c.addTo(wearableLayer));
      }
    };

    map.on('zoomend', updateWearableDisplay);
    updateWearableDisplay();

    // 3. Dial 112 PCR Patrol Van (Pixel-matching plain solid blue square in key)
    const pcrUnits = [
      { id: "PCR-14", callsign: "INFOCITY-DELTA-14", lat: 20.3620, lng: 85.8140, officer: "ASI M. Pattnaik", eta: "3.0 min", status: "PATROLLING" },
      { id: "PCR-09", callsign: "PATIA-TIGER-09", lat: 20.3545, lng: 85.8240, officer: "SI R. K. Behera", eta: "2.5 min", status: "STANDBY" }
    ];

    let pcr14Marker = null;

    pcrUnits.forEach(pcr => {
      const pcrHtml = `
        <div class="map-marker-pcr" title="${pcr.id} (${pcr.callsign})">
          <svg class="van-symbol-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="4" width="14" height="12" rx="1"/>
            <polygon points="15 8 19 8 22 11 22 16 15 16 15 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="17.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
      `;

      const pcrIcon = L.divIcon({
        html: pcrHtml,
        className: "custom-pcr-div",
        iconSize: [20, 18],
        iconAnchor: [10, 9]
      });

      const pMarker = L.marker([pcr.lat, pcr.lng], { icon: pcrIcon });
      pMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.45; min-width: 190px;">
          <strong style="color: #0F4C81;">Dial 112 Unit: ${pcr.id}</strong><br/>
          <span><strong>Callsign:</strong> ${pcr.callsign}</span><br/>
          <span><strong>Officer:</strong> ${pcr.officer}</span><br/>
          <span style="color: #2E7D32; font-weight: 600;">Status: ${pcr.status}</span><br/>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #E2E8F0; text-align: right;">
            <a href="javascript:void(0)" onclick="window.RakshakApp.switchTab('tier3_dispatch')" style="color: #0F4C81; font-weight: 600; text-decoration: none; font-size: 11px;">
              Open Dispatch Terminal &rarr;
            </a>
          </div>
        </div>
      `);
      pMarker.addTo(pcrLayer);

      if (pcr.id === "PCR-14") {
        pcr14Marker = pMarker;
      }
    });

    // 3. Van Movement: Smooth Incremental Lerp Interpolation (~250ms steps at slow realistic patrol speed)
    if (window.RakshakOverviewView.pcrAnimationInterval) {
      clearInterval(window.RakshakOverviewView.pcrAnimationInterval);
    }
    const pcrRouteWaypoints = [
      [20.3620, 85.8140], // DLF Cybercity Gate
      [20.3598, 85.8152], // Magnetics Crossing North
      [20.3575, 85.8166], // Infocity Ave Main Junction
      [20.3552, 85.8180], // KIIT Road East
      [20.3530, 85.8195], // Patia Overhead Smart Mast
      [20.3508, 85.8182], // Patia Square South
      [20.3475, 85.8160], // KIIT Square West
      [20.3515, 85.8148], // Silicon Residency Road
      [20.3570, 85.8145], // Infocity West Feeder
      [20.3600, 85.8138]  // Returning to DLF Cybercity
    ];

    let currentSegment = 0;
    let lerpStep = 0;
    const stepsPerSegment = 24; // 24 steps * 250ms = 6.0s per road segment (~25-30 km/h realistic patrol speed)
    const stepIntervalMs = 250; // Incremental step every 250ms (never warping or teleporting)

    if (pcr14Marker) {
      window.RakshakOverviewView.pcrAnimationInterval = setInterval(() => {
        lerpStep++;
        const nextSegment = (currentSegment + 1) % pcrRouteWaypoints.length;
        const startPt = pcrRouteWaypoints[currentSegment];
        const endPt = pcrRouteWaypoints[nextSegment];
        const t = lerpStep / stepsPerSegment;

        const currentLat = startPt[0] + (endPt[0] - startPt[0]) * t;
        const currentLng = startPt[1] + (endPt[1] - startPt[1]) * t;
        pcr14Marker.setLatLng([currentLat, currentLng]);

        if (lerpStep >= stepsPerSegment) {
          lerpStep = 0;
          currentSegment = nextSegment;
        }
      }, stepIntervalMs);
    }

    // Real-Time Motion: Map "Last updated: just now" refresh counter
    if (window.RakshakOverviewView.mapUpdatedInterval) {
      clearInterval(window.RakshakOverviewView.mapUpdatedInterval);
    }
    let updateSecs = 0;
    window.RakshakOverviewView.mapUpdatedInterval = setInterval(() => {
      updateSecs += 2;
      const el = document.getElementById("map-last-updated-text");
      if (!el) return;
      if (updateSecs > 6) {
        updateSecs = 0;
        el.textContent = "Last updated: just now";
      } else {
        el.textContent = `Last updated: ${updateSecs}s ago`;
      }
    }, 2500);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  },

  filterSector: function(sector) {
    this.activeSectorFilter = sector;
    const btnAll = document.getElementById("btn-zone-all");
    const btnNorth = document.getElementById("btn-zone-north");
    const btnCentral = document.getElementById("btn-zone-central");

    if (btnAll) btnAll.classList.toggle("active", sector === "ALL");
    if (btnNorth) btnNorth.classList.toggle("active", sector === "NORTH");
    if (btnCentral) btnCentral.classList.toggle("active", sector === "CENTRAL");

    const map = window.RakshakOverviewMapInstance;
    if (!map) return;

    if (sector === "NORTH") {
      map.flyTo([20.3540, 85.8170], 14.5, { duration: 0.8 });
    } else if (sector === "CENTRAL") {
      map.flyTo([20.3000, 85.8300], 13.5, { duration: 0.8 });
    } else {
      map.flyTo([20.3400, 85.8200], 13, { duration: 0.8 });
    }
  },

  runSelfTest: function() {
    // window.RakshakOverviewView.runSelfTest()
    window.RakshakApp.runSelfTest();
  },

  simulateTestDistress: function() {
    const sosCountEl = document.getElementById("landing-sos-count");
    if (sosCountEl) {
      sosCountEl.textContent = "1";
      sosCountEl.classList.remove("text-success");
      sosCountEl.classList.add("text-danger");
    }

    window.RakshakApp.playChime();
    alert("CRITICAL CAD INCIDENT TRIGGERED:\n------------------------------------\nDistress packet received from Device #RN-WR-9204 (Ward 14, Infocity Ave).\nLoRa Mesh Route: Relayed via Node #12 (110ms).\nAI Threat Verification: 87% confidence (Struggle Pattern Detected).\nRouting to Tier 3 AI Verification & Dispatch Console...");
    window.RakshakApp.switchTab("tier3_ai");
  }
};
