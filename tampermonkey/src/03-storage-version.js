// =============================================================================
// 03-storage-version.js — Storage cache + version check
// Source lines 613-786 of youtube_script_new_ui.js
// =============================================================================

  // ------------------------------
  // Feature helpers: videoId / channelId / storage
  // ------------------------------
  const STORAGE_KEYS_MDCM = {
    BOOKMARKS: 'ytBookmarksMDCM',
    CONTINUE_WATCHING: 'ytContinueWatchingMDCM',
    SHORTS_CHANNEL_CACHE: 'ytShortsChannelCacheMDCM',
    LIKES_DISLIKES_CACHE: 'ytLikesDislikesCacheMDCM',
    VERSION_CHECK_LAST: 'ytVersionCheckLastMDCM',
  };

  const UPDATE_META_URL = 'https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.meta.js';
  const VERSION_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // once per day

  const SHORTS_CHANNEL_TTL_MS = 24 * 24 * 60 * 60 * 1000;   // 7 days
  const LIKES_DISLIKES_TTL_MS = 7 * 24 * 60 * 60 * 1000;        // 7 days
  const PERSISTED_CACHE_MAX_ENTRIES = 500;

  function getShortsChannelFromPersistedCache(videoId) {
    try {
      const map = readJsonGM(STORAGE_KEYS_MDCM.SHORTS_CHANNEL_CACHE, {});
      const entry = map?.[videoId];
      if (!entry || typeof entry.channelName !== 'string') return null;
      const age = Date.now() - (Number(entry.ts) || 0);
      if (age > SHORTS_CHANNEL_TTL_MS) return null;
      return entry.channelName;
    } catch (e) { return null; }
  }

  function setShortsChannelToPersistedCache(videoId, channelName) {
    if (!videoId || typeof channelName !== 'string') return;
    try {
      const map = readJsonGM(STORAGE_KEYS_MDCM.SHORTS_CHANNEL_CACHE, {});
      map[videoId] = { channelName, ts: Date.now() };
      const entries = Object.entries(map).sort((a, b) => (Number(b[1]?.ts) || 0) - (Number(a[1]?.ts) || 0));
      const pruned = Object.fromEntries(entries.slice(0, PERSISTED_CACHE_MAX_ENTRIES));
      writeJsonGM(STORAGE_KEYS_MDCM.SHORTS_CHANNEL_CACHE, pruned);
    } catch (e) {}
  }

  function getLikesDislikesFromPersistedCache(videoId) {
    try {
      const map = readJsonGM(STORAGE_KEYS_MDCM.LIKES_DISLIKES_CACHE, {});
      const entry = map?.[videoId];
      if (!entry) return null;
      const age = Date.now() - (Number(entry.ts) || 0);
      if (age > LIKES_DISLIKES_TTL_MS) return null;
      const dislikes = Number(entry.dislikes);
      const likes = Number(entry.likes);
      const viewCount = Number(entry.viewCount);
      const rating = Number(entry.rating);
      return {
        likes: Number.isFinite(likes) ? likes : null,
        dislikes: Number.isFinite(dislikes) ? dislikes : null,
        viewCount: Number.isFinite(viewCount) ? viewCount : null,
        rating: Number.isFinite(rating) && rating >= 0 && rating <= 5 ? rating : null,
      };
    } catch (e) { return null; }
  }

  function setLikesDislikesToPersistedCache(videoId, likes, dislikes, viewCount, rating) {
    if (!videoId) return;
    try {
      const map = readJsonGM(STORAGE_KEYS_MDCM.LIKES_DISLIKES_CACHE, {});
      map[videoId] = { likes: likes ?? null, dislikes: dislikes ?? null, viewCount: viewCount ?? null, rating: rating ?? null, ts: Date.now() };
      const entries = Object.entries(map).sort((a, b) => (Number(b[1]?.ts) || 0) - (Number(a[1]?.ts) || 0));
      const pruned = Object.fromEntries(entries.slice(0, Math.min(PERSISTED_CACHE_MAX_ENTRIES, 300)));
      writeJsonGM(STORAGE_KEYS_MDCM.LIKES_DISLIKES_CACHE, pruned);
    } catch (e) {}
  }

  function getCurrentVideoId() {
    try {
      if (location.pathname.startsWith('/shorts/')) {
        const parts = location.pathname.split('/').filter(Boolean);
        return parts[1] || null;
      }
      if (location.href.includes('youtube.com/watch')) {
        return paramsVideoURL();
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  

  function readJsonGM(key, fallback) {
    try {
      const raw = GM_getValue(key, '');
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJsonGM(key, value) {
    try {
      GM_setValue(key, JSON.stringify(value));
    } catch (e) {
      console.error('writeJsonGM error:', e);
    }
  }

  function isVersionNewer(latestStr, currentStr) {
    if (!latestStr || !currentStr) return false;
    const parse = (s) => String(s).trim().split('.').map((n) => parseInt(n, 10) || 0);
    const a = parse(latestStr);
    const b = parse(currentStr);
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const x = a[i] || 0;
      const y = b[i] || 0;
      if (x > y) return true;
      if (x < y) return false;
    }
    return false;
  }

  async function checkNewVersion() {
    try {
      const last = GM_getValue(STORAGE_KEYS_MDCM.VERSION_CHECK_LAST, 0);
      if (Date.now() - last < VERSION_CHECK_INTERVAL_MS) return;
      GM_setValue(STORAGE_KEYS_MDCM.VERSION_CHECK_LAST, Date.now());

      const res = await fetch(UPDATE_META_URL, { cache: 'no-store' });
      if (!res.ok) return;
      const text = await res.text();
      const m = text.match(/@version\s+([\d.]+)/);
      if (!m) return;
      const latestVer = m[1].trim();
      const currentVer = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version)
        ? String(GM_info.script.version).trim()
        : '';
      if (!currentVer || !isVersionNewer(latestVer, currentVer)) return;

      const updateUrl = 'https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.user.js';
      iziToast.info({
        title: 'Nueva versión disponible',
        message: 'YouTube Tools v' + latestVer + ' está disponible. Haz clic para actualizar.',
        position: 'bottomLeft',
        timeout: 12000,
        progressBar: true,
        closeOnClick: true,
        onclick: function () {
          window.open(updateUrl, '_blank');
        },
      });
    //   iziToast.show({
    //     title: 'New Update',
    //     message: 'A new version is available.',
    //     buttons: [
    //         ['<button>View Now</button>', function (instance, toast) {
    //             window.open('https://your-site.com', '_blank');
    //             instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
    //         }, true] // true = focus
    //     ]
    // });
    } catch (e) {
      // silent: network or parse error
    }
  }

  function formatTimeShort(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
  }



