/** Keep in sync with tampermonkey/src/header.meta.js @version */
export const USERSCRIPT_VERSION = '2.5';

/** Fallback when chrome.runtime is unavailable (Vite preview) */
export const EXTENSION_VERSION_FALLBACK = '2.0.0';

export const SHARE_URL =
  'https://greasyfork.org/es/scripts/460680-youtube-tools-all-in-one-local-download-mp3-mp4-higt-quality-return-dislikes-and-more';

export const GITHUB_URL = 'https://github.com/DeveloperMDCM';

export function getExtensionVersion(): string {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
      return chrome.runtime.getManifest().version || EXTENSION_VERSION_FALLBACK;
    }
  } catch {
    /* preview */
  }
  return EXTENSION_VERSION_FALLBACK;
}
