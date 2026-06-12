/* User Management Page (SAJ Admin) — depends on all core modules */
// §11a  PAGE: USER MANAGEMENT  (SAJ Admin)
// ──────────────────────────────────────────────────────────────────

/* ── i18n keys added for User Management ── */
Object.assign(translations.ja,{
  createUser:'ユーザー作成', editUser:'ユーザー編集', disableUser:'無効化', enableUser:'有効化',
  userId2:'ユーザーID', userName:'氏名', role:'ロール', email:'メールアドレス',
  phone:'電話番号', facilityLabel:'所属施設', createdAt:'作成日',
  searchUsers:'ユーザーを検索…', filterByRole:'ロールで絞り込み', filterByStatus:'ステータスで絞り込み',
  allRoles:'すべてのロール', allStatus:'すべてのステータス',
  confirmDisable:'このユーザーを無効化しますか？', confirmEnable:'このユーザーを有効化しますか？',
  userCreated:'ユーザーを作成しました', userUpdated:'ユーザーを更新しました',
  userDisabled:'ユーザーを無効化しました', userEnabled:'ユーザーを有効化しました',
  passwordNew:'新しいパスワード', passwordConfirm:'パスワード確認',
  passwordMismatch:'パスワードが一致しません', totalUsers2:'ユーザー数',
  activeUsers:'有効ユーザー', inactiveUsers:'無効ユーザー',
  nFacilityLabel:'施設なし', showingOf:'件表示中',
  of:'/', results:'件',
});
Object.assign(translations.en,{
  createUser:'Create User', editUser:'Edit User', disableUser:'Disable', enableUser:'Enable',
  userId2:'User ID', userName:'Full Name', role:'Role', email:'Email',
  phone:'Phone', facilityLabel:'Facility', createdAt:'Created',
  searchUsers:'Search users…', filterByRole:'Filter by role', filterByStatus:'Filter by status',
  allRoles:'All Roles', allStatus:'All Status',
  confirmDisable:'Disable this user?', confirmEnable:'Enable this user?',
  userCreated:'User created successfully', userUpdated:'User updated successfully',
  userDisabled:'User disabled', userEnabled:'User enabled',
  passwordNew:'New Password', passwordConfirm:'Confirm Password',
  passwordMismatch:'Passwords do not match', totalUsers2:'Total Users',
  activeUsers:'Active Users', inactiveUsers:'Inactive Users',
  nFacilityLabel:'No facility', showingOf:'Showing',
  of:'of', results:'results',
});

/* ── User Management State ── */
const UM = {
  search:'', roleFilter:'all', statusFilter:'all',
  sortKey:'createdAt', sortDir:'desc',
  page:1, perPage:8,
  modalMode:'create',   // 'create' | 'edit'
  editingId: null,
};

