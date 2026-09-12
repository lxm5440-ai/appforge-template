/* app.js — Utilidades base para AppForge */
const RF = window.RF || (window.RF = {});

RF.isNative = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
RF.plugin = (name) => (window.Capacitor?.Plugins) ? window.Capacitor.Plugins[name] : null;

RF.toast = async (msg) => {
  const Toast = RF.plugin('Toast');
  if (Toast) { try { await Toast.show({ text: String(msg), duration: 'short' }); return; } catch {} }
  console.log('[toast]', msg);
};

RF.hideSplash = async () => { const S = RF.plugin('SplashScreen'); if (S) try { await S.hide(); } catch {} };
RF.setStatusBar = async (style='DARK', color='#0a0f1d') => {
  const B = RF.plugin('StatusBar'); if (B) try { await B.setStyle({style}); await B.setBackgroundColor({color}); } catch {}
};

RF.fetchJSON = async (url, opts={}, timeout=10000) => {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeout);
  try { const r = await fetch(url, {...opts, cache:'no-store', signal:ctrl.signal}); if (!r.ok) throw new Error(`HTTP ${r.status}`); return await r.json(); }
  finally { clearTimeout(t); }
};

RF.openExternal = (url) => { if (RF.isNative()) window.open(url, '_system'); else window.open(url, '_blank', 'noopener'); };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { RF.hideSplash(); RF.setStatusBar(); });
else { RF.hideSplash(); RF.setStatusBar(); }
window.RF = RF;
