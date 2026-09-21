/**
 * Tampermonkey GM_* APIs backed by chrome.storage (sync cache).
 * Call hydrateGmCache() before running the userscript body.
 */

type GmCache = Record<string, unknown>;

const cache: GmCache = Object.create(null);

export function hydrateGmCache(): Promise<void> {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(null, (items) => {
        Object.assign(cache, items || {});
        resolve();
      });
    } catch {
      resolve();
    }
  });
}

export function installGmPolyfill() {
  const root = globalThis as typeof globalThis & {
    GM_info?: unknown;
    GM_getValue?: (key: string, def?: unknown) => unknown;
    GM_setValue?: (key: string, value: unknown) => void;
    GM_addStyle?: (css: string) => HTMLStyleElement;
    GM_registerMenuCommand?: (name: string, fn: () => void) => void;
    GM_xmlhttpRequest?: (details: GmXhrDetails) => { abort: () => void };
    GM?: { xmlHttpRequest?: (details: GmXhrDetails) => { abort: () => void } };
    unsafeWindow?: Window;
    iziToast?: unknown;
  };

  type GmXhrDetails = {
    method?: string;
    url: string;
    headers?: Record<string, string>;
    data?: string;
    timeout?: number;
    anonymous?: boolean;
    responseType?: string;
    onload?: (res: {
      status: number;
      statusText: string;
      responseText: string;
      response: unknown;
      finalUrl: string;
    }) => void;
    onerror?: (res?: unknown) => void;
    ontimeout?: () => void;
    onabort?: () => void;
  };

  root.GM_info = {
    script: {
      name: 'Youtube Tools Extension',
      version: chrome.runtime?.getManifest?.()?.version || '2.0.0',
    },
  };

  root.GM_getValue = (key: string, def?: unknown) => {
    return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : def;
  };

  root.GM_setValue = (key: string, value: unknown) => {
    cache[key] = value;
    try {
      chrome.storage.local.set({ [key]: value });
    } catch {
      /* ignore */
    }
  };

  root.GM_addStyle = (css: string) => {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    return style;
  };

  root.GM_registerMenuCommand = () => {
    /* Extension uses popup instead of TM menu */
  };

  // Privileged XHR via background service worker (true CORS bypass, like Tampermonkey)
  root.GM_xmlhttpRequest = (details: GmXhrDetails) => {
    let aborted = false;
    const payload = {
      type: 'GM_XHR' as const,
      method: details.method || 'GET',
      url: details.url,
      headers: details.headers || {},
      data: details.data,
      timeout: details.timeout,
      anonymous: details.anonymous,
    };

    try {
      chrome.runtime.sendMessage(payload, (response) => {
        if (aborted) {
          details.onabort?.();
          return;
        }
        const lastErr = chrome.runtime.lastError;
        if (lastErr) {
          details.onerror?.(lastErr);
          return;
        }
        if (!response) {
          details.onerror?.(new Error('Empty GM_XHR response'));
          return;
        }
        if (!response.ok) {
          if (response.aborted || response.error === 'timeout') {
            details.ontimeout?.();
          } else {
            details.onerror?.(new Error(response.error || 'GM_XHR failed'));
          }
          return;
        }
        details.onload?.({
          status: Number(response.status) || 0,
          statusText: String(response.statusText || ''),
          responseText: String(response.responseText ?? ''),
          response: response.responseText ?? '',
          finalUrl: String(response.finalUrl || details.url),
        });
      });
    } catch (err) {
      details.onerror?.(err);
    }

    return {
      abort: () => {
        aborted = true;
        details.onabort?.();
      },
    };
  };
  root.GM = root.GM || {};
  root.GM.xmlHttpRequest = root.GM_xmlhttpRequest;

  root.unsafeWindow = window;
}

export function watchGmStorageSync() {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const [key, change] of Object.entries(changes)) {
      if (Object.prototype.hasOwnProperty.call(change, 'newValue')) {
        cache[key] = change.newValue;
      } else {
        delete cache[key];
      }
    }
  });
}
