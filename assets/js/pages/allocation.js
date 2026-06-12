/* ================================================================
   ALLOCATION PROCESSING PAGE — Auto/Manual allocation engine
   Role   : Watami Staff
   Depends: AppState, t, icon, escHtml, statusBadge, formatDate,
            router, MockData, Toast, renderAppShell
   ================================================================ */

/* ── i18n extensions ─────────────────────────────────────────── */
Object.assign(translations.ja, {
  allocationTitle:        '引当処理',
  allocationSubtitle:     '保留中の注文に対して食材を自動または手動で引き当てます',
  pendingOrdersPanel:     '保留中注文',
  availableInventory:     '利用可能在庫',
  allocationResults:      '引当結果',
  autoAllocate:           '自動引当',
  autoAllocateAll:        'すべて自動引当',
  manualOverride:         '手動上書き',
  approveOrder:           '注文を承認',
  rejectOrder:            '注文を却下',
  approveSelected:        '選択した注文を承認',
  rejectSelected:         '選択した注文を却下',
  allocatedSuccess:       '件の注文を引き当てました',
  approvedSuccess:        '件の注文を承認しました',
  rejectedSuccess:        '件の注文を却下しました',
  allocationComplete:     '引当完了',
  allocationFailed:       '在庫不足のため一部引当できません',
  selectAll:              'すべて選択',
  deselectAll:            '選択解除',
  selectedCount:          '件選択中',
  requestedPacks:         '要求パック数',
  allocatablePacks:       '引当可能パック数',
  inventoryShortage:      '在庫不足',
  fullyAllocatable:       '完全引当可能',
  partiallyAllocatable:   '部分引当',
  cannotAllocate:         '引当不可',
  allocStatus:            '引当状況',
  runningAutoAlloc:       '自動引当処理中…',
  orderApprovedMsg:       '注文が承認されました',
  orderRejectedMsg:       '注文が却下されました',
  rejectReason:           '却下理由',
  rejectReasonPlaceholder:'例: 在庫不足、期限切れ食材など',
  confirmReject:          '却下を確認',
  inventorySnapshot:      '在庫スナップショット',
  topRequestedItems:      '最多リクエスト食材',
  allocationSummary:      '引当サマリー',
  totalPendingPacks:      '保留中総パック数',
  totalAvailablePacks:    '利用可能総パック数',
  coverageRate:           'カバー率',
  noPendingOrders:        '保留中の注文はありません',
  facilityName2:          '施設',
  deliveryDate:           '納品希望日',
  rejectNote:             '却下メモ',
});
Object.assign(translations.en, {
  allocationTitle:        'Allocation Processing',
  allocationSubtitle:     'Auto or manually allocate inventory to pending orders',
  pendingOrdersPanel:     'Pending Orders',
  availableInventory:     'Available Inventory',
  allocationResults:      'Allocation Results',
  autoAllocate:           'Auto Allocate',
  autoAllocateAll:        'Auto Allocate All',
  manualOverride:         'Manual Override',
  approveOrder:           'Approve',
  rejectOrder:            'Reject',
  approveSelected:        'Approve Selected',
  rejectSelected:         'Reject Selected',
  allocatedSuccess:       'orders allocated',
  approvedSuccess:        'orders approved',
  rejectedSuccess:        'orders rejected',
  allocationComplete:     'Allocation Complete',
  allocationFailed:       'Some orders cannot be allocated due to insufficient stock',
  selectAll:              'Select All',
  deselectAll:            'Deselect All',
  selectedCount:          'selected',
  requestedPacks:         'Requested',
  allocatablePacks:       'Allocatable',
  inventoryShortage:      'Shortage',
  fullyAllocatable:       'Fully Allocatable',
  partiallyAllocatable:   'Partial',
  cannotAllocate:         'Cannot Allocate',
  allocStatus:            'Alloc Status',
  runningAutoAlloc:       'Running auto-allocation…',
  orderApprovedMsg:       'Order approved',
  orderRejectedMsg:       'Order rejected',
  rejectReason:           'Rejection Reason',
  rejectReasonPlaceholder:'e.g. Insufficient stock, expired ingredients, etc.',
  confirmReject:          'Confirm Rejection',
  inventorySnapshot:      'Inventory Snapshot',
  topRequestedItems:      'Most Requested Items',
  allocationSummary:      'Allocation Summary',
  totalPendingPacks:      'Total Pending Packs',
  totalAvailablePacks:    'Available Packs',
  coverageRate:           'Coverage Rate',
  noPendingOrders:        'No pending orders',
  facilityName2:          'Facility',
  deliveryDate:           'Delivery Date',
  rejectNote:             'Reject Note',
});

/* ── Allocation State ────────────────────────────────────────── */
const AL = {
  selected:     new Set(),   // Set of order IDs selected
  allocMap:     {},          // orderId → { status, items:[{ingId,req,alloc}] }
  processing:   false,
  rejectModal:  null,        // orderId being rejected, or null
  rejectReason: '',
};

/* ── Compute allocatability of a single order ─────────────────── */
function alComputeOrder(order) {
  let canFull = true;
  const items = order.items.map(item => {
    const ing = MockData.ingredients.find(i => i.id === item.id);
    const avail = ing?.packs ?? 0;
    const req   = item.qty;
    const alloc = Math.min(avail, req);
    if (alloc < req) canFull = false;
    return { ingId:item.id, ingName:AppState.lang==='ja'?(ing?.name??item.id):(ing?.nameEn??ing?.name??item.id), req, avail, alloc, short: req - alloc };
  });
  const status = items.every(i => i.alloc >= i.req)
    ? 'full'
    : items.some(i => i.alloc > 0)
    ? 'partial'
    : 'none';
  return { status, items };
}

/* ── Run auto-allocation (deducts from inventory) ──────────────── */
function alRunAuto(orderIds) {
  let count = 0;
  orderIds.forEach(oid => {
    const order = MockData.orders.find(o => o.id === oid);
    if (!order || order.status !== 'pending') return;
    const result = alComputeOrder(order);
    if (result.status === 'full' || result.status === 'partial') {
      /* Deduct allocated quantities */
      result.items.forEach(item => {
        const ing = MockData.ingredients.find(i => i.id === item.ingId);
        if (ing) {
          ing.packs = Math.max(0, ing.packs - item.alloc);
          if (ing.packs === 0) ing.status = 'expired';
          else if (ing.packs <= 5) ing.status = 'low_stock';
        }
      });
      order.status = 'allocated';
      AL.allocMap[oid] = result;
      count++;
    }
  });
  return count;
}

router.register('allocation', () => {
  const isJa  = AppState.lang === 'ja';
  const pendingOrders = MockData.orders.filter(o => o.status === 'pending');
  const allocatedOrders = MockData.orders.filter(o => o.status === 'allocated');

  /* ── Pre-compute allocatability for each pending order ── */
  const orderAnalysis = pendingOrders.map(o => ({
    order: o,
    analysis: alComputeOrder(o),
  }));

  /* ── Summary stats ── */
  const totalPendingPacks   = pendingOrders.reduce((s,o) => s + o.packs, 0);
  const totalAvailablePacks = MockData.ingredients
    .filter(i => i.status !== 'expired')
    .reduce((s, i) => s + i.packs, 0);
  const fullCount    = orderAnalysis.filter(a => a.analysis.status === 'full').length;
  const partialCount = orderAnalysis.filter(a => a.analysis.status === 'partial').length;
  const noneCount    = orderAnalysis.filter(a => a.analysis.status === 'none').length;
  const coveragePct  = totalPendingPacks > 0
    ? Math.min(100, Math.round((totalAvailablePacks / totalPendingPacks) * 100))
    : 100;

  /* ── Most requested ingredients ── */
  const ingDemand = {};
  pendingOrders.forEach(o => o.items.forEach(item => {
    ingDemand[item.id] = (ingDemand[item.id] ?? 0) + item.qty;
  }));
  const topRequested = Object.entries(ingDemand)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 5)
    .map(([id, qty]) => {
      const ing = MockData.ingredients.find(i => i.id === id);
      return { id, qty, ing, avail: ing?.packs ?? 0,
               name: isJa ? (ing?.name ?? id) : (ing?.nameEn ?? ing?.name ?? id) };
    });

  /* ── Alloc status badge ── */
  const allocBadge = (status) => {
    if (status === 'full')    return `<span class="badge badge-green">${t('fullyAllocatable')}</span>`;
    if (status === 'partial') return `<span class="badge badge-amber">${t('partiallyAllocatable')}</span>`;
    return `<span class="badge badge-red">${t('cannotAllocate')}</span>`;
  };

  /* ── Pending orders list ── */
  const pendingRowsHTML = pendingOrders.length === 0
    ? `<div class="flex flex-col items-center justify-center py-12 text-gray-400">
         ${icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z','w-10 h-10 opacity-30 mb-2')}
         <p class="text-sm">${t('noPendingOrders')}</p>
       </div>`
    : orderAnalysis.map(({ order: o, analysis: an }) => {
        const facName  = isJa
          ? (MockData.facilities.find(f=>f.id===o.facility)?.name ?? o.facility)
          : (MockData.facilities.find(f=>f.id===o.facility)?.nameEn ?? o.facility);
        const isSelected = AL.selected.has(o.id);
        const isAllocated = AL.allocMap[o.id]?.status;

        return `
        <div class="border border-gray-100 rounded-xl mb-2 overflow-hidden ${isSelected ? 'ring-2 ring-green-500 border-green-200' : ''}">
          <!-- Order header -->
          <div class="flex items-center gap-3 px-4 py-3 bg-white">
            <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer shrink-0"
              ${isSelected ? 'checked' : ''}
              onchange="alToggleSelect('${o.id}', this.checked)"/>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-gray-900 font-mono">${escHtml(o.id)}</span>
                <span class="${statusBadge(o.status)}">${t(o.status)}</span>
                ${allocBadge(an.status)}
              </div>
              <div class="text-[11px] text-gray-500 mt-0.5 truncate">
                ${escHtml(facName)} · ${o.packs} ${isJa?'パック':'packs'} · ${isJa?'納品':'Delivery'}: ${formatDate(o.deliveryDate)}
              </div>
            </div>
            <!-- Action buttons -->
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="alAutoOne('${o.id}')" class="btn-sm text-xs text-blue-600 border-blue-200 hover:bg-blue-50 ${an.status==='none'?'opacity-40 pointer-events-none':''}">
                ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-3.5 h-3.5')} ${t('autoAllocate')}
              </button>
              <button onclick="alApprove('${o.id}')" class="btn-sm text-xs text-green-600 border-green-200 hover:bg-green-50">
                ${icon('M5 13l4 4L19 7','w-3.5 h-3.5')} ${t('approveOrder')}
              </button>
              <button onclick="alOpenReject('${o.id}')" class="btn-sm text-xs text-red-600 border-red-200 hover:bg-red-50">
                ${icon('M6 18L18 6M6 6l12 12','w-3.5 h-3.5')} ${t('rejectOrder')}
              </button>
            </div>
          </div>
          <!-- Items breakdown (collapsed, expand on hover/click) -->
          <div class="bg-gray-50/70 border-t border-gray-100 px-4 py-2">
            <div class="flex flex-wrap gap-2">
              ${an.items.map(item => `
                <div class="flex items-center gap-1.5 text-[10px] bg-white border rounded-lg px-2 py-1 ${item.short > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'}">
                  <span class="font-semibold ${item.short>0?'text-red-700':'text-gray-700'}">${escHtml(item.ingName)}</span>
                  <span class="text-gray-400">×${item.req}</span>
                  ${item.short > 0 ? `<span class="text-red-500 font-bold">(-${item.short})</span>` : `<span class="text-green-500">✓</span>`}
                </div>`).join('')}
            </div>
          </div>
        </div>`;
      }).join('');

  /* ── Recently allocated orders ── */
  const recentAllocHTML = allocatedOrders.length === 0
    ? `<p class="text-xs text-gray-400 py-4 text-center">${isJa?'引当済みの注文はありません':'No allocated orders yet'}</p>`
    : allocatedOrders.slice(0, 5).map(o => {
        const facName = isJa
          ? (MockData.facilities.find(f=>f.id===o.facility)?.name ?? o.facility)
          : (MockData.facilities.find(f=>f.id===o.facility)?.nameEn ?? o.facility);
        return `
        <div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
          <div class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            ${icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z','w-3.5 h-3.5 text-blue-600')}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-gray-800 font-mono truncate">${escHtml(o.id)}</div>
            <div class="text-[10px] text-gray-400 truncate">${escHtml(facName)}</div>
          </div>
          <span class="badge badge-blue shrink-0">${t('allocated')}</span>
        </div>`;
      }).join('');

  /* ── Top requested ingredients ── */
  const topReqHTML = topRequested.map(item => {
    const pct = item.avail >= item.qty ? 100 : Math.round(item.avail / item.qty * 100);
    const barColor = pct >= 100 ? 'bg-green-500' : pct > 0 ? 'bg-amber-400' : 'bg-red-500';
    return `
      <div class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-gray-800 truncate">${escHtml(item.name)}</div>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="${barColor} h-full rounded-full" style="width:${Math.min(100,pct)}%"></div>
            </div>
            <span class="text-[10px] text-gray-500 shrink-0">${item.avail}/${item.qty}</span>
          </div>
        </div>
        <span class="text-[10px] font-bold ${item.avail>=item.qty?'text-green-600':item.avail>0?'text-amber-600':'text-red-600'} shrink-0">
          ${item.avail>=item.qty?'✓':item.avail>0?`-${item.qty-item.avail}`:'✗'}
        </span>
      </div>`;
  }).join('');

  /* ── Reject Modal ── */
  const rejectModalHTML = AL.rejectModal ? `
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="alCloseReject()"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 class="text-base font-bold text-gray-900">${t('rejectOrder')}</h3>
          <p class="text-xs text-gray-500 mt-0.5 font-mono">${escHtml(AL.rejectModal)}</p>
        </div>
        <button onclick="alCloseReject()" class="btn-icon">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="px-6 py-5">
        <div class="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4 flex items-start gap-2.5">
          ${icon('M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z','w-5 h-5 text-red-500 shrink-0 mt-0.5')}
          <p class="text-xs text-red-700">${isJa?'この操作は取り消せません。本当に却下しますか？':'This action cannot be undone. Are you sure you want to reject?'}</p>
        </div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('rejectReason')}</label>
        <textarea id="al-reject-reason" rows="3" oninput="AL.rejectReason=this.value"
          class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 focus:bg-white transition-all resize-none"
          placeholder="${t('rejectReasonPlaceholder')}">${escHtml(AL.rejectReason)}</textarea>
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
        <button onclick="alCloseReject()" class="btn-ghost">${t('cancel')}</button>
        <button onclick="alConfirmReject()" class="btn-primary bg-red-500 hover:bg-red-600 px-5 py-2 text-sm" style="background:#ef4444;box-shadow:0 2px 8px rgba(239,68,68,.3)">
          ${icon('M6 18L18 6M6 6l12 12','w-4 h-4')} ${t('confirmReject')}
        </button>
      </div>
    </div>
  </div>` : '';

  /* ── Assemble page ── */
  const content = `
  ${rejectModalHTML}
  <div class="p-5 lg:p-7 space-y-5 max-w-[1600px]">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('allocationTitle')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${t('allocationSubtitle')}</p>
      </div>
      <!-- Bulk action buttons -->
      <div class="flex items-center gap-2 self-start flex-wrap">
        ${AL.selected.size > 0 ? `
          <span class="text-xs font-semibold text-gray-600 bg-gray-100 rounded-full px-3 py-1.5">
            ${AL.selected.size} ${t('selectedCount')}
          </span>
          <button onclick="alAutoSelected()" class="btn-primary text-sm py-2 px-4">
            ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-4 h-4')} ${t('autoAllocate')}
          </button>
          <button onclick="alApproveSelected()" class="btn-sm text-green-600 border-green-200 hover:bg-green-50">
            ${icon('M5 13l4 4L19 7','w-3.5 h-3.5')} ${t('approveSelected')}
          </button>
          <button onclick="alDeselectAll()" class="btn-ghost text-sm py-1.5 px-3">
            ${t('deselectAll')}
          </button>
        ` : pendingOrders.length > 0 ? `
          <button onclick="alSelectAll()" class="btn-ghost text-sm py-2 px-4">
            ${icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z','w-4 h-4')} ${t('selectAll')}
          </button>
          <button onclick="alAutoAll()" class="btn-primary text-sm py-2 px-4">
            ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-4 h-4')} ${t('autoAllocateAll')}
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Summary strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      ${[
        { label:t('pendingOrders'),        val:pendingOrders.length,    bg:'bg-amber-50', ic:'text-amber-600', icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label:t('fullyAllocatable'),     val:fullCount,               bg:'bg-green-50', ic:'text-green-600', icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label:t('partiallyAllocatable'), val:partialCount,            bg:'bg-orange-50',ic:'text-orange-600',icon:'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label:t('cannotAllocate'),       val:noneCount,               bg:'bg-red-50',   ic:'text-red-600',   icon:'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
      ].map(k => `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
          <div class="w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center shrink-0">${icon(k.icon,`w-[18px] h-[18px] ${k.ic}`)}</div>
          <div><div class="text-xl font-extrabold text-gray-900">${k.val}</div><div class="text-xs text-gray-500 mt-0.5">${k.label}</div></div>
        </div>`).join('')}
    </div>

    <!-- Main 2-col layout -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- ── PENDING ORDERS (left 2/3) ── -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h3 class="text-sm font-bold text-gray-800">${t('pendingOrdersPanel')} <span class="ml-1 badge badge-amber">${pendingOrders.length}</span></h3>
            ${pendingOrders.length > 0 ? `
            <label class="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
                ${AL.selected.size === pendingOrders.length && pendingOrders.length > 0 ? 'checked' : ''}
                onchange="alToggleSelectAll(this.checked)"/>
              ${t('selectAll')}
            </label>` : ''}
          </div>
          <div class="p-4 space-y-0">
            ${pendingRowsHTML}
          </div>
        </div>
      </div>

      <!-- ── RIGHT SIDEBAR ── -->
      <div class="space-y-5">

        <!-- Allocation Summary -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-bold text-gray-800 mb-3">${t('allocationSummary')}</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">${t('totalPendingPacks')}</span>
              <span class="font-bold text-gray-900">${totalPendingPacks}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">${t('totalAvailablePacks')}</span>
              <span class="font-bold text-gray-900">${totalAvailablePacks}</span>
            </div>
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-gray-500">${t('coverageRate')}</span>
                <span class="font-bold ${coveragePct >= 100 ? 'text-green-600' : coveragePct >= 70 ? 'text-amber-600' : 'text-red-600'}">${coveragePct}%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="${coveragePct >= 100 ? 'bg-green-500' : coveragePct >= 70 ? 'bg-amber-400' : 'bg-red-500'} h-full rounded-full transition-all" style="width:${Math.min(100, coveragePct)}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Requested Items -->
        ${topRequested.length > 0 ? `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-bold text-gray-800 mb-3">${t('topRequestedItems')}</h3>
          <div>${topReqHTML}</div>
        </div>` : ''}

        <!-- Recently Allocated -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-gray-800">${t('allocationResults')} <span class="badge badge-blue ml-1">${allocatedOrders.length}</span></h3>
            ${allocatedOrders.length > 0 ? `<button onclick="router.navigate('orders')" class="btn-sm text-xs text-green-600 border-green-200 hover:bg-green-50">${t('viewAll')}</button>` : ''}
          </div>
          ${recentAllocHTML}
        </div>

      </div><!-- /right sidebar -->
    </div><!-- /grid -->
  </div>`;

  return renderAppShell(content, 'allocation');
});

/* ── Allocation handlers ──────────────────────────────────────── */

function alToggleSelect(orderId, checked) {
  if (checked) AL.selected.add(orderId);
  else AL.selected.delete(orderId);
  router.renderCurrent();
}
function alToggleSelectAll(checked) {
  const pending = MockData.orders.filter(o => o.status === 'pending');
  if (checked) pending.forEach(o => AL.selected.add(o.id));
  else AL.selected.clear();
  router.renderCurrent();
}
function alSelectAll() {
  MockData.orders.filter(o => o.status === 'pending').forEach(o => AL.selected.add(o.id));
  router.renderCurrent();
}
function alDeselectAll() { AL.selected.clear(); router.renderCurrent(); }

window.alToggleSelect=alToggleSelect; window.alToggleSelectAll=alToggleSelectAll;
window.alSelectAll=alSelectAll; window.alDeselectAll=alDeselectAll;

/** Auto-allocate a single order */
function alAutoOne(orderId) {
  const count = alRunAuto([orderId]);
  AL.selected.delete(orderId);
  const isJa = AppState.lang === 'ja';
  Toast.show(count > 0
    ? (isJa ? `${orderId} を引き当てました` : `${orderId} allocated`)
    : (isJa ? '在庫不足のため引当できません' : 'Cannot allocate: insufficient stock'),
    count > 0 ? 'success' : 'error');
  router.renderCurrent();
}
window.alAutoOne = alAutoOne;

/** Auto-allocate selected orders */
function alAutoSelected() {
  const ids   = [...AL.selected];
  const count = alRunAuto(ids);
  AL.selected.clear();
  const isJa = AppState.lang === 'ja';
  Toast.show(`${count} ${isJa ? t('allocatedSuccess') : t('allocatedSuccess')}`, count > 0 ? 'success' : 'warning');
  router.renderCurrent();
}
window.alAutoSelected = alAutoSelected;

/** Auto-allocate ALL pending orders */
function alAutoAll() {
  const ids   = MockData.orders.filter(o => o.status === 'pending').map(o => o.id);
  const count = alRunAuto(ids);
  AL.selected.clear();
  const isJa = AppState.lang === 'ja';
  Toast.show(`${count} ${isJa ? t('allocatedSuccess') : t('allocatedSuccess')}`, 'success', 3500);
  router.renderCurrent();
}
window.alAutoAll = alAutoAll;

/** Approve a single order (pending or allocated → approved) */
function alApprove(orderId) {
  const order = MockData.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = 'approved';
  AL.selected.delete(orderId);
  /* Add notification */
  MockData.notifications.unshift({
    id:       'N_A_' + orderId,
    type:     'order_approved',
    titleJa:  '注文承認',
    titleEn:  'Order Approved',
    msgJa:    `注文 ${orderId} が承認されました。`,
    msgEn:    `Order ${orderId} has been approved.`,
    read:     false,
    createdAt: new Date().toISOString(),
  });
  Toast.show(`${t('orderApprovedMsg')}: ${orderId}`, 'success');
  router.renderCurrent();
}
window.alApprove = alApprove;

/** Approve all selected orders */
function alApproveSelected() {
  const ids = [...AL.selected];
  ids.forEach(id => {
    const o = MockData.orders.find(o => o.id === id);
    if (o) o.status = 'approved';
  });
  const count = ids.length;
  AL.selected.clear();
  Toast.show(`${count} ${t('approvedSuccess')}`, 'success');
  router.renderCurrent();
}
window.alApproveSelected = alApproveSelected;

/** Open reject modal */
function alOpenReject(orderId) {
  AL.rejectModal   = orderId;
  AL.rejectReason  = '';
  router.renderCurrent();
  setTimeout(() => document.getElementById('al-reject-reason')?.focus(), 80);
}
window.alOpenReject = alOpenReject;

function alCloseReject() {
  AL.rejectModal  = null;
  AL.rejectReason = '';
  router.renderCurrent();
}
window.alCloseReject = alCloseReject;

/** Confirm rejection */
function alConfirmReject() {
  const orderId = AL.rejectModal;
  if (!orderId) return;
  const order = MockData.orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'rejected';
    order.notes  = AL.rejectReason || order.notes;
  }
  /* Add rejection notification */
  MockData.notifications.unshift({
    id:       'N_R_' + orderId,
    type:     'order_rejected',
    titleJa:  '注文却下',
    titleEn:  'Order Rejected',
    msgJa:    `注文 ${orderId} が却下されました。理由: ${AL.rejectReason || '—'}`,
    msgEn:    `Order ${orderId} was rejected. Reason: ${AL.rejectReason || '—'}`,
    read:     false,
    createdAt: new Date().toISOString(),
  });
  AL.selected.delete(orderId);
  AL.rejectModal  = null;
  AL.rejectReason = '';
  Toast.show(`${t('orderRejectedMsg')}: ${orderId}`, 'warning');
  router.renderCurrent();
}
window.alConfirmReject = alConfirmReject;
