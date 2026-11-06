// Development wrapper. The builder inserts the engine as ordinary source code.
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const base = 'http://127.0.0.1:8766';
  const revision = '__LOCAL_BUILD_REVISION__';
  const localDownloadToken = '__LOCAL_DOWNLOAD_TOKEN__';
  const installUrl = base + '/youtube-tools-local-dev.user.js';
  let badge;
  let updateButton;

  function showStatus(message, failed = false) {
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
      const updateVisibility = () => {
        badge.style.display = document.fullscreenElement ? 'none' : 'flex';
      };
      document.addEventListener('fullscreenchange', updateVisibility);
      updateVisibility();
    }
    badge.style.background = failed ? '#a12525' : '#1d4c35';
    badge.firstChild.textContent = message;
    updateButton.hidden = false;
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

})();
