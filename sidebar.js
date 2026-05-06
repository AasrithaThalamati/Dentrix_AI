/* ============================================================
   ObturaScore AI — Sidebar HTML Injector
   Call buildSidebar() at the top of each page's DOMContentLoaded
   ============================================================ */

   function buildSidebar() {
    const html = `
    <div class="sidebar-brand" href="index.html">
      <div class="brand-icon-wrap">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 16 Q12 8 16 16 Q20 24 24 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          <circle cx="16" cy="16" r="2" fill="currentColor"/>
        </svg>
      </div>
      <div class="brand-text">
        <div class="brand-name">ObturaScore<sup>AI</sup></div>
        <div class="brand-sub">ENDO INTELLIGENCE</div>
      </div>
    </div>
  
    <a class="sidebar-doctor" href="profile.html">
      <div class="doctor-avatar-sm">DS</div>
      <div class="doctor-meta">
        <div class="doc-name">Dr. Disha Shah</div>
        <div class="doc-role">MDS · Endodontist</div>
      </div>
      <div class="doctor-status"></div>
    </a>
  
    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
  
      <a class="nav-item" href="dashboard.html">
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
        </svg>
        Dashboard
      </a>
  
      <a class="nav-item" href="analyze.html">
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        AI Analysis
        <span class="nav-badge green">Live</span>
      </a>
  
      <a class="nav-item" href="patients.html">
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="6" r="3" stroke="currentColor" stroke-width="1.4"/>
          <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M15 8v6M12 11h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        Patients
        <span class="nav-badge">3</span>
      </a>
  
      <a class="nav-item" href="history.html">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M4 4h12v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" stroke-width="1.4"/>
          <path d="M8 9h4M8 12h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M8 2v4M12 2v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        Case History
      </a>
  
      <div class="nav-section-label">Analytics</div>
  
      <a class="nav-item" href="analytics.html">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M3 15l4-5 4 3 4-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="17" cy="6" r="1.5" fill="currentColor"/>
        </svg>
        Analytics
      </a>
  
      <a class="nav-item" href="research.html">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M9 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M15 2l3 3-7 7H8v-3l7-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>
        Research
      </a>
  
      <div class="nav-section-label">Account</div>
  
      <a class="nav-item" href="profile.html">
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        My Profile
      </a>
  
      <a class="nav-item" href="settings.html">
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        Settings
      </a>
    </nav>
  
    <div class="sidebar-footer">
      <a class="nav-item" href="#" id="helpBtn">
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M7.5 7.5a2.5 2.5 0 015 0c0 1.667-2.5 2.5-2.5 3.5M10 14v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        Help & Docs
      </a>
      <a class="nav-item" href="index.html">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M3 10h12M9 5l6 5-6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Home
      </a>
    </div>
    `;
  
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.innerHTML = html;
  }
  
  document.addEventListener('DOMContentLoaded', buildSidebar);