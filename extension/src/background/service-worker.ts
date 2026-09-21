import { DEFAULT_YT_SETTINGS, YT_SETTINGS_KEY } from '../shared/ytSettings';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([YT_SETTINGS_KEY], (existing) => {
    if (existing[YT_SETTINGS_KEY] === undefined) {
      chrome.storage.local.set({
        [YT_SETTINGS_KEY]: JSON.stringify(DEFAULT_YT_SETTINGS),
      });
    }
  });
});

type GmXhrMessage = {
  type: 'GM_XHR';
  method?: string;
  url: string;
  headers?: Record<string, string>;
  data?: string;
  timeout?: number;
  anonymous?: boolean;
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'YT_TOOLS_PING' || message?.message === 'YT_TOOLS_PING') {
    sendResponse({ ok: true, version: chrome.runtime.getManifest().version });
    return true;
  }

  // Privileged fetch (bypasses page CORS) — used by content GM_xmlhttpRequest polyfill
  if (message?.type === 'GM_XHR' && typeof message.url === 'string') {
    const req = message as GmXhrMessage;
    const ctrl = new AbortController();
    const timeoutMs = Number(req.timeout) || 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (timeoutMs > 0) {
      timer = setTimeout(() => ctrl.abort(), timeoutMs);
    }

    fetch(req.url, {
      method: (req.method || 'GET').toUpperCase(),
      headers: req.headers || {},
      body: req.data,
      signal: ctrl.signal,
      credentials: req.anonymous ? 'omit' : 'include',
    })
      .then(async (res) => {
        const responseText = await res.text();
        sendResponse({
          ok: true,
          status: res.status,
          statusText: res.statusText,
          responseText,
          finalUrl: res.url,
        });
      })
      .catch((err) => {
        const aborted = ctrl.signal.aborted;
        sendResponse({
          ok: false,
          error: aborted ? 'timeout' : err instanceof Error ? err.message : String(err),
          aborted,
        });
      })
      .finally(() => {
        if (timer) clearTimeout(timer);
      });

    return true; // async sendResponse
  }

  return false;
});
