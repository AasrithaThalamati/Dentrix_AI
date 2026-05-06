/* ============================================================
   ObturaScore AI — Patients Page JS
   ============================================================ */

// ── Mock dataset ──
let patients = [
    { id:'PT-0081', first:'Riya',    last:'Arora',   initials:'RA', gender:'Female', age:34, email:'riya.arora@email.com',    phone:'+91 98765 43210', tooth:'26', lastVisit:'2026-05-03', lastScore:8.4, totalCases:3, recall:'6 months', notes:'No systemic conditions.' },
    { id:'PT-0080', first:'Manav',   last:'Khanna',  initials:'MK', gender:'Male',   age:45, email:'manav.k@email.com',        phone:'+91 97654 32109', tooth:'36', lastVisit:'2026-05-02', lastScore:6.7, totalCases:2, recall:'6 months', notes:'Hypertension — on medication.' },
    { id:'PT-0079', first:'Sonal',   last:'Patel',   initials:'SP', gender:'Female', age:29, email:'sonal.patel@email.com',    phone:'+91 96543 21098', tooth:'16', lastVisit:'2026-04-30', lastScore:4.9, totalCases:1, recall:'3 months', notes:'Allergic to penicillin.' },
    { id:'PT-0078', first:'Arjun',   last:'Joshi',   initials:'AJ', gender:'Male',   age:52, email:'arjun.joshi@email.com',    phone:'+91 95432 10987', tooth:'46', lastVisit:'2026-04-29', lastScore:9.1, totalCases:4, recall:'12 months', notes:'Diabetic — Type 2.' },
    { id:'PT-0077', first:'Neha',    last:'Mehta',   initials:'NM', gender:'Female', age:38, email:'neha.m@email.com',          phone:'+91 94321 09876', tooth:'11', lastVisit:'2026-04-28', lastScore:3.2, totalCases:2, recall:'3 months', notes:'Retreatment required.' },
    { id:'PT-0076', first:'Rakesh',  last:'Iyer',    initials:'RI', gender:'Male',   age:61, email:'rakesh.iyer@email.com',    phone:'+91 93210 98765', tooth:'36', lastVisit:'2026-04-25', lastScore:7.8, totalCases:5, recall:'6 months', notes:'Post-surgical — monitoring.' },
    { id:'PT-0075', first:'Priya',   last:'Desai',   initials:'PD', gender:'Female', age:27, email:'priya.desai@email.com',    phone:'+91 92109 87654', tooth:'21', lastVisit:'2026-04-22', lastScore:8.9, totalCases:1, recall:'12 months', notes:'No significant history.' },
    { id:'PT-0074', first:'Farhan',  last:'Sheikh',  initials:'FS', gender:'Male',   age:40, email:'farhan.s@email.com',        phone:'+91 91098 76543', tooth:'47', lastVisit:'2026-04-20', lastScore:5.5, totalCases:3, recall:'3 months', notes:'Anxious patient — sedation noted.' },
    { id:'PT-0073', first:'Kavita',  last:'Singh',   initials:'KS', gender:'Female', age:55, email:'kavita.singh@email.com',   phone:'+91 90987 65432', tooth:'15', lastVisit:'2026-04-18', lastScore:7.2, totalCases:2, recall:'6 months', notes:'Osteoporosis.' },
    { id:'PT-0072', first:'Deepak',  last:'Nair',    initials:'DN', gender:'Male',   age:48, email:'deepak.nair@email.com',    phone:'+91 89876 54321', tooth:'14', lastVisit:'2026-04-15', lastScore:6.1, totalCases:2, recall:'6 months', notes:'No systemic issues.' },
    { id:'PT-0071', first:'Anjali',  last:'Verma',   initials:'AV', gender:'Female', age:33, email:'anjali.v@email.com',        phone:'+91 88765 43210', tooth:'27', lastVisit:'2026-04-10', lastScore:8.3, totalCases:1, recall:'12 months', notes:'None.' },
    { id:'PT-0070', first:'Rohan',   last:'Sharma',  initials:'RS', gender:'Male',   age:22, email:'rohan.sh@email.com',        phone:'+91 87654 32109', tooth:'46', lastVisit:'2026-04-05', lastScore:2.8, totalCases:1, recall:'3 months', notes:'Trauma history.' },
  ];
  
  // ── State ──
  let filteredPatients = [...patients];
  let currentView = 'table';
  let currentPage = 1;
  const PAGE_SIZE = 8;
  let editingId = null;
  
  // ── DOM ──
  const tableBody   = document.getElementById('patientTableBody');
  const gridView    = document.getElementById('gridView');
  const tableView   = document.getElementById('tableView');
  const tableSearch = document.getElementById('tableSearch');
  const globalSearch= document.getElementById('globalSearch');
  const statusFilter= document.getElementById('statusFilter');
  const sortFilter  = document.getElementById('sortFilter');
  const pagination  = document.getElementById('pagination');
  const viewToggle  = document.getElementById('viewToggle');
  
  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
  
    // Animate stat counters
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        animateCounter(el, 0, parseFloat(el.dataset.count), 1200, parseInt(el.dataset.decimal||0));
        obs.unobserve(el);
      });
    }, { threshold: .3 });
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
  });
  
  // ── Filters ──
  tableSearch?.addEventListener('input', () => { currentPage = 1; applyFilters(); });
  globalSearch?.addEventListener('input', e => {
    if (tableSearch) tableSearch.value = e.target.value;
    currentPage = 1; applyFilters();
  });
  statusFilter?.addEventListener('change', () => { currentPage = 1; applyFilters(); });
  sortFilter?.addEventListener('change', () => applyFilters());
  
  function applyFilters() {
    const q      = (tableSearch?.value || '').toLowerCase().trim();
    const status = statusFilter?.value || '';
    const sort   = sortFilter?.value || 'name';
  
    filteredPatients = patients.filter(p => {
      const nameMatch = `${p.first} ${p.last}`.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      const statusMatch = !status || getScoreStatus(p.lastScore) === status;
      return nameMatch && statusMatch;
    });
  
    filteredPatients.sort((a, b) => {
      if (sort === 'score') return b.lastScore - a.lastScore;
      if (sort === 'date')  return new Date(b.lastVisit) - new Date(a.lastVisit);
      if (sort === 'id')    return a.id.localeCompare(b.id);
      return `${a.first} ${a.last}`.localeCompare(`${b.first} ${b.last}`);
    });
  
    renderView();
  }
  
  function getScoreStatus(s) {
    if (s >= 8) return 'optimal';
    if (s >= 6) return 'acceptable';
    if (s >= 4) return 'suboptimal';
    return 'poor';
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
    tableBody.innerHTML = slice.map(p => {
      const status = getScoreStatus(p.lastScore);
      const badgeClass = `badge-${status}`;
      const scoreClass = status;
      const avClass = p.gender === 'Female' ? 'female' : p.gender === 'Male' ? 'male' : '';
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
        <td><span style="font-family:var(--font-mono);font-size:.78rem;color:var(--warm-gray-400)">${p.id}</span></td>
        <td>${p.age}</td>
        <td><span class="tooth-tag">${p.tooth || '—'}</span></td>
        <td>${formatDate(p.lastVisit)}</td>
        <td><span class="score-num-display ${scoreClass}">${p.lastScore}</span></td>
        <td><span class="badge ${badgeClass}">${capitalize(status)}</span></td>
        <td>
          <div class="tbl-actions">
            <button class="tbl-icon-btn" onclick="viewPatient('${p.id}')" title="View">
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 8C3 4.5 5.5 3 8 3s5 1.5 6.5 5c-1.5 3.5-4 5-6.5 5s-5-1.5-6.5-5z" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
            <button class="tbl-icon-btn" onclick="editPatient('${p.id}')" title="Edit">
              <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
            </button>
            <a class="tbl-icon-btn" href="analyze.html" title="Analyse">
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
    const slice = getPageSlice();
    gridView.innerHTML = slice.map(p => {
      const status   = getScoreStatus(p.lastScore);
      const avClass  = p.gender === 'Female' ? 'female' : p.gender === 'Male' ? 'male' : '';
      const pct      = (p.lastScore / 10) * 100;
      return `
      <div class="pt-grid-card" onclick="viewPatient('${p.id}')">
        <div class="pgc-top">
          <div class="pgc-av ${avClass}">${p.initials}</div>
          <div>
            <div class="pgc-name">${p.first} ${p.last}</div>
            <div class="pgc-id">${p.id}</div>
          </div>
        </div>
        <div class="pgc-score-row">
          <div class="pgc-score ${status}">${p.lastScore}<span style="font-size:.8rem;color:var(--warm-gray-400)">/10</span></div>
          <span class="badge badge-${status}">${capitalize(status)}</span>
        </div>
        <div class="pgc-bar-track">
          <div class="pgc-bar-fill ${status}" style="width:${pct}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--warm-gray-400);margin-bottom:12px">
          <span>Tooth ${p.tooth || '—'} · Age ${p.age}</span>
          <span>${formatDate(p.lastVisit)}</span>
        </div>
        <div class="pgc-actions">
          <a href="analyze.html" class="btn btn-accent btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation()">Analyse</a>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();editPatient('${p.id}')">Edit</button>
        </div>
      </div>`;
    }).join('');
  }
  
  function renderPagination() {
    const total = filteredPatients.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end   = Math.min(currentPage * PAGE_SIZE, total);
  
    pagination.innerHTML = `
      <span>Showing ${total === 0 ? 0 : start}–${end} of ${total} patients</span>
      <div class="page-btns">
        <button class="page-btn" onclick="changePage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>
        ${Array.from({length: totalPages}, (_,i) => `<button class="page-btn${currentPage===i+1?' active':''}" onclick="changePage(${i+1})">${i+1}</button>`).join('')}
        <button class="page-btn" onclick="changePage(${currentPage+1})" ${currentPage===totalPages||totalPages===0?'disabled':''}>›</button>
      </div>
    `;
  }
  
  window.changePage = function(p) {
    const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);
    if (p < 1 || p > totalPages) return;
    currentPage = p;
    renderView();
  };
  
  // ── View toggle ──
  viewToggle?.addEventListener('click', () => {
    currentView = currentView === 'table' ? 'grid' : 'table';
    tableView.style.display = currentView === 'table' ? 'block' : 'none';
    gridView.style.display  = currentView === 'grid'  ? 'grid'  : 'none';
    renderView();
  });
  
  // ── View patient detail ──
  window.viewPatient = function(id) {
    const p = patients.find(x => x.id === id);
    if (!p) return;
    const status = getScoreStatus(p.lastScore);
    const avClass = p.gender === 'Female' ? 'female' : p.gender === 'Male' ? 'male' : '';
  
    document.getElementById('detailName').textContent = `${p.first} ${p.last}`;
    document.getElementById('detailBody').innerHTML = `
      <div class="detail-header">
        <div class="detail-av ${avClass}">${p.initials}</div>
        <div>
          <div class="detail-name">${p.first} ${p.last}</div>
          <div class="detail-sub">${p.id} · ${p.gender} · Age ${p.age}</div>
        </div>
        <div style="margin-left:auto">
          <span class="badge badge-${status}" style="font-size:.8rem;padding:5px 14px">${capitalize(status)} · ${p.lastScore}/10</span>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">Contact</div>
        <div class="detail-grid">
          <div class="detail-item"><div class="di-label">Phone</div><div class="di-val">${p.phone}</div></div>
          <div class="detail-item"><div class="di-label">Email</div><div class="di-val">${p.email}</div></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">Clinical</div>
        <div class="detail-grid">
          <div class="detail-item"><div class="di-label">Tooth</div><div class="di-val">${p.tooth || '—'}</div></div>
          <div class="detail-item"><div class="di-label">Last Visit</div><div class="di-val">${formatDate(p.lastVisit)}</div></div>
          <div class="detail-item"><div class="di-label">Total Cases</div><div class="di-val">${p.totalCases}</div></div>
          <div class="detail-item"><div class="di-label">Recall Interval</div><div class="di-val">${p.recall}</div></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">Medical Notes</div>
        <p style="font-size:.875rem;color:var(--warm-gray-600);line-height:1.6">${p.notes || 'None recorded.'}</p>
      </div>
      <div class="detail-actions">
        <a href="analyze.html" class="btn btn-accent">Run New Analysis</a>
        <a href="history.html" class="btn btn-ghost">View Case History</a>
        <button class="btn btn-ghost" onclick="editPatient('${p.id}');closeModal('detailModal')">Edit</button>
      </div>
    `;
    openModal('detailModal');
  };
  
  // ── Add patient ──
  document.getElementById('addPatientBtn')?.addEventListener('click', () => {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Patient';
    ['ptFirstName','ptLastName','ptAge','ptPhone','ptEmail','ptNotes'].forEach(id => {
      const el = document.getElementById(id); if(el) el.value='';
    });
    document.getElementById('ptGender').value = '';
    document.getElementById('ptTooth').value  = '';
    openModal('patientModal');
  });
  
  // ── Edit patient ──
  window.editPatient = function(id) {
    const p = patients.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Patient';
    document.getElementById('ptFirstName').value = p.first;
    document.getElementById('ptLastName').value  = p.last;
    document.getElementById('ptAge').value       = p.age;
    document.getElementById('ptGender').value    = p.gender;
    document.getElementById('ptPhone').value     = p.phone;
    document.getElementById('ptEmail').value     = p.email;
    document.getElementById('ptNotes').value     = p.notes;
    document.getElementById('ptTooth').value     = p.tooth;
    document.getElementById('ptRecall').value    = p.recall;
    openModal('patientModal');
  };
  
  // ── Save patient ──
  document.getElementById('savePatientBtn')?.addEventListener('click', () => {
    const first = document.getElementById('ptFirstName').value.trim();
    const last  = document.getElementById('ptLastName').value.trim();
    if (!first || !last) { showToast('First and last name are required', 'error'); return; }
  
    if (editingId) {
      const idx = patients.findIndex(p => p.id === editingId);
      if (idx > -1) {
        patients[idx] = { ...patients[idx],
          first, last,
          age:    parseInt(document.getElementById('ptAge').value)    || patients[idx].age,
          gender: document.getElementById('ptGender').value           || patients[idx].gender,
          phone:  document.getElementById('ptPhone').value            || patients[idx].phone,
          email:  document.getElementById('ptEmail').value            || patients[idx].email,
          notes:  document.getElementById('ptNotes').value            || patients[idx].notes,
          tooth:  document.getElementById('ptTooth').value            || patients[idx].tooth,
          recall: document.getElementById('ptRecall').value           || patients[idx].recall,
          initials: `${first[0]}${last[0]}`.toUpperCase(),
        };
      }
      showToast('Patient record updated');
    } else {
      const newId = `PT-${String(patients.length + 1).padStart(4, '0')}`;
      patients.unshift({
        id: newId,
        first, last,
        initials: `${first[0]}${last[0]}`.toUpperCase(),
        gender: document.getElementById('ptGender').value || 'Other',
        age:    parseInt(document.getElementById('ptAge').value) || 0,
        email:  document.getElementById('ptEmail').value  || '',
        phone:  document.getElementById('ptPhone').value  || '',
        tooth:  document.getElementById('ptTooth').value  || '',
        lastVisit: new Date().toISOString().slice(0,10),
        lastScore: 0,
        totalCases: 0,
        recall: document.getElementById('ptRecall').value || '6 months',
        notes:  document.getElementById('ptNotes').value  || '',
      });
      showToast('Patient added successfully');
    }
    closeModal('patientModal');
    applyFilters();
  });
  
  // ── Delete patient ──
  window.deletePatient = function(id) {
    if (!confirm('Delete this patient record? This cannot be undone.')) return;
    patients = patients.filter(p => p.id !== id);
    filteredPatients = filteredPatients.filter(p => p.id !== id);
    renderView();
    showToast('Patient deleted');
  };
  
  // ── Helpers ──
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }