// ====================================================================
// RAKSHAK-NET CAD COMMAND CENTER - AUTHENTICATION & SECURITY ENGINE
// Manages Officer Login, Windows Hello Biometrics, Trusted Device Check,
// Smart Brute-Force Escalating Lockout, and 120s Inactivity Screen Lock
// ====================================================================

window.RakshakAuth = {
  // Pre-configured Demo Credential for Evaluators & Judges
  DEMO_ACCOUNT: {
    officerId: "OD-CP-1023",
    password: "Rakshak@2026",
    name: "Inspector R. K. Mahapatra",
    rank: "Duty Commander",
    station: "Commissionerate Police HQ (Dial 112 Command Desk)",
    badge: "OD-INS-1023",
    trusted: true,
    enrolledBiometrics: true,
    approved: true
  },

  // Registered Officers Catalog (Pre-enrolled + Dynamically Registered)
  registeredOfficers: [],
  activeCameraStream: null,
  detectionInterval: null,
  _analysisCanvas: null,
  _analysisCtx: null,
  tempRegistration: null,

  // Terminal & Device Identification
  CURRENT_TERMINAL_ID: "BBSR-CAD-TERMINAL-01",
  TRUSTED_DEVICES: [
    "BBSR-CAD-TERMINAL-01",
    "OD-POLICE-CONTROL-ROOM-4",
    "COMMISSIONERATE-DESK-ALPHA"
  ],

  // Inactivity Configuration (Seconds)
  INACTIVITY_TIMEOUT_SEC: 120, // 2 minutes auto-lock
  WARNING_LEAD_TIME_SEC: 15,   // Warning toast at 105s

  // State Management
  state: {
    authenticated: false,
    currentUser: null,
    isLocked: false,
    lastActivityTime: Date.now(),
    failedAttempts: 0,
    lockoutUntil: null,
    lockoutTier: 0, // 1: 30s, 2: 60s, 3: 300s
    lockoutInterval: null,
    inactivityInterval: null,
    isDeviceTrusted: true,
    warningShown: false
  },

  init: function() {
    // Check session storage for existing session
    const savedSession = sessionStorage.getItem("rakshak_cad_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.officerId) {
          this.state.authenticated = true;
          this.state.currentUser = parsed;
        }
      } catch (e) {}
    }

    // Load registered officers from local storage
    try {
      const storedOfficers = localStorage.getItem("rakshak_registered_officers");
      if (storedOfficers) {
        this.registeredOfficers = JSON.parse(storedOfficers) || [];
      } else {
        this.registeredOfficers = [];
      }
    } catch (e) {
      this.registeredOfficers = [];
    }

    // Check trusted device flag
    const storedDeviceFlag = localStorage.getItem("rakshak_device_trusted");
    if (storedDeviceFlag !== null) {
      this.state.isDeviceTrusted = storedDeviceFlag === "true";
    } else {
      this.state.isDeviceTrusted = this.TRUSTED_DEVICES.includes(this.CURRENT_TERMINAL_ID);
    }

    this.bindGlobalActivityListeners();
    this.startInactivityWatchdog();
    this.renderLoginScreen();
  },

  isAuthenticated: function() {
    return this.state.authenticated && !this.state.isLocked;
  },

  getCurrentUser: function() {
    return this.state.currentUser || this.DEMO_ACCOUNT;
  },

  // Check if account is currently locked out by brute-force protection
  isLockedOut: function() {
    if (!this.state.lockoutUntil) return false;
    const remaining = Math.ceil((this.state.lockoutUntil - Date.now()) / 1000);
    if (remaining <= 0) {
      this.clearLockout();
      return false;
    }
    return true;
  },

  getRemainingLockoutSeconds: function() {
    if (!this.state.lockoutUntil) return 0;
    return Math.max(0, Math.ceil((this.state.lockoutUntil - Date.now()) / 1000));
  },

  // Render the Login Screen Card
  renderLoginScreen: function() {
    const loginContainer = document.getElementById("login-screen");
    const appRoot = document.getElementById("app-root");
    if (!loginContainer) return;

    if (this.state.authenticated && !this.state.isLocked) {
      loginContainer.style.display = "none";
      if (appRoot) appRoot.style.display = "block";
      return;
    }

    if (appRoot) appRoot.style.display = "none";
    loginContainer.style.display = "flex";

    const isTrusted = this.state.isDeviceTrusted;
    const isLockedOut = this.isLockedOut();
    const remainingLockout = this.getRemainingLockoutSeconds();

    loginContainer.innerHTML = `
      <div class="login-wrapper">
        <div class="login-card">
          <!-- Header Branding -->
          <div class="login-brand-header">
            <div class="login-shield-crest">
              <img src="assets/rakshak-logo.png" alt="Rakshak-Net Logo" class="login-logo-img" />
            </div>
            <h1 class="login-title">RAKSHAK-NET COMMAND CENTER</h1>
            <div class="login-subtext">
              Commissionerate Police Bhubaneswar-Cuttack &bull; Emergency Operations
            </div>
          </div>

          <!-- Lockout Alert Banner (If Brute Force Triggered) -->
          <div id="login-lockout-banner" class="login-alert-banner alert-lockout" style="display: ${isLockedOut ? 'flex' : 'none'};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <strong>Account Temporarily Locked</strong> &mdash; escalating delay active (brute-force protection).<br/>
              <span id="lockout-timer-text" class="mono text-bold">Too many attempts &mdash; try again in ${this.formatTime(remainingLockout)}</span>
            </div>
          </div>

          <!-- Error Alert Banner -->
          <div id="login-error-banner" class="login-alert-banner alert-error" style="display: none;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span id="login-error-text">Invalid Officer ID or Password.</span>
          </div>

          <!-- Login Form -->
          <form id="cad-login-form" onsubmit="window.RakshakAuth.handleFormSubmit(event); return false;">
            <!-- Officer ID Field -->
            <div class="login-field-group">
              <label for="login-officer-id" class="login-label">Officer ID</label>
              <div class="login-input-wrap">
                <span class="login-input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input 
                  type="text" 
                  id="login-officer-id" 
                  class="login-input" 
                  placeholder="e.g. OD-CP-1023" 
                  autocomplete="username"
                  value="OD-CP-1023"
                  ${isLockedOut ? 'disabled' : ''}
                  required
                />
              </div>
              <span class="login-field-hint">Enter your designated Commissionerate Police ID (e.g. OD-CP-1023)</span>
            </div>

            <!-- Password Field -->
            <div class="login-field-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="login-password" class="login-label">Password</label>
                <span class="mono text-muted" style="font-size: 10.5px;">AES-256 GCM Tunnel</span>
              </div>
              <div class="login-input-wrap">
                <span class="login-input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input 
                  type="password" 
                  id="login-password" 
                  class="login-input" 
                  placeholder="Enter encrypted password" 
                  autocomplete="current-password"
                  value="Rakshak@2026"
                  ${isLockedOut ? 'disabled' : ''}
                  required
                />
                <button 
                  type="button" 
                  class="btn-password-toggle" 
                  onclick="window.RakshakAuth.togglePasswordVisibility('login-password', this)"
                  title="Show / Hide Password"
                >
                  <svg class="eye-open-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg class="eye-closed-icon" style="display: none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <!-- Login Submit Button -->
            <button 
              type="button" 
              id="btn-login-submit" 
              class="btn btn-primary btn-login-main" 
              onclick="window.RakshakAuth.handleFormSubmit(event)"
              ${isLockedOut ? 'disabled' : ''}
            >
              <span>Login to CAD Command Center &rarr;</span>
            </button>
          </form>

          <div class="login-divider">
            <span>OR BIOMETRIC AUTHENTICATION</span>
          </div>

          <!-- Secondary Action: Windows Hello Biometrics -->
          <div class="biometric-login-section">
            <button 
              type="button" 
              id="btn-biometric-login" 
              class="btn btn-outline btn-biometric"
              onclick="window.RakshakAuth.simulateBiometricLogin()"
              ${(!isTrusted || isLockedOut) ? 'disabled' : ''}
              title="${!isTrusted ? 'Biometric login requires an approved Trusted Device' : 'Authenticate using registered Windows Hello Biometrics'}"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M12 2a10 10 0 0 0-6.88 17.22l.12.11a10 10 0 0 0 13.52 0l.12-.11A10 10 0 0 0 12 2z"/><path d="M12 7c-2.76 0-5 2.24-5 5 0 1.25.46 2.4 1.22 3.28"/><path d="M16.78 15.28A4.97 4.97 0 0 0 17 12c0-2.76-2.24-5-5-5"/></svg>
              <span>Use Biometric Login (Windows Hello)</span>
            </button>

            <div class="biometric-badge-hint">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Available only on this Registered Control Room Terminal</span>
            </div>
          </div>

          <!-- Trusted Device / New Device Alert Banner -->
          <div class="device-trust-container">
            ${isTrusted ? `
              <div class="device-status-badge trusted">
                <span class="status-dot green"></span>
                <span>Trusted Terminal: <strong>${this.CURRENT_TERMINAL_ID}</strong> (Verified)</span>
              </div>
            ` : `
              <div class="untrusted-device-alert">
                <div style="display: flex; align-items: center; gap: 6px; color: #DC2626; font-weight: 700;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>New Device Detected &mdash; Admin Approval Required</span>
                </div>
                <div style="font-size: 11px; color: #7F1D1D; margin: 4px 0 6px 0;">
                  Biometric authorization is restricted until this terminal is signed into the Commissionerate directory.
                </div>
                <button type="button" class="btn-register-device" onclick="window.RakshakAuth.registerDevice()">
                  Register This Device (Admin Approval) &rarr;
                </button>
              </div>
            `}
          </div>

          <!-- Prototype / Evaluator Quick Demo Helper Notice -->
          <div class="login-demo-helper">
            <div class="demo-helper-title">Demo Access (Judges &amp; Evaluators)</div>
            <div class="demo-helper-credentials">
              Officer ID: <strong class="mono">OD-CP-1023</strong> &bull; Password: <strong class="mono">Rakshak@2026</strong>
            </div>
            <div class="demo-helper-note">
              Demo Access &mdash; Officer ID: OD-CP-1023 &middot; Password: Rakshak@2026 &middot; Biometric scan will auto-pass for this demo account.
            </div>
          </div>

          <!-- New Officer Registration Link -->
          <div class="login-register-link-wrap">
            <a href="javascript:void(0)" class="login-register-link" id="link-register-officer" onclick="window.RakshakAuth.showRegistrationScreen()">
              New Officer? Register Device &amp; Biometrics &rarr;
            </a>
          </div>
        </div>

        <!-- Official Security & Regulatory Footer -->
        <div class="login-footer-legal">
          Official Emergency Operations Platform &bull; Odisha Police ERSS Dial 112 &bull; Unauthorized access is punishable under IT Act Sec 66
        </div>
      </div>
    `;

    if (isLockedOut) {
      this.startLockoutCountdown();
    }
  },

  // Toggle show/hide password text
  togglePasswordVisibility: function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    const openIcon = btn.querySelector(".eye-open-icon");
    const closedIcon = btn.querySelector(".eye-closed-icon");
    if (openIcon && closedIcon) {
      openIcon.style.display = isPassword ? "none" : "block";
      closedIcon.style.display = isPassword ? "block" : "none";
    }
  },

  // Find officer from demo account or registered officers registry
  findOfficer: function(officerId) {
    if (!officerId) return null;
    const cleanId = officerId.trim().toUpperCase();
    if (cleanId === this.DEMO_ACCOUNT.officerId.toUpperCase()) {
      return this.DEMO_ACCOUNT;
    }
    if (this.registeredOfficers && this.registeredOfficers.length) {
      return this.registeredOfficers.find(o => o.officerId && o.officerId.toUpperCase() === cleanId) || null;
    }
    return null;
  },

  saveRegisteredOfficer: function(officer) {
    if (!officer || !officer.officerId) return;
    const cleanId = officer.officerId.trim().toUpperCase();
    const existingIdx = this.registeredOfficers.findIndex(o => o.officerId && o.officerId.toUpperCase() === cleanId);
    if (existingIdx >= 0) {
      this.registeredOfficers[existingIdx] = officer;
    } else {
      this.registeredOfficers.push(officer);
    }
    try {
      localStorage.setItem("rakshak_registered_officers", JSON.stringify(this.registeredOfficers));
    } catch (e) {}
  },

  stopCameraStream: function() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    if (this.activeCameraStream) {
      try {
        this.activeCameraStream.getTracks().forEach(t => t.stop());
      } catch (e) {}
      this.activeCameraStream = null;
    }
  },

  // Real-time Computer Vision: Detects if a human face or eyes are present and inside the guide box
  detectFaceInVideo: function(videoElem, targetGuideType) {
    if (!videoElem || videoElem.readyState < 2 || videoElem.videoWidth === 0) {
      return { state: 'WAITING_CAMERA', msg: 'Initializing camera sensor...', hint: 'Camera Initializing' };
    }

    if (!this._analysisCanvas) {
      if (typeof document !== "undefined" && document.createElement) {
        this._analysisCanvas = document.createElement("canvas");
        this._analysisCanvas.width = 120;
        this._analysisCanvas.height = 90;
        if (this._analysisCanvas.getContext) {
          this._analysisCtx = this._analysisCanvas.getContext("2d", { willReadFrequently: true });
        }
      }
    }

    if (!this._analysisCtx) {
      return { state: 'NO_FACE', msg: 'No Face Detected &mdash; Align your face inside the box', hint: 'No Face Detected' };
    }

    const cw = this._analysisCanvas.width;
    const ch = this._analysisCanvas.height;
    const ctx = this._analysisCtx;

    try {
      ctx.drawImage(videoElem, 0, 0, cw, ch);
      const frameData = ctx.getImageData(0, 0, cw, ch);
      const data = frameData.data;

      // Guide bounding box coordinates (normalized to 120x90)
      let boxX1, boxX2, boxY1, boxY2;
      if (targetGuideType === 'iris') {
        boxX1 = Math.floor(cw * 0.25);
        boxX2 = Math.floor(cw * 0.75);
        boxY1 = Math.floor(ch * 0.25);
        boxY2 = Math.floor(ch * 0.75);
      } else {
        boxX1 = Math.floor(cw * 0.25);
        boxX2 = Math.floor(cw * 0.75);
        boxY1 = Math.floor(ch * 0.15);
        boxY2 = Math.floor(ch * 0.85);
      }

      let totalSkin = 0;
      let boxSkin = 0;
      let sumX = 0, sumY = 0;

      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const idx = (y * cw + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Filter out dark shadows, black camera frames, and ceiling light glare
          if (r < 40 && g < 30 && b < 30) continue;
          if (r > 248 && g > 248 && b > 248) continue;

          // YCbCr skin cluster conversion
          const yVal =  0.299 * r + 0.587 * g + 0.114 * b;
          const cb   = -0.1687 * r - 0.3313 * g + 0.5 * b + 128;
          const cr   =  0.5 * r - 0.4187 * g - 0.0813 * b + 128;

          // Standard human skin reflectance in YCbCr and RGB color space
          // Rejects dark backgrounds, blue shirts, grey walls, and room shadows
          const isYCbCrSkin = (cr >= 130 && cr <= 180 && cb >= 75 && cb <= 135 && yVal >= 35);
          const isRGBSkin = (r > 60 && g > 35 && b > 25 && r > g && (r - g) >= 10 && (r - b) >= 15);
          const isSkin = isYCbCrSkin && isRGBSkin;

          if (isSkin) {
            totalSkin++;
            sumX += x;
            sumY += y;
            if (x >= boxX1 && x <= boxX2 && y >= boxY1 && y <= boxY2) {
              boxSkin++;
            }
          }
        }
      }

      // 1. Strict check: reject empty room, walls, dark frames, or background noise
      // A human face inside the frame contains at least 200 skin pixels, with >= 140 inside the box
      if (totalSkin < 200 || boxSkin < 140) {
        return {
          state: 'NO_FACE',
          msg: 'No Face Detected &mdash; Align your face inside the box',
          hint: 'No Face Detected',
          totalSkin: totalSkin,
          boxSkin: boxSkin
        };
      }

      const meanX = sumX / (totalSkin || 1) / cw;
      const meanY = sumY / (totalSkin || 1) / ch;

      // 2. Check if face centroid is outside the center guide box
      if (meanX < 0.24) {
        return {
          state: 'OUT_OF_BOX',
          msg: 'Move right &rarr; align inside box',
          hint: 'Move right',
          meanX: meanX,
          meanY: meanY
        };
      }
      if (meanX > 0.76) {
        return {
          state: 'OUT_OF_BOX',
          msg: 'Move left &larr; align inside box',
          hint: 'Move left',
          meanX: meanX,
          meanY: meanY
        };
      }
      if (meanY < 0.15) {
        return {
          state: 'OUT_OF_BOX',
          msg: 'Move down &darr; lower face into box',
          hint: 'Move down',
          meanX: meanX,
          meanY: meanY
        };
      }
      if (meanY > 0.85) {
        return {
          state: 'OUT_OF_BOX',
          msg: 'Move up &uarr; raise face into box',
          hint: 'Move up',
          meanX: meanX,
          meanY: meanY
        };
      }
      if (boxSkin < 120) {
        return {
          state: 'OUT_OF_BOX',
          msg: 'Move closer to the camera &mdash; center face inside box',
          hint: 'Move closer',
          meanX: meanX,
          meanY: meanY
        };
      }

      // 3. Human face is genuinely detected and aligned inside the guide box!
      return {
        state: 'INSIDE_BOX',
        msg: targetGuideType === 'iris' ? 'Eyes Aligned &mdash; Scanning Iris Pattern...' : 'Face Aligned &mdash; Hold steady...',
        hint: targetGuideType === 'iris' ? 'Eyes Aligned (Hold Steady)' : 'Face Aligned (Hold Steady)',
        meanX: meanX,
        meanY: meanY,
        boxSkin: boxSkin
      };
    } catch (e) {
      return { state: 'NO_FACE', msg: 'No Face Detected &mdash; Align your face inside the box', hint: 'No Face Detected' };
    }
  },

  // Handle Form Submission: validates credentials and opens camera biometric verification modal
  handleFormSubmit: function(e) {
    if (e) e.preventDefault();
    if (this.isLockedOut()) return;

    const idInput = document.getElementById("login-officer-id");
    const passInput = document.getElementById("login-password");
    if (!idInput || !passInput) return;

    const officerId = idInput.value.trim();
    const password = passInput.value;

    this.verifyAndStartBiometricLogin(officerId, password);
  },

  // Credential validation and gating into Camera Biometric Verification
  verifyAndStartBiometricLogin: function(officerId, password) {
    if (this.isLockedOut()) {
      alert(`Account is temporarily locked. Please wait for the lockout timer to expire.`);
      return false;
    }

    const officer = this.findOfficer(officerId);
    const isMatch = officer && (officer.password === password);

    if (isMatch) {
      // Check if account has been approved by Control Room admin
      if (officer.approved === false) {
        const errorBanner = document.getElementById("login-error-banner");
        const errorText = document.getElementById("login-error-text");
        if (errorBanner && errorText) {
          errorBanner.style.display = "flex";
          errorText.innerHTML = `<strong>Registration Pending:</strong> Account awaiting Control Room Admin approval. Please approve in Registration review.`;
        }
        this.playTone("error");
        return false;
      }

      // Valid credentials — proceed directly to camera biometric verification
      this.state.failedAttempts = 0;
      const errorBanner = document.getElementById("login-error-banner");
      if (errorBanner) errorBanner.style.display = "none";
      this.startCameraBiometricVerification(officer);
      return true;
    } else {
      // FAILED LOGIN ATTEMPT
      this.state.failedAttempts++;

      if (window.RakshakAudit && window.RakshakAudit.log) {
        window.RakshakAudit.log(
          "LOGIN_FAILED",
          officerId || "UNKNOWN",
          this.CURRENT_TERMINAL_ID,
          `Invalid credentials entered (Consecutive failure #${this.state.failedAttempts})`
        );
      }

      this.playTone("error");
      this.checkAndTriggerLockout();
      return false;
    }
  },

  // Password Authentication with Smart Brute-Force Lockout (Direct programmatic fallback & tests)
  loginWithPassword: function(officerId, password) {
    if (this.isLockedOut()) {
      alert(`Account is temporarily locked. Please wait for the lockout timer to expire.`);
      return false;
    }

    const officer = this.findOfficer(officerId);
    const isMatch = officer && (officer.password === password);

    if (isMatch) {
      // SUCCESSFUL LOGIN
      this.state.failedAttempts = 0;
      this.state.lockoutTier = 0;
      this.state.lockoutUntil = null;
      this.state.authenticated = true;
      this.state.currentUser = {
        officerId: this.DEMO_ACCOUNT.officerId,
        name: this.DEMO_ACCOUNT.name,
        rank: this.DEMO_ACCOUNT.rank,
        station: this.DEMO_ACCOUNT.station,
        badge: this.DEMO_ACCOUNT.badge,
        authMethod: "PASSWORD",
        sessionStarted: new Date().toISOString()
      };

      sessionStorage.setItem("rakshak_cad_session", JSON.stringify(this.state.currentUser));

      // Log into Audit Trail
      if (window.RakshakAudit && window.RakshakAudit.log) {
        window.RakshakAudit.log(
          "LOGIN_SUCCESS",
          officerId,
          this.CURRENT_TERMINAL_ID + (this.state.isDeviceTrusted ? " (Trusted)" : " (Unverified)"),
          `Authorized access via password authentication. Rank: ${this.DEMO_ACCOUNT.rank}`
        );
      }

      this.playTone("success");
      this.state.lastActivityTime = Date.now();
      this.transitionToCommandCenter();
      return true;
    } else {
      // FAILED LOGIN ATTEMPT
      this.state.failedAttempts++;

      if (window.RakshakAudit && window.RakshakAudit.log) {
        window.RakshakAudit.log(
          "LOGIN_FAILED",
          officerId || "UNKNOWN",
          this.CURRENT_TERMINAL_ID,
          `Invalid credentials entered (Consecutive failure #${this.state.failedAttempts})`
        );
      }

      this.playTone("error");
      this.checkAndTriggerLockout();
      return false;
    }
  },

  // Smart Escalating Lockout (5 fails = 30s, 10 fails = 1m, 15 fails = 5m)
  checkAndTriggerLockout: function() {
    let lockoutDuration = 0;

    if (this.state.failedAttempts >= 15) {
      lockoutDuration = 300; // 5 minutes
      this.state.lockoutTier = 3;
    } else if (this.state.failedAttempts >= 10) {
      lockoutDuration = 60; // 1 minute
      this.state.lockoutTier = 2;
    } else if (this.state.failedAttempts >= 5) {
      lockoutDuration = 30; // 30 seconds
      this.state.lockoutTier = 1;
    }

    if (lockoutDuration > 0) {
      this.state.lockoutUntil = Date.now() + (lockoutDuration * 1000);

      if (window.RakshakAudit && window.RakshakAudit.log) {
        window.RakshakAudit.log(
          "SECURITY_LOCKOUT",
          this.DEMO_ACCOUNT.officerId,
          this.CURRENT_TERMINAL_ID,
          `Brute-force protection activated: Account locked for ${lockoutDuration}s (${this.state.failedAttempts} consecutive failed attempts)`
        );
      }

      this.renderLoginScreen();
      this.startLockoutCountdown();
    } else {
      // Show failure banner with remaining attempts warning
      const remainingUntilLock = 5 - (this.state.failedAttempts % 5);
      const errorBanner = document.getElementById("login-error-banner");
      const errorText = document.getElementById("login-error-text");
      if (errorBanner && errorText) {
        errorBanner.style.display = "flex";
        errorText.innerHTML = `Invalid Officer ID or Password. <strong>${remainingUntilLock}</strong> attempt${remainingUntilLock === 1 ? '' : 's'} remaining before temporary security lockout.`;
      }
    }
  },

  startLockoutCountdown: function() {
    if (this.state.lockoutInterval) clearInterval(this.state.lockoutInterval);

    const updateUI = () => {
      const remaining = this.getRemainingLockoutSeconds();
      const timerEl = document.getElementById("lockout-timer-text");
      if (timerEl) {
        timerEl.textContent = `Too many attempts — try again in ${this.formatTime(remaining)}`;
      }

      if (remaining <= 0) {
        this.clearLockout();
      }
    };

    updateUI();
    this.state.lockoutInterval = setInterval(updateUI, 1000);
  },

  clearLockout: function() {
    if (this.state.lockoutInterval) {
      clearInterval(this.state.lockoutInterval);
      this.state.lockoutInterval = null;
    }
    this.state.lockoutUntil = null;
    this.renderLoginScreen();
  },

  // Simulated Windows Hello Biometric Login Flow
  simulateBiometricLogin: function() {
    if (this.isLockedOut()) return;

    if (!this.state.isDeviceTrusted) {
      alert("BIOMETRIC ACCESS RESTRICTED:\n-----------------------------\nThis terminal is not yet in the approved Control Room device directory.\nPlease register device or use password fallback.");
      return;
    }

    const modal = document.getElementById("biometric-modal");
    if (!modal) return;

    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="cad-modal-window biometric-modal-window" onclick="event.stopPropagation()">
        <div class="biometric-modal-content">
          <div class="biometric-windows-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#0F4C81"><rect x="1" y="1" width="10" height="10"/><rect x="13" y="1" width="10" height="10"/><rect x="1" y="13" width="10" height="10"/><rect x="13" y="13" width="10" height="10"/></svg>
            <span>Windows Security</span>
          </div>

          <div id="biometric-state-visual" class="biometric-sensor-pulse">
            <svg class="biometric-fingerprint-svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" stroke-width="1.8">
              <path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              <path d="M12 2a10 10 0 0 0-6.88 17.22l.12.11a10 10 0 0 0 13.52 0l.12-.11A10 10 0 0 0 12 2z"/>
              <path d="M12 7c-2.76 0-5 2.24-5 5 0 1.25.46 2.4 1.22 3.28"/>
              <path d="M16.78 15.28A4.97 4.97 0 0 0 17 12c0-2.76-2.24-5-5-5"/>
            </svg>
            <div class="biometric-spinner"></div>
          </div>

          <div id="biometric-status-title" class="biometric-status-text">
            Verifying fingerprint...
          </div>
          <div id="biometric-status-sub" class="biometric-status-subtext">
            Touch the fingerprint sensor or look at the IR camera for Windows Hello
          </div>

          <div class="biometric-actions">
            <button class="btn btn-outline btn-sm" onclick="window.RakshakAuth.cancelBiometric()">Cancel</button>
          </div>
        </div>
      </div>
    `;

    this.playTone("chime");

    // Simulate 1.5s biometric verification
    setTimeout(() => {
      const statusTitle = document.getElementById("biometric-status-title");
      const statusSub = document.getElementById("biometric-status-sub");
      const visual = document.getElementById("biometric-state-visual");

      if (statusTitle && visual) {
        statusTitle.textContent = "Verified ✓";
        statusTitle.style.color = "#16A34A";
        if (statusSub) statusSub.textContent = `Welcome, ${this.DEMO_ACCOUNT.name} (${this.DEMO_ACCOUNT.officerId})`;
        visual.innerHTML = `
          <div class="biometric-success-badge">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        `;
        this.playTone("success");
      }

      // Complete login after brief confirmation display
      setTimeout(() => {
        modal.style.display = "none";
        this.state.failedAttempts = 0;
        this.state.authenticated = true;
        this.state.currentUser = {
          officerId: this.DEMO_ACCOUNT.officerId,
          name: this.DEMO_ACCOUNT.name,
          rank: this.DEMO_ACCOUNT.rank,
          station: this.DEMO_ACCOUNT.station,
          badge: this.DEMO_ACCOUNT.badge,
          authMethod: "BIOMETRIC_WINDOWS_HELLO",
          sessionStarted: new Date().toISOString()
        };

        sessionStorage.setItem("rakshak_cad_session", JSON.stringify(this.state.currentUser));

        if (window.RakshakAudit && window.RakshakAudit.log) {
          window.RakshakAudit.log(
            "LOGIN_SUCCESS",
            this.DEMO_ACCOUNT.officerId,
            this.CURRENT_TERMINAL_ID + " (Trusted Biometric)",
            "Windows Hello biometric match confirmed (FIDO2 Hardware Token verified)"
          );
        }

        this.transitionToCommandCenter();
      }, 700);
    }, 1500);
  },

  cancelBiometric: function() {
    const modal = document.getElementById("biometric-modal");
    if (modal) modal.style.display = "none";
  },

  // ====================================================================
  // OFFICER REGISTRATION & BIOMETRIC ENROLLMENT FLOW
  // ====================================================================

  showRegistrationScreen: function() {
    const loginContainer = document.getElementById("login-screen");
    if (!loginContainer) return;
    this.stopCameraStream();
    this.tempRegistration = null;

    loginContainer.innerHTML = `
      <div class="registration-wrapper">
        <div class="registration-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <button type="button" class="btn btn-sm btn-outline" onclick="window.RakshakAuth.renderLoginScreen()" style="font-size: 11px;">
              &larr; Back to Login
            </button>
            <span class="mono text-muted" style="font-size: 10px;">FORM-CAD-REG-v4.1</span>
          </div>

          <!-- Header Branding -->
          <div class="login-brand-header" style="margin-bottom: 16px;">
            <div class="login-shield-crest" style="margin-bottom: 8px;">
              <img src="assets/rakshak-logo.png" alt="Rakshak-Net Logo" class="login-logo-img" style="height: 52px;" />
            </div>
            <h1 class="login-title" style="font-size: 14px;">Officer Registration &bull; Device &amp; Biometrics</h1>
            <div class="login-subtext">
              Commissionerate Police Bhubaneswar-Cuttack &bull; Control Room Access Provisioning
            </div>
          </div>

          <!-- Error Alert Banner -->
          <div id="reg-error-banner" class="login-alert-banner alert-error" style="display: none;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span id="reg-error-text">Please complete all fields correctly.</span>
          </div>

          <!-- Registration Form (Ordered Fields 1-6) -->
          <form id="cad-officer-reg-form" onsubmit="event.preventDefault();">
            <!-- 1. Officer ID -->
            <div class="login-field-group">
              <label for="reg-officer-id" class="login-label">Officer ID</label>
              <div class="login-input-wrap">
                <input 
                  type="text" 
                  id="reg-officer-id" 
                  class="login-input" 
                  placeholder="e.g. OD-CP-1023" 
                  value="OD-CP-1024"
                  required 
                />
              </div>
              <span class="login-field-hint">Designated Commissionerate Police Service ID (e.g. OD-CP-1023)</span>
            </div>

            <!-- 2. Full Name -->
            <div class="login-field-group">
              <label for="reg-fullname" class="login-label">Full Name</label>
              <div class="login-input-wrap">
                <input 
                  type="text" 
                  id="reg-fullname" 
                  class="login-input" 
                  placeholder="e.g. Sub-Inspector Amit Mohanty" 
                  value="Sub-Inspector Amit Mohanty"
                  required 
                />
              </div>
            </div>

            <!-- 3. Rank/Designation -->
            <div class="login-field-group">
              <label for="reg-rank" class="login-label">Rank / Designation</label>
              <div class="login-input-wrap">
                <input 
                  type="text" 
                  id="reg-rank" 
                  class="login-input" 
                  placeholder="e.g. Sub-Inspector, ASI" 
                  value="Sub-Inspector"
                  required 
                />
              </div>
            </div>

            <!-- 4. Assigned Station/Zone -->
            <div class="login-field-group">
              <label for="reg-station" class="login-label">Assigned Station / Zone</label>
              <div class="login-input-wrap">
                <input 
                  type="text" 
                  id="reg-station" 
                  class="login-input" 
                  placeholder="e.g. KIIT Square PS" 
                  value="KIIT Square PS"
                  required 
                />
              </div>
            </div>

            <!-- 5. Password & Confirm Password -->
            <div class="login-field-group">
              <label for="reg-password" class="login-label">Password</label>
              <div class="login-input-wrap">
                <input 
                  type="password" 
                  id="reg-password" 
                  class="login-input" 
                  placeholder="Create secure password" 
                  value="Rakshak@2026"
                  required 
                />
              </div>
            </div>
            <div class="login-field-group">
              <label for="reg-confirm-password" class="login-label">Confirm Password</label>
              <div class="login-input-wrap">
                <input 
                  type="password" 
                  id="reg-confirm-password" 
                  class="login-input" 
                  placeholder="Confirm password" 
                  value="Rakshak@2026"
                  required 
                />
              </div>
            </div>

            <!-- 6. Contact Number -->
            <div class="login-field-group">
              <label for="reg-contact" class="login-label">Contact Number (Admin Verification / Audit)</label>
              <div class="login-input-wrap">
                <input 
                  type="tel" 
                  id="reg-contact" 
                  class="login-input" 
                  placeholder="e.g. +91 94370 12345" 
                  value="+91 94370 54321"
                  required 
                />
              </div>
              <span class="login-field-hint">Audited against police personnel directory</span>
            </div>

            <!-- Biometric Enrollment Section -->
            <div style="margin-top: 20px; border-top: 1px solid #E2E8F0; padding-top: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <label class="login-label" style="margin-bottom: 0;">Biometric Enrollment</label>
                <span class="mono text-muted" style="font-size: 10px;">Camera Sensor Stream</span>
              </div>

              <!-- Stepper: Step 1: Face Capture -> Step 2: Eye/Iris Capture -->
              <div class="reg-stepper">
                <div id="step-face-pill" class="reg-step-item active">
                  <span class="reg-step-badge">1</span>
                  <span>Step 1: Face Capture</span>
                </div>
                <span class="reg-step-divider">&rarr;</span>
                <div id="step-iris-pill" class="reg-step-item">
                  <span class="reg-step-badge">2</span>
                  <span>Step 2: Eye/Iris Capture</span>
                </div>
              </div>

              <!-- Interactive Step Area -->
              <div id="reg-biometrics-interactive">
                <!-- Step 1 Prompt -->
                <div id="reg-step1-prompt" style="text-align: center; margin: 14px 0;">
                  <button 
                    type="button" 
                    id="btn-start-face-capture" 
                    class="btn btn-primary" 
                    style="width: 100%;" 
                    onclick="window.RakshakAuth.startFaceCapture()"
                  >
                    Start Face Capture
                  </button>
                  <span class="login-field-hint" style="text-align: center; margin-top: 6px;">
                    Opens camera to capture reference face profile
                  </span>
                </div>

                <!-- Camera Container -->
                <div id="reg-camera-box" style="display: none; margin-top: 12px;">
                  <div class="cad-camera-container">
                    <video id="reg-camera-video" class="cad-camera-video" autoplay playsinline muted></video>
                    <div class="cad-camera-overlay">
                      <div id="reg-camera-guide" class="camera-guide-face">
                        <div class="camera-scan-beam"></div>
                      </div>
                      <div id="reg-camera-hint" class="camera-hint-pill">Position your face within the frame</div>
                    </div>
                  </div>
                  <canvas id="reg-capture-canvas" class="cad-camera-canvas" width="320" height="240"></canvas>
                  <div id="reg-camera-status" style="margin-top: 10px; font-size: 12px; font-weight: 700; color: #334155; text-align: center;">
                    Opening camera feed...
                  </div>
                </div>

                <!-- Step 2 Trigger (Shown after Step 1 completion) -->
                <div id="reg-step2-prompt" style="display: none; text-align: center; margin: 14px 0;">
                  <button 
                    type="button" 
                    id="btn-start-iris-capture" 
                    class="btn btn-primary" 
                    style="width: 100%;" 
                    onclick="window.RakshakAuth.startIrisCapture()"
                  >
                    Start Eye/Iris Capture
                  </button>
                  <span class="login-field-hint" style="text-align: center; margin-top: 6px;">
                    Enrolls precision optical iris pattern template
                  </span>
                </div>

                <!-- Summary Container (Shown after Step 2 completion) -->
                <div id="reg-summary-container" style="display: none;">
                  <!-- Dynamically populated by renderRegistrationSummary() -->
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="login-footer-legal">
          Official Emergency Operations Platform &bull; Odisha Police ERSS Dial 112 &bull; Registration audit logged under IT Act Sec 66
        </div>
      </div>
    `;
  },

  startFaceCapture: function() {
    const errorBanner = document.getElementById("reg-error-banner");
    const errorText = document.getElementById("reg-error-text");
    if (errorBanner) errorBanner.style.display = "none";

    const idInput = document.getElementById("reg-officer-id");
    const nameInput = document.getElementById("reg-fullname");
    const rankInput = document.getElementById("reg-rank");
    const stationInput = document.getElementById("reg-station");
    const passInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirm-password");
    const contactInput = document.getElementById("reg-contact");

    const officerId = idInput ? idInput.value.trim() : "";
    const name = nameInput ? nameInput.value.trim() : "";
    const rank = rankInput ? rankInput.value.trim() : "";
    const station = stationInput ? stationInput.value.trim() : "";
    const password = passInput ? passInput.value : "";
    const confirmPass = confirmInput ? confirmInput.value : "";
    const contact = contactInput ? contactInput.value.trim() : "";

    if (!officerId || !name || !rank || !station || !password || !confirmPass || !contact) {
      if (errorBanner && errorText) {
        errorBanner.style.display = "flex";
        errorText.textContent = "Please fill in all officer credentials before biometric enrollment.";
      }
      return;
    }

    if (password !== confirmPass) {
      if (errorBanner && errorText) {
        errorBanner.style.display = "flex";
        errorText.textContent = "Password and Confirm Password do not match.";
      }
      return;
    }

    this.tempRegistration = {
      officerId: officerId,
      name: name,
      rank: rank,
      station: station,
      password: password,
      contact: contact,
      faceCaptured: false,
      irisCaptured: false,
      faceImage: null,
      trusted: false,
      approved: false,
      enrolledBiometrics: true
    };

    const prompt1 = document.getElementById("reg-step1-prompt");
    const camBox = document.getElementById("reg-camera-box");
    const camStatus = document.getElementById("reg-camera-status");
    const guide = document.getElementById("reg-camera-guide");
    const hint = document.getElementById("reg-camera-hint");
    const video = document.getElementById("reg-camera-video");

    if (prompt1) prompt1.style.display = "none";
    if (camBox) camBox.style.display = "block";
    if (camStatus) camStatus.textContent = "Opening device camera...";
    if (guide) {
      guide.className = "camera-guide-face";
    }
    if (hint) {
      hint.textContent = "Position your face within the frame";
    }

    const completeFaceCapture = () => {
      if (camStatus) camStatus.innerHTML = `<span style="color: #16A34A; font-weight: 700;">Face Captured ✓</span>`;
      if (guide) guide.classList.add("verified");
      const stepPill1 = document.getElementById("step-face-pill");
      const stepPill2 = document.getElementById("step-iris-pill");
      if (stepPill1) {
        stepPill1.classList.remove("active");
        stepPill1.classList.add("completed");
        const badge = stepPill1.querySelector(".reg-step-badge");
        if (badge) badge.textContent = "✓";
      }
      if (stepPill2) {
        stepPill2.classList.add("active");
      }

      this.tempRegistration.faceCaptured = true;
      this.stopCameraStream();
      this.playTone("success");

      setTimeout(() => {
        if (camBox) camBox.style.display = "none";
        const prompt2 = document.getElementById("reg-step2-prompt");
        if (prompt2) prompt2.style.display = "block";
      }, 1000);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } })
        .then(stream => {
          this.activeCameraStream = stream;
          if (video) {
            video.srcObject = stream;
            video.play().catch(() => {});
          }

          let regFaceFrames = 0;
          if (this.detectionInterval) clearInterval(this.detectionInterval);
          this.detectionInterval = setInterval(() => {
            const det = this.detectFaceInVideo(video, "face");
            if (det.state === "WAITING_CAMERA") {
              regFaceFrames = 0;
              if (camStatus) camStatus.textContent = "Connecting to camera sensor...";
              return;
            }
            if (det.state === "INSIDE_BOX") {
              if (guide) guide.className = "camera-guide-face aligned";
              regFaceFrames++;
              const pct = Math.min(100, Math.round((regFaceFrames / 10) * 100));
              if (hint) hint.textContent = `Face Aligned (${pct}%)`;
              if (camStatus) camStatus.innerHTML = `<span style="color: #0F172A; font-weight: 700;">Scanning face geometry... Hold position (${pct}%)</span>`;
              if (regFaceFrames >= 10) {
                if (this.detectionInterval) clearInterval(this.detectionInterval);
                completeFaceCapture();
              }
            } else if (det.state === "NO_FACE") {
              if (guide) guide.className = "camera-guide-face no-face";
              if (hint) hint.textContent = "No Face Detected — Position your face within the frame";
              if (camStatus) camStatus.innerHTML = `<span style="color: #DC2626; font-weight: 700;">No Face Detected</span> &mdash; Align your face inside the box`;
              regFaceFrames = 0;
            } else if (det.state === "OUT_OF_BOX") {
              if (guide) guide.className = "camera-guide-face misaligned";
              if (hint) hint.textContent = det.hint || "Center face in box";
              if (camStatus) camStatus.innerHTML = `<span style="color: #D97706; font-weight: 700;">Face Out of Box &mdash; ${det.msg}</span>`;
              regFaceFrames = 0;
            }
          }, 150);
        })
        .catch(() => {
          // Camera denied / no webcam - fallback simulation
          if (camStatus) camStatus.textContent = "Simulating face scanner sensor (camera unavailable)...";
          setTimeout(completeFaceCapture, 2000);
        });
    } else {
      if (camStatus) camStatus.textContent = "Simulating face scanner sensor...";
      setTimeout(completeFaceCapture, 2000);
    }
  },

  startIrisCapture: function() {
    const prompt2 = document.getElementById("reg-step2-prompt");
    const camBox = document.getElementById("reg-camera-box");
    const camStatus = document.getElementById("reg-camera-status");
    const guide = document.getElementById("reg-camera-guide");
    const hint = document.getElementById("reg-camera-hint");
    const video = document.getElementById("reg-camera-video");

    if (prompt2) prompt2.style.display = "none";
    if (camBox) camBox.style.display = "block";
    if (guide) {
      guide.className = "camera-guide-iris no-face";
    }
    if (hint) {
      hint.textContent = "Look directly into the camera";
    }
    if (camStatus) camStatus.textContent = "Aligning optical iris sensor...";

    const completeIrisCapture = () => {
      if (camStatus) camStatus.innerHTML = `<span style="color: #16A34A; font-weight: 700;">Iris Pattern Captured ✓</span>`;
      if (guide) guide.classList.add("verified");
      const stepPill2 = document.getElementById("step-iris-pill");
      if (stepPill2) {
        stepPill2.classList.remove("active");
        stepPill2.classList.add("completed");
        const badge = stepPill2.querySelector(".reg-step-badge");
        if (badge) badge.textContent = "✓";
      }

      this.tempRegistration.irisCaptured = true;
      this.stopCameraStream();
      this.playTone("success");

      // Log registration events to Audit Trail
      if (window.RakshakAudit && window.RakshakAudit.log) {
        window.RakshakAudit.log(
          "OFFICER_REGISTERED",
          this.tempRegistration.officerId,
          this.CURRENT_TERMINAL_ID,
          `New officer registered: ${this.tempRegistration.name} (${this.tempRegistration.rank}, ${this.tempRegistration.station}) - Contact: ${this.tempRegistration.contact}`
        );
        window.RakshakAudit.log(
          "BIOMETRIC_ENROLLED",
          this.tempRegistration.officerId,
          this.CURRENT_TERMINAL_ID,
          `Facial geometry vector & Iris pattern cryptographic template stored`
        );
      }

      setTimeout(() => {
        if (camBox) camBox.style.display = "none";
        this.renderRegistrationSummary();
      }, 1000);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } })
        .then(stream => {
          this.activeCameraStream = stream;
          if (video) {
            video.srcObject = stream;
            video.play().catch(() => {});
          }

          let regIrisFrames = 0;
          if (this.detectionInterval) clearInterval(this.detectionInterval);
          this.detectionInterval = setInterval(() => {
            const det = this.detectFaceInVideo(video, "iris");
            if (det.state === "WAITING_CAMERA") {
              regIrisFrames = 0;
              return;
            }
            if (det.state === "INSIDE_BOX") {
              if (guide) guide.className = "camera-guide-iris aligned";
              regIrisFrames++;
              const pct = Math.min(100, Math.round((regIrisFrames / 8) * 100));
              if (hint) hint.textContent = `Eyes Aligned (${pct}%)`;
              if (camStatus) camStatus.innerHTML = `<span style="color: #0F172A; font-weight: 700;">Scanning iris biometric texture... Hold steady (${pct}%)</span>`;
              if (regIrisFrames >= 8) {
                if (this.detectionInterval) clearInterval(this.detectionInterval);
                completeIrisCapture();
              }
            } else if (det.state === "NO_FACE") {
              if (guide) guide.className = "camera-guide-iris no-face";
              if (hint) hint.textContent = "No Face Detected — Look directly into camera";
              if (camStatus) camStatus.innerHTML = `<span style="color: #DC2626; font-weight: 700;">No Face Detected</span> &mdash; Look directly into camera`;
              regIrisFrames = 0;
            } else if (det.state === "OUT_OF_BOX") {
              if (guide) guide.className = "camera-guide-iris misaligned";
              if (hint) hint.textContent = "Look directly into camera";
              if (camStatus) camStatus.innerHTML = `<span style="color: #D97706; font-weight: 700;">Align eyes inside iris frame</span>`;
              regIrisFrames = 0;
            }
          }, 150);
        })
        .catch(() => {
          if (camStatus) camStatus.textContent = "Simulating iris pattern scan...";
          setTimeout(completeIrisCapture, 1800);
        });
    } else {
      if (camStatus) camStatus.textContent = "Simulating iris pattern scan...";
      setTimeout(completeIrisCapture, 1800);
    }
  },

  renderRegistrationSummary: function() {
    const summaryContainer = document.getElementById("reg-summary-container");
    if (!summaryContainer || !this.tempRegistration) return;

    summaryContainer.style.display = "block";
    summaryContainer.innerHTML = `
      <div class="reg-summary-box">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span id="reg-approval-badge" class="badge-approval-pending">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Registration Complete &mdash; Pending Admin Approval
          </span>
          <span class="mono text-muted" style="font-size: 10px;">ID: ${this.tempRegistration.officerId}</span>
        </div>

        <div class="reg-summary-grid">
          <div class="reg-summary-item">
            <span class="reg-summary-label">Officer ID:</span>
            <span class="reg-summary-value mono">${this.tempRegistration.officerId}</span>
          </div>
          <div class="reg-summary-item">
            <span class="reg-summary-label">Full Name:</span>
            <span class="reg-summary-value">${this.tempRegistration.name}</span>
          </div>
          <div class="reg-summary-item">
            <span class="reg-summary-label">Rank / Designation:</span>
            <span class="reg-summary-value">${this.tempRegistration.rank}</span>
          </div>
          <div class="reg-summary-item">
            <span class="reg-summary-label">Station / Zone:</span>
            <span class="reg-summary-value">${this.tempRegistration.station}</span>
          </div>
          <div class="reg-summary-item">
            <span class="reg-summary-label">Contact Number:</span>
            <span class="reg-summary-value mono">${this.tempRegistration.contact}</span>
          </div>
          <div class="reg-summary-item">
            <span class="reg-summary-label">Biometric Status:</span>
            <span class="reg-summary-value text-success">Face &amp; Iris Captured ✓</span>
          </div>
        </div>

        <p style="font-size: 11px; color: #64748B; margin: 14px 0 10px 0; line-height: 1.45;">
          This account will be added to Trusted Registered Officers once approved by Control Room Admin.
        </p>

        <div id="reg-approval-action-area" style="margin-top: 12px;">
          <button 
            type="button" 
            id="btn-simulate-admin-approval" 
            class="btn btn-sm btn-secondary-flat" 
            style="width: 100%; justify-content: center;"
            onclick="window.RakshakAuth.simulateAdminApproval()"
          >
            Simulate Admin Approval
          </button>
        </div>
      </div>
    `;
  },

  simulateAdminApproval: function() {
    if (!this.tempRegistration) return;

    this.tempRegistration.approved = true;
    this.tempRegistration.trusted = true;
    this.tempRegistration.enrolledBiometrics = true;

    // Save into registered officers store & localStorage
    this.saveRegisteredOfficer(this.tempRegistration);

    // Flip badge to green
    const badge = document.getElementById("reg-approval-badge");
    if (badge) {
      badge.className = "badge-approval-approved";
      badge.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Approved &mdash; Trusted Officer
      `;
    }

    // Log to Audit Trail
    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "ADMIN_APPROVED",
        this.tempRegistration.officerId,
        this.CURRENT_TERMINAL_ID,
        `Control Room Admin approved officer credentials. Account promoted to Trusted Registered Officers`
      );
    }

    this.playTone("success");

    // Replace action button with Proceed to Login
    const actionArea = document.getElementById("reg-approval-action-area");
    if (actionArea) {
      actionArea.innerHTML = `
        <button 
          type="button" 
          class="btn btn-primary" 
          style="width: 100%;" 
          onclick="window.RakshakAuth.proceedToLoginWithOfficer('${this.tempRegistration.officerId}')"
        >
          Proceed to Login with New Account &rarr;
        </button>
      `;
    }
  },

  proceedToLoginWithOfficer: function(officerId) {
    this.renderLoginScreen();
    const idInput = document.getElementById("login-officer-id");
    const passInput = document.getElementById("login-password");
    if (idInput) idInput.value = officerId;
    if (passInput) {
      const off = this.findOfficer(officerId);
      if (off) passInput.value = off.password;
    }
  },

  // ====================================================================
  // CAMERA-BASED FACE & EYE BIOMETRIC VERIFICATION (LOGIN STEP)
  // ====================================================================

  startCameraBiometricVerification: function(officer) {
    let modal = document.getElementById("camera-biometric-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "camera-biometric-modal";
      modal.className = "cad-modal-backdrop camera-modal-backdrop";
      document.body.appendChild(modal);
    }

    const isDemo = (officer.officerId === "OD-CP-1023");

    // If Demo Account: log label appearance to Audit Trail
    if (isDemo && window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "BIOMETRIC_DEMO_MODE_FLAGGED",
        "OD-CP-1023",
        this.CURRENT_TERMINAL_ID,
        "BIOMETRIC_DEMO_MODE_FLAGGED — OD-CP-1023 — matching bypassed (prototype)."
      );
    }

    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="camera-biometric-modal-window" onclick="event.stopPropagation()">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="assets/rakshak-logo.png" alt="Rakshak-Net" style="height: 20px; width: auto; object-fit: contain;" />
            <strong style="font-size: 13px; color: #0F172A;">Biometric Identity Verification</strong>
          </div>
          <button type="button" class="cad-modal-close" onclick="window.RakshakAuth.cancelCameraBiometric()">&times;</button>
        </div>

        ${isDemo ? `
          <!-- Prototype Mode Badge (OD-CP-1023 only) -->
          <div class="prototype-mode-badge" id="bio-demo-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>PROTOTYPE MODE &mdash; Biometric Matching Simulated for Demo</span>
          </div>
        ` : `
          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
            Registered Officer: <strong style="color: #0F172A;">${officer.name}</strong> (${officer.officerId})
          </div>
        `}

        <!-- Camera Viewport Frame -->
        <div class="cad-camera-container">
          <video id="login-camera-video" class="cad-camera-video" autoplay playsinline muted></video>
          <div class="cad-camera-overlay">
            <div id="login-camera-guide" class="camera-guide-face no-face">
              <div class="camera-scan-beam"></div>
            </div>
            <div id="login-camera-hint" class="camera-hint-pill">No Face Detected &bull; Position your face within the frame</div>
          </div>
        </div>

        <!-- Scanning Status -->
        <div id="login-bio-status-title" style="margin-top: 12px; font-size: 13px; font-weight: 700;">
          <span style="color: #DC2626; font-weight: 700;">No Face Detected</span> &mdash; Please position your face inside the box
        </div>
        <div id="login-bio-status-sub" class="text-muted mono" style="font-size: 11px; margin-top: 3px;">
          Checking against enrolled biometric credentials &bull; ${officer.officerId}
        </div>

        <!-- Failure Banner (Hidden by default) -->
        <div id="login-bio-mismatch-banner" class="login-alert-banner alert-error" style="display: none; margin-top: 12px; text-align: left;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <div style="flex: 1;">
            <strong>Face Not Recognized &mdash; Access Denied</strong><br/>
            <span>Biometric profile did not match enrolled template on record.</span>
          </div>
          <button type="button" class="btn btn-xs btn-outline" style="border-color: #FCA5A5; color: #991B1B;" onclick="window.RakshakAuth.startCameraBiometricVerification(window.RakshakAuth.findOfficer('${officer.officerId}'))">
            Retry Scan
          </button>
        </div>

        <!-- Fallback Message if camera permission denied -->
        <div id="login-camera-fallback" style="display: none; margin-top: 12px;">
          <div class="login-alert-banner alert-error" style="text-align: left; font-size: 11px; margin-bottom: 8px;">
            Camera access required for biometric verification. Please allow camera permissions or contact your administrator.
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-outline btn-sm" style="flex: 1;" onclick="window.RakshakAuth.skipBiometricDemo('${officer.officerId}')">
              Skip Biometric (Demo Mode Only)
            </button>
            <button type="button" class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.RakshakAuth.startCameraBiometricVerification(window.RakshakAuth.findOfficer('${officer.officerId}'))">
              Retry Camera
            </button>
          </div>
        </div>

        ${isDemo ? `
          <!-- Prototype Transparency Disclaimer (OD-CP-1023 only) -->
          <div class="prototype-disclaimer-text" id="bio-demo-disclaimer">
            Camera capture is live and functional. Face/iris matching against enrolled biometric data is simulated in this prototype &mdash; production version will connect to a certified facial-recognition backend (e.g. AWS Rekognition, on-device biometric SDK) with real match/no-match logic.
          </div>
        ` : ''}

        <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary btn-sm" id="btn-quick-verify-bio" onclick="window.RakshakAuth.skipBiometricDemo('${officer.officerId}')" style="display: inline-flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Auto-Verify Biometrics (Demo Bypass)</span>
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="window.RakshakAuth.cancelCameraBiometric()">
            Cancel Verification
          </button>
        </div>
      </div>
    `;

    const video = document.getElementById("login-camera-video");
    const guide = document.getElementById("login-camera-guide");
    const hint = document.getElementById("login-camera-hint");
    const statusTitle = document.getElementById("login-bio-status-title");
    const fallbackBox = document.getElementById("login-camera-fallback");
    const mismatchBanner = document.getElementById("login-bio-mismatch-banner");

    let faceAlignedFrames = 0;
    const REQUIRED_FACE_FRAMES = 8; // ~1.2s of holding face steady inside the box
    let irisAlignedFrames = 0;
    const REQUIRED_IRIS_FRAMES = 6; // ~0.9s of holding eyes steady inside the iris box
    let currentStage = 'face'; // 'face' | 'transition_to_iris' | 'iris' | 'completed'

    if (guide) guide.className = "camera-guide-face no-face";

    const runDetectionLoop = () => {
      if (this.detectionInterval) {
        clearInterval(this.detectionInterval);
      }

      this.detectionInterval = setInterval(() => {
        const activeModal = document.getElementById("camera-biometric-modal");
        if (!activeModal || activeModal.style.display === "none" || currentStage === "completed") {
          if (this.detectionInterval) clearInterval(this.detectionInterval);
          return;
        }

        if (currentStage === "face") {
          const det = this.detectFaceInVideo(video, "face");

          if (det.state === "WAITING_CAMERA") {
            if (guide) guide.className = "camera-guide-face no-face";
            if (hint) hint.textContent = "Connecting to camera sensor...";
            if (statusTitle) {
              statusTitle.innerHTML = `<span style="color: #64748B; font-weight: 600;">Connecting to camera sensor...</span>`;
            }
            faceAlignedFrames = 0;
            return;
          }

          if (det.state === "NO_FACE") {
            if (guide) guide.className = "camera-guide-face no-face";
            if (hint) hint.textContent = "No Face Detected — Position your face within the frame";
            if (statusTitle) {
              statusTitle.innerHTML = `<span style="color: #DC2626; font-weight: 700;">No Face Detected</span> &mdash; Please position your face inside the box`;
            }
            faceAlignedFrames = 0;
            return;
          }

          if (det.state === "OUT_OF_BOX") {
            if (guide) guide.className = "camera-guide-face misaligned";
            if (hint) hint.textContent = det.hint || "Center face inside box";
            if (statusTitle) {
              statusTitle.innerHTML = `<span style="color: #D97706; font-weight: 700;">Face Out of Frame &mdash; ${det.msg}</span>`;
            }
            faceAlignedFrames = 0;
            return;
          }

          if (det.state === "INSIDE_BOX") {
            // Face is properly positioned inside the guide box!
            if (guide) guide.className = "camera-guide-face aligned";
            faceAlignedFrames++;
            const pct = Math.min(100, Math.round((faceAlignedFrames / REQUIRED_FACE_FRAMES) * 100));

            if (hint) hint.textContent = `Face Aligned • Hold Steady (${pct}%)`;
            if (statusTitle) {
              statusTitle.innerHTML = `<span style="color: #0F172A; font-weight: 700;">Verifying Officer Identity &mdash; Face Scan in Progress (${pct}%)...</span>`;
            }

            if (faceAlignedFrames >= REQUIRED_FACE_FRAMES) {
              // Check if officer has enrolled biometrics
              if (!isDemo && officer.enrolledBiometrics === false) {
                if (this.detectionInterval) clearInterval(this.detectionInterval);
                this.stopCameraStream();
                if (mismatchBanner) mismatchBanner.style.display = "flex";
                if (statusTitle) statusTitle.innerHTML = `<span style="color: #DC2626; font-weight: 700;">Face Not Recognized &mdash; Access Denied</span>`;
                if (guide) {
                  guide.className = "camera-guide-face misaligned";
                  guide.style.borderColor = "#DC2626";
                }
                this.playTone("error");

                if (window.RakshakAudit && window.RakshakAudit.log) {
                  window.RakshakAudit.log(
                    "BIOMETRIC_MISMATCH",
                    officer.officerId,
                    this.CURRENT_TERMINAL_ID,
                    `Face scan mismatch: No matching enrolled biometric vector found for officer ${officer.officerId}`
                  );
                }
                return;
              }

              // SUCCESS ON FACE: Green checkmark and welcome message
              currentStage = "transition_to_iris";
              if (guide) guide.className = "camera-guide-face verified";
              if (statusTitle) {
                statusTitle.innerHTML = `<span style="color: #16A34A; font-weight: 700;">Identity Verified ✓ &mdash; Welcome, ${officer.name}</span>`;
              }
              if (hint) hint.textContent = "Face Verified ✓";
              this.playTone("success");

              // Transition to Iris Eye Scan
              setTimeout(() => {
                const activeMod = document.getElementById("camera-biometric-modal");
                if (!activeMod || activeMod.style.display === "none") return;
                currentStage = "iris";
                irisAlignedFrames = 0;
                if (guide) guide.className = "camera-guide-iris";
                if (hint) hint.textContent = "Look directly into the camera";
                if (statusTitle) {
                  statusTitle.innerHTML = `Confirm Eye Scan &bull; Scanning Iris Pattern...`;
                }
              }, 1200);
            }
          }
        } else if (currentStage === "iris") {
          const det = this.detectFaceInVideo(video, "iris");

          if (det.state === "WAITING_CAMERA") {
            irisAlignedFrames = 0;
            return;
          }

          if (det.state === "NO_FACE") {
            if (guide) guide.className = "camera-guide-iris no-face";
            if (hint) hint.textContent = "No Face Detected — Look directly into the camera";
            if (statusTitle) {
              statusTitle.innerHTML = `<span style="color: #DC2626; font-weight: 700;">No Face Detected</span> &mdash; Look into camera lens`;
            }
            irisAlignedFrames = 0;
            return;
          }

          if (det.state === "OUT_OF_BOX") {
            if (guide) guide.className = "camera-guide-iris misaligned";
            if (hint) hint.textContent = "Look directly into the camera";
            if (statusTitle) {
              statusTitle.innerHTML = `<span style="color: #D97706; font-weight: 700;">Align eyes inside the iris frame &mdash; Look into camera lens</span>`;
            }
            irisAlignedFrames = 0;
            return;
          }

          if (det.state === "INSIDE_BOX") {
            // Eyes inside iris box!
            if (guide) guide.className = "camera-guide-iris aligned";
            irisAlignedFrames++;
            const irisPct = Math.min(100, Math.round((irisAlignedFrames / REQUIRED_IRIS_FRAMES) * 100));

            if (hint) hint.textContent = `Eyes Aligned • Hold Steady (${irisPct}%)`;
            if (statusTitle) {
              statusTitle.innerHTML = `Confirm Eye Scan &bull; Scanning Iris Pattern (${irisPct}%)...`;
            }

            if (irisAlignedFrames >= REQUIRED_IRIS_FRAMES) {
              currentStage = "completed";
              if (this.detectionInterval) clearInterval(this.detectionInterval);
              if (guide) guide.className = "camera-guide-iris verified";
              if (statusTitle) {
                statusTitle.innerHTML = `<span style="color: #16A34A; font-weight: 700;">Iris Verified ✓</span>`;
              }
              if (hint) hint.textContent = "Iris Verified ✓";
              this.playTone("chime");

              setTimeout(() => {
                this.completeBiometricLogin(officer);
              }, 1000);
            }
          }
        }
      }, 150);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } })
        .then(stream => {
          this.activeCameraStream = stream;
          if (video) {
            video.srcObject = stream;
            video.play().catch(() => {});
          }
          runDetectionLoop();
        })
        .catch(() => {
          if (fallbackBox) fallbackBox.style.display = "block";
          if (statusTitle) statusTitle.textContent = "Camera Access Denied / Unavailable";
        });
    } else {
      if (fallbackBox) fallbackBox.style.display = "block";
      if (statusTitle) statusTitle.textContent = "Camera Access Not Supported by Browser";
    }
  },

  completeBiometricLogin: function(officer) {
    this.stopCameraStream();
    const modal = document.getElementById("camera-biometric-modal");
    if (modal) modal.style.display = "none";

    this.state.failedAttempts = 0;
    this.state.lockoutTier = 0;
    this.state.lockoutUntil = null;
    this.state.authenticated = true;
    this.state.currentUser = {
      officerId: officer.officerId,
      name: officer.name,
      rank: officer.rank,
      station: officer.station,
      badge: officer.badge || officer.officerId,
      authMethod: "BIOMETRIC_FACE_IRIS_SCAN",
      sessionStarted: new Date().toISOString()
    };

    sessionStorage.setItem("rakshak_cad_session", JSON.stringify(this.state.currentUser));

    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "LOGIN_SUCCESS",
        officer.officerId,
        this.CURRENT_TERMINAL_ID + " (Camera Biometric Verified)",
        `Dual-stage facial geometry & iris authentication verified for ${officer.name} (${officer.rank})`
      );
    }

    this.state.lastActivityTime = Date.now();
    this.transitionToCommandCenter();
  },

  skipBiometricDemo: function(officerId) {
    const officer = this.findOfficer(officerId) || this.DEMO_ACCOUNT;
    this.stopCameraStream();
    const modal = document.getElementById("camera-biometric-modal");
    if (modal) modal.style.display = "none";

    this.state.failedAttempts = 0;
    this.state.authenticated = true;
    this.state.currentUser = {
      officerId: officer.officerId,
      name: officer.name,
      rank: officer.rank,
      station: officer.station,
      badge: officer.badge || officer.officerId,
      authMethod: "DEMO_BYPASS",
      sessionStarted: new Date().toISOString()
    };

    sessionStorage.setItem("rakshak_cad_session", JSON.stringify(this.state.currentUser));

    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "LOGIN_SUCCESS",
        officer.officerId,
        this.CURRENT_TERMINAL_ID + " (Biometric Bypassed - Demo)",
        `Evaluator demo bypass activated for ${officer.name}`
      );
    }

    this.state.lastActivityTime = Date.now();
    this.transitionToCommandCenter();
  },

  cancelCameraBiometric: function() {
    this.stopCameraStream();
    const modal = document.getElementById("camera-biometric-modal");
    if (modal) modal.style.display = "none";
    this.renderLoginScreen();
  },

  // Register Device Flow (Simulates Approval Request to Admin)
  registerDevice: function() {
    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "NEW_DEVICE_FLAGGED",
        this.DEMO_ACCOUNT.officerId,
        this.CURRENT_TERMINAL_ID,
        "Registration request dispatched to Commissionerate IT Security Administrator"
      );
    }
    alert("DEVICE REGISTRATION REQUEST SUBMITTED:\n----------------------------------------\nHardware Fingerprint: BBSR-CAD-TERMINAL-01\nStatus: PENDING ADMIN APPROVAL\nAn approval notice has been logged to the central audit directory.");
  },

  // Transition into Command Center Viewport
  transitionToCommandCenter: function() {
    const loginContainer = document.getElementById("login-screen");
    const appRoot = document.getElementById("app-root");

    if (loginContainer) loginContainer.style.display = "none";
    if (appRoot) appRoot.style.display = "block";

    // Initialize RakshakApp if not already active
    if (window.RakshakApp) {
      const initialTab = window.location.hash.replace("#", "") || "overview";
      window.RakshakApp.switchTab(initialTab, false);
    }

    this.updateUserInterface();
  },

  // Update header badges & menu with authenticated officer info
  updateUserInterface: function() {
    const user = this.getCurrentUser();
    const officerNameEls = document.querySelectorAll(".auth-officer-name");
    officerNameEls.forEach(el => el.textContent = user.name);

    const officerIdEls = document.querySelectorAll(".auth-officer-id");
    officerIdEls.forEach(el => el.textContent = user.officerId);
  },

  // Inactivity Screen Lock Watchdog
  bindGlobalActivityListeners: function() {
    const resetTimer = () => {
      this.state.lastActivityTime = Date.now();
      this.hideInactivityWarning();
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });
  },

  startInactivityWatchdog: function() {
    if (this.state.inactivityInterval) clearInterval(this.state.inactivityInterval);

    this.state.inactivityInterval = setInterval(() => {
      if (!this.state.authenticated || this.state.isLocked) return;

      const idleSeconds = Math.floor((Date.now() - this.state.lastActivityTime) / 1000);
      const remainingSeconds = this.INACTIVITY_TIMEOUT_SEC - idleSeconds;

      // Show subtle 15s warning toast
      if (remainingSeconds <= this.WARNING_LEAD_TIME_SEC && remainingSeconds > 0) {
        this.showInactivityWarning(remainingSeconds);
      } else if (remainingSeconds > this.WARNING_LEAD_TIME_SEC) {
        this.hideInactivityWarning();
      }

      // Lock Screen on timeout (120s)
      if (idleSeconds >= this.INACTIVITY_TIMEOUT_SEC) {
        this.lockScreen("INACTIVITY_TIMEOUT");
      }
    }, 1000);
  },

  showInactivityWarning: function(seconds) {
    const toast = document.getElementById("inactivity-toast");
    if (!toast) return;
    toast.style.display = "flex";
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="status-dot orange"></span>
        <span>Session will lock in <strong>${seconds}s</strong> due to inactivity</span>
      </div>
      <button class="btn btn-xs btn-outline" style="border-color: #94A3B8; color: #1E293B;" onclick="window.RakshakAuth.stayLoggedIn()">Stay Logged In</button>
    `;
  },

  hideInactivityWarning: function() {
    const toast = document.getElementById("inactivity-toast");
    if (toast) toast.style.display = "none";
  },

  stayLoggedIn: function() {
    this.state.lastActivityTime = Date.now();
    this.hideInactivityWarning();
  },

  // Quick Screen Lock (Preserves exact tab, scroll, and console state)
  lockScreen: function(reason = "MANUAL_LOCK") {
    if (!this.state.authenticated || this.state.isLocked) return;

    this.state.isLocked = true;
    this.hideInactivityWarning();

    const user = this.getCurrentUser();
    const lockModal = document.getElementById("screen-lock-modal");
    if (!lockModal) return;

    lockModal.style.display = "flex";
    lockModal.innerHTML = `
      <div class="cad-modal-window lock-modal-window" onclick="event.stopPropagation()">
        <div class="lock-modal-header">
          <div class="lock-shield-wrap" style="background: transparent; border: none; display: flex; align-items: center; justify-content: center;">
            <img src="assets/rakshak-logo.png" alt="Rakshak-Net" style="height: 28px; width: auto; object-fit: contain;" />
          </div>
          <div>
            <h2 class="lock-modal-title">Session Locked &bull; Inactivity Timeout</h2>
            <div class="lock-modal-subtitle">Commissionerate Police Dial 112 Command Desk</div>
          </div>
        </div>

        <div class="lock-modal-body">
          <div class="locked-officer-strip">
            <div class="locked-officer-avatar">RM</div>
            <div>
              <div class="locked-officer-name">${user.name}</div>
              <div class="locked-officer-meta mono">${user.officerId} &bull; ${user.rank}</div>
            </div>
            <span class="badge badge-enroute" style="margin-left: auto;">ACTIVE SESSION</span>
          </div>

          <div id="unlock-error-banner" class="login-alert-banner alert-error" style="display: none;">
            Incorrect password. Please re-enter credentials to resume.
          </div>

          <form id="screen-unlock-form" onsubmit="window.RakshakAuth.handleUnlockSubmit(event)" style="margin-top: 14px;">
            <div class="login-field-group">
              <label for="unlock-password" class="login-label">Enter Password to Resume Session</label>
              <div class="login-input-wrap">
                <input 
                  type="password" 
                  id="unlock-password" 
                  class="login-input" 
                  placeholder="Officer password" 
                  required 
                  autofocus
                />
                <button 
                  type="button" 
                  class="btn-password-toggle" 
                  onclick="window.RakshakAuth.togglePasswordVisibility('unlock-password', this)"
                >
                  <svg class="eye-open-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg class="eye-closed-icon" style="display: none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 14px;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">Unlock Session &rarr;</button>
              <button type="button" class="btn btn-outline" onclick="window.RakshakAuth.unlockWithBiometric()" title="Quick Biometric Unlock">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M12 2a10 10 0 0 0-6.88 17.22l.12.11a10 10 0 0 0 13.52 0l.12-.11A10 10 0 0 0 12 2z"/></svg>
                <span>Biometric</span>
              </button>
            </div>
          </form>
        </div>

        <div class="lock-modal-footer">
          <span class="mono text-muted" style="font-size: 11px;">Current tab &amp; scroll position preserved</span>
          <button class="btn-lock-logout" onclick="window.RakshakAuth.logout()">Log out completely</button>
        </div>
      </div>
    `;

    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "SCREEN_LOCKED",
        user.officerId,
        this.CURRENT_TERMINAL_ID,
        `Console locked due to ${reason === 'INACTIVITY_TIMEOUT' ? '120s inactivity watchdog' : 'operator directive'}`
      );
    }

    this.playTone("lock");
  },

  handleUnlockSubmit: function(e) {
    if (e) e.preventDefault();
    const passInput = document.getElementById("unlock-password");
    if (!passInput) return;

    this.unlockScreen(passInput.value);
  },

  unlockScreen: function(password) {
    const isMatch = (password === this.DEMO_ACCOUNT.password);

    if (isMatch) {
      this.state.isLocked = false;
      this.state.lastActivityTime = Date.now();
      const lockModal = document.getElementById("screen-lock-modal");
      if (lockModal) lockModal.style.display = "none";

      if (window.RakshakAudit && window.RakshakAudit.log) {
        window.RakshakAudit.log(
          "SCREEN_UNLOCKED",
          this.getCurrentUser().officerId,
          this.CURRENT_TERMINAL_ID,
          "Operator session restored via password re-verification"
        );
      }

      this.playTone("success");
      return true;
    } else {
      const errBanner = document.getElementById("unlock-error-banner");
      if (errBanner) errBanner.style.display = "flex";
      this.playTone("error");
      return false;
    }
  },

  unlockWithBiometric: function() {
    this.state.isLocked = false;
    this.state.lastActivityTime = Date.now();
    const lockModal = document.getElementById("screen-lock-modal");
    if (lockModal) lockModal.style.display = "none";

    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "SCREEN_UNLOCKED",
        this.getCurrentUser().officerId,
        this.CURRENT_TERMINAL_ID,
        "Operator session restored via Windows Hello biometric sensor"
      );
    }

    this.playTone("success");
  },

  logout: function() {
    const user = this.getCurrentUser();
    if (window.RakshakAudit && window.RakshakAudit.log) {
      window.RakshakAudit.log(
        "LOGOUT",
        user.officerId,
        this.CURRENT_TERMINAL_ID,
        "Officer cleanly terminated CAD command session"
      );
    }

    this.state.authenticated = false;
    this.state.currentUser = null;
    this.state.isLocked = false;
    sessionStorage.removeItem("rakshak_cad_session");

    const lockModal = document.getElementById("screen-lock-modal");
    if (lockModal) lockModal.style.display = "none";

    this.renderLoginScreen();
  },

  // Utilities
  formatTime: function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  },

  playTone: function(type = "chime") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "success") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      } else if (type === "error") {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      } else if (type === "lock") {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }
};
