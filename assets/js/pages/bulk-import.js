/* ================================================================
   BULK IMPORT PAGE — CSV template download + upload + preview + import
   Role   : Watami Staff
   Depends: AppState, t, icon, escHtml, statusBadge, formatDate,
            router, MockData, Toast, renderAppShell
   ================================================================ */

/* ── i18n extensions ─────────────────────────────────────────── */
Object.assign(translations.ja, {
  bulkImportTitle:     '一括インポート',
  bulkImportSubtitle:  'CSVファイルで食材を一括登録できます',
  stepDownload:        'ステップ 1: テンプレートをダウンロード',
  stepUpload:          'ステップ 2: CSVファイルをアップロード',
  stepPreview:         'ステップ 3: プレビューと確認',
  stepImport:          'ステップ 4: インポート実行',
  downloadTemplate:    'CSVテンプレートをダウンロード',
  downloadTemplateHint:'テンプレートに従ってデータを入力してください',
  uploadCSV:           'CSVファイルを選択',
  uploadHint:          'CSVファイルをここにドロップするか、クリックして選択',
  uploadedFile:        'アップロード済みファイル',
  parseCSV:            'CSVを解析',
  parsedRows:          '件の行を検出',
  previewRows:         'プレビュー（最大10件）',
  validRows:           '有効な行',
  errorRows:           'エラーあり',
  confirmImport:       'インポートを実行',
  importSuccess:       '件の食材をインポートしました',
  importCancelled:     'インポートをキャンセルしました',
  importProgress:      'インポート中…',
  columnRequired:      '必須列',
  columnOptional:      '任意列',
  csvFormatGuide:      'CSVフォーマットガイド',
  importHistory:       'インポート履歴',
  importedAt:          'インポート日時',
  importedCount:       'インポート件数',
  importedBy:          '実行者',
  rowNumber:           '行番号',
  rowStatus:           '行ステータス',
  rowValid:            '有効',
  rowError:            'エラー',
  errorDetail:         'エラー詳細',
  noFileSelected:      'ファイルが選択されていません',
  invalidCSV:          '無効なCSVファイルです',
  dragDropHint:        'またはここにドラッグ＆ドロップ',
  templateColumns:     'テンプレート列一覧',
  processingFile:      'ファイルを処理中…',
  clearFile:           'ファイルをクリア',
  backToIngredients:   '食材管理に戻る',
  importedSuccessNote: '件がインポートされ、食材管理に追加されました',
});
Object.assign(translations.en, {
  bulkImportTitle:     'Bulk Import',
  bulkImportSubtitle:  'Register multiple ingredients at once via CSV file',
  stepDownload:        'Step 1: Download Template',
  stepUpload:          'Step 2: Upload CSV File',
  stepPreview:         'Step 3: Preview & Validate',
  stepImport:          'Step 4: Execute Import',
  downloadTemplate:    'Download CSV Template',
  downloadTemplateHint:'Fill in your data following the template format',
  uploadCSV:           'Select CSV File',
  uploadHint:          'Drop your CSV file here or click to browse',
  uploadedFile:        'Uploaded File',
  parseCSV:            'Parse CSV',
  parsedRows:          'rows detected',
  previewRows:         'Preview (up to 10 rows)',
  validRows:           'Valid Rows',
  errorRows:           'Error Rows',
  confirmImport:       'Execute Import',
  importSuccess:       'ingredients imported successfully',
  importCancelled:     'Import cancelled',
  importProgress:      'Importing…',
  columnRequired:      'Required',
  columnOptional:      'Optional',
  csvFormatGuide:      'CSV Format Guide',
  importHistory:       'Import History',
  importedAt:          'Imported At',
  importedCount:       'Count',
  importedBy:          'Imported By',
  rowNumber:           'Row',
  rowStatus:           'Status',
  rowValid:            'Valid',
  rowError:            'Error',
  errorDetail:         'Error',
  noFileSelected:      'No file selected',
  invalidCSV:          'Invalid CSV file',
  dragDropHint:        'or drag & drop here',
  templateColumns:     'Template Columns',
  processingFile:      'Processing file…',
  clearFile:           'Clear File',
  backToIngredients:   'Back to Ingredients',
  importedSuccessNote: 'items have been added to Ingredient Management',
});

