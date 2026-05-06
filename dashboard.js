/* ============================================================
   ObturaScore AI — Dashboard JS
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    // ── Animate stat counters on scroll ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimal || 0);
        animateCounter(el, 0, target, 1400, decimals);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });
  
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  
    // ── Animate chart bars ──
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.animation = 'barGrow 1.2s cubic-bezier(0.4,0,0.2,1) both';
        barObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
  
    // Trigger bar animation on load
    setTimeout(() => {
      document.querySelectorAll('.chart-bar-fill').forEach((bar, i) => {
        bar.style.transitionDelay = `${i * 0.1}s`;
      });
    }, 300);
  
    // ── Today's date highlight ──
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const subtitleEl = document.querySelector('.topbar-subtitle');
    if (subtitleEl) subtitleEl.textContent = dateStr;
  
    // ── Notifications panel (mock) ──
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
      let panel = null;
  
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel) { panel.remove(); panel = null; return; }
  
        panel = document.createElement('div');
        panel.className = 'notif-panel';
        panel.innerHTML = `
          <div class="notif-panel-header">
            <span>Notifications</span>
            <button onclick="this.closest('.notif-panel').remove()" style="background:none;border:none;cursor:pointer;color:var(--warm-gray-400);font-size:1rem">×</button>
          </div>
          <div class="notif-item unread">
            <div class="notif-dot-red"></div>
            <div>
              <div class="notif-title">Retreatment Required — Neha Mehta</div>
              <div class="notif-time">2 hours ago</div>
            </div>
          </div>
          <div class="notif-item unread">
            <div class="notif-dot-orange"></div>
            <div>
              <div class="notif-title">Recall overdue — Sonal Patel (8 months)</div>
              <div class="notif-time">Yesterday</div>
            </div>
          </div>
          <div class="notif-item">
            <div class="notif-dot-blue"></div>
            <div>
              <div class="notif-title">Model updated to v2.4.1</div>
              <div class="notif-time">2 days ago</div>
            </div>
          </div>
          <div class="notif-item">
            <div class="notif-dot-blue"></div>
            <div>
              <div class="notif-title">Case #PT-0076 analysis complete</div>
              <div class="notif-time">3 days ago</div>
            </div>
          </div>
        `;
  
        document.body.appendChild(panel);
  
        // Position near button
        const rect = notifBtn.getBoundingClientRect();
        panel.style.top = (rect.bottom + 8) + 'px';
        panel.style.right = (window.innerWidth - rect.right) + 'px';
  
        document.addEventListener('click', () => { panel?.remove(); panel = null; }, { once: true });
      });
    }
  });
  
  // Inline notif panel styles
  const style = document.createElement('style');
  style.textContent = `
    .notif-panel {
      position: fixed;
      z-index: 999;
      background: white;
      border: 1px solid var(--warm-gray-200);
      border-radius: var(--radius-lg);
      width: 320px;
      box-shadow: var(--shadow-lg);
      animation: fadeUp 0.2s ease both;
      overflow: hidden;
    }
    .notif-panel-header {
      padding: 16px 16px 12px;
      font-weight: 600;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--warm-gray-100);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .notif-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--warm-gray-50);
      transition: background .15s;
    }
    .notif-item:hover { background: var(--warm-gray-50); }
    .notif-item.unread { background: var(--accent-light); }
    .notif-title { font-size: .82rem; color: var(--dark); line-height:1.4; }
    .notif-time { font-size: .72rem; color: var(--warm-gray-400); font-family: var(--font-mono); margin-top:3px; }
    .notif-dot-red, .notif-dot-orange, .notif-dot-blue {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px;
    }
    .notif-dot-red { background: var(--poor); }
    .notif-dot-orange { background: var(--acceptable); }
    .notif-dot-blue { background: var(--accent); }
  `;
  document.head.appendChild(style);