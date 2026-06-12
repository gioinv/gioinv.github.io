/* Dashboard Page — depends on: AppState, t, icon, escHtml, statusBadge, getFacilityName, timeAgo, formatDate, router, MockData, renderAppShell */
router.register('dashboard',()=>{
  const isJa=AppState.lang==='ja', role=AppState.user?.role??'saj_admin';
  const orders=MockData.orders, today='2026-06-12';

  /* KPI values */
  const kv={
    totalIngredients:MockData.ingredients.length,
    pendingOrders:   orders.filter(o=>o.status==='pending').length,
    approvedOrders:  orders.filter(o=>o.status==='approved').length,
    shippedToday:    orders.filter(o=>o.status==='shipped'&&o.orderDate===today).length,
    activeFacilities:MockData.facilities.filter(f=>f.status==='active').length,
    totalUsers:      MockData.users.length,
    lowStockAlerts:  MockData.ingredients.filter(i=>i.status==='low_stock'||i.status==='expired').length,
    myOrders:        orders.filter(o=>o.facility===AppState.user?.facility).length||5,
    cartItems:       AppState.cart.length,
    shipped:         orders.filter(o=>o.status==='shipped').length,
    received:        orders.filter(o=>o.status==='received').length,
  };

  /* Role KPI sets */
  const kpiSets={
    saj_admin:[
      {key:'totalUsers',       val:kv.totalUsers,        icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',bg:'bg-blue-50',ic:'text-blue-600',  trend:'+2', dir:'up'},
      {key:'activeFacilities', val:kv.activeFacilities,  icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',bg:'bg-green-50',ic:'text-green-600',trend:'+1', dir:'up'},
      {key:'totalIngredients', val:kv.totalIngredients,  icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',bg:'bg-teal-50',ic:'text-teal-600',  trend:'+5', dir:'up'},
      {key:'pendingOrders',    val:kv.pendingOrders,     icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',bg:'bg-amber-50',ic:'text-amber-600',trend:'-3', dir:'down'},
      {key:'lowStockAlerts',   val:kv.lowStockAlerts,    icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',bg:'bg-red-50',ic:'text-red-600',    trend:'+2', dir:'up', alert:true},
    ],
    watami_staff:[
      {key:'totalIngredients', val:kv.totalIngredients,  icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',bg:'bg-teal-50',ic:'text-teal-600',  trend:'+5', dir:'up'},
      {key:'pendingOrders',    val:kv.pendingOrders,     icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',bg:'bg-amber-50',ic:'text-amber-600',trend:'-3', dir:'down'},
      {key:'approvedOrders',   val:kv.approvedOrders,    icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',bg:'bg-green-50',ic:'text-green-600',trend:'+7', dir:'up'},
      {key:'shippedToday',     val:kv.shippedToday,      icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',bg:'bg-blue-50',ic:'text-blue-600',  trend:'+1', dir:'up'},
      {key:'activeFacilities', val:kv.activeFacilities,  icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',bg:'bg-violet-50',ic:'text-violet-600',trend:'=',dir:'flat'},
    ],
    facility_staff:[
      {key:'myOrders',      val:kv.myOrders,       icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',bg:'bg-blue-50',ic:'text-blue-600',  trend:'+2', dir:'up'},
      {key:'pendingOrders', val:2,                 icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',bg:'bg-amber-50',ic:'text-amber-600',trend:'+1', dir:'up'},
      {key:'approvedOrders',val:1,                 icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',bg:'bg-green-50',ic:'text-green-600',trend:'=', dir:'flat'},
      {key:'shippedToday',  val:1,                 icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',bg:'bg-teal-50',ic:'text-teal-600',  trend:'=', dir:'flat'},
      {key:'cartItems',     val:kv.cartItems,      icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',bg:'bg-violet-50',ic:'text-violet-600',trend:'+0',dir:'flat'},
    ],
  };

  const kpiCards=(kpiSets[role]??kpiSets.saj_admin).map(k=>`
    <div class="kpi-card">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center">${icon(k.icon,`w-5 h-5 ${k.ic}`)}</div>
        <span class="${k.dir==='up'?(k.alert?'trend-alert':'trend-up'):k.dir==='down'?'trend-down':'trend-flat'}">
          ${k.dir==='up'?'▲':k.dir==='down'?'▼':'─'} ${k.trend}
        </span>
      </div>
      <div class="text-3xl font-extrabold text-gray-900 mb-1">${k.val}</div>
      <div class="text-xs font-medium text-gray-500">${t(k.key)}</div>
      <div class="text-[10px] text-gray-400 mt-0.5">${t('vsLastWeek')}</div>
    </div>`).join('');

  /* Quick Actions */
  const qaMap={
    saj_admin:[
      {key:'createUser',        page:'users',       icon:'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z',cl:'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'},
      {key:'addFacility',       page:'facilities',  icon:'M12 9v3m0 0v3m0-3h3m-3 0h-3',cl:'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'},
      {key:'viewReports',       page:'orders',      icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',cl:'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'},
    ],
    watami_staff:[
      {key:'addIngredient',     page:'ingredients', icon:'M12 9v3m0 0v3m0-3h3m-3 0h-3',cl:'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'},
      {key:'processAllocation', page:'allocation',  icon:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v10',cl:'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'},
      {key:'generateShipping',  page:'shipping',    icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4',cl:'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'},
    ],
    facility_staff:[
      {key:'browseIngredients', page:'catalog',        icon:'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2',cl:'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'},
      {key:'trackOrders',       page:'order-tracking', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10',cl:'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'},
      {key:'viewReceiving',     page:'receiving',      icon:'M5 13l4 4L19 7',cl:'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'},
    ],
  };
  const qaActions=(qaMap[role]??qaMap.saj_admin).map(a=>`
    <button onclick="router.navigate('${a.page}')" class="${a.cl} flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all">
      ${icon(a.icon,'w-4 h-4')} ${t(a.key)}
    </button>`).join('');

  /* Recent Orders table */
  const recent=[...orders].sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate)).slice(0,5);
  const ordersTableHTML=recent.length===0
    ?`<div class="flex flex-col items-center justify-center py-12 text-gray-400"><p class="text-sm">${t('noOrders')}</p></div>`
    :`<div class="overflow-x-auto">
        <table class="data-table">
          <thead><tr>
            <th>${t('orderId')}</th><th>${t('facility')}</th>
            <th>${t('items')}</th><th>${t('totalPacks')}</th>
            <th>${t('orderDate')}</th><th>${t('status')}</th><th>${t('actions')}</th>
          </tr></thead>
          <tbody>${recent.map(o=>`
            <tr>
              <td class="font-mono text-xs font-semibold text-gray-700">${escHtml(o.id)}</td>
              <td><span class="text-xs font-medium text-gray-700 max-w-[130px] inline-block truncate">${escHtml(getFacilityName(o.facility))}</span></td>
              <td>${o.items.length}</td>
              <td>${o.packs}</td>
              <td class="text-gray-500 text-xs">${formatDate(o.orderDate)}</td>
              <td><span class="${statusBadge(o.status)}">${t(o.status)}</span></td>
              <td><button onclick="router.navigate('orders')" class="btn-sm">${icon('M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z','w-3.5 h-3.5')} ${t('viewDetails')}</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

  /* Recent Notifications */
  const recentNotif=[...MockData.notifications].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,4);
  const notifIconMap={
    low_inventory: {icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',bg:'bg-red-50',ic:'text-red-500'},
    order_approved:{icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',bg:'bg-green-50',ic:'text-green-500'},
    order_rejected:{icon:'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',bg:'bg-red-50',ic:'text-red-500'},
    shipment:      {icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',bg:'bg-blue-50',ic:'text-blue-500'},
    reminder:      {icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',bg:'bg-amber-50',ic:'text-amber-500'},
  };
  const notifHTML=recentNotif.map(n=>{
    const cfg=notifIconMap[n.type]??notifIconMap.reminder;
    return `<div class="flex items-start gap-3 p-3 rounded-xl ${!n.read?'bg-green-50/70 border border-green-100':'hover:bg-gray-50'} transition-colors cursor-pointer" onclick="router.navigate('notifications')">
      <div class="w-8 h-8 ${cfg.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5">${icon(cfg.icon,`w-4 h-4 ${cfg.ic}`)}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <p class="text-xs font-semibold text-gray-800 truncate">${escHtml(isJa?n.titleJa:n.titleEn)}</p>
          ${!n.read?`<span class="badge badge-green text-[9px] shrink-0">${t('unread')}</span>`:''}
        </div>
        <p class="text-[11px] text-gray-500 mt-0.5 line-clamp-2">${escHtml(isJa?n.msgJa:n.msgEn)}</p>
      </div>
      <span class="text-[10px] text-gray-400 shrink-0 mt-0.5">${timeAgo(n.createdAt)}</span>
    </div>`;
  }).join('');

  /* Ingredient status for donut */
  const ist={
    available:    MockData.ingredients.filter(i=>i.status==='available').length,
    low_stock:    MockData.ingredients.filter(i=>i.status==='low_stock').length,
    expiring_soon:MockData.ingredients.filter(i=>i.status==='expiring_soon').length,
    expired:      MockData.ingredients.filter(i=>i.status==='expired').length,
  };
  const ingTotal=MockData.ingredients.length;
  const ingBars=[
    {key:'available',     val:ist.available,     color:'bg-green-500', pct:Math.round(ist.available/ingTotal*100)},
    {key:'low_stock',     val:ist.low_stock,     color:'bg-amber-400', pct:Math.round(ist.low_stock/ingTotal*100)},
    {key:'expiring_soon', val:ist.expiring_soon, color:'bg-orange-400',pct:Math.round(ist.expiring_soon/ingTotal*100)},
    {key:'expired',       val:ist.expired,       color:'bg-red-500',   pct:Math.round(ist.expired/ingTotal*100)},
  ];

  /* 7-day order trend */
  const trendDays=[], trendCounts=[];
  for(let i=6;i>=0;i--){
    const d=new Date('2026-06-12'); d.setDate(d.getDate()-i);
    const ds=d.toISOString().split('T')[0];
    trendDays.push(isJa?`${d.getMonth()+1}/${d.getDate()}`:`${d.getMonth()+1}/${d.getDate()}`);
    const cnt=orders.filter(o=>o.orderDate===ds).length;
    trendCounts.push(cnt>0?cnt:[3,5,4,7,6,4,5][6-i]);
  }

  /* Store chart data for post-render drawing */
  window._dashChart={
    donut:[ist.available,ist.low_stock,ist.expiring_soon,ist.expired],
    donutColors:['#16a34a','#f59e0b','#f97316','#ef4444'],
    bar:trendCounts, barLabels:trendDays,
  };

  const content=`
  <div class="p-5 lg:p-7 space-y-6 max-w-[1600px]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('dashboard')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${formatDate(today)} — ${isJa?'本日の概要':'Today\'s overview'}</p>
      </div>
      <div class="flex items-center flex-wrap gap-2">${qaActions}</div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">${kpiCards}</div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-5">
      <!-- Inventory Status (Donut) -->
      <div class="chart-card xl:col-span-2 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-800">${t('inventoryStatus')}</h3>
          <button onclick="router.navigate('ingredients')" class="btn-sm text-green-600 border-green-200 hover:bg-green-50">${t('viewAll')}</button>
        </div>
        <div class="flex flex-col sm:flex-row xl:flex-col items-center gap-5">
          <div class="relative shrink-0">
            <canvas id="donut-chart" width="176" height="176"></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-2xl font-extrabold text-gray-900">${ingTotal}</span>
              <span class="text-[10px] text-gray-400 font-medium">${isJa?'食材合計':'Total'}</span>
            </div>
          </div>
          <div class="flex-1 w-full space-y-2.5">
            ${ingBars.map(b=>`
              <div>
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full ${b.color} shrink-0"></span>
                    <span class="text-xs text-gray-600">${t(b.key)}</span>
                  </div>
                  <span class="text-xs font-bold text-gray-800">${b.val} <span class="text-gray-400 font-normal">(${b.pct}%)</span></span>
                </div>
                <div class="progress-bar"><div class="progress-fill ${b.color}" style="width:${b.pct}%"></div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Order Trends (Bar) -->
      <div class="chart-card xl:col-span-3 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-800">${t('orderTrends')}</h3>
          <button onclick="router.navigate('orders')" class="btn-sm text-green-600 border-green-200 hover:bg-green-50">${t('viewAll')}</button>
        </div>
        <div class="w-full" style="height:160px">
          <canvas id="bar-chart" style="width:100%;height:160px"></canvas>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="badge badge-amber">${t('pending')}: ${kv.pendingOrders}</span>
          <span class="badge badge-green">${t('approved')}: ${kv.approvedOrders}</span>
          <span class="badge badge-teal">${t('shipped')}: ${kv.shipped}</span>
          <span class="badge badge-violet">${t('received')}: ${kv.received}</span>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- Recent Orders -->
      <div class="chart-card xl:col-span-2 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-800">${t('recentOrders')}</h3>
          <button onclick="router.navigate('orders')" class="btn-sm text-green-600 border-green-200 hover:bg-green-50">${t('viewAll')}</button>
        </div>
        ${ordersTableHTML}
      </div>
      <!-- Recent Notifications -->
      <div class="chart-card xl:col-span-1 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-800">${t('recentNotifications')}</h3>
          <button onclick="router.navigate('notifications')" class="btn-sm text-green-600 border-green-200 hover:bg-green-50">${t('viewAll')}</button>
        </div>
        <div class="space-y-1">${notifHTML}</div>
      </div>
    </div>
  </div>`;

  return renderAppShell(content,'dashboard');
});

/* Post-render: draw Canvas charts */
router.registerHandlers('dashboard',()=>{
  const d=window._dashChart; if(!d) return;
  setTimeout(()=>{ drawDonut(d.donut,d.donutColors); drawBar(d.bar,d.barLabels); }, 80);
});

function drawDonut(segs,colors){
  const c=document.getElementById('donut-chart'); if(!c) return;
  const ctx=c.getContext('2d'), W=c.width, H=c.height, cx=W/2, cy=H/2;
  const outerR=Math.min(cx,cy)-5, innerR=outerR*0.6;
  const total=segs.reduce((a,b)=>a+b,0)||1;
  let ang=-Math.PI/2;
  ctx.clearRect(0,0,W,H);
  segs.forEach((v,i)=>{
    const sw=(v/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,outerR,ang,ang+sw); ctx.closePath();
    ctx.fillStyle=colors[i]; ctx.fill();
    ang+=sw;
  });
  ctx.beginPath(); ctx.arc(cx,cy,innerR,0,Math.PI*2);
  ctx.fillStyle='#fff'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,outerR,0,Math.PI*2);
  ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.stroke();
}

function drawBar(vals,labels){
  const el=document.getElementById('bar-chart'); if(!el) return;
  el.width=el.parentElement?.clientWidth||400;
  el.height=160;
  const ctx=el.getContext('2d'), W=el.width, H=160;
  const pL=36,pR=12,pT=16,pB=36, aW=W-pL-pR, aH=H-pT-pB;
  const max=Math.max(...vals,1);
  ctx.clearRect(0,0,W,H);
  /* Grid */
  ctx.strokeStyle='#f1f5f9'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=pT+aH*(1-i/4);
    ctx.beginPath(); ctx.moveTo(pL,y); ctx.lineTo(W-pR,y); ctx.stroke();
    ctx.fillStyle='#94a3b8'; ctx.font='9px Inter,sans-serif'; ctx.textAlign='right';
    if(i>0) ctx.fillText(Math.round(max*i/4),pL-4,y+3);
  }
  /* Axes */
  ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(pL,pT); ctx.lineTo(pL,H-pB); ctx.lineTo(W-pR,H-pB); ctx.stroke();
  /* Bars */
  const bW=aW/vals.length;
  vals.forEach((v,i)=>{
    const bh=v/max*aH, x=pL+i*bW+bW*.18, w=bW*.64, y=pT+aH-bh, r=3;
    const gr=ctx.createLinearGradient(0,y,0,y+bh);
    gr.addColorStop(0,'#16a34a'); gr.addColorStop(1,'#4ade80');
    ctx.fillStyle=gr;
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+bh); ctx.lineTo(x,y+bh); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath(); ctx.fill();
    if(v>0){ ctx.fillStyle='#1e293b'; ctx.font='bold 10px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(v,x+w/2,y-4); }
    ctx.fillStyle='#94a3b8'; ctx.font='9px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(labels[i],x+w/2,H-pB+14);
  });
}

// ──────────────────────────────────────────────────────────────────