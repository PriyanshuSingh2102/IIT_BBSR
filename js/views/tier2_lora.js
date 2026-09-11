// Rakshak-Net CAD - Tier 2: LoRaWAN Safe Corridor Network
// Autonomous Off-Grid Signal Relay in Cellular Dead Zones
// Real Interactive Leaflet.js GIS Corridor, Nearest Camera Matrix & Multi-User GPS Tracking

window.RakshakTier2View = {
  isSimulating: false,
  map: null,
  markersGroup: null,
  hopPolylineGroup: null,
  wearableMarker: null,
  animPacketMarker: null,
  gpsJitterTimer: null,
  simTimers: [],

  activeDeviceId: "RN-WR-9204",

  // Unique real coordinates & profiles for all 15 fleet citizens in Bhubaneswar
  userLocations: {
    "RN-WR-9204": {
      deviceId: "RN-WR-9204",
      name: "Priyanka Mohapatra",
      area: "Infocity West Pedestrian Corridor",
      street: "Infocity Ave / Magnetics Crossing",
      ward: "Ward 14 (Patia - Infocity Zone)",
      coords: [20.3562, 85.8174],
      battery: 89,
      status: "TRIGGER_ACTIVE",
      carrierSignal: "0 Bars (Cellular Dead Zone)"
    },
    "RN-WR-8812": {
      deviceId: "RN-WR-8812",
      name: "Subhashree Jena",
      area: "KIIT University Enclave",
      street: "KIIT Square Lane 4 Corner",
      ward: "Ward 07 (KIIT Enclave Zone)",
      coords: [20.3516, 85.8152],
      battery: 74,
      status: "FALL_ALERT",
      carrierSignal: "1 Bar (Severe Shadowing)"
    },
    "RN-WR-4401": {
      deviceId: "RN-WR-4401",
      name: "Ananya Mishra",
      area: "Patia Smart Corridor",
      street: "Patia Chowk Overhead Smart Mast",
      ward: "Ward 13 (Patia Hub Zone)",
      coords: [20.3475, 85.8180],
      battery: 92,
      status: "STANDBY",
      carrierSignal: "2 Bars (Intermittent)"
    },
    "RN-WR-7719": {
      deviceId: "RN-WR-7719",
      name: "Roshni Behera",
      area: "Damana Municipal Crossing",
      street: "Silicon Residency West Perimeter",
      ward: "Ward 15 (Damana Zone)",
      coords: [20.3340, 85.8190],
      battery: 68,
      status: "STANDBY",
      carrierSignal: "0 Bars (Dead Zone)"
    },
    "RN-WR-5014": {
      deviceId: "RN-WR-5014",
      name: "Tanvi Tripathy",
      area: "Chandrasekharpur Telecom Circle",
      street: "CSPUR Petrol Pump Square",
      ward: "Ward 16 (CSPUR North)",
      coords: [20.3245, 85.8220],
      battery: 81,
      status: "STANDBY",
      carrierSignal: "1 Bar (Shadow Zone)"
    },
    "RN-WR-3389": {
      deviceId: "RN-WR-3389",
      name: "Deepika Pradhan",
      area: "Nalco Square Transit Corridor",
      street: "Nalco Nagar Gate 2",
      ward: "Ward 18 (Nalco Zone)",
      coords: [20.3120, 85.8270],
      battery: 19,
      status: "LOW_BATTERY_WARNING",
      carrierSignal: "0 Bars (Critical Low Cell)"
    },
    "RN-WR-6102": {
      deviceId: "RN-WR-6102",
      name: "Smrutirekha Das",
      area: "Kalinga Hospital Square",
      street: "Hospital Road Service Lane",
      ward: "Ward 12 (CSPUR South)",
      coords: [20.3195, 85.8210],
      battery: 95,
      status: "STANDBY",
      carrierSignal: "2 Bars (Nominal)"
    },
    "RN-WR-5521": {
      deviceId: "RN-WR-5521",
      name: "Lipsa Routray",
      area: "Sailashree Vihar Market",
      street: "Phase 2 Commercial Block",
      ward: "Ward 11 (Sailashree Vihar)",
      coords: [20.3390, 85.8120],
      battery: 87,
      status: "STANDBY",
      carrierSignal: "1 Bar (Low)"
    },
    "RN-WR-4889": {
      deviceId: "RN-WR-4889",
      name: "Madhusmita Nayak",
      area: "Niladri Vihar Sector 3",
      street: "Buddha Park Perimeter Road",
      ward: "Ward 10 (Niladri Vihar)",
      coords: [20.3310, 85.8105],
      battery: 62,
      status: "STANDBY",
      carrierSignal: "0 Bars (Dead Zone)"
    },
    "RN-WR-3844": {
      deviceId: "RN-WR-3844",
      name: "Swarnalata Samal",
      area: "Jayadev Vihar Overbridge",
      street: "National Highway 16 Underpass",
      ward: "Ward 22 (Jayadev Vihar)",
      coords: [20.3010, 85.8235],
      battery: 91,
      status: "STANDBY",
      carrierSignal: "3 Bars (Nominal)"
    },
    "RN-WR-2975": {
      deviceId: "RN-WR-2975",
      name: "Itishree Pattnaik",
      area: "Saheed Nagar Commercial Hub",
      street: "Maharishi College Road",
      ward: "Ward 29 (Saheed Nagar)",
      coords: [20.2888, 85.8423],
      battery: 78,
      status: "STANDBY",
      carrierSignal: "2 Bars (Intermittent)"
    },
    "RN-WR-2510": {
      deviceId: "RN-WR-2510",
      name: "Barsharani Sahoo",
      area: "Master Canteen Station Plaza",
      street: "Station Square West Lane",
      ward: "Ward 34 (Station Plaza)",
      coords: [20.2660, 85.8435],
      battery: 18,
      status: "LOW_BATTERY_WARNING",
      carrierSignal: "0 Bars (Basement Dead Zone)"
    },
    "RN-WR-1940": {
      deviceId: "RN-WR-1940",
      name: "Soumyashree Kanungo",
      area: "Khandagiri Square",
      street: "Cave Road Transit Post",
      ward: "Ward 41 (Khandagiri)",
      coords: [20.2605, 85.7870],
      battery: 83,
      status: "STANDBY",
      carrierSignal: "1 Bar (Shadow Zone)"
    },
    "RN-WR-1622": {
      deviceId: "RN-WR-1622",
      name: "Sonali Priyadarshini",
      area: "Rasulgarh Industrial Corridor",
      street: "Cuttack Road Junction",
      ward: "Ward 38 (Rasulgarh)",
      coords: [20.2980, 85.8650],
      battery: 94,
      status: "STANDBY",
      carrierSignal: "2 Bars (Nominal)"
    },
    "RN-WR-1437": {
      deviceId: "RN-WR-1437",
      name: "Archana Panigrahi",
      area: "Sailashree Vihar Extension",
      street: "DAV Public School Perimeter",
      ward: "Ward 11 (Sailashree Vihar)",
      coords: [20.3370, 85.8078],
      battery: 71,
      status: "STANDBY",
      carrierSignal: "1 Bar (Shadow Zone)"
    },
    "RN-WR-1185": {
      deviceId: "RN-WR-1185",
      name: "Pragyan Paramita Panda",
      area: "Old Town Heritage Zone",
      street: "Lingaraj Temple North Gate",
      ward: "Ward 52 (Old Town)",
      coords: [20.2390, 85.8340],
      battery: 96,
      status: "STANDBY",
      carrierSignal: "1 Bar (Dense Stone Shadowing)"
    }
  },

  // Safe resolver for any citizen ID with dynamic fallback to fleet data
  getUser: function(deviceId) {
    if (this.userLocations && this.userLocations[deviceId]) {
      return this.userLocations[deviceId];
    }
    if (window.RakshakData && window.RakshakData.wearablesFleet) {
      const fleetDev = window.RakshakData.wearablesFleet.find(d => d.deviceId === deviceId);
      if (fleetDev) {
        const hash = (deviceId || "1000").split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const lat = 20.3562 + ((hash % 100) - 50) * 0.0008;
        const lng = 85.8174 + (((hash * 13) % 100) - 50) * 0.0008;
        return {
          deviceId: fleetDev.deviceId,
          name: fleetDev.registeredUser || "Citizen " + deviceId,
          area: "Bhubaneswar Smart Safety Corridor",
          street: "Ward Sector " + (hash % 20 + 1),
          ward: `Ward ${hash % 30 + 1} (Urban Safety Grid)`,
          coords: [Number(lat.toFixed(4)), Number(lng.toFixed(4))],
          battery: fleetDev.batteryPercent || 80,
          status: fleetDev.status || "STANDBY",
          carrierSignal: "1 Bar (LoRa Relayed)"
        };
      }
    }
    return this.userLocations["RN-WR-9204"];
  },

  baseWearablePos: [20.3562, 85.8174],
  currentWearablePos: [20.3562, 85.8174],

  // Streetlight Relay Nodes mapped on real infrastructure
  nearbyNodes: [
    { id: "Node #12", pole: "OD-1402", lat: 20.3554, lng: 85.8178, location: "Infocity West Pedestrian Corridor", battery: 98, powerType: "Solar Float", status: "ONLINE", lastPing: "1s ago", rssi: -78 },
    { id: "Node #14", pole: "OD-1405", lat: 20.3545, lng: 85.8184, location: "Magnetics Crossing Light Pole", battery: 94, powerType: "Solar Float", status: "ONLINE", lastPing: "3s ago", rssi: -82 },
    { id: "Node #18", pole: "OD-1409", lat: 20.3536, lng: 85.8191, location: "Patia Junction Overhead Smart Mast", battery: 100, powerType: "Mains + UPS", status: "ONLINE", lastPing: "2s ago", rssi: -74 },
    { id: "Node #04", pole: "OD-1412", lat: 20.3524, lng: 85.8200, location: "KIIT Road Auxiliary Traffic Post", battery: 91, powerType: "Solar Float", status: "ONLINE", lastPing: "5s ago", rssi: -86 },
    { id: "Node #22", pole: "OD-1415", lat: 20.3512, lng: 85.8208, location: "Silicon Residency West Perimeter", battery: 89, powerType: "LiFePO4 Cell", status: "ONLINE", lastPing: "8s ago", rssi: -89 }
  ],

  hubNode: {
    id: "GW-BBSR-01",
    name: "Municipal Telecom Hub Tower",
    lat: 20.3528,
    lng: 85.8198,
    backhaul: "Fiber Backhaul &bull; Police CAD Linked",
    status: "ONLINE"
  },

  // Municipal CCTV Cameras with real GPS coordinates
  cctvCameras: [
    {
      id: "CAM-PATIA-14B",
      name: "Patia Magnetics Junction (NE Pole)",
      poleId: "OD-BMC-CCTV-1402",
      lat: 20.3564,
      lng: 85.8176,
      status: "STREAMING_VERIFIED",
      anomalyScore: 96,
      fov: "108° Pedestrian Corridor & Sidewalk",
      resolution: "1920x1080 @ 30 FPS",
      snapshot: "/assets/cctv-empty-street-frame.jpg"
    },
    {
      id: "CAM-KIIT-09",
      name: "KIIT Square Lane 4 Corner",
      poleId: "OD-BMC-CCTV-0988",
      lat: 20.3516,
      lng: 85.8152,
      status: "STREAMING_VERIFIED",
      anomalyScore: 92,
      fov: "92° Road Intersection & Temple Lane",
      resolution: "1920x1080 @ 30 FPS",
      snapshot: "/assets/cctv-empty-street-frame.jpg"
    },
    {
      id: "CAM-PATIA-02",
      name: "Patia Chowk Overhead Mast",
      poleId: "OD-BMC-CCTV-0412",
      lat: 20.3470,
      lng: 85.8182,
      status: "STREAMING_ACTIVE",
      anomalyScore: 44,
      fov: "360° Patrol Continuous Scan",
      resolution: "2560x1440 2K @ 25 FPS",
      snapshot: "/assets/cctv-empty-street-frame.jpg"
    },
    {
      id: "CAM-DAMANA-07",
      name: "Damana Square SBI ATM Post",
      poleId: "OD-BMC-CCTV-0721",
      lat: 20.3344,
      lng: 85.8188,
      status: "STREAMING_ACTIVE",
      anomalyScore: 22,
      fov: "78° Forecourt & Transit Intersection",
      resolution: "1920x1080 @ 30 FPS",
      snapshot: "/assets/cctv-empty-street-frame.jpg"
    },
    {
      id: "CAM-CSPUR-04",
      name: "CSPUR Telecom Circle Junction",
      poleId: "OD-BMC-CCTV-0488",
      lat: 20.3220,
      lng: 85.8230,
      status: "STREAMING_ACTIVE",
      anomalyScore: 18,
      fov: "85° Wide Crossroad & Flyover",
      resolution: "1920x1080 @ 30 FPS",
      snapshot: "/assets/cctv-empty-street-frame.jpg"
    }
  ],

  // Haversine distance in meters
  getDistanceMeters: function(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  // Get CCTV cameras sorted ascending by distance to user
  getCamerasSortedByDistance: function(userCoords) {
    const [uLat, uLng] = userCoords;
    return this.cctvCameras.map(cam => {
      const dist = this.getDistanceMeters(uLat, uLng, cam.lat, cam.lng);
      return { ...cam, distanceMeters: dist };
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);
  },

  trackUser: function(deviceId) {
    this.activeDeviceId = deviceId;
    const user = this.getUser(deviceId);
    this.baseWearablePos = [...user.coords];
    this.currentWearablePos = [...user.coords];

    // Update select dropdown value if present
    const sel = document.getElementById("tier2-citizen-select");
    if (sel) sel.value = deviceId;

    // Update subtitle if present
    const sub = document.getElementById("tier2-user-subtitle");
    if (sub) {
      sub.innerHTML = `Tracking citizen <strong>${user.name}</strong> (${user.deviceId}) &bull; ${user.area} &bull; GPS: <span class="mono">${user.coords[0].toFixed(4)}° N, ${user.coords[1].toFixed(4)}° E</span>`;
    }

    // If map is already loaded in DOM, fly to user location & update UI
    const mapEl = document.getElementById("tier2-leaflet-map");
    if (this.map && mapEl && mapEl.offsetWidth > 0) {
      this.map.flyTo(this.currentWearablePos, 16, { animate: true, duration: 1.0 });
      if (this.wearableMarker) {
        this.wearableMarker.setLatLng(this.currentWearablePos);
        this.updateWearablePopup();
      }
      this.startLiveGpsTracking();
    }
    this.renderCctvSection();
  },

  render: function(container) {
    this.clearAllTimers();

    // Safely remove prior Leaflet map before wiping DOM container
    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {
        console.warn("Prior map removal note:", e);
      }
      this.map = null;
    }
    this.wearableMarker = null;
    this.markersGroup = null;
    this.hopPolylineGroup = null;
    this.animPacketMarker = null;

    const user = this.getUser(this.activeDeviceId);
    this.baseWearablePos = [...user.coords];
    this.currentWearablePos = [...user.coords];

    container.innerHTML = `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>Tier 2 — LoRaWAN Safe Corridor Network</h1>
          <div id="tier2-user-subtitle" class="page-subtitle">
            Tracking citizen <strong>${user.name}</strong> (${user.deviceId}) &bull; ${user.area} &bull; GPS: <span class="mono">${user.coords[0].toFixed(4)}° N, ${user.coords[1].toFixed(4)}° E</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- Citizen Selector -->
          <div class="tracked-user-pill">
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Citizen:</span>
            <select id="tier2-citizen-select" class="tracked-user-select" onchange="window.RakshakTier2View.trackUser(this.value)">
              ${Object.values(this.userLocations).map(u => `
                <option value="${u.deviceId}" ${u.deviceId === this.activeDeviceId ? 'selected' : ''}>
                  ${u.name} (${u.deviceId}) &mdash; ${u.area}
                </option>
              `).join('')}
            </select>
          </div>

          <button id="btn-send-emergency-contacts" class="btn btn-primary" style="background-color: var(--primary-blue); font-weight: 600; display: inline-flex; align-items: center; gap: 6px;" onclick="window.RakshakTier2View.sendLocationToEmergencyContacts()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Send Location to Emergency Contacts
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.RakshakTier2View.resetCorridor()">
            Reset
          </button>
        </div>
      </div>

      <!-- 1. Top Section: Half-Page Interactive Leaflet Safe Corridor Map -->
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            Interactive GIS Safe Corridor &bull; Real-Time Multi-Hop Mesh (Half-Page View)
          </div>
          <div class="schematic-legend">
            <span class="schematic-legend-item">
              <span style="width: 8px; height: 8px; background-color: #C0392B; border-radius: 50%; display: inline-block;"></span>
              Active Citizen GPS
            </span>
            <span class="schematic-legend-item">
              <span style="width: 8px; height: 8px; background-color: #2E7D32; border-radius: 2px; display: inline-block;"></span>
              Streetlight Relay
            </span>
            <span class="schematic-legend-item">
              <span style="width: 8px; height: 8px; background-color: #0F4C81; border-radius: 2px; display: inline-block;"></span>
              Internet Hub
            </span>
            <span class="schematic-legend-item">
              <span style="width: 8px; height: 8px; background-color: #475569; border-radius: 2px; display: inline-block;"></span>
              CCTV Camera
            </span>
          </div>
        </div>

        <div class="card-body-flush" style="position: relative;">
          <!-- Leaflet Map Container -->
          <div id="tier2-leaflet-map"></div>

          <!-- Hop Readout Box Below Map -->
          <div class="hop-readout-box">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="text-muted" style="font-size: 11px; text-transform: uppercase;">Live Hop Trace:</span>
              <span id="hop-trace-label" class="hop-log-pill">STATUS: STANDBY &bull; Ready to transmit off-grid packet</span>
            </div>
            <div id="hop-timing-label" class="mono text-muted" style="font-size: 11px;">
              Latency: 0 ms &bull; 0 Hops
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Bottom Section: CCTV Cameras Ranked by Nearest Distance to Citizen -->
      <div id="tier2-cctv-container">
        <!-- Rendered dynamically by renderCctvSection -->
      </div>
    `;

    // Render CCTV section
    this.renderCctvSection();

    // Initialize Leaflet Map
    setTimeout(() => {
      this.initMap();
    }, 60);
  },

  renderCctvSection: function() {
    const container = document.getElementById("tier2-cctv-container");
    if (!container) return;

    const user = this.getUser(this.activeDeviceId);
    const sortedCams = this.getCamerasSortedByDistance(this.currentWearablePos);

    container.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              Nearby CCTV Cameras &bull; Optical Intercept Matrix (Ranked by Nearest Distance to Citizen)
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
              Proximity calculated from ${user.name}'s real-time coordinates (${this.currentWearablePos[0].toFixed(4)}° N, ${this.currentWearablePos[1].toFixed(4)}° E)
            </div>
          </div>
          <span class="mono" style="font-size: 11px; color: var(--text-muted);">${sortedCams.length} Cameras in Range</span>
        </div>

        <div class="cctv-distance-grid">
          ${sortedCams.map((cam, idx) => {
            const isClosest = idx === 0;
            const distText = cam.distanceMeters < 1000 ? `${cam.distanceMeters} m` : `${(cam.distanceMeters / 1000).toFixed(2)} km`;
            return `
              <div class="cctv-distance-card ${isClosest ? 'is-closest' : ''}">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <div class="mono text-bold" style="font-size: 12.5px; color: var(--primary-blue);">
                      ${cam.id}
                      <span class="text-muted" style="font-weight: normal; font-size: 10px;">(${cam.poleId})</span>
                    </div>
                    ${isClosest ? `
                      <span class="badge-nearest-cam">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        ${distText} away &bull; CLOSEST
                      </span>
                    ` : `
                      <span class="badge badge-neutral mono" style="font-size: 10px;">
                        ${distText} away
                      </span>
                    `}
                  </div>

                  <div style="font-size: 12px; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">
                    ${cam.name}
                  </div>

                  <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                    ${cam.fov}
                  </div>
                </div>

                <div style="border-top: 1px solid var(--border-color); padding-top: 8px; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="badge badge-online" style="font-size: 9.5px;">${cam.status.replace('_', ' ')}</span>
                    <span class="mono text-muted" style="font-size: 10px;">${cam.resolution}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="mono" style="font-size: 11px;">
                      AI Score: <strong class="${cam.anomalyScore > 75 ? 'text-danger' : 'text-primary'}">${cam.anomalyScore}%</strong>
                    </div>
                    <button class="btn btn-primary btn-xs btn-play-cctv" onclick="window.RakshakTier2View.playCameraFootageInTier3('${cam.id}')" title="Play ${cam.id} live footage in Tier 3 AI Verification">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Play Footage &rarr;
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  playCameraFootageInTier3: function(camId) {
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    const cam = this.cctvCameras.find(c => c.id === camId) || {
      id: camId,
      name: camId,
      poleId: "OD-BMC-CCTV-1402",
      lat: this.currentWearablePos[0],
      lng: this.currentWearablePos[1],
      fov: "Pedestrian Corridor & Sidewalk",
      resolution: "1920x1080 @ 30 FPS",
      status: "STREAMING_VERIFIED",
      anomalyScore: 92
    };

    const distMeters = this.getDistanceMeters(this.currentWearablePos[0], this.currentWearablePos[1], cam.lat, cam.lng);
    const distText = distMeters < 1000 ? `${distMeters}m from signal origin` : `${(distMeters / 1000).toFixed(2)}km from signal origin`;

    const camPayload = {
      ...cam,
      distanceMeters: distMeters,
      distanceText: distText,
      streamIp: `10.14.${(distMeters % 80) + 12}.${(distMeters % 90) + 15}`,
      channel: "CH-01"
    };

    if (window.RakshakTier3AIView && window.RakshakTier3AIView.loadCamera) {
      window.RakshakTier3AIView.loadCamera(camPayload, this.activeDeviceId);
    } else {
      if (window.RakshakTier3AIView) {
        window.RakshakTier3AIView.activeDeviceId = this.activeDeviceId;
        window.RakshakTier3AIView.activeCamera = camPayload;
      }
      if (window.RakshakApp && window.RakshakApp.switchTab) {
        window.RakshakApp.switchTab('tier3_ai');
      }
    }
  },

  clearAllTimers: function() {
    if (this.gpsJitterTimer) {
      clearInterval(this.gpsJitterTimer);
      this.gpsJitterTimer = null;
    }
    this.simTimers.forEach(t => clearTimeout(t));
    this.simTimers = [];
  },

  updateWearablePopup: function() {
    if (!this.wearableMarker) return;
    const user = this.getUser(this.activeDeviceId);
    this.wearableMarker.bindPopup(`
      <div style="min-width: 195px;">
        <div style="font-weight: 700; color: #C0392B; border-bottom: 1px solid #FEE2E2; padding-bottom: 3px; margin-bottom: 4px;">
          ${user.name} &bull; ${user.deviceId}
        </div>
        <div><strong>Status:</strong> <span style="color: #C0392B; font-weight: 600;">${user.status}</span></div>
        <div><strong>Location:</strong> ${user.area}</div>
        <div><strong>Cellular:</strong> <span style="color: #991B1B;">${user.carrierSignal}</span></div>
        <div><strong>Battery:</strong> ${user.battery}%</div>
        <div style="margin-top: 4px; font-family: monospace; font-size: 10px; color: #64748B;">
          GPS: <span id="wearable-popup-coords">${this.currentWearablePos[0].toFixed(5)}° N, ${this.currentWearablePos[1].toFixed(5)}° E</span>
        </div>
      </div>
    `, { className: "tier2-flat-popup" });
  },

  initMap: function() {
    const mapEl = document.getElementById("tier2-leaflet-map");
    if (!mapEl) return;

    if (typeof L === "undefined") {
      console.warn("Leaflet library not loaded");
      return;
    }

    if (mapEl._leaflet_id) {
      mapEl._leaflet_id = null;
    }

    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {}
      this.map = null;
    }

    // Initialize Leaflet Map centered on the active user's coordinates
    this.map = L.map("tier2-leaflet-map", {
      center: this.currentWearablePos,
      zoom: 16,
      zoomControl: true,
      attributionControl: true
    });

    // Real OpenStreetMap Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Odisha Police CAD'
    }).addTo(this.map);

    window.RakshakTier2Map = this.map;

    this.markersGroup = L.layerGroup().addTo(this.map);
    this.hopPolylineGroup = L.layerGroup().addTo(this.map);

    // 1. Wearable / Victim Marker
    const user = this.getUser(this.activeDeviceId);
    const wearableIcon = L.divIcon({
      html: `<div class="map-marker-wearable-pulse" title="${user.name} (${user.deviceId})"></div>`,
      className: "custom-wearable-pulse-div",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    this.wearableMarker = L.marker(this.currentWearablePos, { icon: wearableIcon }).addTo(this.markersGroup);
    this.updateWearablePopup();

    // 2. Streetlight Relay Node Markers along the real streets
    this.nearbyNodes.forEach(node => {
      const nodeIcon = L.divIcon({
        html: `
          <div class="map-marker-lora-pole" title="${node.id} (${node.pole})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22V7M9 7h6M9 7a3 3 0 0 1 6 0M6 22h12M12 11h.01"/>
            </svg>
          </div>
        `,
        className: "custom-node-div",
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([node.lat, node.lng], { icon: nodeIcon }).addTo(this.markersGroup);
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.4;">
          <strong style="color: #2E7D32;">${node.id}</strong> (${node.pole}) &mdash; ${node.battery}% battery &mdash; last ping ${node.lastPing}
          <div style="font-size: 10px; color: #64748B; margin-top: 3px;">${node.location} &bull; RSSI: ${node.rssi} dBm</div>
        </div>
      `, { className: "tier2-flat-popup" });
    });

    // 3. Internet-Connected Hub Gateway Marker
    const hubIcon = L.divIcon({
      html: `
        <div class="map-marker-lora-hub" title="${this.hubNode.id}: ${this.hubNode.name}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F4C81" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M4.93 4.93a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.48 0M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
          </svg>
        </div>
      `,
      className: "custom-hub-div",
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const hubMarker = L.marker([this.hubNode.lat, this.hubNode.lng], { icon: hubIcon }).addTo(this.markersGroup);
    hubMarker.bindPopup(`
      <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.4;">
        <strong style="color: #0F4C81;">Municipal Hub ${this.hubNode.id}</strong> &mdash; Fiber Backhaul Active &mdash; CAD Link Online
        <div style="font-size: 10px; color: #64748B; margin-top: 3px;">Patia Fiber Terminal Node &bull; IN865 Gateway</div>
      </div>
    `, { className: "tier2-flat-popup" });

    // 4. CCTV Camera Markers at intersections
    this.cctvCameras.forEach(cam => {
      const cctvIcon = L.divIcon({
        html: `
          <div class="map-marker-cctv-flat" title="${cam.id}: ${cam.name}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        `,
        className: "custom-cctv-div",
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const camMarker = L.marker([cam.lat, cam.lng], { icon: cctvIcon }).addTo(this.markersGroup);
      camMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.4;">
          <strong style="color: #475569;">${cam.id}</strong> &mdash; ${cam.name}
          <div style="font-size: 10px; color: #64748B; margin-top: 3px;">Pole: ${cam.poleId} &bull; Status: ${cam.status} &bull; AI Score: ${cam.anomalyScore}%</div>
        </div>
      `, { className: "tier2-flat-popup" });
    });

    // Invalidate size for proper layout
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 150);

    // Start Live GPS Movement Jitter
    this.startLiveGpsTracking();
  },

  startLiveGpsTracking: function() {
    if (this.gpsJitterTimer) clearInterval(this.gpsJitterTimer);

    this.gpsJitterTimer = setInterval(() => {
      if (!this.wearableMarker) return;

      const dLat = (Math.random() - 0.5) * 0.00028;
      const dLng = (Math.random() - 0.5) * 0.00028;

      this.currentWearablePos = [
        Number((this.baseWearablePos[0] + dLat).toFixed(6)),
        Number((this.baseWearablePos[1] + dLng).toFixed(6))
      ];

      this.wearableMarker.setLatLng(this.currentWearablePos);

      const popupCoords = document.getElementById("wearable-popup-coords");
      if (popupCoords) {
        popupCoords.textContent = `${this.currentWearablePos[0].toFixed(5)}° N, ${this.currentWearablePos[1].toFixed(5)}° E`;
      }
    }, 3500);
  },

  simulateSignalHop: function() {
    if (this.isSimulating) return;
    this.isSimulating = true;

    const btn = document.getElementById("btn-simulate-hop");
    if (btn) {
      btn.disabled = true;
      btn.classList.add("btn-outline");
      btn.classList.remove("btn-primary");
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Hopping Packet...`;
    }

    const traceLabel = document.getElementById("hop-trace-label");
    const timingLabel = document.getElementById("hop-timing-label");

    if (this.hopPolylineGroup) {
      this.hopPolylineGroup.clearLayers();
    }
    if (this.animPacketMarker && this.map) {
      this.map.removeLayer(this.animPacketMarker);
      this.animPacketMarker = null;
    }

    if (traceLabel) {
      traceLabel.textContent = "TRANSMITTING: SOS Packet radiated on 865.2 MHz (Cellular: 0 Bars)";
      traceLabel.style.color = "#C0392B";
    }
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    // Sort nearby nodes dynamically by proximity to current wearable coordinates
    const sortedNodes = [...this.nearbyNodes].sort((a, b) => {
      const da = this.getDistanceMeters(this.currentWearablePos[0], this.currentWearablePos[1], a.lat, a.lng);
      const db = this.getDistanceMeters(this.currentWearablePos[0], this.currentWearablePos[1], b.lat, b.lng);
      return da - db;
    });

    const p0 = this.currentWearablePos;
    const n1 = sortedNodes[0] || this.nearbyNodes[0];
    const n2 = sortedNodes[1] || this.nearbyNodes[1];
    const n3 = sortedNodes[2] || this.nearbyNodes[2];
    const p1 = [n1.lat, n1.lng];
    const p2 = [n2.lat, n2.lng];
    const p3 = [n3.lat, n3.lng];
    const pHub = [this.hubNode.lat, this.hubNode.lng];

    const packetIcon = L.divIcon({
      html: '<div style="width: 10px; height: 10px; background-color: #C0392B; border: 2px solid #FFFFFF; border-radius: 50%;"></div>',
      className: "custom-packet-dot",
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    if (this.map) {
      this.animPacketMarker = L.marker(p0, { icon: packetIcon }).addTo(this.map);
    }

    // HOP 1: Wearable -> Nearest Node
    const t1 = setTimeout(() => {
      if (!this.map) return;
      L.polyline([p0, p1], {
        color: "#2E7D32",
        weight: 3.5,
        dashArray: "6, 6"
      }).addTo(this.hopPolylineGroup);

      if (this.animPacketMarker) this.animPacketMarker.setLatLng(p1);

      if (traceLabel) {
        traceLabel.textContent = `Hop 1: ${n1.id} (RSSI ${n1.rssi}dBm) — relayed`;
        traceLabel.style.color = "#2E7D32";
      }
      if (timingLabel) timingLabel.textContent = "Latency: 110 ms \u2022 Hop 1/3";
      if (window.RakshakApp && window.RakshakApp.playChime) window.RakshakApp.playChime();
    }, 700);
    this.simTimers.push(t1);

    // HOP 2: Node 1 -> Node 2
    const t2 = setTimeout(() => {
      if (!this.map) return;
      L.polyline([p1, p2], {
        color: "#2E7D32",
        weight: 3.5,
        dashArray: "6, 6"
      }).addTo(this.hopPolylineGroup);

      if (this.animPacketMarker) this.animPacketMarker.setLatLng(p2);

      if (traceLabel) {
        traceLabel.textContent = `Hop 2: ${n2.id} (RSSI ${n2.rssi}dBm) — relayed`;
      }
      if (timingLabel) timingLabel.textContent = "Latency: 225 ms \u2022 Hop 2/3";
      if (window.RakshakApp && window.RakshakApp.playChime) window.RakshakApp.playChime();
    }, 1500);
    this.simTimers.push(t2);

    // HOP 3: Node 2 -> Node 3
    const t3 = setTimeout(() => {
      if (!this.map) return;
      L.polyline([p2, p3], {
        color: "#2E7D32",
        weight: 3.5,
        dashArray: "6, 6"
      }).addTo(this.hopPolylineGroup);

      if (this.animPacketMarker) this.animPacketMarker.setLatLng(p3);

      if (traceLabel) {
        traceLabel.textContent = `Hop 3: ${n3.id} (RSSI ${n3.rssi}dBm) — relayed`;
      }
      if (timingLabel) timingLabel.textContent = "Latency: 295 ms \u2022 Hop 3/3";
      if (window.RakshakApp && window.RakshakApp.playChime) window.RakshakApp.playChime();
    }, 2300);
    this.simTimers.push(t3);

    // HOP 4: Node 3 -> Internet Hub
    const t4 = setTimeout(() => {
      if (!this.map) return;
      L.polyline([p3, pHub], {
        color: "#0F4C81",
        weight: 4,
        dashArray: "4, 4"
      }).addTo(this.hopPolylineGroup);

      if (this.animPacketMarker) {
        this.animPacketMarker.setLatLng(pHub);
      }

      if (traceLabel) {
        traceLabel.textContent = "Delivered: Internet-Connected Hub (RSSI -69dBm) — packet pushed to Police CAD";
        traceLabel.style.color = "#0F4C81";
      }
      if (timingLabel) timingLabel.textContent = "Total Latency: 340 ms \u2022 3 Hops \u2022 DELIVERED";
      if (window.RakshakApp && window.RakshakApp.playChime) window.RakshakApp.playChime();

      if (btn) {
        btn.disabled = false;
        btn.classList.remove("btn-outline");
        btn.classList.add("btn-primary");
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Re-Simulate Signal Hop`;
      }
      this.isSimulating = false;
    }, 3100);
    this.simTimers.push(t4);
  },

  resetCorridor: function() {
    this.clearAllTimers();
    this.isSimulating = false;
    const user = this.userLocations[this.activeDeviceId] || this.userLocations["RN-WR-9204"];
    this.baseWearablePos = [...user.coords];
    this.currentWearablePos = [...user.coords];

    if (this.hopPolylineGroup) {
      this.hopPolylineGroup.clearLayers();
    }
    if (this.animPacketMarker && this.map) {
      this.map.removeLayer(this.animPacketMarker);
      this.animPacketMarker = null;
    }
    this.render(document.getElementById("main-content-viewport"));
  },

  // Emergency Contacts Directory & Multi-Channel Dispatch Engine
  getEmergencyContacts: function(deviceId) {
    const contactsDb = {
      "RN-WR-9204": [
        { name: "Prasanta Mohapatra", relation: "Father", phone: "+91 94370 88219", priority: 1, channels: ["SMS", "IVR Call"], status: "ACK_RECEIVED", ackTime: "0.2s" },
        { name: "Minati Mohapatra", relation: "Mother", phone: "+91 94371 55602", priority: 2, channels: ["SMS", "WhatsApp"], status: "DELIVERED", ackTime: "0.4s" },
        { name: "Ananya Sen", relation: "Local Roommate / Guardian", phone: "+91 98610 33412", priority: 3, channels: ["SMS"], status: "DELIVERED", ackTime: "0.5s" }
      ],
      "RN-WR-8812": [
        { name: "Rashmi Jena", relation: "Mother", phone: "+91 94371 66201", priority: 1, channels: ["SMS", "IVR Call"], status: "ACK_RECEIVED", ackTime: "0.2s" },
        { name: "Biswanath Jena", relation: "Father", phone: "+91 94370 12894", priority: 2, channels: ["SMS", "WhatsApp"], status: "DELIVERED", ackTime: "0.3s" },
        { name: "Pradeep Jena", relation: "Brother", phone: "+91 98612 99014", priority: 3, channels: ["SMS"], status: "DELIVERED", ackTime: "0.6s" }
      ],
      "RN-WR-4401": [
        { name: "Debasis Mishra", relation: "Brother", phone: "+91 98610 22004", priority: 1, channels: ["SMS", "IVR Call"], status: "ACK_RECEIVED", ackTime: "0.2s" },
        { name: "Sunita Mishra", relation: "Mother", phone: "+91 94373 88120", priority: 2, channels: ["SMS", "WhatsApp"], status: "DELIVERED", ackTime: "0.4s" }
      ],
      "RN-WR-7719": [
        { name: "Santosh Behera", relation: "Father", phone: "+91 94370 19283", priority: 1, channels: ["SMS", "IVR Call"], status: "ACK_RECEIVED", ackTime: "0.3s" },
        { name: "Geeta Behera", relation: "Mother", phone: "+91 94372 44109", priority: 2, channels: ["SMS", "WhatsApp"], status: "DELIVERED", ackTime: "0.5s" }
      ]
    };

    if (contactsDb[deviceId]) {
      return contactsDb[deviceId];
    }

    // Dynamic generation for any other fleet citizen in Bhubaneswar grid:
    const user = this.getUser(deviceId);
    const parts = (user.name || "Citizen").split(" ");
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "Family";
    const num = (deviceId || "1000").replace(/\D/g, "") || "1000";

    return [
      { name: `Kailash ${lastName}`, relation: "Father", phone: `+91 94370 ${num.padStart(5, '8').slice(-5)}`, priority: 1, channels: ["SMS", "IVR Call"], status: "ACK_RECEIVED", ackTime: "0.2s" },
      { name: `Sujata ${lastName}`, relation: "Mother", phone: `+91 94371 ${(parseInt(num)+321).toString().padStart(5, '4').slice(-5)}`, priority: 2, channels: ["SMS", "WhatsApp"], status: "DELIVERED", ackTime: "0.4s" },
      { name: `Pooja ${lastName}`, relation: "Sister / Guardian", phone: `+91 98612 ${(parseInt(num)+789).toString().padStart(5, '2').slice(-5)}`, priority: 3, channels: ["SMS"], status: "DELIVERED", ackTime: "0.5s" }
    ];
  },

  sendLocationToEmergencyContacts: function() {
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    const user = this.getUser(this.activeDeviceId);
    const contacts = this.getEmergencyContacts(this.activeDeviceId);

    // Update Live Hop Trace status pill
    const traceLabel = document.getElementById("hop-trace-label");
    if (traceLabel) {
      traceLabel.textContent = `DISPATCHED: Live GPS location & distress link sent to ${contacts.length} emergency contacts (SMS/IVR 200 OK)`;
      traceLabel.style.color = "#16A34A";
    }

    const timingLabel = document.getElementById("hop-timing-label");
    if (timingLabel) {
      timingLabel.textContent = `Gov SMS Gateway: 200 OK \u2022 Latency 240ms \u2022 ${contacts.length} Recipients`;
    }

    // Visual pulse marker on Leaflet map
    if (this.wearableMarker && this.map) {
      try {
        const pulseRing = L.circle(this.currentWearablePos, {
          radius: 140,
          color: "#16A34A",
          fillColor: "#16A34A",
          fillOpacity: 0.22,
          weight: 2,
          dashArray: "4, 4"
        }).addTo(this.map);

        setTimeout(() => {
          if (this.map && pulseRing) this.map.removeLayer(pulseRing);
        }, 3500);
      } catch (e) {}
    }

    // Open Emergency Contacts Dispatch Modal
    this.openEmergencyContactsModal(user, contacts);
  },

  openEmergencyContactsModal: function(user, contacts) {
    let modal = document.getElementById("emergency-contacts-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "emergency-contacts-modal";
      modal.className = "cad-modal-backdrop";
      document.body.appendChild(modal);
    }

    modal.style.display = "flex";
    modal.onclick = (e) => {
      if (e.target === modal) this.closeEmergencyContactsModal();
    };

    const lat = this.currentWearablePos[0].toFixed(5);
    const lng = this.currentWearablePos[1].toFixed(5);
    const trackingUrl = `https://rakshak.odishapolice.gov.in/track?id=${user.deviceId}&lat=${lat}&lng=${lng}`;
    const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

    modal.innerHTML = `
      <div class="cad-modal-window" style="max-width: 780px; max-height: 90vh; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
        <div class="cad-modal-header" style="background: #F8FAFC; border-bottom: 2px solid var(--primary-blue);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 28px; height: 28px; background: #0F4C81; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #FFFFFF;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                <span>Emergency Contacts Location Dispatch &bull; Live Telemetry Link</span>
                <span class="badge badge-online" style="font-size: 9.5px; padding: 1px 6px;">SMS GATEWAY: 200 OK</span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">
                Automated multi-channel broadcast (Gov National SMS Gateway, Automated IVR, WhatsApp Verified API)
              </div>
            </div>
          </div>
          <button class="cad-modal-close" onclick="window.RakshakTier2View.closeEmergencyContactsModal()">&times;</button>
        </div>

        <div class="cad-modal-body" style="overflow-y: auto; padding: 18px 20px; flex: 1;">
          <!-- Location & Citizen Summary Strip -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; background: #F8FAFC; border: 1px solid var(--border-color); padding: 10px 14px; border-radius: 2px; margin-bottom: 14px; font-size: 11px;">
            <div>
              <span class="text-muted" style="display: block; font-size: 10px; text-transform: uppercase;">Citizen / Device:</span>
              <strong style="color: var(--primary-blue); font-size: 12px;">${user.name}</strong>
              <span class="mono text-muted" style="font-size: 10px;">(${user.deviceId})</span>
            </div>
            <div>
              <span class="text-muted" style="display: block; font-size: 10px; text-transform: uppercase;">Exact Real-Time GPS:</span>
              <span class="mono text-bold" style="color: #C0392B; font-size: 12px;">${lat}° N, ${lng}° E</span>
            </div>
            <div>
              <span class="text-muted" style="display: block; font-size: 10px; text-transform: uppercase;">Corridor Sector:</span>
              <span style="font-weight: 600;">${user.area}</span>
            </div>
            <div>
              <span class="text-muted" style="display: block; font-size: 10px; text-transform: uppercase;">Cellular Dead-Zone Status:</span>
              <span style="color: #991B1B; font-weight: 600;">${user.carrierSignal || '0 Bars (Dead Zone)'}</span>
            </div>
          </div>

          <!-- Dispatched Emergency SMS Preview Box -->
          <div class="sms-preview-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.4px;">
                Dispatched SMS / WhatsApp Message Body Preview
              </span>
              <span class="mono text-muted" style="font-size: 10px;">Encoding: GSM 7-bit &bull; 160 Chars/Part</span>
            </div>
            <div class="sms-preview-bubble">EMERGENCY SOS: ${user.name} (${user.deviceId}) has triggered distress in ${user.area}.
Live GPS: ${lat}° N, ${lng}° E
Cellular: 0 Bars (Relayed via LoRa Mesh)
Police CAD Status: ERSS Dial 112 PCR Van alerted & en route.
Live Tracking Link: ${trackingUrl}
Google Maps: ${googleMapsUrl}</div>
          </div>

          <!-- Emergency Contacts Delivery Matrix Table -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--text-main);">
                Designated Emergency Contacts (${contacts.length} Configured)
              </div>
              <span class="badge badge-online" style="font-size: 9.5px;">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                ${contacts.length}/${contacts.length} DELIVERED &amp; LOGGED
              </span>
            </div>

            <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: 2px;">
              <table class="cad-table" style="font-size: 11px; margin: 0;">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Contact Name &amp; Relation</th>
                    <th>Phone Number</th>
                    <th>Notification Channels</th>
                    <th>Gateway Status</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  ${contacts.map((c, idx) => `
                    <tr>
                      <td class="mono text-bold" style="text-align: center; width: 45px;">
                        <span class="contact-avatar-pill">${idx + 1}</span>
                      </td>
                      <td>
                        <strong style="color: var(--text-main); font-size: 11.5px;">${c.name}</strong>
                        <div style="font-size: 10px; color: var(--text-muted);">${c.relation}</div>
                      </td>
                      <td class="mono text-bold">${c.phone}</td>
                      <td>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                          ${c.channels.map(ch => {
                            let cls = 'badge-channel-sms';
                            if (ch.includes('IVR')) cls = 'badge-channel-ivr';
                            if (ch.includes('WhatsApp')) cls = 'badge-channel-whatsapp';
                            return `<span class="badge-channel ${cls}">${ch}</span>`;
                          }).join('')}
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-online" style="font-size: 9.5px; padding: 1px 6px;">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                          ${c.status === 'ACK_RECEIVED' ? 'ACK RECEIVED (Read)' : 'DELIVERED (200 OK)'}
                        </span>
                      </td>
                      <td class="mono text-muted">${c.ackTime}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="cad-modal-footer" style="padding: 10px 18px; background: #FAFAFA; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="font-size: 11px; color: var(--text-secondary);">
            All transmissions encrypted with Odisha Police ERSS gateway keys &bull; Audit Ref: #SMS-TX-884102
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="window.RakshakTier2View.closeEmergencyContactsModal()">
              Close
            </button>
            <button class="btn btn-primary btn-sm" style="background-color: var(--primary-blue); font-weight: 600;" onclick="window.RakshakTier2View.resendAlertSms()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Re-Send Location Alert
            </button>
          </div>
        </div>
      </div>
    `;
  },

  closeEmergencyContactsModal: function(event) {
    if (event && event.target && event.target.closest && event.target.closest(".cad-modal-window") && event.target.className !== "cad-modal-close") {
      return;
    }
    const modal = document.getElementById("emergency-contacts-modal");
    if (modal) modal.style.display = "none";
  },

  resendAlertSms: function() {
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }
    const user = this.getUser(this.activeDeviceId);
    const contacts = this.getEmergencyContacts(this.activeDeviceId);
    alert(`SMS GATEWAY RE-TRANSMISSION:\n-------------------------------\nEmergency location update successfully re-dispatched to all ${contacts.length} contacts of ${user.name}.\nGPS: ${this.currentWearablePos[0].toFixed(5)}° N, ${this.currentWearablePos[1].toFixed(5)}° E\nStatus: 200 OK DELIVERED.`);
  }
};

