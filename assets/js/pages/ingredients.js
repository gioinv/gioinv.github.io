/* Ingredient Management Page (Watami Staff) — depends on all core modules */
// §11b  PAGE: INGREDIENT MANAGEMENT  (Watami Staff)
// ──────────────────────────────────────────────────────────────────
Object.assign(translations.ja,{
  ingCategory:'カテゴリ', ingName:'食材名', packWeight:'パック重量',
  numPacks:'パック数', expiryDate:'賞味期限', allergens:'アレルゲン',
  photo:'写真', notes:'備考', createIngredient:'食材を追加',
  editIngredient:'食材を編集', deleteIngredient:'食材を削除',
  confirmDeleteIng:'この食材を削除しますか？', ingDeleted:'食材を削除しました',
  ingCreated:'食材を追加しました', ingUpdated:'食材を更新しました',
  searchIngredients:'食材を検索…', filterByCategory:'カテゴリで絞り込み',
  filterByIngStatus:'ステータスで絞り込み', allCategories:'すべてのカテゴリ',
  ingDetail:'食材詳細', noAllergens:'アレルゲンなし',
  meat:'肉類', veg:'野菜類', seafood:'魚介類', dairy:'乳製品',
  grains:'穀物類', cond:'調味料', frozen:'冷凍食品', bev:'飲料',
  totalIngredientsCount:'食材合計', availableCount:'利用可能',
  lowStockCount:'在庫わずか', expiringSoonCount:'期限間近',
  expiredCount:'期限切れ', imageUrl:'画像URL', photoUpload:'写真URL',
  photoPlaceholder:'https://picsum.photos/seed/…/300/200',
  bulkImportBtn:'一括インポート',
});
Object.assign(translations.en,{
  ingCategory:'Category', ingName:'Ingredient Name', packWeight:'Pack Weight',
  numPacks:'Packs', expiryDate:'Expiry Date', allergens:'Allergens',
  photo:'Photo', notes:'Notes', createIngredient:'Add Ingredient',
  editIngredient:'Edit Ingredient', deleteIngredient:'Delete',
  confirmDeleteIng:'Delete this ingredient?', ingDeleted:'Ingredient deleted',
  ingCreated:'Ingredient added successfully', ingUpdated:'Ingredient updated',
  searchIngredients:'Search ingredients…', filterByCategory:'Filter by category',
  filterByIngStatus:'Filter by status', allCategories:'All Categories',
  ingDetail:'Ingredient Detail', noAllergens:'No allergens',
  meat:'Meat', veg:'Vegetables', seafood:'Seafood', dairy:'Dairy',
  grains:'Grains', cond:'Condiments', frozen:'Frozen Foods', bev:'Beverages',
  totalIngredientsCount:'Total Ingredients', availableCount:'Available',
  lowStockCount:'Low Stock', expiringSoonCount:'Expiring Soon',
  expiredCount:'Expired', imageUrl:'Image URL', photoUpload:'Photo URL',
  photoPlaceholder:'https://picsum.photos/seed/…/300/200',
  bulkImportBtn:'Bulk Import',
});

/* ── Ingredient Management State ── */
const IG = {
  search:'', catFilter:'all', statusFilter:'all',
  sortKey:'name', sortDir:'asc',
  page:1, perPage:10,
  viewMode:'table',     // 'table' | 'grid'
  modalMode:'create',
  editingId:null,
  detailId:null,        // for detail drawer
};

/* Category label helper */
const catLabel = (cat, isJa) => {
  const map = {
    meat:{ja:'肉類',en:'Meat'}, veg:{ja:'野菜類',en:'Vegetables'},
    seafood:{ja:'魚介類',en:'Seafood'}, dairy:{ja:'乳製品',en:'Dairy'},
    grains:{ja:'穀物類',en:'Grains'}, cond:{ja:'調味料',en:'Condiments'},
    frozen:{ja:'冷凍食品',en:'Frozen Foods'}, bev:{ja:'飲料',en:'Beverages'},
  };
  return isJa ? (map[cat]?.ja??cat) : (map[cat]?.en??cat);
};

/* Cat badge colour */
const catColor = cat => ({
  meat:'badge-red', veg:'badge-green', seafood:'badge-blue',
  dairy:'badge-teal', grains:'badge-amber', cond:'badge-orange',
  frozen:'badge-violet', bev:'badge-gray',
}[cat]??'badge-gray');

