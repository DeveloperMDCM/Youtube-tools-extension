// =============================================================================
// 08-dislikes.js — Dislikes bar + Trusted Types
// Source lines 1859-2141 of youtube_script_new_ui.js
// =============================================================================

  // ------------------------------
  // Feature: Like vs Dislike bar
  // ------------------------------
  function parseCountText(text) {
    if (!text) return null;
    const s0 = String(text).trim().toLowerCase();
    if (!s0) return null;
    let mult = 1;
    let s = s0.replace(/\s+/g, '');
    if (s.includes('mil')) {
      mult = 1000;
      s = s.replace('mil', '');
    } else if (s.includes('k')) {
      mult = 1000;
      s = s.replace('k', '');
    } else if (s.includes('m')) {
      mult = 1000000;
      s = s.replace('m', '');
    }
    // normalize decimal separators
    s = s.replace(/[^\d.,]/g, '');
    if (!s) return null;
    // If both separators exist, assume last is decimal
    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    let nStr = s;
    if (lastDot !== -1 && lastComma !== -1) {
      const dec = Math.max(lastDot, lastComma);
      const intPart = s.slice(0, dec).replace(/[.,]/g, '');
      const decPart = s.slice(dec + 1);
      nStr = `${intPart}.${decPart}`;
    } else {
      // Use dot as decimal
      nStr = s.replace(',', '.');
    }
    const num = Number.parseFloat(nStr);
    if (!Number.isFinite(num)) return null;
    return Math.round(num * mult);
  }

  async function ensureDislikesForCurrentVideo() {
    const videoId = getCurrentVideoId();
    if (!videoId) return null;
    const now = Date.now();
    if (__ytToolsRuntime.dislikesCache.videoId === videoId && __ytToolsRuntime.dislikesCache.dislikes != null && (now - __ytToolsRuntime.dislikesCache.ts) < 10 * 60 * 1000) {
      return __ytToolsRuntime.dislikesCache.dislikes;
    }
    const persisted = getLikesDislikesFromPersistedCache(videoId);
    if (persisted && persisted.dislikes != null) {
      __ytToolsRuntime.dislikesCache = { videoId, dislikes: persisted.dislikes, ts: now };
      return persisted.dislikes;
    }
    try {
      const res = await fetch(`${apiDislikes}${videoId}`);
      const data = await res.json();
      const dislikes = Number(data?.dislikes);
      const viewCount = Number(data?.viewCount);
      const rating = Number(data?.rating);
      if (Number.isFinite(dislikes)) {
        __ytToolsRuntime.dislikesCache = { videoId, dislikes, ts: now };
        const likes = getLikesFromDom();
        setLikesDislikesToPersistedCache(videoId, likes != null ? likes : undefined, dislikes, Number.isFinite(viewCount) ? viewCount : undefined, (Number.isFinite(rating) && rating >= 0 && rating <= 5) ? rating : undefined);
        return dislikes;
      }
    } catch (e) {}
    return null;
  }

  function getLikesFromDom() {
    // Try grab visible like count (YouTube UI varies a lot)
    const likeBtn =
      $e('#top-level-buttons-computed like-button-view-model button-view-model button') ||
      $e('#top-level-buttons-computed like-button-view-model button') ||
      $e('#top-level-buttons-computed ytd-toggle-button-renderer:nth-child(1)') ||
      $e('segmented-like-dislike-button-view-model like-button-view-model');
    if (!likeBtn) return null;

    // Prefer visible counter first; aria-label can include locale thousands separators (17.606) that are ambiguous.
    const candidates = [
      likeBtn.querySelector?.('.yt-spec-button-shape-next__button-text-content')?.textContent,
      likeBtn.textContent,
      likeBtn.getAttribute?.('aria-label'),
    ].filter(Boolean);

    for (const txt of candidates) {
      const n = parseCountText(txt);
      if (n != null) return n;
    }
    return null;
  }

  function updateLikeDislikeBar(likes, dislikes) {
    // Prefer placing it above the "copy description" button (as requested).
    const copyDesc = $id('button_copy_description');
    const host =
      $e('#top-level-buttons-computed') ||
      $e('ytd-watch-metadata #top-level-buttons-computed');
    if (!host && !copyDesc) return;

    let bar = $id('yt-like-dislike-bar-mdcm');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'yt-like-dislike-bar-mdcm';
      bar.innerHTML = `<div class="like"></div><div class="dislike"></div>`;
      if (copyDesc) {
        copyDesc.insertAdjacentElement('beforebegin', bar);
      } else {
        host.appendChild(bar);
      }
    } else if (copyDesc && bar.previousElementSibling !== copyDesc) {
      // Keep it near the copy description area if the DOM changed
      try { copyDesc.insertAdjacentElement('beforebegin', bar); } catch (e) {}
    }

    if (!Number.isFinite(likes) || !Number.isFinite(dislikes) || likes + dislikes <= 0) {
      bar.style.display = 'none';
      return;
    }

    const total = likes + dislikes;
    const likePct = Math.max(0, Math.min(100, (likes / total) * 100));
    const dislikePct = 100 - likePct;
    bar.style.display = 'block';
    const likeEl = bar.querySelector('.like');
    const dislikeEl = bar.querySelector('.dislike');
    likeEl.style.width = `${likePct}%`;
    dislikeEl.style.width = `${dislikePct}%`;
    bar.title = `Likes: ${likes.toLocaleString()} | Dislikes: ${dislikes.toLocaleString()}`;
  }

  async function applyLikeDislikeBarIfEnabled(settings) {
    if (!settings?.likeDislikeBar) {
      const existing = $id('yt-like-dislike-bar-mdcm');
      if (existing) existing.style.display = 'none';
      return;
    }
    if (!window.location.href.includes('youtube.com/watch')) return;
    const videoId = getCurrentVideoId();
    if (!videoId) return;
    const dislikes = await ensureDislikesForCurrentVideo();
    let likes = getLikesFromDom();
    if (likes == null) {
      const persisted = getLikesDislikesFromPersistedCache(videoId);
      if (persisted?.likes != null) likes = persisted.likes;
    }
    if (dislikes == null || likes == null) return;
    updateLikeDislikeBar(likes, dislikes);
  }

  // Retry helper (YT often renders likes late; keep it lightweight)
  function scheduleLikeBarUpdate(settings, attempts = 4) {
    if (!settings?.likeDislikeBar) return;
    let i = 0;
    const tick = async () => {
      i += 1;
      await applyLikeDislikeBarIfEnabled(settings);
      const bar = $id('yt-like-dislike-bar-mdcm');
      if (bar && bar.style.display !== 'none') return;
      if (i < attempts) setTimeout(tick, 800);
    };
    setTimeout(tick, 300);
  }

