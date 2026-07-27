/* ============================================================
   Dentrix AI — Analytics JS (Strict Profile Scoped & MongoDB Connected)
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

document.addEventListener('DOMContentLoaded', async () => {
  await loadAnalyticsFromMongoDB();

  // Period Filter selector listener
  document.getElementById('periodSelect')?.addEventListener('change', async () => {
    await loadAnalyticsFromMongoDB();
    showToast('Analytics recalculated for selected period');
  });

  // Export Analytics button
  document.getElementById('exportAnalyticsBtn')?.addEventListener('click', () => {
    exportAnalyticsReport();
  });
});

async function loadAnalyticsFromMongoDB() {
  try {
    const [analyticsRes, historyRes] = await Promise.all([
      fetch(`${API_BASE}/analytics`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/history`,   { headers: getAuthHeaders() })
    ]);

    let analyticsData = null;
    let historyData = [];

    if (analyticsRes.ok) analyticsData = await analyticsRes.json();
    if (historyRes.ok)   historyData   = await historyRes.json();

    const avgScore     = analyticsData?.avgScore ?? (computeAvgScore(historyData) || 0);
    const pctOptimal   = analyticsData?.pctOptimal ?? (computePctOptimal(historyData) || 0);
    const retreatments = analyticsData?.retreatmentsFlagged ?? countRetreatments(historyData);
    const totalCases   = analyticsData?.totalAnalyses ?? (Array.isArray(historyData) ? historyData.length : 0);

    // 1. Update KPI Card Stat Counters
    updateStatCard('[data-count="7.4"]', parseFloat(avgScore));
    updateStatCard('[data-count="62"]',  pctOptimal);
    updateStatCard('[data-count="12"]',  retreatments);
    updateStatCard('[data-count="147"]', totalCases);

    // 2. Update Distribution Breakdown
    updateDistributionUI(analyticsData?.distribution || computeDistribution(historyData));

    // 3. Update Parameter Averages
    updateParameterAveragesUI(analyticsData?.parameterPerformance || computeParameterAverages(historyData));

  } catch (err) {
    console.warn('MongoDB Analytics Load:', err);
    updateStatCard('[data-count="7.4"]', 0);
    updateStatCard('[data-count="62"]',  0);
    updateStatCard('[data-count="12"]',  0);
    updateStatCard('[data-count="147"]', 0);
    updateDistributionUI({ optimal: 0, acceptable: 0, suboptimal: 0, poor: 0 });
    updateParameterAveragesUI({ avgLength: 0, avgDensity: 0, avgTaper: 0 });
  }
}

function updateStatCard(selector, value) {
  const el = document.querySelector(selector);
  if (!el || value === undefined) return;
  const decimals = parseInt(el.dataset.decimal || 0);
  el.dataset.count = value;
  animateCounter(el, 0, parseFloat(value), 1200, decimals);
}

function computeAvgScore(history) {
  if (!Array.isArray(history) || !history.length) return 0;
  const scores = history.map(h => h.score || h.obturationScore).filter(s => typeof s === 'number');
  if (!scores.length) return 0;
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
}

function computePctOptimal(history) {
  if (!Array.isArray(history) || !history.length) return 0;
  const scores = history.map(h => h.score || h.obturationScore).filter(s => typeof s === 'number');
  if (!scores.length) return 0;
  const optimal = scores.filter(s => s >= 8.0).length;
  return Math.round((optimal / scores.length) * 100);
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

function computeParameterAverages(history) {
  if (!Array.isArray(history) || !history.length) return { avgLength: 0, avgDensity: 0, avgTaper: 0 };

  const lengths = history.map(h => h.length).filter(s => typeof s === 'number');
  const densities = history.map(h => h.density).filter(s => typeof s === 'number');
  const tapers = history.map(h => h.taper).filter(s => typeof s === 'number');

  return {
    avgLength: lengths.length ? parseFloat((lengths.reduce((a,b)=>a+b, 0)/lengths.length).toFixed(1)) : 0,
    avgDensity: densities.length ? parseFloat((densities.reduce((a,b)=>a+b, 0)/densities.length).toFixed(1)) : 0,
    avgTaper: tapers.length ? parseFloat((tapers.reduce((a,b)=>a+b, 0)/tapers.length).toFixed(1)) : 0
  };
}

function updateDistributionUI(dist) {
  if (!dist) return;
  const total = (dist.optimal || 0) + (dist.acceptable || 0) + (dist.suboptimal || 0) + (dist.poor || 0);

  setDistributionItem('.dist-item.optimal', dist.optimal || 0, total);
  setDistributionItem('.dist-item.acceptable', dist.acceptable || 0, total);
  setDistributionItem('.dist-item.suboptimal', dist.suboptimal || 0, total);
  setDistributionItem('.dist-item.poor', dist.poor || 0, total);
}

function setDistributionItem(selector, count, total) {
  const item = document.querySelector(selector);
  if (!item) return;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const countEl = item.querySelector('.dist-val');
  const pctEl   = item.querySelector('.dist-pct');
  const barFill = item.querySelector('.dist-bar-fill');

  if (countEl) countEl.textContent = count;
  if (pctEl)   pctEl.textContent   = pct + '%';
  if (barFill) barFill.style.width = pct + '%';
}

function updateParameterAveragesUI(params) {
  if (!params) return;
  const lenVal = document.querySelector('.param-perf-card .len-val');
  const denVal = document.querySelector('.param-perf-card .den-val');
  const tapVal = document.querySelector('.param-perf-card .tap-val');

  if (lenVal) lenVal.textContent = `${params.avgLength || 0} / 4.0`;
  if (denVal) denVal.textContent = `${params.avgDensity || 0} / 3.0`;
  if (tapVal) tapVal.textContent = `${params.avgTaper || 0} / 3.0`;
}

function exportAnalyticsReport() {
  const period = document.getElementById('periodSelect')?.value || 'This Year';
  const text = `DENTRIX AI — CLINICAL ANALYTICS REPORT\n` +
    `======================================\n` +
    `Period: ${period}\n` +
    `Generated: ${new Date().toLocaleString('en-IN')}\n\n` +
    `SUMMARY METRICS\n` +
    `--------------------------------------\n` +
    `Avg Score: ${document.querySelector('[data-count="7.4"]')?.textContent || '0'}/10\n` +
    `Optimal Cases: ${document.querySelector('[data-count="62"]')?.textContent || '0'}%\n` +
    `Retreatments Flagged: ${document.querySelector('[data-count="12"]')?.textContent || '0'}\n` +
    `Total Cases Analysed: ${document.querySelector('[data-count="147"]')?.textContent || '0'}\n\n` +
    `======================================\n` +
    `Dentrix AI · Clinical Performance Analytics`;

  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `DentrixAI_Analytics_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  showToast('Analytics report exported ✓');
}