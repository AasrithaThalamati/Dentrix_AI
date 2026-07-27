/* ============================================================
   Dentrix AI — Dashboard JS (Strict Profile Scoped & MongoDB Connected)
   ============================================================ */

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0'))
  ? 'http://127.0.0.1:5001/api'
  : 'https://dentrix-ai-8k2b.vercel.app/api';

function getToken() {
  return localStorage.getItem('dentrix_token') || sessionStorage.getItem('dentrix_token') || '';
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function resolveDoctorName() {
  const raw = localStorage.getItem('dentrix_user') || localStorage.getItem('dentrix_profile');
  if (raw) {
    try {
      const u = JSON.parse(raw);
      const name = u.name || u.fullName || u.displayName || '';
      if (name) return name.startsWith('Dr.') ? name : `Dr. ${name}`;
    } catch (e) {}
  }
  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const name = payload.name || payload.fullName || '';
      if (name) return name.startsWith('Dr.') ? name : `Dr. ${name}`;
    } catch (e) {}
  }
  return 'Dr. User';
}

document.addEventListener('DOMContentLoaded', async () => {
  // Update Welcome Banner Greeting
  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName) {
    welcomeName.innerHTML = `${resolveDoctorName()} <span class="wave">👋</span>`;
  }

  // Set Topbar Date
  const topbarDate = document.getElementById('topbarDate');
  if (topbarDate) {
    const now = new Date();
    topbarDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Load live MongoDB analytics and cases for current profile
  await loadDashboardData();

  // Setup Notification Dropdown
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
          <button onclick="this.closest('.notif-panel').remove()"
            style="background:none;border:none;cursor:pointer;color:var(--warm-gray-400);font-size:1rem">×</button>
        </div>
        <div class="notif-item">
          <div class="notif-dot-blue"></div>
          <div><div class="notif-title">Welcome to Dentrix AI</div>
          <div class="notif-time">Just now</div></div>
        </div>`;
      document.body.appendChild(panel);
      const rect = notifBtn.getBoundingClientRect();
      panel.style.top   = (rect.bottom + 8) + 'px';
      panel.style.right = (window.innerWidth - rect.right) + 'px';
      document.addEventListener('click', () => { panel?.remove(); panel = null; }, { once: true });
    });
  }
});

async function loadDashboardData() {
  try {
    const [analyticsRes, historyRes] = await Promise.all([
      fetch(`${API_BASE}/analytics`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/history`,   { headers: getAuthHeaders() })
    ]);

    let analyticsData = null;
    let historyData = [];

    if (analyticsRes.ok) analyticsData = await analyticsRes.json();
    if (historyRes.ok)   historyData   = await historyRes.json();

    const totalAnalyses = analyticsData?.totalAnalyses ?? (Array.isArray(historyData) ? historyData.length : 0);
    const avgScore      = analyticsData?.avgScore ?? (computeAvgScore(historyData) || 0);
    const totalPatients = analyticsData?.totalPatients ?? 0;
    const retreatments  = analyticsData?.retreatmentsFlagged ?? countRetreatments(historyData);

    // Update KPI Stat Cards
    updateStatCard('[data-count="147"]', totalAnalyses);
    updateStatCard('[data-count="7.4"]', parseFloat(avgScore));
    updateStatCard('[data-count="84"]',  totalPatients);
    updateStatCard('[data-count="2"]',   0);
    updateStatCard('[data-count="18"]',  retreatments);

    // Update Distribution Bars
    updateDistributionBars(analyticsData?.distribution || computeDistribution(historyData));

    // Render Recent Cases Table
    renderRecentCasesTable(historyData);

  } catch (err) {
    console.warn('MongoDB Dashboard load:', err);
    updateStatCard('[data-count="147"]', 0);
    updateStatCard('[data-count="7.4"]', 0);
    updateStatCard('[data-count="84"]',  0);
    updateStatCard('[data-count="2"]',   0);
    updateStatCard('[data-count="18"]',  0);
    renderRecentCasesTable([]);
  }
}

