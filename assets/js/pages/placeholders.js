/* Placeholder Pages — depends on: router, t, icon, escHtml, renderAppShell */
// §11  PLACEHOLDER PAGES  (implemented page-by-page in future phases)
// ──────────────────────────────────────────────────────────────────
const PAGE_META={
  'users':         {key:'userManagement',    icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'},
  '__ingredients_placeholder__':'__skip__',
  'bulk-import':   {key:'bulkImport',         icon:'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'},
  'facilities':    {key:'facilityManagement', icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'},
  'allocation':    {key:'allocation',         icon:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v10m0 0H5m4 0h10m0-10v10m0 0h4M9 13v8m0 0H5m4 0h10m0 0v-8'},
  'orders':        {key:'orderManagement',    icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'},
  'shipping':      {key:'shippingManagement', icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'},
  'catalog':       {key:'ingredientCatalog',  icon:'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'},
  'cart':          {key:'cart',               icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'},
  'checkout':      {key:'checkout',           icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
  'order-tracking':{key:'orderTracking',      icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'},
  'receiving':     {key:'receiving',          icon:'M5 13l4 4L19 7'},
  'notifications': {key:'notifications',      icon:'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'},
};

Object.keys(PAGE_META).filter(p=>p!=='users'&&p!=='ingredients'&&p!=='__ingredients_placeholder__'&&p!=='facilities'&&p!=='bulk-import'&&p!=='allocation'&&p!=='orders').forEach(page=>{
  router.register(page,()=>{
    const m=PAGE_META[page], isJa=AppState.lang==='ja';
    const content=`
      <div class="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
          ${icon(m.icon,'w-8 h-8 text-green-600')}
        </div>
        <h2 class="text-xl font-extrabold text-gray-900 mb-2">${t(m.key)}</h2>
        <p class="text-sm text-gray-400 max-w-xs mb-6">${isJa?'このページは次のフェーズで実装されます。':'This page will be built in the next phase.'}</p>
        <div class="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-sm text-green-700 font-medium">${isJa?'開発中…':'Coming in next phase…'}</span>
        </div>
        <button onclick="router.navigate('dashboard')" class="btn-ghost">
          ${icon('M10 19l-7-7m0 0l7-7m-7 7h18','w-4 h-4')} ${t('dashboard')}
        </button>
      </div>`;
    return renderAppShell(content, page);
  });
});

// ──────────────────────────────────────────────────────────────────