router.register('users', () => {
  const isJa = AppState.lang === 'ja';

  /* Filter + sort */
  let list = MockData.users.filter(u => {
    const nameField   = isJa ? u.name : (u.nameEn ?? u.name);
    const searchMatch = !UM.search ||
      u.id.toLowerCase().includes(UM.search.toLowerCase()) ||
      nameField.toLowerCase().includes(UM.search.toLowerCase()) ||
      u.email.toLowerCase().includes(UM.search.toLowerCase());
    const roleMatch   = UM.roleFilter==='all' || u.role===UM.roleFilter;
    const statMatch   = UM.statusFilter==='all' || u.status===UM.statusFilter;
    return searchMatch && roleMatch && statMatch;
  });

  list = [...list].sort((a,b) => {
    let av=a[UM.sortKey]??'', bv=b[UM.sortKey]??'';
    if(typeof av==='string') av=av.toLowerCase(), bv=bv.toLowerCase();
    if(av<bv) return UM.sortDir==='asc'?-1:1;
    if(av>bv) return UM.sortDir==='asc'?1:-1;
    return 0;
  });

  const total   = list.length;
  const pages   = Math.max(1, Math.ceil(total / UM.perPage));
  UM.page       = Math.min(UM.page, pages);
  const sliced  = list.slice((UM.page-1)*UM.perPage, UM.page*UM.perPage);

  /* KPI strip */
  const allU    = MockData.users;
  const kpis = [
    {label:t('totalUsers2'), val:allU.length,                          bg:'bg-blue-50',   ic:'text-blue-600',   icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'},
    {label:t('activeUsers'),  val:allU.filter(u=>u.status==='active').length,   bg:'bg-green-50',  ic:'text-green-600', icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
    {label:t('inactiveUsers'),val:allU.filter(u=>u.status==='inactive').length, bg:'bg-red-50',    ic:'text-red-600',   icon:'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'},
    {label:t('sajAdmin'),     val:allU.filter(u=>u.role==='saj_admin').length,      bg:'bg-blue-50',   ic:'text-blue-600',  icon:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'},
    {label:t('watamiStaff'),  val:allU.filter(u=>u.role==='watami_staff').length,   bg:'bg-amber-50',  ic:'text-amber-600', icon:'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'},
    {label:t('facilityStaff'),val:allU.filter(u=>u.role==='facility_staff').length, bg:'bg-violet-50', ic:'text-violet-600',icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'},
  ];

  const kpiHTML = kpis.map(k=>`
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div class="w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center shrink-0">${icon(k.icon,`w-[18px] h-[18px] ${k.ic}`)}</div>
      <div><div class="text-xl font-extrabold text-gray-900">${k.val}</div><div class="text-xs text-gray-500 mt-0.5">${k.label}</div></div>
    </div>`).join('');

  /* Sort indicator helper */
  const sortIcon = key => {
    if(UM.sortKey!==key) return `<svg class="w-3 h-3 opacity-25 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`;
    return UM.sortDir==='asc'
      ? `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`
      : `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;
  };

  /* Th helper */
  const th = (key, label) =>
    `<th class="cursor-pointer select-none hover:text-gray-600 transition-colors" onclick="umSort('${key}')">${label}${sortIcon(key)}</th>`;

  /* Role badge colours */
  const roleCl = { saj_admin:'badge-blue', watami_staff:'badge-amber', facility_staff:'badge-violet' };
  const roleLabel = r => t({saj_admin:'sajAdmin',watami_staff:'watamiStaff',facility_staff:'facilityStaff'}[r]??r);

  /* Table rows */
  const rowsHTML = sliced.length === 0
    ? `<tr><td colspan="8" class="text-center py-14 text-gray-400 text-sm">${t('noData')}</td></tr>`
    : sliced.map(u => {
        const nameD  = isJa ? u.name : (u.nameEn ?? u.name);
        const facName = u.facility ? getFacilityName(u.facility) : `<span class="text-gray-400 text-xs">${t('nFacilityLabel')}</span>`;
        const initials = u.name.replace(/\s/g,'').charAt(0).toUpperCase();
        return `<tr>
          <td>
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xs font-bold shrink-0">${initials}</div>
              <div>
                <div class="text-xs font-semibold text-gray-900">${escHtml(nameD)}</div>
                <div class="text-[10px] text-gray-400 font-mono">${escHtml(u.id)}</div>
              </div>
            </div>
          </td>
          <td><span class="badge ${roleCl[u.role]??'badge-gray'}">${roleLabel(u.role)}</span></td>
          <td class="text-xs text-gray-600 max-w-[150px] truncate">${escHtml(u.email)}</td>
          <td class="text-xs text-gray-500">${escHtml(u.phone)}</td>
          <td class="text-xs text-gray-600 max-w-[120px] truncate">${facName}</td>
          <td class="text-xs text-gray-500">${formatDate(u.createdAt)}</td>
          <td><span class="${statusBadge(u.status)}">${t(u.status)}</span></td>
          <td>
            <div class="flex items-center gap-1">
              <button onclick="umOpenEdit('${u.id}')"
                class="btn-sm text-blue-600 border-blue-200 hover:bg-blue-50">
                ${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z','w-3.5 h-3.5')} ${t('edit')}
              </button>
              ${u.status==='active'
                ? `<button onclick="umToggleStatus('${u.id}','inactive')"
                     class="btn-sm text-red-600 border-red-200 hover:bg-red-50">
                     ${icon('M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636','w-3.5 h-3.5')} ${t('disableUser')}
                   </button>`
                : `<button onclick="umToggleStatus('${u.id}','active')"
                     class="btn-sm text-green-600 border-green-200 hover:bg-green-50">
                     ${icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z','w-3.5 h-3.5')} ${t('enableUser')}
                   </button>`}
            </div>
          </td>
        </tr>`;
      }).join('');

  /* Pagination */
  const paginHTML = pages <= 1 ? '' : (() => {
    let btns = '';
    for(let i=1;i<=pages;i++){
      btns += `<button onclick="umGoPage(${i})" class="w-8 h-8 rounded-lg text-xs font-semibold transition-all ${i===UM.page?'bg-green-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}">${i}</button>`;
    }
    return `<div class="flex items-center justify-between px-1 pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-400">${t('showingOf')} ${(UM.page-1)*UM.perPage+1}–${Math.min(UM.page*UM.perPage,total)} ${t('of')} ${total} ${t('results')}</p>
      <div class="flex items-center gap-1">
        <button onclick="umGoPage(${UM.page-1})" ${UM.page===1?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        ${btns}
        <button onclick="umGoPage(${UM.page+1})" ${UM.page===pages?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>`;
  })();

  /* Role filter options */
  const roleOpts = [
    {v:'all',    l:t('allRoles')},
    {v:'saj_admin',      l:t('sajAdmin')},
    {v:'watami_staff',   l:t('watamiStaff')},
    {v:'facility_staff', l:t('facilityStaff')},
  ].map(o=>`<option value="${o.v}" ${UM.roleFilter===o.v?'selected':''}>${escHtml(o.l)}</option>`).join('');

  const statOpts = [
    {v:'all',     l:t('allStatus')},
    {v:'active',  l:t('active')},
    {v:'inactive',l:t('inactive')},
  ].map(o=>`<option value="${o.v}" ${UM.statusFilter===o.v?'selected':''}>${escHtml(o.l)}</option>`).join('');

  /* ── Modal HTML ── */
  const modalHTML = `
  <div id="user-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="display:none!important">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="umCloseModal()"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <!-- Modal header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 class="text-base font-bold text-gray-900" id="modal-title">${t('createUser')}</h3>
          <p class="text-xs text-gray-500 mt-0.5" id="modal-subtitle">${isJa?'新しいユーザーアカウントを作成':'Create a new user account'}</p>
        </div>
        <button onclick="umCloseModal()" class="btn-icon">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <!-- Modal body -->
      <form id="user-form" onsubmit="umSubmitForm(event)" novalidate class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
        <!-- User ID -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('userId2')} <span class="text-red-500">*</span></label>
            <input id="um-userid" type="text" autocomplete="off" spellcheck="false"
              class="w-full px-3 py-2.5 text-sm border-1.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="${isJa?'例: admin001':'e.g. admin001'}"/>
            <p id="err-um-userid" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('userName')} <span class="text-red-500">*</span></label>
            <input id="um-name" type="text"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="${isJa?'例: 田中 太郎':'e.g. Taro Tanaka'}"/>
            <p id="err-um-name" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
        </div>
        <!-- English Name + Role -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Name (EN)</label>
            <input id="um-nameEn" type="text"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="e.g. Taro Tanaka"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('role')} <span class="text-red-500">*</span></label>
            <select id="um-role" onchange="umRoleChange()"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all">
              <option value="saj_admin">${t('sajAdmin')}</option>
              <option value="watami_staff">${t('watamiStaff')}</option>
              <option value="facility_staff">${t('facilityStaff')}</option>
            </select>
          </div>
        </div>
        <!-- Email + Phone -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('email')} <span class="text-red-500">*</span></label>
            <input id="um-email" type="email"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="${isJa?'メールアドレス':'Email address'}"/>
            <p id="err-um-email" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('phone')}</label>
            <input id="um-phone" type="tel"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="${isJa?'例: 03-1234-5678':'e.g. 03-1234-5678'}"/>
          </div>
        </div>
        <!-- Facility (only for facility_staff) -->
        <div id="um-facility-row">
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('facilityLabel')}</label>
          <select id="um-facility"
            class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all">
            <option value="">${t('nFacilityLabel')}</option>
            ${MockData.facilities.map(f=>`<option value="${f.id}">${escHtml(isJa?f.name:f.nameEn)}</option>`).join('')}
          </select>
        </div>
        <!-- Password row -->
        <div class="grid grid-cols-2 gap-4" id="um-pw-row">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('passwordNew')} <span id="pw-required-star" class="text-red-500">*</span></label>
            <input id="um-pw" type="password"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="••••••••"/>
            <p id="err-um-pw" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('passwordConfirm')}</label>
            <input id="um-pw2" type="password"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="••••••••"/>
            <p id="err-um-pw2" class="hidden mt-1 text-xs text-red-500">${t('passwordMismatch')}</p>
          </div>
        </div>
      </form>
      <!-- Modal footer -->
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
        <button type="button" onclick="umCloseModal()" class="btn-ghost">${t('cancel')}</button>
        <button type="button" onclick="umSubmitForm(event)" class="btn-primary px-5 py-2 text-sm" id="um-submit-btn">
          ${icon('M5 13l4 4L19 7','w-4 h-4')} <span id="um-submit-label">${t('save')}</span>
        </button>
      </div>
    </div>
  </div>`;

  /* ── Assemble page ── */
  const content = `
  ${modalHTML}
  <div class="p-5 lg:p-7 space-y-5 max-w-[1600px]">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('userManagement')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${isJa?'システムユーザーの管理と権限設定':'Manage system users and access control'}</p>
      </div>
      <button onclick="umOpenCreate()" class="btn-primary self-start">
        ${icon('M12 4v16m8-8H4','w-4 h-4')} ${t('createUser')}
      </button>
    </div>

    <!-- KPI strip -->
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">${kpiHTML}</div>

    <!-- Filters row -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          ${icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0','w-4 h-4')}
        </span>
        <input id="um-search" type="text" value="${escHtml(UM.search)}"
          oninput="umSearch(this.value)"
          placeholder="${t('searchUsers')}"
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"/>
      </div>
      <!-- Role filter -->
      <select onchange="umFilterRole(this.value)" class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all min-w-[130px]">
        ${roleOpts}
      </select>
      <!-- Status filter -->
      <select onchange="umFilterStatus(this.value)" class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all min-w-[120px]">
        ${statOpts}
      </select>
      <!-- Reset -->
      <button onclick="umResetFilters()" class="btn-ghost shrink-0">
        ${icon('M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15','w-4 h-4')}
        ${isJa?'リセット':'Reset'}
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              ${th('name',     t('userName'))}
              ${th('role',     t('role'))}
              ${th('email',    t('email'))}
              ${th('phone',    t('phone'))}
              ${th('facility', t('facilityLabel'))}
              ${th('createdAt',t('createdAt'))}
              ${th('status',   t('status'))}
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
      ${paginHTML ? `<div class="px-4 pb-4">${paginHTML}</div>` : ''}
    </div>

  </div>`;

  return renderAppShell(content, 'users');
});

/* ── User Management handlers ── */
function umSearch(v)        { UM.search=v; UM.page=1; router.renderCurrent(); }
function umFilterRole(v)    { UM.roleFilter=v; UM.page=1; router.renderCurrent(); }
function umFilterStatus(v)  { UM.statusFilter=v; UM.page=1; router.renderCurrent(); }
function umResetFilters()   { UM.search=''; UM.roleFilter='all'; UM.statusFilter='all'; UM.page=1; router.renderCurrent(); }
function umGoPage(p)        { UM.page=p; router.renderCurrent(); }
function umSort(key)        {
  if(UM.sortKey===key) UM.sortDir=UM.sortDir==='asc'?'desc':'asc';
  else { UM.sortKey=key; UM.sortDir='asc'; }
  router.renderCurrent();
}
window.umSearch=umSearch; window.umFilterRole=umFilterRole; window.umFilterStatus=umFilterStatus;
window.umResetFilters=umResetFilters; window.umGoPage=umGoPage; window.umSort=umSort;

function umRoleChange(){
  const role=document.getElementById('um-role')?.value;
  const facRow=document.getElementById('um-facility-row');
  if(facRow) facRow.style.display=role==='facility_staff'?'block':'none';
}
window.umRoleChange=umRoleChange;

function umOpenCreate(){
  UM.modalMode='create'; UM.editingId=null;
  const isJa=AppState.lang==='ja';
  const modal=document.getElementById('user-modal');
  const title=document.getElementById('modal-title');
  const sub  =document.getElementById('modal-subtitle');
  const star =document.getElementById('pw-required-star');
  if(title) title.textContent=t('createUser');
  if(sub)   sub.textContent=isJa?'新しいユーザーアカウントを作成':'Create a new user account';
  if(star)  star.style.display='inline';
  /* Clear fields */
  ['um-userid','um-name','um-nameEn','um-email','um-phone','um-pw','um-pw2'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  const roleEl=document.getElementById('um-role'); if(roleEl) roleEl.value='saj_admin';
  const facEl =document.getElementById('um-facility'); if(facEl) facEl.value='';
  umRoleChange();
  /* Show modal */
  if(modal){ modal.style.display='flex'; modal.style.removeProperty('display'); modal.style.cssText='display:flex!important'; }
  setTimeout(()=>document.getElementById('um-userid')?.focus(),80);
}
window.umOpenCreate=umOpenCreate;

function umOpenEdit(userId){
  const u=MockData.users.find(u=>u.id===userId); if(!u) return;
  UM.modalMode='edit'; UM.editingId=userId;
  const isJa=AppState.lang==='ja';
  const modal=document.getElementById('user-modal');
  const title=document.getElementById('modal-title');
  const sub  =document.getElementById('modal-subtitle');
  const star =document.getElementById('pw-required-star');
  if(title) title.textContent=t('editUser');
  if(sub)   sub.textContent=isJa?`ID: ${u.id}`:`ID: ${u.id}`;
  if(star)  star.style.display='none';
  /* Fill fields */
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val??''; };
  set('um-userid',  u.id);
  set('um-name',    u.name);
  set('um-nameEn',  u.nameEn??'');
  set('um-email',   u.email);
  set('um-phone',   u.phone);
  set('um-role',    u.role);
  set('um-facility',u.facility??'');
  set('um-pw',''); set('um-pw2','');
  /* Lock User ID in edit mode */
  const uidEl=document.getElementById('um-userid');
  if(uidEl) uidEl.readOnly=true, uidEl.classList.add('opacity-60','cursor-not-allowed');
  umRoleChange();
  if(modal){ modal.style.cssText='display:flex!important'; }
  setTimeout(()=>document.getElementById('um-name')?.focus(),80);
}
window.umOpenEdit=umOpenEdit;

function umCloseModal(){
  const modal=document.getElementById('user-modal');
  if(modal) modal.style.cssText='display:none!important';
  /* Unlock user ID field */
  const uidEl=document.getElementById('um-userid');
  if(uidEl) uidEl.readOnly=false, uidEl.classList.remove('opacity-60','cursor-not-allowed');
  /* Clear errors */
  ['err-um-userid','err-um-name','err-um-email','err-um-pw','err-um-pw2'].forEach(id=>{
    document.getElementById(id)?.classList.add('hidden');
  });
}
window.umCloseModal=umCloseModal;

function umSubmitForm(e){
  e?.preventDefault?.();
  /* Gather values */
  const uid   = document.getElementById('um-userid')?.value.trim()??'';
  const name  = document.getElementById('um-name')?.value.trim()??'';
  const nameEn= document.getElementById('um-nameEn')?.value.trim()??'';
  const role  = document.getElementById('um-role')?.value??'saj_admin';
  const email = document.getElementById('um-email')?.value.trim()??'';
  const phone = document.getElementById('um-phone')?.value.trim()??'';
  const fac   = document.getElementById('um-facility')?.value??'';
  const pw    = document.getElementById('um-pw')?.value??'';
  const pw2   = document.getElementById('um-pw2')?.value??'';

  /* Clear errors */
  ['err-um-userid','err-um-name','err-um-email','err-um-pw','err-um-pw2'].forEach(id=>{
    document.getElementById(id)?.classList.add('hidden');
  });

  /* Validate */
  let ok=true;
  if(!uid) { document.getElementById('err-um-userid')?.classList.remove('hidden'); ok=false; }
  if(!name){ document.getElementById('err-um-name')?.classList.remove('hidden');   ok=false; }
  if(!email){document.getElementById('err-um-email')?.classList.remove('hidden');  ok=false; }
  if(UM.modalMode==='create'&&!pw){ document.getElementById('err-um-pw')?.classList.remove('hidden'); ok=false; }
  if(pw && pw!==pw2){ document.getElementById('err-um-pw2')?.classList.remove('hidden'); ok=false; }
  if(!ok) return;

  if(UM.modalMode==='create'){
    /* Check duplicate ID */
    if(MockData.users.find(u=>u.id===uid)){
      const errEl=document.getElementById('err-um-userid');
      if(errEl){ errEl.textContent=AppState.lang==='ja'?'このIDは既に使用されています':'This ID is already taken'; errEl.classList.remove('hidden'); }
      return;
    }
    MockData.users.push({ id:uid, pw, name, nameEn:nameEn||name, role, facility:fac||null, email, phone, status:'active', createdAt:new Date().toISOString().split('T')[0] });
    Toast.show(t('userCreated'),'success');
  } else {
    const idx=MockData.users.findIndex(u=>u.id===UM.editingId);
    if(idx>-1){
      const u=MockData.users[idx];
      u.name=name; u.nameEn=nameEn||name; u.role=role; u.email=email; u.phone=phone; u.facility=fac||null;
      if(pw) u.pw=pw;
    }
    Toast.show(t('userUpdated'),'success');
  }
  umCloseModal();
  router.renderCurrent();
}
window.umSubmitForm=umSubmitForm;

function umToggleStatus(userId, newStatus){
  const u=MockData.users.find(u=>u.id===userId); if(!u) return;
  u.status=newStatus;
  Toast.show(t(newStatus==='inactive'?'userDisabled':'userEnabled'), newStatus==='inactive'?'warning':'success');
  router.renderCurrent();
}
window.umToggleStatus=umToggleStatus;

// ──────────────────────────────────────────────────────────────────