/* ================================================================
   FACILITY MANAGEMENT PAGE
   Roles  : SAJ Admin (full CRUD) · Watami Staff (read + create/edit)
   Depends: AppState, t, icon, escHtml, statusBadge, formatDate,
            router, MockData, Toast, renderAppShell
   ================================================================ */

/* ── i18n extensions ─────────────────────────────────────────── */
Object.assign(translations.ja, {
  facilityName:      '施設名',
  facilityNameEn:    '施設名（英語）',
  facilityAddress:   '住所',
  facilityAddressEn: '住所（英語）',
  orderLimit:        '注文上限（パック数）',
  createFacility:    '施設を追加',
  editFacility:      '施設を編集',
  deleteFacility:    '施設を削除',
  confirmDeleteFac:  'この施設を削除しますか？関連データが失われる可能性があります。',
  facCreated:        '施設を追加しました',
  facUpdated:        '施設を更新しました',
  facDeleted:        '施設を削除しました',
  searchFacilities:  '施設を検索…',
  activeFacilitiesCount:  '稼働中施設',
  inactiveFacilitiesCount:'停止中施設',
  totalFacilitiesCount:   '施設合計',
  totalOrderLimit:   '注文上限合計',
  viewFacility:      '施設詳細',
  currentOrders:     '現在の注文数',
  recentOrdersLabel: '直近の注文',
  orderLimitHelp:    '1回の注文で受け取れる最大パック数',
  noFacilityOrders:  'この施設の注文はありません',
  region:            '地域',
  allRegions:        'すべての地域',
  tokyo:             '東京',
  osaka:             '大阪・関西',
  nagoya:            '名古屋・中部',
  other_region:      'その他',
  limitUsage:        '使用率',
  ordersCount:       '注文件数',
});
Object.assign(translations.en, {
  facilityName:      'Facility Name',
  facilityNameEn:    'Facility Name (EN)',
  facilityAddress:   'Address',
  facilityAddressEn: 'Address (EN)',
  orderLimit:        'Order Limit (packs)',
  createFacility:    'Add Facility',
  editFacility:      'Edit Facility',
  deleteFacility:    'Delete Facility',
  confirmDeleteFac:  'Delete this facility? Related order data may be affected.',
  facCreated:        'Facility added successfully',
  facUpdated:        'Facility updated',
  facDeleted:        'Facility deleted',
  searchFacilities:  'Search facilities…',
  activeFacilitiesCount:  'Active Facilities',
  inactiveFacilitiesCount:'Inactive Facilities',
  totalFacilitiesCount:   'Total Facilities',
  totalOrderLimit:   'Total Order Limit',
  viewFacility:      'View Facility',
  currentOrders:     'Current Orders',
  recentOrdersLabel: 'Recent Orders',
  orderLimitHelp:    'Maximum packs per order',
  noFacilityOrders:  'No orders for this facility',
  region:            'Region',
  allRegions:        'All Regions',
  tokyo:             'Tokyo',
  osaka:             'Osaka / Kansai',
  nagoya:            'Nagoya / Chubu',
  other_region:      'Other',
  limitUsage:        'Limit Usage',
  ordersCount:       'Orders',
});

/* ── Facility Management State ───────────────────────────────── */
const FM = {
  search:      '',
  statusFilter:'all',
  sortKey:     'name',
  sortDir:     'asc',
  page:        1,
  perPage:     8,
  viewMode:    'table',   // 'table' | 'cards'
  modalMode:   'create',
  editingId:   null,
  detailId:    null,
};

/* ── Region detect helper ────────────────────────────────────── */
function fmRegion(fac) {
  const addr = fac.address ?? '';
  if (addr.includes('東京') || addr.includes('神奈川') || addr.includes('埼玉') || addr.includes('千葉')) return 'tokyo';
  if (addr.includes('大阪') || addr.includes('京都') || addr.includes('兵庫') || addr.includes('奈良')) return 'osaka';
  if (addr.includes('愛知') || addr.includes('岐阜') || addr.includes('三重') || addr.includes('静岡')) return 'nagoya';
  return 'other_region';
}

