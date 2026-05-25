/* ============================================================
   ObturaScore AI — Application Logic
   ============================================================ */

// ── State ──
let currentScore = null;
let currentBreakdown = null;
let currentFile = null;

// ── DOM References ──
const fileInput       = document.getElementById('fileInput');
const dropZone        = document.getElementById('dropZone');
const previewState    = document.getElementById('previewState');
const previewImg      = document.getElementById('previewImg');
const previewMeta     = document.getElementById('previewMeta');
const analyzeBtn      = document.getElementById('analyzeBtn');
const removeBtn       = document.getElementById('removeBtn');
const resultsPanel    = document.getElementById('resultsPanel');
const shareModal      = document.getElementById('shareModal');
const shareBtn        = document.getElementById('shareBtn');
const downloadBtn     = document.getElementById('downloadBtn');
const resetBtn        = document.getElementById('resetBtn');
const modalClose      = document.getElementById('modalClose');
const hamburger       = document.getElementById('hamburger');
const mobileMenu      = document.getElementById('mobileMenu');

// ── Mobile Menu ──
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── File Handling ──
fileInput.addEventListener('change', (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleFile(file);
});

function handleFile(file) {
  currentFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewMeta.textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB · ${file.type}`;
    dropZone.style.display = 'none';
    previewState.style.display = 'block';
    resultsPanel.style.display = 'none';
    currentScore = null;
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', resetUpload);

function resetUpload() {
  currentFile = null;
  currentScore = null;
  previewImg.src = '';
  fileInput.value = '';
  previewState.style.display = 'none';
  dropZone.style.display = 'flex';
  dropZone.style.flexDirection = 'column';
  dropZone.style.alignItems = 'center';
  resultsPanel.style.display = 'none';
}

// ── Analysis Engine ──
analyzeBtn.addEventListener('click', runAnalysis);

async function runAnalysis() {
  if (!currentFile) return;

  const btnText = analyzeBtn.querySelector('.btn-text');
  const btnLoader = analyzeBtn.querySelector('.btn-loader');
  btnText.style.display = 'none';
  btnLoader.style.display = 'flex';
  analyzeBtn.disabled = true;

  // Simulate AI processing with realistic timing
  await delay(600);
  await simulateProcessingSteps();

  const result = generateAnalysisResult();
  currentScore = result.total;
  currentBreakdown = result;

  displayResults(result);

  btnText.style.display = 'block';
  btnLoader.style.display = 'none';
  analyzeBtn.disabled = false;
}

async function simulateProcessingSteps() {
  const steps = [
    { delay: 400 },
    { delay: 600 },
    { delay: 500 },
    { delay: 400 },
  ];
  for (const step of steps) {
    await delay(step.delay);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Weighted random result generator simulating AI scoring
function generateAnalysisResult() {
  const rand = () => Math.random();

  const lengthMax = 4;
  const densityMax = 3;
  const taperMax = 3;

  const qualityTier = rand();

  let length, density, taper;

  if (qualityTier < 0.12) {
    length  = randomInRange(0.5, 1.5);
    density = randomInRange(0.5, 1.2);
    taper   = randomInRange(0.5, 1.2);
  } else if (qualityTier < 0.3) {
    length  = randomInRange(1.5, 2.5);
    density = randomInRange(1.2, 2.0);
    taper   = randomInRange(1.2, 2.0);
  } else if (qualityTier < 0.65) {
    length  = randomInRange(2.5, 3.5);
    density = randomInRange(2.0, 2.7);
    taper   = randomInRange(2.0, 2.7);
  } else {
    length  = randomInRange(3.2, 4.0);
    density = randomInRange(2.5, 3.0);
    taper   = randomInRange(2.5, 3.0);
  }

  length  = clamp(parseFloat(length.toFixed(1)),  0, lengthMax);
  density = clamp(parseFloat(density.toFixed(1)), 0, densityMax);
  taper   = clamp(parseFloat(taper.toFixed(1)),   0, taperMax);
  const total = parseFloat((length + density + taper).toFixed(1));

  return { length, density, taper, total, lengthMax, densityMax, taperMax };
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ── Display Results ──
function displayResults(result) {
  resultsPanel.style.display = 'block';

  const now = new Date();
  document.getElementById('resultsTimestamp').textContent =
    now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
    ' · ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  const ringFill = document.getElementById('ringFill');
  const circumference = 427;
  const pct = result.total / 10;
  const offset = circumference - pct * circumference;

  const ringColor = getScoreColor(result.total);
  ringFill.style.stroke = ringColor;

  setTimeout(() => {
    ringFill.style.strokeDashoffset = offset;
  }, 100);

  animateNumber('scoreNum', 0, result.total, 1500);

  const interpretation = getInterpretation(result.total);
  document.getElementById('scoreLabel').textContent = interpretation.label;
  document.getElementById('scoreLabel').style.color = ringColor;
  document.getElementById('scoreDesc').textContent = interpretation.desc;

  setTimeout(() => {
    setBreakdown('lengthScore', 'lengthBar', result.length, result.lengthMax);
    setBreakdown('densityScore', 'densityBar', result.density, result.densityMax);
    setBreakdown('taperScore', 'taperBar', result.taper, result.taperMax);
  }, 300);

  document.getElementById('clinicalBody').textContent = interpretation.clinical;

  const suggestionsCard = document.getElementById('suggestionsCard');
  if (result.total < 6) {
    suggestionsCard.style.display = 'block';
    const list = document.getElementById('suggestionsList');
    list.innerHTML = '';
    interpretation.suggestions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      list.appendChild(li);
    });
  } else {
    suggestionsCard.style.display = 'none';
  }

  updateShareCard(result, interpretation);

  setTimeout(() => {
    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

function setBreakdown(scoreId, barId, score, max) {
  document.getElementById(scoreId).textContent = `${score}/${max}`;
  const pct = (score / max) * 100;
  document.getElementById(barId).style.width = `${pct}%`;
}

function animateNumber(id, from, to, duration) {
  const el = document.getElementById(id);
  const start = performance.now();
  const update = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = from + (to - from) * ease;
    el.textContent = value.toFixed(1);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function getScoreColor(score) {
  if (score >= 8) return '#059669';
  if (score >= 6) return '#d97706';
  if (score >= 4) return '#ea580c';
  return '#dc2626';
}

function getInterpretation(score) {
  if (score >= 8) return {
    label: 'Optimal Obturation',
    desc: 'All three parameters within optimal ranges. Excellent clinical outcome achieved.',
    clinical: 'This radiograph demonstrates optimal obturation quality. Length, density, and taper all meet or exceed clinical standards. No immediate intervention indicated. Standard recall protocol recommended.',
    suggestions: []
  };
  if (score >= 6) return {
    label: 'Acceptable Quality',
    desc: 'Minor deviations detected. Clinically acceptable with monitoring recommended.',
    clinical: 'This obturation is clinically acceptable. Minor deviations were detected in one or more parameters, but do not warrant immediate retreatment. Clinical correlation with patient symptoms advised. Monitor at 6-month recall appointments.',
    suggestions: []
  };
  if (score >= 4) return {
    label: 'Suboptimal Obturation',
    desc: 'Notable deficiencies identified. Clinical re-evaluation strongly recommended.',
    clinical: 'Suboptimal obturation quality detected across one or more key parameters. Clinical correlation with patient symptoms and signs is essential. Retreatment should be considered based on radiographic findings and symptomatology.',
    suggestions: [
      'Evaluate clinical symptoms — periapical tenderness, swelling, or sinus tract may indicate failing obturation.',
      'Assess for voids or gaps in the obturation that may harbor bacterial microleakage.',
      'Consider non-surgical retreatment if length or density deficiencies are clinically significant.',
      'Obtain CBCT if 2D radiography is inconclusive for periapical status assessment.',
      'Document and review at 3-month recall; track any radiographic progression.',
    ]
  };
  return {
    label: 'Poor Obturation',
    desc: 'Significant deficiencies across parameters. Retreatment strongly advised.',
    clinical: 'This radiograph indicates poor obturation quality with significant deficiencies in multiple parameters. Coronal seal, apical seal, and/or canal fill do not meet clinical standards. Retreatment or extraction with implant planning should be discussed with the patient.',
    suggestions: [
      'Initiate discussion with patient regarding retreatment vs. extraction options.',
      'Perform thorough clinical examination — percussion, palpation, mobility, pocket depths.',
      'Assess restorability of the tooth prior to planning endodontic retreatment.',
      'Obtain CBCT to evaluate true extent of periapical pathology in three dimensions.',
      'Evaluate for procedural errors — missed canals, instrument separation, ledging — visible on CBCT.',
      'Consult with endodontist if retreatment complexity is beyond general practitioner scope.',
      'Document findings comprehensively — maintain photographic and radiographic records.',
    ]
  };
}

function updateShareCard(result, interpretation) {
  document.getElementById('shareScoreDisplay').textContent = `${result.total}/10`;
  document.getElementById('shareLabelDisplay').textContent = interpretation.label;

  const paramsEl = document.getElementById('shareParams');
  paramsEl.innerHTML = `
    <div class="share-param-item">Length ${result.length}/${result.lengthMax}</div>
    <div class="share-param-item">Density ${result.density}/${result.densityMax}</div>
    <div class="share-param-item">Taper ${result.taper}/${result.taperMax}</div>
  `;
}

// ── Share ──
shareBtn.addEventListener('click', () => {
  if (!currentScore) return;
  shareModal.style.display = 'flex';
});

modalClose.addEventListener('click', () => { shareModal.style.display = 'none'; });
shareModal.addEventListener('click', (e) => {
  if (e.target === shareModal) shareModal.style.display = 'none';
});

document.getElementById('twitterBtn').addEventListener('click', () => {
  const text = `My root canal obturation scored ${currentScore}/10 (${getInterpretation(currentScore).label}) via ObturaScore AI — the AI radiographic scoring system for endodontic quality. #Endodontics #DentalAI #ObturaScore`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
});