/* ── Bulk Import State ───────────────────────────────────────── */
const BI = {
  file:       null,       // File object
  fileName:   '',
  rawRows:    [],         // Parsed CSV rows (objects)
  validated:  [],         // [{row, valid, errors, data}]
  importing:  false,
  importDone: false,
  importedCount: 0,
  history: [
    { at:'2026-06-10T14:30:00', count:8,  by:'山田 次郎 / Jiro Yamada',   ok:true },
    { at:'2026-06-08T09:15:00', count:12, by:'佐藤 美咲 / Misaki Sato',   ok:true },
    { at:'2026-06-05T16:45:00', count:3,  by:'山田 次郎 / Jiro Yamada',   ok:false },
  ],
};

/* ── CSV Template definition ─────────────────────────────────── */
const CSV_COLS = [
  { key:'name',    ja:'食材名（日本語）',  en:'Name (JA)',      required:true,  example:'鶏むね肉' },
  { key:'nameEn',  ja:'食材名（英語）',    en:'Name (EN)',      required:true,  example:'Chicken Breast' },
  { key:'cat',     ja:'カテゴリコード',    en:'Category Code',  required:true,  example:'meat', note:'meat/veg/seafood/dairy/grains/cond/frozen/bev' },
  { key:'packWt',  ja:'パック重量',        en:'Pack Weight',    required:true,  example:'500g' },
  { key:'packs',   ja:'パック数',          en:'Pack Count',     required:true,  example:'20' },
  { key:'expiry',  ja:'賞味期限',          en:'Expiry Date',    required:true,  example:'2026-12-31', note:'YYYY-MM-DD' },
  { key:'allergens',ja:'アレルゲン',       en:'Allergens',      required:false, example:'小麦,乳', note:'comma-separated or empty' },
  { key:'status',  ja:'ステータス',        en:'Status',         required:false, example:'available', note:'available/low_stock/expiring_soon' },
  { key:'photo',   ja:'写真URL',           en:'Photo URL',      required:false, example:'https://picsum.photos/seed/xxx/300/200' },
  { key:'notes',   ja:'備考',              en:'Notes',          required:false, example:'' },
];

const VALID_CATS    = new Set(['meat','veg','seafood','dairy','grains','cond','frozen','bev']);
const VALID_STATUS  = new Set(['available','low_stock','expiring_soon','expired']);

/* ── Cat label helper (reuse from ingredients page if loaded) ── */
const biCatLabel = (cat, isJa) => {
  const map = { meat:{ja:'肉類',en:'Meat'}, veg:{ja:'野菜類',en:'Vegetables'}, seafood:{ja:'魚介類',en:'Seafood'}, dairy:{ja:'乳製品',en:'Dairy'}, grains:{ja:'穀物類',en:'Grains'}, cond:{ja:'調味料',en:'Condiments'}, frozen:{ja:'冷凍食品',en:'Frozen'}, bev:{ja:'飲料',en:'Beverages'} };
  return isJa ? (map[cat]?.ja ?? cat) : (map[cat]?.en ?? cat);
};

/* ── Template CSV content ───────────────────────────────────── */
const buildTemplateCsv = () => {
  const header  = CSV_COLS.map(c => c.key).join(',');
  const example = CSV_COLS.map(c => c.example ? `"${c.example}"` : '""').join(',');
  const note    = '# ' + CSV_COLS.map(c => c.required ? '[required]' : '[optional]').join(',');
  return `${note}\n${header}\n${example}\n`;
};

