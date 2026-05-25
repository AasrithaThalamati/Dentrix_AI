// api.js — drop this in your Dentrix_AI project root or src/
// Use this in all your HTML pages to call the backend

const API_BASE = 'https://dentrix-ai-8k2b.vercel.app/api';

// Get stored token
const getToken = () => localStorage.getItem('dentrix_token');

// Save token and user after login/signup
const saveAuth = (token, user) => {
  localStorage.setItem('dentrix_token', token);
  localStorage.setItem('dentrix_user', JSON.stringify(user));
};

// Clear auth (logout)
const clearAuth = () => {
  localStorage.removeItem('dentrix_token');
  localStorage.removeItem('dentrix_user');
};

// Get logged in user
const getUser = () => JSON.parse(localStorage.getItem('dentrix_user'));

// Redirect to login if not authenticated
const requireAuth = () => {
  if (!getToken()) window.location.href = '/signup.html';
};

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── AUTH ───────────────────────────────────────────
const Auth = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  signup: (name, email, password, clinic) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password, clinic }) }),

  me: () => apiFetch('/auth/me'),
  logout: () => { clearAuth(); window.location.href = '/signup.html'; }
};

// ─── PATIENTS ────────────────────────────────────────
const Patients = {
  getAll: () => apiFetch('/patients'),
  getOne: (id) => apiFetch(`/patients/${id}`),
  create: (data) => apiFetch('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/patients/${id}`, { method: 'DELETE' })
};

// ─── ANALYSIS ────────────────────────────────────────
const Analysis = {
  getAll: () => apiFetch('/analysis'),
  getOne: (id) => apiFetch(`/analysis/${id}`),
  // For file upload, use FormData (no JSON header)
  create: async (patientId, file) => {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('xray', file);
    const res = await fetch(`${API_BASE}/analysis`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  delete: (id) => apiFetch(`/analysis/${id}`, { method: 'DELETE' })
};

// ─── HISTORY ─────────────────────────────────────────
const History = {
  getAll: () => apiFetch('/history'),
  create: (data) => apiFetch('/history', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/history/${id}`, { method: 'DELETE' })
};

// ─── ANALYTICS ───────────────────────────────────────
const Analytics = {
  get: () => apiFetch('/analytics')
};

// ─── PROFILE ─────────────────────────────────────────
const Profile = {
  get: () => apiFetch('/profile'),
  update: (data) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (currentPassword, newPassword) =>
    apiFetch('/profile/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) })
};

// ─── RESEARCH ────────────────────────────────────────
const Research = {
  getAll: () => apiFetch('/research'),
  create: (data) => apiFetch('/research', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/research/${id}`, { method: 'DELETE' })
};
