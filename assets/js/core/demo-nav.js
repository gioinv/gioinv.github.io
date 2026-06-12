/* ================================================================
   DEMO NAVIGATOR — Floating page-switcher for demo/presentation
   Rendered ONCE outside #app so it survives page re-renders.
   Depends on: AppState, translations, router (loaded before this)
   ================================================================ */

/* ── All pages definition (demo always shows all pages) ─────── */
const DEMO_PAGES = [
  /* Common */
  { group:'common',  page:'login',       icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',             role:null },
  { group:'common',  page:'dashboard',   icon:'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', role:null },
  { group:'common',  page:'notifications',icon:'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', role:null },
  /* SAJ Admin */
  { group:'saj',     page:'users',       icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', role:'saj' },
  { group:'saj',     page:'facilities',  icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', role:'saj' },
  /* Watami Staff */
  { group:'watami',  page:'ingredients', icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', role:'watami' },
  { group:'watami',  page:'bulk-import', icon:'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', role:'watami' },
  { group:'watami',  page:'allocation',  icon:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v10m0 0H5m4 0h10m0-10v10m0 0h4M9 13v8m0 0H5m4 0h10m0 0v-8', role:'watami' },
  { group:'watami',  page:'orders',      icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', role:'watami' },
  { group:'watami',  page:'shipping',    icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', role:'watami' },
  /* Facility Staff */
  { group:'facility',page:'catalog',     icon:'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', role:'facility' },
  { group:'facility',page:'cart',        icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', role:'facility' },
  { group:'facility',page:'checkout',    icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', role:'facility' },
  { group:'facility',page:'order-tracking',icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', role:'facility' },
  { group:'facility',page:'receiving',   icon:'M5 13l4 4L19 7', role:'facility' },
];

/* ── i18n keys for page names ─────────────────────────────────── */
const DN_PAGE_KEYS = {
  login:         { ja:'ログイン',       en:'Login' },
  dashboard:     { ja:'ダッシュボード', en:'Dashboard' },
  notifications: { ja:'通知',           en:'Notifications' },
  users:         { ja:'ユーザー管理',   en:'User Management' },
  facilities:    { ja:'施設管理',       en:'Facility Management' },
  ingredients:   { ja:'食材管理',       en:'Ingredient Management' },
  'bulk-import': { ja:'一括インポート', en:'Bulk Import' },
  allocation:    { ja:'引当処理',       en:'Allocation' },
  orders:        { ja:'注文管理',       en:'Order Management' },
  shipping:      { ja:'出荷管理',       en:'Shipping Management' },
  catalog:       { ja:'食材カタログ',   en:'Ingredient Catalog' },
  cart:          { ja:'カート',         en:'Cart' },
  checkout:      { ja:'注文確認',       en:'Checkout' },
  'order-tracking':{ ja:'注文追跡',    en:'Order Tracking' },
  receiving:     { ja:'受領処理',       en:'Receiving' },
};

/* ── Groups meta ───────────────────────────────────────────────── */
const DN_GROUPS = {
  common:   { ja:'共通',             en:'Common',          bg:'bg-gray-100',   ic:'text-gray-500',   badge:null },
  saj:      { ja:'SAJ管理者',        en:'SAJ Admin',       bg:'bg-blue-100',   ic:'text-blue-600',   badge:'bg-blue-100 text-blue-700' },
  watami:   { ja:'Watamiスタッフ',   en:'Watami Staff',    bg:'bg-amber-100',  ic:'text-amber-600',  badge:'bg-amber-100 text-amber-700' },
  facility: { ja:'施設スタッフ',     en:'Facility Staff',  bg:'bg-violet-100', ic:'text-violet-600', badge:'bg-violet-100 text-violet-700' },
};

/* ── Pages that are fully implemented (others show "coming soon") */
const DN_IMPLEMENTED = new Set([
  'login','dashboard','users','ingredients','facilities','bulk-import','allocation','orders',
  'notifications',
]);

/* ── State ─────────────────────────────────────────────────────── */
let _dnOpen = false;

/* ── Render demo nav ────────────────────────────────────────────── */
function renderDemoNav() {
  const isJa  = AppState.lang === 'ja';
  const cur   = AppState.currentPage ?? router.currentPage;

  /* Build trigger pill */
  const trigger = document.getElementById('demo-nav-trigger');
  if (trigger) {
    trigger.innerHTML = `
      <span class="dn-dot"></span>
      <span>${isJa ? 'ページ一覧' : 'Page Navigator'}</span>
      <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="${_dnOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}"/>
      </svg>`;
  }

  if (!_dnOpen) return;

  /* Build panel */
  const groups = ['common','saj','watami','facility'];
  let panelHTML = `
    <div class="px-4 pt-4 pb-2 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-extrabold text-gray-900">${isJa ? 'デモナビゲーター' : 'Demo Navigator'}</h3>
        <p class="text-[11px] text-gray-400 mt-0.5">${isJa ? 'すべてのページに直接アクセスできます' : 'Jump to any page directly'}</p>
      </div>
      <button onclick="closeDemoNav()" class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors" aria-label="Close">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2">`;

  groups.forEach(grp => {
    const gm = DN_GROUPS[grp];
    const pages = DEMO_PAGES.filter(p => p.group === grp);
    panelHTML += `
      <div class="mb-1">
        <div class="dn-section-title">${isJa ? gm.ja : gm.en}</div>`;
    pages.forEach(pg => {
      const label = DN_PAGE_KEYS[pg.page];
      const nm    = label ? (isJa ? label.ja : label.en) : pg.page;
      const impl  = DN_IMPLEMENTED.has(pg.page);
      const active = pg.page === cur;
      panelHTML += `
        <button onclick="demoNavGo('${pg.page}')" class="dn-page-btn ${active ? 'dn-active' : ''}">
          <span class="dn-icon ${gm.bg}">
            <svg class="w-3.5 h-3.5 ${gm.ic}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="${pg.icon}"/>
            </svg>
          </span>
          <span class="flex-1 truncate">${nm}</span>
          ${!impl ? `<span class="dn-coming">${isJa ? '開発中' : 'soon'}</span>` : ''}
          ${active ? `<svg class="w-3 h-3 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>` : ''}
        </button>`;
    });
    panelHTML += `</div>`;
  });

  panelHTML += `</div>
    <div class="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
      <p class="text-[10px] text-gray-400">
        ${isJa ? '✅ = 実装済み　🔜 開発中' : '✅ = Implemented   🔜 Coming soon'}
      </p>
      <div class="flex items-center gap-1.5">
        <span class="text-[10px] text-gray-400">${isJa ? '言語' : 'Lang'}:</span>
        <button onclick="setLang('ja');renderDemoNav()" class="text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all ${isJa ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}">日本語</button>
        <button onclick="setLang('en');renderDemoNav()" class="text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all ${!isJa ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}">EN</button>
      </div>
    </div>`;

  /* Inject panel */
  let panel = document.getElementById('demo-nav-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'demo-nav-panel';
    document.body.appendChild(panel);
  }
  panel.innerHTML = panelHTML;
}

/* ── Mount / Init ──────────────────────────────────────────────── */
function initDemoNav() {
  const root = document.getElementById('demo-nav-root');
  if (!root) return;

  root.innerHTML = `
    <button id="demo-nav-trigger" onclick="toggleDemoNav()" aria-label="Page Navigator">
      <span class="dn-dot"></span>
      <span>${AppState.lang === 'ja' ? 'ページ一覧' : 'Page Navigator'}</span>
      <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
      </svg>
    </button>`;
}

/* ── Toggle open/close ─────────────────────────────────────────── */
function toggleDemoNav() {
  _dnOpen = !_dnOpen;
  const overlay = document.getElementById('demo-nav-overlay');
  if (overlay) overlay.style.display = _dnOpen ? 'block' : 'none';
  if (!_dnOpen) {
    const panel = document.getElementById('demo-nav-panel');
    if (panel) panel.remove();
  }
  renderDemoNav();
}

function closeDemoNav() {
  _dnOpen = false;
  const overlay = document.getElementById('demo-nav-overlay');
  if (overlay) overlay.style.display = 'none';
  const panel = document.getElementById('demo-nav-panel');
  if (panel) panel.remove();
  renderDemoNav();
}

/* ── Navigate via demo nav ─────────────────────────────────────── */
function demoNavGo(page) {
  closeDemoNav();
  /* If trying to go to a page that needs auth and user not logged in,
     auto-log in as the right role demo account first */
  const rolePagesMap = {
    saj:      ['users'],
    watami:   ['ingredients','bulk-import','allocation','orders','shipping'],
    facility: ['catalog','cart','checkout','order-tracking','receiving'],
  };

  if (!AppState.user && page !== 'login') {
    /* Auto-login as SAJ admin for demo */
    const demo = MockData.demoAccounts.find(a => a.role === 'saj_admin');
    if (demo) AppState.user = MockData.users.find(u => u.id === demo.id);
  }

  /* Auto switch role based on page if needed */
  for (const [grp, pages] of Object.entries(rolePagesMap)) {
    if (pages.includes(page)) {
      const roleMap = { saj:'saj_admin', watami:'watami_staff', facility:'facility_staff' };
      const targetRole = roleMap[grp];
      if (AppState.user?.role !== targetRole) {
        const demo = MockData.demoAccounts.find(a => a.role === targetRole);
        if (demo) {
          AppState.user = MockData.users.find(u => u.id === demo.id);
        }
      }
    }
  }

  router.navigate(page);
  /* Re-render the trigger to reflect new current page */
  setTimeout(renderDemoNav, 50);
}

/* ── Hook into router to keep current-page highlight in sync ───── */
(function patchRouter() {
  const origRender = router._render.bind(router);
  router._render = function(path) {
    origRender(path);
    /* Update demo nav trigger to show current page after render */
    setTimeout(renderDemoNav, 30);
  };
})();

/* ── Expose globally ───────────────────────────────────────────── */
window.toggleDemoNav  = toggleDemoNav;
window.closeDemoNav   = closeDemoNav;
window.demoNavGo      = demoNavGo;
window.renderDemoNav  = renderDemoNav;
window.initDemoNav    = initDemoNav;

/* ── Auto-init once DOM is ready ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', initDemoNav);
/* Also init immediately in case DOMContentLoaded already fired */
if (document.readyState !== 'loading') initDemoNav();
