import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { hydrateGmCache, installGmPolyfill, watchGmStorageSync } from './gm-polyfill';
import { initThemeBridge } from './theme-bridge';
import { runYoutubeTools } from './generated-userscript';
import { YT_SETTINGS_KEY } from '../shared/ytSettings';

declare global {
  interface Window {
    iziToast: typeof iziToast;
    __ytToolsLoadSettings?: (() => void) | null;
    __ytToolsApplySettings?: (() => void) | null;
  }
}

function reloadFromStorage() {
  try {
    window.__ytToolsLoadSettings?.();
  } catch (err) {
    console.warn('[Youtube Tools Extension] live reload failed', err);
  }
}

function bindLiveUpdates() {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes[YT_SETTINGS_KEY]) {
      // Small delay so GM cache from watchGmStorageSync is updated first
      setTimeout(reloadFromStorage, 50);
    }
  });

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (
      request?.message === 'YT_TOOLS_SETTINGS_UPDATED' ||
      request?.message === 'ToggleGeneral' ||
      request?.message === 'ToggleThemes' ||
      request?.message === 'ToggleFeatures'
    ) {
      setTimeout(reloadFromStorage, 50);
      sendResponse?.({ ok: true });
      return true;
    }
    return false;
  });
}

async function boot() {
  globalThis.__YT_TOOLS_EXTENSION__ = true;
  (globalThis as typeof globalThis & { iziToast: typeof iziToast }).iziToast = iziToast;
  window.iziToast = iziToast;

  installGmPolyfill();
  await hydrateGmCache();
  watchGmStorageSync();
  initThemeBridge();
  bindLiveUpdates();

  try {
    runYoutubeTools();
    console.log('[Youtube Tools Extension] engine started (popup-only menu)');
  } catch (err) {
    console.error('[Youtube Tools Extension] userscript failed:', err);
  }
}

void boot();
