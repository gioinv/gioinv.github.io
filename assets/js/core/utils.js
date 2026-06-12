/* ================================================================
   UTILS — Shared utility functions
   Depends on: AppState (state.js), translations (i18n.js), MockData (mock-data.js)
   ================================================================ */

/** Translate a key with optional {param} interpolation. */
const t = (key, params={}) => {
  const s = translations[AppState.lang]?.[key] ?? translations['en']?.[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_,k)=>params[k]??'');
};

/** Format a date per active locale. ja → YYYY/MM/DD, en → MM/DD/YYYY */
const formatDate = (ds) => {
  const d=new Date(ds), y=d.getFullYear(),
        m=String(d.getMonth()+1).padStart(2,'0'),
        day=String(d.getDate()).padStart(2,'0');
  return AppState.lang==='ja' ? `${y}/${m}/${day}` : `${m}/${day}/${y}`;
};

/** Escape HTML to prevent XSS. */
const escHtml = s =>
  String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/** Return a single-path SVG icon string. */
const icon = (d, cls='w-5 h-5') =>
  `<svg class="${cls}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`;

/** Human-readable time-ago string. */
const timeAgo = (ds) => {
  const diff=Date.now()-new Date(ds),
        m=Math.floor(diff/60000), h=Math.floor(diff/3600000), d=Math.floor(diff/86400000);
  if(AppState.lang==='ja'){
    if(m<1) return 'たった今'; if(m<60) return `${m}分前`;
    if(h<24) return `${h}時間前`; return `${d}日前`;
  } else {
    if(m<1) return 'just now'; if(m<60) return `${m}m ago`;
    if(h<24) return `${h}h ago`; return `${d}d ago`;
  }
};

/** Return CSS classes for a status badge. */
const statusBadge = s => {
  const map = {
    pending:'badge-amber', approved:'badge-green', rejected:'badge-red',
    allocated:'badge-blue', shipped:'badge-teal',  received:'badge-violet',
    cancelled:'badge-gray', active:'badge-green',   inactive:'badge-gray',
    available:'badge-green',low_stock:'badge-amber',expiring_soon:'badge-orange',expired:'badge-red',
  };
  return `badge ${map[s]??'badge-gray'}`;
};

/** Get a facility's display name by ID. */
const getFacilityName = id => {
  const f = MockData.facilities.find(f=>f.id===id);
  return f ? (AppState.lang==='ja' ? f.name : f.nameEn) : id;
};