//   Dislikes video
  async function videoDislike() {

    validoUrl = document.location.href;

    const validoVentana = $e('#below > ytd-watch-metadata > div');
    if (validoVentana != undefined && document.location.href.split('?v=')[0].includes('youtube.com/watch')) {
        validoUrl = paramsVideoURL();
        let dislikes = null;
        const persisted = getLikesDislikesFromPersistedCache(validoUrl);
        if (persisted && persisted.dislikes != null) {
          dislikes = persisted.dislikes;
        } else {
          const urlShorts = `${apiDislikes}${validoUrl}`;
          try {
            const respuesta = await fetch(urlShorts);
            const datosShort = await respuesta.json();
            dislikes = Number(datosShort?.dislikes);
            if (Number.isFinite(dislikes)) {
              const likes = getLikesFromDom();
              const viewCount = Number(datosShort?.viewCount);
              const rating = Number(datosShort?.rating);
              setLikesDislikesToPersistedCache(validoUrl, likes != null ? likes : undefined, dislikes, Number.isFinite(viewCount) ? viewCount : undefined, (Number.isFinite(rating) && rating >= 0 && rating <= 5) ? rating : undefined);
            }
          } catch (error) {
            console.log(error);
          }
        }
        if (dislikes != null) {
          const dislikes_content = $e('#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > dislike-button-view-model > toggle-button-view-model > button-view-model > button');
          if (dislikes_content !== undefined) {
            dislikes_content.style = 'width: 90px';
            dislikes_content.innerHTML = `
              <svg class="svg-dislike-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" /></svg>
              ${FormatterNumber(dislikes, 0)}`;
          }
          __ytToolsRuntime.dislikesCache = { videoId: validoUrl, dislikes, ts: Date.now() };
          try {
            const st = JSON.parse(GM_getValue('ytSettingsMDCM', '{}'));
            scheduleLikeBarUpdate(st, 5);
          } catch (e) {}
        }
    }
  }

  // dislikes shorts + views button (viewCount from Return YouTube Dislike API)
  async function shortDislike() {
    validoUrl = document.location.href;
    const validoVentanaShort = $m(
      "#button-bar > reel-action-bar-view-model > dislike-button-view-model > toggle-button-view-model > button-view-model > label > div > span"
    );
    
    if (validoVentanaShort != undefined && document.location.href.split('/')[3] === 'shorts') {
      validoUrl = document.location.href.split('/')[4];
      let dislikes = null;
      let viewCount = null;
      let rating = null;
      const persisted = getLikesDislikesFromPersistedCache(validoUrl);
      if (persisted && persisted.dislikes != null) {
        dislikes = persisted.dislikes;
        viewCount = persisted.viewCount ?? null;
        rating = persisted.rating ?? null;
      } else {
        const urlShorts = `${apiDislikes}${validoUrl}`;
        try {
          const respuesta = await fetch(urlShorts);
          const datosShort = await respuesta.json();
          dislikes = Number(datosShort?.dislikes);
          viewCount = Number(datosShort?.viewCount);
          rating = Number(datosShort?.rating);
          if (Number.isFinite(dislikes)) setLikesDislikesToPersistedCache(validoUrl, undefined, dislikes, Number.isFinite(viewCount) ? viewCount : undefined, (Number.isFinite(rating) && rating >= 0 && rating <= 5) ? rating : undefined);
        } catch (error) {
          console.log(error);
        }
      }
      if (dislikes != null) {
        for (let i = 0; i < validoVentanaShort.length; i++) {
          validoVentanaShort[i].textContent = `${FormatterNumber(dislikes, 0)}`;
        }
      }
      if (__ytToolsRuntime.updateShortsViewsButton) __ytToolsRuntime.updateShortsViewsButton(validoUrl, viewCount);
      if (__ytToolsRuntime.updateShortsRatingButton) __ytToolsRuntime.updateShortsRatingButton(validoUrl, rating);
    }
  }

  // Url change in second load
  let prevUrl;
  let showDislikes = false;

  setInterval(() => {
    const svgDislike = $e('.svg-dislike-ico'); // Check svg in dom
    const currUrl = window.location.href;
    if (prevUrl !== undefined && currUrl !== prevUrl && !svgDislike && showDislikes) {
      setTimeout(async() => {
            await videoDislike();
            await shortDislike();
      },2000)
    }
    prevUrl = currUrl;
  }, 1000);



  // Create a Trusted Types policy
  let policy = null;
  try {
    const tt = (typeof unsafeWindow !== 'undefined' ? unsafeWindow.trustedTypes : window.trustedTypes);
    if (tt) {
      policy = tt.defaultPolicy;
      if (!policy) {
        try {
          policy = tt.createPolicy('default', { createHTML: (s) => s });
        } catch (e) {
          policy = tt.defaultPolicy || null;
        }
      }
    }
  } catch (e) {
    policy = null;
  }
