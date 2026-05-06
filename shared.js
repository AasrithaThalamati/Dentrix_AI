/* ============================================================
   ObturaScore AI — Shared JavaScript
   ============================================================ */

// ── Sidebar toggle (mobile) ──
(function () {
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('mobileToggle');
  
    function openSidebar()  { sidebar?.classList.add('open'); overlay?.classList.add('open'); }
    function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('open'); }
  
    toggleBtn?.addEventListener('click', openSidebar);
    overlay?.addEventListener('click', closeSidebar);
  
    // Close on nav click (mobile)
    document.querySelectorAll('.nav-item').forEach(a => {
      a.addEventListener('click', () => { if (window.innerWidth < 1024) closeSidebar(); });
    });
  })();
  
  // ── Active nav item ──
  (function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(a => {
      const href = a.getAttribute('href')?.split('/').pop();
      if (href === path) a.classList.add('active');
    });
  })();
  
  // ── Notifications dropdown ──
  (function () {
    const btn = document.getElementById('notifBtn');
    const panel = document.getElementById('notifPanel');
    if (!btn || !panel) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', () => panel?.classList.remove('open'));
  })();
  
  // ── Topbar search shortcut ──
  (function () {
    const input = document.querySelector('.topbar-search input');
    if (!input) return;
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
      }
    });
  })();
  
  // ── Toast notification ──
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
  
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none">
        ${type === 'success'
          ? '<path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
          : '<path d="M8 5v4m0 2.5v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/>'}
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
  }
  
  // ── Modal helpers ──
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'flex'; setTimeout(() => el.classList.add('open'), 10); }
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    setTimeout(() => { el.style.display = 'none'; }, 250);
  }
  
  // Wire close buttons
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) closeModal(modal.id);
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal.id);
      });
    });
  });
  
  // ── Utility: Format date ──
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  
  // ── Animate number counter ──
  function animateCounter(el, from, to, duration = 1200, decimals = 0) {
    const start = performance.now();
    const update = ts => {
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (from + (to - from) * ease).toFixed(decimals);
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  
  // ── Score helpers ──
  function getScoreColor(s) {
    if (s >= 8) return '#059669';
    if (s >= 6) return '#d97706';
    if (s >= 4) return '#ea580c';
    return '#dc2626';
  }
  function getScoreLabel(s) {
    if (s >= 8) return 'Optimal';
    if (s >= 6) return 'Acceptable';
    if (s >= 4) return 'Suboptimal';
    return 'Poor';
  }
  function getScoreBadgeClass(s) {
    if (s >= 8) return 'badge-optimal';
    if (s >= 6) return 'badge-acceptable';
    if (s >= 4) return 'badge-suboptimal';
    return 'badge-poor';
  }