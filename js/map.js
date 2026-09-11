// Rakshak-Net CAD - Leaflet Geospatial Engine (Bhubaneswar Grid)
// Center: Patia / Infocity / KIIT Urban Corridor (20.3540 N, 85.8190 E)

class RakshakMapEngine {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = Object.assign({
      center: [20.3540, 85.8190],
      zoom: 14,
      minZoom: 11,
      maxZoom: 18,
      showMeshLines: true,
      showGateways: true,
      showPCRUnits: true,
      showCameras: true
    }, options);

    this.map = null;
    this.layers = {
      incidents: null,
      gateways: null,
      meshLines: null,
      pcrUnits: null,
      cameras: null,
      dispatchRoute: null
    };

    this.init();
  }

  init() {
    const el = document.getElementById(this.containerId);
    if (!el) return;

    // Check if Leaflet is loaded
    if (typeof L === "undefined") {
      console.error("Leaflet library not loaded");
      return;
    }

    // Initialize Leaflet Map
    this.map = L.map(this.containerId, {
      center: this.options.center,
      zoom: this.options.zoom,
      zoomControl: true,
      attributionControl: true
    });

    // Standard OpenStreetMap Tile Layer (Clean Enterprise Standard)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Odisha Police CAD'
    }).addTo(this.map);

    // Initialize Layer Groups
    this.layers.incidents = L.layerGroup().addTo(this.map);
    this.layers.gateways = L.layerGroup().addTo(this.map);
    this.layers.meshLines = L.layerGroup().addTo(this.map);
    this.layers.pcrUnits = L.layerGroup().addTo(this.map);
    this.layers.cameras = L.layerGroup().addTo(this.map);
    this.layers.dispatchRoute = L.layerGroup().addTo(this.map);

    // Render Data Layers
    this.renderIncidents();
    if (this.options.showGateways) this.renderGateways();
    if (this.options.showPCRUnits) this.renderPCRUnits();
    if (this.options.showCameras) this.renderCameras();

    // Invalidate size after slight delay for proper layout rendering
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  renderIncidents() {
    this.layers.incidents.clearLayers();
    const data = window.RakshakData;
    if (!data || !data.incidents) return;

    data.incidents.forEach(inc => {
      const isCritical = inc.severity === "CRITICAL";
      const markerColor = isCritical ? "#C0392B" : (inc.severity === "HIGH" ? "#D35400" : "#718096");

      const iconHtml = `
        <div class="map-marker-incident" style="background-color: ${markerColor};">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-marker",
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });

      // Accuracy radius circle
      L.circle([inc.location.lat, inc.location.lng], {
        radius: inc.location.accuracyRadiusMeters || 15,
        color: markerColor,
        weight: 1.5,
        fillColor: markerColor,
        fillOpacity: 0.12,
        dashArray: "3, 3"
      }).addTo(this.layers.incidents);

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; line-height: 1.4; min-width: 210px;">
          <div style="font-weight: 700; color: ${markerColor}; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>${inc.id}</span>
            <span style="font-size: 10px; background: #EEE; padding: 1px 4px; border-radius: 2px;">${inc.severity}</span>
          </div>
          <div style="font-weight: 600; color: #1A202C;">${inc.user.name} (${inc.user.phone})</div>
          <div style="color: #4A5568; margin-top: 2px;">${inc.location.name}</div>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0; font-family: monospace; font-size: 11px;">
            <div>Dev: ${inc.wearable.deviceId} (${inc.wearable.battery}%)</div>
            <div>AI Verification: <strong>${inc.aiVerification.confidenceScore}% Confirmed</strong></div>
            <div>Assigned: <strong>${inc.dispatch.unitAssigned} (${inc.dispatch.status})</strong></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.layers.incidents);

      if (isCritical) {
        // Draw route line from assigned PCR unit to Critical Incident
        const pcr = data.pcrUnits.find(u => u.id === inc.dispatch.unitAssigned);
        if (pcr) {
          L.polyline([
            [pcr.coords[0], pcr.coords[1]],
            [inc.location.lat, inc.location.lng]
          ], {
            color: "#0F4C81",
            weight: 3,
            dashArray: "6, 6",
            opacity: 0.8
          }).addTo(this.layers.dispatchRoute);
        }
      }
    });
  }

  renderGateways() {
    this.layers.gateways.clearLayers();
    this.layers.meshLines.clearLayers();
    const data = window.RakshakData;
    if (!data || !data.gateways) return;

    data.gateways.forEach(gw => {
      const iconHtml = `
        <div class="map-marker-gateway">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-gw",
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(gw.coords, { icon: customIcon });

      // LoRa Municipal Radio Coverage Radius (800m visual circle)
      L.circle(gw.coords, {
        radius: 750,
        color: "#2E7D32",
        weight: 1,
        fillColor: "#2E7D32",
        fillOpacity: 0.04,
        dashArray: "4, 4"
      }).addTo(this.layers.gateways);

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 11px;">
          <strong style="color: #2E7D32;">${gw.id}: ${gw.name}</strong><br/>
          <span style="color: #4A5568;">${gw.ward} (${gw.poleRef})</span><br/>
          <div style="margin-top: 4px; font-family: monospace; font-size: 10.5px;">
            Load: ${gw.currentLoadPktsPerMin} pkts/min | SNR: ${gw.snr} dB<br/>
            Freq: ${gw.frequency} | Uptime: ${gw.uptimePercentage}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.layers.gateways);

      // Draw mesh link lines to peers
      if (this.options.showMeshLines && gw.meshPeers) {
        gw.meshPeers.forEach(peerId => {
          const peer = data.gateways.find(g => g.id === peerId);
          if (peer && gw.id < peer.id) { // Avoid duplicate lines
            L.polyline([gw.coords, peer.coords], {
              color: "#68D391",
              weight: 1.5,
              opacity: 0.75,
              dashArray: "2, 4"
            }).addTo(this.layers.meshLines);
          }
        });
      }
    });
  }

  renderPCRUnits() {
    this.layers.pcrUnits.clearLayers();
    const data = window.RakshakData;
    if (!data || !data.pcrUnits) return;

    data.pcrUnits.forEach(pcr => {
      const isEnRoute = pcr.status === "EN_ROUTE";
      const bgColor = isEnRoute ? "#0F4C81" : "#4A5568";

      const iconHtml = `
        <div class="map-marker-pcr" style="background-color: ${bgColor};">
          ${pcr.id.replace('PCR-', 'P')}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-pcr",
        iconSize: [28, 22],
        iconAnchor: [14, 11]
      });

      const marker = L.marker(pcr.coords, { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 11px;">
          <strong style="color: #0F4C81;">${pcr.id} (${pcr.callsign})</strong><br/>
          <span>${pcr.vehicleType} | Reg: ${pcr.registration}</span><br/>
          <span style="color: #4A5568;">In Charge: ${pcr.officer}</span><br/>
          <div style="margin-top: 4px; font-family: monospace; font-size: 10.5px;">
            Status: <strong>${pcr.status}</strong> | Speed: ${pcr.speedKmph} km/h<br/>
            Station: ${pcr.station}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.layers.pcrUnits);
    });
  }

  renderCameras() {
    this.layers.cameras.clearLayers();
    const data = window.RakshakData;
    if (!data || !data.cctvCameras) return;

    data.cctvCameras.forEach(cam => {
      const iconHtml = `
        <div class="map-marker-camera">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-cam",
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(cam.coords, { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 11px;">
          <strong>${cam.id}: ${cam.name}</strong><br/>
          <span>Pole: ${cam.poleId} | Ward: ${cam.ward}</span><br/>
          <div style="margin-top: 4px; font-family: monospace; font-size: 10.5px;">
            Stream: ${cam.resolution}<br/>
            Optical Flow Anomaly: <strong>${cam.opticalFlowAnomalyScore}%</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.layers.cameras);
    });
  }

  focusOnIncident(incidentId) {
    const data = window.RakshakData;
    const inc = data.incidents.find(i => i.id === incidentId);
    if (!inc || !this.map) return;

    this.map.flyTo([inc.location.lat, inc.location.lng], 16, {
      duration: 1.2
    });
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
}

window.RakshakMapEngine = RakshakMapEngine;
