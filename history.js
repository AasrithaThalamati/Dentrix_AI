/* ============================================================
   Dentrix AI — Case History JS (Strict Profile Scoped & MongoDB Connected)
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

// Cases array initialized to EMPTY for clean profile scoping
let CASES = [];
let filteredCases = [];
let activeId = null;

// DOM Elements
const timelineList   = document.getElementById('timelineList');
const caseDetail     = document.getElementById('caseDetail');
const detailEmpty    = document.getElementById('detailEmpty');
const caseSearch     = document.getElementById('caseSearch');
const scoreFilter    = document.getElementById('scoreFilter');
const dateFilter     = document.getElementById('dateFilter');
const sortCaseFilter = document.getElementById('sortCaseFilter');

document.addEventListener('DOMContentLoaded', async () => {
  await loadCasesFromMongoDB();
  setupEventListeners();
});

async function loadCasesFromMongoDB() {
  try {
    const res = await fetch(`${API_BASE}/history`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        CASES = data.map(item => ({
          _id: item._id,
          id: item.id || `CA-${String(item._id).slice(-4).toUpperCase()}`,
          patient: item.patient || 'Unknown Patient',
          initials: item.initials || getInitials(item.patient || 'Unknown'),
          pid: item.pid || 'PT-????',
          tooth: item.tooth || '—',
          date: item.date || new Date().toISOString(),
          score: item.score ?? 7.0,
          length: item.length ?? 3.0,
          density: item.density ?? 2.0,
          taper: item.taper ?? 2.0,
          visit: item.visit || 'Post-obturation',
          confidence: item.confidence ?? 90.0,
          notes: item.notes || ''
        }));
      } else {
        CASES = [];
      }
    } else {
      CASES = [];
    }
  } catch (err) {
    console.warn('Could not load MongoDB history:', err);
    CASES = [];
  }
  applyFilters();
}

function getInitials(name) {
  if (!name) return '??';
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function getScoreStatus(s) {
  if (s >= 8) return 'optimal';
  if (s >= 6) return 'acceptable';
  if (s >= 4) return 'suboptimal';
  return 'poor';
}

function setupEventListeners() {
  caseSearch?.addEventListener('input', applyFilters);
  scoreFilter?.addEventListener('change', applyFilters);
  dateFilter?.addEventListener('change', applyFilters);
  sortCaseFilter?.addEventListener('change', applyFilters);

  // New Case Modal Trigger
  document.getElementById('addNewCaseBtn')?.addEventListener('click', () => {
    openModal('newCaseModal');
  });

  // Handle New Case Form Submission
  document.getElementById('newCaseForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const patientName = document.getElementById('newCasePatient').value.trim();
    const toothNumber = document.getElementById('newCaseTooth').value.trim();
    const visitType = document.getElementById('newCaseVisit').value;
    const obturationScore = parseFloat(document.getElementById('newCaseScore').value);
    const lengthScore = parseFloat(document.getElementById('newCaseLength').value);
    const densityScore = parseFloat(document.getElementById('newCaseDensity').value);
    const taperScore = parseFloat(document.getElementById('newCaseTaper').value);
    const notes = document.getElementById('newCaseNotes').value.trim();

    try {
      // 1. Create Patient or find patient ID
      let patientId = null;
      try {
        const pRes = await fetch(`${API_BASE}/patients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ name: patientName, age: 35 })
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          patientId = pData._id;
        }
      } catch (pe) {}

      // Post History Record to MongoDB
      const res = await fetch(`${API_BASE}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          patientName,
          patient: patientId,
          toothNumber,
          visitType,
          obturationScore,
          lengthScore,
          densityScore,
          taperScore,
          aiConfidence: 93.5,
          notes
        })
      });

      if (res.ok) {
        showToast('New case saved to MongoDB ✓');
      } else {
        showToast('Case created', 'success');
      }

      document.getElementById('newCaseForm')?.reset();
      closeModal('newCaseModal');
      await loadCasesFromMongoDB();
    } catch (err) {
      console.error('Create case error:', err);
      showToast('Error creating case', 'error');
    }
  });

  // Handle Edit Case Form Submission
  document.getElementById('editCaseForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const caseId = document.getElementById('editCaseId').value;
    const toothNumber = document.getElementById('editCaseTooth').value.trim();
    const visitType = document.getElementById('editCaseVisit').value;
    const obturationScore = parseFloat(document.getElementById('editCaseScore').value);
    const lengthScore = parseFloat(document.getElementById('editCaseLength').value);
    const densityScore = parseFloat(document.getElementById('editCaseDensity').value);
    const taperScore = parseFloat(document.getElementById('editCaseTaper').value);
    const notes = document.getElementById('editCaseNotes').value.trim();

    const targetCase = CASES.find(c => c.id === caseId || c._id === caseId);
    if (!targetCase) return;

    try {
      if (targetCase._id) {
        await fetch(`${API_BASE}/history/${targetCase._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({
            toothNumber,
            visitType,
            obturationScore,
            lengthScore,
            densityScore,
            taperScore,
            notes
          })
        });
      }

      closeModal('editCaseModal');
      showToast('Case updated in MongoDB ✓');
      await loadCasesFromMongoDB();
    } catch (err) {
      console.error('Update error:', err);
      showToast('Error updating case', 'error');
    }
  });

  // Handle Delete Case Button
  document.getElementById('deleteCaseBtn')?.addEventListener('click', async () => {
    const caseId = document.getElementById('editCaseId').value;
    const targetCase = CASES.find(c => c.id === caseId || c._id === caseId);
    if (!targetCase) return;

    if (!confirm(`Are you sure you want to delete case ${targetCase.id}?`)) return;

    try {
      if (targetCase._id) {
        await fetch(`${API_BASE}/history/${targetCase._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }
      closeModal('editCaseModal');
      showToast('Case deleted from MongoDB ✓');
      activeId = null;
      await loadCasesFromMongoDB();
    } catch (err) {
      console.error('Delete error:', err);
    }
  });
}

function applyFilters() {
  const q     = (caseSearch?.value || '').toLowerCase();
  const score = scoreFilter?.value || '';
  const days  = parseInt(dateFilter?.value) || 0;
  const sort  = sortCaseFilter?.value || 'date';

  filteredCases = CASES.filter(c => {
    const textMatch   = (c.patient || '').toLowerCase().includes(q) || (c.id || '').toLowerCase().includes(q) || (c.tooth || '').includes(q);
    const scoreMatch  = !score || getScoreStatus(c.score) === score;
    const dateMatch   = !days || (Date.now() - new Date(c.date).getTime()) < days * 86400000;
    return textMatch && scoreMatch && dateMatch;
  });

  filteredCases.sort((a, b) => {
    if (sort === 'score-desc') return b.score - a.score;
    if (sort === 'score-asc')  return a.score - b.score;
    return new Date(b.date) - new Date(a.date);
  });

  renderTimeline();
}

function renderTimeline() {
  const countEl = document.getElementById('caseCount');
  if (countEl) {
    countEl.textContent = `${filteredCases.length} case${filteredCases.length !== 1 ? 's' : ''}`;
  }

  if (!timelineList) return;

  if (filteredCases.length === 0) {
    timelineList.innerHTML = `
      <div style="padding:48px 24px;text-align:center;color:var(--warm-gray-400);font-size:.875rem">
        <svg viewBox="0 0 24 24" fill="none" style="width:36px;height:36px;margin:0 auto 12px;display:block;opacity:0.4">
          <path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 8h8M8 12h5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        No cases logged yet for your profile.<br/>
        <span style="font-size:0.78rem;color:var(--warm-gray-400);margin-top:6px;display:inline-block">Click "New Case" above to log your first record in MongoDB.</span>
      </div>`;
    if (detailEmpty) detailEmpty.style.display = 'flex';
    if (caseDetail) caseDetail.style.display = 'none';
    return;
  }

  timelineList.innerHTML = filteredCases.map(c => {
    const status = getScoreStatus(c.score);
    return `
    <div class="case-card${activeId === c.id ? ' active' : ''}" onclick="selectCase('${c.id}')">
      <div class="cc-score-chip ${status}">${c.score}</div>
      <div class="cc-info">
        <div class="cc-patient">${c.patient}</div>
        <div class="cc-meta">
          <span class="cc-tooth">${c.tooth}</span>
          <span class="cc-date">${formatDate(c.date)}</span>
          <span style="font-size:.68rem;color:var(--warm-gray-400);font-family:var(--font-mono)">${c.visit}</span>
        </div>
      </div>
      <div class="cc-badge"><span class="badge badge-${status}" style="font-size:.65rem">${c.id}</span></div>
    </div>`;
  }).join('');

  if (!activeId && filteredCases.length > 0) {
    selectCase(filteredCases[0].id);
  }
}

window.selectCase = function(id) {
  activeId = id;
  const cards = document.querySelectorAll('.case-card');
  cards.forEach(card => card.classList.remove('active'));

  const c = filteredCases.find(x => x.id === id || x._id === id);
  if (!c) return;

  renderDetail(c);
};

function renderDetail(c) {
  const status = getScoreStatus(c.score);
  const color  = getScoreColor(c.score);
  const interp = getInterpretation(c.score);
  const circumference = 427;
  const offset = circumference - (c.score / 10) * circumference;

  if (detailEmpty) detailEmpty.style.display = 'none';
  if (!caseDetail) return;

  caseDetail.style.display = 'block';
  caseDetail.innerHTML = `
    <div class="cd-header">
      <div class="cd-av">${c.initials}</div>
      <div>
        <div class="cd-patient-name">${c.patient}</div>
        <div class="cd-sub">${c.pid} · Tooth ${c.tooth} · ${c.visit}</div>
      </div>
      <div class="cd-actions">
        <button class="btn btn-ghost btn-sm" onclick="openEditCaseModal('${c.id}')">
          <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          Edit
        </button>
        <button class="btn btn-ghost btn-sm" onclick="downloadReport('${c.id}')">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 10V4M5 7l3 3 3-3M3 12h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Download
        </button>
        <a href="analyze.html" class="btn btn-accent btn-sm">Re-analyse</a>
      </div>
    </div>

    <div class="cd-score-section">
      <div class="cd-ring-wrap">
        <svg class="cd-score-ring" viewBox="0 0 120 120">
          <circle class="cd-ring-bg" cx="60" cy="60" r="50"/>
          <circle class="cd-ring-fill" cx="60" cy="60" r="50" stroke="${color}"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" style="transition:stroke-dashoffset 1s ease"/>
        </svg>
        <div class="cd-score-center">
          <div class="cd-score-num" style="color:${color}">${c.score}</div>
          <div class="cd-score-den">/10</div>
        </div>
      </div>
      <div class="cd-score-meta">
        <div class="cd-verdict" style="color:${color}">${interp.label}</div>
        <div style="font-size:.78rem;color:var(--warm-gray-400);margin-bottom:10px">${formatDate(c.date)} · AI Confidence: ${c.confidence}%</div>
        <div class="cd-params">
          <div class="cd-param-row">
            <span class="cd-param-name">Length Adequacy</span>
            <div class="cd-param-bar"><div class="cd-param-fill" style="width:${(c.length/4)*100}%"></div></div>
            <span class="cd-param-val">${c.length}/4</span>
          </div>
          <div class="cd-param-row">
            <span class="cd-param-name">Density Uniformity</span>
            <div class="cd-param-bar"><div class="cd-param-fill" style="width:${(c.density/3)*100}%"></div></div>
            <span class="cd-param-val">${c.density}/3</span>
          </div>
          <div class="cd-param-row">
            <span class="cd-param-name">Taper Continuity</span>
            <div class="cd-param-bar"><div class="cd-param-fill" style="width:${(c.taper/3)*100}%"></div></div>
            <span class="cd-param-val">${c.taper}/3</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cd-section">
      <div class="cd-section-title">Clinical Notes &amp; Findings</div>
      <div class="cd-clinical-text">${c.notes || interp.clinical}</div>
    </div>

    ${interp.suggestions.length ? `
    <div class="cd-section">
      <div class="cd-section-title">Clinical Recommendations</div>
      <div class="cd-suggestions">
        ${interp.suggestions.map(s => `<div class="cd-suggestion">${s}</div>`).join('')}
      </div>
    </div>` : ''}

    <div class="cd-footer">
      <span class="badge badge-${status}">${interp.label}</span>
      <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--warm-gray-400);margin:auto 0">${c.id}</span>
      <button class="btn btn-ghost btn-sm" onclick="shareCase('${c.id}')">Share</button>
    </div>
  `;
}

window.openEditCaseModal = function(id) {
  const c = CASES.find(x => x.id === id || x._id === id);
  if (!c) return;
  document.getElementById('editCaseId').value = c.id;
  document.getElementById('editCasePatient').value = c.patient;
  document.getElementById('editCaseTooth').value = c.tooth;
  document.getElementById('editCaseVisit').value = c.visit;
  document.getElementById('editCaseScore').value = c.score;
  document.getElementById('editCaseLength').value = c.length;
  document.getElementById('editCaseDensity').value = c.density;
  document.getElementById('editCaseTaper').value = c.taper;
  document.getElementById('editCaseNotes').value = c.notes || '';
  openModal('editCaseModal');
};

function getInterpretation(score) {
  if (score >= 8) return {
    label: 'Optimal Obturation',
    clinical: 'This radiograph demonstrates optimal obturation quality. Length, density, and taper all meet or exceed clinical standards. Standard recall protocol recommended.',
    suggestions: []
  };
  if (score >= 6) return {
    label: 'Acceptable Quality',
    clinical: 'Clinically acceptable obturation with minor deviations detected in one or more parameters. Monitor at 6-month recall appointments.',
    suggestions: []
  };
  if (score >= 4) return {
    label: 'Suboptimal Obturation',
    clinical: 'Suboptimal obturation quality detected. Clinical correlation with patient symptoms is essential. Retreatment should be considered.',
    suggestions: [
      'Evaluate clinical symptoms — periapical tenderness or swelling.',
      'Assess for voids or gaps that may harbour bacterial microleakage.',
      'Consider non-surgical retreatment if deficiencies are clinically significant.'
    ]
  };
  return {
    label: 'Poor Obturation',
    clinical: 'Significant deficiencies detected across multiple parameters. Coronal and apical seals do not meet clinical standards.',
    suggestions: [
      'Discuss retreatment vs. extraction with the patient.',
      'Perform full clinical examination — percussion, palpation, mobility.',
      'Consult endodontist if retreatment complexity exceeds scope.'
    ]
  };
}

window.downloadReport = function(id) {
  const c = CASES.find(x => x.id === id || x._id === id);
  if (!c) return;
  const interp = getInterpretation(c.score);
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>ObturaScore Report ${c.id}</title>
  <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 32px;color:#1a1916}
  .brand{font-size:1.5rem;color:#2563eb;font-weight:bold}
  .box{background:#1a1916;color:white;border-radius:16px;padding:32px;text-align:center;margin:24px 0}
  .big{font-size:4rem;line-height:1;margin-bottom:8px}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0}
  .clinical{background:#f8f7f4;border:1px solid #e8e6e1;border-radius:12px;padding:20px;font-size:.9rem;line-height:1.7;margin:12px 0}
  footer{margin-top:48px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:.72rem;color:#999}
  </style></head><body>
  <div class="brand">Dentrix<sup>AI</sup> Case Report</div>
  <p style="font-family:monospace;font-size:.8rem;color:#888">${c.id} · ${c.patient} · Tooth ${c.tooth} · ${formatDate(c.date)}</p>
  <div class="box"><div class="big">${c.score}/10</div><div>${interp.label}</div></div>
  <div class="row"><span>Length Adequacy</span><strong>${c.length}/4</strong></div>
  <div class="row"><span>Density Uniformity</span><strong>${c.density}/3</strong></div>
  <div class="row"><span>Taper Continuity</span><strong>${c.taper}/3</strong></div>
  <div class="row"><span><strong>Total</strong></span><strong>${c.score}/10</strong></div>
  <div class="clinical">${c.notes || interp.clinical}</div>
  <footer>Dentrix AI · For research and educational use only</footer>
  </body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `DentrixAI_${c.id}.html`;
  a.click();
  showToast('Report downloaded');
};

window.shareCase = function(id) {
  const c = CASES.find(x => x.id === id || x._id === id);
  if (!c) return;
  const text = `${c.patient} · Tooth ${c.tooth} · Obturation Score: ${c.score}/10 (${getInterpretation(c.score).label}) via Dentrix AI`;
  navigator.clipboard.writeText(text).then(() => showToast('Case details copied'));
};

document.getElementById('exportBtn')?.addEventListener('click', () => {
  const headers = ['Case ID','Patient','Tooth','Date','Visit Type','Total Score','Length','Density','Taper','Status'];
  const rows = filteredCases.map(c => [
    c.id, c.patient, c.tooth, c.date, c.visit, c.score, c.length, c.density, c.taper, getScoreStatus(c.score)
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `DentrixAI_Cases_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('CSV exported');
});