function computeAvgScore(history) {
  if (!Array.isArray(history) || !history.length) return 0;
  const scores = history.map(h => h.score || h.obturationScore).filter(s => typeof s === 'number');
  if (!scores.length) return 0;
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
}

function countRetreatments(history) {
  if (!Array.isArray(history)) return 0;
  return history.filter(h => (h.score || h.obturationScore || 10) < 6.0).length;
}

function computeDistribution(history) {
  const dist = { optimal: 0, acceptable: 0, suboptimal: 0, poor: 0 };
  if (!Array.isArray(history) || !history.length) return dist;

  const scores = history.map(h => h.score || h.obturationScore).filter(s => typeof s === 'number');
  if (!scores.length) return dist;

  return {
    optimal: scores.filter(s => s >= 8.0).length,
    acceptable: scores.filter(s => s >= 6.0 && s < 8.0).length,
    suboptimal: scores.filter(s => s >= 4.0 && s < 6.0).length,
    poor: scores.filter(s => s < 4.0).length
  };
}

function updateStatCard(selector, value) {
  const el = document.querySelector(selector);
  if (!el || value === undefined) return;
  const decimals = parseInt(el.dataset.decimal || 0);
  el.dataset.count = value;
  animateCounter(el, 0, parseFloat(value), 1200, decimals);
}

function updateDistributionBars(dist) {
  if (!dist) return;
  const total = (dist.optimal || 0) + (dist.acceptable || 0) + (dist.suboptimal || 0) + (dist.poor || 0);
  const max = total > 0 ? Math.max(dist.optimal || 0, dist.acceptable || 0, dist.suboptimal || 0, dist.poor || 0) : 1;

  setBar('.chart-bar-fill.optimal', dist.optimal || 0, max);
  setBar('.chart-bar-fill.acceptable', dist.acceptable || 0, max);
  setBar('.chart-bar-fill.suboptimal', dist.suboptimal || 0, max);
  setBar('.chart-bar-fill.poor', dist.poor || 0, max);
}

function setBar(selector, val, max) {
  const el = document.querySelector(selector);
  if (!el) return;
  const pct = max > 0 ? Math.round((val / max) * 100) : 0;
  el.style.setProperty('--h', pct + '%');
  const tip = el.querySelector('.chart-bar-tip');
  if (tip) tip.textContent = val;
}

function renderRecentCasesTable(history) {
  const tbody = document.querySelector('.recent-cases-card .data-table tbody');
  if (!tbody) return;

  if (!Array.isArray(history) || !history.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:36px;color:var(--warm-gray-400);font-size:.875rem">
          No clinical cases recorded yet. Click <strong><a href="analyze.html" style="color:var(--accent)">+ New Analysis</a></strong> or <strong><a href="history.html" style="color:var(--accent)">Case History</a></strong> to log your first case.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = history.slice(0, 6).map(h => {
    const score    = h.score || h.obturationScore || 0;
    const status   = getScoreLabel(score);
    const badge    = `badge-${status.toLowerCase()}`;
    const name     = h.patient?.name || h.patient || 'Patient Record';
    const initials = h.initials || (name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase());
    const id       = h.id || (h.patient?._id ? `#PT-${h.patient._id.slice(-4).toUpperCase()}` : '#PT-????');

    return `
    <tr>
      <td>
        <div class="pt-cell">
          <div class="pt-avatar">${initials}</div>
          <div>
            <div class="pt-name">${name}</div>
            <div class="pt-id">${id}</div>
          </div>
        </div>
      </td>
      <td><span class="tooth-badge">${h.tooth || h.toothNumber || '—'}</span></td>
      <td>${formatDate(h.date || new Date())}</td>
      <td><span class="score-chip ${status.toLowerCase()}">${score}</span></td>
      <td><span class="badge ${badge}">${status}</span></td>
      <td><a href="history.html" class="tbl-link">View →</a></td>
    </tr>`;
  }).join('');
}