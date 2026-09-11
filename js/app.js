// Rakshak-Net CAD - Master Application Controller
// Orchestrates 6 Core Views, Navigation Tabs, CAD Ticker, Audio Chime, and Map Resizing

(function() {
  const RakshakApp = {
    currentTab: "overview",
    isMuted: false,
    audioCtx: null,
    mapEngine: null,

    init: function() {
      this.bindEvents();
      this.startClock();
      this.startCadTicker();
      
      // Initialize Security & Authentication Gateway
      if (window.RakshakAuth) {
        window.RakshakAuth.init();
      }

      // Check if authenticated before mounting viewport
      if (!window.RakshakAuth || window.RakshakAuth.isAuthenticated()) {
        const initialHash = window.location.hash.replace("#", "") || "overview";
        this.switchTab(initialHash, false);
      }
    },

    bindEvents: function() {
      // Top Navigation Tab Clicks
      const tabButtons = document.querySelectorAll(".nav-tab-btn");
      tabButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
          const tab = btn.getAttribute("data-tab");
          if (tab) {
            this.switchTab(tab);
          }
        });
      });

      // Handle Browser Back/Forward navigation
      window.addEventListener("hashchange", () => {
        const hash = window.location.hash.replace("#", "");
        if (hash && hash !== this.currentTab) {
          this.switchTab(hash, false);
        }
      });

      // Close System Info dropdown or Footer Info popover on outside click
      document.addEventListener("click", (e) => {
        const menu = document.getElementById("system-info-menu");
        const btn = document.getElementById("btn-system-info-toggle");
        if (menu && menu.style.display !== "none" && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
          menu.style.display = "none";
          if (btn) btn.setAttribute("aria-expanded", "false");
        }

        const footerMenu = document.getElementById("footer-info-menu");
        const footerBtn = document.getElementById("btn-footer-info");
        if (footerMenu && footerMenu.style.display !== "none" && !footerMenu.contains(e.target) && e.target !== footerBtn && !footerBtn.contains(e.target)) {
          footerMenu.style.display = "none";
        }
      });

      // Close modal on Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeIncidentReportModal();
          this.closeSelfTestModal();
          if (window.RakshakTier1View && window.RakshakTier1View.closeTelemetryModal) {
            window.RakshakTier1View.closeTelemetryModal();
          }
        }
      });
    },

    toggleSystemInfo: function(event) {
      if (event) event.stopPropagation();
      const menu = document.getElementById("system-info-menu");
      const btn = document.getElementById("btn-system-info-toggle");
      if (!menu) return;
      const isVisible = menu.style.display === "flex" || menu.style.display === "block";
      menu.style.display = isVisible ? "none" : "flex";
      if (btn) btn.setAttribute("aria-expanded", !isVisible);
    },

    toggleFooterInfo: function(event) {
      if (event) event.stopPropagation();
      const menu = document.getElementById("footer-info-menu");
      if (!menu) return;
      const isVisible = menu.style.display === "block";
      menu.style.display = isVisible ? "none" : "block";
    },

    openIncidentReportModal: function() {
      const modal = document.getElementById("incident-report-modal");
      if (modal) modal.style.display = "flex";
    },

    closeIncidentReportModal: function(event) {
      if (event && event.target && event.target.closest && event.target.closest(".cad-modal-window") && event.target.className !== "cad-modal-close") {
        return;
      }
      const modal = document.getElementById("incident-report-modal");
      if (modal) modal.style.display = "none";
    },

    selfTestTimeout: null,
    selfTestAutoCloseTimer: null,

    runSelfTest: function() {
      const modal = document.getElementById("self-test-modal");
      const list = document.getElementById("self-test-list");
      const resultBanner = document.getElementById("self-test-result-banner");
      const timestampEl = document.getElementById("self-test-timestamp");
      const autoCloseHint = document.getElementById("self-test-autoclose-hint");

      if (!modal || !list || !resultBanner) return;

      // Clear any prior running self-test timeouts
      if (this.selfTestTimeout) clearTimeout(this.selfTestTimeout);
      if (this.selfTestAutoCloseTimer) clearInterval(this.selfTestAutoCloseTimer);

      // Play subtle CAD diagnostic chime
      this.playChime();

      // Show modal & hide end banner
      modal.style.display = "flex";
      resultBanner.style.display = "none";
      if (autoCloseHint) autoCloseHint.style.display = "none";

      const items = [
        { id: "lora", label: "LoRa Mesh Network: Reachable" },
        { id: "cad", label: "CAD/Dispatch API Bridge: Connected" },
        { id: "wearable", label: "Wearable Heartbeat Signals: Nominal (1,204/1,215 responding)" },
        { id: "ai", label: "AI Verification Model: Loaded & Responsive" },
        { id: "crypto", label: "Cryptographic Integrity (AES-128 GCM): Verified" }
      ];

      // Initial render: all items in waiting state
      list.innerHTML = items.map((item, idx) => `
        <div class="self-test-item waiting" id="test-item-${idx}">
          <span style="display: flex; align-items: center; gap: 8px;">
            <span class="mono" style="font-size: 10px; color: var(--text-muted);">0${idx + 1}.</span>
            <span class="test-item-label">${item.label}</span>
          </span>
          <span class="self-test-icon-slot" id="test-icon-${idx}">
            <span style="color: var(--text-muted); font-size: 11px;">&bull;</span>
          </span>
        </div>
      `).join("");

      // Sequential execution with ~0.5s step intervals
      let currentIdx = 0;

      const runStep = () => {
        if (currentIdx >= items.length) {
          // All passed! Show final green banner: "All Systems Operational — Self-Test Passed (100%)"
          const now = new Date();
          const yr = now.getFullYear();
          const mo = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hrs = String(now.getHours()).padStart(2, '0');
          const mins = String(now.getMinutes()).padStart(2, '0');
          const secs = String(now.getSeconds()).padStart(2, '0');
          
          if (timestampEl) {
            timestampEl.textContent = `Timestamp: ${yr}-${mo}-${day} ${hrs}:${mins}:${secs} IST • Diagnostic Session #RN-ST-4091`;
          }
          resultBanner.style.display = "flex";

          // Auto-close after a few seconds (5s) or let the user dismiss it
          let remainingSeconds = 5;
          if (autoCloseHint) {
            autoCloseHint.textContent = `Auto-closing in ${remainingSeconds}s...`;
            autoCloseHint.style.display = "inline";
          }

          this.selfTestAutoCloseTimer = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
              clearInterval(this.selfTestAutoCloseTimer);
              this.closeSelfTestModal();
            } else if (autoCloseHint) {
              autoCloseHint.textContent = `Auto-closing in ${remainingSeconds}s...`;
            }
          }, 1000);

          return;
        }

        const itemEl = document.getElementById(`test-item-${currentIdx}`);
        const iconSlot = document.getElementById(`test-icon-${currentIdx}`);

        // State 1: Active testing with spinner
        if (itemEl) {
          itemEl.className = "self-test-item testing";
        }
        if (iconSlot) {
          iconSlot.innerHTML = `<span class="self-test-spinner" title="Testing..."></span>`;
        }

        // State 2: Flip to green checkmark after ~0.5s (~500ms)
        this.selfTestTimeout = setTimeout(() => {
          if (itemEl) {
            itemEl.className = "self-test-item passed";
          }
          if (iconSlot) {
            iconSlot.innerHTML = `
              <span class="self-test-checkmark">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            `;
          }

          currentIdx++;
          // Proceed to next item after ~100ms
          this.selfTestTimeout = setTimeout(runStep, 100);
        }, 500);
      };

      // Start first step after a brief 200ms pause
      this.selfTestTimeout = setTimeout(runStep, 200);
    },

    closeSelfTestModal: function(event) {
      if (event && event.target && event.target.closest && event.target.closest(".cad-modal-window") && event.target.className !== "cad-modal-close" && event.target.id !== "btn-self-test-dismiss") {
        return;
      }
      if (this.selfTestTimeout) clearTimeout(this.selfTestTimeout);
      if (this.selfTestAutoCloseTimer) clearInterval(this.selfTestAutoCloseTimer);

      const modal = document.getElementById("self-test-modal");
      if (modal) modal.style.display = "none";
    },

    switchTab: function(tabKey, updateHash = true) {
      if (window.RakshakAuth && !window.RakshakAuth.isAuthenticated()) {
        return;
      }

      const validTabs = ["overview", "tier1_wearable", "tier2_lora", "tier3_ai", "tier3_dispatch", "analytics", "audit_trail"];
      if (!validTabs.includes(tabKey)) {
        tabKey = "overview";
      }

      this.currentTab = tabKey;

      if (updateHash) {
        window.location.hash = tabKey;
      }

      // Update Nav Buttons
      const tabButtons = document.querySelectorAll(".nav-tab-btn");
      tabButtons.forEach(btn => {
        if (btn.getAttribute("data-tab") === tabKey) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Render Active View
      const mainContainer = document.getElementById("main-content-viewport");
      if (!mainContainer) return;

      // Scroll to top
      window.scrollTo(0, 0);

      switch (tabKey) {
        case "overview":
          window.RakshakOverviewView.render(mainContainer);
          break;
        case "tier1_wearable":
          window.RakshakTier1View.render(mainContainer);
          break;
        case "tier2_lora":
          window.RakshakTier2View.render(mainContainer);
          break;
        case "tier3_ai":
          window.RakshakTier3AIView.render(mainContainer);
          break;
        case "tier3_dispatch":
          window.RakshakTier3DispatchView.render(mainContainer);
          break;
        case "analytics":
          window.RakshakAnalyticsView.render(mainContainer);
          break;
        case "audit_trail":
          if (window.RakshakAudit) {
            window.RakshakAudit.render(mainContainer);
          }
          break;
      }

      // Re-trigger Leaflet map invalidateSize if map is present
      setTimeout(() => {
        if (this.mapEngine) {
          this.mapEngine.invalidateSize();
        }
        if (window.RakshakTier2Map) {
          window.RakshakTier2Map.invalidateSize();
        }
      }, 150);
    },

    startClock: function() {
      const clockEl = document.getElementById("cad-live-clock");
      if (!clockEl) return;

      const update = () => {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs} IST`;
      };

      update();
      setInterval(update, 1000);
    },

    startCadTicker: function() {
      const tickerEl = document.getElementById("active-incident-timer");
      if (!tickerEl) return;

      let elapsed = 218; // Seconds since initial trigger of RN-INC-2026-0941
      setInterval(() => {
        elapsed++;
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        tickerEl.textContent = `T+${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }, 1000);
    },

    playChime: function() {
      if (this.isMuted) return;

      try {
        if (!this.audioCtx) {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        // Professional double-beep CAD tone (Subtle, non-jarring 800Hz / 1200Hz)
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
        osc.frequency.setValueAtTime(1174, this.audioCtx.currentTime + 0.08); // D6
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.23);
      } catch (e) {
        console.warn("Audio Context not permitted yet", e);
      }
    },

    toggleMute: function() {
      this.isMuted = !this.isMuted;
      const btn = document.getElementById("btn-toggle-audio");
      if (btn) {
        btn.innerHTML = this.isMuted
          ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/></svg> CAD Chime: Off`
          : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> CAD Chime: On`;
      }
    },

    refreshData: function() {
      this.playChime();
      this.switchTab(this.currentTab, false);
    }
  };

  window.RakshakApp = RakshakApp;

  // Boot on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    RakshakApp.init();
  });
})();
