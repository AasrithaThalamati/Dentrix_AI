/* ============================================================
   Dentrix AI — Sidebar Web Component
   Renders instantly via connectedCallback — no event listeners needed
   ============================================================ */

class AppSidebar extends HTMLElement {
  connectedCallback() {
    const user     = this._getUser();
    const name     = user?.name || 'User';
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const role     = user?.specialization || user?.role || 'Dental Professional';
    const page     = location.pathname.split('/').pop() || 'dashboard.html';

    const nav = (href, svg, label, badge) => {
      const active    = page === href ? ' active' : '';
      const badgeHtml = badge
        ? `<span class="nav-badge${badge.cls ? ' ' + badge.cls : ''}">${badge.text}</span>`
        : '';
      return `<a class="nav-item${active}" href="${href}">${svg}${label}${badgeHtml}</a>`;
    };

    this.innerHTML = `
      <a class="sidebar-brand" href="index.html">
        <div class="brand-icon-wrap">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 16 Q12 8 16 16 Q20 24 24 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            <circle cx="16" cy="16" r="2" fill="currentColor"/>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-name">Dentrix<sup>AI</sup></div>
          <div class="brand-sub">ENDO INTELLIGENCE</div>
        </div>
      </a>

      <a class="sidebar-doctor" href="profile.html">
        <div class="doctor-avatar-sm">${initials}</div>
        <div class="doctor-meta">
          <div class="doc-name">${name}</div>
          <div class="doc-role">${role.charAt(0).toUpperCase() + role.slice(1)}</div>
        </div>
        <div class="doctor-status"></div>
      </a>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Main</div>

        ${nav('dashboard.html', `<svg viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
        </svg>`, 'Dashboard')}

        ${nav('analyze.html', `<svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>`, 'AI Analysis', { text: 'Live', cls: 'green' })}

        ${nav('patients.html', `<svg viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="6" r="3" stroke="currentColor" stroke-width="1.4"/>
          <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M15 8v6M12 11h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>`, 'Patients', { text: '3' })}

        ${nav('history.html', `<svg viewBox="0 0 20 20" fill="none">
          <path d="M4 4h12v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" stroke-width="1.4"/>
          <path d="M8 9h4M8 12h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M8 2v4M12 2v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>`, 'Case History')}

        <div class="nav-section-label">Analytics</div>

        ${nav('analytics.html', `<svg viewBox="0 0 20 20" fill="none">
          <path d="M3 15l4-5 4 3 4-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="17" cy="6" r="1.5" fill="currentColor"/>
        </svg>`, 'Analytics')}

        ${nav('research.html', `<svg viewBox="0 0 20 20" fill="none">
          <path d="M9 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M15 2l3 3-7 7H8v-3l7-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>`, 'Research')}

        ${nav('smile.html', `<svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M7 11s1 2 3 2 3-2 3-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="7.5" cy="8.5" r="1" fill="currentColor"/>
          <circle cx="12.5" cy="8.5" r="1" fill="currentColor"/>
        </svg>`, 'Smile Design')}

        <div class="nav-section-label">Account</div>

        ${nav('profile.html', `<svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>`, 'My Profile')}

        ${nav('settings.html', `<svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>`, 'Settings')}
      </nav>

      <div class="sidebar-footer">
        <a class="nav-item" href="help_docs.html">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M7.5 7.5a2.5 2.5 0 015 0c0 1.667-2.5 2.5-2.5 3.5M10 14v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          Help &amp; Docs
        </a>
        <a class="nav-item" href="index.html">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M3 10h12M9 5l6 5-6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Home
        </a>
      </div>
    `;

    /* Mobile overlay close */
    document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
      this.classList.remove('open');
      document.getElementById('sidebarOverlay')?.classList.remove('open');
    });
    document.querySelectorAll('.nav-item').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          this.classList.remove('open');
          document.getElementById('sidebarOverlay')?.classList.remove('open');
        }
      });
    });
  }

  _getUser() {
    try { const s = sessionStorage.getItem('obturaAuth'); if (s) return JSON.parse(s); } catch(e) {}
    try { const l = localStorage.getItem('dentrix_user'); if (l) return JSON.parse(l); } catch(e) {}
    return null;
  }
}

customElements.define('app-sidebar', AppSidebar);