router.register('ingredients', () => {
  const isJa = AppState.lang === 'ja';

  /* Filter + sort */
  let list = MockData.ingredients.filter(i => {
    const nm = isJa ? i.name : (i.nameEn??i.name);
    const searchMatch = !IG.search ||
      nm.toLowerCase().includes(IG.search.toLowerCase()) ||
      i.id.toLowerCase().includes(IG.search.toLowerCase());
    const catMatch    = IG.catFilter==='all' || i.cat===IG.catFilter;
    const statMatch   = IG.statusFilter==='all' || i.status===IG.statusFilter;
    return searchMatch && catMatch && statMatch;
  });

  list = [...list].sort((a,b) => {
    const av = (IG.sortKey==='name' ? (isJa?a.name:a.nameEn??a.name) : a[IG.sortKey])??'';
    const bv = (IG.sortKey==='name' ? (isJa?b.name:b.nameEn??b.name) : b[IG.sortKey])??'';
    const cmp = String(av).toLowerCase() < String(bv).toLowerCase() ? -1 : String(av).toLowerCase() > String(bv).toLowerCase() ? 1 : 0;
    return IG.sortDir==='asc' ? cmp : -cmp;
  });

  const total  = list.length;
  const pages  = Math.max(1, Math.ceil(total / IG.perPage));
  IG.page      = Math.min(IG.page, pages);
  const sliced = list.slice((IG.page-1)*IG.perPage, IG.page*IG.perPage);
  const all    = MockData.ingredients;

  /* KPI strip */
  const kpiData = [
    {key:'totalIngredientsCount', val:all.length,                                  bg:'bg-teal-50',   ic:'text-teal-600',   icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'},
    {key:'availableCount',        val:all.filter(i=>i.status==='available').length,    bg:'bg-green-50',  ic:'text-green-600',  icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
    {key:'lowStockCount',         val:all.filter(i=>i.status==='low_stock').length,    bg:'bg-amber-50',  ic:'text-amber-600',  icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'},
    {key:'expiringSoonCount',     val:all.filter(i=>i.status==='expiring_soon').length,bg:'bg-orange-50', ic:'text-orange-600', icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'},
    {key:'expiredCount',          val:all.filter(i=>i.status==='expired').length,      bg:'bg-red-50',    ic:'text-red-600',    icon:'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'},
  ];
  const kpiHTML = kpiData.map(k=>`
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div class="w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center shrink-0">${icon(k.icon,`w-[18px] h-[18px] ${k.ic}`)}</div>
      <div><div class="text-xl font-extrabold text-gray-900">${k.val}</div><div class="text-xs text-gray-500 mt-0.5">${t(k.key)}</div></div>
    </div>`).join('');

  /* Sort helper */
  const sortIcon = key => {
    if(IG.sortKey!==key) return `<svg class="w-3 h-3 opacity-25 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`;
    return IG.sortDir==='asc'
      ? `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`
      : `<svg class="w-3 h-3 text-green-600 ml-0.5 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;
  };
  const th = (key,label) => `<th class="cursor-pointer select-none hover:text-gray-600" onclick="igSort('${key}')">${label}${sortIcon(key)}</th>`;

  /* Category filter options */
  const cats = ['all','meat','veg','seafood','dairy','grains','cond','frozen','bev'];
  const catOpts = cats.map(c=>`<option value="${c}" ${IG.catFilter===c?'selected':''}>${c==='all'?t('allCategories'):catLabel(c,isJa)}</option>`).join('');
  const statOpts2 = ['all','available','low_stock','expiring_soon','expired'].map(s=>`<option value="${s}" ${IG.statusFilter===s?'selected':''}>${s==='all'?t('allStatus'):t(s)}</option>`).join('');

  /* TABLE rows */
  const tableRowsHTML = sliced.length===0
    ? `<tr><td colspan="9" class="text-center py-14 text-gray-400 text-sm">${t('noData')}</td></tr>`
    : sliced.map(i=>{
        const nm = isJa ? i.name : (i.nameEn??i.name);
        const allergenText = i.allergens.length ? i.allergens.join(', ') : `<span class="text-gray-400">${t('noAllergens')}</span>`;
        return `<tr>
          <td>
            <div class="flex items-center gap-3">
              <img src="${i.photo}" alt="${escHtml(nm)}" class="w-10 h-10 rounded-xl object-cover shrink-0 bg-gray-100" loading="lazy" onerror="this.src='https://picsum.photos/seed/food/40/40'"/>
              <div>
                <div class="text-xs font-semibold text-gray-900 max-w-[120px] truncate">${escHtml(nm)}</div>
                <div class="text-[10px] text-gray-400 font-mono">${escHtml(i.id)}</div>
              </div>
            </div>
          </td>
          <td><span class="badge ${catColor(i.cat)}">${catLabel(i.cat,isJa)}</span></td>
          <td class="text-xs text-gray-600">${escHtml(i.packWt)}</td>
          <td>
            <span class="text-sm font-bold ${i.packs<=5?'text-red-600':i.packs<=10?'text-amber-600':'text-gray-800'}">${i.packs}</span>
            <span class="text-xs text-gray-400 ml-0.5">${isJa?'パック':'packs'}</span>
          </td>
          <td class="text-xs ${i.status==='expiring_soon'||i.status==='expired'?'text-red-600 font-semibold':'text-gray-600'}">${formatDate(i.expiry)}</td>
          <td class="text-xs text-gray-600 max-w-[100px] truncate">${allergenText}</td>
          <td><span class="${statusBadge(i.status)}">${t(i.status)}</span></td>
          <td>
            <div class="flex items-center gap-1">
              <button onclick="igOpenDetail('${i.id}')" class="btn-icon" title="${t('viewDetails')}">
                ${icon('M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z','w-4 h-4')}
              </button>
              <button onclick="igOpenEdit('${i.id}')" class="btn-sm text-blue-600 border-blue-200 hover:bg-blue-50">
                ${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z','w-3.5 h-3.5')} ${t('edit')}
              </button>
              <button onclick="igDelete('${i.id}')" class="btn-sm text-red-600 border-red-200 hover:bg-red-50">
                ${icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16','w-3.5 h-3.5')} ${t('delete')}
              </button>
            </div>
          </td>
        </tr>`;
      }).join('');

  /* GRID cards */
  const gridHTML = sliced.length===0
    ? `<div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
         ${icon('M3 3h2l.4 2M7 13h10l4-8H5.4','w-12 h-12 opacity-30 mb-3')}
         <p class="text-sm">${t('noData')}</p>
       </div>`
    : sliced.map(i=>{
        const nm = isJa ? i.name : (i.nameEn??i.name);
        const allergenText = i.allergens.length ? i.allergens.join(', ') : t('noAllergens');
        return `
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div class="relative">
              <img src="${i.photo}" alt="${escHtml(nm)}" class="w-full h-36 object-cover bg-gray-100" loading="lazy" onerror="this.src='https://picsum.photos/seed/food/300/200'"/>
              <div class="absolute top-2.5 left-2.5"><span class="badge ${statusBadge(i.status)}">${t(i.status)}</span></div>
              <div class="absolute top-2.5 right-2.5"><span class="badge ${catColor(i.cat)}">${catLabel(i.cat,isJa)}</span></div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="p-3.5">
              <h4 class="text-sm font-bold text-gray-900 truncate mb-1">${escHtml(nm)}</h4>
              <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-gray-500 mb-3">
                <div>${icon('M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3','w-3 h-3 inline mr-0.5')} ${escHtml(i.packWt)}</div>
                <div>${icon('M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4','w-3 h-3 inline mr-0.5')} <span class="font-semibold ${i.packs<=5?'text-red-600':i.packs<=10?'text-amber-600':'text-gray-700'}">${i.packs}</span> ${isJa?'パック':'packs'}</div>
                <div>${icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z','w-3 h-3 inline mr-0.5')} ${formatDate(i.expiry)}</div>
                <div class="truncate">${icon('M12 9v2m0 4h.01','w-3 h-3 inline mr-0.5')} ${escHtml(allergenText)}</div>
              </div>
              <div class="flex gap-1.5">
                <button onclick="igOpenDetail('${i.id}')" class="flex-1 btn-sm justify-center">${icon('M15 12a3 3 0 11-6 0 3 3 0 016 0z','w-3.5 h-3.5')} ${t('viewDetails')}</button>
                <button onclick="igOpenEdit('${i.id}')" class="btn-icon border-blue-200 text-blue-600 hover:bg-blue-50">${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z','w-3.5 h-3.5')}</button>
                <button onclick="igDelete('${i.id}')" class="btn-icon border-red-200 text-red-600 hover:bg-red-50">${icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16','w-3.5 h-3.5')}</button>
              </div>
            </div>
          </div>`;
      }).join('');

  /* Pagination */
  const paginHTML = pages <= 1 ? '' : (() => {
    let btns = '';
    for(let i=1;i<=pages;i++) btns+=`<button onclick="igGoPage(${i})" class="w-8 h-8 rounded-lg text-xs font-semibold transition-all ${i===IG.page?'bg-green-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}">${i}</button>`;
    return `<div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-400">${t('showingOf')} ${(IG.page-1)*IG.perPage+1}–${Math.min(IG.page*IG.perPage,total)} ${t('of')} ${total} ${t('results')}</p>
      <div class="flex gap-1">
        <button onclick="igGoPage(${IG.page-1})" ${IG.page===1?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
        ${btns}
        <button onclick="igGoPage(${IG.page+1})" ${IG.page===pages?'disabled':''} class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
      </div>
    </div>`;
  })();

  /* ── Create/Edit Modal ── */
  const modalHTML = `
  <div id="ig-modal" style="display:none!important" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="igCloseModal()"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 class="text-base font-bold text-gray-900" id="ig-modal-title">${t('createIngredient')}</h3>
          <p class="text-xs text-gray-500 mt-0.5" id="ig-modal-sub">${isJa?'新しい食材を登録':'Register a new ingredient'}</p>
        </div>
        <button onclick="igCloseModal()" class="btn-icon"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>
      <form id="ig-form" onsubmit="igSubmit(event)" novalidate class="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('ingName')} (JA) <span class="text-red-500">*</span></label>
            <input id="ig-name" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all" placeholder="${isJa?'例: 鶏むね肉':'e.g. 鶏むね肉'}"/>
            <p id="err-ig-name" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('ingName')} (EN) <span class="text-red-500">*</span></label>
            <input id="ig-nameEn" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all" placeholder="e.g. Chicken Breast"/>
            <p id="err-ig-nameEn" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('ingCategory')} <span class="text-red-500">*</span></label>
            <select id="ig-cat" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all">
              ${['meat','veg','seafood','dairy','grains','cond','frozen','bev'].map(c=>`<option value="${c}">${catLabel(c,isJa)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('status')} <span class="text-red-500">*</span></label>
            <select id="ig-status" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all">
              ${['available','low_stock','expiring_soon','expired'].map(s=>`<option value="${s}">${t(s)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('packWeight')} <span class="text-red-500">*</span></label>
            <input id="ig-packwt" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="500g"/>
            <p id="err-ig-packwt" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('numPacks')} <span class="text-red-500">*</span></label>
            <input id="ig-packs" type="number" min="0" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="0"/>
            <p id="err-ig-packs" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('expiryDate')} <span class="text-red-500">*</span></label>
            <input id="ig-expiry" type="date" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all"/>
            <p id="err-ig-expiry" class="hidden mt-1 text-xs text-red-500">${t('fieldRequired')}</p>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('allergens')}</label>
          <input id="ig-allergens" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="${isJa?'例: 小麦, 乳（カンマ区切り）':'e.g. wheat, dairy (comma-separated)'}"/>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('photoUpload')}</label>
          <input id="ig-photo" type="url" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="${t('photoPlaceholder')}"/>
          <p class="text-[10px] text-gray-400 mt-1">${isJa?'Picsumなどの画像URLを入力してください':'Enter an image URL from Picsum or similar'}</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">${t('notes')}</label>
          <textarea id="ig-notes" rows="2" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all resize-none" placeholder="${isJa?'備考・メモ':'Additional notes…'}"></textarea>
        </div>
      </form>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
        <button type="button" onclick="igCloseModal()" class="btn-ghost">${t('cancel')}</button>
        <button type="button" onclick="igSubmit(event)" class="btn-primary px-5 py-2 text-sm">
          ${icon('M5 13l4 4L19 7','w-4 h-4')} <span id="ig-submit-label">${t('save')}</span>
        </button>
      </div>
    </div>
  </div>`;

  /* ── Detail Drawer ── */
  const drawerIngredient = IG.detailId ? MockData.ingredients.find(i=>i.id===IG.detailId) : null;
  const drawerHTML = drawerIngredient ? (() => {
    const di = drawerIngredient;
    const dnm = isJa ? di.name : (di.nameEn??di.name);
    return `
    <div id="ig-drawer" class="fixed inset-0 z-50 flex">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="igCloseDetail()"></div>
      <div class="relative ml-auto bg-white w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-[slideIn_.25s_ease]">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-bold text-gray-900">${t('ingDetail')}</h3>
          <button onclick="igCloseDetail()" class="btn-icon"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <img src="${di.photo}" alt="${escHtml(dnm)}" class="w-full h-48 object-cover bg-gray-100" onerror="this.src='https://picsum.photos/seed/food/400/200'"/>
          <div class="p-5 space-y-4">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <h4 class="text-lg font-extrabold text-gray-900">${escHtml(dnm)}</h4>
                <span class="${statusBadge(di.status)} shrink-0">${t(di.status)}</span>
              </div>
              <div class="text-xs text-gray-400 font-mono">${escHtml(di.id)}</div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              ${[
                {l:t('ingCategory'), v:`<span class="badge ${catColor(di.cat)}">${catLabel(di.cat,isJa)}</span>`},
                {l:t('packWeight'),  v:escHtml(di.packWt)},
                {l:t('numPacks'),    v:`<span class="font-bold ${di.packs<=5?'text-red-600':di.packs<=10?'text-amber-600':'text-gray-900'}">${di.packs}</span>`},
                {l:t('expiryDate'),  v:`<span class="${di.status==='expiring_soon'||di.status==='expired'?'text-red-600 font-semibold':''}">${formatDate(di.expiry)}</span>`},
                {l:t('allergens'),   v: di.allergens.length ? escHtml(di.allergens.join(', ')) : `<span class="text-gray-400">${t('noAllergens')}</span>`},
              ].map(row=>`
                <div class="bg-gray-50 rounded-xl p-3">
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">${row.l}</div>
                  <div class="text-sm text-gray-800">${row.v}</div>
                </div>`).join('')}
            </div>
            <div class="flex gap-2 pt-2">
              <button onclick="igOpenEdit('${di.id}');igCloseDetail()" class="btn-primary flex-1 text-sm py-2.5">
                ${icon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z','w-4 h-4')} ${t('editIngredient')}
              </button>
              <button onclick="igDelete('${di.id}');igCloseDetail()" class="btn-ghost border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5">
                ${icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16','w-4 h-4')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  })() : '';

  /* ── Page content ── */
  const content = `
  ${modalHTML}
  ${drawerHTML}
  <div class="p-5 lg:p-7 space-y-5 max-w-[1600px]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('ingredientManagement')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${isJa?'食材の登録・管理・在庫状況確認':'Register, manage and monitor ingredient inventory'}</p>
      </div>
      <div class="flex items-center gap-2 self-start flex-wrap">
        <button onclick="router.navigate('bulk-import')" class="btn-ghost">
          ${icon('M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12','w-4 h-4')} ${t('bulkImportBtn')}
        </button>
        <button onclick="igOpenCreate()" class="btn-primary">
          ${icon('M12 4v16m8-8H4','w-4 h-4')} ${t('createIngredient')}
        </button>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">${kpiHTML}</div>

    <!-- Filters row -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">${icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0','w-4 h-4')}</span>
        <input id="ig-search-input" type="text" value="${escHtml(IG.search)}" oninput="igSearch(this.value)"
          placeholder="${t('searchIngredients')}"
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white transition-all"/>
      </div>
      <select onchange="igFilterCat(this.value)" class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all min-w-[130px]">${catOpts}</select>
      <select onchange="igFilterStat(this.value)" class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all min-w-[130px]">${statOpts2}</select>
      <!-- View toggle -->
      <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
        <button onclick="igSetView('table')" class="p-2 rounded-lg transition-all ${IG.viewMode==='table'?'bg-white shadow-sm text-green-600':'text-gray-400 hover:text-gray-600'}" title="${isJa?'テーブル':'Table'}">
          ${icon('M3 10h18M3 14h18M3 6h18M3 18h18','w-4 h-4')}
        </button>
        <button onclick="igSetView('grid')" class="p-2 rounded-lg transition-all ${IG.viewMode==='grid'?'bg-white shadow-sm text-green-600':'text-gray-400 hover:text-gray-600'}" title="${isJa?'グリッド':'Grid'}">
          ${icon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z','w-4 h-4')}
        </button>
      </div>
      <button onclick="igResetFilters()" class="btn-ghost shrink-0">
        ${icon('M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15','w-4 h-4')}
        ${isJa?'リセット':'Reset'}
      </button>
    </div>

    <!-- Content area -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      ${IG.viewMode==='table'
        ? `<div class="overflow-x-auto">
             <table class="data-table">
               <thead><tr>
                 ${th('name',t('ingName'))} ${th('cat',t('ingCategory'))}
                 ${th('packWt',t('packWeight'))} ${th('packs',t('numPacks'))}
                 ${th('expiry',t('expiryDate'))} <th>${t('allergens')}</th>
                 ${th('status',t('status'))} <th>${t('actions')}</th>
               </tr></thead>
               <tbody>${tableRowsHTML}</tbody>
             </table>
           </div>
           ${paginHTML?`<div class="px-4 pb-4">${paginHTML}</div>`:''}`
        : `<div class="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
             ${gridHTML}
           </div>
           ${paginHTML?`<div class="px-4 pb-4 border-t border-gray-100">${paginHTML}</div>`:''}`}
    </div>
  </div>`;

  return renderAppShell(content, 'ingredients');
});

/* ── Ingredient handlers ── */
function igSearch(v)        { IG.search=v; IG.page=1; router.renderCurrent(); }
function igFilterCat(v)     { IG.catFilter=v; IG.page=1; router.renderCurrent(); }
function igFilterStat(v)    { IG.statusFilter=v; IG.page=1; router.renderCurrent(); }
function igResetFilters()   { IG.search=''; IG.catFilter='all'; IG.statusFilter='all'; IG.page=1; router.renderCurrent(); }
function igGoPage(p)        { IG.page=p; router.renderCurrent(); }
function igSetView(v)       { IG.viewMode=v; router.renderCurrent(); }
function igSort(key)        {
  if(IG.sortKey===key) IG.sortDir=IG.sortDir==='asc'?'desc':'asc';
  else { IG.sortKey=key; IG.sortDir='asc'; }
  router.renderCurrent();
}
function igOpenDetail(id)   { IG.detailId=id; router.renderCurrent(); }
function igCloseDetail()    { IG.detailId=null; router.renderCurrent(); }
window.igSearch=igSearch; window.igFilterCat=igFilterCat; window.igFilterStat=igFilterStat;
window.igResetFilters=igResetFilters; window.igGoPage=igGoPage; window.igSetView=igSetView;
window.igSort=igSort; window.igOpenDetail=igOpenDetail; window.igCloseDetail=igCloseDetail;

function igOpenCreate(){
  IG.modalMode='create'; IG.editingId=null;
  const modal=document.getElementById('ig-modal');
  const title=document.getElementById('ig-modal-title');
  const sub  =document.getElementById('ig-modal-sub');
  const isJa =AppState.lang==='ja';
  if(title) title.textContent=t('createIngredient');
  if(sub)   sub.textContent=isJa?'新しい食材を登録':'Register a new ingredient';
  ['ig-name','ig-nameEn','ig-packwt','ig-packs','ig-expiry','ig-allergens','ig-photo','ig-notes'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  const catEl=document.getElementById('ig-cat');    if(catEl) catEl.value='meat';
  const stEl =document.getElementById('ig-status'); if(stEl) stEl.value='available';
  ['err-ig-name','err-ig-nameEn','err-ig-packwt','err-ig-packs','err-ig-expiry'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  if(modal) modal.style.cssText='display:flex!important';
  setTimeout(()=>document.getElementById('ig-name')?.focus(),80);
}
window.igOpenCreate=igOpenCreate;

function igOpenEdit(ingId){
  const i=MockData.ingredients.find(i=>i.id===ingId); if(!i) return;
  IG.modalMode='edit'; IG.editingId=ingId;
  const modal=document.getElementById('ig-modal');
  const title=document.getElementById('ig-modal-title');
  const sub  =document.getElementById('ig-modal-sub');
  const isJa =AppState.lang==='ja';
  if(title) title.textContent=t('editIngredient');
  if(sub)   sub.textContent=isJa?`ID: ${i.id}`:`ID: ${i.id}`;
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val??''; };
  set('ig-name',   i.name);
  set('ig-nameEn', i.nameEn??i.name);
  set('ig-cat',    i.cat);
  set('ig-status', i.status);
  set('ig-packwt', i.packWt);
  set('ig-packs',  i.packs);
  set('ig-expiry', i.expiry);
  set('ig-allergens', i.allergens.join(', '));
  set('ig-photo',  i.photo);
  set('ig-notes',  i.notes??'');
  ['err-ig-name','err-ig-nameEn','err-ig-packwt','err-ig-packs','err-ig-expiry'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  if(modal) modal.style.cssText='display:flex!important';
  setTimeout(()=>document.getElementById('ig-name')?.focus(),80);
}
window.igOpenEdit=igOpenEdit;

function igCloseModal(){
  const modal=document.getElementById('ig-modal');
  if(modal) modal.style.cssText='display:none!important';
}
window.igCloseModal=igCloseModal;

function igSubmit(e){
  e?.preventDefault?.();
  const name    = document.getElementById('ig-name')?.value.trim()??'';
  const nameEn  = document.getElementById('ig-nameEn')?.value.trim()??'';
  const cat     = document.getElementById('ig-cat')?.value??'meat';
  const status  = document.getElementById('ig-status')?.value??'available';
  const packWt  = document.getElementById('ig-packwt')?.value.trim()??'';
  const packs   = parseInt(document.getElementById('ig-packs')?.value??'0');
  const expiry  = document.getElementById('ig-expiry')?.value??'';
  const allergRaw=document.getElementById('ig-allergens')?.value.trim()??'';
  const photo   = document.getElementById('ig-photo')?.value.trim()??`https://picsum.photos/seed/${Date.now()}/300/200`;
  const notes   = document.getElementById('ig-notes')?.value.trim()??'';

  /* Validate */
  ['err-ig-name','err-ig-nameEn','err-ig-packwt','err-ig-packs','err-ig-expiry'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  let ok=true;
  if(!name)   { document.getElementById('err-ig-name')?.classList.remove('hidden');   ok=false; }
  if(!nameEn) { document.getElementById('err-ig-nameEn')?.classList.remove('hidden'); ok=false; }
  if(!packWt) { document.getElementById('err-ig-packwt')?.classList.remove('hidden'); ok=false; }
  if(isNaN(packs)||packs<0){ document.getElementById('err-ig-packs')?.classList.remove('hidden'); ok=false; }
  if(!expiry) { document.getElementById('err-ig-expiry')?.classList.remove('hidden'); ok=false; }
  if(!ok) return;

  const allergens = allergRaw ? allergRaw.split(',').map(a=>a.trim()).filter(Boolean) : [];

  if(IG.modalMode==='create'){
    const newId='ING'+String(MockData.ingredients.length+1).padStart(3,'0')+'_NEW';
    MockData.ingredients.push({ id:newId, cat, catJa:['meat','veg','seafood','dairy','grains','cond','frozen','bev'].includes(cat)?{meat:'肉類',veg:'野菜類',seafood:'魚介類',dairy:'乳製品',grains:'穀物類',cond:'調味料',frozen:'冷凍食品',bev:'飲料'}[cat]:cat, name, nameEn, packWt, packs, expiry, allergens, status, photo, notes });
    Toast.show(t('ingCreated'),'success');
  } else {
    const idx=MockData.ingredients.findIndex(i=>i.id===IG.editingId);
    if(idx>-1) Object.assign(MockData.ingredients[idx],{name,nameEn,cat,status,packWt,packs,expiry,allergens,photo,notes});
    Toast.show(t('ingUpdated'),'success');
  }
  igCloseModal();
  router.renderCurrent();
}
window.igSubmit=igSubmit;

function igDelete(ingId){
  const i=MockData.ingredients.find(i=>i.id===ingId); if(!i) return;
  const nm=AppState.lang==='ja'?i.name:(i.nameEn??i.name);
  const msg=(AppState.lang==='ja'?`「${nm}」を削除しますか？`:`Delete "${nm}"?`);
  if(!confirm(msg)) return;
  MockData.ingredients=MockData.ingredients.filter(i=>i.id!==ingId);
  Toast.show(t('ingDeleted'),'warning');
  if(IG.detailId===ingId) IG.detailId=null;
  router.renderCurrent();
}
window.igDelete=igDelete;

// ──────────────────────────────────────────────────────────────────