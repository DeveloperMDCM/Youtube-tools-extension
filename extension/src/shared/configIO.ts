import {
  DEFAULT_YT_SETTINGS,
  THEME_PRESETS,
  WAVE_OPTIONS,
  QUALITY_OPTIONS,
  COMMENT_LANGUAGES,
  type YtSettings,
} from './ytSettings';
import { USERSCRIPT_VERSION, getExtensionVersion } from './versions';

export const CONFIG_MAGIC = 'developermdcm';
export const CONFIG_FILE_EXT = '.developermdcm';
export const CONFIG_FORMAT_VERSION = 1;

export type ConfigBundle = {
  magic: typeof CONFIG_MAGIC;
  formatVersion: number;
  app: 'youtube-tools';
  extensionVersion: string;
  userscriptVersion: string;
  exportedAt: string;
  settings: YtSettings;
};

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const WAVE_VALUES = new Set(WAVE_OPTIONS.map((o) => o.value));
const QUALITY_VALUES = new Set(QUALITY_OPTIONS.map((o) => o.value));
const LANG_VALUES = new Set(Object.keys(COMMENT_LANGUAGES));
const MAX_THEME_INDEX = THEME_PRESETS.length - 1;

const COLOR_KEYS = [
  'bgColorPicker',
  'progressbarColorPicker',
  'primaryColorPicker',
  'secondaryColorPicker',
  'headerColorPicker',
  'iconsColorPicker',
  'menuColorPicker',
  'lineColorPicker',
  'timeColorPicker',
] as const;

const BOOL_KEYS = [
  'dislikes',
  'likeDislikeBar',
  'bookmarks',
  'continueWatching',
  'shortsChannelName',
  'themes',
  'translation',
  'avatars',
  'reverseMode',
  'waveVisualizer',
  'hideComments',
  'hideSidebar',
  'disableAutoplay',
  'cinematicLighting',
  'syncCinematic',
  'disableSubtitles',
  'btnThumbnail',
  'btnBuffer',
  'btnFilterEyes',
  'btnReset',
  'btnRepeat',
  'btnBookmark',
  'btnContinueWatching',
  'btnDownloadMp4',
  'btnDownloadMp3',
  'btnExternalDownload',
  'btnViewExternal',
  'btnPip',
  'btnScreenshot',
  'btnCheckUpdates',
] as const;

function isHex(value: unknown): value is string {
  return typeof value === 'string' && HEX_RE.test(value.trim());
}

function safeHex(value: unknown, fallback: string): string {
  if (!isHex(value)) return fallback;
  return value.trim().toLowerCase();
}

function safeBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function safeTheme(value: unknown): string {
  if (value === 'custom' || value === 'normal') return value;
  const n = Number(value);
  if (Number.isInteger(n) && n >= 0 && n <= MAX_THEME_INDEX) return String(n);
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const i = Number(value);
    if (i >= 0 && i <= MAX_THEME_INDEX) return value;
  }
  return DEFAULT_YT_SETTINGS.theme;
}

function safePlayerSize(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 100;
  return Math.min(150, Math.max(50, Math.round(n)));
}

/** Sanitize any unknown payload into a safe YtSettings object. */
export function sanitizeYtSettings(raw: unknown): YtSettings {
  let src: Record<string, unknown> = {};
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') src = parsed as Record<string, unknown>;
    } catch {
      src = {};
    }
  } else if (raw && typeof raw === 'object') {
    src = raw as Record<string, unknown>;
  }

  // Support wrapped bundles
  if (src.settings && typeof src.settings === 'object') {
    src = src.settings as Record<string, unknown>;
  }

  const next: YtSettings = { ...DEFAULT_YT_SETTINGS };

  next.theme = safeTheme(src.theme);
  for (const key of COLOR_KEYS) {
    next[key] = safeHex(src[key], DEFAULT_YT_SETTINGS[key]);
  }
  for (const key of BOOL_KEYS) {
    next[key] = safeBool(src[key], DEFAULT_YT_SETTINGS[key]);
  }

  const wave = src.waveVisualizerSelected;
  next.waveVisualizerSelected =
    typeof wave === 'string' && WAVE_VALUES.has(wave as never)
      ? wave
      : DEFAULT_YT_SETTINGS.waveVisualizerSelected;

  const quality = src.selectVideoQuality;
  next.selectVideoQuality =
    typeof quality === 'string' && QUALITY_VALUES.has(quality as never)
      ? quality
      : DEFAULT_YT_SETTINGS.selectVideoQuality;

  const lang = src.languagesComments;
  next.languagesComments =
    typeof lang === 'string' && LANG_VALUES.has(lang)
      ? lang
      : DEFAULT_YT_SETTINGS.languagesComments;

  next.playerSize = safePlayerSize(src.playerSize);

  const menuRaw =
    src.menu_developermdcm && typeof src.menu_developermdcm === 'object'
      ? (src.menu_developermdcm as Record<string, unknown>)
      : {};
  next.menu_developermdcm = {
    bg: safeHex(menuRaw.bg, DEFAULT_YT_SETTINGS.menu_developermdcm.bg),
    color: safeHex(menuRaw.color, DEFAULT_YT_SETTINGS.menu_developermdcm.color),
    accent: safeHex(menuRaw.accent, DEFAULT_YT_SETTINGS.menu_developermdcm.accent),
  };

  return next;
}

export function createConfigBundle(settings: YtSettings): ConfigBundle {
  return {
    magic: CONFIG_MAGIC,
    formatVersion: CONFIG_FORMAT_VERSION,
    app: 'youtube-tools',
    extensionVersion: getExtensionVersion(),
    userscriptVersion: USERSCRIPT_VERSION,
    exportedAt: new Date().toISOString(),
    settings: sanitizeYtSettings(settings),
  };
}

export function serializeConfigBundle(settings: YtSettings): string {
  return JSON.stringify(createConfigBundle(settings), null, 2);
}

export type ImportResult =
  | { ok: true; settings: YtSettings; fromBundle: boolean }
  | { ok: false; error: 'invalid_json' | 'invalid_magic' | 'empty' };

export function parseConfigImport(text: string): ImportResult {
  const trimmed = (text || '').trim();
  if (!trimmed) return { ok: false, error: 'empty' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'invalid_json' };
  }

  const obj = parsed as Record<string, unknown>;
  const isBundle = obj.magic === CONFIG_MAGIC || obj.app === 'youtube-tools';

  // Accept legacy raw settings OR signed bundles
  if (obj.magic != null && obj.magic !== CONFIG_MAGIC) {
    return { ok: false, error: 'invalid_magic' };
  }

  const settings = sanitizeYtSettings(isBundle && obj.settings ? obj.settings : obj);
  return { ok: true, settings, fromBundle: !!isBundle };
}

export function downloadConfigFile(settings: YtSettings) {
  const body = serializeConfigBundle(settings);
  const blob = new Blob([body], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `youtube-tools-${stamp}${CONFIG_FILE_EXT}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function readConfigFile(file: File): Promise<ImportResult> {
  const name = (file.name || '').toLowerCase();
  if (
    name &&
    !name.endsWith(CONFIG_FILE_EXT) &&
    !name.endsWith('.json') &&
    !name.endsWith('.txt')
  ) {
    // Still try to parse — but prefer our extension
  }
  const text = await file.text();
  return parseConfigImport(text);
}