document.getElementById('linkedinBtn').addEventListener('click', () => {
  const text = `Proud to share my root canal obturation quality analysis. Score: ${currentScore}/10 — ${getInterpretation(currentScore).label}. Analyzed using ObturaScore AI, a standardized AI-based radiographic scoring system for endodontic practice. #Endodontics #DentalTechnology #ClinicalResearch`;
  window.open(`https://www.linkedin.com/shareArticle?mini=true&summary=${encodeURIComponent(text)}`, '_blank');
});

document.getElementById('copyLinkBtn').addEventListener('click', () => {
  const text = `ObturaScore AI — Obturation Quality: ${currentScore}/10 — ${getInterpretation(currentScore).label}`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyLinkBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!`;
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  });
});

// ── Download Report ──
downloadBtn.addEventListener('click', () => {
  if (!currentScore) return;
  const interpretation = getInterpretation(currentScore);
  const b = currentBreakdown;
  const now = new Date();

  const reportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>ObturaScore AI Report</title>
<style>
  body { font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 0 32px; color: #1a1916; }
  .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 32px; }
  .brand { font-size: 1.5rem; color: #2563eb; font-weight: bold; margin-bottom: 4px; }
  .subtitle { font-size: 0.85rem; color: #6b6760; font-family: monospace; }
  .score-box { background: #1a1916; color: white; border-radius: 16px; padding: 32px; text-align: center; margin: 24px 0; }
  .big-score { font-size: 4rem; line-height: 1; margin-bottom: 8px; }
  .score-label { font-size: 1.1rem; color: #93c5fd; }
  .section { margin: 24px 0; }
  .section-title { font-size: 0.78rem; font-family: monospace; letter-spacing: 0.12em; color: #6b6760; text-transform: uppercase; margin-bottom: 12px; }
  .param-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f4f3f0; }
  .clinical-box { background: #f8f7f4; border: 1px solid #e8e6e1; border-radius: 12px; padding: 20px; margin: 12px 0; font-size: 0.9rem; line-height: 1.7; }
  .suggestion { padding: 6px 0 6px 20px; position: relative; font-size: 0.875rem; }
  .suggestion::before { content: '→'; position: absolute; left: 0; color: #ea580c; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e8e6e1; font-size: 0.75rem; color: #a8a49d; font-family: monospace; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">ObturaScore<sup>AI</sup></div>
    <div class="subtitle">Radiographic Obturation Quality Report · ${now.toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}</div>
  </div>

  <div class="score-box">
    <div class="big-score">${b.total}/10</div>
    <div class="score-label">${interpretation.label}</div>
  </div>

  <div class="section">
    <div class="section-title">Parameter Breakdown</div>
    <div class="param-row"><span>Length Adequacy</span><strong>${b.length} / ${b.lengthMax}</strong></div>
    <div class="param-row"><span>Density Uniformity</span><strong>${b.density} / ${b.densityMax}</strong></div>
    <div class="param-row"><span>Taper Continuity</span><strong>${b.taper} / ${b.taperMax}</strong></div>
    <div class="param-row"><span><strong>Total Score</strong></span><strong>${b.total} / 10</strong></div>
  </div>

  <div class="section">
    <div class="section-title">Clinical Interpretation</div>
    <div class="clinical-box">${interpretation.clinical}</div>
  </div>

  ${interpretation.suggestions.length > 0 ? `
  <div class="section">
    <div class="section-title">Clinical Recommendations</div>
    ${interpretation.suggestions.map(s => `<div class="suggestion">${s}</div>`).join('')}
  </div>` : ''}

  <div class="footer">
    Generated by ObturaScore AI · For research and educational use only · Not a substitute for clinical judgment · De-identified data only
  </div>
</body>
</html>`;

  const blob = new Blob([reportHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ObturaScore_Report_${now.toISOString().slice(0,10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
});

// ── Reset ──
resetBtn.addEventListener('click', () => {
  resetUpload();
  window.scrollTo({ top: document.getElementById('analyze').offsetTop - 80, behavior: 'smooth' });
});

// ══════════════════════════════════════════════════════════════════
// ANATOMY DIAGRAM INTERACTIVITY — NEW
// ══════════════════════════════════════════════════════════════════

function initAnatomyInteractivity() {
  const legendEntries = document.querySelectorAll('.legend-entry');
  const anatomyLabels = document.querySelectorAll('.anatomy-label');
  const svg = document.getElementById('anatomySvg');
  if (!svg) return;

  // Map keys to SVG element IDs to highlight
  const highlightMap = {
    pulp:   ['pulpChamber'],
    gp:     ['canalMesial', 'canalDistal'],
    apex:   [],  // apex seals highlighted via class
    pdl:    [],
    crown:  [],
    taper:  [],
  };

  // Highlight on legend entry hover
  legendEntries.forEach(entry => {
    const key = entry.dataset.key;

    entry.addEventListener('mouseenter', () => {
      highlightAnatomyKey(key);
      // Sync to anatomy label
      anatomyLabels.forEach(lbl => {
        if (lbl.dataset.key === key) {
          lbl.style.opacity = '1';
          lbl.querySelector('rect').style.filter = 'brightness(1.3)';
        } else {
          lbl.style.opacity = '0.4';
        }
      });
    });

    entry.addEventListener('mouseleave', () => {
      resetAnatomyHighlights();
      anatomyLabels.forEach(lbl => {
        lbl.style.opacity = '1';
        const r = lbl.querySelector('rect');
        if (r) r.style.filter = '';
      });
    });
  });

  // Anatomy label hover
  anatomyLabels.forEach(label => {
    const key = label.dataset.key;
    label.addEventListener('mouseenter', () => {
      highlightAnatomyKey(key);
      legendEntries.forEach(e => {
        e.style.background = e.dataset.key === key 
          ? 'rgba(255,255,255,0.1)' 
          : 'rgba(255,255,255,0.02)';
      });
    });
    label.addEventListener('mouseleave', () => {
      resetAnatomyHighlights();
      legendEntries.forEach(e => { e.style.background = ''; });
    });
  });
}

function highlightAnatomyKey(key) {
  const svg = document.getElementById('anatomySvg');
  if (!svg) return;
  
  // Highlight gutta percha canal fills for 'gp'
  if (key === 'gp') {
    ['canalMesial', 'canalDistal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.fill = 'rgba(37,99,235,0.55)';
        el.style.stroke = '#2563eb';
        el.style.strokeWidth = '2';
      }
    });
  }
  if (key === 'pulp') {
    const el = document.getElementById('pulpChamber');
    if (el) {
      el.style.fill = '#bfdbfe';
      el.style.stroke = '#1d4ed8';
      el.style.strokeWidth = '2.5';
    }
  }
  if (key === 'apex') {
    svg.querySelectorAll('.apex-seal').forEach(el => {
      el.style.opacity = '1';
      el.style.r = '9';
    });
  }
  if (key === 'taper') {
    svg.querySelectorAll('.taper-arrow').forEach(el => {
      el.style.opacity = '1';
      el.style.strokeWidth = '3';
    });
  }
}

function resetAnatomyHighlights() {
  const svg = document.getElementById('anatomySvg');
  if (!svg) return;

  ['canalMesial', 'canalDistal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.fill = 'rgba(37,99,235,0.18)';
      el.style.stroke = '#2563eb';
      el.style.strokeWidth = '1';
    }
  });

  const pulp = document.getElementById('pulpChamber');
  if (pulp) {
    pulp.style.fill = '#dbeafe';
    pulp.style.stroke = '#2563eb';
    pulp.style.strokeWidth = '1.5';
  }

  svg.querySelectorAll('.apex-seal').forEach(el => {
    el.style.opacity = '0.7';
  });

  svg.querySelectorAll('.taper-arrow').forEach(el => {
    el.style.opacity = '0.7';
    el.style.strokeWidth = '1.5';
  });
}

