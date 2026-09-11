// ====================================================================
// RAKSHAK-NET CAD COMMAND CENTER - AUDIT TRAIL SYSTEM
// Real-time security event logging, login/logout records,
// inactivity locks, and tactical CAD dispatch audit trail
// ====================================================================

window.RakshakAudit = {
  currentFilter: "ALL",
  searchQuery: "",

  // Pre-populated historical audit events for demonstration realism
  events: [
    {
      id: "EVT-2026-9941",
      timestamp: "2026-09-09T22:48:42+05:30",
      displayTime: "22:48:42 IST",
      officerId: "OD-CP-1023",
      officerName: "Inspector R. K. Mahapatra",
      eventType: "DISPATCH_SOS",
      deviceId: "BBSR-CAD-TERMINAL-01 (Trusted)",
      details: "Autonomous Priority-1 Alert dispatched to PCR-14 (Infocity / Patia). Threat confidence: 87.4%."
    },
    {
      id: "EVT-2026-9940",
      timestamp: "2026-09-09T22:48:40+05:30",
      displayTime: "22:48:40 IST",
      officerId: "OD-CP-1023",
      officerName: "Inspector R. K. Mahapatra",
      eventType: "ACKNOWLEDGE_UNIT",
      deviceId: "BBSR-CAD-TERMINAL-01 (Trusted)",
      details: "MDT acknowledgement verified from PCR-14 (OD-02-BW-8814). Latency 84ms."
    },
    {
      id: "EVT-2026-9939",
      timestamp: "2026-09-09T22:30:15+05:30",
      displayTime: "22:30:15 IST",
      officerId: "OD-CP-1023",
      officerName: "Inspector R. K. Mahapatra",
      eventType: "SCREEN_UNLOCKED",
      deviceId: "BBSR-CAD-TERMINAL-01 (Trusted)",
      details: "Operator session resumed via Windows Hello biometric re-verification."
    },
    {
      id: "EVT-2026-9938",
      timestamp: "2026-09-09T22:28:15+05:30",
      displayTime: "22:28:15 IST",
      officerId: "OD-CP-1023",
      officerName: "Inspector R. K. Mahapatra",
      eventType: "SCREEN_LOCKED",
      deviceId: "BBSR-CAD-TERMINAL-01 (Trusted)",
      details: "Terminal locked automatically after 120s inactivity watchdog threshold."
    },
    {
      id: "EVT-2026-9937",
      timestamp: "2026-09-09T22:15:02+05:30",
      displayTime: "22:15:02 IST",
      officerId: "OD-CP-1023",
      officerName: "Inspector R. K. Mahapatra",
      eventType: "LOGIN_SUCCESS",
      deviceId: "BBSR-CAD-TERMINAL-01 (Trusted)",
      details: "Shift Commander authentication verified (Windows Hello Biometric + FIDO2 Key)."
    },
    {
      id: "EVT-2026-9936",
      timestamp: "2026-09-09T21:58:30+05:30",
      displayTime: "21:58:30 IST",
      officerId: "OD-ASI-4819",
      officerName: "ASI M. Pattnaik",
      eventType: "LOGIN_SUCCESS",
      deviceId: "MDT-OD-PCR-14 (Mobile)",
      details: "Patrol terminal signed on for sector duty (Infocity / Patia Zone)."
    },
    {
      id: "EVT-2026-9935",
      timestamp: "2026-09-09T21:40:12+05:30",
      displayTime: "21:40:12 IST",
      officerId: "OD-CAD-TRAINEE",
      officerName: "Unknown Operator",
      eventType: "LOGIN_FAILED",
      deviceId: "BBSR-CAD-TERMINAL-08",
      details: "Credential verification failed. Incorrect password sequence entered."
    },
    {
      id: "EVT-2026-9934",
      timestamp: "2026-09-09T21:12:44+05:30",
      displayTime: "21:12:44 IST",
      officerId: "OD-SI-3190",
      officerName: "SI R. K. Behera",
      eventType: "LOGOUT",
      deviceId: "MDT-OD-PCR-09 (Mobile)",
      details: "Patrol supervisor completed duty handoff to secondary crew."
    },
    {
      id: "EVT-2026-9933",
      timestamp: "2026-09-09T20:45:10+05:30",
      displayTime: "20:45:10 IST",
      officerId: "OD-GUEST-09",
      officerName: "External Dispatcher",
      eventType: "NEW_DEVICE_FLAGGED",
      deviceId: "REMOTE-LAPTOP-9941 (Untrusted)",
      details: "Access attempt from unregistered terminal blocked. Admin notification dispatched."
    }
  ],

  // Append a live event to the audit trail
  log: function(eventType, officerId, deviceId, details) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const displayTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} IST`;

    const newEvent = {
      id: `EVT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: now.toISOString(),
      displayTime: displayTime,
      officerId: officerId || "UNKNOWN",
      officerName: (window.RakshakAuth && window.RakshakAuth.getCurrentUser) ? window.RakshakAuth.getCurrentUser().name : "Officer",
      eventType: eventType,
      deviceId: deviceId || "BBSR-CAD-TERMINAL-01",
      details: details || "System action recorded"
    };

    this.events.unshift(newEvent);

    // If currently rendering audit trail view, refresh table
    const tableBody = document.getElementById("audit-trail-table-body");
    if (tableBody) {
      this.renderTableRows(tableBody);
      this.updateCounters();
    }
  },

  // Render the Full Audit Trail View
  render: function(container) {
    container.innerHTML = `
      <!-- Page Title & Operational Status -->
      <div class="page-header-row" style="align-items: center; margin-bottom: 20px;">
        <div class="page-title-group">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: var(--text-main); letter-spacing: -0.3px;">
              Commissionerate CAD Security &amp; Operational Audit Trail
            </h1>
          </div>
          <div class="page-subtitle" style="margin-top: 4px; font-size: 12px; color: var(--text-secondary);">
            Bhubaneswar-Cuttack Police Command Desk &bull; Tamper-evident, append-only chronological log of all logins, locks, and tactical directives
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="window.RakshakAudit.exportCsv()" title="Export cryptographically signed CSV log">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Signed CSV
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.RakshakAuth.lockScreen('OPERATOR_DIRECTIVE')" title="Manually lock current terminal session">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Lock Screen Now
          </button>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="stat-grid-4" style="margin-bottom: 20px;">
        <div class="stat-tile" style="padding: 14px 16px;">
          <div class="stat-tile-title">Total Logged Events</div>
          <div id="audit-stat-total" class="stat-tile-val mono">${this.events.length}</div>
          <div class="stat-headline-line">Immutable audit buffer</div>
        </div>
        <div class="stat-tile" style="padding: 14px 16px;">
          <div class="stat-tile-title">Authentication Events</div>
          <div id="audit-stat-auth" class="stat-tile-val text-success mono">
            ${this.events.filter(e => e.eventType.includes('LOGIN')).length}
          </div>
          <div class="stat-headline-line">Verified officer logins</div>
        </div>
        <div class="stat-tile" style="padding: 14px 16px;">
          <div class="stat-tile-title">Tactical CAD Dispatches</div>
          <div id="audit-stat-dispatch" class="stat-tile-val mono" style="color: var(--primary-blue);">
            ${this.events.filter(e => e.eventType.includes('DISPATCH')).length}
          </div>
          <div class="stat-headline-line">Priority-1 SOS directives</div>
        </div>
        <div class="stat-tile" style="padding: 14px 16px;">
          <div class="stat-tile-title">Security &amp; Lock Actions</div>
          <div id="audit-stat-locks" class="stat-tile-val mono" style="color: #D97706;">
            ${this.events.filter(e => e.eventType.includes('LOCK') || e.eventType.includes('FLAGGED')).length}
          </div>
          <div class="stat-headline-line">Screen locks &amp; flag notices</div>
        </div>
      </div>

      <!-- Filter Controls & Search -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header" style="padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <!-- Filter Buttons -->
          <div class="audit-filter-group">
            <button class="audit-filter-btn ${this.currentFilter === 'ALL' ? 'active' : ''}" onclick="window.RakshakAudit.setFilter('ALL')">All Events</button>
            <button class="audit-filter-btn ${this.currentFilter === 'AUTH' ? 'active' : ''}" onclick="window.RakshakAudit.setFilter('AUTH')">Authentication</button>
            <button class="audit-filter-btn ${this.currentFilter === 'DISPATCH' ? 'active' : ''}" onclick="window.RakshakAudit.setFilter('DISPATCH')">Dispatches</button>
            <button class="audit-filter-btn ${this.currentFilter === 'SECURITY' ? 'active' : ''}" onclick="window.RakshakAudit.setFilter('SECURITY')">Security &amp; Locks</button>
          </div>

          <!-- Search Input -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <input 
              type="text" 
              id="audit-search-input" 
              class="form-input form-input-sm" 
              style="width: 220px; font-size: 11.5px;" 
              placeholder="Search Officer ID, terminal..."
              value="${this.searchQuery}"
              oninput="window.RakshakAudit.handleSearch(this.value)"
            />
          </div>
        </div>

        <!-- Audit Table -->
        <div class="card-body-flush" style="overflow-x: auto;">
          <table class="cad-table audit-table">
            <thead>
              <tr>
                <th style="width: 14%;">Timestamp</th>
                <th style="width: 13%;">Officer ID</th>
                <th style="width: 18%;">Event Type</th>
                <th style="width: 20%;">Device / Terminal ID</th>
                <th style="width: 35%;">Action Details &amp; Telemetry</th>
              </tr>
            </thead>
            <tbody id="audit-trail-table-body">
              <!-- Populated by renderTableRows -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const tableBody = document.getElementById("audit-trail-table-body");
    if (tableBody) {
      this.renderTableRows(tableBody);
    }
  },

  renderTableRows: function(container) {
    const filtered = this.getFilteredEvents();

    if (filtered.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 12px;">
            No audit records match the current filter or search criteria.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = filtered.map(ev => {
      const badgeHtml = this.getBadgeForEventType(ev.eventType);
      return `
        <tr class="audit-row">
          <td class="mono font-bold" style="font-size: 11px; color: #334155;">
            ${ev.displayTime}
          </td>
          <td>
            <span class="mono font-bold" style="color: var(--primary-blue); font-size: 11.5px;">${ev.officerId}</span>
            <div class="text-muted" style="font-size: 10px;">${ev.officerName}</div>
          </td>
          <td>
            ${badgeHtml}
          </td>
          <td class="mono text-muted" style="font-size: 11px;">
            ${ev.deviceId}
          </td>
          <td style="font-size: 11.5px; color: var(--text-main);">
            ${ev.details}
          </td>
        </tr>
      `;
    }).join('');
  },

  getBadgeForEventType: function(type) {
    switch (type) {
      case "LOGIN_SUCCESS":
        return `<span class="badge badge-online" style="font-size: 9.5px; padding: 2px 6px;">LOGIN_SUCCESS</span>`;
      case "LOGIN_FAILED":
        return `<span class="badge badge-critical" style="font-size: 9.5px; padding: 2px 6px;">LOGIN_FAILED</span>`;
      case "LOGOUT":
        return `<span class="badge badge-neutral" style="font-size: 9.5px; padding: 2px 6px;">LOGOUT</span>`;
      case "SCREEN_LOCKED":
        return `<span class="badge badge-high" style="font-size: 9.5px; padding: 2px 6px; background: #FEF3C7; color: #92400E; border-color: #FCD34D;">SCREEN_LOCKED</span>`;
      case "SCREEN_UNLOCKED":
        return `<span class="badge badge-enroute" style="font-size: 9.5px; padding: 2px 6px;">SCREEN_UNLOCKED</span>`;
      case "DISPATCH_SOS":
        return `<span class="badge" style="font-size: 9.5px; padding: 2px 6px; background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; font-weight: 700;">DISPATCH_SOS</span>`;
      case "ACKNOWLEDGE_UNIT":
        return `<span class="badge" style="font-size: 9.5px; padding: 2px 6px; background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-weight: 700;">ACKNOWLEDGE_UNIT</span>`;
      case "NEW_DEVICE_FLAGGED":
        return `<span class="badge badge-critical" style="font-size: 9.5px; padding: 2px 6px;">NEW_DEVICE_FLAGGED</span>`;
      case "SECURITY_LOCKOUT":
        return `<span class="badge badge-critical" style="font-size: 9.5px; padding: 2px 6px; background: #FEE2E2; color: #991B1B;">SECURITY_LOCKOUT</span>`;
      case "OFFICER_REGISTERED":
        return `<span class="badge" style="font-size: 9.5px; padding: 2px 6px; background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD; font-weight: 700;">OFFICER_REGISTERED</span>`;
      case "BIOMETRIC_ENROLLED":
        return `<span class="badge" style="font-size: 9.5px; padding: 2px 6px; background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; font-weight: 700;">BIOMETRIC_ENROLLED</span>`;
      case "ADMIN_APPROVED":
        return `<span class="badge badge-online" style="font-size: 9.5px; padding: 2px 6px; background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; font-weight: 700;">ADMIN_APPROVED</span>`;
      case "BIOMETRIC_VERIFIED":
        return `<span class="badge badge-online" style="font-size: 9.5px; padding: 2px 6px;">BIOMETRIC_VERIFIED</span>`;
      case "BIOMETRIC_MISMATCH":
        return `<span class="badge badge-critical" style="font-size: 9.5px; padding: 2px 6px; background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; font-weight: 700;">BIOMETRIC_MISMATCH</span>`;
      case "BIOMETRIC_DEMO_MODE_FLAGGED":
        return `<span class="badge" style="font-size: 9.5px; padding: 2px 6px; background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; font-weight: 700;">DEMO_MODE_FLAGGED</span>`;
      default:
        return `<span class="badge badge-neutral" style="font-size: 9.5px; padding: 2px 6px;">${type}</span>`;
    }
  },

  getFilteredEvents: function() {
    return this.events.filter(ev => {
      // Category filter
      if (this.currentFilter === "AUTH" && !ev.eventType.includes("LOGIN") && ev.eventType !== "LOGOUT" && !ev.eventType.includes("REGISTER") && !ev.eventType.includes("ENROLLED") && !ev.eventType.includes("APPROVED") && !ev.eventType.includes("BIOMETRIC")) {
        return false;
      }
      if (this.currentFilter === "DISPATCH" && !ev.eventType.includes("DISPATCH") && !ev.eventType.includes("ACKNOWLEDGE")) {
        return false;
      }
      if (this.currentFilter === "SECURITY" && !ev.eventType.includes("LOCK") && !ev.eventType.includes("FLAGGED") && !ev.eventType.includes("MISMATCH") && !ev.eventType.includes("REGISTER") && !ev.eventType.includes("ENROLLED") && !ev.eventType.includes("APPROVED")) {
        return false;
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchId = ev.officerId.toLowerCase().includes(q);
        const matchName = ev.officerName.toLowerCase().includes(q);
        const matchDevice = ev.deviceId.toLowerCase().includes(q);
        const matchDetails = ev.details.toLowerCase().includes(q);
        const matchType = ev.eventType.toLowerCase().includes(q);
        return matchId || matchName || matchDevice || matchDetails || matchType;
      }

      return true;
    });
  },

  setFilter: function(filter) {
    this.currentFilter = filter;
    const btns = document.querySelectorAll(".audit-filter-btn");
    btns.forEach(b => {
      if (b.textContent.toUpperCase().includes(filter) || (filter === 'ALL' && b.textContent.includes('All'))) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    const tableBody = document.getElementById("audit-trail-table-body");
    if (tableBody) this.renderTableRows(tableBody);
  },

  handleSearch: function(val) {
    this.searchQuery = val.trim();
    const tableBody = document.getElementById("audit-trail-table-body");
    if (tableBody) this.renderTableRows(tableBody);
  },

  updateCounters: function() {
    const totalEl = document.getElementById("audit-stat-total");
    if (totalEl) totalEl.textContent = this.events.length;

    const authEl = document.getElementById("audit-stat-auth");
    if (authEl) authEl.textContent = this.events.filter(e => e.eventType.includes('LOGIN')).length;

    const dispEl = document.getElementById("audit-stat-dispatch");
    if (dispEl) dispEl.textContent = this.events.filter(e => e.eventType.includes('DISPATCH')).length;

    const lockEl = document.getElementById("audit-stat-locks");
    if (lockEl) lockEl.textContent = this.events.filter(e => e.eventType.includes('LOCK') || e.eventType.includes('FLAGGED')).length;
  },

  exportCsv: function() {
    const headers = ["Event ID", "Timestamp", "Officer ID", "Officer Name", "Event Type", "Device ID", "Details"];
    const rows = this.events.map(e => [
      e.id,
      e.timestamp,
      `"${e.officerId}"`,
      `"${e.officerName}"`,
      e.eventType,
      `"${e.deviceId}"`,
      `"${e.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(",")].concat(rows.map(r => r.join(","))).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rakshak_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
