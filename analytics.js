/* ============================================================
   ObturaScore AI — Analytics JS
   ============================================================ */
   document.addEventListener('DOMContentLoaded', () => {
    // Animate counters
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        animateCounter(el, 0, parseFloat(el.dataset.count), 1200, parseInt(el.dataset.decimal||0));
        obs.unobserve(el);
      });
    }, { threshold: .3 });
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
  
    // Export
    document.getElementById('exportAnalyticsBtn')?.addEventListener('click', () => {
      showToast('Analytics report exported');
    });
  });