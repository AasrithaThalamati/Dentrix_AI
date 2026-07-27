/* ============================================================
   Dentrix AI — Profile Page JS (Strict Profile Scoped & MongoDB Connected)
   ============================================================ */

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0'))
  ? 'http://127.0.0.1:5001/api'
  : 'https://dentrix-ai-8k2b.vercel.app/api';

function getToken() {
  return localStorage.getItem('dentrix_token') || sessionStorage.getItem('dentrix_token') || '';
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadUserProfile();
  setupProfileListeners();
});

async function loadUserProfile() {
  let user = null;
  let analytics = null;
  let historyData = [];
  let patientsData = [];

  try {
    const [profRes, analRes, histRes, patRes] = await Promise.all([
      fetch(`${API_BASE}/profile`,   { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/analytics`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/history`,   { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/patients`,  { headers: getAuthHeaders() })
    ]);

    if (profRes.ok) user = await profRes.json();
    if (analRes.ok) analytics = await analRes.json();
    if (histRes.ok) historyData = await histRes.json();
    if (patRes.ok)  patientsData = await patRes.json();
  } catch (err) {
    console.warn('Could not load MongoDB profile data:', err);
  }

  if (!user) {
    const raw = localStorage.getItem('dentrix_user') || localStorage.getItem('dentrix_profile');
    if (raw) {
      try { user = JSON.parse(raw); } catch (e) {}
    }
  }

  if (!user) {
    user = {
      name: 'Dr. User',
      email: '',
      phone: '',
      clinic: '',
      specialization: 'Endodontist'
    };
  }

  if (user && user.avatar) {
    localStorage.setItem('dentrix_avatar', user.avatar);
  }

  populateProfileUI(user);
  populateStatsUI(analytics, Array.isArray(historyData) ? historyData.length : 0);
  populateActivityTimeline(historyData, patientsData);
  if (window.refreshTopbarAvatar) window.refreshTopbarAvatar();
}

function populateProfileUI(user) {
  let first = user.firstName || '';
  let last  = user.lastName  || '';

  if (!first && !last && user.name) {
    const nameParts = user.name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
    first = nameParts[0] || '';
    last  = nameParts.slice(1).join(' ') || '';
  }

  const firstInput  = document.getElementById('pfFirstName');
  const lastInput   = document.getElementById('pfLastName');
  const emailInput  = document.getElementById('pfEmail');
  const phoneInput  = document.getElementById('pfPhone');
  const clinicInput = document.getElementById('pfClinic');
  const cityInput   = document.getElementById('pfCity');
  const dobInput    = document.getElementById('pfDob');
  const genderInput = document.getElementById('pfGender');
  const specInput   = document.getElementById('pfSpec');
  const expInput    = document.getElementById('pfExp');
  const regInput    = document.getElementById('pfReg');
  const resInput    = document.getElementById('pfResearch');
  const bioInput    = document.getElementById('pfBio');

  if (firstInput)  firstInput.value  = first;
  if (lastInput)   lastInput.value   = last;
  if (emailInput)  emailInput.value  = user.email || '';
  if (phoneInput)  phoneInput.value  = user.phone || '';
  if (clinicInput) clinicInput.value = user.clinic || '';
  if (cityInput)   cityInput.value   = user.city || '';
  if (dobInput)    dobInput.value    = user.dob || '';
  if (genderInput && user.gender) genderInput.value = user.gender;
  if (specInput && user.specialization) specInput.value = user.specialization;
  if (expInput)    expInput.value    = user.experience || '';
  if (regInput)    regInput.value    = user.regNumber || '';
  if (resInput)    resInput.value    = user.researchFocus || '';
  if (bioInput)    bioInput.value    = user.bio || '';

  updateProfileHeader(first, last, user.specialization || 'Dental Specialist');
}

function updateProfileHeader(first, last, role) {
  const nameEl = document.querySelector('.avatar-name');
  if (nameEl) nameEl.textContent = (first || last) ? `Dr. ${first} ${last}`.trim() : 'Dr. User';

  const roleEl = document.getElementById('profileRole');
  if (roleEl) roleEl.textContent = role || 'Dental Specialist';

  const roleBadge = document.getElementById('profileRoleBadge');
  if (roleBadge) roleBadge.textContent = role || 'Dentist';

  const initials = `${first[0] || ''}${last[0] || ''}`.toUpperCase() || '??';
  const avatarEl = document.getElementById('avatarCircle');
  if (avatarEl && initials && !avatarEl.style.backgroundImage) {
    avatarEl.textContent = initials;
  }
}

function populateStatsUI(analytics, historyCount) {
  const totalCases    = analytics?.totalAnalyses ?? historyCount;
  const totalPatients = analytics?.totalPatients ?? 0;
  const avgScore      = analytics?.avgScore ?? 0.0;
  const pctOptimal    = analytics?.pctOptimal ?? 0;
  const retreatments  = analytics?.retreatmentsFlagged ?? 0;

  // Quick Stats
  const tc = document.getElementById('profTotalCases');
  const tp = document.getElementById('profTotalPatients');
  const avg = document.getElementById('profAvgScore');

  if (tc) tc.textContent = totalCases;
  if (tp) tp.textContent = totalPatients;
  if (avg) avg.textContent = parseFloat(avgScore).toFixed(1);

  // Performance Benchmarks
  const optRate = document.getElementById('profOptimalRate');
  const optBar  = document.getElementById('profOptimalBar');
  if (optRate) optRate.textContent = pctOptimal + '%';
  if (optBar)  optBar.style.width  = pctOptimal + '%';

  const avgVal = document.getElementById('profAvgScoreVal');
  const avgBar = document.getElementById('profAvgScoreBar');
  if (avgVal) avgVal.textContent = parseFloat(avgScore).toFixed(1) + '/10';
  if (avgBar) avgBar.style.width = (parseFloat(avgScore) * 10) + '%';

  const retRate = document.getElementById('profRetreatRate');
  const retBar  = document.getElementById('profRetreatBar');
  const retreatPct = totalCases > 0 ? Math.round((retreatments / totalCases) * 100) : 0;
  if (retRate) retRate.textContent = retreatPct + '%';
  if (retBar)  retBar.style.width  = retreatPct + '%';

  const youBench = document.getElementById('profYouBench');
  const youVal   = document.getElementById('profYouBenchVal');
  if (youVal)   youVal.textContent = parseFloat(avgScore).toFixed(1);
  if (youBench) youBench.style.width = (parseFloat(avgScore) * 10) + '%';
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Recently';

  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 2) return 'Just now';
  if (diffMin < 60) return `${diffMin} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function populateActivityTimeline(historyData, patientsData) {
  const container = document.getElementById('profileActivityTimeline');
  if (!container) return;

  const activities = [];

  if (Array.isArray(historyData)) {
    historyData.forEach(h => {
      const score = h.score || h.obturationScore || 0;
      const name = h.patient?.name || h.patient || 'Patient';
      const tooth = h.tooth || h.toothNumber || '—';
      const isRetreatment = score < 6.0;

      activities.push({
        title: isRetreatment
          ? `Retreatment flagged — ${name} · Tooth ${tooth} · Score ${score}/10`
          : `Analysis completed — ${name} · Tooth ${tooth} · Score ${score}/10`,
        time: formatTimeAgo(h.date),
        rawDate: new Date(h.date || Date.now()).getTime(),
        color: isRetreatment ? 'red' : 'blue'
      });
    });
  }

  if (Array.isArray(patientsData)) {
    patientsData.forEach(p => {
      activities.push({
        title: `New patient registered — ${p.name}`,
        time: formatTimeAgo(p.createdAt || p.updatedAt),
        rawDate: new Date(p.createdAt || p.updatedAt || Date.now()).getTime(),
        color: 'green'
      });
    });
  }

  activities.sort((a, b) => b.rawDate - a.rawDate);

  if (activities.length === 0) {
    container.innerHTML = `
      <div style="padding:28px 16px;text-align:center;color:var(--warm-gray-400);font-size:.875rem">
        No recent activity logged yet.<br/>
        <span style="font-size:0.78rem;color:var(--warm-gray-400);margin-top:4px;display:inline-block">Run an AI X-Ray analysis or add a patient to populate your activity log.</span>
      </div>`;
    return;
  }

  container.innerHTML = activities.slice(0, 7).map(a => `
    <div class="at-item">
      <div class="at-dot ${a.color}"></div>
      <div class="at-content">
        <div class="at-title">${a.title}</div>
        <div class="at-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function setupProfileListeners() {
  const pfFirst = document.getElementById('pfFirstName');
  const pfLast  = document.getElementById('pfLastName');
  const pfSpec  = document.getElementById('pfSpec');

  function onNameChange() {
    const f = pfFirst?.value.trim() || '';
    const l = pfLast?.value.trim()  || '';
    const spec = pfSpec?.value || 'Dentist';
    updateProfileHeader(f, l, spec);
  }

  pfFirst?.addEventListener('input', onNameChange);
  pfLast?.addEventListener('input',  onNameChange);
  pfSpec?.addEventListener('change', onNameChange);

  // Save profile changes to MongoDB & localStorage
  document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
    const first  = pfFirst?.value.trim() || '';
    const last   = pfLast?.value.trim()  || '';
    const email  = document.getElementById('pfEmail')?.value.trim() || '';
    const phone  = document.getElementById('pfPhone')?.value.trim() || '';
    const clinic = document.getElementById('pfClinic')?.value.trim() || '';
    const city   = document.getElementById('pfCity')?.value.trim() || '';
    const dob    = document.getElementById('pfDob')?.value || '';
    const gender = document.getElementById('pfGender')?.value || '';
    const specialization = pfSpec?.value || '';
    const experience     = parseInt(document.getElementById('pfExp')?.value) || 0;
    const regNumber      = document.getElementById('pfReg')?.value.trim() || '';
    const researchFocus  = document.getElementById('pfResearch')?.value.trim() || '';
    const bio            = document.getElementById('pfBio')?.value.trim() || '';

    if (!first && !last) {
      showToast('Please enter your name', 'error');
      return;
    }

    const fullName = `Dr. ${first} ${last}`.trim();
    const profilePayload = {
      name: fullName,
      firstName: first,
      lastName: last,
      email,
      phone,
      clinic,
      city,
      dob,
      gender,
      specialization,
      experience,
      regNumber,
      researchFocus,
      bio
    };

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(profilePayload)
      });

      let updatedUser = profilePayload;
      if (res.ok) {
        updatedUser = await res.json();
      }

      localStorage.setItem('dentrix_user', JSON.stringify({
        ...updatedUser,
        name: fullName,
        email,
        clinic
      }));

      if (window.refreshTopbarAvatar) window.refreshTopbarAvatar();
      showToast('Profile saved to MongoDB ✓');
    } catch (err) {
      console.warn('Profile save error:', err);
      localStorage.setItem('dentrix_user', JSON.stringify(profilePayload));
      if (window.refreshTopbarAvatar) window.refreshTopbarAvatar();
      showToast('Profile saved ✓');
    }
  });

  // Avatar Photo Change
  document.getElementById('avatarChangeBtn')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async ev => {
        const base64Data = ev.target.result;

        // Save locally for instant cross-tab & cross-page UI update
        localStorage.setItem('dentrix_avatar', base64Data);

        const raw = localStorage.getItem('dentrix_user');
        if (raw) {
          try {
            const u = JSON.parse(raw);
            u.avatar = base64Data;
            localStorage.setItem('dentrix_user', JSON.stringify(u));
          } catch(e) {}
        }

        if (window.refreshTopbarAvatar) window.refreshTopbarAvatar();

        // Save avatar in MongoDB database
        try {
          await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ avatar: base64Data })
          });
          showToast('Profile photo saved to MongoDB ✓');
        } catch (err) {
          console.warn('Could not save photo to MongoDB:', err);
          showToast('Profile photo updated');
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}