// Development wrapper. The builder inserts the engine as ordinary source code.
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const base = 'http://127.0.0.1:8766';
  const revision = '__LOCAL_BUILD_REVISION__';
  const installUrl = base + '/youtube-tools-local-dev.user.js';
  let timer;
  let badge;
  let updateButton;

  function showStatus(message, failed = false, updateReady = false) {
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'yt-tools-local-dev';
      badge.setAttribute('role', 'status');
      Object.assign(badge.style, {
        position: 'fixed', bottom: '12px', left: '12px', zIndex: '2147483647',
        padding: '9px 12px', borderRadius: '6px', color: '#fff',
        font: '14px system-ui', display: 'flex', alignItems: 'center', gap: '12px',
      });
      const label = document.createElement('span');
      badge.appendChild(label);
      updateButton = document.createElement('button');
      updateButton.textContent = 'Update local build';
      updateButton.type = 'button';
      Object.assign(updateButton.style, { padding: '5px 9px', color: '#111', background: '#fff' });
      updateButton.addEventListener('click', () => window.open(installUrl, '_blank'));
      badge.appendChild(updateButton);
      document.documentElement.appendChild(badge);
    }
    badge.style.background = failed ? '#a12525' : '#1d4c35';
    badge.firstChild.textContent = message;
    updateButton.hidden = !updateReady;
  }

  GM_registerMenuCommand('Local development: install latest build', () => window.open(installUrl, '_blank'));
  GM_registerMenuCommand('Local development: refresh YouTube', () => location.reload());

  try {
    // __LOCAL_ENGINE__
    showStatus('YT Tools LOCAL ' + revision);
  } catch (error) {
    console.error('[YouTube Tools local development]', error);
    showStatus('YT Tools LOCAL: ' + error.message, true);
    return;
  }

  timer = setInterval(() => {
    GM_xmlhttpRequest({
      method: 'GET', url: base + '/revision?t=' + Date.now(), timeout: 5000,
      onload: response => {
        try {
          if (response.status !== 200) throw new Error('Server unavailable');
          const next = JSON.parse(response.responseText);
          if (next.error) showStatus('YT Tools LOCAL: build failed; keeping current version', true);
          else if (next.revision !== revision) showStatus('YT Tools LOCAL: new build ready', false, true);
          else showStatus('YT Tools LOCAL ' + revision);
        } catch {
          showStatus('YT Tools LOCAL: server stopped; installed build still running', true);
        }
      },
      onerror: () => showStatus('YT Tools LOCAL: server stopped; installed build still running', true),
      ontimeout: () => showStatus('YT Tools LOCAL: server not responding; installed build still running', true),
    });
  }, 1500);
  window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
})();
