import { DEFAULT_SETTINGS, STORAGE_KEY, type ExtensionSettings } from './defaults';
import { getStorageLocal } from './browser';

export async function loadSettings(): Promise<ExtensionSettings> {
  const store = getStorageLocal();
  const data = await store.get({ [STORAGE_KEY]: DEFAULT_SETTINGS });
  const raw = (data[STORAGE_KEY] || {}) as Partial<ExtensionSettings>;
  return { ...DEFAULT_SETTINGS, ...raw };
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  const store = getStorageLocal();
  await store.set({ [STORAGE_KEY]: settings });
}
