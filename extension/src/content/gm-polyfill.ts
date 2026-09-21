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

  // Bypass page CORS via extension host_permissions + fetch
  root.GM_xmlhttpRequest = (details: GmXhrDetails) => {
    const ctrl = new AbortController();
    const timeoutMs = Number(details.timeout) || 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        ctrl.abort();
        details.ontimeout?.();
      }, timeoutMs);
    }

    const headers = new Headers(details.headers || {});
    fetch(details.url, {
      method: (details.method || 'GET').toUpperCase(),
      headers,
      body: details.data,
      signal: ctrl.signal,
      credentials: details.anonymous ? 'omit' : 'include',
    })
      .then(async (res) => {
        const responseText = await res.text();
        details.onload?.({
          status: res.status,
          statusText: res.statusText,
          responseText,
          response: responseText,
          finalUrl: res.url,
        });
      })
      .catch((err) => {
        if (ctrl.signal.aborted && details.ontimeout) return;
        details.onerror?.(err);
      })
      .finally(() => {
        if (timer) clearTimeout(timer);
      });

    return {
      abort: () => {
        ctrl.abort();
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
