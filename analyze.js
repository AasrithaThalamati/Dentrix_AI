/* ============================================================
   ObturaScore AI — Analyze Page JS (MongoDB Connected)
   ============================================================ */

   const API = 'https://dentrix-ai-8k2b.vercel.app/api';
   function getToken() { return localStorage.getItem('dentrix_token'); }
   
   // ── Load real patients from MongoDB ──
   let PATIENTS = [];
   
   async function loadPatients() {
     try {
       const res = await fetch(`${API}/patients`, {
         headers: { 'Authorization': `Bearer ${getToken()}` }
       });
       const data = await res.json();
       PATIENTS = data.map(p => ({
         id:        p._id,
         name:      p.name,
         initials:  p.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(),
         age:       p.age,
         lastScore: p.lastScore || 0
       }));
   
       // Auto-select patient if coming from patients.html
       const params = new URLSearchParams(window.location.search);
       const patientId   = params.get('patientId');
       const patientName = params.get('patientName');
       if (patientId && patientName) {
         selectedPatient = PATIENTS.find(p => p.id === patientId) ||
           { id: patientId, name: decodeURIComponent(patientName) };
         const pcb = document.getElementById('pcbPatient');
         if (pcb) pcb.innerHTML = `
           <svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px;color:var(--optimal)">
             <circle cx="8" cy="6" r="2.5" stroke="currentColor" stroke-width="1.2"/>
             <path d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
           </svg>
           ${decodeURIComponent(patientName)}
           <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--warm-gray-400);margin-left:4px">
             PT-${patientId.slice(-4).toUpperCase()}
           </span>`;
       }
     } catch (err) {
       console.error('Failed to load patients:', err);
     }
   }
   
   // ── State ──
   let currentFile = null;
   let currentScore = null;
   let currentBreakdown = null;
   let selectedPatient = null;
   
   // ── DOM ──
   const fileInput        = document.getElementById('fileInput');
   const dropZone         = document.getElementById('dropZone');
   const previewPanel     = document.getElementById('previewPanel');
   const previewImg       = document.getElementById('previewImg');
   const previewMeta      = document.getElementById('previewMeta');
   const analysisControls = document.getElementById('analysisControls');
   const analyzeBtn       = document.getElementById('analyzeBtn');
   const removeBtn        = document.getElementById('removeBtn');
   const zoomBtn          = document.getElementById('zoomBtn');
   const resultsEmpty     = document.getElementById('resultsEmpty');
   const resultsPanel     = document.getElementById('resultsPanel');
   const processingSteps  = document.getElementById('processingSteps');
   const sensitivitySlider= document.getElementById('sensitivitySlider');
   const sensitivityVal   = document.getElementById('sensitivityVal');
   const annotateToggle   = document.getElementById('annotateToggle');
   
   document.addEventListener('DOMContentLoaded', loadPatients);
   
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
       dropZone.style.display    = 'none';
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
     previewPanel.style.display    = 'none';
     analysisControls.style.display = 'none';
     dropZone.style.display        = 'block';
     resultsPanel.style.display    = 'none';
     resultsEmpty.style.display    = 'block';
     processingSteps.style.display = 'none';
     clearAnnotations();
   }
   
   zoomBtn?.addEventListener('click', () => {
     document.getElementById('zoomImg').src = previewImg.src;
     openModal('zoomModal');
   });
   
   analyzeBtn?.addEventListener('click', runAnalysis);
   
   async function callGrokAnalysis(file) {
     const formData = new FormData();
     formData.append('xray', file);
     const res = await fetch(`${API}/analysis/ai-score`, {
       method: 'POST',
       headers: { 'Authorization': `Bearer ${getToken()}` },
       body: formData
     });
     if (!res.ok) {
       const err = await res.json().catch(() => ({}));
       throw new Error(err.message || 'AI analysis failed');
     }
     return res.json();
   }

   async function runAnalysis() {
     if (!currentFile) return;

     const btnText   = analyzeBtn.querySelector('.btn-text');
     const btnLoader = analyzeBtn.querySelector('.btn-loader');
     btnText.style.display   = 'none';
     btnLoader.style.display = 'flex';
     analyzeBtn.disabled     = true;

     resultsEmpty.style.display    = 'none';
     resultsPanel.style.display    = 'none';
     processingSteps.style.display = 'block';

     for (let i = 1; i <= 6; i++) document.getElementById(`step${i}`).className = 'proc-step';

     const statuses = [
       'Preprocessing image…','Segmenting canal boundaries…',
       'Detecting apex position…','Analysing density…',
       'Evaluating taper geometry…','Generating report…',
     ];

     // Kick off the Grok API call in parallel with the UX animation
     const aiPromise = callGrokAnalysis(currentFile);

     for (let i = 1; i <= 6; i++) {
       const step = document.getElementById(`step${i}`);
       const loaderStatus = document.getElementById('loaderStatus');
       if (loaderStatus) loaderStatus.textContent = statuses[i-1];
       step.className = 'proc-step active';
       await delay(450 + Math.random() * 200);
       step.className = 'proc-step done';
     }

     await delay(300);

     let result;
     try {
       result = await aiPromise;
     } catch (err) {
       console.error('Grok analysis error:', err);
       showToast('AI analysis unavailable — check API key', 'error');
       btnText.style.display   = 'flex';
       btnLoader.style.display = 'none';
       analyzeBtn.disabled     = false;
       processingSteps.style.display = 'none';
       resultsEmpty.style.display    = 'block';
       return;
     }

     currentScore     = result.total;
     currentBreakdown = result;

     displayResults(result);

     btnText.style.display   = 'flex';
     btnLoader.style.display = 'none';
     analyzeBtn.disabled     = false;
     processingSteps.style.display = 'none';

     if (annotateToggle?.checked) addAnnotations(result);
   }
   
   function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
   
   
   function displayResults(r) {
     resultsPanel.style.display = 'block';
     const now = new Date();
     document.getElementById('resultsTs').textContent =
       now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) +
       ' · ' + now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
   
     const ringFill = document.getElementById('ringFill');
     ringFill.style.stroke = getScoreColor(r.total);
     setTimeout(() => { ringFill.style.strokeDashoffset = 427 - (r.total/10)*427; }, 80);
   
     const numEl = document.getElementById('scoreNum');
     animateCounter(numEl, 0, r.total, 1400, 1);
   
     const interp    = getInterpretation(r.total);
     const verdictEl = document.getElementById('scoreVerdict');
     verdictEl.textContent = interp.label;
     verdictEl.style.color = getScoreColor(r.total);
     document.getElementById('scoreDesc').textContent = interp.desc;
   
     document.getElementById('confBar').style.width = r.confidence + '%';
     document.getElementById('confVal').textContent  = r.confidence.toFixed(1) + '%';
   
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
   
     setTimeout(() => resultsPanel.scrollIntoView({behavior:'smooth',block:'start'}), 200);
   }
   
   function setParam(scoreId, barId, findingId, score, max, finding) {
     document.getElementById(scoreId).textContent    = `${score}/${max}`;
     document.getElementById(barId).style.width      = `${(score/max)*100}%`;
     document.getElementById(findingId).textContent  = finding;
   }
   
   // ── Save to MongoDB ── ← THIS IS THE KEY NEW PART
   document.getElementById('saveCaseBtn')?.addEventListener('click', async () => {
     if (!currentScore || !currentFile) {
       showToast('No analysis to save', 'error'); return;
     }
     if (!selectedPatient) {
       showToast('Please select a patient first', 'error'); return;
     }
   
     try {
       const formData = new FormData();
       formData.append('xray',            currentFile);
       formData.append('patientId',       selectedPatient.id);
       formData.append('obturationScore', currentBreakdown.total);
       formData.append('aiReport',        getInterpretation(currentBreakdown.total).clinical);
       formData.append('findings',
         `Length: ${currentBreakdown.length}/4, Density: ${currentBreakdown.density}/3, Taper: ${currentBreakdown.taper}/3`);
       formData.append('status', 'completed');
   
       const res = await fetch(`${API}/analysis`, {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${getToken()}` },
         body: formData  // NO Content-Type header — browser sets it with boundary
       });
   
       if (!res.ok) throw new Error('Save failed');
   
       const saved = await res.json();
   
       // Also save to history
       await fetch(`${API}/history`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${getToken()}`
         },
         body: JSON.stringify({
           patient:   selectedPatient.id,
           analysis:  saved._id,
           treatment: `Obturation Analysis — Score ${currentBreakdown.total}/10`,
           notes:     getInterpretation(currentBreakdown.total).clinical
         })
       });
   
       showToast('Case saved to patient record ✓');
     } catch (err) {
       showToast('Failed to save case', 'error');
       console.error(err);
     }
   });
   
   // ── Patient modal ──
   document.getElementById('selectPatientBtn')?.addEventListener('click', () => {
     renderPatientList(PATIENTS);
     openModal('patientModal');
   });
   
   document.getElementById('patientSearch')?.addEventListener('input', e => {
     const q = e.target.value.toLowerCase();
     renderPatientList(PATIENTS.filter(p =>
       p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)));
   });
   
   function renderPatientList(list) {
     const container = document.getElementById('patientList');
     if (!list.length) {
       container.innerHTML = `<div style="padding:24px;text-align:center;color:var(--warm-gray-400)">No patients found</div>`;
       return;
     }
     container.innerHTML = list.map(p => `
       <div class="patient-list-item" data-id="${p.id}">
         <div class="pli-avatar">${p.initials}</div>
         <div>
           <div class="pli-name">${p.name}</div>
           <div class="pli-meta">PT-${p.id.slice(-4).toUpperCase()} · Age ${p.age}</div>
         </div>
         <div class="pli-score" style="color:${getScoreColor(p.lastScore)}">${p.lastScore || '—'}</div>
       </div>`).join('');
   
     container.querySelectorAll('.patient-list-item').forEach(item => {
       item.addEventListener('click', () => {
         const pt = PATIENTS.find(p => p.id === item.dataset.id);
         if (!pt) return;
         selectedPatient = pt;
         const pcb = document.getElementById('pcbPatient');
         pcb.innerHTML = `
           <svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px;color:var(--optimal)">
             <circle cx="8" cy="6" r="2.5" stroke="currentColor" stroke-width="1.2"/>
             <path d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
           </svg>
           ${pt.name}
           <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--warm-gray-400);margin-left:4px">
             PT-${pt.id.slice(-4).toUpperCase()}
           </span>`;
         closeModal('patientModal');
         showToast(`Patient set to ${pt.name}`);
       });
     });
   }
   
   // ── Annotations ──
   function addAnnotations(r) {
     clearAnnotations();
     const wrap = document.getElementById('imgAnnotations');
     if (!wrap) return;
     const markers = [
       { left:'48%', top:'82%', type:'apex', label:'A' },
       ...(r.density < 2 ? [{left:'52%',top:'55%',type:'void',label:'V'}]:[]),
       ...(r.taper   < 2 ? [{left:'44%',top:'35%',type:'taper',label:'T'}]:[]),
     ];
     markers.forEach((m,i) => {
       const el = document.createElement('div');
       el.className = `annotation-marker ${m.type}`;
       el.style.cssText = `left:${m.left};top:${m.top};transform:translate(-50%,-50%);animation-delay:${i*0.15}s`;
       el.textContent = m.label;
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
       label:'Optimal Obturation', desc:'All parameters within optimal ranges.',
       clinical:'This radiograph demonstrates optimal obturation quality. Length, density, and taper all meet or exceed clinical standards. No immediate intervention indicated. Standard recall protocol recommended at 6 and 12 months.',
       suggestions:[]
     };
     if (score >= 6) return {
       label:'Acceptable Quality', desc:'Minor deviations. Clinically acceptable with monitoring.',
       clinical:'This obturation is clinically acceptable. Minor deviations detected in one or more parameters but do not warrant immediate retreatment. Clinical correlation with patient symptoms is advised. Monitor at 6-month recall appointments.',
       suggestions:[]
     };
     if (score >= 4) return {
       label:'Suboptimal Obturation', desc:'Notable deficiencies. Clinical re-evaluation recommended.',
       clinical:'Suboptimal obturation quality detected across one or more key parameters. Clinical correlation with symptoms and signs is essential. Retreatment should be considered based on symptomatology.',
       suggestions:[
         'Evaluate clinical symptoms — periapical tenderness, swelling, or sinus tract.',
         'Assess for voids or gaps that may harbour bacterial microleakage.',
         'Consider non-surgical retreatment if deficiencies are clinically significant.',
         'Obtain CBCT if 2D radiography is inconclusive for periapical status.',
         'Review at 3-month recall; track any radiographic changes.',
       ]
     };
     return {
       label:'Poor Obturation', desc:'Significant deficiencies. Retreatment strongly advised.',
       clinical:'This radiograph indicates poor obturation quality with significant deficiencies in multiple parameters. Retreatment or extraction with implant planning should be discussed.',
       suggestions:[
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
     <small>${now.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})} · ${selectedPatient?.name || 'Unknown Patient'}</small>
     <div class="score-box"><div class="big-score">${b.total}/10</div><div>${interp.label}</div></div>
     <div class="param"><span>Length Adequacy</span><strong>${b.length}/4</strong></div>
     <div class="param"><span>Density Uniformity</span><strong>${b.density}/3</strong></div>
     <div class="param"><span>Taper Continuity</span><strong>${b.taper}/3</strong></div>
     <div class="param"><span><strong>Total</strong></span><strong>${b.total}/10</strong></div>
     <div class="clinical">${interp.clinical}</div>
     ${interp.suggestions.map(s=>`<div class="sugg">${s}</div>`).join('')}
     <footer>Generated by ObturaScore AI · For research and educational use only</footer>
     </body></html>`;
     const blob = new Blob([html],{type:'text/html'});
     const a = document.createElement('a');
     a.href = URL.createObjectURL(blob);
     a.download = `ObturaScore_${now.toISOString().slice(0,10)}.html`;
     a.click();
   });
   
   document.getElementById('resetBtn')?.addEventListener('click', resetAll);
   
   document.getElementById('shareBtn')?.addEventListener('click', () => {
     if (!currentScore) return;
     const text = `My obturation score: ${currentScore}/10 — ${getInterpretation(currentScore).label} via ObturaScore AI #Endodontics #DentalAI`;
     navigator.clipboard.writeText(text).then(() => showToast('Result text copied to clipboard'));
   });