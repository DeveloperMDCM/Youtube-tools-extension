// Development loader body. dev.mjs adds metadata from src/header.meta.js.
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const base = 'http://127.0.0.1:8766';
  let revision;
  let timer;
  let reloading = false;
  let automatic = GM_getValue('ytToolsLocalAutoReload', true);

  function request(route) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url: base + route + '?t=' + Date.now(), timeout: 5000,
        onload: response => response.status === 200
          ? resolve(response.responseText)
          : reject(new Error('Local server returned ' + response.status)),
        onerror: () => reject(new Error('Local server is unavailable')),
        ontimeout: () => reject(new Error('Local server timed out')),
      });
    });
  }

  function showStatus(message, failed = false) {
    let badge = document.getElementById('yt-tools-local-dev');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'yt-tools-local-dev';
      badge.setAttribute('role', 'status');
      Object.assign(badge.style, {
        position: 'fixed', bottom: '12px', left: '12px', zIndex: '2147483647',
        padding: '7px 12px', borderRadius: '6px', color: '#fff',
        font: '12px system-ui', pointerEvents: 'none',
      });
      document.documentElement.appendChild(badge);
    }
    badge.style.background = failed ? '#a12525' : '#1d4c35';
    badge.textContent = message;
  }

  GM_registerMenuCommand('Local development: toggle automatic reload', () => {
    automatic = !automatic;
    GM_setValue('ytToolsLocalAutoReload', automatic);
    showStatus('YT Tools LOCAL: automatic reload ' + (automatic ? 'on' : 'off'));
  });
  GM_registerMenuCommand('Local development: reload latest build', () => location.reload());

  async function start() {
    try {
      // One JSON response pairs the exact source with its content hash.
      const payload = JSON.parse(await request('/bundle'));
      if (typeof payload.code !== 'string' || typeof payload.revision !== 'string') {
        throw new Error('Invalid local build');
      }
      revision = payload.revision;
      const run = new Function(
        'GM_info', 'GM_addStyle', 'GM_setValue', 'GM_getValue',
        'GM_xmlhttpRequest', 'unsafeWindow', 'GM_registerMenuCommand', 'iziToast',
        payload.code + '\n//# sourceURL=youtube-tools-local-runtime.js',
      );
      // Keep storage, privileged requests and unsafeWindow in the userscript sandbox.
      run(GM_info, GM_addStyle, GM_setValue, GM_getValue,
        GM_xmlhttpRequest, unsafeWindow, GM_registerMenuCommand, iziToast);
      showStatus('YT Tools LOCAL ' + revision + ' | live reload ' + (automatic ? 'on' : 'off'));
      timer = setInterval(async () => {
        if (reloading) return;
        try {
          const next = JSON.parse(await request('/revision'));
          if (next.error) {
            showStatus('YT Tools LOCAL: build failed; keeping current version', true);
          } else if (next.revision !== revision) {
            if (automatic) { reloading = true; location.reload(); }
            else showStatus('YT Tools LOCAL: new build ready; refresh YouTube');
          } else {
            showStatus('YT Tools LOCAL ' + revision + ' | live reload ' + (automatic ? 'on' : 'off'));
          }
        } catch {
          showStatus('YT Tools LOCAL: server stopped; current page still running', true);
        }
      }, 1500);
      window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
    } catch (error) {
      console.error('[YouTube Tools local development]', error);
      showStatus('YT Tools LOCAL: could not load; start npm run dev:userscript and refresh', true);
    }
  }
  start();
})();
