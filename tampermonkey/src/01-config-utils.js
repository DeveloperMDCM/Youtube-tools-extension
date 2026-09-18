// =============================================================================
// 01-config-utils.js — Config, helpers, runtime, Notify
// Source lines 101-368 of youtube_script_new_ui.js
// =============================================================================

  let validoUrl = document.location.href;
  // When true (Chrome/Edge/Firefox extension), the in-page gear menu is hidden;
  // the extension popup is the only settings UI.
  const IS_EXTENSION = !!globalThis.__YT_TOOLS_EXTENSION__;
  const $e = (el) => document.querySelector(el); // any element
  const $id = (el) => document.getElementById(el); // element by id
  const $m = (el) => document.querySelectorAll(el); // multiple all elements
  const $cl = (el, pty) => document.createElement(el); // create element
  const $sp = (el, pty) => document.documentElement.style.setProperty(el, pty); // set property variable css
  const $ap = (el) => document.body.appendChild(el); // append element
  const apiDislikes = "https://returnyoutubedislikeapi.com/Votes?videoId="; // Api dislikes
  const apiGoogleTranslate = "https://translate.googleapis.com/translate_a/t"; // Api google translate
  let selectedBgColor = "#0c0c0c"; // Background color menu default
  let selectedTextColor = "#ffffff"; // Text color menu default
  let selectedBgAccentColor = "#ff0000"; // Accent color menu default
  const urlSharedCode = "https://greasyfork.org/es/scripts/460680-youtube-tools-all-in-one-local-download-mp3-mp4-higt-quality-return-dislikes-and-more";
  const API_URL_AUDIO_VIDEO = "https://p.savenow.to/ajax/download.php?copyright=0&allow_extended_duration=1&" // API URL AUDIO VIDEO
  const API_KEY_DEVELOPERMDCM = 'dfcb6d76f2f6a9894gjkege8a4ab232222';  // API KEY FOR DOWNLOAD AUDIO VIDEO
  // Download API fallbacks (region/session issues)
  const DOWNLOAD_API_FALLBACK_BASES = [
    "https://p.savenow.to",
    "https://p.lbserver.xyz",
  ];
  // Alternative provider fallback
  const DUBS_START_ENDPOINT = "https://dubs.io/wp-json/tools/v1/download-video";
  const DUBS_STATUS_ENDPOINT = "https://dubs.io/wp-json/tools/v1/status-video";

  // for translate comments video
  const languagesTranslate = {
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "ko": "Korean",
    "ku": "Kurdish",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ny": "Nyanja (Chichewa)",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tl": "Tagalog (Filipino)",
    "tg": "Tajik",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
  }


   // var for wave
  let currentVideo = null;

  let waveStyle = 'dinamica';
  let audioCtx = null;
  let analyser = null;
  let source = null;
  let animationId = null;
  let canvas = null;
  let ctx = null;
  let controlPanel = null;
  let bufferLength = 0;
  let dataArray = null;
  let smoothedData = [];
  let isSetup = false;
  const smoothingFactor = 0.05;
  const canvasHeight = 240;
  const scale = canvasHeight / 90;

  const PROCESSED_FLAG = 'wave_visualizer_processed';

  // ------------------------------
  // PERF: runtime guards + dynamic style (avoid style/event/interval leaks)
  // ------------------------------
  const __ytToolsRuntime = {
    dynamicStyleEl: null,
    dynamicCssLast: '',
    settingsLoaded: false,
    bookmarkClickHandlerInitialized: false,
    bookmarksPanelOpen: false,
    continueWatching: {
      enabled: false,
      map: null,
      flushT: null,
      boundVideo: null,
      boundVideoId: null,
      lastSaveAt: 0,
      lastSavedTime: -1,
      lastKnownVideoId: null,
      navHandlerInitialized: false,
      panelOpen: false,
      clickHandlerInitialized: false,
      pagehideHandlerInitialized: false,
      handlers: null,
    },
    shortsChannelName: {
      enabled: false,
      observer: null,
      io: null,
      scanT: null,
      cache: new Map(),        // videoId -> channelName
      inflight: new Map(),     // videoId -> Promise<string>
      fetchChain: Promise.resolve(),
    },
    dislikesCache: {
      videoId: null,
      dislikes: null,
      ts: 0,
    },
    downloadClickHandlerInitialized: false,
    transcriptClickHandlerInitialized: false,
    transcriptPanelOpen: false,
    shortsObserver: null,
    statsObserver: null,
    statsIntervalId: null,
    lockupCachedStatsObserver: null,
    lockupCachedStatsObserveTarget: null,
    lockupCachedStatsIntervalId: null,
    updateShortsViewsButton: function () {},
    updateShortsRatingButton: function () {},
  };

  function setDynamicCss(cssText = '') {
    if (!__ytToolsRuntime.dynamicStyleEl) {
      const style = document.createElement('style');
      style.id = 'yt-tools-mdcm-dynamic-style';
      document.head.appendChild(style);
      __ytToolsRuntime.dynamicStyleEl = style;
    }
    if (__ytToolsRuntime.dynamicCssLast === cssText) return;
    __ytToolsRuntime.dynamicCssLast = cssText;
    __ytToolsRuntime.dynamicStyleEl.textContent = cssText;
  }

  const scheduleApplySettings = (() => {
    let t = null;
    return () => {
      // Prevent overwriting saved config with defaults before loadSettings finishes.
      if (!__ytToolsRuntime.settingsLoaded) return;
      clearTimeout(t);
      t = setTimeout(() => {
        try {
          applySettings();
        } catch (err) {
          console.error('applySettings error:', err);
        }
      }, 120);
    };
  })();

  function hideCanvas() {

    const canvas = $id('wave-visualizer-canvas');
    if (canvas) {
        canvas.style.opacity = '0';
        if (controlPanel) {
            controlPanel.style.opacity = '0';
        }
    }
  }

    function showCanvas() {
    const canvas = $id('wave-visualizer-canvas');
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (canvas) {
        canvas.style.opacity = '1';
        if (controlPanel) controlPanel.style.opacity = '1';
    }
}


  function Notify(type = 'info', message = '', title = '') {
    const defaultTitles = {
        success: 'Success',
        error: 'Error',
        info: 'Information',
        warning: 'Warning',
    };

    iziToast[type]({
        title: title || defaultTitles[type] || 'Notification',
        message: message,
        position: 'bottomLeft',
      });
  }
