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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'YT_TOOLS_PING' || message?.message === 'YT_TOOLS_PING') {
    sendResponse({ ok: true, version: chrome.runtime.getManifest().version });
    return true;
  }
  return false;
});
