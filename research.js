/* ============================================================
   ObturaScore AI — Research Page JS
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    // Animate metric bars on scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.pm-bar').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
            bar.style.width = w;
          });
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: .2 });
  
    document.querySelectorAll('.perf-metrics').forEach(el => observer.observe(el));
  
    // Publication buttons
    document.querySelectorAll('.pub-actions .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.textContent.trim() === 'Cite') {
          const citation = 'Shah D., Mehta R., Krishnan S., Iyer V. (2025). AI-assisted radiographic scoring of root canal obturation: a cross-sectional observational study. Journal of Conservative Dentistry, 28(3), 112–119.';
          navigator.clipboard.writeText(citation).then(() => showToast('Citation copied to clipboard'));
        } else {
          showToast('Opening abstract…');
        }
      });
    });
  });