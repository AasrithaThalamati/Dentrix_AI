/* ============================================================
   ObturaScore AI — Patients Page JS (MongoDB Connected)
   ============================================================ */

   const API = 'https://dentrix-ai-8k2b.vercel.app/api';

   function getToken() { return localStorage.getItem('dentrix_token'); }
   
   async function apiFetch(endpoint, options = {}) {
     const config = {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${getToken()}`,
         ...(options.headers || {})
       }
     };
     if (config.body && typeof config.body === 'object') {
       config.body = JSON.stringify(config.body);
     }
     const res = await fetch(`${API}${endpoint}`, config);
     if (res.status === 401) { window.location.href = 'signup.html'; return null; }
     if (!res.ok) {
       const err = await res.json().catch(() => ({}));
       throw new Error(err.message || `HTTP ${res.status}`);
     }
     return res.json();
   }
   
   // ── Helpers ──
   function formatDate(dateStr) {
     if (!dateStr) return '—';
     const d = new Date(dateStr);
     if (isNaN(d)) return '—';
     return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
   }
   
   function capitalize(s) {
     if (!s) return '';
     return s.charAt(0).toUpperCase() + s.slice(1);
   }
   
   function getInitials(name) {
     if (!name) return '??';
     return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
   }
   
   function getScoreStatus(s) {
     if (s >= 8) return 'optimal';
     if (s >= 6) return 'acceptable';
     if (s >= 4) return 'suboptimal';
     return 'poor';
   }
   
   // ── Toast ──
   function showToast(msg, type = 'success') {
     if (typeof window.showToast === 'function' && window.showToast !== showToast) {
       return window.showToast(msg, type);
     }
     let t = document.getElementById('_toast');
     if (!t) {
       t = document.createElement('div');
       t.id = '_toast';
       t.className = 'toast';
       document.body.appendChild(t);
     }
     t.textContent = msg;
     t.className = `toast${type === 'error' ? ' toast-error' : ''} show`;
     clearTimeout(t._timer);
     t._timer = setTimeout(() => t.classList.remove('show'), 3000);
   }
   
   // ── Modal helpers ──
   // patientModal = right-side drawer — independent of detailModal
   // detailModal  = centered overlay  — independent of patientModal
   // Opening one no longer force-closes the other.
   function openModal(id) {
     const el = document.getElementById(id);
     if (el) el.classList.add('modal-open');
   }
   
   function closeModal(id) {
     const el = document.getElementById(id);
     if (el) el.classList.remove('modal-open');
   }
   
   function closeAllModals() {
     document.querySelectorAll('.modal-overlay.modal-open').forEach(el => {
       el.classList.remove('modal-open');
     });
   }
   
   // Close on [data-close-modal] buttons — attribute value is the modal ID to close
   document.addEventListener('click', e => {
     const closeBtn = e.target.closest('[data-close-modal]');
     if (closeBtn) {
       const targetId = closeBtn.getAttribute('data-close-modal');
       if (targetId) {
         closeModal(targetId);
       } else {
         // Fallback: close nearest modal-overlay ancestor
         const overlay = closeBtn.closest('.modal-overlay');
         if (overlay) closeModal(overlay.id);
       }
       return;
     }
     // Click directly on the backdrop (not the card inside)
     if (e.target.classList.contains('modal-overlay')) {
       closeModal(e.target.id);
     }
   });
   
   // Close topmost open modal on Escape
   document.addEventListener('keydown', e => {
     if (e.key !== 'Escape') return;
     const open = document.querySelectorAll('.modal-overlay.modal-open');
     if (open.length) closeModal(open[open.length - 1].id);
   });
   
   // ── Counter animation ──
   function animateCounter(el, from, to, duration, decimals = 0) {
     const start = performance.now();
     const update = (now) => {
       const progress = Math.min((now - start) / duration, 1);
       const val = from + (to - from) * progress;
       el.textContent = decimals > 0 ? val.toFixed(decimals) : Math.floor(val);
       if (progress < 1) requestAnimationFrame(update);
       else el.textContent = decimals > 0 ? to.toFixed(decimals) : to;
     };
     requestAnimationFrame(update);
   }
   
   // ── State ──
   let patients = [];
   let filteredPatients = [];
   let currentView = 'table';
   let currentPage = 1;
   const PAGE_SIZE = 8;
   let editingId = null;
   
   // ── DOM refs ──
   const tableBody    = document.getElementById('patientTableBody');
   const gridView     = document.getElementById('gridView');
   const tableView    = document.getElementById('tableView');
   const tableSearch  = document.getElementById('tableSearch');
   const globalSearch = document.getElementById('globalSearch');
   const statusFilter = document.getElementById('statusFilter');
   const sortFilter   = document.getElementById('sortFilter');
   const pagination   = document.getElementById('pagination');
   const viewToggle   = document.getElementById('viewToggle');
   
   // ── Init ──
   document.addEventListener('DOMContentLoaded', async () => {
     await loadPatients();
   
     const obs = new IntersectionObserver(entries => {
       entries.forEach(e => {
         if (!e.isIntersecting) return;
         animateCounter(e.target, 0, parseFloat(e.target.dataset.count), 1200,
           parseInt(e.target.dataset.decimal || 0));
         obs.unobserve(e.target);
       });
     }, { threshold: .3 });
     document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
   });
   
   // ── Load from MongoDB ──
   async function loadPatients() {
     try {
       const data = await apiFetch('/patients');
       if (!data) return;
   
       patients = data.map(p => ({
         id:         p._id,
         displayId:  `PT-${p._id.slice(-4).toUpperCase()}`,
         first:      p.name?.split(' ')[0] || '',
         last:       p.name?.split(' ').slice(1).join(' ') || '',
         initials:   getInitials(p.name),
         gender:     capitalize(p.gender) || 'Other',
         age:        p.age || 0,
         email:      p.email || '',
         phone:      p.phone || '',
         tooth:      p.tooth || '',
         lastVisit:  p.updatedAt || p.createdAt,
         lastScore:  p.lastScore || 0,
         totalCases: p.totalCases || 0,
         recall:     p.recall || '6 months',
         notes:      p.medicalHistory || '',
         status:     p.status || 'active',
       }));
   
       updateStatCards();
       applyFilters();
     } catch (err) {
       showToast('Failed to load patients', 'error');
       console.error(err);
     }
   }
   
   function updateStatCards() {
     const allCountEls = document.querySelectorAll('.stat-card-num[data-count]');
     if (allCountEls[0]) {
       allCountEls[0].dataset.count = patients.length;
       allCountEls[0].textContent = patients.length;
     }
   }
   
   // ── Filters ──
   tableSearch?.addEventListener('input',  () => { currentPage = 1; applyFilters(); });
   globalSearch?.addEventListener('input', e => {
     if (tableSearch) tableSearch.value = e.target.value;
     currentPage = 1; applyFilters();
   });
   statusFilter?.addEventListener('change', () => { currentPage = 1; applyFilters(); });
   sortFilter?.addEventListener('change',   () => applyFilters());
   
   function applyFilters() {
     const q      = (tableSearch?.value || '').toLowerCase().trim();
     const status = statusFilter?.value || '';
     const sort   = sortFilter?.value || 'name';
   
     filteredPatients = patients.filter(p => {
       const nameMatch = `${p.first} ${p.last}`.toLowerCase().includes(q) ||
         p.displayId.toLowerCase().includes(q) ||
         p.email.toLowerCase().includes(q);
       const statusMatch = !status || getScoreStatus(p.lastScore) === status;
       return nameMatch && statusMatch;
     });
   
     filteredPatients.sort((a, b) => {
       if (sort === 'score') return b.lastScore - a.lastScore;
       if (sort === 'date')  return new Date(b.lastVisit) - new Date(a.lastVisit);
       if (sort === 'id')    return a.displayId.localeCompare(b.displayId);
       return `${a.first} ${a.last}`.localeCompare(`${b.first} ${b.last}`);
     });
   
     renderView();
   }
   
   // ── Render ──
   function renderView() {
     if (currentView === 'table') renderTable();
     else renderGrid();
     renderPagination();
   }
   
   function getPageSlice() {
     const start = (currentPage - 1) * PAGE_SIZE;
     return filteredPatients.slice(start, start + PAGE_SIZE);
   }
   
   function renderTable() {
     const slice = getPageSlice();
     if (!tableBody) return;
     if (slice.length === 0) {
       tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--warm-gray-400,#9ca3af)">No patients found</td></tr>`;
       return;
     }
     tableBody.innerHTML = slice.map(p => {
       const status   = getScoreStatus(p.lastScore);
       const avClass  = p.gender === 'Female' ? 'female' : p.gender === 'Male' ? 'male' : '';
       return `
       <tr>
         <td>
           <div class="pt-name-cell">
             <div class="pt-av ${avClass}">${p.initials}</div>
             <div>
               <div class="pt-fullname">${p.first} ${p.last}</div>
               <div class="pt-email">${p.email}</div>
             </div>
           </div>
         </td>
         <td><span style="font-family:var(--font-mono);font-size:.78rem;color:var(--warm-gray-400,#9ca3af)">${p.displayId}</span></td>
         <td>${p.age}</td>
         <td><span class="tooth-tag">${p.tooth || '—'}</span></td>
         <td>${formatDate(p.lastVisit)}</td>
         <td><span class="score-num-display ${status}">${p.lastScore || '—'}</span></td>
         <td><span class="badge badge-${status}">${capitalize(status)}</span></td>
         <td>
           <div class="tbl-actions">
             <button class="tbl-icon-btn" onclick="viewPatient('${p.id}')" title="View">
               <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 8C3 4.5 5.5 3 8 3s5 1.5 6.5 5c-1.5 3.5-4 5-6.5 5s-5-1.5-6.5-5z" stroke="currentColor" stroke-width="1.3"/></svg>
             </button>
             <button class="tbl-icon-btn" onclick="editPatient('${p.id}')" title="Edit">
               <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
             </button>
             <a class="tbl-icon-btn" href="analyze.html?patientId=${p.id}&patientName=${encodeURIComponent(p.first+' '+p.last)}" title="Analyse">
               <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 8h5M8 5.5v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
             </a>
             <button class="tbl-icon-btn del" onclick="deletePatient('${p.id}')" title="Delete">
               <svg viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M6 8v4M10 8v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M4 5l1 9h6l1-9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
             </button>
           </div>
         </td>
       </tr>`;
     }).join('');
   }
   
   function renderGrid() {
     if (!gridView) return;
     const slice = getPageSlice();
     gridView.innerHTML = slice.map(p => {
       const status  = getScoreStatus(p.lastScore);
       const avClass = p.gender === 'Female' ? 'female' : p.gender === 'Male' ? 'male' : '';
       const pct     = (p.lastScore / 10) * 100;
       return `
       <div class="pt-grid-card" onclick="viewPatient('${p.id}')">
         <div class="pgc-top">
           <div class="pgc-av ${avClass}">${p.initials}</div>
           <div>
             <div class="pgc-name">${p.first} ${p.last}</div>
             <div class="pgc-id">${p.displayId}</div>
           </div>
         </div>
         <div class="pgc-score-row">
           <div class="pgc-score ${status}">${p.lastScore || '—'}<span style="font-size:.8rem;color:var(--warm-gray-400,#9ca3af)">/10</span></div>
           <span class="badge badge-${status}">${capitalize(status)}</span>
         </div>
         <div class="pgc-bar-track">
           <div class="pgc-bar-fill ${status}" style="width:${pct}%"></div>
         </div>
         <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--warm-gray-400,#9ca3af);margin-bottom:12px">
           <span>Tooth ${p.tooth || '—'} · Age ${p.age}</span>
           <span>${formatDate(p.lastVisit)}</span>
         </div>
         <div class="pgc-actions">
           <a href="analyze.html?patientId=${p.id}&patientName=${encodeURIComponent(p.first+' '+p.last)}"
              class="btn btn-accent btn-sm" style="flex:1;justify-content:center"
              onclick="event.stopPropagation()">Analyse</a>
           <button class="btn btn-ghost btn-sm"
              onclick="event.stopPropagation();editPatient('${p.id}')">Edit</button>
         </div>
       </div>`;
     }).join('');
   }
   
   function renderPagination() {
     if (!pagination) return;
     const total      = filteredPatients.length;
     const totalPages = Math.ceil(total / PAGE_SIZE);
     const start      = (currentPage - 1) * PAGE_SIZE + 1;
     const end        = Math.min(currentPage * PAGE_SIZE, total);
   
     pagination.innerHTML = `
       <span>Showing ${total === 0 ? 0 : start}–${end} of ${total} patients</span>
       <div class="page-btns">
         <button class="page-btn" onclick="changePage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>
         ${Array.from({length:totalPages},(_,i)=>`<button class="page-btn${currentPage===i+1?' active':''}" onclick="changePage(${i+1})">${i+1}</button>`).join('')}
         <button class="page-btn" onclick="changePage(${currentPage+1})" ${currentPage===totalPages||totalPages===0?'disabled':''}>›</button>
       </div>`;
   }
   
   window.changePage = function(p) {
     const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);
     if (p < 1 || p > totalPages) return;
     currentPage = p; renderView();
   };
   
   // ── View toggle ──
   viewToggle?.addEventListener('click', () => {
     currentView = currentView === 'table' ? 'grid' : 'table';
     if (tableView) tableView.style.display = currentView === 'table' ? 'block' : 'none';
     if (gridView)  gridView.style.display  = currentView === 'grid'  ? 'grid'  : 'none';
     renderView();
   });
   
   // ── View patient detail ──
   window.viewPatient = function(id) {
     const p = patients.find(x => x.id === id);
     if (!p) return;
     const status  = getScoreStatus(p.lastScore);
     const avClass = p.gender === 'Female' ? 'female' : p.gender === 'Male' ? 'male' : '';
   
     const detailName = document.getElementById('detailName');
     const detailBody = document.getElementById('detailBody');
     if (detailName) detailName.textContent = `${p.first} ${p.last}`;
     if (detailBody) detailBody.innerHTML = `
       <div class="detail-header">
         <div class="detail-av ${avClass}">${p.initials}</div>
         <div>
           <div class="detail-name">${p.first} ${p.last}</div>
           <div class="detail-sub">${p.displayId} · ${p.gender} · Age ${p.age}</div>
         </div>
         <div style="margin-left:auto">
           <span class="badge badge-${status}" style="font-size:.8rem;padding:5px 14px">
             ${capitalize(status)} · ${p.lastScore}/10
           </span>
         </div>
       </div>
       <div class="detail-section">
         <div class="detail-section-title">Contact</div>
         <div class="detail-grid">
           <div class="detail-item"><div class="di-label">Phone</div><div class="di-val">${p.phone || '—'}</div></div>
           <div class="detail-item"><div class="di-label">Email</div><div class="di-val">${p.email || '—'}</div></div>
         </div>
       </div>
       <div class="detail-section">
         <div class="detail-section-title">Clinical</div>
         <div class="detail-grid">
           <div class="detail-item"><div class="di-label">Tooth</div><div class="di-val">${p.tooth || '—'}</div></div>
           <div class="detail-item"><div class="di-label">Last Visit</div><div class="di-val">${formatDate(p.lastVisit)}</div></div>
           <div class="detail-item"><div class="di-label">Recall Interval</div><div class="di-val">${p.recall}</div></div>
           <div class="detail-item"><div class="di-label">Status</div><div class="di-val">${capitalize(p.status)}</div></div>
         </div>
       </div>
       <div class="detail-section">
         <div class="detail-section-title">Medical Notes</div>
         <p style="font-size:.875rem;color:var(--warm-gray-600,#6b7280);line-height:1.6">${p.notes || 'None recorded.'}</p>
       </div>
       <div class="detail-actions">
         <a href="analyze.html?patientId=${p.id}&patientName=${encodeURIComponent(p.first+' '+p.last)}"
            class="btn btn-accent">Run New Analysis</a>
         <a href="history.html" class="btn btn-ghost">View Case History</a>
         <button class="btn btn-ghost" onclick="editPatient('${p.id}')">Edit</button>
       </div>`;
   
     // Close patientModal (if open) before showing detail
     closeModal('patientModal');
     openModal('detailModal');
   };
   
   // ── Add patient ──
   document.getElementById('addPatientBtn')?.addEventListener('click', () => {
     editingId = null;
     const modalTitle = document.getElementById('modalTitle');
     if (modalTitle) modalTitle.textContent = 'Add New Patient';
     ['ptFirstName','ptLastName','ptAge','ptPhone','ptEmail','ptNotes'].forEach(id => {
       const el = document.getElementById(id); if (el) el.value = '';
     });
     const genderEl = document.getElementById('ptGender');
     const toothEl  = document.getElementById('ptTooth');
     const recallEl = document.getElementById('ptRecall');
     if (genderEl) genderEl.value = '';
     if (toothEl)  toothEl.value  = '';
     if (recallEl) recallEl.value = '6 months';
   
     openModal('patientModal');
   });
   
   // ── Edit patient ──
   // Always closes detailModal first so the two modals never stack
   window.editPatient = function(id) {
     const p = patients.find(x => x.id === id);
     if (!p) return;
     editingId = id;
     const modalTitle = document.getElementById('modalTitle');
     if (modalTitle) modalTitle.textContent = 'Edit Patient';
     document.getElementById('ptFirstName').value = p.first;
     document.getElementById('ptLastName').value  = p.last;
     document.getElementById('ptAge').value       = p.age;
     document.getElementById('ptGender').value    = p.gender;
     document.getElementById('ptPhone').value     = p.phone;
     document.getElementById('ptEmail').value     = p.email;
     document.getElementById('ptNotes').value     = p.notes;
     document.getElementById('ptTooth').value     = p.tooth;
     document.getElementById('ptRecall').value    = p.recall;
   
     // ✅ Drawer slides in from right — detail modal stays visible behind it
     openModal('patientModal');
   };
   
   // ── Save patient → MongoDB ──
   document.getElementById('savePatientBtn')?.addEventListener('click', async () => {
     const first = document.getElementById('ptFirstName')?.value.trim();
     const last  = document.getElementById('ptLastName')?.value.trim();
     if (!first || !last) { showToast('First and last name are required', 'error'); return; }
   
     const payload = {
       name:           `${first} ${last}`,
       age:            parseInt(document.getElementById('ptAge')?.value) || 0,
       gender:         document.getElementById('ptGender')?.value?.toLowerCase() || 'other',
       phone:          document.getElementById('ptPhone')?.value || '',
       email:          document.getElementById('ptEmail')?.value || '',
       medicalHistory: document.getElementById('ptNotes')?.value || '',
       tooth:          document.getElementById('ptTooth')?.value || '',
       recall:         document.getElementById('ptRecall')?.value || '6 months',
     };
   
     const saveBtn = document.getElementById('savePatientBtn');
     if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }
   
     try {
       if (editingId) {
         await apiFetch(`/patients/${editingId}`, { method: 'PUT', body: payload });
         showToast('Patient record updated');
       } else {
         await apiFetch('/patients', { method: 'POST', body: payload });
         showToast('Patient added successfully');
       }
       closeModal('patientModal');
       await loadPatients();
     } catch (err) {
       showToast(err.message || 'Failed to save patient', 'error');
       console.error(err);
     } finally {
       if (saveBtn) {
         saveBtn.disabled = false;
         saveBtn.innerHTML = `<svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg> Save Patient`;
       }
     }
   });
   
   // ── Delete patient → MongoDB ──
   window.deletePatient = async function(id) {
     if (!confirm('Delete this patient record? This cannot be undone.')) return;
     try {
       await apiFetch(`/patients/${id}`, { method: 'DELETE' });
       showToast('Patient deleted');
       await loadPatients();
     } catch (err) {
       showToast('Failed to delete patient', 'error');
       console.error(err);
     }
   };