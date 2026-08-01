/** Settings shape shared with Tampermonkey (`ytSettingsMDCM`) */

export const YT_SETTINGS_KEY = 'ytSettingsMDCM';

export type YtSettings = {
  theme: string;
  bgColorPicker: string;
  progressbarColorPicker: string;
  primaryColorPicker: string;
  secondaryColorPicker: string;
  headerColorPicker: string;
  iconsColorPicker: string;
  menuColorPicker: string;
  lineColorPicker: string;
  timeColorPicker: string;
  dislikes: boolean;
  likeDislikeBar: boolean;
  bookmarks: boolean;
  continueWatching: boolean;
  shortsChannelName: boolean;
  themes: boolean;
  translation: boolean;
  avatars: boolean;
  reverseMode: boolean;
  waveVisualizer: boolean;
  waveVisualizerSelected: string;
  hideComments: boolean;
  hideSidebar: boolean;
  disableAutoplay: boolean;
  cinematicLighting: boolean;
  syncCinematic: boolean;
  disableSubtitles: boolean;
  playerSize: number | string;
  selectVideoQuality: string;
  languagesComments: string;
  btnThumbnail: boolean;
  btnBuffer: boolean;
  btnFilterEyes: boolean;
  btnReset: boolean;
  btnRepeat: boolean;
  btnBookmark: boolean;
  btnContinueWatching: boolean;
  btnDownloadMp4: boolean;
  btnDownloadMp3: boolean;
  btnExternalDownload: boolean;
  btnViewExternal: boolean;
  btnPip: boolean;
  btnScreenshot: boolean;
  btnCheckUpdates: boolean;
  menu_developermdcm: {
    bg: string;
    color: string;
    accent: string;
  };
};

export const DEFAULT_YT_SETTINGS: YtSettings = {
  theme: 'custom',
  bgColorPicker: '#000000',
  progressbarColorPicker: '#ff0000',
  primaryColorPicker: '#ffffff',
  secondaryColorPicker: '#ffffff',
  headerColorPicker: '#000000',
  iconsColorPicker: '#ffffff',
  menuColorPicker: '#000000',
  lineColorPicker: '#ff0000',
  timeColorPicker: '#ffffff',
  dislikes: true,
  likeDislikeBar: false,
  bookmarks: false,
  continueWatching: false,
  shortsChannelName: false,
  themes: false,
  translation: false,
  avatars: false,
  reverseMode: false,
  waveVisualizer: false,
  waveVisualizerSelected: 'dinamica',
  hideComments: false,
  hideSidebar: false,
  disableAutoplay: false,
  cinematicLighting: false,
  syncCinematic: false,
  disableSubtitles: false,
  playerSize: 100,
  selectVideoQuality: 'user',
  languagesComments: 'en',
  btnThumbnail: true,
  btnBuffer: true,
  btnFilterEyes: true,
  btnReset: true,
  btnRepeat: true,
  btnBookmark: true,
  btnContinueWatching: true,
  btnDownloadMp4: true,
  btnDownloadMp3: true,
  btnExternalDownload: true,
  btnViewExternal: true,
  btnPip: true,
  btnScreenshot: true,
  btnCheckUpdates: true,
  menu_developermdcm: {
    bg: '#252525',
    color: '#ffffff',
    accent: '#ff0000',
  },
};

export const THEME_PRESETS = [
  'Default / Reload',
  'Midnight Blue',
  'Forest Green',
  'Sunset Orange',
  'Royal Purple',
  'Cherry Blossom',
  'Red Dark',
  'Raind',
  'Neon',
  'Azure',
  'Butterfly',
  'Colombia',
  'Mexico',
  'Brazil',
  'Argentina',
  'Spain',
  'France',
  'Germany',
  'Italy',
  'Japan',
  'South Korea',
  'USA',
  'United Kingdom',
  'India',
  'Canada',
  'Chile',
] as const;

