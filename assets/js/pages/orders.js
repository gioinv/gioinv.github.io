/* ================================================================
   ORDER MANAGEMENT PAGE — List, Search, Filter, Sort, Detail View
   Role   : Watami Staff (primary) · all roles can view own orders
   Depends: AppState, t, icon, escHtml, statusBadge, formatDate,
            getFacilityName, router, MockData, Toast, renderAppShell
   ================================================================ */

/* ── i18n extensions ─────────────────────────────────────────── */
Object.assign(translations.ja, {
  orderManagementTitle:  '注文管理',
  orderManagementSub:    'すべての注文の確認・検索・フィルタリング',
  orderDetail:           '注文詳細',
  orderItems:            '注文品目',
  ingredientName:        '食材名',
  requestedQty:          '注文数',
  unitPack:              'パック',
  totalPacksLabel:       '合計パック数',
  deliveryDateLabel:     '納品希望日',
  orderDateLabel:        '注文日',
  notesLabel:            '備考',
  statusHistory:         'ステータス履歴',
  searchOrders:          '注文を検索…',
  filterByStatus2:       'ステータスで絞り込み',
  filterByFacility:      '施設で絞り込み',
  filterByDate:          '期間で絞り込み',
  allFacilities:         'すべての施設',
  dateFrom:              '開始日',
  dateTo:                '終了日',
  totalOrders:           '注文合計',
  todayOrders:           '本日の注文',
  thisWeekOrders:        '今週の注文',
  rejectedOrders:        '却下された注文',
  exportOrders:          '注文をエクスポート',
  exportedSuccess:       '注文リストをダウンロードしました',
  markAsShipped:         '発送済みにする',
  markAsReceived:        '受領済みにする',
  goToAllocation:        '引当処理へ',
  goToShipping:          '出荷管理へ',
  noOrdersFound:         '注文が見つかりません',
  orderCount:            '件',
  packCount:             'パック',
  viewOrder:             '詳細を見る',
  closeDetail:           '閉じる',
  lastUpdated:           '最終更新',
});
Object.assign(translations.en, {
  orderManagementTitle:  'Order Management',
  orderManagementSub:    'View, search and filter all orders',
  orderDetail:           'Order Detail',
  orderItems:            'Order Items',
  ingredientName:        'Ingredient',
  requestedQty:          'Qty',
  unitPack:              'packs',
  totalPacksLabel:       'Total Packs',
  deliveryDateLabel:     'Delivery Date',
  orderDateLabel:        'Order Date',
  notesLabel:            'Notes',
  statusHistory:         'Status History',
  searchOrders:          'Search orders…',
  filterByStatus2:       'Filter by status',
  filterByFacility:      'Filter by facility',
  filterByDate:          'Filter by date',
  allFacilities:         'All Facilities',
  dateFrom:              'From',
  dateTo:                'To',
  totalOrders:           'Total Orders',
  todayOrders:           "Today's Orders",
  thisWeekOrders:        'This Week',
  rejectedOrders:        'Rejected',
  exportOrders:          'Export CSV',
  exportedSuccess:       'Order list downloaded',
  markAsShipped:         'Mark as Shipped',
  markAsReceived:        'Mark as Received',
  goToAllocation:        'Go to Allocation',
  goToShipping:          'Go to Shipping',
  noOrdersFound:         'No orders found',
  orderCount:            'orders',
  packCount:             'packs',
  viewOrder:             'View',
  closeDetail:           'Close',
  lastUpdated:           'Last Updated',
});

/* ── Order Management State ──────────────────────────────────── */
const OM = {
  search:       '',
  statusFilter: 'all',
  facFilter:    'all',
  dateFrom:     '',
  dateTo:       '',
  sortKey:      'orderDate',
  sortDir:      'desc',
  page:         1,
  perPage:      10,
  detailId:     null,    // order id shown in drawer
};

