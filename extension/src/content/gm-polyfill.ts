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
    unsafeWindow?: Window;
    iziToast?: unknown;
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
