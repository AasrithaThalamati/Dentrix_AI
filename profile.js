/* ============================================================
   ObturaScore AI — Profile Page JS
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    // ── Save profile ──
    document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
      const first = document.getElementById('pfFirstName')?.value.trim();
      const last  = document.getElementById('pfLastName')?.value.trim();
      if (!first || !last) { showToast('Name fields are required', 'error'); return; }
  
      // Update avatar initials
      const initials = `${first[0]}${last[0]}`.toUpperCase();
      const avatarEl = document.getElementById('avatarCircle');
      if (avatarEl) avatarEl.textContent = initials;
  
      // Update sidebar doctor name
      const docNameEl = document.querySelector('.doc-name');
      if (docNameEl) docNameEl.textContent = `Dr. ${first} ${last}`;
  
      showToast('Profile saved successfully');
    });
  
    // ── Avatar change (demo) ──
    document.getElementById('avatarChangeBtn')?.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const avatarEl = document.getElementById('avatarCircle');
          if (!avatarEl) return;
          avatarEl.style.backgroundImage = `url('${ev.target.result}')`;
          avatarEl.style.backgroundSize  = 'cover';
          avatarEl.style.backgroundPosition = 'center';
          avatarEl.textContent = '';
          showToast('Profile photo updated');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  
    // ── Animate stat bars on load ──
    setTimeout(() => {
      document.querySelectorAll('.perf-bar, .bench-bar').forEach(bar => {
        const targetW = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          bar.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
          bar.style.width = targetW;
        });
      });
    }, 300);
  
    // ── Live name preview ──
    const pfFirst = document.getElementById('pfFirstName');
    const pfLast  = document.getElementById('pfLastName');
    function updateNamePreview() {
      const f = pfFirst?.value.trim() || '';
      const l = pfLast?.value.trim()  || '';
      const nameEl = document.querySelector('.avatar-name');
      if (nameEl && (f || l)) nameEl.textContent = `Dr. ${f} ${l}`.trim();
      const initials = `${f[0]||''}${l[0]||''}`.toUpperCase();
      const av = document.getElementById('avatarCircle');
      if (av && initials && !av.style.backgroundImage) av.textContent = initials;
    }
    pfFirst?.addEventListener('input', updateNamePreview);
    pfLast?.addEventListener('input',  updateNamePreview);
  });