/* ── Status timeline for a given order ──────────────────────── */
function omStatusTimeline(order) {
  const all = ['pending','allocated','approved','shipped','received'];
  const idx  = all.indexOf(order.status);
  /* rejected / cancelled break the normal flow */
  if (order.status === 'rejected')  return [{s:'pending',done:true},{s:'rejected',done:true,current:true}];
  if (order.status === 'cancelled') return [{s:'pending',done:true},{s:'cancelled',done:true,current:true}];
  return all.map((s, i) => ({ s, done: i <= idx, current: i === idx }));
}

router.register('orders', () => {
  const isJa = AppState.lang === 'ja';
  const today = '2026-06-12';
  const weekAgo = '2026-06-06';

  /* ── Filter + sort ── */
  let list = MockData.orders.filter(o => {
    const facName = isJa
      ? (MockData.facilities.find(f=>f.id===o.facility)?.name ?? o.facility)
      : (MockData.facilities.find(f=>f.id===o.facility)?.nameEn ?? o.facility);
    const searchMatch = !OM.search ||
      o.id.toLowerCase().includes(OM.search.toLowerCase()) ||
      facName.toLowerCase().includes(OM.search.toLowerCase());
    const statMatch   = OM.statusFilter === 'all' || o.status === OM.statusFilter;
    const facMatch    = OM.facFilter === 'all' || o.facility === OM.facFilter;
    const fromMatch   = !OM.dateFrom || o.orderDate >= OM.dateFrom;
    const toMatch     = !OM.dateTo   || o.orderDate <= OM.dateTo;
    return searchMatch && statMatch && facMatch && fromMatch && toMatch;
  });

  list = [...list].sort((a, b) => {
    const av = a[OM.sortKey] ?? '';
    const bv = b[OM.sortKey] ?? '';
    const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
    return OM.sortDir === 'asc' ? cmp : -cmp;
  });

  const total  = list.length;
  const pages  = Math.max(1, Math.ceil(total / OM.perPage));
  OM.page      = Math.min(OM.page, pages);
  const sliced = list.slice((OM.page - 1) * OM.perPage, OM.page * OM.perPage);
  const all    = MockData.orders;

  /* ── KPI strip ── */
  const todayCount    = all.filter(o => o.orderDate === today).length;
  const weekCount     = all.filter(o => o.orderDate >= weekAgo).length;
  const rejectedCount = all.filter(o => o.status === 'rejected').length;
  const kpis = [
    { key:'totalOrders',    val:all.length,       bg:'bg-blue-50',   ic:'text-blue-600',   icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { key:'todayOrders',    val:todayCount,        bg:'bg-green-50',  ic:'text-green-600',  icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { key:'thisWeekOrders', val:weekCount,         bg:'bg-teal-50',   ic:'text-teal-600',   icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key:'pendingOrders',  val:all.filter(o=>o.status==='pending').length,   bg:'bg-amber-50',  ic:'text-amber-600',  icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key:'approvedOrders', val:all.filter(o=>o.status==='approved').length,  bg:'bg-violet-50', ic:'text-violet-600', icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key:'rejectedOrders', val:rejectedCount,     bg:'bg-red-50',    ic:'text-red-600',    icon:'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];
  const kpiHTML = kpis.map(k => `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onclick="omFilterStatus('${k.key==='totalOrders'?'all':k.key==='pendingOrders'?'pending':k.key==='approvedOrders'?'approved':k.key==='rejectedOrders'?'rejected':k.key==='todayOrders'?'all':'all'}')">
      <div class="w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center shrink-0">${icon(k.icon,`w-[18px] h-[18px] ${k.ic}`)}</div>
      <div><div class="text-xl font-extrabold text-gray-900">${k.val}</div><div class="text-xs text-gray-500 mt-0.5">${t(k.key)}</div></div>
    </div>`).join('');

  /* ── Sort helper ── */
  const sortIcon = key => {
    if (OM.sortKey !== key) return `<svg class="w-3 h-3 opacity-25 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`;
    return OM.sortDir === 'asc'
      ? `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`
      : `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;
  };
  const th = (key, label) =>
    `<th class="cursor-pointer select-none hover:text-gray-600 transition-colors" onclick="omSort('${key}')">${label}${sortIcon(key)}</th>`;

  /* ── Table rows ── */
  const rowsHTML = sliced.length === 0
    ? `<tr><td colspan="8" class="text-center py-16 text-gray-400 text-sm">${t('noOrdersFound')}</td></tr>`
    : sliced.map(o => {
        const facName = isJa
          ? (MockData.facilities.find(f=>f.id===o.facility)?.name ?? o.facility)
          : (MockData.facilities.find(f=>f.id===o.facility)?.nameEn ?? o.facility);
        const isToday  = o.orderDate === today;
        const urgency  = o.deliveryDate <= today && !['received','cancelled'].includes(o.status);
        return `<tr class="${urgency ? 'bg-red-50/30' : ''}">
          <td class="font-mono text-xs font-semibold text-gray-800">${escHtml(o.id)}</td>
          <td class="max-w-[140px]">
            <span class="text-xs text-gray-700 block truncate" title="${escHtml(facName)}">${escHtml(facName)}</span>
          </td>
          <td class="text-center"><span class="text-sm font-bold text-gray-800">${o.items.length}</span></td>
          <td class="text-center"><span class="text-sm font-bold text-gray-800">${o.packs}</span></td>
          <td class="text-xs ${isToday?'text-green-700 font-semibold':'text-gray-500'}">${formatDate(o.orderDate)}</td>
          <td class="text-xs ${urgency?'text-red-600 font-semibold':'text-gray-500'}">${formatDate(o.deliveryDate)}</td>
          <td><span class="${statusBadge(o.status)}">${t(o.status)}</span></td>
          <td>
            <div class="flex items-center gap-1">
              <button onclick="omOpenDetail('${o.id}')" class="btn-sm text-xs">
                ${icon('M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z','w-3.5 h-3.5')} ${t('viewOrder')}
              </button>
              ${o.status === 'pending' ? `
              <button onclick="router.navigate('allocation')" class="btn-sm text-xs text-amber-600 border-amber-200 hover:bg-amber-50">
                ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-3.5 h-3.5')}
              </button>` : ''}
              ${o.status === 'approved' ? `
              <button onclick="omMarkShipped('${o.id}')" class="btn-sm text-xs text-teal-600 border-teal-200 hover:bg-teal-50">
                ${icon('M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4','w-3.5 h-3.5')}
              </button>` : ''}
            </div>
          </td>
        </tr>`;
      }).join('');

  /* ── Status filter chips ── */
  const statusChips = ['all','pending','allocated','approved','shipped','received','rejected','cancelled'].map(s => {
    const cnt = s === 'all' ? all.length : all.filter(o=>o.status===s).length;
    const active = OM.statusFilter === s;
    return `<button onclick="omFilterStatus('${s}')"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap
             ${active ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'}">
      ${s === 'all' ? (isJa?'すべて':'All') : t(s)}
      <span class="${active?'bg-white/25':'bg-gray-100'} text-[10px] font-bold px-1.5 py-0.5 rounded-full">${cnt}</span>
    </button>`;
  }).join('');

  /* ── Facility filter options ── */
  const facOpts = [
    `<option value="all" ${OM.facFilter==='all'?'selected':''}>${t('allFacilities')}</option>`,
    ...MockData.facilities.map(f =>
      `<option value="${f.id}" ${OM.facFilter===f.id?'selected':''}>${escHtml(isJa?f.name:f.nameEn)}</option>`)
  ].join('');

  /* ── Pagination ── */
  const paginHTML = pages <= 1 ? '' : (() => {
    const maxVisible = 7;
    let btns = '';
    for (let i = 1; i <= Math.min(pages, maxVisible); i++)
      btns += `<button onclick="omGoPage(${i})" class="w-8 h-8 rounded-lg text-xs font-semibold transition-all ${i===OM.page?'bg-green-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}">${i}</button>`;
    if (pages > maxVisible) btns += `<span class="px-1 text-gray-400 text-xs self-center">…${pages}</span>`;
    return `<div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-400">${t('showingOf')} ${(OM.page-1)*OM.perPage+1}–${Math.min(OM.page*OM.perPage,total)} ${t('of')} ${total} ${t('results')}</p>
      <div class="flex gap-1">
        <button onclick="omGoPage(${OM.page-1})" ${OM.page===1?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        ${btns}
        <button onclick="omGoPage(${OM.page+1})" ${OM.page===pages?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>`;
  })();

  /* ── Detail Drawer ── */
  const detailOrder = OM.detailId ? MockData.orders.find(o => o.id === OM.detailId) : null;
  const drawerHTML = detailOrder ? (() => {
    const o  = detailOrder;
    const facObj  = MockData.facilities.find(f => f.id === o.facility);
    const facName = isJa ? (facObj?.name ?? o.facility) : (facObj?.nameEn ?? o.facility);
    const timeline = omStatusTimeline(o);

    /* Status timeline visual */
    const timelineHTML = timeline.map((step, i) => {
      const label = t(step.s);
      return `
        <div class="flex items-center ${i < timeline.length - 1 ? 'flex-1' : ''}">
          <div class="flex flex-col items-center">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
              ${step.current ? 'bg-green-600 text-white ring-4 ring-green-100' : step.done ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-400'}">
              ${step.done ? (step.current ? icon('M5 13l4 4L19 7','w-3.5 h-3.5') : icon('M5 13l4 4L19 7','w-3 h-3')) : (i+1)}
            </div>
            <span class="text-[9px] mt-1 font-semibold whitespace-nowrap ${step.current?'text-green-700':step.done?'text-gray-600':'text-gray-400'}">${label}</span>
          </div>
          ${i < timeline.length - 1 ? `<div class="flex-1 h-0.5 mx-1 mb-4 ${step.done ? 'bg-green-300' : 'bg-gray-200'}"></div>` : ''}
        </div>`;
    }).join('');

    /* Order items table */
    const itemsHTML = o.items.map(item => {
      const ing = MockData.ingredients.find(i => i.id === item.id);
      const ingName = isJa ? (ing?.name ?? item.id) : (ing?.nameEn ?? ing?.name ?? item.id);
      return `
        <div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
          <img src="${ing?.photo ?? 'https://picsum.photos/seed/food/40/40'}" alt="${escHtml(ingName)}"
            class="w-9 h-9 rounded-xl object-cover bg-gray-100 shrink-0"
            onerror="this.src='https://picsum.photos/seed/food/40/40'"/>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-gray-800 truncate">${escHtml(ingName)}</div>
            <div class="text-[10px] text-gray-400 font-mono">${escHtml(item.id)}</div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-sm font-extrabold text-gray-900">${item.qty}</div>
            <div class="text-[10px] text-gray-400">${isJa?'パック':'packs'}</div>
          </div>
        </div>`;
    }).join('');

    return `
    <div id="om-drawer" class="fixed inset-0 z-50 flex">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="omCloseDetail()"></div>
      <div class="relative ml-auto bg-white w-full max-w-sm shadow-2xl flex flex-col overflow-hidden" style="animation:slideIn .25s ease">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 class="text-sm font-bold text-gray-900">${t('orderDetail')}</h3>
            <p class="text-[10px] text-gray-400 font-mono mt-0.5">${escHtml(o.id)}</p>
          </div>
          <button onclick="omCloseDetail()" class="btn-icon">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto">
          <div class="h-1.5 ${o.status==='received'?'bg-green-500':o.status==='rejected'||o.status==='cancelled'?'bg-red-400':'bg-gradient-to-r from-blue-400 to-blue-600'}"></div>
          <div class="p-5 space-y-5">

            <!-- Status badge + timeline -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <span class="${statusBadge(o.status)} text-xs">${t(o.status)}</span>
                ${o.status==='pending'?`<button onclick="omCloseDetail();router.navigate('allocation')" class="btn-sm text-xs text-amber-600 border-amber-200 hover:bg-amber-50">${t('goToAllocation')}</button>`:''}
                ${o.status==='approved'?`<button onclick="omMarkShipped('${o.id}')" class="btn-sm text-xs text-teal-600 border-teal-200 hover:bg-teal-50">${t('markAsShipped')}</button>`:''}
              </div>
              <!-- Mini timeline -->
              <div class="flex items-start overflow-x-auto pb-1">${timelineHTML}</div>
            </div>

            <!-- Info cards -->
            <div class="grid grid-cols-2 gap-2.5">
              ${[
                { l:t('facilityName2'), v:escHtml(facName) },
                { l:t('totalPacksLabel'), v:`<span class="font-extrabold text-gray-900">${o.packs}</span> ${isJa?'パック':'packs'}` },
                { l:t('orderDateLabel'),    v:formatDate(o.orderDate) },
                { l:t('deliveryDateLabel'), v:`<span class="${o.deliveryDate<=today&&!['received','cancelled'].includes(o.status)?'text-red-600 font-semibold':''}">${formatDate(o.deliveryDate)}</span>` },
              ].map(row=>`
                <div class="bg-gray-50 rounded-xl p-3">
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">${row.l}</div>
                  <div class="text-xs text-gray-800">${row.v}</div>
                </div>`).join('')}
            </div>

            <!-- Notes -->
            ${o.notes ? `
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div class="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">${t('notesLabel')}</div>
              <p class="text-xs text-amber-800">${escHtml(o.notes)}</p>
            </div>` : ''}

            <!-- Items -->
            <div>
              <h4 class="text-xs font-bold text-gray-800 mb-2">${t('orderItems')} <span class="badge badge-gray ml-1">${o.items.length}</span></h4>
              <div class="bg-gray-50 rounded-xl px-3 py-1">${itemsHTML}</div>
            </div>

          </div>
        </div>
      </div>
    </div>`;
  })() : '';

  /* ── Assemble page ── */
  const content = `
  ${drawerHTML}
  <div class="p-5 lg:p-7 space-y-5 max-w-[1600px]">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('orderManagementTitle')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${t('orderManagementSub')}</p>
      </div>
      <div class="flex items-center gap-2 self-start flex-wrap">
        <button onclick="omExportCSV()" class="btn-ghost text-sm py-2 px-4">
          ${icon('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4','w-4 h-4')} ${t('exportOrders')}
        </button>
        <button onclick="router.navigate('allocation')" class="btn-ghost text-sm py-2 px-4">
          ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-4 h-4')} ${t('goToAllocation')}
        </button>
        <button onclick="router.navigate('shipping')" class="btn-primary text-sm py-2 px-4">
          ${icon('M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4','w-4 h-4')} ${t('goToShipping')}
        </button>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">${kpiHTML}</div>

    <!-- Status filter chips (scrollable row) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      ${statusChips}
    </div>

    <!-- Search + filters bar -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
      <!-- Search -->
      <div class="relative flex-1 min-w-[200px]">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          ${icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0','w-4 h-4')}
        </span>
        <input id="om-search-input" type="text" value="${escHtml(OM.search)}" oninput="omSearch(this.value)"
          placeholder="${t('searchOrders')}"
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"/>
      </div>
      <!-- Facility filter -->
      <select onchange="omFilterFacility(this.value)"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all min-w-[160px]">
        ${facOpts}
      </select>
      <!-- Date range -->
      <div class="flex items-center gap-2 shrink-0">
        <input type="date" value="${OM.dateFrom}" onchange="omFilterDateFrom(this.value)"
          class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
          title="${t('dateFrom')}"/>
        <span class="text-gray-400 text-xs">〜</span>
        <input type="date" value="${OM.dateTo}" onchange="omFilterDateTo(this.value)"
          class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
          title="${t('dateTo')}"/>
      </div>
      <!-- Reset -->
      <button onclick="omResetFilters()" class="btn-ghost shrink-0">
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
              ${th('id',           t('orderId'))}
              ${th('facility',     t('facilityName2'))}
              <th class="text-center">${t('items')}</th>
              <th class="text-center">${t('totalPacks')}</th>
              ${th('orderDate',    t('orderDateLabel'))}
              ${th('deliveryDate', t('deliveryDateLabel'))}
              ${th('status',       t('status'))}
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
      ${paginHTML ? `<div class="px-4 pb-4">${paginHTML}</div>` : ''}
    </div>

  </div>`;

  return renderAppShell(content, 'orders');
});

/* ── Order Management handlers ──────────────────────────────── */
function omSearch(v)           { OM.search = v; OM.page = 1; router.renderCurrent(); }
function omFilterStatus(v)     { OM.statusFilter = v; OM.page = 1; router.renderCurrent(); }
function omFilterFacility(v)   { OM.facFilter = v; OM.page = 1; router.renderCurrent(); }
function omFilterDateFrom(v)   { OM.dateFrom = v; OM.page = 1; router.renderCurrent(); }
function omFilterDateTo(v)     { OM.dateTo = v; OM.page = 1; router.renderCurrent(); }
function omResetFilters()      { OM.search=''; OM.statusFilter='all'; OM.facFilter='all'; OM.dateFrom=''; OM.dateTo=''; OM.page=1; router.renderCurrent(); }
function omGoPage(p)           { OM.page = p; router.renderCurrent(); }
function omSort(key)           {
  if (OM.sortKey === key) OM.sortDir = OM.sortDir === 'asc' ? 'desc' : 'asc';
  else { OM.sortKey = key; OM.sortDir = 'desc'; }
  router.renderCurrent();
}
function omOpenDetail(id)      { OM.detailId = id; router.renderCurrent(); }
function omCloseDetail()       { OM.detailId = null; router.renderCurrent(); }

window.omSearch=omSearch; window.omFilterStatus=omFilterStatus;
window.omFilterFacility=omFilterFacility; window.omFilterDateFrom=omFilterDateFrom;
window.omFilterDateTo=omFilterDateTo; window.omResetFilters=omResetFilters;
window.omGoPage=omGoPage; window.omSort=omSort;
window.omOpenDetail=omOpenDetail; window.omCloseDetail=omCloseDetail;

/** Mark an approved order as shipped */
function omMarkShipped(orderId) {
  const o = MockData.orders.find(o => o.id === orderId);
  if (!o) return;
  o.status = 'shipped';
  /* Add shipment notification */
  MockData.notifications.unshift({
    id:       'N_S_' + orderId,
    type:     'shipment',
    titleJa:  '出荷作成',
    titleEn:  'Shipment Created',
    msgJa:    `注文 ${orderId} の出荷リストが作成されました。`,
    msgEn:    `Shipping list for ${orderId} has been created.`,
    read:     false,
    createdAt: new Date().toISOString(),
  });
  const isJa = AppState.lang === 'ja';
  Toast.show(isJa ? `${orderId} を発送済みにしました` : `${orderId} marked as shipped`, 'success');
  router.renderCurrent();
}
window.omMarkShipped = omMarkShipped;

/** Export orders to CSV */
function omExportCSV() {
  const isJa = AppState.lang === 'ja';
  const header = ['Order ID','Facility','Items','Total Packs','Order Date','Delivery Date','Status','Notes'].join(',');
  const rows = MockData.orders.map(o => {
    const facName = isJa
      ? (MockData.facilities.find(f=>f.id===o.facility)?.name ?? o.facility)
      : (MockData.facilities.find(f=>f.id===o.facility)?.nameEn ?? o.facility);
    return [o.id, `"${facName}"`, o.items.length, o.packs, o.orderDate, o.deliveryDate, o.status, `"${o.notes}"`].join(',');
  }).join('\n');
  const csv  = '\uFEFF' + header + '\n' + rows;
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `mottainai_orders_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  Toast.show(t('exportedSuccess'), 'success');
}
window.omExportCSV = omExportCSV;
