/* Login Page — depends on: AppState, t, icon, escHtml, MockData, router, Toast */
router.register('login',()=>{
  const isJa=AppState.lang==='ja';
  const features=[
    {ja:'食材の効率的な再配分',       en:'Efficient food redistribution',         p:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
    {ja:'リアルタイム在庫・注文管理', en:'Real-time inventory & order management', p:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'},
    {ja:'多施設間のシームレスな連携',   en:'Seamless multi-facility coordination',  p:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'},
  ];
  const featuresHTML=features.map(f=>`
    <div class="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
      <div class="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">${icon(f.p,'w-4 h-4 text-white')}</div>
      <span class="text-sm text-white/90 font-medium">${isJa?f.ja:f.en}</span>
    </div>`).join('');
  const demoHTML=MockData.demoAccounts.map(a=>`
    <button type="button" onclick="quickLogin('${a.id}','${a.pw}')" class="demo-${a.color} w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 group">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">${icon(a.icon,'w-[18px] h-[18px]')}</div>
      <div class="flex-1 text-left min-w-0">
        <div class="text-xs font-bold truncate">${isJa?a.labelJa:a.label}</div>
        <div class="text-xs opacity-55 truncate">${isJa?a.descJa:a.desc}</div>
      </div>
      <code class="text-xs opacity-40 shrink-0 hidden sm:block">${a.id}</code>
      <svg class="w-4 h-4 shrink-0 opacity-30 group-hover:opacity-55 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </button>`).join('');
  const ja=AppState.lang==='ja';
  const bjJa=`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${ja?'bg-green-600 text-white shadow-sm':'text-gray-500 hover:text-gray-700'}`;
  const bjEn=`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!ja?'bg-green-600 text-white shadow-sm':'text-gray-500 hover:text-gray-700'}`;

  return `
  <div class="min-h-screen flex">
    <aside class="hidden lg:flex lg:w-5/12 xl:w-[46%] brand-gradient dot-pattern flex-col relative overflow-hidden">
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full pointer-events-none"></div>
      <div class="absolute -bottom-28 -right-20 w-[28rem] h-[28rem] bg-white/5 rounded-full pointer-events-none"></div>
      <div class="relative z-10 flex flex-col items-center justify-center flex-1 px-10 xl:px-14 py-12">
        <div class="mb-7 w-[4.5rem] h-[4.5rem] bg-white/20 rounded-3xl flex items-center justify-center shadow-2xl border border-white/25 mx-auto">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <div class="text-center mb-9">
          <div class="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 mb-4">
            <span class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
            <span class="text-green-100 text-[11px] font-semibold tracking-widest uppercase">${t('productionDemo')}</span>
          </div>
          <h1 class="text-3xl xl:text-[2.1rem] font-extrabold text-white mb-3 leading-tight">${isJa?'食品再配分<br>管理システム':'Food Redistribution<br>Management System'}</h1>
          <p class="text-green-100/85 text-sm leading-relaxed max-w-[18rem] mx-auto">${t('appTagline')}</p>
        </div>
        <div class="w-full max-w-[17rem] space-y-2.5">${featuresHTML}</div>
        <div class="mt-9 flex items-center gap-8">
          ${[{n:'15',la:'施設',en:'Facilities'},{n:'50+',la:'食材',en:'Ingredients'},{n:'30+',la:'注文',en:'Orders'}].map((s,i,a)=>`<div class="text-center"><div class="text-2xl font-black text-white">${s.n}</div><div class="text-[11px] text-green-200 mt-0.5">${isJa?s.la:s.en}</div></div>${i<a.length-1?'<div class="w-px h-8 bg-white/20"></div>':''}`).join('')}
        </div>
      </div>
      <div class="relative z-10 pb-5 text-center text-green-300/60 text-[11px]">Mottainai System · ${t('appVersion')} · © 2026 SAJ</div>
    </aside>
    <main class="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <header class="flex items-center justify-between px-6 lg:px-8 py-4 lg:py-5">
        <div class="flex items-center gap-2.5 lg:hidden">
          <div class="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div><p class="font-bold text-gray-800 text-sm">${isJa?'食品再配分システム':'Food Redistribution'}</p><p class="text-[10px] text-gray-400">${t('appVersion')}</p></div>
        </div>
        <div class="hidden lg:block"></div>
        <div class="flex items-center bg-white rounded-full shadow-sm border border-gray-200/80 p-1 gap-0.5">
          <button onclick="setLang('ja')" class="${bjJa}">日本語</button>
          <button onclick="setLang('en')" class="${bjEn}">English</button>
        </div>
      </header>
      <div class="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
        <div class="w-full max-w-[26rem]">
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10">
            <div class="mb-7">
              <div class="lg:hidden w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 border border-green-100">${icon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z','w-6 h-6 text-green-600')}</div>
              <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">${t('loginTitle')}</h2>
              <p class="text-sm text-gray-500 mt-1">${t('loginSubtitle')}</p>
            </div>
            <form id="login-form" novalidate onsubmit="handleLogin(event)" class="space-y-5">
              <div>
                <label for="input-userid" class="block text-sm font-semibold text-gray-700 mb-1.5">${t('userId')} <span class="text-red-500">*</span></label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">${icon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z','w-[18px] h-[18px]')}</span>
                  <input id="input-userid" type="text" autocomplete="username" spellcheck="false" placeholder="${isJa?'ユーザーIDを入力':'Enter your User ID'}" class="input-field" aria-required="true"/>
                </div>
                <p id="err-userid" role="alert" class="hidden mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>${t('fieldRequired')}</p>
              </div>
              <div>
                <label for="input-password" class="block text-sm font-semibold text-gray-700 mb-1.5">${t('password')} <span class="text-red-500">*</span></label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">${icon('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z','w-[18px] h-[18px]')}</span>
                  <input id="input-password" type="password" autocomplete="current-password" placeholder="${isJa?'パスワードを入力':'Enter your password'}" class="input-field pr-11" aria-required="true"/>
                  <button type="button" id="pw-toggle" onclick="togglePwVis()" tabindex="-1" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
                <p id="err-password" role="alert" class="hidden mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>${t('fieldRequired')}</p>
              </div>
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" id="remember-me" class="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"/>
                  <span class="text-sm text-gray-600">${t('rememberMe')}</span>
                </label>
                <button type="button" class="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors" onclick="Toast.show(t('forgotToast'),'info')">${t('forgotPassword')}</button>
              </div>
              <div id="auth-error" role="alert" class="hidden items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                ${icon('M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z','w-5 h-5 text-red-500 shrink-0 mt-0.5')}
                <p class="text-sm text-red-700">${t('loginError')}</p>
              </div>
              <button type="submit" id="login-btn" class="btn-primary w-full py-3 text-sm">
                <span id="login-btn-inner" class="flex items-center gap-2">${icon('M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1','w-[18px] h-[18px]')} ${t('loginButton')}</span>
              </button>
            </form>
            <div class="relative my-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div><div class="relative flex justify-center"><span class="px-3 bg-white text-[11px] font-semibold text-gray-400 uppercase tracking-wider">${t('quickDemo')}</span></div></div>
            <div class="space-y-2">${demoHTML}</div>
          </div>
          <p class="mt-5 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">${icon('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z','w-3.5 h-3.5 opacity-60')} ${t('restrictedMsg')}</p>
        </div>
      </div>
    </main>
  </div>`;
});
router.registerHandlers('login',()=>{ const el=document.getElementById('input-userid'); if(el) setTimeout(()=>el.focus(),80); });