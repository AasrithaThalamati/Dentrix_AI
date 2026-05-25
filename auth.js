/**
 * ObturaScore AI — Shared Auth Helper
 * Include this on every page:  <script src="auth.js"></script>
 *
 * Usage:
 *   const user = ObturaAuth.getUser();
 *   ObturaAuth.saveUser(userObj);
 *   ObturaAuth.requireAuth();
 *   ObturaAuth.logout();
 *   ObturaAuth.getInitials(name);
 *   ObturaAuth.apiFetch('/api/patients', { method: 'POST', body: JSON.stringify({...}) });
 */

const ObturaAuth = (() => {
    const KEYS = {
      session:  'obturaAuth',
      local:    'dentrix_user',
      localAlt: 'obturaCurrentUser',
      token:    'dentrix_token',
    };
  
    const BASE_URL = 'https://dentrix-ai-8k2b.vercel.app'; // change to production URL when deploying
  
    // ─── User Storage ────────────────────────────────────────────────
  
    function getUser() {
      try {
        return (
          JSON.parse(sessionStorage.getItem(KEYS.session)) ||
          JSON.parse(localStorage.getItem(KEYS.local))     ||
          JSON.parse(localStorage.getItem(KEYS.localAlt))
        );
      } catch (e) { return null; }
    }
  
    function getToken() {
      return localStorage.getItem(KEYS.token);
    }
  
    function getInitials(name) {
      if (!name) return '?';
      return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }
  
    function saveUser(userData) {
      const parts = (userData.name || '').trim().split(/\s+/);
      const normalised = {
        ...userData,
        name:      userData.name || `${userData.firstName||''} ${userData.lastName||''}`.trim(),
        firstName: userData.firstName || parts[0] || '',
        lastName:  userData.lastName  || parts.slice(1).join(' ') || '',
        initials:  getInitials(userData.name || `${userData.firstName||''} ${userData.lastName||''}`)
      };
      localStorage.setItem(KEYS.local,    JSON.stringify(normalised));
      localStorage.setItem(KEYS.localAlt, JSON.stringify(normalised));
      sessionStorage.setItem(KEYS.session, JSON.stringify(normalised));
      return normalised;
    }
  
    function saveToken(token) {
      localStorage.setItem(KEYS.token, token);
    }
  
    // ─── Auth Actions ─────────────────────────────────────────────────
  
    function requireAuth(redirectTo = 'signup.html') {
      if (!getUser() || !getToken()) {
        window.location.href = redirectTo;
        return false;
      }
      return true;
    }
  
    function logout(redirectTo = 'signup.html') {
      sessionStorage.removeItem(KEYS.session);
      localStorage.removeItem(KEYS.local);
      localStorage.removeItem(KEYS.localAlt);
      localStorage.removeItem(KEYS.token);
      window.location.href = redirectTo;
    }
  
    // ─── API Fetch (always sends JWT token) ──────────────────────────
  
    async function apiFetch(endpoint, options = {}) {
      const token = getToken();
  
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(options.headers || {})
        }
      };
  
      // If body is an object, stringify it
      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }
  
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
  
        // Token expired or invalid — force logout
        if (res.status === 401) {
          console.warn('Session expired. Logging out...');
          logout();
          return null;
        }
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || `Request failed: ${res.status}`);
        }
  
        return data;
  
      } catch (err) {
        console.error(`apiFetch error [${endpoint}]:`, err.message);
        throw err;
      }
    }
  
    // ─── Signup / Login helpers ───────────────────────────────────────
  
    async function signup({ name, email, password, clinic }) {
      const data = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: { name, email, password, clinic }
      });
      if (data) {
        saveToken(data.token);
        saveUser(data.user);
      }
      return data;
    }
  
    async function login({ email, password }) {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      if (data) {
        saveToken(data.token);
        saveUser(data.user);
      }
      return data;
    }
  
    // ─── Page Hydration ───────────────────────────────────────────────
  
    /**
     * Inject the logged-in user's data into elements with data-auth attributes:
     *   data-auth="name"     → full name
     *   data-auth="initials" → initials (for avatar circles)
     *   data-auth="role"     → specialization or role
     *   data-auth="email"    → email
     *   data-auth="clinic"   → clinic name
     */
    function hydratePage() {
      const user = getUser();
      if (!user) return;
      document.querySelectorAll('[data-auth]').forEach(el => {
        const field = el.getAttribute('data-auth');
        switch (field) {
          case 'name':     el.textContent = user.name || ''; break;
          case 'initials': el.textContent = getInitials(user.name); break;
          case 'role':     el.textContent = user.specialization || user.role || ''; break;
          case 'email':    el.textContent = user.email || ''; break;
          case 'clinic':   el.textContent = user.clinic || ''; break;
          default:         el.textContent = user[field] || ''; break;
        }
      });
    }
  
    // Auto-hydrate on DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hydratePage);
    } else {
      hydratePage();
    }
  
    return {
      getUser,
      getToken,
      saveUser,
      saveToken,
      requireAuth,
      logout,
      getInitials,
      hydratePage,
      apiFetch,
      signup,
      login,
      BASE_URL
    };
  
  })();