/* ================================================================
   STATE — Global application state shared across all modules
   ================================================================ */
const AppState = {
  lang:             'ja',    // 'ja' | 'en'
  user:             null,    // authenticated user object | null
  cart:             [],      // [{ ingredient, qty }]
  currentPage:      'login',
  sidebarCollapsed: false,
};