// ── Intersection Observer Animations ──
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.6s ease both';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.param-card, .legend-item, .comparison-table').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});

// Stagger param cards
document.querySelectorAll('.param-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.12}s`;
});
document.querySelectorAll('.legend-item').forEach((item, i) => {
  item.style.animationDelay = `${i * 0.1}s`;
});

// Stagger workflow steps
const workflowStepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      workflowStepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.workflow-step').forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = i % 2 === 0 ? 'translateX(-20px)' : 'translateX(20px)';
  step.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
  workflowStepObserver.observe(step);
});

// Media cards animation
const mediaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      mediaObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.media-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(16px)';
  card.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
  mediaObserver.observe(card);
});

// Anatomy legend entry animations
const anatomyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      anatomyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.legend-entry').forEach((entry, i) => {
  entry.style.opacity = '0';
  entry.style.transform = 'translateX(16px)';
  entry.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
  anatomyObserver.observe(entry);
});

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initAnatomyInteractivity();
});

// Also init immediately in case DOMContentLoaded already fired
if (document.readyState !== 'loading') {
  initAnatomyInteractivity();
}

/* ══════════════════════════════════════════════════════════════
   GALLERY INTERACTIVITY
   Add this block to the bottom of app.js
══════════════════════════════════════════════════════════════ */

