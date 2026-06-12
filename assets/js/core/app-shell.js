/* ================================================================
   APP SHELL — Toast, Badge counts, renderAppShell()
   Depends on: AppState, t, icon, escHtml, statusBadge, NAV_CONFIG, MockData
   ================================================================ */

/* ── Toast notification (global singleton) ──────────────────── */
const Toast = {
  show(msg, type='success', dur=3500) {
    const cont = document.getElementById('toast-container');
    if (!cont) return;
    const cfg = {
      success: { bg:'bg-green-600', p:'M5 13l4 4L19 7' },
      error:   { bg:'bg-red-500',   p:'M6 18L18 6M6 6l12 12' },
      warning: { bg:'bg-amber-500', p:'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      info:    { bg:'bg-blue-500',  p:'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    };
    const c = cfg[type] ?? cfg.info;
    const el = document.createElement('div');
    el.className = `toast ${c.bg} text-white flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-2xl`;
    el.innerHTML = `
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="${c.p}"/>
      </svg>
      <span class="text-sm font-medium flex-1 leading-snug">${escHtml(msg)}</span>
      <button onclick="this.closest('div').remove()" class="opacity-60 hover:opacity-100 ml-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>`;
    cont.appendChild(el);
    setTimeout(() => { el.classList.add('toast-exit'); setTimeout(() => el.remove(), 320); }, dur);
  },
};
window.Toast = Toast;

/* ── Badge count helper ─────────────────────────────────────── */
function getBadgeCount(badgeKey) {
  if (badgeKey === 'notif') return MockData.notifications.filter(n => !n.read).length;
  if (badgeKey === 'cart')  return AppState.cart.length;
  return 0;
}

/* ── Main app shell renderer ────────────────────────────────── */
function renderAppShell(contentHTML, activePageKey) {
  const user    = AppState.user;
  const role    = user?.role ?? 'saj_admin';
  const isJa    = AppState.lang === 'ja';
  const navCfg  = NAV_CONFIG[role] ?? NAV_CONFIG.saj_admin;
  const unread  = MockData.notifications.filter(n => !n.read).length;
  const collapsed = AppState.sidebarCollapsed;
  const roleColors = {
    saj_admin:      'bg-blue-100 text-blue-700',
    watami_staff:   'bg-amber-100 text-amber-700',
    facility_staff: 'bg-violet-100 text-violet-700',
  };
  const roleKey = {
    saj_admin:'sajAdmin', watami_staff:'watamiStaff', facility_staff:'facilityStaff',
  };
  const displayName = isJa ? (user?.name ?? user?.id) : (user?.nameEn ?? user?.name ?? user?.id);
  const initials = (user?.name ?? 'U').replace(/\s/g, '').charAt(0).toUpperCase();

  /* Build sidebar nav HTML */
  let navHTML = '';
  navCfg.forEach(section => {
    if (section.section) {
      navHTML += `<div class="sb-section-label px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/35">${t(section.section)}</div>`;
    }
    section.items.forEach(item => {
      const active = activePageKey === item.page;
      const bc = item.badge ? getBadgeCount(item.badge) : 0;
      navHTML += `
        <a class="sidebar-link ${active ? 'active' : ''}" onclick="router.navigate('${item.page}');closeSidebar()">
          ${icon(item.icon, 'w-[18px] h-[18px]')}
          <span class="sb-label flex-1">${t(item.key)}</span>
          ${bc > 0 ? `<span class="sb-badge ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">${bc}</span>` : ''}
        </a>`;
    });
  });

  return `
  <div id="layout">
    <!-- SIDEBAR -->
    <aside id="sidebar" class="brand-gradient dot-pattern ${collapsed ? 'collapsed' : ''}">
      <div class="flex items-center gap-3 px-4 py-5 border-b border-white/10 shrink-0">
        <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <div class="sb-brand-text min-w-0">
          <div class="text-white font-bold text-sm leading-tight truncate">${isJa ? '食品再配分' : 'Mottainai'}</div>
          <div class="text-white/40 text-[10px]">${t('appVersion')}</div>
        </div>
      </div>
      <nav class="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">${navHTML}</nav>
      <div class="border-t border-white/10 p-3 shrink-0">
        <div class="sb-user-info flex items-center gap-2.5 px-2 py-2 mb-1">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">${initials}</div>
          <div class="min-w-0 flex-1">
            <div class="text-white text-xs font-semibold truncate">${escHtml(displayName ?? '')}</div>
            <div class="text-white/40 text-[10px] truncate">${escHtml(user?.id ?? '')}</div>
          </div>
        </div>
        <a class="sidebar-link" onclick="doLogout()">
          ${icon('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', 'w-[18px] h-[18px]')}
          <span class="sb-label">${t('logout')}</span>
        </a>
      </div>
    </aside>

    <!-- MAIN AREA -->
    <div id="main-area">
      <!-- TOP NAV -->
      <header id="topnav">
        <div class="flex items-center gap-2.5 flex-1 min-w-0">
          <button onclick="toggleSidebar()" class="btn-icon shrink-0" aria-label="Toggle menu">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="text-base font-bold text-gray-900 truncate">${t(activePageKey)}</h1>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <!-- Language toggle -->
          <div class="flex items-center bg-gray-50 rounded-full border border-gray-200 p-0.5 gap-0.5">
            <button onclick="setLang('ja')" class="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${AppState.lang === 'ja' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}">日本語</button>
            <button onclick="setLang('en')" class="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${AppState.lang === 'en' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}">EN</button>
          </div>

          <!-- Role switcher (demo) -->
          <div class="dropdown hidden sm:block">
            <button onclick="toggleDropdown('role-dd')" class="btn-icon" title="${t('switchRole')}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
              </svg>
            </button>
            <div id="role-dd" class="dropdown-menu" style="display:none">
              <div class="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">${t('switchRole')}</div>
              ${[
                {r:'saj_admin',      k:'sajAdmin',      cl:'text-blue-600'},
                {r:'watami_staff',   k:'watamiStaff',   cl:'text-amber-600'},
                {r:'facility_staff', k:'facilityStaff', cl:'text-violet-600'},
              ].map(o => `
                <div class="dropdown-item ${role === o.r ? 'dd-active' : ''}" onclick="switchRole('${o.r}');closeDropdown('role-dd')">
                  <span class="w-2 h-2 rounded-full ${role === o.r ? 'bg-green-500' : 'bg-gray-200'} shrink-0"></span>
                  <span class="${o.cl} font-medium">${t(o.k)}</span>
                </div>`).join('')}
            </div>
          </div>

          <!-- Notifications bell -->
          <button onclick="router.navigate('notifications')" class="btn-icon relative">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            ${unread > 0 ? '<span class="notif-dot"></span>' : ''}
          </button>

          <!-- User avatar dropdown -->
          <div class="dropdown">
            <button onclick="toggleDropdown('user-dd')" class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">${initials}</button>
            <div id="user-dd" class="dropdown-menu" style="display:none">
              <div class="px-3 pt-2.5 pb-2 border-b border-gray-100">
                <div class="text-sm font-semibold text-gray-900 truncate">${escHtml(displayName ?? '')}</div>
                <div class="text-xs text-gray-400 truncate">${escHtml(user?.email ?? user?.id ?? '')}</div>
                <span class="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleColors[role]}">${t(roleKey[role])}</span>
              </div>
              <div class="dropdown-item text-red-500" onclick="doLogout();closeDropdown('user-dd')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                ${t('logout')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <main id="page-content">${contentHTML}</main>
    </div>
  </div>`;
}
