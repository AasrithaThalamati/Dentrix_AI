/* ============================================================
   ObturaScore AI — Analyze Page JS
   ============================================================ */

// ── Mock patient data ──
const PATIENTS = [
    { id:'PT-0081', name:'Riya Arora',   initials:'RA', age:34, lastScore:8.4 },
    { id:'PT-0080', name:'Manav Khanna', initials:'MK', age:45, lastScore:6.7 },
    { id:'PT-0079', name:'Sonal Patel',  initials:'SP', age:29, lastScore:4.9 },
    { id:'PT-0078', name:'Arjun Joshi',  initials:'AJ', age:52, lastScore:9.1 },
    { id:'PT-0077', name:'Neha Mehta',   initials:'NM', age:38, lastScore:3.2 },
    { id:'PT-0076', name:'Rakesh Iyer',  initials:'RI', age:61, lastScore:7.8 },
    { id:'PT-0075', name:'Priya Desai',  initials:'PD', age:27, lastScore:8.9 },
  ];
  
  // ── State ──
  let currentFile = null;
  let currentScore = null;
  let currentBreakdown = null;
  let selectedPatient = null;
  
  // ── DOM ──
  const fileInput       = document.getElementById('fileInput');
  const dropZone        = document.getElementById('dropZone');
  const previewPanel    = document.getElementById('previewPanel');
  const previewImg      = document.getElementById('previewImg');
  const previewMeta     = document.getElementById('previewMeta');
  const analysisControls= document.getElementById('analysisControls');
  const analyzeBtn      = document.getElementById('analyzeBtn');
  const removeBtn       = document.getElementById('removeBtn');
  const zoomBtn         = document.getElementById('zoomBtn');
  const resultsEmpty    = document.getElementById('resultsEmpty');
  const resultsPanel    = document.getElementById('resultsPanel');
  const processingSteps = document.getElementById('processingSteps');
  const sensitivitySlider = document.getElementById('sensitivitySlider');
  const sensitivityVal  = document.getElementById('sensitivityVal');
  const annotateToggle  = document.getElementById('annotateToggle');
  
  // ── Sensitivity label ──
  sensitivitySlider?.addEventListener('input', () => {
    const labels = ['Conservative', 'Standard', 'Aggressive'];
    sensitivityVal.textContent = labels[sensitivitySlider.value - 1];
  });
  
  // ── File handling ──
  fileInput?.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
  
  dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone?.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  });
  
  function handleFile(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewMeta.textContent = `${file.name}  ·  ${(file.size/1024).toFixed(1)} KB  ·  ${file.type}`;
      dropZone.style.display = 'none';
      previewPanel.style.display = 'block';
      analysisControls.style.display = 'block';
      resultsPanel.style.display = 'none';
      resultsEmpty.style.display = 'block';
      processingSteps.style.display = 'none';
      clearAnnotations();
      currentScore = null;
    };
    reader.readAsDataURL(file);
  }
  
  removeBtn?.addEventListener('click', resetAll);
  
  function resetAll() {
    currentFile = null; currentScore = null;
    previewImg.src = ''; fileInput.value = '';
    previewPanel.style.display = 'none';
    analysisControls.style.display = 'none';
    dropZone.style.display = 'block';
    resultsPanel.style.display = 'none';
    resultsEmpty.style.display = 'block';
    processingSteps.style.display = 'none';
    clearAnnotations();
  }
  
  // ── Zoom ──
  zoomBtn?.addEventListener('click', () => {
    document.getElementById('zoomImg').src = previewImg.src;
    openModal('zoomModal');
  });
  
  // ── Analysis ──
  analyzeBtn?.addEventListener('click', runAnalysis);
  
  async function runAnalysis() {
    if (!currentFile) return;
  
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnLoader = analyzeBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    analyzeBtn.disabled = true;
  
    resultsEmpty.style.display = 'none';
    resultsPanel.style.display = 'none';
    processingSteps.style.display = 'block';
  
    // Reset all steps
    for (let i = 1; i <= 6; i++) {
      const s = document.getElementById(`step${i}`);
      s.className = 'proc-step';
    }
  
    const statuses = [
      'Preprocessing image…',
      'Segmenting canal boundaries…',
      'Detecting apex position…',
      'Analysing density…',
      'Evaluating taper geometry…',
      'Generating report…',
    ];
  
    // Animate steps
    for (let i = 1; i <= 6; i++) {
      const step = document.getElementById(`step${i}`);
      const loaderStatus = document.getElementById('loaderStatus');
      if (loaderStatus) loaderStatus.textContent = statuses[i-1];
      step.className = 'proc-step active';
      await delay(450 + Math.random() * 200);
      step.className = 'proc-step done';
    }
  
    await delay(300);
  
    // Generate result
    const result = generateResult();
    currentScore = result.total;
    currentBreakdown = result;
  
    displayResults(result);
  
    btnText.style.display = 'flex';
    btnLoader.style.display = 'none';
    analyzeBtn.disabled = false;
  
    processingSteps.style.display = 'none';
  
    // Add annotations if toggle is on
    if (annotateToggle?.checked) addAnnotations(result);
  }
  
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
  
  // ── Score Generation ──
  function generateResult() {
    const tier = Math.random();
    let length, density, taper;
    if (tier < 0.12) {
      length  = rnd(0.5, 1.5); density = rnd(0.5, 1.2); taper = rnd(0.5, 1.2);
    } else if (tier < 0.30) {
      length  = rnd(1.5, 2.5); density = rnd(1.2, 2.0); taper = rnd(1.2, 2.0);
    } else if (tier < 0.65) {
      length  = rnd(2.5, 3.5); density = rnd(2.0, 2.7); taper = rnd(2.0, 2.7);
    } else {
      length  = rnd(3.2, 4.0); density = rnd(2.5, 3.0); taper = rnd(2.5, 3.0);
    }
    const clamp = (v, mn, mx) => Math.min(Math.max(parseFloat(v.toFixed(1)), mn), mx);
    length  = clamp(length,  0, 4);
    density = clamp(density, 0, 3);
    taper   = clamp(taper,   0, 3);
    const total = parseFloat((length + density + taper).toFixed(1));
    const confidence = 85 + Math.random() * 13;
    return { length, density, taper, total, confidence: parseFloat(confidence.toFixed(1)) };
  }
  function rnd(min, max) { return Math.random() * (max - min) + min; }
  
  // ── Display ──
  function displayResults(r) {
    resultsPanel.style.display = 'block';
  
    // Timestamp
    const now = new Date();
    document.getElementById('resultsTs').textContent =
      now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
      ' · ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  
    // Ring
    const ringFill = document.getElementById('ringFill');
    const pct = r.total / 10;
    ringFill.style.stroke = getScoreColor(r.total);
    setTimeout(() => { ringFill.style.strokeDashoffset = 427 - pct * 427; }, 80);
  
    // Animate number
    const numEl = document.getElementById('scoreNum');
    animateCounter(numEl, 0, r.total, 1400, 1);
  
    const interp = getInterpretation(r.total);
    const verdictEl = document.getElementById('scoreVerdict');
    verdictEl.textContent = interp.label;
    verdictEl.style.color = getScoreColor(r.total);
    document.getElementById('scoreDesc').textContent = interp.desc;
  
    // Confidence
    document.getElementById('confBar').style.width = r.confidence + '%';
    document.getElementById('confVal').textContent = r.confidence.toFixed(1) + '%';
  
    // Params
    setTimeout(() => {
      setParam('lenScore','lenBar','lenFinding', r.length, 4,
        r.length >= 3.5 ? 'Fill within 0–2mm of apex — adequate' :
        r.length >= 2.5 ? 'Short fill >2mm from apex — monitor' : 'Significantly short / overextension');
      setParam('denScore','denBar','denFinding', r.density, 3,
        r.density >= 2.5 ? 'Homogeneous fill — no voids detected' :
        r.density >= 1.8 ? 'Minor voids <1mm — acceptable' : 'Significant voids / incomplete condensation');
      setParam('tapScore','tapBar','tapFinding', r.taper, 3,
        r.taper >= 2.5 ? 'Smooth continuous taper — optimal geometry' :
        r.taper >= 1.8 ? 'Minor irregularities — acceptable' : 'Irregular / broken taper detected');
    }, 300);
  
    document.getElementById('clinicalBody').textContent = interp.clinical;
  
    const sugBlock = document.getElementById('suggestionsBlock');
    const sugList  = document.getElementById('suggestionsList');
    if (r.total < 6 && interp.suggestions.length) {
      sugBlock.style.display = 'block';
      sugList.innerHTML = interp.suggestions.map(s => `<li>${s}</li>`).join('');
    } else { sugBlock.style.display = 'none'; }
  
    setTimeout(() => resultsPanel.scrollIntoView({ behavior:'smooth', block:'start' }), 200);
  }
  
  function setParam(scoreId, barId, findingId, score, max, finding) {
    document.getElementById(scoreId).textContent = `${score}/${max}`;
    document.getElementById(barId).style.width = `${(score / max) * 100}%`;
    document.getElementById(findingId).textContent = finding;
  }
  
  // ── Annotations ──
  function addAnnotations(r) {
    clearAnnotations();
    const wrap = document.getElementById('imgAnnotations');
    if (!wrap) return;
  
    const markers = [
      { left:'48%', top:'82%', type:'apex', label:'A' },
      ...(r.density < 2 ? [{ left:'52%', top:'55%', type:'void', label:'V' }] : []),
      ...(r.taper   < 2 ? [{ left:'44%', top:'35%', type:'taper',label:'T' }] : []),
    ];
  
    markers.forEach((m, i) => {
      const el = document.createElement('div');
      el.className = `annotation-marker ${m.type}`;
      el.style.left = m.left;
      el.style.top  = m.top;
      el.style.transform = 'translate(-50%,-50%)';
      el.style.animationDelay = `${i * 0.15}s`;
      el.textContent = m.label;
      el.title = m.type === 'apex' ? 'Apex termination' : m.type === 'void' ? 'Void detected' : 'Taper irregularity';
      wrap.appendChild(el);
    });
  }
  function clearAnnotations() {
    const wrap = document.getElementById('imgAnnotations');
    if (wrap) wrap.innerHTML = '';
  }
  
  // ── Interpretation ──
  function getInterpretation(score) {
    if (score >= 8) return {
      label: 'Optimal Obturation',
      desc: 'All parameters within optimal ranges.',
      clinical: 'This radiograph demonstrates optimal obturation quality. Length, density, and taper all meet or exceed clinical standards. No immediate intervention indicated. Standard recall protocol recommended at 6 and 12 months.',
      suggestions: []
    };
    if (score >= 6) return {
      label: 'Acceptable Quality',
      desc: 'Minor deviations. Clinically acceptable with monitoring.',
      clinical: 'This obturation is clinically acceptable. Minor deviations detected in one or more parameters but do not warrant immediate retreatment. Clinical correlation with patient symptoms is advised. Monitor at 6-month recall appointments.',
      suggestions: []
    };
    if (score >= 4) return {
      label: 'Suboptimal Obturation',
      desc: 'Notable deficiencies. Clinical re-evaluation recommended.',
      clinical: 'Suboptimal obturation quality detected across one or more key parameters. Clinical correlation with symptoms and signs is essential. Retreatment should be considered based on symptomatology.',
      suggestions: [
        'Evaluate clinical symptoms — periapical tenderness, swelling, or sinus tract.',
        'Assess for voids or gaps that may harbour bacterial microleakage.',
        'Consider non-surgical retreatment if deficiencies are clinically significant.',
        'Obtain CBCT if 2D radiography is inconclusive for periapical status.',
        'Review at 3-month recall; track any radiographic changes.',
      ]
    };
    return {
      label: 'Poor Obturation',
      desc: 'Significant deficiencies. Retreatment strongly advised.',
      clinical: 'This radiograph indicates poor obturation quality with significant deficiencies in multiple parameters. Coronal seal, apical seal, and canal fill do not meet clinical standards. Retreatment or extraction with implant planning should be discussed.',
      suggestions: [
        'Discuss retreatment vs. extraction options with the patient.',
        'Perform thorough clinical examination — percussion, palpation, mobility.',
        'Assess restorability before planning endodontic retreatment.',
        'Obtain CBCT to evaluate extent of periapical pathology in 3D.',
        'Evaluate for procedural errors — missed canals, instrument separation.',
        'Consult with an endodontist if retreatment complexity is beyond scope.',
        'Document findings comprehensively for medico-legal records.',
      ]
    };
  }
  
  // ── Patient modal ──
  document.getElementById('selectPatientBtn')?.addEventListener('click', () => {
    renderPatientList(PATIENTS);
    openModal('patientModal');
  });
  
  document.getElementById('patientSearch')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderPatientList(PATIENTS.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)));
  });
  
  function renderPatientList(list) {
    const container = document.getElementById('patientList');
    container.innerHTML = list.map(p => `
      <div class="patient-list-item" data-id="${p.id}">
        <div class="pli-avatar">${p.initials}</div>
        <div>
          <div class="pli-name">${p.name}</div>
          <div class="pli-meta">${p.id} · Age ${p.age}</div>
        </div>
        <div class="pli-score" style="color:${getScoreColor(p.lastScore)}">${p.lastScore}</div>
      </div>
    `).join('');
  
    container.querySelectorAll('.patient-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const pt = PATIENTS.find(p => p.id === item.dataset.id);
        if (!pt) return;
        selectedPatient = pt;
        const pcb = document.getElementById('pcbPatient');
        pcb.innerHTML = `<svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px;color:var(--optimal)"><circle cx="8" cy="6" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> ${pt.name} <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--warm-gray-400);margin-left:4px">${pt.id}</span>`;
        closeModal('patientModal');
        showToast(`Patient set to ${pt.name}`);
      });
    });
  }
  
  // ── Save to case ──
  document.getElementById('saveCaseBtn')?.addEventListener('click', () => {
    if (!currentScore) return;
    showToast('Case saved to patient record');
  });
  
  // ── Download report ──
  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    if (!currentScore) return;
    const b = currentBreakdown;
    const interp = getInterpretation(b.total);
    const now = new Date();
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>ObturaScore AI Report</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 32px;color:#1a1916}
    .brand{font-size:1.5rem;color:#2563eb;font-weight:bold;margin-bottom:4px}
    .score-box{background:#1a1916;color:white;border-radius:16px;padding:32px;text-align:center;margin:24px 0}
    .big-score{font-size:4rem;line-height:1;margin-bottom:8px}
    .param{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f4f3f0}
    .clinical{background:#f8f7f4;border:1px solid #e8e6e1;border-radius:12px;padding:20px;font-size:.9rem;line-height:1.7;margin-top:12px}
    .sugg{padding:6px 0 6px 20px;position:relative;font-size:.875rem}
    .sugg::before{content:'→';position:absolute;left:0;color:#ea580c}
    footer{margin-top:48px;padding-top:16px;border-top:1px solid #e8e6e1;font-size:.75rem;color:#a8a49d}
    </style></head><body>
    <div class="brand">ObturaScore<sup>AI</sup></div>
    <small>${now.toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'})} · ${selectedPatient ? selectedPatient.name : 'Unknown Patient'}</small>
    <div class="score-box"><div class="big-score">${b.total}/10</div><div>${interp.label}</div></div>
    <div class="param"><span>Length Adequacy</span><strong>${b.length}/4</strong></div>
    <div class="param"><span>Density Uniformity</span><strong>${b.density}/3</strong></div>
    <div class="param"><span>Taper Continuity</span><strong>${b.taper}/3</strong></div>
    <div class="param"><span><strong>Total</strong></span><strong>${b.total}/10</strong></div>
    <div class="clinical">${interp.clinical}</div>
    ${interp.suggestions.map(s => `<div class="sugg">${s}</div>`).join('')}
    <footer>Generated by ObturaScore AI · For research and educational use only · Not a substitute for clinical judgment</footer>
    </body></html>`;
    const blob = new Blob([html], { type:'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ObturaScore_${now.toISOString().slice(0,10)}.html`;
    a.click();
  });
  
  // ── Reset ──
  document.getElementById('resetBtn')?.addEventListener('click', resetAll);
  
  // ── Share ──
  document.getElementById('shareBtn')?.addEventListener('click', () => {
    if (!currentScore) return;
    const text = `My obturation score: ${currentScore}/10 — ${getInterpretation(currentScore).label} via ObturaScore AI #Endodontics #DentalAI`;
    navigator.clipboard.writeText(text).then(() => showToast('Result text copied to clipboard'));
  });