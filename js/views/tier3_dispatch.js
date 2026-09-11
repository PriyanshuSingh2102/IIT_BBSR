// Rakshak-Net CAD - Tier 3: Automated Dispatch — ERSS Integration
// Direct System-to-System Payload Injection into Dial 112 with Autonomous Reassignment Engine
// Strict Constraints: Procedural, Technical, Flat Corporate Design, No Marketing Style

window.RakshakTier3DispatchView = {
  countdownSeconds: 168, // 2 mins 48 secs
  countdownInterval: null,
  routeMapInstance: null,
  broadcastLayersGroup: null,
  broadcastActive: false,

  // Dispatch & Unit Tracking States
  dispatchMode: "IDLE", // "NEAREST_ONLY" | "BROADCAST_ALL" | "IDLE"
  assignedUnitId: null,
  activeUnitStatus: "STANDBY", // "STANDBY" | "EN ROUTE" | "DELAYED" | "REASSIGNED" | "ON SCENE"
  reassignedFromUnitId: null,
  delayedUnitId: null,
  elapsedSeconds: 0,
  elapsedInterval: null,
  movingMarkerInterval: null,
  routeWaypoints: [],
  routeWaypointIndex: 0,
  movingPcrMarker: null,
  activeRoutePolyline: null,
  currentLiveDistanceKm: null,
  currentLiveEtaMin: null,
  simulationSpeed: 1, // 1x = Real-Time (max 20 min SLA) | 5x | 10x | 20x Demo
  totalTransitDurationSeconds: 1200, // Max 20 min response window (1200s)
  remainingSeconds: 1200,

  // Official System-to-System Decision Audit Logs
  systemLogs: [
    { time: "22:48:14", msg: "Distress signal verified by AI Engine (threat confidence 87.4%). Event classified: CODE 3 DIRECTIVE.", type: "normal" },
    { time: "22:48:42", msg: "Dial 112 API handshake authenticated. Ready for autonomous patrol dispatch.", type: "dispatched" }
  ],

  // Full Dial 112 PCR Patrol Fleet stationed across Bhubaneswar urban sectors
  pcrFleet: [
    { id: "PCR-14", callsign: "INFOCITY-DELTA-14", plate: "OD-02-BW-8814", model: "Mahindra Scorpio 4x4 QRV", officer: "ASI M. Pattnaik", crew: 3, mdt: "MDT-OD-PCR-14", lat: 20.3620, lng: 85.8140, baseSector: "Infocity / Patia Zone", channel: "VHF-CH-04" },
    { id: "PCR-09", callsign: "PATIA-TIGER-09", plate: "OD-02-AZ-4409", model: "Tata Safari Storme", officer: "SI R. K. Behera", crew: 3, mdt: "MDT-OD-PCR-09", lat: 20.3545, lng: 85.8240, baseSector: "KIIT Square / Patia Hub", channel: "VHF-CH-04" },
    { id: "PCR-04", callsign: "DAMANA-EAGLE-04", plate: "OD-02-CP-9904", model: "Mahindra Bolero Neo", officer: "ASI B. K. Sahoo", crew: 2, mdt: "MDT-OD-PCR-04", lat: 20.3344, lng: 85.8188, baseSector: "Damana / Silicon Zone", channel: "VHF-CH-06" },
    { id: "PCR-11", callsign: "CSPUR-FALCON-11", plate: "OD-02-DX-1111", model: "Mahindra Scorpio", officer: "SI T. Tripathy", crew: 3, mdt: "MDT-OD-PCR-11", lat: 20.3220, lng: 85.8230, baseSector: "Chandrasekharpur Circle", channel: "VHF-CH-06" },
    { id: "PCR-07", callsign: "JAYADEV-VICTOR-07", plate: "OD-02-EM-0707", model: "Tata Safari Storme", officer: "Inspector D. K. Das", crew: 4, mdt: "MDT-OD-PCR-07", lat: 20.3010, lng: 85.8235, baseSector: "Jayadev Vihar Flyover", channel: "VHF-CH-02" },
    { id: "PCR-18", callsign: "SAHEED-PANTHER-18", plate: "OD-02-FQ-1818", model: "Mahindra Scorpio", officer: "ASI S. N. Ray", crew: 3, mdt: "MDT-OD-PCR-18", lat: 20.2888, lng: 85.8423, baseSector: "Saheed Nagar / Janpath", channel: "VHF-CH-02" },
    { id: "PCR-02", callsign: "STATION-BRAVO-02", plate: "OD-02-GH-2202", model: "Mahindra Bolero", officer: "SI P. C. Nayak", crew: 2, mdt: "MDT-OD-PCR-02", lat: 20.2660, lng: 85.8435, baseSector: "Master Canteen Station", channel: "VHF-CH-01" },
    { id: "PCR-21", callsign: "KHANDAGIRI-RHINO-21", plate: "OD-02-KJ-2121", model: "Mahindra Scorpio 4x4", officer: "ASI A. Mohanty", crew: 3, mdt: "MDT-OD-PCR-21", lat: 20.2605, lng: 85.7870, baseSector: "Khandagiri / Baramunda", channel: "VHF-CH-08" },
    { id: "PCR-33", callsign: "JATNI-OUTPOST-33", plate: "OD-02-LM-3333", model: "Mahindra Bolero", officer: "ASI G. Rout", crew: 2, mdt: "MDT-OD-PCR-33", lat: 20.1580, lng: 85.7020, baseSector: "Jatni Outpost Perimeter", channel: "VHF-CH-12" }
  ],

  // Official Police Crew Rosters with CUG Contact Numbers for all Dial 112 PCR Patrol Units
  officerDirectory: {
    "PCR-14": [
      { name: "ASI M. Pattnaik", rank: "Assistant Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-ASI-4819", phone: "+91 94389 11214", status: "On Patrol Duty", isLead: true },
      { name: "Havildar B. K. Jena", rank: "Havildar", role: "Driver & Tactical Pilot", badge: "OD-HAV-2041", phone: "+91 94389 11215", status: "At Vehicle Controls", isLead: false },
      { name: "Constable P. C. Das", rank: "Constable", role: "Armed Tactical Escort", badge: "OD-CON-8832", phone: "+91 94389 11216", status: "Active Escort Duty", isLead: false }
    ],
    "PCR-09": [
      { name: "SI R. K. Behera", rank: "Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-SI-3190", phone: "+91 94389 11209", status: "On Patrol Duty", isLead: true },
      { name: "Havildar D. N. Sahoo", rank: "Havildar", role: "Driver & Tactical Pilot", badge: "OD-HAV-1892", phone: "+91 94389 11210", status: "At Vehicle Controls", isLead: false },
      { name: "Constable M. K. Samal", rank: "Constable", role: "Tactical Quick Responder", badge: "OD-CON-9120", phone: "+91 94389 11211", status: "Active Tactical Duty", isLead: false }
    ],
    "PCR-04": [
      { name: "ASI B. K. Sahoo", rank: "Assistant Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-ASI-2204", phone: "+91 94389 11204", status: "On Patrol Duty", isLead: true },
      { name: "Constable T. K. Swain", rank: "Constable", role: "Driver & Comms Operator", badge: "OD-CON-7411", phone: "+91 94389 11205", status: "At Vehicle Controls", isLead: false }
    ],
    "PCR-11": [
      { name: "SI T. Tripathy", rank: "Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-SI-5511", phone: "+91 94389 11221", status: "On Patrol Duty", isLead: true },
      { name: "Havildar K. C. Pradhan", rank: "Havildar", role: "Driver & Tactical Pilot", badge: "OD-HAV-3390", phone: "+91 94389 11222", status: "At Vehicle Controls", isLead: false },
      { name: "Constable S. R. Nayak", rank: "Constable", role: "Armed Tactical Escort", badge: "OD-CON-6029", phone: "+91 94389 11223", status: "Active Escort Duty", isLead: false }
    ],
    "PCR-07": [
      { name: "Inspector D. K. Das", rank: "Inspector of Police", role: "Unit Commander (OIC)", badge: "OD-INS-1007", phone: "+91 94389 11207", status: "On Patrol Duty", isLead: true },
      { name: "SI N. K. Mohapatra", rank: "Sub-Inspector", role: "Second-in-Command (2IC)", badge: "OD-SI-4421", phone: "+91 94389 11208", status: "On Patrol Duty", isLead: false },
      { name: "Havildar P. R. Barik", rank: "Havildar", role: "Driver & Tactical Pilot", badge: "OD-HAV-8910", phone: "+91 94389 11218", status: "At Vehicle Controls", isLead: false },
      { name: "WPC A. K. Sethi", rank: "Woman Police Constable", role: "Female Safety & Quick Response", badge: "OD-WPC-5120", phone: "+91 94389 11219", status: "Active Escort Duty", isLead: false }
    ],
    "PCR-18": [
      { name: "ASI S. N. Ray", rank: "Assistant Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-ASI-6718", phone: "+91 94389 11227", status: "On Patrol Duty", isLead: true },
      { name: "Constable J. K. Rout", rank: "Constable", role: "Driver & Tactical Pilot", badge: "OD-CON-4109", phone: "+91 94389 11228", status: "At Vehicle Controls", isLead: false },
      { name: "Constable B. C. Panda", rank: "Constable", role: "Tactical First Responder", badge: "OD-CON-8840", phone: "+91 94389 11229", status: "Active Tactical Duty", isLead: false }
    ],
    "PCR-02": [
      { name: "SI P. C. Nayak", rank: "Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-SI-2202", phone: "+91 94389 11202", status: "On Patrol Duty", isLead: true },
      { name: "Havildar M. R. Biswal", rank: "Havildar", role: "Driver & Radio Operator", badge: "OD-HAV-7731", phone: "+91 94389 11203", status: "At Vehicle Controls", isLead: false }
    ],
    "PCR-21": [
      { name: "ASI A. Mohanty", rank: "Assistant Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-ASI-8921", phone: "+91 94389 11231", status: "On Patrol Duty", isLead: true },
      { name: "Constable L. N. Mishra", rank: "Constable", role: "Driver & Tactical Pilot", badge: "OD-CON-3329", phone: "+91 94389 11232", status: "At Vehicle Controls", isLead: false },
      { name: "Constable G. C. Tarai", rank: "Constable", role: "Armed Tactical Escort", badge: "OD-CON-7751", phone: "+91 94389 11233", status: "Active Escort Duty", isLead: false }
    ],
    "PCR-33": [
      { name: "ASI G. Rout", rank: "Assistant Sub-Inspector", role: "Officer-in-Charge (OIC)", badge: "OD-ASI-3312", phone: "+91 94389 11235", status: "On Patrol Duty", isLead: true },
      { name: "Constable B. N. Dehury", rank: "Constable", role: "Driver & Radio Operator", badge: "OD-CON-4910", phone: "+91 94389 11236", status: "At Vehicle Controls", isLead: false }
    ]
  },

  getOfficersForUnit: function(unitId) {
    if (this.officerDirectory && this.officerDirectory[unitId]) {
      return this.officerDirectory[unitId];
    }
    const unit = this.pcrFleet.find(u => u.id === unitId);
    if (unit) {
      return [
        { name: unit.officer, rank: "Officer-in-Charge", role: "Lead Officer", badge: "OD-OIC-112", phone: "+91 94389 11200", status: "On Patrol Duty", isLead: true }
      ];
    }
    return [];
  },

  rawJsonPayload: {
    "erss_dispatch_id": "OD-CAD-112-2026-9941",
    "incident_id": "RN-ERSS-2026-0941",
    "source_system": "RAKSHAK_NET_TIER3_AUTONOMOUS",
    "event_classification": "WOMEN_SAFETY_IMMINENT_DANGER",
    "threat_confidence_pct": 87.4,
    "timestamp_iso": "2026-09-09T22:48:42.190+05:30",
    "location": {
      "lat": 20.356214,
      "lng": 85.817408,
      "accuracy_radius_m": 14.2,
      "address": "Infocity Road, Near Magnetics Square, Patia",
      "ward": "Ward 14 (Patia - Chandrasekharpur Zone)",
      "nearest_landmark": "Opposite Silicon Residency, Infocity Ave"
    },
    "citizen_profile": {
      "registration_id": "OD-BBSR-CIT-9921",
      "name": "Priyanka Mohapatra",
      "age": 23,
      "contact_phone": "+91 98612 44321",
      "emergency_contact": "Prasanta Mohapatra (Father) - +91 94370 88219"
    },
    "assigned_unit": {
      "unit_id": "PCR-14",
      "vehicle_callsign": "INFOCITY-DELTA-14",
      "registration_no": "OD-02-BW-8814",
      "vehicle_model": "Mahindra Scorpio 4x4 QRV",
      "station_jurisdiction": "Infocity Police Station",
      "officer_in_charge": "ASI M. Pattnaik",
      "crew_count": 3,
      "current_distance_km": 0.7,
      "estimated_eta_min": 1.4,
      "mobile_terminal_id": "MDT-OD-PCR-14"
    },
    "sensor_verification": {
      "wearable_jerk_g": 3.56,
      "heart_rate_bpm": 138,
      "acoustic_spl_db": 86.0,
      "acoustic_frequency_hz": 3120,
      "cctv_frame_ref": "CAM-0472_20260909_124109.raw",
      "cctv_optical_flow_vector": "ABRUPT_DECELERATION_STRUGGLE",
      "lora_mesh_hops": 3,
      "lora_rssi_dbm": -78
    },
    "api_handshake": {
      "endpoint": "POST https://erss.odishapolice.gov.in/cad/api/v2/dispatch/priority-1",
      "status_code": 200,
      "status_message": "OK_UNIT_NOTIFIED",
      "mdt_ack_timestamp": "2026-09-09T22:48:42.842+05:30",
      "network_latency_ms": 84
    }
  },

  // Get current system time formatted as HH:MM:SS
  getFormattedTime: function() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  },

  // Dynamically resolve active citizen being tracked in CAD
  getActiveCitizen: function() {
    let deviceId = "RN-WR-9204";
    if (window.RakshakTier2View && window.RakshakTier2View.activeDeviceId) {
      deviceId = window.RakshakTier2View.activeDeviceId;
    }
    if (window.RakshakTier2View && window.RakshakTier2View.getUser) {
      const u = window.RakshakTier2View.getUser(deviceId);
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

  // Haversine distance in kilometers
  getDistanceKm: function(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  },

  // Calculate distance & ETA for all PCR vans, flag <= 15 km
  getUnitsWithin15Km: function(targetCoords) {
    if (!targetCoords) {
      const citizen = this.getActiveCitizen();
      targetCoords = (citizen && citizen.coords) ? citizen.coords : [20.3562, 85.8174];
    }
    const [tLat, tLng] = targetCoords;
    return this.pcrFleet.map(van => {
      const dist = this.getDistanceKm(tLat, tLng, van.lat, van.lng);
      // City traffic calculation: 30 km/h average speed
      const etaMin = Math.max(1.1, Number(((dist / 30) * 60).toFixed(1)));
      return {
        ...van,
        distanceKm: dist,
        etaMinutes: etaMin,
        isWithin15Km: dist <= 15.0
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  },

  // Add a line to the system decision audit log
  logSystemEvent: function(message, type = "normal") {
    const entry = { time: this.getFormattedTime(), msg: message, type: type };
    this.systemLogs.unshift(entry);
    if (this.systemLogs.length > 25) this.systemLogs.pop();
    this.renderSystemLogs();
  },

  renderSystemLogs: function() {
    const el = document.getElementById("cad-system-log-terminal");
    if (!el) return;
    el.innerHTML = this.systemLogs.map(l => {
      let msgClass = "cad-log-msg";
      if (l.type === "reassigned") msgClass += " highlight-reassigned";
      else if (l.type === "dispatched") msgClass += " highlight-dispatched";
      else if (l.type === "onscene") msgClass += " highlight-onscene";
      return `
        <div class="cad-log-line">
          <span class="cad-log-time">[${l.time}]</span>
          <span class="${msgClass}">&bull; ${l.msg}</span>
        </div>
      `;
    }).join('');
  },

  updateAcceptanceBanner: function(unit) {
    const banner = document.getElementById("pcr-acceptance-banner");
    const nameEl = document.getElementById("accepted-pcr-name");
    const offEl = document.getElementById("accepted-officer-name");
    const vehEl = document.getElementById("accepted-vehicle-model");
    const plateEl = document.getElementById("accepted-plate");
    const distEl = document.getElementById("accepted-dist");

    if (nameEl) nameEl.textContent = `${unit.id} (${unit.callsign})`;
    if (offEl) offEl.textContent = unit.officer;
    if (vehEl) vehEl.textContent = unit.model;
    if (plateEl) plateEl.textContent = unit.plate;
    if (distEl) distEl.textContent = `${unit.distanceKm} km`;
    if (banner) banner.style.display = "flex";
  },

  render: function(container) {
    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const respondingUnits = allUnits.filter(u => u.isWithin15Km);
    
    // Assign default lead unit if not set
    if (!this.assignedUnitId) {
      this.assignedUnitId = respondingUnits[0] ? respondingUnits[0].id : this.pcrFleet[0].id;
    }
    const leadUnit = allUnits.find(u => u.id === this.assignedUnitId) || respondingUnits[0] || this.pcrFleet[0];

    // Clean up map before wiping innerHTML
    this.cleanupTrackingIntervals();
    if (this.routeMapInstance) {
      try {
        this.routeMapInstance.remove();
      } catch (e) {}
      this.routeMapInstance = null;
    }

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header-row" style="margin-bottom: 8px;">
        <div class="page-title-group">
          <h1>Automated Dispatch — ERSS Integration</h1>
          <div class="page-subtitle">
            Autonomous payload injection into Odisha Police Dial 112 &bull; Active Target: <strong>${citizen.name}</strong> (${citizen.deviceId}) &bull; GPS: <span class="mono">${citizen.coords[0].toFixed(4)}° N, ${citizen.coords[1].toFixed(4)}° E</span>
          </div>
        </div>

        <!-- DISPATCH BUTTONS ROW -->
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- Broadcast / Send Alert to All PCR (<15km) (Primary Action + "First to Accept Wins" Badge) -->
          <button id="btn-broadcast-pcr-15km" class="btn btn-primary" style="background-color: var(--primary-blue); font-weight: 700; display: flex; align-items: center; gap: 6px;" onclick="window.RakshakTier3DispatchView.broadcastToAllPcrVans15Km()" title="Broadcast SOS to All PCR Vans (< 15 km)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <span>Send Alert to All PCR Vans (&lt; 15 km)</span>
            <span class="badge-first-wins">First to Accept Wins</span>
          </button>

          <!-- Test Action: Simulate Traffic Delay (Demonstrates 20-min / congestion fallback rule instantly) -->
          <button class="btn btn-outline btn-sm" style="border-color: #FCD34D; color: #92400E;" onclick="window.RakshakTier3DispatchView.simulateTrafficDelayAndReassign()" title="Trigger traffic delay fallback to observe automated reassignment to next-nearest unit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2"><polygon points="12 2 2 22 22 22 12 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Simulate Traffic Delay
          </button>

          <!-- 2. Preserved Controls: Show Raw JSON Payload & Acknowledge Unit On Scene -->
          <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3DispatchView.toggleJsonView()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span id="btn-json-label">Show Raw JSON Payload</span>
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3DispatchView.markArrived()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Acknowledge Unit On Scene
          </button>
        </div>
      </div>

      <!-- 6. ALWAYS-VISIBLE CORPORATE AUTO-REASSIGNMENT RULE NOTE -->
      <div class="dispatch-rule-note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div>
          <strong>Auto-Reassignment Rule:</strong> If the assigned lead unit fails to arrive within 20 min or is traffic-delayed, the next nearest available unit is auto-dispatched.
        </div>
      </div>

      <!-- 7. PROMINENT ALERT ACCEPTANCE NOTIFICATION BANNER (Shows Name of PCR that Accepted) -->
      <div id="pcr-acceptance-banner" class="pcr-acceptance-banner">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="acceptance-pulse-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: #166534;">
              ALERT ACCEPTED BY: <span id="accepted-pcr-name" class="mono" style="color: #0F4C81; font-weight: 800;">${leadUnit.id} (${leadUnit.callsign})</span> &mdash; <span id="accepted-officer-name" style="font-weight: 700; color: #0F172A;">${leadUnit.officer}</span>
            </div>
            <div style="font-size: 11px; color: #334155; margin-top: 2px;">
              Vehicle: <strong id="accepted-vehicle-model">${leadUnit.model}</strong> (<span id="accepted-plate">${leadUnit.plate}</span>) &bull; Initial Distance: <strong id="accepted-dist">${leadUnit.distanceKm} km</strong> &bull; Tracking live movement along corridor on map below.
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge badge-online" style="font-size: 10px; font-weight: 700;">MDT: 200 OK &bull; EN ROUTE</span>
          <button class="btn btn-outline btn-xs" style="background: #FFFFFF; font-weight: 600;" onclick="const el = document.getElementById('dispatch-route-map'); if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'center' });">
            Track Live Movement &darr;
          </button>
        </div>
      </div>

      <!-- 1. Outgoing Dispatch Payload Summary Card & Live ETA Countdown Box -->
      <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; margin-bottom: 16px;">
        <!-- Left: Summary Card Styled Like System-to-System API Log -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              Outgoing Dispatch Payload &bull; System-to-System API Handshake
            </div>
            <span class="payload-api-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              Dispatch API: 200 OK — Unit Notified
            </span>
          </div>

          <div class="card-body">
            <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 14px;">
              <!-- Verified Threat Snapshot Thumbnail from Camera CCTV-0472 -->
              <div class="payload-thumbnail-box" style="padding: 0; overflow: hidden; position: relative;">
                <img src="/assets/cctv-empty-street-frame.jpg" alt="CAM-0472 CCTV Snapshot" style="width: 100%; height: 100%; object-fit: cover;"/>
                <span class="badge badge-critical" style="position: absolute; bottom: 3px; left: 3px; font-size: 8px; padding: 1px 4px;">CAM-0472 &bull; 87%</span>
              </div>

              <!-- Main Payload Fields -->
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div>
                    <span class="mono text-bold" style="font-size: 14px; color: var(--primary-blue);">#RN-ERSS-2026-0941</span>
                    <span class="badge badge-critical" style="margin-left: 6px;">CODE 3 DIRECTIVE</span>
                  </div>
                  <span class="mono" style="font-size: 11px; color: var(--text-muted);">Payload Latency: 84ms</span>
                </div>

                <div style="font-size: 12px; color: var(--text-main); margin-bottom: 3px;">
                  <strong>GPS Coordinates:</strong> <span class="mono text-bold" style="color: #C0392B;">${citizen.coords[0].toFixed(4)}° N, ${citizen.coords[1].toFixed(4)}° E</span> (Accuracy Radius: 14.2m)
                </div>

                <div style="font-size: 11.5px; color: var(--text-secondary); margin-bottom: 3px;">
                  <strong>Incident Location:</strong> ${citizen.area} (${citizen.ward || 'Bhubaneswar Urban'})
                </div>

                <div style="font-size: 11.5px; color: var(--text-main);">
                  <strong>Assigned Patrol Unit:</strong> <span id="lead-unit-desc" class="text-primary text-bold">${leadUnit.id} (${leadUnit.callsign}) &mdash; ${leadUnit.distanceKm} km away, ETA ${leadUnit.etaMinutes} min</span>
                </div>
              </div>
            </div>

            <!-- Technical Integration Specs Table -->
            <table class="cad-table" style="font-size: 11px; border: 1px solid var(--border-color); margin-bottom: 10px;">
              <tbody>
                <tr>
                  <td class="text-bold" style="width: 25%;">API Gateway Endpoint</td>
                  <td class="mono">POST https://erss.odishapolice.gov.in/cad/api/v2/dispatch/priority-1</td>
                  <td class="text-bold" style="width: 20%;">Mobile Terminal</td>
                  <td class="mono" id="lead-unit-mdt">${leadUnit.mdt}</td>
                </tr>
                <tr>
                  <td class="text-bold">Officer In Charge</td>
                  <td id="lead-unit-officer">${leadUnit.officer} (Crew: ${leadUnit.crew} Officers)</td>
                  <td class="text-bold">Vehicle Registration</td>
                  <td class="mono" id="lead-unit-plate">${leadUnit.plate}</td>
                </tr>
              </tbody>
            </table>

            <!-- Vehicle & Control Room Context Photos -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div style="border: 1px solid var(--border-color); border-radius: 2px; overflow: hidden; display: flex; align-items: center; gap: 8px; padding: 4px 6px; background: #FAFAFA;">
                <img src="/assets/police-patrol-car.jpg" alt="Patrol Vehicle PCR Van" style="width: 58px; height: 42px; object-fit: cover; border-radius: 2px; border: 1px solid var(--border-color); flex-shrink: 0;"/>
                <div style="font-size: 10.5px;">
                  <strong id="lead-unit-model" style="color: var(--primary-blue);">${leadUnit.id} (${leadUnit.model})</strong>
                  <div class="text-muted" style="font-size: 10px;">Patrol vehicle en route &bull; <span id="lead-unit-channel">${leadUnit.channel}</span></div>
                </div>
              </div>

              <div style="border: 1px solid var(--border-color); border-radius: 2px; overflow: hidden; display: flex; align-items: center; gap: 8px; padding: 4px 6px; background: #FAFAFA;">
                <img src="/assets/dispatch-control-room.jpg" alt="ERSS CAD Control Center" style="width: 58px; height: 42px; object-fit: cover; border-radius: 2px; border: 1px solid var(--border-color); flex-shrink: 0;"/>
                <div style="font-size: 10.5px;">
                  <strong style="color: var(--primary-blue);">Dial 112 ERSS Center</strong>
                  <div class="text-muted" style="font-size: 10px;">Host CAD link operational &bull; Sub-GHz Mesh</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Live "ETA Countdown & Intercept Telemetry" Component -->
        <div class="card eta-countdown-card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="stat-tile-title" style="margin-bottom: 0;">
              <span>Patrol Intercept Telemetry</span>
              <span id="dispatch-status-badge" class="badge badge-enroute">
                ${leadUnit.id} EN ROUTE
              </span>
            </div>

            <div style="padding: 10px 0 6px 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 0.5px;">
                  Live Estimated Arrival &bull; Distance-Paced
                </div>
                <span id="active-speed-badge" class="badge badge-neutral" style="font-size: 9px; font-weight: 700;">1x REAL-TIME</span>
              </div>
              <!-- Real-time ticking ETA clock calibrated to distance (Close = fast, Far = normal, max 20m) -->
              <div id="erss-eta-clock" class="eta-text-large" style="letter-spacing: -0.5px;">
                ${String(Math.floor(Math.min(20.0, Math.max(1.0, (leadUnit.distanceKm / 35) * 60)))).padStart(2, '0')}:${String(Math.round(((Math.min(20.0, Math.max(1.0, (leadUnit.distanceKm / 35) * 60))) % 1) * 60)).padStart(2, '0')}
              </div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                Active Intercept Unit: <span id="erss-lead-callsign" class="text-bold" style="color: var(--primary-blue);">${leadUnit.id} (${leadUnit.callsign})</span>
              </div>

              <!-- Simulation Transit Speed Controls (Distance-calibrated) -->
              <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 2px; padding: 6px 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Simulation Pacing Control</span>
                  <span style="font-size: 9px; color: var(--text-secondary);">Close = Fast &bull; Far = Normal (Max 20m)</span>
                </div>
                <div style="display: flex; gap: 4px;">
                  <button id="speed-btn-1x" class="sim-speed-btn active" onclick="window.RakshakTier3DispatchView.setSimulationSpeed(1)">1x Real-Time</button>
                  <button id="speed-btn-5x" class="sim-speed-btn" onclick="window.RakshakTier3DispatchView.setSimulationSpeed(5)">5x Fast</button>
                  <button id="speed-btn-10x" class="sim-speed-btn" onclick="window.RakshakTier3DispatchView.setSimulationSpeed(10)">10x Turbo</button>
                  <button id="speed-btn-20x" class="sim-speed-btn" onclick="window.RakshakTier3DispatchView.setSimulationSpeed(20)">20x Demo</button>
                </div>
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 10px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="text-muted">Distance to Scene:</span>
              <span class="mono text-bold" id="erss-dist-label">${leadUnit.distanceKm} km</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="text-muted">Dispatch Timer:</span>
              <span class="mono text-bold" id="erss-elapsed-label">Elapsed: 00:00</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="text-muted">Calculated Avg Speed:</span>
              <span class="mono text-bold">30 km/h (Urban Transit)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Autonomous Decision Audit Log Terminal -->
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 12px;">
          <div class="card-title" style="font-size: 11.5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            Dial 112 Autonomous Decision Audit Log
          </div>
          <span class="mono text-muted" style="font-size: 10px;">AUTO-REASSIGNMENT ENGINE: ACTIVE</span>
        </div>
        <div class="card-body-flush">
          <div id="cad-system-log-terminal" class="cad-system-log-box"></div>
        </div>
      </div>

      <!-- 2. Tactical CAD Route & Live Moving Unit Map -->
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Tactical Computer-Aided Dispatch Route &bull; Live Unit Movement Tracking
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="map-tracking-indicator" class="mono text-muted" style="font-size: 11px;">Live GPS Tracking: ${leadUnit.id}</span>
          </div>
        </div>
        <div class="card-body-flush">
          <div class="map-container-wrapper" style="height: 400px;">
            <div id="dispatch-route-map" class="leaflet-map-element"></div>
            <div class="map-floating-legend">
              <div style="font-weight: 700; font-size: 10px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 2px;">Tactical Legend</div>
              <div class="legend-item"><span class="legend-icon" style="background: #0F4C81;"></span> Lead Unit (${leadUnit.id})</div>
              <div class="legend-item"><span class="legend-icon" style="background: #1E293B;"></span> Fleet Patrol Units (&lt; 15 km)</div>
              <div class="legend-item"><span class="legend-icon" style="background: #C0392B;"></span> Citizen Incident Location</div>
              <div class="legend-item"><span class="legend-icon" style="background: rgba(15, 76, 129, 0.4); border: 1px dashed #0F4C81; height: 6px;"></span> 15 km Response Perimeter</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Responding Dial 112 PCR Patrol Fleet (< 15 km Radius) Grid -->
      <div id="responding-pcr-section" class="card" style="margin-bottom: 16px;">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <div class="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Dial 112 PCR Patrol Fleet &bull; Tactical Radius (&lt; 15 km Coverage)
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
              Proximity calculated from ${citizen.name}'s real-time coordinates (${citizen.coords[0].toFixed(4)}° N, ${citizen.coords[1].toFixed(4)}° E)
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="badge badge-online mono" style="font-size: 10px;">${respondingUnits.length} Units &le; 15 km</span>
            <button id="btn-fleet-alert-all" class="btn btn-primary btn-xs" style="background-color: var(--primary-blue); font-weight: 700; display: flex; align-items: center; gap: 5px;" onclick="window.RakshakTier3DispatchView.broadcastToAllPcrVans15Km()" title="Send alert to all patrol units within 15 km">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Send Alert to All
            </button>
          </div>
        </div>

        <div id="pcr-fleet-grid-container" class="pcr-fleet-grid">
          <!-- Dynamically updated by renderFleetCards() -->
        </div>
      </div>

      <!-- 4. Collapsible Raw JSON Payload Block -->
      <div id="json-preview-container" class="card" style="display: none; margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Raw ERSS Injection JSON Payload [RFC-7946 GeoJSON Standard]
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3DispatchView.copyJson()">
            Copy JSON Payload
          </button>
        </div>
        <div class="card-body-flush">
          <pre class="json-code-block">${JSON.stringify(window.RakshakTier3DispatchView.rawJsonPayload, null, 2)}</pre>
        </div>
      </div>

      <!-- 5. Status Timeline at Bottom -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
            Incident Escalation Status Timeline &bull; #RN-ERSS-2026-0941
          </div>
          <span id="cad-timeline-status" class="mono" style="font-size: 11px; color: var(--primary-blue);">CAD STATUS: DISPATCH_ACTIVE</span>
        </div>
        <div class="card-body">
          <div class="stepper-container" style="box-shadow: none; border: 1px solid var(--border-color); margin-bottom: 0; padding: 14px 18px;">
            <div class="stepper-step completed">
              <div class="stepper-step-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>SOS Triggered (22:48:14)</span>
            </div>

            <div class="stepper-divider"></div>

            <div class="stepper-step completed">
              <div class="stepper-step-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Verified (87% AI)</span>
            </div>

            <div class="stepper-divider"></div>

            <div class="stepper-step completed">
              <div class="stepper-step-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Dispatched (API 200)</span>
            </div>

            <div class="stepper-divider"></div>

            <div class="stepper-step active" id="timeline-step-enroute">
              <div class="stepper-step-circle" style="background-color: var(--primary-blue); border-color: var(--primary-blue); color: #FFFFFF;">
                4
              </div>
              <span id="timeline-step-enroute-label" style="color: var(--primary-blue); font-weight: 700;">Units En Route (${respondingUnits.length} PCR Vans &le; 15 km)</span>
            </div>

            <div class="stepper-divider"></div>

            <div class="stepper-step" id="timeline-step-resolved">
              <div class="stepper-step-circle">5</div>
              <span>Resolved</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render fleet cards and logs
    this.renderFleetCards();
    this.renderSystemLogs();

    // Initialize Leaflet Map and start live tracking
    setTimeout(() => {
      window.RakshakTier3DispatchView.initRouteMap();
      window.RakshakTier3DispatchView.startLiveUnitTracking(leadUnit, citizen);
    }, 60);
  },

  // Render the fleet grid with live badges for each card
  renderFleetCards: function() {
    const container = document.getElementById("pcr-fleet-grid-container");
    if (!container) return;

    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const respondingUnits = allUnits.filter(u => u.isWithin15Km);

    container.innerHTML = respondingUnits.map(u => {
      const isAssigned = u.id === this.assignedUnitId;
      const isDelayed = u.id === this.delayedUnitId || (isAssigned && this.activeUnitStatus === "DELAYED");
      const isReassignedOld = u.id === this.reassignedFromUnitId;
      const isReassignedActive = isAssigned && this.reassignedFromUnitId !== null;
      const isOnScene = isAssigned && this.activeUnitStatus === "ON SCENE";

      // Live ETA string
      const displayEta = isAssigned && this.currentLiveEtaMin !== null
        ? this.currentLiveEtaMin
        : u.etaMinutes;

      // Card highlight class
      let cardClass = "pcr-unit-card";
      if (isAssigned) cardClass += " is-lead";
      if (isDelayed) cardClass += " is-delayed";

      // Status Badge HTML
      let badgeHtml = "";
      if (isOnScene) {
        badgeHtml = `<span class="badge-status-onscene"><span class="status-dot green" style="background:#16A34A;"></span> Status: ON SCENE</span>`;
      } else if (isDelayed) {
        badgeHtml = `<span class="badge-status-delayed"><span class="status-dot orange" style="background:#B45309;"></span> Status: DELAYED — Possible Traffic Congestion</span>`;
      } else if (isReassignedOld) {
        badgeHtml = `<span class="badge-status-reassigned">Status: REASSIGNED (Delayed)</span>`;
      } else if (isReassignedActive) {
        badgeHtml = `<span class="badge-status-reassigned-active"><span class="status-dot blue" style="background:#0F4C81;"></span> Status: EN ROUTE (Reassigned) &bull; ETA: ${displayEta} min</span>`;
      } else if (isAssigned && this.activeUnitStatus === "EN ROUTE") {
        badgeHtml = `<span class="badge-status-enroute"><span class="status-dot blue" style="background:#1D4ED8;"></span> Status: EN ROUTE &bull; ETA: ${displayEta} min</span>`;
      } else if (this.dispatchMode === "BROADCAST_ALL") {
        badgeHtml = `<span class="badge badge-neutral" style="font-size: 9.5px; opacity: 0.7;">Invite Auto-Cancelled</span>`;
      } else {
        badgeHtml = `<span class="badge badge-neutral" style="font-size: 9.5px;">STANDBY (Available)</span>`;
      }

      return `
        <div id="pcr-card-${u.id}" class="${cardClass}">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <div>
                <span class="mono text-bold" style="font-size: 13px; color: var(--primary-blue);">${u.id}</span>
                <span class="mono text-muted" style="font-size: 10px; margin-left: 4px;">(${u.callsign})</span>
                ${isAssigned ? '<span class="badge-lead-unit" style="margin-left: 6px;">ACTIVE UNIT</span>' : ''}
              </div>
              <span class="badge-distance-pill">${u.distanceKm} km away</span>
            </div>

            <div style="font-size: 11.5px; color: var(--text-main); margin-bottom: 3px;">
              <strong>${u.model}</strong> &bull; <span class="mono text-muted" style="font-size: 10px;">${u.plate}</span>
            </div>

            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
              ${u.officer} &bull; Crew: ${u.crew} &bull; Sector: ${u.baseSector}
            </div>

            <div style="margin-bottom: 6px;">
              ${badgeHtml}
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 6px; align-items: center;">
              <span class="badge badge-online" style="font-size: 9px; padding: 1px 5px;">MDT: 200 OK</span>
              <span class="mono text-muted" style="font-size: 9.5px;">${u.channel}</span>
            </div>
            <span class="mono text-bold" style="font-size: 11px; color: ${isAssigned ? '#16A34A' : 'var(--text-main)'};">
              ETA: ${displayEta} min
            </span>
          </div>

          <!-- Individual Card Actions: Send Alert, Location & Info -->
          <div class="pcr-card-actions">
            <button class="pcr-btn-alert" onclick="window.RakshakTier3DispatchView.dispatchIndividualUnit('${u.id}')" title="Send alert & victim location to ${u.id}">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Send Alert
            </button>
            <button class="pcr-btn-loc" onclick="window.RakshakTier3DispatchView.focusUnitOnMap('${u.id}')" title="Locate ${u.id} on map">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              Location
            </button>
            <button class="pcr-btn-info" onclick="window.RakshakTier3DispatchView.openOfficerInfoModal('${u.id}')" title="View officers on ${u.id} and contact directly">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Info
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  initRouteMap: function() {
    if (typeof L === "undefined") return;

    const mapContainer = document.getElementById("dispatch-route-map");
    if (!mapContainer) return;

    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    if (this.routeMapInstance) {
      try {
        this.routeMapInstance.remove();
      } catch (e) {}
      this.routeMapInstance = null;
    }

    const citizen = this.getActiveCitizen();
    const incidentCoords = citizen.coords;
    const units = this.getUnitsWithin15Km(incidentCoords);
    const assignedUnit = units.find(u => u.id === this.assignedUnitId) || units[0] || this.pcrFleet[0];
    const pcrCoords = [assignedUnit.lat, assignedUnit.lng];

    const map = L.map("dispatch-route-map", {
      center: [(incidentCoords[0] + pcrCoords[0]) / 2, (incidentCoords[1] + pcrCoords[1]) / 2],
      zoom: 14,
      zoomControl: true,
      attributionControl: true
    });

    this.routeMapInstance = map;

    // Standard OpenStreetMap Tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap &bull; Odisha Police CAD Routing'
    }).addTo(map);

    this.broadcastLayersGroup = L.layerGroup().addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  },

  cleanupTrackingIntervals: function() {
    if (this.movingMarkerInterval) {
      clearInterval(this.movingMarkerInterval);
      this.movingMarkerInterval = null;
    }
    if (this.elapsedInterval) {
      clearInterval(this.elapsedInterval);
      this.elapsedInterval = null;
    }
  },

  // Generate realistic route waypoints between start and end coordinates
  generateRouteWaypoints: function(startCoord, endCoord, numSteps) {
    const waypoints = [];
    // Slight realistic deflection around road grid
    const midLat = (startCoord[0] * 0.45 + endCoord[0] * 0.55) + 0.0010;
    const midLng = (startCoord[1] * 0.55 + endCoord[1] * 0.45) - 0.0012;

    const half = Math.floor(numSteps / 2);
    for (let i = 0; i < half; i++) {
      const t = i / half;
      waypoints.push([
        startCoord[0] + (midLat - startCoord[0]) * t,
        startCoord[1] + (midLng - startCoord[1]) * t
      ]);
    }
    for (let i = 0; i <= numSteps - half; i++) {
      const t = i / (numSteps - half);
      waypoints.push([
        midLat + (endCoord[0] - midLat) * t,
        midLng + (endCoord[1] - midLng) * t
      ]);
    }
    return waypoints;
  },

  // Start live movement on Leaflet map with real-time recalculation of distance, ETA & elapsed time
  startLiveUnitTracking: function(unit, citizen) {
    this.cleanupTrackingIntervals();
    this.activeUnitStatus = "EN ROUTE";
    this.updateAcceptanceBanner(unit);

    if (!this.routeMapInstance || !this.broadcastLayersGroup) return;

    this.broadcastLayersGroup.clearLayers();

    const incidentCoords = citizen.coords;
    const startCoords = [unit.lat, unit.lng];

    // Tight zoom framing so user immediately sees the accepted PCR moving towards the citizen
    const bounds = L.latLngBounds([startCoords, incidentCoords]);
    this.routeMapInstance.fitBounds(bounds, { padding: [55, 55], maxZoom: 16 });

    // 1. Draw 15 km Tactical Perimeter Circle
    L.circle(incidentCoords, {
      radius: 15000,
      color: "#0F4C81",
      weight: 1.5,
      dashArray: "6, 6",
      fillColor: "#0F4C81",
      fillOpacity: 0.04
    }).bindPopup("<strong>15 km Tactical Perimeter</strong><br/>Dial 112 ERSS Sector Coverage").addTo(this.broadcastLayersGroup);

    // 2. Incident Marker (Red distress beacon)
    const incIcon = L.divIcon({
      html: `
        <div style="background-color: #C0392B; border: 2px solid #FFFFFF; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 11px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
      `,
      className: "custom-inc-marker",
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker(incidentCoords, { icon: incIcon }).bindPopup(`
      <strong>Incident Target: ${citizen.name}</strong><br/>
      ${citizen.area}<br/>
      GPS: ${incidentCoords[0].toFixed(4)}° N, ${incidentCoords[1].toFixed(4)}° E
    `).addTo(this.broadcastLayersGroup);

    // Accuracy Circle
    L.circle(incidentCoords, {
      radius: 14.2,
      color: "#C0392B",
      weight: 1.5,
      fillColor: "#C0392B",
      fillOpacity: 0.15,
      dashArray: "3, 3"
    }).addTo(this.broadcastLayersGroup);

    // 3. Generate route waypoints (180 smooth micro-steps for smooth realistic progression)
    this.routeWaypoints = this.generateRouteWaypoints(startCoords, incidentCoords, 180);
    this.routeWaypointIndex = 0;

    // 4. Draw Priority Route Polyline
    this.activeRoutePolyline = L.polyline(this.routeWaypoints, {
      color: "#0F4C81",
      weight: 5,
      opacity: 0.95
    }).addTo(this.broadcastLayersGroup);

    // 5. Create Animated Moving PCR Marker with Prominent Label
    const pcrIcon = L.divIcon({
      html: `
        <div class="custom-moving-pcr" style="background-color: #0F4C81; border: 2px solid #FFFFFF; border-radius: 3px; padding: 3px 8px; display: inline-flex; align-items: center; gap: 5px; color: #FFFFFF; font-weight: 700; font-size: 11px; font-family: monospace; white-space: nowrap; box-shadow: 0 3px 8px rgba(15, 76, 129, 0.45);">
          ★ ${unit.id}
        </div>
      `,
      className: "custom-pcr-marker",
      iconSize: [52, 24],
      iconAnchor: [26, 12]
    });
    this.movingPcrMarker = L.marker(startCoords, { icon: pcrIcon }).addTo(this.broadcastLayersGroup);
    this.movingPcrMarker.bindTooltip(
      `<div style="font-weight:700; color:#0F4C81;">★ ${unit.id} (${unit.callsign})</div><div style="font-size:10.5px; color:#334155;">${unit.officer} &bull; Moving to scene</div>`,
      { permanent: true, direction: "top", offset: [0, -12], className: "pcr-live-tooltip" }
    );

    // Update Telemetry Displays
    const clockEl = document.getElementById("erss-eta-clock");
    const distEl = document.getElementById("erss-dist-label");
    const elapsedEl = document.getElementById("erss-elapsed-label");
    const indicatorEl = document.getElementById("map-tracking-indicator");

    // Calibrate response transit duration directly according to distance:
    // Close units (e.g. 0.7 km) move fast (~1.2 min); Far units (e.g. 10-15 km) move at normal speed taking up to max 20 minutes (1200s)
    const calcMinutes = Math.min(20.0, Math.max(1.0, Number(((unit.distanceKm / 35) * 60).toFixed(1))));
    this.totalTransitDurationSeconds = Math.min(1200, Math.max(60, Math.round(calcMinutes * 60)));
    this.remainingSeconds = this.totalTransitDurationSeconds;
    this.elapsedSeconds = 0;
    this.activeUnitStatus = "EN ROUTE";

    // Set initial clock display
    const initMins = Math.floor(this.totalTransitDurationSeconds / 60);
    const initSecs = this.totalTransitDurationSeconds % 60;
    if (clockEl) clockEl.textContent = `${String(initMins).padStart(2, '0')}:${String(initSecs).padStart(2, '0')}`;
    if (distEl) distEl.textContent = `${unit.distanceKm} km remaining`;
    if (elapsedEl) elapsedEl.textContent = "Elapsed: 00:00";

    // Smooth movement & telemetry ticking every 500ms
    const tickIntervalMs = 500;
    this.movingMarkerInterval = setInterval(() => {
      const speed = this.simulationSpeed || 1;
      const deltaSec = (tickIntervalMs / 1000) * speed;
      this.elapsedSeconds += deltaSec;
      this.remainingSeconds = Math.max(0, this.totalTransitDurationSeconds - this.elapsedSeconds);

      const routeProgress = Math.min(1.0, this.elapsedSeconds / this.totalTransitDurationSeconds);

      const wpIndex = Math.min(this.routeWaypoints.length - 1, Math.floor(routeProgress * (this.routeWaypoints.length - 1)));
      this.routeWaypointIndex = wpIndex;

      const currPos = this.routeWaypoints[wpIndex];
      if (this.movingPcrMarker) {
        this.movingPcrMarker.setLatLng(currPos);
      }

      // Shrink active route line as PCR moves
      if (this.activeRoutePolyline) {
        this.activeRoutePolyline.setLatLngs(this.routeWaypoints.slice(wpIndex));
      }

      // Calculate actual live remaining distance to incident
      const remDist = Number((unit.distanceKm * (1 - routeProgress)).toFixed(2));
      this.currentLiveDistanceKm = remDist;
      this.currentLiveEtaMin = Number((this.remainingSeconds / 60).toFixed(1));

      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = Math.floor(this.remainingSeconds % 60);
      const etaClockStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      if (clockEl) clockEl.textContent = etaClockStr;
      if (distEl) distEl.textContent = `${remDist} km remaining`;
      if (indicatorEl) indicatorEl.textContent = `Live GPS Tracking: ${unit.id} (${unit.callsign}) &bull; ${remDist} km remaining &bull; Max 20m SLA (${speed}x speed)`;

      // Elapsed label
      if (elapsedEl) {
        const elMins = Math.floor(this.elapsedSeconds / 60);
        const elSecs = Math.floor(this.elapsedSeconds % 60);
        elapsedEl.textContent = `Elapsed: ${String(elMins).padStart(2, '0')}:${String(elSecs).padStart(2, '0')}`;
      }

      // Update acceptance banner distance live
      const acceptDistEl = document.getElementById("accepted-dist");
      if (acceptDistEl) acceptDistEl.textContent = `${remDist} km`;

      // Update moving marker tooltip
      if (this.movingPcrMarker && typeof this.movingPcrMarker.setTooltipContent === 'function') {
        this.movingPcrMarker.setTooltipContent(
          `<div style="font-weight:700; color:#0F4C81;">★ ${unit.id} (${unit.callsign})</div>` +
          `<div style="font-size:10.5px; color:#334155;">${unit.officer} &bull; ${remDist} km remaining &bull; ETA ${etaClockStr}</div>`
        );
      }

      // Arrival detection (when progress reaches 100% or remaining seconds reaches 0)
      if (routeProgress >= 1.0 || this.remainingSeconds <= 0) {
        this.cleanupTrackingIntervals();

        this.activeUnitStatus = "ON SCENE";
        this.currentLiveDistanceKm = 0.0;
        this.currentLiveEtaMin = 0.0;

        if (clockEl) clockEl.textContent = "00:00 – ON SCENE";
        if (distEl) distEl.textContent = "0.0 km (ARRIVED)";
        if (indicatorEl) indicatorEl.textContent = `Unit ${unit.id} has arrived on scene.`;

        const statusBadge = document.getElementById("dispatch-status-badge");
        if (statusBadge) {
          statusBadge.className = "badge badge-online";
          statusBadge.innerHTML = `<span class="status-dot green" style="background:#FFFFFF;"></span> ${unit.id} ON SCENE`;
        }

        this.logSystemEvent(`${unit.id} reached incident coordinates [${incidentCoords[0].toFixed(4)}, ${incidentCoords[1].toFixed(4)}]. Status: ON SCENE (arrived within max 20 min window).`, "onscene");
        this.renderFleetCards();
        this.markArrived(true);
      }
    }, tickIntervalMs);
  },

  // Interactive Simulation Speed Switcher (Max 20 min SLA pacing)
  setSimulationSpeed: function(speed) {
    this.simulationSpeed = Number(speed) || 1;
    [1, 5, 10, 20].forEach(s => {
      const btn = document.getElementById(`speed-btn-${s}x`);
      if (btn) {
        if (s === this.simulationSpeed) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    });

    const badge = document.getElementById("active-speed-badge");
    if (badge) {
      badge.textContent = this.simulationSpeed === 1 ? "1x REAL-TIME" : `${this.simulationSpeed}x ACCELERATED`;
      badge.className = this.simulationSpeed === 1 ? "badge badge-neutral" : "badge badge-enroute";
    }

    const indicatorEl = document.getElementById("map-tracking-indicator");
    if (indicatorEl && this.assignedUnitId) {
      indicatorEl.textContent = `Live GPS Tracking: ${this.assignedUnitId} • Speed: ${this.simulationSpeed}x`;
    }

    this.logSystemEvent(`Simulation transit speed set to ${this.simulationSpeed}x (Max 20 min SLA arrival window).`, "normal");
  },

  // 1a. ACTION: Dispatch Nearest PCR (Primary Blue)
  dispatchNearestPcr: function() {
    this.dispatchMode = "NEAREST_ONLY";
    this.broadcastActive = false;
    this.activeUnitStatus = "EN ROUTE";
    this.reassignedFromUnitId = null;
    this.delayedUnitId = null;

    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const leadUnit = allUnits[0] || this.pcrFleet[0];
    this.assignedUnitId = leadUnit.id;

    // Update DOM summary card & acceptance banner
    this.updateSummaryCardForUnit(leadUnit);
    this.updateAcceptanceBanner(leadUnit);

    const statusBadge = document.getElementById("dispatch-status-badge");
    if (statusBadge) {
      statusBadge.className = "badge badge-enroute";
      statusBadge.innerHTML = `<span class="status-dot blue" style="background:#FFFFFF;"></span> ${leadUnit.id} EN ROUTE`;
    }

    this.logSystemEvent(`Dispatch Nearest PCR directive executed. Alert accepted by single nearest unit ${leadUnit.id} (${leadUnit.callsign}, ${leadUnit.officer}, ${leadUnit.distanceKm} km away, ETA ${leadUnit.etaMinutes} min).`, "dispatched");
    if (window.RakshakAudit && window.RakshakAudit.log) {
      const offId = (window.RakshakAuth && window.RakshakAuth.getCurrentUser) ? window.RakshakAuth.getCurrentUser().officerId : "OD-CP-1023";
      window.RakshakAudit.log("DISPATCH_SOS", offId, "CAD-DISPATCH-CONSOLE", `Dispatch Nearest PCR: Priority-1 Alert sent to single nearest unit ${leadUnit.id} (${leadUnit.callsign}, ${leadUnit.officer}, ${leadUnit.distanceKm} km away).`);
    }
    this.renderFleetCards();
    this.startLiveUnitTracking(leadUnit, citizen);

    // Scroll to map so user sees the unit moving right away
    const mapCard = document.getElementById("dispatch-route-map");
    if (mapCard && typeof mapCard.scrollIntoView === 'function') {
      mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  // 1a-2. ACTION: Dispatch Individual PCR Unit directly with Victim Location
  dispatchIndividualUnit: function(unitId) {
    this.dispatchMode = "INDIVIDUAL_UNIT";
    this.broadcastActive = false;
    this.activeUnitStatus = "EN ROUTE";
    this.reassignedFromUnitId = null;
    this.delayedUnitId = null;

    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const unit = allUnits.find(u => u.id === unitId) || this.pcrFleet.find(u => u.id === unitId) || allUnits[0];
    this.assignedUnitId = unit.id;

    // Update DOM summary card & acceptance banner
    this.updateSummaryCardForUnit(unit);
    this.updateAcceptanceBanner(unit);

    const statusBadge = document.getElementById("dispatch-status-badge");
    if (statusBadge) {
      statusBadge.className = "badge badge-enroute";
      statusBadge.innerHTML = `<span class="status-dot blue" style="background:#FFFFFF;"></span> ${unit.id} EN ROUTE`;
    }

    this.logSystemEvent(`Individual dispatch alert sent to ${unit.id} (${unit.callsign}, ${unit.officer}). Target location: [${citizen.coords[0].toFixed(4)}, ${citizen.coords[1].toFixed(4)}]. Unit accepted alert (MDT 200 OK).`, "dispatched");
    if (window.RakshakAudit && window.RakshakAudit.log) {
      const offId = (window.RakshakAuth && window.RakshakAuth.getCurrentUser) ? window.RakshakAuth.getCurrentUser().officerId : "OD-CP-1023";
      window.RakshakAudit.log("DISPATCH_SOS", offId, "CAD-DISPATCH-CONSOLE", `Individual unit dispatch sent to ${unit.id} (${unit.callsign}, ${unit.officer}). Location: [${citizen.coords[0].toFixed(4)}, ${citizen.coords[1].toFixed(4)}].`);
    }
    this.renderFleetCards();
    this.startLiveUnitTracking(unit, citizen);

    // Scroll to map so user sees the unit moving right away
    const mapCard = document.getElementById("dispatch-route-map");
    if (mapCard && typeof mapCard.scrollIntoView === 'function') {
      mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  // ACTION: Focus and inspect individual unit on map
  focusUnitOnMap: function(unitId) {
    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const unit = allUnits.find(u => u.id === unitId) || this.pcrFleet.find(u => u.id === unitId);
    if (!unit) return;

    const mapCard = document.getElementById("dispatch-route-map");
    if (mapCard && typeof mapCard.scrollIntoView === 'function') {
      mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (this.routeMapInstance && typeof L !== "undefined") {
      const pcrCoords = [unit.lat, unit.lng];
      const citizenCoords = citizen.coords;
      const bounds = L.latLngBounds([pcrCoords, citizenCoords]);
      this.routeMapInstance.fitBounds(bounds, { padding: [55, 55], maxZoom: 16 });

      if (this.assignedUnitId === unit.id && this.movingPcrMarker) {
        if (typeof this.movingPcrMarker.openTooltip === 'function') {
          this.movingPcrMarker.openTooltip();
        }
      } else {
        const tempPopup = L.popup()
          .setLatLng(pcrCoords)
          .setContent(`
            <div style="min-width: 170px; font-family: 'Inter', sans-serif; font-size: 11.5px;">
              <strong style="color: #0F4C81;">★ ${unit.id} &bull; ${unit.callsign}</strong><br/>
              Officer: ${unit.officer}<br/>
              Distance to Target: <strong>${unit.distanceKm} km</strong> &bull; ETA: <strong>${unit.etaMinutes} min</strong><br/>
              <div style="display: flex; gap: 4px; margin-top: 6px;">
                <button class="btn btn-primary btn-xs" style="flex: 1;" onclick="window.RakshakTier3DispatchView.dispatchIndividualUnit('${unit.id}')">Send Alert to ${unit.id}</button>
                <button class="btn btn-outline btn-xs" style="padding: 2px 8px; font-weight: 600; color: #0F4C81;" onclick="window.RakshakTier3DispatchView.openOfficerInfoModal('${unit.id}')" title="View Crew Officers">Info</button>
              </div>
            </div>
          `)
          .openOn(this.routeMapInstance);
      }
    }
    this.logSystemEvent(`Map camera centered on ${unit.id} (${unit.callsign}) at sector: ${unit.baseSector}. Distance: ${unit.distanceKm} km.`, "normal");
  },

  // 1b. ACTION: Broadcast to All PCR (<15km) with "First to Accept Wins" Logic
  broadcastToAllPcrVans15Km: function() {
    this.dispatchMode = "BROADCAST_ALL";
    this.broadcastActive = true;
    this.activeUnitStatus = "EN ROUTE";
    this.reassignedFromUnitId = null;
    this.delayedUnitId = null;

    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const respondingUnits = allUnits.filter(u => u.isWithin15Km);
    const excludedUnits = allUnits.filter(u => !u.isWithin15Km);
    const leadUnit = respondingUnits[0] || this.pcrFleet[0];
    this.assignedUnitId = leadUnit.id;

    this.updateSummaryCardForUnit(leadUnit);
    this.updateAcceptanceBanner(leadUnit);

    const statusBadge = document.getElementById("dispatch-status-badge");
    if (statusBadge) {
      statusBadge.className = "badge badge-critical";
      statusBadge.innerHTML = `<span class="status-dot red" style="background: #FFFFFF;"></span> 15 KM BROADCAST ACTIVE &bull; ${respondingUnits.length} UNITS`;
    }

    this.logSystemEvent(`Broadcast SOS sent simultaneously to ${respondingUnits.length} units (< 15 km). Rule: First to Accept Wins. Alert accepted by ${leadUnit.id} (${leadUnit.callsign}) — ${leadUnit.officer}.`, "dispatched");
    if (window.RakshakAudit && window.RakshakAudit.log) {
      const offId = (window.RakshakAuth && window.RakshakAuth.getCurrentUser) ? window.RakshakAuth.getCurrentUser().officerId : "OD-CP-1023";
      window.RakshakAudit.log("DISPATCH_SOS", offId, "CAD-DISPATCH-CONSOLE", `15 km Broadcast SOS sent to ${respondingUnits.length} units. Accepted first by lead unit ${leadUnit.id} (${leadUnit.callsign}).`);
    }

    // Render tactical broadcast map with all responding units
    this.renderTacticalBroadcastOnMap(citizen, respondingUnits);
    this.openBroadcastModal(citizen, respondingUnits, excludedUnits);

    // Start live tracking of the accepted unit
    this.startLiveUnitTracking(leadUnit, citizen);
  },

  // HARD RULE: Simulate Traffic Congestion & Automated Fallback Reassignment
  simulateTrafficDelayAndReassign: function() {
    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const respondingUnits = allUnits.filter(u => u.isWithin15Km);

    // Ensure we have an active unit
    if (!this.assignedUnitId) {
      this.assignedUnitId = respondingUnits[0].id;
    }
    const currentUnit = allUnits.find(u => u.id === this.assignedUnitId) || respondingUnits[0];

    // Stop current unit's movement
    this.cleanupTrackingIntervals();
    this.delayedUnitId = currentUnit.id;
    this.activeUnitStatus = "DELAYED";

    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }

    // 1. Mark current unit as delayed (traffic congestion detected)
    this.logSystemEvent(`${currentUnit.id} delayed (traffic congestion detected / 20 min timeout threshold exceeded). Live ETA elevated significantly.`, "reassigned");
    
    const statusBadge = document.getElementById("dispatch-status-badge");
    if (statusBadge) {
      statusBadge.className = "badge badge-critical";
      statusBadge.innerHTML = `<span class="status-dot orange" style="background:#B45309;"></span> ${currentUnit.id} DELAYED — Traffic Congestion`;
    }

    this.renderFleetCards();

    // 2. Automated fallback after 1.2s delay: auto-reassign to next-nearest available unit
    setTimeout(() => {
      this.reassignedFromUnitId = currentUnit.id;
      this.delayedUnitId = null;

      // Find next-nearest unit that is not the delayed unit
      const availableUnits = respondingUnits.filter(u => u.id !== currentUnit.id);
      const nextUnit = availableUnits[0] || respondingUnits[1] || allUnits[1];

      if (!nextUnit) {
        alert("No backup units available within 15 km.");
        return;
      }

      this.assignedUnitId = nextUnit.id;
      this.activeUnitStatus = "EN ROUTE";

      // Formatted log line as requested:
      // "14:32:07 — PCR-09 delayed (traffic congestion detected) — Auto-reassigned to PCR-14 (1.2km away, ETA 1.9 min)"
      this.logSystemEvent(`${currentUnit.id} delayed (traffic congestion detected) — Auto-reassigned to ${nextUnit.id} (${nextUnit.distanceKm}km away, ETA ${nextUnit.etaMinutes} min)`, "reassigned");

      if (window.RakshakApp && window.RakshakApp.playChime) {
        window.RakshakApp.playChime();
      }

      // Update Summary Card & Acceptance Banner
      this.updateSummaryCardForUnit(nextUnit);
      this.updateAcceptanceBanner(nextUnit);

      if (statusBadge) {
        statusBadge.className = "badge badge-enroute";
        statusBadge.innerHTML = `<span class="status-dot blue" style="background:#FFFFFF;"></span> ${nextUnit.id} EN ROUTE (Reassigned)`;
      }

      this.renderFleetCards();
      this.startLiveUnitTracking(nextUnit, citizen);

      const mapCard = document.getElementById("dispatch-route-map");
      if (mapCard && typeof mapCard.scrollIntoView === 'function') {
        mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1200);
  },

  updateSummaryCardForUnit: function(unit) {
    const descEl = document.getElementById("lead-unit-desc");
    const mdtEl = document.getElementById("lead-unit-mdt");
    const offEl = document.getElementById("lead-unit-officer");
    const plateEl = document.getElementById("lead-unit-plate");
    const modelEl = document.getElementById("lead-unit-model");
    const chanEl = document.getElementById("lead-unit-channel");
    const callsignEl = document.getElementById("erss-lead-callsign");

    if (descEl) descEl.textContent = `${unit.id} (${unit.callsign}) — ${unit.distanceKm} km away, ETA ${unit.etaMinutes} min`;
    if (mdtEl) mdtEl.textContent = unit.mdt;
    if (offEl) offEl.textContent = `${unit.officer} (Crew: ${unit.crew} Officers)`;
    if (plateEl) plateEl.textContent = unit.plate;
    if (modelEl) modelEl.textContent = `${unit.id} (${unit.model})`;
    if (chanEl) chanEl.textContent = unit.channel;
    if (callsignEl) callsignEl.textContent = `${unit.id} (${unit.callsign})`;

    const distEl = document.getElementById("erss-dist-label");
    if (distEl) distEl.textContent = `${unit.distanceKm} km`;

    const clockEl = document.getElementById("erss-eta-clock");
    if (clockEl) {
      const calcMin = Math.min(20.0, Math.max(1.0, Number(((unit.distanceKm / 35) * 60).toFixed(1))));
      const mins = Math.floor(calcMin);
      const secs = Math.round((calcMin % 1) * 60);
      clockEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  },

  renderTacticalBroadcastOnMap: function(citizen, units) {
    const map = this.routeMapInstance;
    if (!map || typeof L === "undefined") return;

    if (this.broadcastLayersGroup) {
      this.broadcastLayersGroup.clearLayers();
    } else {
      this.broadcastLayersGroup = L.layerGroup().addTo(map);
    }

    const citizenCoords = citizen.coords;

    // 1. Draw 15 km Tactical Coverage Radius Circle
    L.circle(citizenCoords, {
      radius: 15000,
      color: "#0F4C81",
      weight: 1.5,
      dashArray: "6, 6",
      fillColor: "#0F4C81",
      fillOpacity: 0.04
    }).bindPopup("<strong>15 km Tactical Perimeter</strong><br/>All patrol units inside circle alerted via MDT link").addTo(this.broadcastLayersGroup);

    // 2. Plot citizen marker with pulsing red ring
    const citizenIcon = L.divIcon({
      html: `
        <div style="background-color: #C0392B; border: 2px solid #FFFFFF; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 11px; box-shadow: 0 2px 6px rgba(192, 57, 43, 0.4);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
      `,
      className: "custom-inc-marker",
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker(citizenCoords, { icon: citizenIcon }).bindPopup(`
      <div style="min-width: 180px; font-family: 'Inter', sans-serif;">
        <strong style="color: #C0392B;">EMERGENCY DISTRESS TARGET</strong><br/>
        <strong>${citizen.name}</strong> (${citizen.deviceId})<br/>
        Location: ${citizen.area}<br/>
        GPS: <span style="font-family: monospace;">${citizenCoords[0].toFixed(4)}° N, ${citizenCoords[1].toFixed(4)}° E</span>
      </div>
    `).addTo(this.broadcastLayersGroup);

    // 3. Plot all responding PCR vans & their converging routes
    const allLatLngs = [citizenCoords];
    units.forEach((u, idx) => {
      const isLead = u.id === this.assignedUnitId;
      allLatLngs.push([u.lat, u.lng]);

      const pcrIcon = L.divIcon({
        html: `
          <div style="background-color: ${isLead ? '#0F4C81' : '#1E293B'}; border: 2px solid #FFFFFF; border-radius: 3px; padding: 2px 5px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 700; font-size: 9.5px; font-family: monospace; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.35);">
            ${isLead ? '★ ' : ''}${u.id}
          </div>
        `,
        className: "custom-pcr-marker",
        iconSize: [44, 22],
        iconAnchor: [22, 11]
      });

      L.marker([u.lat, u.lng], { icon: pcrIcon }).bindPopup(`
        <div style="min-width: 190px; font-family: 'Inter', sans-serif; font-size: 11.5px;">
          <strong style="color: #0F4C81;">${u.id} &bull; ${u.callsign}</strong> ${isLead ? '<span style="color: #2E7D32; font-weight: 700;">(LEAD)</span>' : ''}<br/>
          Vehicle: ${u.model} (${u.plate})<br/>
          Officer: ${u.officer} (Crew: ${u.crew})<br/>
          <strong>Distance:</strong> ${u.distanceKm} km &bull; <strong>ETA:</strong> ${u.etaMinutes} min<br/>
          Radio: <span style="font-family: monospace;">${u.channel}</span> &bull; MDT: <span style="font-family: monospace; color: #2E7D32;">ACK 200 OK</span>
        </div>
      `).addTo(this.broadcastLayersGroup);

      // Draw converging route lines from each unit toward the victim
      L.polyline([[u.lat, u.lng], citizenCoords], {
        color: isLead ? "#0F4C81" : "#64748B",
        weight: isLead ? 3.5 : 1.8,
        dashArray: isLead ? "6, 6" : "4, 6",
        opacity: isLead ? 0.9 : 0.6
      }).addTo(this.broadcastLayersGroup);
    });

    try {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } catch (e) {}
  },

  openBroadcastModal: function(citizen, respondingUnits, excludedUnits) {
    let modal = document.getElementById("pcr-broadcast-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pcr-broadcast-modal";
      modal.className = "cad-modal-overlay";
      modal.onclick = (e) => this.closeBroadcastModal(e);
      document.body.appendChild(modal);
    }

    const leadUnit = respondingUnits[0] || this.pcrFleet[0];

    modal.innerHTML = `
      <div class="cad-modal-window" style="max-width: 660px;" onclick="event.stopPropagation()">
        <div class="cad-modal-header" style="background-color: var(--primary-blue); color: #FFFFFF; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <strong style="font-size: 13px; letter-spacing: 0.3px;">DIAL 112 MDT FLEET BROADCAST CONFIRMATION</strong>
          </div>
          <button class="cad-modal-close" style="color: #FFFFFF; background: none; border: none; font-size: 18px; cursor: pointer;" onclick="window.RakshakTier3DispatchView.closeBroadcastModal()">&times;</button>
        </div>

        <div class="cad-modal-body" style="padding: 16px;">
          <!-- Prominently Displays the Name of the PCR that Accepted the Alert -->
          <div style="background-color: #F0FDF4; border: 1px solid #86EFAC; border-left: 4px solid #16A34A; padding: 10px 14px; border-radius: 2px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 3px;">
                  ✓ ALERT ACCEPTED BY: <span class="mono" style="color: #0F4C81; font-weight: 800;">${leadUnit.id} (${leadUnit.callsign})</span> &mdash; ${leadUnit.officer}
                </div>
                <div style="font-size: 11px; color: #15803D;">
                  Fastest MDT acknowledgment recorded &bull; Vehicle: <strong>${leadUnit.model}</strong> (${leadUnit.plate}) &bull; Initial Distance: <strong>${leadUnit.distanceKm} km</strong> &bull; Rule: First to Accept Wins.
                </div>
              </div>
              <span class="badge badge-online" style="font-size: 10px; font-weight: 700;">FIRST TO ACCEPT</span>
            </div>
          </div>

          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
            Responding Fleet Units Acknowledged (&le; 15 km Radius):
          </div>

          <div style="max-height: 220px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 2px; margin-bottom: 14px;">
            <table class="cad-table" style="font-size: 11px; margin: 0;">
              <thead>
                <tr style="background-color: #F8FAFC;">
                  <th>Unit ID</th>
                  <th>Officer In Charge</th>
                  <th>Vehicle</th>
                  <th>Distance</th>
                  <th>Live ETA</th>
                  <th>MDT Status</th>
                </tr>
              </thead>
              <tbody>
                ${respondingUnits.map((u, i) => `
                  <tr style="${i === 0 ? 'background-color: #F0FDF4; font-weight: 600;' : ''}">
                    <td class="mono">${i === 0 ? '★ ' : ''}${u.id}</td>
                    <td>${u.officer}</td>
                    <td class="mono text-muted">${u.model}</td>
                    <td class="mono">${u.distanceKm} km</td>
                    <td class="mono text-primary">${u.etaMinutes} min</td>
                    <td><span class="badge badge-online" style="font-size: 9px;">${i === 0 ? 'ACCEPTED (LEAD)' : 'INVITE CANCELLED'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          ${excludedUnits.length > 0 ? `
            <div style="font-size: 10.5px; color: var(--text-muted); background: #F8FAFC; border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 2px; margin-bottom: 14px;">
              <strong>Out-of-Radius Units (&gt; 15 km Excluded):</strong> ${excludedUnits.map(u => `${u.id} (${u.distanceKm} km)`).join(', ')}
            </div>
          ` : ''}

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3DispatchView.closeBroadcastModal()">
              Close
            </button>
            <button id="btn-modal-send-track" class="btn btn-primary btn-sm" style="background-color: var(--primary-blue); font-weight: 700; display: flex; align-items: center; gap: 6px;" onclick="window.RakshakTier3DispatchView.acknowledgeAllResponders()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Send Dispatch & Track ${leadUnit.id} on Map &rarr;
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = "flex";
  },

  closeBroadcastModal: function(event) {
    if (event && event.target && event.target.closest && event.target.closest(".cad-modal-window") && event.target.className !== "cad-modal-close") {
      return;
    }
    const modal = document.getElementById("pcr-broadcast-modal");
    if (modal) modal.style.display = "none";
  },

  acknowledgeAllResponders: function() {
    this.closeBroadcastModal();
    if (window.RakshakApp && window.RakshakApp.playChime) {
      window.RakshakApp.playChime();
    }
    const citizen = this.getActiveCitizen();
    const allUnits = this.getUnitsWithin15Km(citizen.coords);
    const respondingUnits = allUnits.filter(u => u.isWithin15Km);
    const leadUnit = allUnits.find(u => u.id === this.assignedUnitId) || respondingUnits[0] || this.pcrFleet[0];

    // Update on-page acceptance banner
    this.updateAcceptanceBanner(leadUnit);

    // Scroll to map so user sees the live movement immediately
    const mapCard = document.getElementById("dispatch-route-map");
    if (mapCard && typeof mapCard.scrollIntoView === 'function') {
      mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Start live tracking of lead unit
    this.startLiveUnitTracking(leadUnit, citizen);
  },

  broadcastFromAI: function() {
    if (window.RakshakApp && window.RakshakApp.switchTab) {
      window.RakshakApp.switchTab('tier3_dispatch');
      setTimeout(() => {
        this.broadcastToAllPcrVans15Km();
      }, 150);
    }
  },

  toggleJsonView: function() {
    const container = document.getElementById("json-preview-container");
    const label = document.getElementById("btn-json-label");
    if (!container) return;

    if (container.style.display === "none") {
      container.style.display = "block";
      if (label) label.textContent = "Hide Raw JSON Payload";
    } else {
      container.style.display = "none";
      if (label) label.textContent = "Show Raw JSON Payload";
    }
  },

  copyJson: function() {
    const text = JSON.stringify(this.rawJsonPayload, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      alert("JSON payload copied to clipboard.");
    });
  },

  markArrived: function(isAutomatic = false) {
    this.cleanupTrackingIntervals();
    const clockEl = document.getElementById("erss-eta-clock");
    if (clockEl) clockEl.textContent = "00:00 (ON SCENE)";

    this.activeUnitStatus = "ON SCENE";

    const stepEnroute = document.getElementById("timeline-step-enroute");
    const stepResolved = document.getElementById("timeline-step-resolved");

    if (stepEnroute) {
      stepEnroute.className = "stepper-step completed";
      stepEnroute.innerHTML = `
        <div class="stepper-step-circle">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span>Units Arrived On Scene</span>
      `;
    }

    if (stepResolved) {
      stepResolved.className = "stepper-step active";
      stepResolved.innerHTML = `
        <div class="stepper-step-circle" style="background-color: var(--status-green); border-color: var(--status-green); color: #FFF;">
          5
        </div>
        <span style="color: var(--status-green); font-weight: 700;">Citizen Secured &bull; Case Resolved</span>
      `;
    }

    this.renderFleetCards();

    const citizen = this.getActiveCitizen();
    if (!isAutomatic) {
      if (window.RakshakApp && window.RakshakApp.playChime) {
        window.RakshakApp.playChime();
      }
      this.logSystemEvent(`Operator manually acknowledged unit ARRIVED ON SCENE. Case RN-ERSS-2026-0941 resolved.`, "onscene");
      if (window.RakshakAudit && window.RakshakAudit.log) {
        const offId = (window.RakshakAuth && window.RakshakAuth.getCurrentUser) ? window.RakshakAuth.getCurrentUser().officerId : "OD-CP-1023";
        window.RakshakAudit.log("ACKNOWLEDGE_UNIT", offId, "CAD-DISPATCH-CONSOLE", `Operator manually verified unit ARRIVED ON SCENE. Case RN-ERSS-2026-0941 marked RESOLVED.`);
      }
      alert(`ERSS CAD STATUS UPDATE:\n------------------------\nPatrol units reported ARRIVED ON SCENE via Vehicle MDTs.\nCitizen ${citizen.name} safely secured.\nIncident RN-ERSS-2026-0941 logged as RESOLVED_SAFE.`);
    }
  },

  activeCallState: null,
  activeCallTimer: null,

  openOfficerInfoModal: function(unitId) {
    let modal = document.getElementById("pcr-officer-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pcr-officer-modal";
      modal.className = "cad-modal-backdrop";
      modal.onclick = (e) => this.closeOfficerInfoModal(e);
      document.body.appendChild(modal);
    }

    const citizen = this.getActiveCitizen();
    const targetCoords = (citizen && citizen.coords) ? citizen.coords : [20.3562, 85.8174];
    const allUnits = this.getUnitsWithin15Km(targetCoords);
    const unit = allUnits.find(u => u.id === unitId) || this.pcrFleet.find(u => u.id === unitId);
    if (!unit) return;

    const officers = this.getOfficersForUnit(unitId);
    const isAssigned = this.assignedUnitId === unit.id;
    const distText = unit.distanceKm !== undefined ? `${unit.distanceKm} km` : (unit.dist !== undefined ? `${unit.dist} km` : '1.2 km');
    const etaText = unit.etaMinutes !== undefined ? `${unit.etaMinutes} min` : (unit.eta !== undefined ? `${unit.eta} min` : '2.5 min');

    modal.innerHTML = `
      <div class="cad-modal-window" style="max-width: 660px; max-height: 90vh; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
        <!-- Modal Header -->
        <div class="cad-modal-header" style="background-color: var(--primary-blue); color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; padding: 12px 18px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <strong style="font-size: 13px; letter-spacing: 0.3px; color: #FFFFFF;">PCR CREW DIRECTORY &bull; ${unit.id} (${unit.callsign})</strong>
          </div>
          <button class="cad-modal-close" style="color: #FFFFFF; background: none; border: none; font-size: 20px; line-height: 1; cursor: pointer;" onclick="window.RakshakTier3DispatchView.closeOfficerInfoModal()">&times;</button>
        </div>

        <!-- Modal Body -->
        <div class="cad-modal-body" style="overflow-y: auto; padding: 16px 18px; flex: 1;">
          <!-- Unit Summary Card -->
          <div class="officer-unit-summary-box">
            <div>
              <div style="font-size: 12.5px; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">
                ${unit.model} &bull; <span class="mono text-muted" style="font-size: 11px;">${unit.plate}</span>
              </div>
              <div style="font-size: 11px; color: var(--text-secondary);">
                Jurisdiction: <strong>${unit.baseSector}</strong> &bull; Channel: <span class="mono">${unit.channel}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge ${isAssigned ? 'badge-in-progress' : 'badge-online'}" style="font-size: 10px; margin-bottom: 2px; display: inline-block;">
                ${isAssigned ? 'ASSIGNED LEAD UNIT' : 'STANDBY (AVAILABLE)'}
              </span>
              <div class="mono" style="font-size: 11px; color: var(--text-secondary);">
                Dist: <strong>${distText}</strong> &bull; ETA: <strong>${etaText}</strong>
              </div>
            </div>
          </div>

          <!-- Dynamic Active Call Notification Bar -->
          <div id="officer-active-call-bar" class="officer-active-call-alert" style="display: none;"></div>

          <!-- Roster Subtitle -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.3px;">
              Assigned Officers (${officers.length} Crew Personnel on Duty)
            </div>
            <span class="mono text-muted" style="font-size: 10.5px;">Dial 112 CUG Police Network</span>
          </div>

          <!-- Officers List -->
          <div class="officer-list">
            ${officers.map(o => {
              const initials = o.name.replace(/^(ASI|SI|Inspector|Constable|Havildar|WPC)\s+/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PO';
              return `
                <div class="officer-card ${o.isLead ? 'officer-lead' : ''}">
                  <div class="officer-meta">
                    <div class="officer-avatar ${o.isLead ? 'avatar-lead' : ''}">${initials}</div>
                    <div class="officer-info-details">
                      <div class="officer-name-line">
                        <span>${o.name}</span>
                        ${o.isLead ? '<span class="badge badge-high" style="font-size: 9px; padding: 1px 5px; background: #DBEAFE; color: #1E40AF; border-color: #BFDBFE;">LEAD OFFICER</span>' : ''}
                      </div>
                      <div class="officer-subtext">
                        <span>${o.role}</span>
                        &bull;
                        <span class="mono">Badge: ${o.badge}</span>
                      </div>
                      <div class="officer-phone-row">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span class="mono font-bold" style="color: #0F172A; font-size: 11.5px;">${o.phone}</span>
                        <span class="badge badge-online" style="font-size: 8.5px; padding: 0 4px; margin-left: 4px;">${o.status}</span>
                      </div>
                    </div>
                  </div>

                  <div class="officer-actions">
                    <button class="btn-officer-call" onclick="window.RakshakTier3DispatchView.callOfficer('${unit.id}', '${o.name}', '${o.phone}')" title="Initiate CAD VoIP call to ${o.name}">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Call Officer
                    </button>
                    <a href="tel:${o.phone.replace(/[\s-]/g, '')}" class="btn-officer-dial" title="Direct dial ${o.phone}">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                      Dial
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="cad-modal-footer" style="padding: 10px 18px; background: #F8FAFC; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div class="mono text-muted" style="font-size: 10.5px; display: flex; align-items: center; gap: 5px;">
            <span class="status-dot green"></span>
            Dial 112 CUG Voice Trunk Active
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="window.RakshakTier3DispatchView.closeOfficerInfoModal()">Close</button>
            <button class="btn btn-primary btn-sm" style="background-color: var(--primary-blue);" onclick="window.RakshakTier3DispatchView.closeOfficerInfoModal(); window.RakshakTier3DispatchView.dispatchIndividualUnit('${unit.id}')">
              Send Alert to ${unit.id} &rarr;
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = "flex";
  },

  callOfficer: function(unitId, officerName, phone) {
    this.playRadioChime();

    this.logSystemEvent(`VOIP DISPATCH CALL connected to ${officerName} (${unitId}, CUG: ${phone}). Audio line active.`, "dispatched");

    const banner = document.getElementById("officer-active-call-bar");
    if (!banner) return;

    if (this.activeCallTimer) {
      clearInterval(this.activeCallTimer);
    }

    let seconds = 0;
    banner.style.display = "flex";
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981;"></span>
        <div>
          <div style="font-weight: 700; color: #065F46; font-size: 12px;">
            CAD VoIP Call Active &bull; ${officerName} (${phone})
          </div>
          <div style="font-size: 11px; color: #047857;">
            Unit: <strong>${unitId}</strong> &bull; Line: ERSS CUG Audio Trunk &bull; Call Time: <span id="call-duration-timer" class="mono font-bold">00:00</span>
          </div>
        </div>
      </div>
      <button class="btn btn-xs btn-outline" style="border-color: #EF4444; color: #DC2626; font-weight: 700; background: #FFFFFF;" onclick="window.RakshakTier3DispatchView.endOfficerCall('${officerName}')">
        End Call
      </button>
    `;

    this.activeCallTimer = setInterval(() => {
      seconds++;
      const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      const timerEl = document.getElementById("call-duration-timer");
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  },

  endOfficerCall: function(officerName) {
    if (this.activeCallTimer) {
      clearInterval(this.activeCallTimer);
      this.activeCallTimer = null;
    }
    const banner = document.getElementById("officer-active-call-bar");
    if (banner) {
      banner.style.display = "flex";
      banner.innerHTML = `
        <div style="font-size: 11.5px; color: #4B5563;">
          Call terminated with <strong>${officerName || 'Officer'}</strong>. Audio channel returned to standby.
        </div>
        <button class="btn btn-xs btn-outline" onclick="this.parentElement.style.display='none'">Dismiss</button>
      `;
    }
    this.logSystemEvent(`CAD Voice call with ${officerName || 'Officer'} disconnected. Trunk returned to standby.`, "normal");
  },

  closeOfficerInfoModal: function(event) {
    if (event && event.target && event.target.closest && event.target.closest(".cad-modal-window") && event.target.className !== "cad-modal-close") {
      return;
    }
    if (this.activeCallTimer) {
      clearInterval(this.activeCallTimer);
      this.activeCallTimer = null;
    }
    const modal = document.getElementById("pcr-officer-modal");
    if (modal) modal.style.display = "none";
  },

  playRadioChime: function() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }
};