router.register('facilities', () => {
  const isJa   = AppState.lang === 'ja';
  const role   = AppState.user?.role ?? 'saj_admin';
  const canDelete = role === 'saj_admin';

  /* ── Filter + sort ── */
  let list = MockData.facilities.filter(f => {
    const nm = isJa ? f.name : f.nameEn;
    const searchMatch = !FM.search ||
      nm.toLowerCase().includes(FM.search.toLowerCase()) ||
      f.id.toLowerCase().includes(FM.search.toLowerCase()) ||
      f.address.toLowerCase().includes(FM.search.toLowerCase());
    const statMatch   = FM.statusFilter === 'all' || f.status === FM.statusFilter;
    return searchMatch && statMatch;
  });

  list = [...list].sort((a, b) => {
    const av = FM.sortKey === 'name'
      ? (isJa ? a.name : a.nameEn).toLowerCase()
      : String(a[FM.sortKey] ?? '').toLowerCase();
    const bv = FM.sortKey === 'name'
      ? (isJa ? b.name : b.nameEn).toLowerCase()
      : String(b[FM.sortKey] ?? '').toLowerCase();
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return FM.sortDir === 'asc' ? cmp : -cmp;
  });

  const total  = list.length;
  const pages  = Math.max(1, Math.ceil(total / FM.perPage));
  FM.page      = Math.min(FM.page, pages);
  const sliced = list.slice((FM.page - 1) * FM.perPage, FM.page * FM.perPage);
  const all    = MockData.facilities;

  /* ── KPI strip ── */
  const totalLimit = all.reduce((s, f) => s + f.orderLimit, 0);
  const kpiList = [
    { key:'totalFacilitiesCount',   val: all.length,                                bg:'bg-blue-50',  ic:'text-blue-600',   icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { key:'activeFacilitiesCount',  val: all.filter(f => f.status === 'active').length,   bg:'bg-green-50', ic:'text-green-600',  icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key:'inactiveFacilitiesCount',val: all.filter(f => f.status === 'inactive').length, bg:'bg-red-50',   ic:'text-red-600',    icon:'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
    { key:'totalOrderLimit',        val: totalLimit,                                bg:'bg-teal-50',  ic:'text-teal-600',   icon:'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ];
  const kpiHTML = kpiList.map(k => `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div class="w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center shrink-0">${icon(k.icon, `w-[18px] h-[18px] ${k.ic}`)}</div>
      <div>
        <div class="text-xl font-extrabold text-gray-900">${k.val}</div>
        <div class="text-xs text-gray-500 mt-0.5">${t(k.key)}</div>
      </div>
    </div>`).join('');

  /* ── Sort icon helper ── */
  const sortIcon = key => {
    if (FM.sortKey !== key) return `<svg class="w-3 h-3 opacity-25 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`;
    return FM.sortDir === 'asc'
      ? `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`
      : `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;
  };
  const th = (key, label) =>
    `<th class="cursor-pointer select-none hover:text-gray-600 transition-colors" onclick="fmSort('${key}')">${label}${sortIcon(key)}</th>`;

  /* ── Order count per facility ── */
  const orderCount = id => MockData.orders.filter(o => o.facility === id).length;
  const activeOrderCount = id => MockData.orders.filter(o => o.facility === id && !['received','cancelled','rejected'].includes(o.status)).length;

  /* ── Limit usage bar ── */
  const usageBar = (fac) => {
    const active = activeOrderCount(fac.id);
    const pct = Math.min(100, Math.round((active / fac.orderLimit) * 100));
    const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-green-500';
    return `
      <div class="flex items-center gap-2">
        <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div class="${color} h-full rounded-full" style="width:${pct}%"></div>
        </div>
        <span class="text-[10px] text-gray-500 shrink-0 font-medium">${active}/${fac.orderLimit}</span>
      </div>`;
  };

  /* ── TABLE rows ── */
  const tableRowsHTML = sliced.length === 0
    ? `<tr><td colspan="7" class="text-center py-14 text-gray-400 text-sm">${t('noData')}</td></tr>`
    : sliced.map(f => {
        const nm   = isJa ? f.name : f.nameEn;
        const addr = isJa ? f.address : f.addressEn;
        const cnt  = orderCount(f.id);
        return `<tr>
          <td>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-extrabold text-white
                ${f.status === 'active' ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-gray-400 to-gray-600'}">
                ${nm.charAt(0)}
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold text-gray-900 max-w-[160px] truncate">${escHtml(nm)}</div>
                <div class="text-[10px] text-gray-400 font-mono">${escHtml(f.id)}</div>
              </div>
            </div>
          </td>
          <td class="text-xs text-gray-600 max-w-[180px] truncate">${escHtml(addr)}</td>
          <td>
            <div class="min-w-[110px]">
              <div class="text-xs text-gray-700 mb-1">${f.orderLimit} <span class="text-gray-400">${isJa ? 'パック' : 'packs'}</span></div>
              ${usageBar(f)}
            </div>
          </td>
          <td class="text-center">
            <span class="text-sm font-bold text-gray-800">${cnt}</span>
          </td>
          <td><span class="${statusBadge(f.status)}">${t(f.status)}</span></td>
          <td>
            <div class="flex items-center gap-1">
              <button onclick="fmOpenDetail('${f.id}')" class="btn-icon" title="${t('viewFacility')}">
                ${icon('M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', 'w-4 h-4')}
              </button>
              <button onclick="fmOpenEdit('${f.id}')" class="btn-sm text-blue-600 border-blue-200 hover:bg-blue-50">
                ${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', 'w-3.5 h-3.5')} ${t('edit')}
              </button>
              ${canDelete ? `
              <button onclick="fmDelete('${f.id}')" class="btn-sm text-red-600 border-red-200 hover:bg-red-50">
                ${icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', 'w-3.5 h-3.5')}
              </button>` : ''}
            </div>
          </td>
        </tr>`;
      }).join('');

  /* ── CARD view ── */
  const cardsHTML = sliced.length === 0
    ? `<div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
         ${icon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16', 'w-12 h-12 opacity-30 mb-3')}
         <p class="text-sm">${t('noData')}</p>
       </div>`
    : sliced.map(f => {
        const nm    = isJa ? f.name : f.nameEn;
        const addr  = isJa ? f.address : f.addressEn;
        const cnt   = orderCount(f.id);
        const acnt  = activeOrderCount(f.id);
        const pct   = Math.min(100, Math.round((acnt / f.orderLimit) * 100));
        const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-green-500';
        return `
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <!-- Header strip -->
            <div class="h-2 ${f.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'}"></div>
            <div class="p-4">
              <!-- Name + badge -->
              <div class="flex items-start justify-between gap-2 mb-3">
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-gray-900 leading-snug line-clamp-2">${escHtml(nm)}</h4>
                  <p class="text-[10px] text-gray-400 font-mono mt-0.5">${escHtml(f.id)}</p>
                </div>
                <span class="${statusBadge(f.status)} shrink-0 mt-0.5">${t(f.status)}</span>
              </div>

              <!-- Address -->
              <div class="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
                ${icon('M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', 'w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5')}
                <span class="leading-snug">${escHtml(addr)}</span>
              </div>

              <!-- Stats grid -->
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-gray-50 rounded-xl p-2.5 text-center">
                  <div class="text-lg font-extrabold text-gray-900">${cnt}</div>
                  <div class="text-[10px] text-gray-500 mt-0.5">${t('ordersCount')}</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-2.5 text-center">
                  <div class="text-lg font-extrabold text-gray-900">${f.orderLimit}</div>
                  <div class="text-[10px] text-gray-500 mt-0.5">${isJa ? '上限パック' : 'Pack Limit'}</div>
                </div>
              </div>

              <!-- Limit usage bar -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] text-gray-500">${t('limitUsage')}</span>
                  <span class="text-[10px] font-semibold ${pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-green-600'}">${pct}%</span>
                </div>
                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="${barColor} h-full rounded-full transition-all" style="width:${pct}%"></div>
                </div>
                <div class="text-[10px] text-gray-400 mt-0.5">${acnt} / ${f.orderLimit} ${isJa ? 'パック使用中' : 'packs in use'}</div>
              </div>

              <!-- Actions -->
              <div class="flex gap-1.5">
                <button onclick="fmOpenDetail('${f.id}')" class="flex-1 btn-sm justify-center text-xs">
                  ${icon('M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'w-3.5 h-3.5')} ${t('viewFacility')}
                </button>
                <button onclick="fmOpenEdit('${f.id}')" class="btn-icon border-blue-200 text-blue-600 hover:bg-blue-50">
                  ${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', 'w-3.5 h-3.5')}
                </button>
                ${canDelete ? `<button onclick="fmDelete('${f.id}')" class="btn-icon border-red-200 text-red-600 hover:bg-red-50">
                  ${icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', 'w-3.5 h-3.5')}
                </button>` : ''}
              </div>
            </div>
          </div>`;
      }).join('');

  /* ── Pagination ── */
  const paginHTML = pages <= 1 ? '' : (() => {
    let btns = '';
    for (let i = 1; i <= pages; i++)
      btns += `<button onclick="fmGoPage(${i})" class="w-8 h-8 rounded-lg text-xs font-semibold transition-all ${i === FM.page ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}">${i}</button>`;
    return `<div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-400">${t('showingOf')} ${(FM.page-1)*FM.perPage+1}–${Math.min(FM.page*FM.perPage,total)} ${t('of')} ${total} ${t('results')}</p>
      <div class="flex gap-1">
        <button onclick="fmGoPage(${FM.page-1})" ${FM.page===1?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        ${btns}
        <button onclick="fmGoPage(${FM.page+1})" ${FM.page===pages?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>`;
  })();

  /* ── Create / Edit Modal ── */
  const modalHTML = `
  <div id="fm-modal" style="display:none!important" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="fmCloseModal()"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 class="text-base font-bold text-gray-900" id="fm-modal-title">${t('createFacility')}</h3>
          <p class="text-xs text-gray-500 mt-0.5" id="fm-modal-sub">${isJa ? '新しい施設を登録' : 'Register a new facility'}</p>
        </div>
        <button onclick="fmCloseModal()" class="btn-icon">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- Body -->
      <form id="fm-form" onsubmit="fmSubmit(event)" novalidate class="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
        <!-- Name JA -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('facilityName')} <span class="text-red-500">*</span></label>
          <input id="fm-name" type="text"
            class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
            placeholder="${isJa ? '例: 東京高齢者介護センター' : 'e.g. 東京高齢者介護センター'}"/>
          <p id="err-fm-name" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
        </div>
        <!-- Name EN -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('facilityNameEn')} <span class="text-red-500">*</span></label>
          <input id="fm-nameEn" type="text"
            class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
            placeholder="e.g. Tokyo Elderly Care Center"/>
          <p id="err-fm-nameEn" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
        </div>
        <!-- Address JA -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('facilityAddress')} <span class="text-red-500">*</span></label>
          <input id="fm-address" type="text"
            class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
            placeholder="${isJa ? '例: 東京都新宿区西新宿2-8-1' : 'e.g. 東京都新宿区西新宿2-8-1'}"/>
          <p id="err-fm-address" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
        </div>
        <!-- Address EN -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('facilityAddressEn')}</label>
          <input id="fm-addressEn" type="text"
            class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
            placeholder="e.g. 2-8-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo"/>
        </div>
        <!-- Order Limit + Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              ${t('orderLimit')} <span class="text-red-500">*</span>
              <span class="text-[10px] text-gray-400 font-normal ml-1">(${t('orderLimitHelp')})</span>
            </label>
            <input id="fm-limit" type="number" min="1" max="999"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"
              placeholder="50"/>
            <p id="err-fm-limit" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('status')}</label>
            <select id="fm-status"
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all">
              <option value="active">${t('active')}</option>
              <option value="inactive">${t('inactive')}</option>
            </select>
          </div>
        </div>
      </form>
      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
        <button type="button" onclick="fmCloseModal()" class="btn-ghost">${t('cancel')}</button>
        <button type="button" onclick="fmSubmit(event)" class="btn-primary px-5 py-2 text-sm">
          ${icon('M5 13l4 4L19 7', 'w-4 h-4')} ${t('save')}
        </button>
      </div>
    </div>
  </div>`;

  /* ── Detail Drawer ── */
  const detailFac = FM.detailId ? MockData.facilities.find(f => f.id === FM.detailId) : null;
  const drawerHTML = detailFac ? (() => {
    const df    = detailFac;
    const dnm   = isJa ? df.name : df.nameEn;
    const daddr = isJa ? df.address : df.addressEn;
    const dcnt  = orderCount(df.id);
    const dacnt = activeOrderCount(df.id);
    const dpct  = Math.min(100, Math.round((dacnt / df.orderLimit) * 100));
    const dbar  = dpct >= 90 ? 'bg-red-500' : dpct >= 70 ? 'bg-amber-400' : 'bg-green-500';

    /* Recent orders for this facility */
    const facOrders = MockData.orders
      .filter(o => o.facility === df.id)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);

    const orderRowsHTML = facOrders.length === 0
      ? `<p class="text-xs text-gray-400 text-center py-4">${t('noFacilityOrders')}</p>`
      : facOrders.map(o => `
          <div class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <div class="text-xs font-semibold text-gray-800 font-mono">${escHtml(o.id)}</div>
              <div class="text-[10px] text-gray-400">${formatDate(o.orderDate)} · ${o.packs} ${isJa ? 'パック' : 'packs'}</div>
            </div>
            <span class="${statusBadge(o.status)} text-[10px]">${t(o.status)}</span>
          </div>`).join('');

    return `
    <div id="fm-drawer" class="fixed inset-0 z-50 flex">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="fmCloseDetail()"></div>
      <div class="relative ml-auto bg-white w-full max-w-sm shadow-2xl flex flex-col overflow-hidden" style="animation:slideIn .25s ease">
        <!-- Drawer header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 class="text-sm font-bold text-gray-900">${t('viewFacility')}</h3>
          <button onclick="fmCloseDetail()" class="btn-icon">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <!-- Drawer body -->
        <div class="flex-1 overflow-y-auto">
          <!-- Hero strip -->
          <div class="h-2 ${df.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'}"></div>
          <div class="p-5 space-y-4">
            <!-- Title -->
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <h4 class="text-base font-extrabold text-gray-900 leading-snug">${escHtml(dnm)}</h4>
                <span class="${statusBadge(df.status)} shrink-0">${t(df.status)}</span>
              </div>
              <p class="text-[10px] text-gray-400 font-mono">${escHtml(df.id)}</p>
            </div>

            <!-- Info fields -->
            <div class="space-y-2.5">
              ${[
                { l: t('facilityAddress'),  v: escHtml(daddr),     i: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
              ].map(r => `
                <div class="flex items-start gap-2.5 text-sm text-gray-700">
                  <div class="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    ${icon(r.i, 'w-3.5 h-3.5 text-gray-500')}
                  </div>
                  <span class="leading-snug text-xs">${r.v}</span>
                </div>`).join('')}
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-2.5">
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <div class="text-2xl font-extrabold text-gray-900">${dcnt}</div>
                <div class="text-[10px] text-gray-500 mt-0.5">${t('ordersCount')}</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <div class="text-2xl font-extrabold text-gray-900">${df.orderLimit}</div>
                <div class="text-[10px] text-gray-500 mt-0.5">${isJa ? '上限パック' : 'Pack Limit'}</div>
              </div>
            </div>

            <!-- Usage bar -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-semibold text-gray-700">${t('limitUsage')}</span>
                <span class="text-xs font-bold ${dpct >= 90 ? 'text-red-600' : dpct >= 70 ? 'text-amber-600' : 'text-green-600'}">${dpct}%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="${dbar} h-full rounded-full transition-all" style="width:${dpct}%"></div>
              </div>
              <div class="text-[10px] text-gray-400 mt-1">${dacnt} / ${df.orderLimit} ${isJa ? 'パック使用中' : 'packs in use'}</div>
            </div>

            <!-- Recent orders -->
            <div>
              <h5 class="text-xs font-bold text-gray-700 mb-2">${t('recentOrdersLabel')}</h5>
              <div class="bg-gray-50 rounded-xl px-3 py-1">${orderRowsHTML}</div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-2">
              <button onclick="fmOpenEdit('${df.id}');fmCloseDetail()" class="btn-primary flex-1 text-sm py-2.5">
                ${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', 'w-4 h-4')} ${t('editFacility')}
              </button>
              ${canDelete ? `
              <button onclick="fmDelete('${df.id}');fmCloseDetail()" class="btn-ghost border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5">
                ${icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', 'w-4 h-4')}
              </button>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  })() : '';

  /* ── Filter options ── */
  const statOpts = ['all', 'active', 'inactive'].map(s =>
    `<option value="${s}" ${FM.statusFilter === s ? 'selected' : ''}>${s === 'all' ? t('allStatus') : t(s)}</option>`
  ).join('');

  /* ── Assemble page ── */
  const content = `
  ${modalHTML}
  ${drawerHTML}
  <div class="p-5 lg:p-7 space-y-5 max-w-[1600px]">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('facilityManagement')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${isJa ? '配送先施設の登録・管理・注文状況確認' : 'Register, manage and monitor delivery facility operations'}</p>
      </div>
      <button onclick="fmOpenCreate()" class="btn-primary self-start">
        ${icon('M12 4v16m8-8H4', 'w-4 h-4')} ${t('createFacility')}
      </button>
    </div>

    <!-- KPI strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">${kpiHTML}</div>

    <!-- Filters bar -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          ${icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0', 'w-4 h-4')}
        </span>
        <input id="fm-search-input" type="text" value="${escHtml(FM.search)}" oninput="fmSearch(this.value)"
          placeholder="${t('searchFacilities')}"
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"/>
      </div>
      <!-- Status filter -->
      <select onchange="fmFilterStatus(this.value)"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all min-w-[120px]">
        ${statOpts}
      </select>
      <!-- View toggle -->
      <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
        <button onclick="fmSetView('table')" class="p-2 rounded-lg transition-all ${FM.viewMode === 'table' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400 hover:text-gray-600'}" title="${isJa ? 'テーブル' : 'Table'}">
          ${icon('M3 10h18M3 14h18M3 6h18M3 18h18', 'w-4 h-4')}
        </button>
        <button onclick="fmSetView('cards')" class="p-2 rounded-lg transition-all ${FM.viewMode === 'cards' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400 hover:text-gray-600'}" title="${isJa ? 'カード' : 'Cards'}">
          ${icon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', 'w-4 h-4')}
        </button>
      </div>
      <!-- Reset -->
      <button onclick="fmResetFilters()" class="btn-ghost shrink-0">
        ${icon('M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', 'w-4 h-4')}
        ${isJa ? 'リセット' : 'Reset'}
      </button>
    </div>

    <!-- Content area -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      ${FM.viewMode === 'table'
        ? `<div class="overflow-x-auto">
             <table class="data-table">
               <thead><tr>
                 ${th('name',       t('facilityName'))}
                 ${th('address',    t('facilityAddress'))}
                 ${th('orderLimit', t('orderLimit'))}
                 <th>${t('currentOrders')}</th>
                 ${th('status',     t('status'))}
                 <th>${t('actions')}</th>
               </tr></thead>
               <tbody>${tableRowsHTML}</tbody>
             </table>
           </div>
           ${paginHTML ? `<div class="px-4 pb-4">${paginHTML}</div>` : ''}`
        : `<div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
             ${cardsHTML}
           </div>
           ${paginHTML ? `<div class="px-4 pb-4 border-t border-gray-100">${paginHTML}</div>` : ''}`}
    </div>

  </div>`;

  return renderAppShell(content, 'facilities');
});

/* ── Facility Management event handlers ─────────────────────── */
function fmSearch(v)        { FM.search = v; FM.page = 1; router.renderCurrent(); }
function fmFilterStatus(v)  { FM.statusFilter = v; FM.page = 1; router.renderCurrent(); }
function fmResetFilters()   { FM.search = ''; FM.statusFilter = 'all'; FM.page = 1; router.renderCurrent(); }
function fmGoPage(p)        { FM.page = p; router.renderCurrent(); }
function fmSetView(v)       { FM.viewMode = v; router.renderCurrent(); }
function fmSort(key)        {
  if (FM.sortKey === key) FM.sortDir = FM.sortDir === 'asc' ? 'desc' : 'asc';
  else { FM.sortKey = key; FM.sortDir = 'asc'; }
  router.renderCurrent();
}
function fmOpenDetail(id)   { FM.detailId = id; router.renderCurrent(); }
function fmCloseDetail()    { FM.detailId = null; router.renderCurrent(); }

window.fmSearch=fmSearch; window.fmFilterStatus=fmFilterStatus;
window.fmResetFilters=fmResetFilters; window.fmGoPage=fmGoPage;
window.fmSetView=fmSetView; window.fmSort=fmSort;
window.fmOpenDetail=fmOpenDetail; window.fmCloseDetail=fmCloseDetail;

function fmOpenCreate() {
  FM.modalMode = 'create'; FM.editingId = null;
  const isJa   = AppState.lang === 'ja';
  const modal  = document.getElementById('fm-modal');
  const title  = document.getElementById('fm-modal-title');
  const sub    = document.getElementById('fm-modal-sub');
  if (title) title.textContent = t('createFacility');
  if (sub)   sub.textContent   = isJa ? '新しい施設を登録' : 'Register a new facility';
  ['fm-name','fm-nameEn','fm-address','fm-addressEn','fm-limit'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const stEl = document.getElementById('fm-status'); if (stEl) stEl.value = 'active';
  ['err-fm-name','err-fm-nameEn','err-fm-address','err-fm-limit'].forEach(id =>
    document.getElementById(id)?.classList.add('hidden'));
  if (modal) modal.style.cssText = 'display:flex!important';
  setTimeout(() => document.getElementById('fm-name')?.focus(), 80);
}
window.fmOpenCreate = fmOpenCreate;

function fmOpenEdit(facId) {
  const f = MockData.facilities.find(f => f.id === facId); if (!f) return;
  FM.modalMode = 'edit'; FM.editingId = facId;
  const isJa  = AppState.lang === 'ja';
  const modal = document.getElementById('fm-modal');
  const title = document.getElementById('fm-modal-title');
  const sub   = document.getElementById('fm-modal-sub');
  if (title) title.textContent = t('editFacility');
  if (sub)   sub.textContent   = isJa ? `ID: ${f.id}` : `ID: ${f.id}`;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  set('fm-name',      f.name);
  set('fm-nameEn',    f.nameEn);
  set('fm-address',   f.address);
  set('fm-addressEn', f.addressEn);
  set('fm-limit',     f.orderLimit);
  set('fm-status',    f.status);
  ['err-fm-name','err-fm-nameEn','err-fm-address','err-fm-limit'].forEach(id =>
    document.getElementById(id)?.classList.add('hidden'));
  if (modal) modal.style.cssText = 'display:flex!important';
  setTimeout(() => document.getElementById('fm-name')?.focus(), 80);
}
window.fmOpenEdit = fmOpenEdit;

function fmCloseModal() {
  const modal = document.getElementById('fm-modal');
  if (modal) modal.style.cssText = 'display:none!important';
}
window.fmCloseModal = fmCloseModal;

function fmSubmit(e) {
  e?.preventDefault?.();
  const name      = document.getElementById('fm-name')?.value.trim() ?? '';
  const nameEn    = document.getElementById('fm-nameEn')?.value.trim() ?? '';
  const address   = document.getElementById('fm-address')?.value.trim() ?? '';
  const addressEn = document.getElementById('fm-addressEn')?.value.trim() ?? '';
  const limit     = parseInt(document.getElementById('fm-limit')?.value ?? '0');
  const fmStatus  = document.getElementById('fm-status')?.value ?? 'active';

  /* Clear errors */
  ['err-fm-name','err-fm-nameEn','err-fm-address','err-fm-limit'].forEach(id =>
    document.getElementById(id)?.classList.add('hidden'));

  /* Validate */
  let ok = true;
  if (!name)           { document.getElementById('err-fm-name')?.classList.remove('hidden');    ok = false; }
  if (!nameEn)         { document.getElementById('err-fm-nameEn')?.classList.remove('hidden');  ok = false; }
  if (!address)        { document.getElementById('err-fm-address')?.classList.remove('hidden'); ok = false; }
  if (!limit || limit < 1) { document.getElementById('err-fm-limit')?.classList.remove('hidden'); ok = false; }
  if (!ok) return;

  if (FM.modalMode === 'create') {
    const newId = 'FAC' + String(MockData.facilities.length + 1).padStart(3, '0');
    MockData.facilities.push({
      id: newId, name, nameEn, address, addressEn, orderLimit: limit, status: fmStatus,
    });
    Toast.show(t('facCreated'), 'success');
  } else {
    const idx = MockData.facilities.findIndex(f => f.id === FM.editingId);
    if (idx > -1) Object.assign(MockData.facilities[idx], { name, nameEn, address, addressEn, orderLimit: limit, status: fmStatus });
    Toast.show(t('facUpdated'), 'success');
  }
  fmCloseModal();
  router.renderCurrent();
}
window.fmSubmit = fmSubmit;

function fmDelete(facId) {
  const f = MockData.facilities.find(f => f.id === facId); if (!f) return;
  const nm  = AppState.lang === 'ja' ? f.name : f.nameEn;
  const msg = AppState.lang === 'ja'
    ? `「${nm}」を削除しますか？\n関連する注文データが影響を受ける可能性があります。`
    : `Delete "${nm}"?\nRelated order data may be affected.`;
  if (!confirm(msg)) return;
  MockData.facilities = MockData.facilities.filter(f => f.id !== facId);
  Toast.show(t('facDeleted'), 'warning');
  if (FM.detailId === facId) FM.detailId = null;
  router.renderCurrent();
}
window.fmDelete = fmDelete;
