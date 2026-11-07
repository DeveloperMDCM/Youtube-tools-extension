// The local service inserts the engine as ordinary source code.
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const base = 'http://127.0.0.1:8766';
  const revision = '__LOCAL_BUILD_REVISION__';
  const localDownloadToken = '__LOCAL_DOWNLOAD_TOKEN__';
  const installUrl = base + '/youtube-tools-local-dev.user.js';

  GM_registerMenuCommand('YouTube Tools: install or update', () => window.open(installUrl, '_blank'));
  GM_registerMenuCommand('YouTube Tools: refresh page', () => location.reload());

  try {
    // __LOCAL_ENGINE__
  } catch (error) {
    console.error(`[YouTube Tools ${revision}] Startup failed:`, error);
  }
})();
