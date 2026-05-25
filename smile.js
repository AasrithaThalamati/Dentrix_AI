/* ============================================================
   Dentrix AI — Smile Design JS
   Calls local proxy at http://127.0.0.1:5001/api/smile-design
   which forwards to Anthropic Vision API (avoids CORS)
   ============================================================ */

   'use strict';

   const TOOTH_SHAPES = {
     oval: {
       label: 'Oval', color: '#2563eb', bg: '#dbeafe',
       svgPath: `<svg viewBox="0 0 40 60" fill="none"><ellipse cx="20" cy="30" rx="15" ry="26" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/><ellipse cx="20" cy="18" rx="9" ry="7" fill="#bfdbfe" opacity="0.5"/></svg>`,
       description: 'Rounded, natural, balanced. Harmonises with most facial geometries.'
     },
     round: {
       label: 'Round', color: '#059669', bg: '#d1fae5',
       svgPath: `<svg viewBox="0 0 40 60" fill="none"><rect x="5" y="4" width="30" height="52" rx="15" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/><ellipse cx="20" cy="16" rx="10" ry="7" fill="#a7f3d0" opacity="0.5"/></svg>`,
       description: 'Fully rounded edges. Soft and friendly. Softens angular jawlines.'
     },
     square: {
       label: 'Square / Rectangular', color: '#d97706', bg: '#fef3c7',
       svgPath: `<svg viewBox="0 0 40 60" fill="none"><rect x="5" y="4" width="30" height="52" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/><rect x="5" y="4" width="30" height="14" rx="3" fill="#fde68a" opacity="0.6"/></svg>`,
       description: 'Broad, minimal rounding. Projects confidence. Adds length to round faces.'
     },
     triangular: {
       label: 'Triangular', color: '#7c3aed', bg: '#ede9fe',
       svgPath: `<svg viewBox="0 0 40 60" fill="none"><path d="M20 56 L5 4 Q20 1 35 4 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 4 Q20 2 30 4 L25 18 Q20 16 15 18 Z" fill="#ddd6fe" opacity="0.5"/></svg>`,
       description: 'Wider at cervical, narrower at incisal. Youthful and playful appearance.'
     },
     tapered: {
       label: 'Tapered / Pointed Oval', color: '#ea580c', bg: '#ffedd5',
       svgPath: `<svg viewBox="0 0 40 60" fill="none"><path d="M20 56 Q7 40 8 20 Q10 4 20 3 Q30 4 32 20 Q33 40 20 56Z" fill="#ffedd5" stroke="#ea580c" stroke-width="1.5"/><path d="M11 6 Q20 3 29 6 Q24 18 20 18 Q16 18 11 6Z" fill="#fed7aa" opacity="0.6"/></svg>`,
       description: 'Strength of square, softness of oval. Suits narrow and oblong faces.'
     }
   };
   
   const FACE_ICONS = {
     oval:       `<svg viewBox="0 0 56 56" fill="none"><ellipse cx="28" cy="28" rx="18" ry="24" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`,
     round:      `<svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="22" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`,
     square:     `<svg viewBox="0 0 56 56" fill="none"><rect x="6" y="8" width="44" height="40" rx="4" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`,
     heart:      `<svg viewBox="0 0 56 56" fill="none"><path d="M28 46 Q8 30 8 18 Q8 8 18 8 Q24 8 28 14 Q32 8 38 8 Q48 8 48 18 Q48 30 28 46Z" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`,
     diamond:    `<svg viewBox="0 0 56 56" fill="none"><path d="M28 4 L50 28 L28 52 L6 28 Z" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`,
     oblong:     `<svg viewBox="0 0 56 56" fill="none"><ellipse cx="28" cy="28" rx="14" ry="24" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`,
     triangular: `<svg viewBox="0 0 56 56" fill="none"><path d="M28 52 L4 12 Q28 2 52 12 Z" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/></svg>`
   };
   
   async function analyseFaceWithClaude(base64Image, mimeType) {
     const response = await fetch('http://127.0.0.1:5001/api/smile-design', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ base64: base64Image, mimeType })
     });
     if (!response.ok) {
       const err = await response.json().catch(() => ({}));
       throw new Error(err.error || `Server error ${response.status}`);
     }
     return await response.json();
   }
   
   function fileToBase64(file) {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result.split(',')[1]);
       reader.onerror = () => reject(new Error('Failed to read file'));
       reader.readAsDataURL(file);
     });
   }
   
   function showToast(msg, duration = 4000) {
     const toast = document.getElementById('sdToast');
     const msgEl = document.getElementById('sdToastMsg');
     if (!toast || !msgEl) return;
     msgEl.textContent = msg;
     toast.style.display = 'flex';
     setTimeout(() => { toast.style.display = 'none'; }, duration);
   }
   
   function formatFileSize(bytes) {
     if (bytes < 1024) return bytes + ' B';
     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
   }
   
   function getCompatibilityColor(score) {
     if (score >= 80) return '#059669';
     if (score >= 60) return '#d97706';
     return '#dc2626';
   }
   
   function renderResults(result) {
     const faceKey  = (result.faceShape || 'oval').toLowerCase();
     document.getElementById('sdFaceIcon').innerHTML = FACE_ICONS[faceKey] || FACE_ICONS['oval'];
     document.getElementById('sdFaceShapeName').textContent =
       faceKey.charAt(0).toUpperCase() + faceKey.slice(1) + ' Face';
     document.getElementById('sdFaceShapeDesc').textContent = result.faceShapeDescription || '';
   
     const primary   = result.primaryRecommendation;
     const shapeKey  = (primary.toothShape || 'oval').toLowerCase();
     const toothData = TOOTH_SHAPES[shapeKey] || TOOTH_SHAPES['oval'];
   
     document.getElementById('sdPrimaryName').textContent   = toothData.label;
     document.getElementById('sdPrimaryScore').textContent  = primary.compatibilityScore + '%';
     document.getElementById('sdPrimaryReason').textContent = primary.reasoning;
     document.getElementById('sdPrimaryVisual').innerHTML   = [1,2,3,4,5].map(() => toothData.svgPath).join('');
   
     const scores = result.allShapeScores || {};
     document.getElementById('sdCompatGrid').innerHTML = Object.entries(scores)
       .sort(([,a],[,b]) => b - a)
       .map(([shape, score]) => {
         const td = TOOTH_SHAPES[shape] || { label: shape };
         return `<div class="sd-compat-item">
           <div class="sd-compat-name">${td.label}</div>
           <div class="sd-compat-bar-wrap">
             <div class="sd-compat-bar" style="width:0%;background:${getCompatibilityColor(score)}" data-target="${score}"></div>
           </div>
           <div class="sd-compat-pct">${score}%</div>
         </div>`;
       }).join('');
   
     requestAnimationFrame(() => {
       document.querySelectorAll('.sd-compat-bar[data-target]').forEach(bar => {
         bar.style.width = bar.dataset.target + '%';
       });
     });
   
     document.getElementById('sdNotesBody').textContent = result.clinicalNotes || '';
   
     if (result.suggestions?.length) {
       document.getElementById('sdSuggList').innerHTML = result.suggestions.map(s => `<li>${s}</li>`).join('');
       document.getElementById('sdSuggestions').style.display = 'block';
     }
   
     document.getElementById('sdResultsTime').textContent =
       new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
   
     document.getElementById('sdResults').style.display   = 'block';
     document.getElementById('sdIdlePanel').style.display = 'none';
   }
   
   function downloadReport(result) {
     if (!result) return;
     const primary   = result.primaryRecommendation;
     const toothData = TOOTH_SHAPES[(primary.toothShape || 'oval').toLowerCase()] || { label: primary.toothShape };
     const scores    = result.allShapeScores || {};
     const lines = [
       'DENTRIX AI — SMILE DESIGN REPORT', '='.repeat(50),
       `Generated: ${new Date().toLocaleString('en-IN')}`, '',
       'FACE ANALYSIS', '-'.repeat(30),
       `Detected Face Shape: ${(result.faceShape || '').toUpperCase()}`,
       result.faceShapeDescription || '', '',
       'PRIMARY RECOMMENDATION', '-'.repeat(30),
       `Tooth Shape: ${toothData.label}`,
       `Compatibility Score: ${primary.compatibilityScore}%`, '',
       'Clinical Reasoning:', primary.reasoning || '', '',
       'SHAPE COMPATIBILITY SCORES', '-'.repeat(30),
       ...Object.entries(scores).sort(([,a],[,b]) => b-a)
         .map(([s,v]) => `${(TOOTH_SHAPES[s]?.label || s).padEnd(24)} ${v}%`),
       '', 'CLINICAL NOTES', '-'.repeat(30), result.clinicalNotes || '', '',
       'DENTIST RECOMMENDATIONS', '-'.repeat(30),
       ...(result.suggestions || []).map((s,i) => `${i+1}. ${s}`), '',
       '='.repeat(50), 'Dentrix AI · For aesthetic planning only. Not a clinical substitute.'
     ];
     const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
     const url  = URL.createObjectURL(blob);
     const a    = document.createElement('a');
     a.href = url; a.download = `SmileDesign_${Date.now()}.txt`; a.click();
     URL.revokeObjectURL(url);
   }
   
   (function init() {
     let currentFile = null, lastResult = null;
   
     const dropZone     = document.getElementById('sdDropZone');
     const fileInput    = document.getElementById('sdFileInput');
     const preview      = document.getElementById('sdPreview');
     const previewImg   = document.getElementById('sdPreviewImg');
     const previewMeta  = document.getElementById('sdPreviewMeta');
     const removeBtn    = document.getElementById('sdRemoveBtn');
     const analyzeBtn   = document.getElementById('sdAnalyzeBtn');
     const scanLine     = document.getElementById('sdScanLine');
     const resultsPanel = document.getElementById('sdResults');
     const idlePanel    = document.getElementById('sdIdlePanel');
   
     function handleFile(file) {
       if (!file) return;
       if (!file.type.startsWith('image/')) { showToast('Please upload a JPEG or PNG image.'); return; }
       if (file.size > 10 * 1024 * 1024)   { showToast('File too large. Maximum 10 MB.'); return; }
       currentFile = file;
       previewImg.src = URL.createObjectURL(file);
       previewMeta.textContent = `${file.name} · ${formatFileSize(file.size)}`;
       dropZone.style.display = 'none';
       preview.style.display  = 'block';
       resultsPanel.style.display = 'none';
       idlePanel.style.display    = 'flex';
       lastResult = null;
     }
   
     fileInput.addEventListener('change', e => handleFile(e.target.files[0]));
     dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
     dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
     dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('drag-over'); handleFile(e.dataTransfer.files[0]); });
   
     function resetAll() {
       currentFile = null; lastResult = null;
       previewImg.src = ''; fileInput.value = '';
       dropZone.style.display = ''; preview.style.display = 'none';
       scanLine.style.display = 'none'; resultsPanel.style.display = 'none';
       idlePanel.style.display = 'flex';
       document.getElementById('sdSuggestions').style.display = 'none';
     }
   
     removeBtn.addEventListener('click', resetAll);
     document.getElementById('sdResetBtn')?.addEventListener('click', resetAll);
   
     analyzeBtn.addEventListener('click', async () => {
       if (!currentFile) return;
       analyzeBtn.disabled = true;
       analyzeBtn.querySelector('.sd-btn-text').style.display   = 'none';
       analyzeBtn.querySelector('.sd-btn-loader').style.display = 'inline-flex';
       scanLine.style.display = 'block';
   
       try {
         const base64 = await fileToBase64(currentFile);
         const result = await analyseFaceWithClaude(base64, currentFile.type || 'image/jpeg');
         if (result.error === 'no_face') {
           showToast(result.message || 'No clear face detected.'); return;
         }
         lastResult = result;
         renderResults(result);
       } catch (err) {
         console.error(err);
         showToast('Analysis failed: ' + (err.message || 'Unknown error.'));
       } finally {
         analyzeBtn.disabled = false;
         analyzeBtn.querySelector('.sd-btn-text').style.display   = '';
         analyzeBtn.querySelector('.sd-btn-loader').style.display = 'none';
         scanLine.style.display = 'none';
       }
     });
   
     document.getElementById('sdDownloadBtn')?.addEventListener('click', () => {
       if (!lastResult) { showToast('Run an analysis first.'); return; }
       downloadReport(lastResult);
     });
   
     document.getElementById('sdShareBtn')?.addEventListener('click', async () => {
       if (!lastResult) { showToast('Run an analysis first.'); return; }
       const p = lastResult.primaryRecommendation;
       const td = TOOTH_SHAPES[(p.toothShape||'oval').toLowerCase()] || { label: p.toothShape };
       const text = `Dentrix AI Smile Design\nFace: ${lastResult.faceShape} | Tooth: ${td.label} (${p.compatibilityScore}% match)`;
       try {
         if (navigator.share) await navigator.share({ title: 'Smile Design Result', text });
         else { await navigator.clipboard.writeText(text); showToast('Copied to clipboard!', 2500); }
       } catch(e) { showToast('Could not share.'); }
     });
   })();