/* ── Validate a single parsed row ───────────────────────────── */
function validateRow(obj, idx) {
  const errors = [];
  if (!obj.name?.trim())   errors.push('name is required');
  if (!obj.nameEn?.trim()) errors.push('nameEn is required');
  if (!obj.cat?.trim() || !VALID_CATS.has(obj.cat.trim()))
    errors.push(`cat must be one of: ${[...VALID_CATS].join('/')}`);
  if (!obj.packWt?.trim()) errors.push('packWt is required');
  const packs = parseInt(obj.packs);
  if (isNaN(packs) || packs < 0) errors.push('packs must be a non-negative number');
  if (!obj.expiry?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(obj.expiry.trim()))
    errors.push('expiry must be YYYY-MM-DD');
  if (obj.status && !VALID_STATUS.has(obj.status.trim()))
    errors.push(`status must be one of: ${[...VALID_STATUS].join('/')}`);

  const data = {
    name:      obj.name?.trim() ?? '',
    nameEn:    obj.nameEn?.trim() ?? '',
    cat:       obj.cat?.trim() ?? 'meat',
    packWt:    obj.packWt?.trim() ?? '',
    packs:     isNaN(packs) ? 0 : packs,
    expiry:    obj.expiry?.trim() ?? '',
    allergens: obj.allergens ? obj.allergens.split(',').map(a => a.trim()).filter(Boolean) : [],
    status:    VALID_STATUS.has(obj.status?.trim()) ? obj.status.trim() : 'available',
    photo:     obj.photo?.trim() || `https://picsum.photos/seed/${encodeURIComponent(obj.name ?? 'food')}/300/200`,
    notes:     obj.notes?.trim() ?? '',
  };

  return { rowNum: idx + 2, valid: errors.length === 0, errors, data };
}

/* ── Parse CSV text (handles quotes) ────────────────────────── */
function parseCSVText(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
  return lines.slice(1).map(line => {
    const vals = [];
    let inQ = false, cur = '';
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { vals.push(cur); cur = ''; }
      else cur += ch;
    }
    vals.push(cur);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] ?? '').replace(/^"|"$/g,''); });
    return obj;
  }).filter(obj => Object.values(obj).some(v => v.trim()));
}

/* ── Mock sample CSV data for demo ────────────────────────────── */
const MOCK_CSV_ROWS = [
  { name:'鶏胸肉（新入荷）', nameEn:'Chicken Breast (New)',    cat:'meat',    packWt:'500g',  packs:'15', expiry:'2026-07-20', allergens:'',        status:'available',    photo:'', notes:'' },
  { name:'ブロッコリースプラウト', nameEn:'Broccoli Sprout',    cat:'veg',     packWt:'100g',  packs:'30', expiry:'2026-06-25', allergens:'',        status:'available',    photo:'', notes:'新鮮' },
  { name:'真鯛切り身',         nameEn:'Sea Bream Fillet',      cat:'seafood', packWt:'300g',  packs:'8',  expiry:'2026-06-18', allergens:'魚',       status:'low_stock',    photo:'', notes:'' },
  { name:'グリークヨーグルト',  nameEn:'Greek Yogurt',          cat:'dairy',   packWt:'200g',  packs:'20', expiry:'2026-06-30', allergens:'乳',       status:'available',    photo:'', notes:'' },
  { name:'全粒粉パスタ',        nameEn:'Whole Wheat Pasta',     cat:'grains',  packWt:'500g',  packs:'0',  expiry:'2026-11-30', allergens:'小麦',     status:'low_stock',    photo:'', notes:'' },
  { name:'バルサミコ酢',        nameEn:'Balsamic Vinegar',      cat:'cond',    packWt:'250ml', packs:'12', expiry:'2027-06-01', allergens:'',        status:'available',    photo:'', notes:'' },
  { name:'冷凍ほうれん草',      nameEn:'Frozen Spinach',        cat:'frozen',  packWt:'500g',  packs:'25', expiry:'2026-12-31', allergens:'',        status:'available',    photo:'', notes:'' },
  { name:'りんごジュース',      nameEn:'Apple Juice',           cat:'bev',     packWt:'1L',    packs:'18', expiry:'2026-09-15', allergens:'',        status:'available',    photo:'', notes:'' },
  { name:'INVALID ROW',         nameEn:'',                      cat:'BADCAT',  packWt:'',      packs:'abc',expiry:'not-a-date',  allergens:'',        status:'',             photo:'', notes:'' },
];

