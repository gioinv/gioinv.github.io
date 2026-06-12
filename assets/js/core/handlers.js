/* ================================================================
   HANDLERS — Global event handlers + dropdown management + boot
   Depends on: AppState, router, t, escHtml, icon, Toast, MockData
   MUST be loaded last (after all pages registered)
   ================================================================ */

/* ── Dropdown management ─────────────────────────────────────── */
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown'))
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
});

function toggleDropdown(id) {
  const el = document.getElementById(id); if (!el) return;
  const open = el.style.display !== 'none';
  document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
  if (!open) el.style.display = 'block';
}
function closeDropdown(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
window.toggleDropdown = toggleDropdown;
window.closeDropdown  = closeDropdown;

/* ── Language switcher ───────────────────────────────────────── */
function setLang(lang) {
  AppState.lang = lang;
  document.documentElement.lang = lang;
  router.renderCurrent();
}
window.setLang = setLang;

/* ── Role switcher (demo) ─────────────────────────────────────  */
function switchRole(newRole) {
  const demo = MockData.demoAccounts.find(a => a.role === newRole); if (!demo) return;
  const user = MockData.users.find(u => u.id === demo.id); if (!user) return;
  AppState.user = user;
  const label = { saj_admin:'SAJ Admin', watami_staff:'Watami Staff', facility_staff:'Facility Staff' };
  Toast.show((AppState.lang === 'ja' ? 'ロールを切替：' : 'Role switched to ') + label[newRole], 'info', 2500);
  router.navigate('dashboard');
}
window.switchRole = switchRole;

/* ── Sidebar toggle (collapse desktop / drawer mobile) ──────── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar'); if (!sb) return;
  if (window.innerWidth < 1024) {
    sb.classList.toggle('mobile-open');
    const ov = document.getElementById('sidebar-overlay');
    if (ov) ov.classList.toggle('active', sb.classList.contains('mobile-open'));
  } else {
    AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
    sb.classList.toggle('collapsed', AppState.sidebarCollapsed);
  }
}
function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (sb) sb.classList.remove('mobile-open');
  if (ov) ov.classList.remove('active');
}
window.toggleSidebar = toggleSidebar;
window.closeSidebar  = closeSidebar;

/* ── Login form handler ──────────────────────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  const uidEl = document.getElementById('input-userid');
  const pwEl  = document.getElementById('input-password');
  const uid   = uidEl?.value.trim() ?? '';
  const pw    = pwEl?.value ?? '';

  /* Reset error states */
  document.getElementById('err-userid')?.classList.add('hidden');
  document.getElementById('err-password')?.classList.add('hidden');
  const ae = document.getElementById('auth-error');
  ae?.classList.remove('flex'); ae?.classList.add('hidden');
  uidEl?.classList.remove('error'); pwEl?.classList.remove('error');

  /* Validate */
  let err = false;
  if (!uid) { document.getElementById('err-userid')?.classList.remove('hidden');   uidEl?.classList.add('error'); err = true; }
  if (!pw)  { document.getElementById('err-password')?.classList.remove('hidden'); pwEl?.classList.add('error');  err = true; }
  if (err) return;

  /* Loading state */
  const btn   = document.getElementById('login-btn');
  const inner = document.getElementById('login-btn-inner');
  if (btn) btn.disabled = true;
  if (inner) inner.innerHTML = `<span class="spinner"></span><span>${t('loggingIn')}</span>`;

  /* Simulate async auth */
  setTimeout(() => {
    const user = MockData.users.find(u => u.id === uid && u.pw === pw);
    if (user) {
      AppState.user = user;
      Toast.show(t('loginSuccess'), 'success', 2800);
      setTimeout(() => router.navigate('dashboard'), 650);
    } else {
      if (btn) btn.disabled = false;
      if (inner) inner.innerHTML = `${icon('M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1','w-[18px] h-[18px]')} ${t('loginButton')}`;
      const authErr = document.getElementById('auth-error');
      if (authErr) { authErr.classList.remove('hidden'); authErr.classList.add('flex'); }
      const form = document.getElementById('login-form');
      if (form) { form.classList.add('shake'); setTimeout(() => form.classList.remove('shake'), 600); }
      uidEl?.classList.add('error'); pwEl?.classList.add('error');
    }
  }, 900);
}
window.handleLogin = handleLogin;

/* ── Quick demo login (typewriter effect) ────────────────────── */
function quickLogin(uid, pw) {
  const uidEl = document.getElementById('input-userid');
  const pwEl  = document.getElementById('input-password');
  if (!uidEl || !pwEl) return;
  uidEl.value = ''; pwEl.value = '';
  document.getElementById('err-userid')?.classList.add('hidden');
  document.getElementById('err-password')?.classList.add('hidden');
  document.getElementById('auth-error')?.classList.add('hidden');
  uidEl.classList.remove('error'); pwEl.classList.remove('error');

  let i = 0;
  const ti = setInterval(() => {
    if (i >= uid.length) {
      clearInterval(ti); let j = 0;
      const tp = setInterval(() => {
        if (j >= pw.length) {
          clearInterval(tp);
          setTimeout(() => {
            const f = document.getElementById('login-form');
            if (f) f.dispatchEvent(new Event('submit', { cancelable:true, bubbles:true }));
          }, 250);
        } else pwEl.value += pw[j++];
      }, 35);
    } else uidEl.value += uid[i++];
  }, 45);
}
window.quickLogin = quickLogin;

/* ── Password visibility toggle ─────────────────────────────── */
function togglePwVis() {
  const inp = document.getElementById('input-password');
  const eye = document.getElementById('eye-icon');
  if (!inp || !eye) return;
  const hiding = inp.type === 'password';
  inp.type = hiding ? 'text' : 'password';
  eye.innerHTML = hiding
    ? `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`
    : `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
       <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
}
window.togglePwVis = togglePwVis;

/* ── Logout ──────────────────────────────────────────────────── */
function doLogout() { AppState.user = null; AppState.cart = []; router.navigate('login'); }
window.doLogout = doLogout;

/* ── Bootstrap ───────────────────────────────────────────────── */
router.init();
