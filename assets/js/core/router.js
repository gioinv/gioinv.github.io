/* ================================================================
   ROUTER — Hash-based SPA router
   Depends on: AppState (state.js), escHtml (utils.js)
   ================================================================ */
const router = {
  _routes:   {},
  _handlers: {},
  currentPage: 'login',

  /** Register a page render function. */
  register(path, fn)         { this._routes[path]   = fn; },

  /** Register a post-render DOM handler. */
  registerHandlers(path, fn) { this._handlers[path] = fn; },

  /** Navigate to a page (with auth guard). */
  navigate(path) {
    if (!AppState.user && path !== 'login') { this.navigate('login'); return; }
    this.currentPage = path;
    AppState.currentPage = path;
    history.replaceState(null, '', '#/' + path);
    this._render(path);
  },

  /** Re-render the current page (used after lang/role switch). */
  renderCurrent() { this._render(this.currentPage); },

  /** Internal render. */
  _render(path) {
    const app = document.getElementById('app');
    if (!app) return;
    const fn = this._routes[path];
    if (!fn) {
      app.innerHTML = `<div class="flex items-center justify-center min-h-screen">
        <p class="text-gray-400">404 — page not found: <code>${escHtml(path)}</code></p>
      </div>`;
      return;
    }
    app.innerHTML = fn();
    window.scrollTo({ top:0, behavior:'instant' });
    const h = this._handlers[path];
    if (h) h();
  },

  /** Bootstrap: read initial hash, listen for changes. */
  init() {
    const parse = () => window.location.hash.replace(/^#\/?/, '').trim() || 'login';
    this.currentPage = parse();
    window.addEventListener('hashchange', () => {
      const p = parse();
      if (p !== this.currentPage) { this.currentPage = p; this._render(p); }
    });
    this._render(this.currentPage);
  },
};
window.router = router;
