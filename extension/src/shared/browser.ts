/**
 * Thin chrome / browser API wrapper.
 * Works in Chrome, Edge, and Firefox (browser.* or chrome.*).
 * On localhost (Vite preview) falls back to a memory + localStorage mock.
 */

type StorageArea = {
  get: (keys?: string | string[] | Record<string, unknown> | null) => Promise<Record<string, unknown>>;
  set: (items: Record<string, unknown>) => Promise<void>;
};

type RuntimeApi = {
  sendMessage: (message: unknown) => Promise<unknown>;
  onMessage?: {
    addListener: (cb: (message: unknown, sender: unknown, sendResponse: (r?: unknown) => void) => void) => void;
  };
  lastError?: { message?: string };
};

type BrowserLike = {
  storage?: { local: StorageArea };
  runtime?: RuntimeApi;
  tabs?: {
    query: (queryInfo: { active?: boolean; currentWindow?: boolean }) => Promise<Array<{ id?: number; url?: string }>>;
    sendMessage: (tabId: number, message: unknown) => Promise<unknown>;
  };
};

declare const browser: BrowserLike | undefined;
declare const chrome: BrowserLike | undefined;

function getNative(): BrowserLike | null {
  if (typeof browser !== 'undefined' && browser?.storage) return browser;
  if (typeof chrome !== 'undefined' && chrome?.storage) return chrome;
  return null;
}

export function isExtensionContext(): boolean {
  return getNative() !== null;
}

const memory = new Map<string, unknown>();

function mockStorage(): StorageArea {
  return {
    async get(keys) {
      const out: Record<string, unknown> = {};
      const read = (key: string) => {
        if (memory.has(key)) return memory.get(key);
        try {
          const raw = localStorage.getItem(`ext:${key}`);
          if (raw != null) {
            const parsed = JSON.parse(raw);
            memory.set(key, parsed);
            return parsed;
          }
        } catch {
          /* ignore */
        }
        return undefined;
      };

      if (keys == null) {
        for (const [k, v] of memory) out[k] = v;
        return out;
      }
      if (typeof keys === 'string') {
        const v = read(keys);
        if (v !== undefined) out[keys] = v;
        return out;
      }
      if (Array.isArray(keys)) {
        for (const k of keys) {
          const v = read(k);
          if (v !== undefined) out[k] = v;
        }
        return out;
      }
      for (const [k, def] of Object.entries(keys)) {
        const v = read(k);
        out[k] = v !== undefined ? v : def;
      }
      return out;
    },
    async set(items) {
      for (const [k, v] of Object.entries(items)) {
        memory.set(k, v);
        try {
          localStorage.setItem(`ext:${k}`, JSON.stringify(v));
        } catch {
          /* ignore */
        }
      }
    },
  };
}

function wrapCallbackStorage(nativeLocal: unknown): StorageArea {
  const area = nativeLocal as {
    get: (keys: unknown, cb: (result: Record<string, unknown>) => void) => void;
    set: (items: Record<string, unknown>, cb?: () => void) => void;
  };

  return {
    get(keys) {
      return new Promise((resolve) => {
        area.get(keys ?? null, (result) => resolve(result || {}));
      });
    },
    set(items) {
      return new Promise((resolve) => {
        area.set(items, () => resolve());
      });
    },
  };
}

export function getStorageLocal(): StorageArea {
  const native = getNative();
  if (!native?.storage?.local) return mockStorage();

  const local = native.storage.local as unknown as { get: (...args: unknown[]) => unknown };
  // Promise-based (Firefox / newer chrome) vs callback-based
  try {
    const maybePromise = local.get.call(native.storage.local, null);
    if (maybePromise && typeof (maybePromise as Promise<unknown>).then === 'function') {
      return native.storage.local;
    }
  } catch {
    /* fall through to callback wrap */
  }
  return wrapCallbackStorage(native.storage.local);
}

export async function sendToActiveTab(message: unknown): Promise<unknown> {
  const native = getNative();
  if (!native?.tabs?.query || !native.tabs.sendMessage) return null;
  const tabs = await new Promise<Array<{ id?: number }>>((resolve) => {
    const result = native.tabs!.query({ active: true, currentWindow: true });
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      (result as Promise<Array<{ id?: number }>>).then(resolve);
    } else {
      (native.tabs!.query as unknown as (q: unknown, cb: (t: Array<{ id?: number }>) => void) => void)(
        { active: true, currentWindow: true },
        resolve
      );
    }
  });
  const tabId = tabs[0]?.id;
  if (tabId == null) return null;
  try {
    return await native.tabs.sendMessage(tabId, message);
  } catch {
    return null;
  }
}
