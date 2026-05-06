/* ============================================================
   ObturaScore AI — Settings Page JS
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    // ── Tab switching ──
    const tabs    = document.querySelectorAll('.sn-item');
    const panels  = document.querySelectorAll('.settings-panel');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${target}`)?.classList.add('active');
      });
    });
  
    // ── Save settings ──
    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
      showToast('Settings saved successfully');
    });
  
    // ── Theme picker ──
    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.theme === 'dark') {
          document.body.classList.add('dark-mode-preview');
          showToast('Dark mode preview — save to apply');
        } else {
          document.body.classList.remove('dark-mode-preview');
        }
      });
    });
  
    // ── Sensitivity selector ──
    document.querySelectorAll('.sens-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.sensitivity-selector').querySelectorAll('.sens-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  
    // ── Weight sliders ──
    const sliders = [
      { sliderId: 'wsLenSlider', valId: 'wsLen' },
      { sliderId: 'wsDenSlider', valId: 'wsDen' },
      { sliderId: 'wsTapSlider', valId: 'wsTap' },
    ];
  
    function updateWeightTotal() {
      const total = sliders.reduce((sum, s) => {
        return sum + parseInt(document.getElementById(s.sliderId)?.value || 0);
      }, 0);
      const totalEl  = document.getElementById('wsTotalVal');
      const statusEl = document.getElementById('wsStatus');
      if (totalEl) totalEl.textContent = total;
      if (statusEl) {
        if (total === 10) {
          statusEl.textContent = '✓ Valid';
          statusEl.className = 'ws-status';
        } else {
          statusEl.textContent = `✗ Must equal 10 (currently ${total})`;
          statusEl.className = 'ws-status invalid';
        }
      }
    }
  
    sliders.forEach(({ sliderId, valId }) => {
      const slider = document.getElementById(sliderId);
      const valEl  = document.getElementById(valId);
      slider?.addEventListener('input', () => {
        if (valEl) valEl.textContent = slider.value;
        updateWeightTotal();
      });
    });
  
    // ── API Key ──
    const apiInput    = document.getElementById('apiKeyInput');
    const toggleBtn   = document.getElementById('toggleApiKey');
    const copyBtn     = document.getElementById('copyApiKey');
    const regenBtn    = document.getElementById('regenApiKey');
  
    toggleBtn?.addEventListener('click', () => {
      if (apiInput.type === 'password') {
        apiInput.type = 'text';
        toggleBtn.textContent = 'Hide';
      } else {
        apiInput.type = 'password';
        toggleBtn.textContent = 'Show';
      }
    });
  
    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(apiInput.value).then(() => showToast('API key copied'));
    });
  
    regenBtn?.addEventListener('click', () => {
      if (!confirm('Regenerate API key? Your existing integrations will need to be updated.')) return;
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const rand  = Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      apiInput.value = `osk_live_${rand}`;
      showToast('API key regenerated — update your integrations');
    });
  
    // ── Data actions ──
    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
      showToast('Data export initiated — you will receive an email shortly');
    });
  
    document.getElementById('deleteCasesBtn')?.addEventListener('click', () => {
      if (!confirm('Delete ALL case history? This cannot be undone.')) return;
      showToast('All case history deleted', 'error');
    });
  
    document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
      if (!confirm('Delete your ObturaScore AI account permanently? All data will be lost.')) return;
      showToast('Account deletion request submitted', 'error');
    });
  
    // ── Change password ──
    document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
      showToast('Password changed successfully');
    });
  
    // ── Session revoke ──
    document.querySelectorAll('.session-item .btn-danger').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.session-item').style.opacity = '.4';
        btn.disabled = true;
        btn.textContent = 'Revoked';
        showToast('Session revoked');
      });
    });
  
    // ── Invoice buttons ──
    document.querySelectorAll('.data-table .btn-ghost').forEach(btn => {
      btn.addEventListener('click', () => showToast('Invoice downloaded'));
    });
  });