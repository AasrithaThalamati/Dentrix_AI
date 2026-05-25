/* ============================================================
   ObturaScore AI — Research Page Script (research.js)
   ============================================================ */

   (function () {
    'use strict';
  
    /* ── Utility: show toast ── */
    function showToast(message, icon) {
      let toast = document.getElementById('rscToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'rscToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `
        <svg viewBox="0 0 16 16" fill="none">
          <path d="${icon || 'M3 8l3 3 7-6'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}
      `;
      toast.classList.add('show');
      clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2800);
    }
  
    /* ── Utility: copy text to clipboard ── */
    function copyText(text, successMsg) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => showToast(successMsg || 'Copied to clipboard'),
          () => fallbackCopy(text, successMsg)
        );
      } else {
        fallbackCopy(text, successMsg);
      }
    }
  
    function fallbackCopy(text, successMsg) {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
        showToast(successMsg || 'Copied to clipboard');
      } catch (e) {
        showToast('Copy failed — please copy manually', 'M8 5v4m0 2.5v.5');
      }
      document.body.removeChild(el);
    }
  
    /* ── KPI counter animation ── */
    function animateCounter(el) {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1600;
      const start = performance.now();
  
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out-cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      }
  
      requestAnimationFrame(tick);
    }
  
    function initCounters() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;
  
      const hero = document.querySelector('.rsc-hero');
      if (!hero) {
        counters.forEach(animateCounter);
        return;
      }
  
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              counters.forEach(animateCounter);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(hero);
    }
  
    /* ── Progress bar animations (performance + F1 bars) ── */
    function initBars() {
      const bars = document.querySelectorAll('.rsc-pm-bar, .rsc-f1-bar');
      if (!bars.length) return;
  
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Small stagger per bar
              bars.forEach((bar, i) => {
                setTimeout(() => bar.classList.add('animated'), i * 80);
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
  
      // Observe the first metrics card
      const firstCard = bars[0]?.closest('.rsc-card');
      if (firstCard) obs.observe(firstCard);
    }
  
    /* ── Fade-up animations ── */
    function initFadeUp() {
      const els = document.querySelectorAll('.fade-up');
      if (!els.length) return;
  
      // If IntersectionObserver not supported, just show them
      if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.style.opacity = '1');
        return;
      }
  
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
  
      els.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        obs.observe(el);
      });
    }
  
    /* ── Publication action buttons ── */
    function initPubButtons() {
      document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
  
        const action = btn.dataset.action;
  
        if (action === 'cite') {
          const citation = btn.dataset.citation;
          if (citation) copyText(citation, 'APA citation copied!');
          return;
        }
  
        if (action === 'bibtex') {
          const bibtex = btn.dataset.bibtex;
          if (bibtex) copyText(bibtex, 'BibTeX entry copied!');
          return;
        }
  
        if (action === 'abstract') {
          const modal = document.getElementById('abstractModal');
          if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
          return;
        }
      });
    }
  
    /* ── Modal open / close ── */
    function initModals() {
      // Close on [data-close-modal] buttons
      document.addEventListener('click', function (e) {
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
          const modalId = closeBtn.dataset.closeModal;
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
          return;
        }
  
        // Close on overlay backdrop click
        if (e.target.classList.contains('modal-overlay')) {
          e.target.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
  
      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          });
        }
      });
    }
  
    /* ── Copy abstract button inside modal ── */
    function initCopyAbstract() {
      const copyBtn = document.getElementById('copyAbstractBtn');
      if (!copyBtn) return;
  
      copyBtn.addEventListener('click', function () {
        const abstractText = `Background: Radiographic assessment of root canal obturation quality is subjective and exhibits significant inter-observer variability. This study aimed to develop and validate an AI-based scoring system to standardise evaluation.
  
  Methods: 1,247 de-identified IOPA radiographs from three institutions were annotated by three endodontists (ICC = 0.87). A ResNet-50 CNN was trained with 5-fold cross-validation. Three weighted parameters (length adequacy 0–4, density uniformity 0–3, taper continuity 0–3) produced a composite ObturaScore (0–10).
  
  Results: The model achieved 91.2% accuracy, sensitivity 88.7%, specificity 94.1%, and Cohen's κ = 0.82 on the held-out test set (n=125). Bland-Altman analysis showed mean bias −0.12 (95% LoA: −0.87 to 0.63). Class-wise F1: Optimal 0.93, Acceptable 0.89, Suboptimal 0.86, Poor 0.84.
  
  Conclusions: The ObturaScore AI system demonstrates strong agreement with expert consensus and substantially reduces inter-observer variability in radiographic obturation quality assessment, supporting its use as a clinical audit and decision-support tool.`;
  
        copyText(abstractText, 'Abstract copied!');
      });
    }
  
    /* ── Score spectrum bar entrance animation ── */
    function initSpectrumBar() {
      const bar = document.querySelector('.rsc-spectrum-bar');
      if (!bar) return;
  
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              bar.style.opacity = '0';
              bar.style.transform = 'scaleX(0)';
              bar.style.transformOrigin = 'left';
              bar.style.transition = 'opacity .4s ease, transform .6s cubic-bezier(.4,0,.2,1)';
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  bar.style.opacity = '1';
                  bar.style.transform = 'scaleX(1)';
                });
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      obs.observe(bar);
    }
  
    /* ── Pipeline steps stagger ── */
    function initPipelineStagger() {
      const steps = document.querySelectorAll('.rsc-pipe-step');
      if (!steps.length) return;
  
      const fig = document.querySelector('.rsc-pipeline-fig');
      if (!fig) return;
  
      steps.forEach(s => {
        s.style.opacity = '0';
        s.style.transform = 'translateY(12px)';
        s.style.transition = 'opacity .4s ease, transform .4s ease';
      });
  
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              steps.forEach((s, i) => {
                setTimeout(() => {
                  s.style.opacity = '1';
                  s.style.transform = 'translateY(0)';
                }, i * 120);
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(fig);
    }
  
    /* ── Donut chart animation ── */
    function initDonut() {
      const circles = document.querySelectorAll('.rsc-donut-svg circle');
      if (!circles.length) return;
  
      const svg = document.querySelector('.rsc-donut-svg');
      if (!svg) return;
  
      // Store original dasharray values
      const originals = Array.from(circles).map(c => ({
        el: c,
        dasharray: c.getAttribute('stroke-dasharray'),
        dashoffset: c.getAttribute('stroke-dashoffset') || '0'
      }));
  
      // Start collapsed
      circles.forEach(c => {
        c.setAttribute('stroke-dasharray', '0 284');
      });
  
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              originals.forEach((item, i) => {
                setTimeout(() => {
                  item.el.style.transition = 'stroke-dasharray .8s cubic-bezier(.4,0,.2,1)';
                  item.el.setAttribute('stroke-dasharray', item.dasharray);
                }, i * 120);
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(svg);
    }
  
    /* ── Xray card hover tilt effect ── */
    function initXrayTilt() {
      const frames = document.querySelectorAll('.rsc-xray-frame');
      frames.forEach(frame => {
        frame.addEventListener('mousemove', function (e) {
          const rect = frame.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          frame.style.transform = `perspective(500px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
          frame.style.transition = 'transform .1s ease';
        });
        frame.addEventListener('mouseleave', function () {
          frame.style.transform = '';
          frame.style.transition = 'transform .3s ease';
        });
      });
    }
  
    /* ── Param card hover ── */
    function initParamHover() {
      const cards = document.querySelectorAll('.rsc-param-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-3px)';
          card.style.transition = 'transform .2s ease, box-shadow .2s ease';
          card.style.boxShadow = '0 6px 20px rgba(0,0,0,.08)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      });
    }
  
    /* ── Ensure modal-overlay has required CSS if not in shared.css ── */
    function injectModalStyles() {
      if (document.getElementById('rscModalStyles')) return;
      const style = document.createElement('style');
      style.id = 'rscModalStyles';
      style.textContent = `
        .modal-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .modal-overlay.active {
          display: flex;
        }
        .modal-card {
          background: white;
          border-radius: var(--radius-xl, 16px);
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,.18);
          animation: modalIn .25s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1)  translateY(0); }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--warm-gray-100, #f3f4f6);
        }
        .modal-title {
          font-family: var(--font-display, 'DM Serif Display', serif);
          font-size: 1.1rem;
          color: var(--dark, #111);
        }
        .modal-close-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid var(--warm-gray-200, #e5e7eb);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--warm-gray-500, #6b7280);
          transition: background .15s;
        }
        .modal-close-btn:hover { background: var(--warm-gray-100, #f3f4f6); }
        .modal-close-btn svg { width: 14px; height: 14px; }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 24px;
          border-top: 1px solid var(--warm-gray-100, #f3f4f6);
        }
      `;
      document.head.appendChild(style);
    }
  
    /* ── Init all ── */
    function init() {
      injectModalStyles();
      initFadeUp();
      initCounters();
      initBars();
      initSpectrumBar();
      initPipelineStagger();
      initDonut();
      initPubButtons();
      initModals();
      initCopyAbstract();
      initXrayTilt();
      initParamHover();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();