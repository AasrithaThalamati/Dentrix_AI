/* ============================================================
   ObturaScore AI — Dashboard JS (MongoDB Connected)
   ============================================================ */

   const API = 'https://dentrix-ai-8k2b.vercel.app/api';
   function getToken() { return localStorage.getItem('dentrix_token'); }
   
   document.addEventListener('DOMContentLoaded', async () => {
   
     // ── Load real analytics from MongoDB ──
     await loadDashboardData();
   
     // ── Animate chart bars ──
     setTimeout(() => {
       document.querySelectorAll('.chart-bar-fill').forEach((bar, i) => {
         bar.style.transitionDelay = `${i * 0.1}s`;
       });
     }, 300);
   
     // ── Notifications panel ──
     const notifBtn = document.getElementById('notifBtn');
     if (notifBtn) {
       let panel = null;
       notifBtn.addEventListener('click', (e) => {
         e.stopPropagation();
         if (panel) { panel.remove(); panel = null; return; }
         panel = document.createElement('div');
         panel.className = 'notif-panel';
         panel.innerHTML = `
           <div class="notif-panel-header">
             <span>Notifications</span>
             <button onclick="this.closest('.notif-panel').remove()"
               style="background:none;border:none;cursor:pointer;color:var(--warm-gray-400);font-size:1rem">×</button>
           </div>
           <div class="notif-item unread">
             <div class="notif-dot-red"></div>
             <div><div class="notif-title">Check patients with poor scores</div>
             <div class="notif-time">Just now</div></div>
           </div>
           <div class="notif-item">
             <div class="notif-dot-blue"></div>
             <div><div class="notif-title">Model updated to v2.4.1</div>
             <div class="notif-time">2 days ago</div></div>
           </div>`;
         document.body.appendChild(panel);
         const rect = notifBtn.getBoundingClientRect();
         panel.style.top   = (rect.bottom + 8) + 'px';
         panel.style.right = (window.innerWidth - rect.right) + 'px';
         document.addEventListener('click', () => { panel?.remove(); panel = null; }, { once: true });
       });
     }
   });
   
   async function loadDashboardData() {
     try {
       const res = await fetch(`${API}/analytics`, {
         headers: { 'Authorization': `Bearer ${getToken()}` }
       });
       if (!res.ok) throw new Error('Failed to load analytics');
       const data = await res.json();
   
       // ── Update KPI stat cards with real data ──
       updateStatCard('[data-count="147"]', data.totalAnalyses);
       updateStatCard('[data-count="7.4"]', parseFloat(data.avgScore));
       updateStatCard('[data-count="84"]',  data.totalPatients);
       updateStatCard('[data-count="18"]',  0); // retreatments — extend later
       updateStatCard('[data-count="2"]',   0); // today's schedule — extend later
   
       // ── Load recent cases table ──
       await loadRecentCases();
   
     } catch (err) {
       console.error('Dashboard data error:', err);
       // Fall back to animated mock counters
       const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
           if (!entry.isIntersecting) return;
           const el = entry.target;
           animateCounter(el, 0, parseFloat(el.dataset.count),
             1400, parseInt(el.dataset.decimal || 0));
           observer.unobserve(el);
         });
       }, { threshold: 0.3 });
       document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
     }
   }
   
   function updateStatCard(selector, value) {
     const el = document.querySelector(selector);
     if (!el || value === undefined) return;
     const decimals = parseInt(el.dataset.decimal || 0);
     el.dataset.count = value;
     animateCounter(el, 0, parseFloat(value), 1400, decimals);
   }
   
   async function loadRecentCases() {
     try {
       const res = await fetch(`${API}/history`, {
         headers: { 'Authorization': `Bearer ${getToken()}` }
       });
       if (!res.ok) return;
       const history = await res.json();
       if (!history.length) return;
   
       const tbody = document.querySelector('.recent-cases-card .data-table tbody');
       if (!tbody) return;
   
       tbody.innerHTML = history.slice(0, 5).map(h => {
         const score  = h.analysis?.obturationScore || 0;
         const status = getScoreLabel(score);
         const badge  = `badge-${status.toLowerCase()}`;
         const name   = h.patient?.name || 'Unknown';
         const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
         const id     = `#PT-${h.patient?._id?.slice(-4).toUpperCase() || '????'}`;
   
         return `
         <tr>
           <td>
             <div class="pt-cell">
               <div class="pt-avatar">${initials}</div>
               <div>
                 <div class="pt-name">${name}</div>
                 <div class="pt-id">${id}</div>
               </div>
             </div>
           </td>
           <td><span class="tooth-badge">${h.analysis?.tooth || '—'}</span></td>
           <td>${formatDate(h.date)}</td>
           <td><span class="score-chip ${status.toLowerCase()}">${score}</span></td>
           <td><span class="badge ${badge}">${status}</span></td>
           <td><a href="history.html" class="tbl-link">View →</a></td>
         </tr>`;
       }).join('');
   
     } catch (err) {
       console.error('Recent cases error:', err);
     }
   }
   
   // Notif panel styles
   const style = document.createElement('style');
   style.textContent = `
     .notif-panel{position:fixed;z-index:999;background:white;border:1px solid var(--warm-gray-200);border-radius:var(--radius-lg);width:320px;box-shadow:var(--shadow-lg);animation:fadeUp 0.2s ease both;overflow:hidden}
     .notif-panel-header{padding:16px 16px 12px;font-weight:600;font-size:.875rem;border-bottom:1px solid var(--warm-gray-100);display:flex;justify-content:space-between;align-items:center}
     .notif-item{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid var(--warm-gray-50);transition:background .15s}
     .notif-item:hover{background:var(--warm-gray-50)}
     .notif-item.unread{background:var(--accent-light)}
     .notif-title{font-size:.82rem;color:var(--dark);line-height:1.4}
     .notif-time{font-size:.72rem;color:var(--warm-gray-400);font-family:var(--font-mono);margin-top:3px}
     .notif-dot-red,.notif-dot-orange,.notif-dot-blue{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
     .notif-dot-red{background:var(--poor)}
     .notif-dot-orange{background:var(--acceptable)}
     .notif-dot-blue{background:var(--accent)}
   `;
   document.head.appendChild(style);