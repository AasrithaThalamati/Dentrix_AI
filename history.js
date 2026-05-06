/* ============================================================
   ObturaScore AI — Case History JS
   ============================================================ */

// ── Mock case data ──
const CASES = [
    { id:'CA-0147', patient:'Riya Arora',     initials:'RA', pid:'PT-0081', tooth:'26', date:'2026-05-03', score:8.4, length:3.4, density:2.7, taper:2.3, visit:'Post-obturation', confidence:92.1 },
    { id:'CA-0146', patient:'Manav Khanna',   initials:'MK', pid:'PT-0080', tooth:'36', date:'2026-05-02', score:6.7, length:2.8, density:2.1, taper:1.8, visit:'Follow-up',       confidence:88.4 },
    { id:'CA-0145', patient:'Sonal Patel',    initials:'SP', pid:'PT-0079', tooth:'16', date:'2026-04-30', score:4.9, length:2.0, density:1.6, taper:1.3, visit:'Post-obturation', confidence:85.9 },
    { id:'CA-0144', patient:'Arjun Joshi',    initials:'AJ', pid:'PT-0078', tooth:'46', date:'2026-04-29', score:9.1, length:3.8, density:2.8, taper:2.5, visit:'Post-obturation', confidence:94.7 },
    { id:'CA-0143', patient:'Neha Mehta',     initials:'NM', pid:'PT-0077', tooth:'11', date:'2026-04-28', score:3.2, length:1.2, density:1.2, taper:0.8, visit:'Pre-retreatment', confidence:91.2 },
    { id:'CA-0142', patient:'Rakesh Iyer',    initials:'RI', pid:'PT-0076', tooth:'36', date:'2026-04-25', score:7.8, length:3.1, density:2.5, taper:2.2, visit:'Recall',          confidence:89.3 },
    { id:'CA-0141', patient:'Priya Desai',    initials:'PD', pid:'PT-0075', tooth:'21', date:'2026-04-22', score:8.9, length:3.6, density:2.8, taper:2.5, visit:'Post-obturation', confidence:93.8 },
    { id:'CA-0140', patient:'Farhan Sheikh',  initials:'FS', pid:'PT-0074', tooth:'47', date:'2026-04-20', score:5.5, length:2.3, density:1.8, taper:1.4, visit:'Follow-up',       confidence:86.1 },
    { id:'CA-0139', patient:'Kavita Singh',   initials:'KS', pid:'PT-0073', tooth:'15', date:'2026-04-18', score:7.2, length:3.0, density:2.3, taper:1.9, visit:'Recall',          confidence:88.6 },
    { id:'CA-0138', patient:'Deepak Nair',    initials:'DN', pid:'PT-0072', tooth:'14', date:'2026-04-15', score:6.1, length:2.5, density:2.0, taper:1.6, visit:'Post-obturation', confidence:87.2 },
    { id:'CA-0137', patient:'Anjali Verma',   initials:'AV', pid:'PT-0071', tooth:'27', date:'2026-04-10', score:8.3, length:3.3, density:2.6, taper:2.4, visit:'Post-obturation', confidence:91.5 },
    { id:'CA-0136', patient:'Rohan Sharma',   initials:'RS', pid:'PT-0070', tooth:'46', date:'2026-04-05', score:2.8, length:1.0, density:1.1, taper:0.7, visit:'Pre-retreatment', confidence:90.1 },
    { id:'CA-0135', patient:'Riya Arora',     initials:'RA', pid:'PT-0081', tooth:'26', date:'2026-03-28', score:7.6, length:3.2, density:2.3, taper:2.1, visit:'Follow-up',       confidence:88.9 },
    { id:'CA-0134', patient:'Manav Khanna',   initials:'MK', pid:'PT-0080', tooth:'36', date:'2026-03-20', score:5.8, length:2.4, density:1.9, taper:1.5, visit:'Post-obturation', confidence:85.3 },
    { id:'CA-0133', patient:'Arjun Joshi',    initials:'AJ', pid:'PT-0078', tooth:'14', date:'2026-03-10', score:8.7, length:3.5, density:2.7, taper:2.5, visit:'Post-obturation', confidence:92.4 },
  ];
  
  // ── State ──
  let filteredCases = [...CASES];
  let activeId = null;
  
  // ── DOM ──
  const timelineList = document.getElementById('timelineList');
  const caseDetail   = document.getElementById('caseDetail');
  const detailEmpty  = document.getElementById('detailEmpty');
  const caseSearch   = document.getElementById('caseSearch');
  const scoreFilter  = document.getElementById('scoreFilter');
  const dateFilter   = document.getElementById('dateFilter');
  const sortCaseFilter = document.getElementById('sortCaseFilter');
  
  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
  });
  
  // ── Filters ──
  caseSearch?.addEventListener('input', applyFilters);
  scoreFilter?.addEventListener('change', applyFilters);
  dateFilter?.addEventListener('change', applyFilters);
  sortCaseFilter?.addEventListener('change', applyFilters);
  
  function getScoreStatus(s) {
    if (s >= 8) return 'optimal';
    if (s >= 6) return 'acceptable';
    if (s >= 4) return 'suboptimal';
    return 'poor';
  }
  
  function applyFilters() {
    const q     = (caseSearch?.value || '').toLowerCase();
    const score = scoreFilter?.value || '';
    const days  = parseInt(dateFilter?.value) || 0;
    const sort  = sortCaseFilter?.value || 'date';
  
    filteredCases = CASES.filter(c => {
      const textMatch   = c.patient.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.tooth.includes(q);
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
    document.getElementById('caseCount').textContent = `${filteredCases.length} case${filteredCases.length !== 1 ? 's' : ''}`;
  
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
    }).join('') || '<div style="padding:32px;text-align:center;color:var(--warm-gray-400);font-size:.875rem">No cases match your filters</div>';
  }
  
  window.selectCase = function(id) {
    activeId = id;
    renderTimeline(); // re-highlight active
    const c = filteredCases.find(x => x.id === id);
    if (!c) return;
    renderDetail(c);
  };
  
  function renderDetail(c) {
    const status = getScoreStatus(c.score);
    const color  = getScoreColor(c.score);
    const interp = getInterpretation(c.score);
    const circumference = 427;
    const offset = circumference - (c.score / 10) * circumference;
  
    detailEmpty.style.display  = 'none';
    caseDetail.style.display   = 'block';
    caseDetail.innerHTML = `
      <div class="cd-header">
        <div class="cd-av">${c.initials}</div>
        <div>
          <div class="cd-patient-name">${c.patient}</div>
          <div class="cd-sub">${c.pid} · Tooth ${c.tooth} · ${c.visit}</div>
        </div>
        <div class="cd-actions">
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
        <div class="cd-section-title">Clinical Interpretation</div>
        <div class="cd-clinical-text">${interp.clinical}</div>
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
  
  function getInterpretation(score) {
    if (score >= 8) return {
      label: 'Optimal Obturation',
      clinical: 'This radiograph demonstrates optimal obturation quality. Length, density, and taper all meet or exceed clinical standards. No immediate intervention indicated. Standard recall protocol recommended at 6 and 12 months.',
      suggestions: []
    };
    if (score >= 6) return {
      label: 'Acceptable Quality',
      clinical: 'Clinically acceptable obturation with minor deviations detected in one or more parameters. These do not warrant immediate retreatment. Monitor at 6-month recall appointments and correlate with symptoms.',
      suggestions: []
    };
    if (score >= 4) return {
      label: 'Suboptimal Obturation',
      clinical: 'Suboptimal obturation quality detected. Clinical correlation with patient symptoms is essential. Retreatment should be considered based on symptomatology and periapical status.',
      suggestions: [
        'Evaluate clinical symptoms — periapical tenderness, swelling, or sinus tract.',
        'Assess for voids or gaps that may harbour bacterial microleakage.',
        'Consider non-surgical retreatment if deficiencies are clinically significant.',
        'Obtain CBCT if 2D radiography is inconclusive.',
      ]
    };
    return {
      label: 'Poor Obturation',
      clinical: 'Significant deficiencies detected across multiple parameters. Coronal and apical seals do not meet clinical standards. Retreatment or extraction with implant planning should be discussed.',
      suggestions: [
        'Discuss retreatment vs. extraction with the patient.',
        'Perform full clinical examination — percussion, palpation, mobility.',
        'Assess restorability before planning retreatment.',
        'Obtain CBCT to evaluate periapical pathology in 3D.',
        'Consult endodontist if retreatment complexity exceeds scope.',
      ]
    };
  }
  
  window.downloadReport = function(id) {
    const c = CASES.find(x => x.id === id);
    if (!c) return;
    const interp = getInterpretation(c.score);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>ObturaScore Report ${c.id}</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 32px;color:#1a1916}
    .brand{font-size:1.5rem;color:#2563eb;font-weight:bold}
    .box{background:#1a1916;color:white;border-radius:16px;padding:32px;text-align:center;margin:24px 0}
    .big{font-size:4rem;line-height:1;margin-bottom:8px}
    .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0}
    .clinical{background:#f8f7f4;border:1px solid #e8e6e1;border-radius:12px;padding:20px;font-size:.9rem;line-height:1.7;margin:12px 0}
    .sugg{padding:6px 0 6px 20px;position:relative;font-size:.875rem}.sugg::before{content:'→';position:absolute;left:0;color:#ea580c}
    footer{margin-top:48px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:.72rem;color:#999}
    </style></head><body>
    <div class="brand">ObturaScore<sup>AI</sup></div>
    <p style="font-family:monospace;font-size:.8rem;color:#888">${c.id} · ${c.patient} · Tooth ${c.tooth} · ${formatDate(c.date)}</p>
    <div class="box"><div class="big">${c.score}/10</div><div>${interp.label}</div></div>
    <div class="row"><span>Length Adequacy</span><strong>${c.length}/4</strong></div>
    <div class="row"><span>Density Uniformity</span><strong>${c.density}/3</strong></div>
    <div class="row"><span>Taper Continuity</span><strong>${c.taper}/3</strong></div>
    <div class="row"><span><strong>Total</strong></span><strong>${c.score}/10</strong></div>
    <div class="clinical">${interp.clinical}</div>
    ${interp.suggestions.map(s=>`<div class="sugg">${s}</div>`).join('')}
    <footer>ObturaScore AI · For research and educational use only · Not a substitute for clinical judgment</footer>
    </body></html>`;
    const blob = new Blob([html], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ObturaScore_${c.id}.html`;
    a.click();
    showToast('Report downloaded');
  };
  
  window.shareCase = function(id) {
    const c = CASES.find(x => x.id === id);
    if (!c) return;
    const text = `${c.patient} · Tooth ${c.tooth} · Obturation Score: ${c.score}/10 (${getInterpretation(c.score).label}) via ObturaScore AI`;
    navigator.clipboard.writeText(text).then(() => showToast('Case details copied'));
  };
  
  // ── Export CSV ──
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const headers = ['Case ID','Patient','Tooth','Date','Visit Type','Total Score','Length','Density','Taper','Status'];
    const rows = filteredCases.map(c => [
      c.id, c.patient, c.tooth, c.date, c.visit, c.score, c.length, c.density, c.taper, getScoreStatus(c.score)
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ObturaScore_Cases_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast('CSV exported');
  });