function initGallery() {
  const track     = document.getElementById('galleryTrack');
  const prevBtn   = document.getElementById('galleryPrev');
  const nextBtn   = document.getElementById('galleryNext');
  const dotsWrap  = document.getElementById('galleryDots');
  const hint      = document.getElementById('galleryHint');
  if (!track) return;

  const cards     = track.querySelectorAll('.gcard');
  const total     = cards.length;
  let   current   = 0;
  let   isDragging = false;
  let   startX    = 0;
  let   startTranslate = 0;
  let   currentTranslate = 0;
  const CARD_WIDTH = () => cards[0].getBoundingClientRect().width + 20; // card + gap

  /* ── Build dots ── */
  dotsWrap.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'gdot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const offset = -current * CARD_WIDTH();
    track.style.transform = `translateX(${offset}px)`;
    currentTranslate = offset;
    updateDots();
    updateButtons();
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.gdot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function updateButtons() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ── Keyboard navigation ── */
  document.addEventListener('keydown', (e) => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    const rect = gallerySection.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft')  goTo(current - 1);
  });

  /* ── Drag / Touch ── */
  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onDragStart(e) {
    isDragging = true;
    startX = getClientX(e);
    startTranslate = currentTranslate;
    track.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const dx = getClientX(e) - startX;
    track.style.transform = `translateX(${startTranslate + dx}px)`;
  }

  function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
    const dx = getClientX(e) - startX;
    const threshold = CARD_WIDTH() * 0.25;
    if (dx < -threshold) goTo(current + 1);
    else if (dx > threshold) goTo(current - 1);
    else goTo(current); // snap back
  }

  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  track.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });
  window.addEventListener('touchend', onDragEnd);

  /* ── Hide hint after first interaction ── */
  function hideHint() {
    if (hint) { hint.style.opacity = '0'; hint.style.pointerEvents = 'none'; }
    prevBtn.removeEventListener('click', hideHint);
    nextBtn.removeEventListener('click', hideHint);
    track.removeEventListener('mousedown', hideHint);
    track.removeEventListener('touchstart', hideHint);
  }
  prevBtn.addEventListener('click', hideHint);
  nextBtn.addEventListener('click', hideHint);
  track.addEventListener('mousedown', hideHint);
  track.addEventListener('touchstart', hideHint);

  /* ── Animate AI param bars on first visibility ── */
  const aiCard = track.querySelector('.gcard--ai');
  if (aiCard) {
    const aiObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aiCard.querySelectorAll('.ai-param-fill').forEach(bar => {
            const w = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = w; }, 100);
          });
          aiObserver.unobserve(aiCard);
        }
      });
    }, { threshold: 0.3 });
    aiObserver.observe(aiCard);
  }

  /* ── Gallery card entrance animation ── */
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const gallerySection = document.getElementById('gallery');
  if (gallerySection) galleryObserver.observe(gallerySection);

  /* Init state */
  updateButtons();
  updateDots();
}

/* ── Init on load ── */
document.addEventListener('DOMContentLoaded', initGallery);
if (document.readyState !== 'loading') initGallery();