export const THEME_PRESET_GRADIENTS: Record<string, string> = {
  '0': 'linear-gradient(135deg, #272727, #111)',
  '1': 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
  '2': 'linear-gradient(135deg, #14532d, #22c55e)',
  '3': 'linear-gradient(135deg, #7c2d12, #f97316)',
  '4': 'linear-gradient(135deg, #4c1d95, #8b5cf6)',
  '5': 'linear-gradient(135deg, #a9005c, #fc008f)',
  '6': 'linear-gradient(135deg, #790909, #f70131)',
  '7': 'linear-gradient(90deg, #3f5efb, #fc466b)',
  '8': 'linear-gradient(273deg, #ee49fd, #6175ff)',
  '9': 'linear-gradient(273deg, #0172af, #74febd)',
  '10': 'linear-gradient(273deg, #ff4060, #fff16a)',
  '11': 'linear-gradient(174deg, #fbf63f, #0000bb 45%, #ff0000)',
  '12': 'linear-gradient(180deg, #006847, #fff 48%, #ce1126)',
  '13': 'linear-gradient(135deg, #009c3b, #ffdf00 50%, #002776)',
  '14': 'linear-gradient(180deg, #74acdf, #fff 45%, #74acdf)',
  '15': 'linear-gradient(180deg, #aa151b, #f1bf00 45%, #aa151b)',
  '16': 'linear-gradient(90deg, #002395, #fff 50%, #ed2939)',
  '17': 'linear-gradient(180deg, #000, #dd0000 50%, #ffce00)',
  '18': 'linear-gradient(90deg, #009246, #fff 50%, #ce2b37)',
  '19': 'linear-gradient(135deg, #fff, #bc002d 55%, #111)',
  '20': 'linear-gradient(135deg, #003478, #fff 45%, #c60c30)',
  '21': 'linear-gradient(135deg, #3c3b6e, #fff 45%, #b22234)',
  '22': 'linear-gradient(135deg, #012169, #fff 40%, #c8102e)',
  '23': 'linear-gradient(180deg, #ff9933, #fff 48%, #138808)',
  '24': 'linear-gradient(90deg, #ff0000, #fff 50%, #ff0000)',
  '25': 'linear-gradient(180deg, #d52b1e, #fff 50%, #0039a6)',
};

export const WAVE_OPTIONS = [
  { value: 'linea', label: 'Line smooth' },
  { value: 'barras', label: 'Vertical bars' },
  { value: 'curva', label: 'Curved' },
  { value: 'picos', label: 'Smooth peaks' },
  { value: 'solida', label: 'Solid wave' },
  { value: 'dinamica', label: 'Dynamic wave' },
  { value: 'montana', label: 'Smooth mountain' },
] as const;

export const QUALITY_OPTIONS = [
  { value: 'user', label: 'User Default' },
  { value: '', label: 'Auto' },
  { value: '144', label: '144' },
  { value: '240', label: '240' },
  { value: '360', label: '360' },
  { value: '480', label: '480' },
  { value: '720', label: '720' },
  { value: '1080', label: '1080' },
  { value: '1440', label: '1440' },
  { value: '2160', label: '2160' },
] as const;

export const COMMENT_LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ru: 'Russian',
  ar: 'Arabic',
  hi: 'Hindi',
};

export function parseYtSettings(raw: unknown): YtSettings {
  let parsed: Partial<YtSettings> = {};
  try {
    if (typeof raw === 'string') parsed = JSON.parse(raw || '{}');
    else if (raw && typeof raw === 'object') parsed = raw as Partial<YtSettings>;
  } catch {
    parsed = {};
  }
  return {
    ...DEFAULT_YT_SETTINGS,
    ...parsed,
    menu_developermdcm: {
      ...DEFAULT_YT_SETTINGS.menu_developermdcm,
      ...(parsed.menu_developermdcm || {}),
    },
  };
}
