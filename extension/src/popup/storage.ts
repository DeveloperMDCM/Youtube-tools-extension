/**
 * chrome.storage.local wrapper with localStorage mock for Vite preview.
 */
type ChangeListener = (
  changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
  area: string
) => void;

const listeners = new Set<ChangeListener>();
const PREFIX = 'yt-ext:';

function isChromeStorageAvailable(): boolean {
  try {
    return typeof chrome !== 'undefined' && !!chrome?.storage?.local;
  } catch {
    return false;
  }
}

function notify(changes: Record<string, { oldValue?: unknown; newValue?: unknown }>) {
  listeners.forEach((fn) => fn(changes, 'local'));
}

export const extStorage = {
  get<T extends Record<string, unknown>>(
    keys: string[] | Record<string, unknown>,
    cb: (result: T) => void
  ) {
    if (isChromeStorageAvailable()) {
      chrome.storage.local.get(keys, (result) => cb(result as T));
      return;
    }

    const out: Record<string, unknown> = {};
    const list = Array.isArray(keys) ? keys : Object.keys(keys);
    const defaults = Array.isArray(keys) ? {} : keys;

    for (const key of list) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        if (raw != null) out[key] = JSON.parse(raw);
        else if (key in defaults) out[key] = defaults[key];
      } catch {
        if (key in defaults) out[key] = defaults[key];
      }
    }
    cb(out as T);
  },

  set(items: Record<string, unknown>, cb?: () => void) {
    if (isChromeStorageAvailable()) {
      chrome.storage.local.set(items, () => cb?.());
      return;
    }

    const changes: Record<string, { oldValue?: unknown; newValue?: unknown }> = {};
    for (const [key, value] of Object.entries(items)) {
      let oldValue: unknown;
      try {
        const raw = localStorage.getItem(PREFIX + key);
        oldValue = raw != null ? JSON.parse(raw) : undefined;
      } catch {
        oldValue = undefined;
      }
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      changes[key] = { oldValue, newValue: value };
    }
    notify(changes);
    cb?.();
  },

  remove(keys: string | string[], cb?: () => void) {
    const list = Array.isArray(keys) ? keys : [keys];
    if (isChromeStorageAvailable()) {
      chrome.storage.local.remove(list, () => cb?.());
      return;
    }
    const changes: Record<string, { oldValue?: unknown; newValue?: unknown }> = {};
    for (const key of list) {
      let oldValue: unknown;
      try {
        const raw = localStorage.getItem(PREFIX + key);
        oldValue = raw != null ? JSON.parse(raw) : undefined;
      } catch {
        oldValue = undefined;
      }
      localStorage.removeItem(PREFIX + key);
      changes[key] = { oldValue, newValue: undefined };
    }
    notify(changes);
    cb?.();
  },

  onChanged: {
    addListener(fn: ChangeListener) {
      if (isChromeStorageAvailable()) {
        chrome.storage.onChanged.addListener(fn as never);
        return;
      }
      listeners.add(fn);
    },
    removeListener(fn: ChangeListener) {
      if (isChromeStorageAvailable()) {
        chrome.storage.onChanged.removeListener(fn as never);
        return;
      }
      listeners.delete(fn);
    },
  },
};

export function notifyYoutubeTabs(message: unknown) {
  if (!isChromeStorageAvailable() || !chrome?.tabs?.query) return;
  try {
    chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] }, (tabs) => {
      for (const tab of tabs) {
        if (tab.id == null) continue;
        try {
          chrome.tabs.sendMessage(tab.id, message, () => {
            void chrome.runtime.lastError;
          });
        } catch {
          /* tab may not have content script yet */
        }
      }
    });
  } catch {
    /* ignore in preview */
  }
}


export function isExtensionRuntime() {
  return isChromeStorageAvailable();
}