router.register('bulk-import', () => {
  const isJa = AppState.lang === 'ja';
  const user = AppState.user;

  /* ── Step badges ── */
  const steps = [
    { n:1, key:'stepDownload', done:true       },
    { n:2, key:'stepUpload',   done:!!BI.file  },
    { n:3, key:'stepPreview',  done:BI.validated.length>0 },
    { n:4, key:'stepImport',   done:BI.importDone },
  ];
  const stepsHTML = steps.map(s => `
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${s.done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}">
        ${s.done ? icon('M5 13l4 4L19 7','w-3.5 h-3.5') : s.n}
      </div>
      <span class="text-xs font-semibold ${s.done ? 'text-green-700' : 'text-gray-500'} hidden sm:inline">${t(s.key)}</span>
    </div>
    ${s.n < 4 ? '<div class="flex-1 h-px bg-gray-200 hidden sm:block"></div>' : ''}`).join('');

  /* ── Column guide ── */
  const colGuideHTML = CSV_COLS.map(c => `
    <tr>
      <td class="py-2 pr-3 font-mono text-xs text-gray-700 font-semibold whitespace-nowrap">${c.key}</td>
      <td class="py-2 pr-3">${isJa ? c.ja : c.en}</td>
      <td class="py-2 pr-3">
        <span class="badge ${c.required ? 'badge-red' : 'badge-gray'} text-[10px]">
          ${c.required ? t('columnRequired') : t('columnOptional')}
        </span>
      </td>
      <td class="py-2 pr-3 text-xs text-gray-500 font-mono">${c.example || '—'}</td>
      <td class="py-2 text-[10px] text-gray-400">${c.note || ''}</td>
    </tr>`).join('');

  /* ── Preview table ── */
  let previewHTML = '';
  if (BI.validated.length > 0) {
    const valid   = BI.validated.filter(r => r.valid).length;
    const errored = BI.validated.filter(r => !r.valid).length;
    const preview = BI.validated.slice(0, 10);
    previewHTML = `
      <!-- Summary badges -->
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <div class="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
          ${icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z','w-4 h-4 text-green-600')}
          <span class="text-xs font-bold text-green-700">${valid} ${t('validRows')}</span>
        </div>
        ${errored > 0 ? `
        <div class="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
          ${icon('M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z','w-4 h-4 text-red-500')}
          <span class="text-xs font-bold text-red-600">${errored} ${t('errorRows')}</span>
        </div>` : ''}
        <span class="text-xs text-gray-400 ml-1">${BI.validated.length} ${t('parsedRows')}</span>
      </div>
      <!-- Preview table -->
      <div class="overflow-x-auto rounded-xl border border-gray-100">
        <table class="data-table text-xs">
          <thead><tr>
            <th class="w-10">#</th>
            <th>${isJa?'食材名':'Name'}</th>
            <th>${isJa?'カテゴリ':'Category'}</th>
            <th>${isJa?'パック数':'Packs'}</th>
            <th>${isJa?'賞味期限':'Expiry'}</th>
            <th>${isJa?'ステータス':'Status'}</th>
            <th>${t('rowStatus')}</th>
          </tr></thead>
          <tbody>
            ${preview.map(r => `
              <tr class="${!r.valid ? 'bg-red-50' : ''}">
                <td class="text-gray-400">${r.rowNum}</td>
                <td class="font-medium">${escHtml(r.data.name || '—')} ${r.data.nameEn ? `<span class="text-gray-400 font-normal">(${escHtml(r.data.nameEn)})</span>` : ''}</td>
                <td>${r.data.cat ? `<span class="badge badge-gray">${biCatLabel(r.data.cat,isJa)}</span>` : '<span class="text-gray-400">—</span>'}</td>
                <td class="font-semibold">${r.data.packs ?? '—'}</td>
                <td>${r.data.expiry || '—'}</td>
                <td>${r.data.status ? `<span class="${statusBadge(r.data.status)}">${t(r.data.status)}</span>` : '—'}</td>
                <td>
                  ${r.valid
                    ? `<span class="badge badge-green">${t('rowValid')}</span>`
                    : `<div><span class="badge badge-red">${t('rowError')}</span><div class="text-[10px] text-red-500 mt-0.5 max-w-[160px]">${r.errors.map(escHtml).join('; ')}</div></div>`}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${BI.validated.length > 10 ? `<p class="text-xs text-gray-400 mt-2 text-center">...${BI.validated.length - 10} ${isJa ? '件以上省略' : 'more rows not shown'}</p>` : ''}`;
  }

  /* ── Success banner ── */
  const successHTML = BI.importDone ? `
    <div class="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4 mb-6">
      <div class="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
        ${icon('M5 13l4 4L19 7','w-5 h-5 text-white')}
      </div>
      <div>
        <h4 class="text-sm font-bold text-green-800 mb-0.5">
          ${BI.importedCount} ${isJa ? t('importedSuccessNote') : t('importedSuccessNote')}
        </h4>
        <p class="text-xs text-green-600">${isJa ? '食材管理ページで確認できます。' : 'You can verify them in Ingredient Management.'}</p>
        <button onclick="router.navigate('ingredients')" class="mt-2 text-xs font-semibold text-green-700 underline underline-offset-2 hover:text-green-800">
          ${isJa ? '食材管理を開く →' : 'Open Ingredient Management →'}
        </button>
      </div>
    </div>` : '';

  /* ── Import History ── */
  const historyHTML = BI.history.map(h => `
    <div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div class="w-8 h-8 rounded-xl ${h.ok ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center shrink-0">
        ${icon(h.ok ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12', `w-4 h-4 ${h.ok ? 'text-green-600' : 'text-red-500'}`)}
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-semibold text-gray-800">${formatDate(h.at.split('T')[0])}</div>
        <div class="text-[10px] text-gray-400">${h.by}</div>
      </div>
      <span class="badge ${h.ok ? 'badge-green' : 'badge-red'} shrink-0">${h.count} ${isJa ? '件' : 'items'}</span>
    </div>`).join('');

  /* ── Assemble page ── */
  const content = `
  <div class="p-5 lg:p-7 space-y-6 max-w-[1100px]">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900">${t('bulkImportTitle')}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${t('bulkImportSubtitle')}</p>
      </div>
      <button onclick="router.navigate('ingredients')" class="btn-ghost self-start">
        ${icon('M10 19l-7-7m0 0l7-7m-7 7h18','w-4 h-4')} ${t('backToIngredients')}
      </button>
    </div>

    <!-- Steps indicator -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div class="flex items-center gap-2">${stepsHTML}</div>
    </div>

    ${successHTML}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- ── LEFT COLUMN (main actions) ── -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Step 1: Download Template -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
            <h3 class="text-sm font-bold text-gray-900">${t('stepDownload')}</h3>
          </div>
          <p class="text-xs text-gray-500 mb-4">${t('downloadTemplateHint')}</p>
          <button onclick="biDownloadTemplate()" class="btn-primary text-sm py-2.5 px-5">
            ${icon('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4','w-4 h-4')}
            ${t('downloadTemplate')}
          </button>
        </div>

        <!-- Step 2: Upload -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-7 h-7 ${BI.file ? 'bg-green-600' : 'bg-gray-200'} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 transition-colors">
              ${BI.file ? icon('M5 13l4 4L19 7','w-3.5 h-3.5') : '2'}
            </div>
            <h3 class="text-sm font-bold text-gray-900">${t('stepUpload')}</h3>
          </div>
          <!-- Drop zone -->
          <div id="bi-dropzone"
            onclick="document.getElementById('bi-file-input').click()"
            ondragover="event.preventDefault();this.classList.add('!border-green-400','!bg-green-50')"
            ondragleave="this.classList.remove('!border-green-400','!bg-green-50')"
            ondrop="biHandleDrop(event)"
            class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all">
            ${BI.file
              ? `<div class="flex items-center justify-center gap-3">
                   ${icon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z','w-10 h-10 text-green-600')}
                   <div class="text-left">
                     <div class="text-sm font-bold text-gray-900">${escHtml(BI.fileName)}</div>
                     <div class="text-xs text-gray-400 mt-0.5">${isJa ? 'ファイルが選択されました' : 'File selected'}</div>
                   </div>
                 </div>`
              : `<div>
                   ${icon('M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12','w-10 h-10 text-gray-300 mx-auto mb-3')}
                   <p class="text-sm font-semibold text-gray-600">${t('uploadHint')}</p>
                   <p class="text-xs text-gray-400 mt-1">${t('dragDropHint')}</p>
                 </div>`}
          </div>
          <input id="bi-file-input" type="file" accept=".csv,text/csv" class="hidden" onchange="biHandleFile(event)"/>
          <!-- Action buttons -->
          <div class="flex items-center gap-2 mt-3">
            ${BI.file ? `
            <button onclick="biParseFile()" class="btn-primary text-sm py-2 px-4" id="bi-parse-btn">
              ${icon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2','w-4 h-4')}
              ${t('parseCSV')}
            </button>
            <button onclick="biUseMockData()" class="btn-ghost text-sm py-2 px-4">
              ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-4 h-4')}
              ${isJa ? 'サンプルデータを使用' : 'Use Sample Data'}
            </button>
            <button onclick="biClearFile()" class="btn-ghost text-sm py-2 px-3 text-red-500 border-red-200 hover:bg-red-50">
              ${icon('M6 18L18 6M6 6l12 12','w-4 h-4')} ${t('clearFile')}
            </button>` : `
            <button onclick="biUseMockData()" class="btn-ghost text-sm py-2 px-4">
              ${icon('M13 10V3L4 14h7v7l9-11h-7z','w-4 h-4')}
              ${isJa ? 'デモデータを読み込む' : 'Load Demo Data'}
            </button>`}
          </div>
        </div>

        <!-- Step 3: Preview -->
        ${BI.validated.length > 0 ? `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              ${icon('M5 13l4 4L19 7','w-3.5 h-3.5')}
            </div>
            <h3 class="text-sm font-bold text-gray-900">${t('stepPreview')} · ${t('previewRows')}</h3>
          </div>
          ${previewHTML}
        </div>` : ''}

        <!-- Step 4: Import -->
        ${BI.validated.length > 0 && !BI.importDone ? `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">4</div>
            <h3 class="text-sm font-bold text-gray-900">${t('stepImport')}</h3>
          </div>
          ${(() => {
            const valid = BI.validated.filter(r => r.valid).length;
            const err   = BI.validated.filter(r => !r.valid).length;
            return `
            <div class="bg-gray-50 rounded-xl p-4 mb-4">
              <div class="text-xs text-gray-600 space-y-1">
                <div class="flex items-center justify-between">
                  <span>${isJa ? 'インポート対象:' : 'Will import:'}</span>
                  <span class="font-bold text-green-700">${valid} ${isJa ? '件（有効行）' : 'valid rows'}</span>
                </div>
                ${err > 0 ? `<div class="flex items-center justify-between">
                  <span>${isJa ? 'スキップ:' : 'Will skip:'}</span>
                  <span class="font-semibold text-red-600">${err} ${isJa ? '件（エラー行）' : 'error rows'}</span>
                </div>` : ''}
              </div>
            </div>
            <button onclick="biExecuteImport()" class="btn-primary text-sm py-2.5 px-6 ${valid === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${valid === 0 ? 'disabled' : ''} id="bi-import-btn">
              ${icon('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12','w-4 h-4')}
              ${t('confirmImport')} (${valid} ${isJa ? '件' : 'items'})
            </button>`;
          })()}
        </div>` : ''}

      </div><!-- /left col -->

      <!-- ── RIGHT COLUMN (guide + history) ── -->
      <div class="space-y-5">

        <!-- CSV Format Guide -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            ${icon('M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z','w-4 h-4 text-blue-500')}
            <h3 class="text-sm font-bold text-gray-900">${t('csvFormatGuide')}</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead><tr>
                <th class="text-left pb-2 text-gray-500 font-semibold pr-3">${isJa ? '列名' : 'Column'}</th>
                <th class="text-left pb-2 text-gray-500 font-semibold pr-3">${isJa ? '説明' : 'Description'}</th>
                <th class="text-left pb-2 text-gray-500 font-semibold pr-3"></th>
                <th class="text-left pb-2 text-gray-500 font-semibold">${isJa ? '例' : 'Example'}</th>
              </tr></thead>
              <tbody class="divide-y divide-gray-50">
                ${colGuideHTML}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Import History -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            ${icon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z','w-4 h-4 text-gray-500')}
            <h3 class="text-sm font-bold text-gray-900">${t('importHistory')}</h3>
          </div>
          <div class="divide-y divide-gray-50">
            ${historyHTML}
          </div>
        </div>

      </div><!-- /right col -->
    </div><!-- /grid -->
  </div>`;

  return renderAppShell(content, 'bulk-import');
});

/* ── Bulk Import handlers ─────────────────────────────────────── */

/** Download CSV template as a file */
function biDownloadTemplate() {
  const csv  = buildTemplateCsv();
  const blob = new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'mottainai_ingredient_template.csv';
  a.click();
  URL.revokeObjectURL(url);
  const isJa = AppState.lang === 'ja';
  Toast.show(isJa ? 'テンプレートをダウンロードしました' : 'Template downloaded', 'success');
}
window.biDownloadTemplate = biDownloadTemplate;

/** Handle file input change */
function biHandleFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  BI.file      = file;
  BI.fileName  = file.name;
  BI.rawRows   = [];
  BI.validated = [];
  BI.importDone = false;
  router.renderCurrent();
}
window.biHandleFile = biHandleFile;

/** Handle drag-and-drop */
function biHandleDrop(e) {
  e.preventDefault();
  const dz = document.getElementById('bi-dropzone');
  if (dz) dz.classList.remove('!border-green-400','!bg-green-50');
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.name.endsWith('.csv')) {
    Toast.show(t('invalidCSV'), 'error'); return;
  }
  BI.file = file; BI.fileName = file.name;
  BI.rawRows=[]; BI.validated=[]; BI.importDone=false;
  router.renderCurrent();
}
window.biHandleDrop = biHandleDrop;

/** Parse the uploaded file */
function biParseFile() {
  if (!BI.file) return;
  const btn = document.getElementById('bi-parse-btn');
  if (btn) { btn.disabled=true; btn.innerHTML=`<span class="spinner"></span> ${t('processingFile')}`; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    setTimeout(() => {
      const text = ev.target?.result ?? '';
      const rows = parseCSVText(text);
      BI.rawRows   = rows;
      BI.validated = rows.map((r, i) => validateRow(r, i));
      router.renderCurrent();
    }, 600); /* simulate processing */
  };
  reader.readAsText(BI.file, 'utf-8');
}
window.biParseFile = biParseFile;

/** Load mock demo data for presentation */
function biUseMockData() {
  const isJa = AppState.lang === 'ja';
  BI.file      = { name:'demo_ingredients.csv' };
  BI.fileName  = 'demo_ingredients.csv';
  BI.rawRows   = MOCK_CSV_ROWS;
  BI.validated = MOCK_CSV_ROWS.map((r, i) => validateRow(r, i));
  BI.importDone= false;
  Toast.show(isJa ? 'デモデータを読み込みました' : 'Demo data loaded', 'info');
  router.renderCurrent();
}
window.biUseMockData = biUseMockData;

/** Clear selected file */
function biClearFile() {
  BI.file=null; BI.fileName=''; BI.rawRows=[]; BI.validated=[];
  BI.importDone=false; BI.importedCount=0;
  const inp = document.getElementById('bi-file-input');
  if (inp) inp.value='';
  router.renderCurrent();
}
window.biClearFile = biClearFile;

/** Execute the import of validated rows */
function biExecuteImport() {
  const btn = document.getElementById('bi-import-btn');
  if (btn) { btn.disabled=true; btn.innerHTML=`<span class="spinner"></span> ${t('importProgress')}`; }

  const validRows = BI.validated.filter(r => r.valid);
  setTimeout(() => {
    validRows.forEach((r, i) => {
      const catJaMap = { meat:'肉類', veg:'野菜類', seafood:'魚介類', dairy:'乳製品', grains:'穀物類', cond:'調味料', frozen:'冷凍食品', bev:'飲料' };
      const newId = 'ING_IMP_' + String(Date.now()).slice(-6) + '_' + i;
      MockData.ingredients.push({
        id: newId,
        cat:    r.data.cat,
        catJa:  catJaMap[r.data.cat] ?? r.data.cat,
        name:   r.data.name,
        nameEn: r.data.nameEn,
        packWt: r.data.packWt,
        packs:  r.data.packs,
        expiry: r.data.expiry,
        allergens: r.data.allergens,
        status: r.data.status,
        photo:  r.data.photo,
        notes:  r.data.notes,
      });
    });

    /* Log to history */
    BI.history.unshift({
      at:    new Date().toISOString(),
      count: validRows.length,
      by:    (AppState.lang==='ja' ? AppState.user?.name : AppState.user?.nameEn) ?? AppState.user?.id ?? '—',
      ok:    true,
    });

    BI.importedCount = validRows.length;
    BI.importDone    = true;
    BI.validated     = [];
    BI.rawRows       = [];
    BI.file          = null;
    BI.fileName      = '';

    const isJa = AppState.lang === 'ja';
    Toast.show(`${validRows.length} ${isJa ? t('importedSuccessNote') : t('importedSuccessNote')}`, 'success', 4000);
    router.renderCurrent();
  }, 1200);
}
window.biExecuteImport = biExecuteImport;
