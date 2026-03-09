// ═══════════════════════════════════════
// Make Future Center V2 — Global Config
// ═══════════════════════════════════════

const MF_CONFIG = {
  SUPABASE_URL: 'https://pjskzfyjzvibqglhdykc.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2t6ZnlqenZpYnFnbGhkeWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjU4NTcsImV4cCI6MjA4ODY0MTg1N30.AqdIBX-6tP9nMRVao4X7A1aV5L4J7mTiNC1RWeWf7LI',
  FN: 'https://pjskzfyjzvibqglhdykc.supabase.co/functions/v1',
  WA_ADMIN: '201210575530',
  PAYMENT_PHONE: '01210575530',
  BOOTSTRAP_SECRET: 'MF_BOOTSTRAP_2025_SECRET'
};

// ─── API Helper ───────────────────────
async function mfFetch(endpoint, options = {}) {
  const token = localStorage.getItem('mf_access_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(`${MF_CONFIG.FN}/${endpoint}`, { ...options, headers });
    const data = await res.json();
    return data;
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── Auth Helpers ─────────────────────
function getUser() {
  try { return JSON.parse(localStorage.getItem('mf_user') || 'null'); } catch { return null; }
}
function getToken() { return localStorage.getItem('mf_access_token'); }
function logout() {
  ['mf_user','mf_access_token','mf_refresh_token','mf_selected_course'].forEach(k => localStorage.removeItem(k));
  window.location.href = 'login.html';
}
function requireAuth(allowedRoles = []) {
  const user = getUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') window.location.href = 'student.html';
    else window.location.href = 'admin.html';
    return null;
  }
  return user;
}
function isAdmin(user) { return ['admin','superadmin','course_admin'].includes(user?.role); }
function isSuperAdmin(user) { return user?.role === 'superadmin'; }

// ─── Toast Notifications ──────────────
function toast(msg, type = 'info', duration = 3500) {
  const colors = { success: '#10b981', error: '#ef4444', info: '#7c3aed', warn: '#f59e0b' };
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:${colors[type]};color:#fff;padding:12px 24px;border-radius:14px;font-size:14px;font-family:Cairo,sans-serif;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,0.3);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);max-width:90vw;text-align:center;direction:rtl;`;
  el.textContent = icons[type] + ' ' + msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => { el.style.transform = 'translateX(-50%) translateY(100px)'; setTimeout(() => el.remove(), 300); }, duration);
}

// ─── Loading Overlay ──────────────────
function showLoading(show = true) {
  let ov = document.getElementById('mf-loading');
  if (show && !ov) {
    ov = document.createElement('div');
    ov.id = 'mf-loading';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.7);backdrop-filter:blur(4px);z-index:9998;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML = '<div style="width:48px;height:48px;border:3px solid rgba(124,58,237,0.3);border-top-color:#7c3aed;border-radius:50%;animation:spin 0.8s linear infinite;"></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(ov);
  } else if (!show && ov) ov.remove();
}

// ─── Dark Mode ────────────────────────
function initTheme() {
  const saved = localStorage.getItem('mf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mf_theme', next);
  return next;
}

// ─── Grade Labels ─────────────────────
const GRADE_LABELS = { '3prep':'الثالث الإعدادي','1sec':'الأول الثانوي','2sec':'الثاني الثانوي','3sec':'الثالث الثانوي' };
const GRADE_OPTIONS = Object.entries(GRADE_LABELS).map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
function gradeLabel(g) { return GRADE_LABELS[g] || g; }

// ─── Date Formatting ──────────────────
function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' });
}
function fmtDateTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('ar-EG', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ─── Number Format ────────────────────
function fmtNum(n) { return Number(n || 0).toLocaleString('ar-EG'); }

// ─── Debounce ─────────────────────────
function debounce(fn, ms = 300) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
