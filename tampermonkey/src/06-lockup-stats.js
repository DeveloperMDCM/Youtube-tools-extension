// =============================================================================
// 06-lockup-stats.js — Home/feed lockup likes-dislikes cache
// Source lines 1526-1730 of youtube_script_new_ui.js
// =============================================================================

  // ------------------------------
  // Feature: Show cached rating/likes/dislikes on video cards (watch related + home/search)
  // ------------------------------
  function getVideoIdFromLockup(lockup) {
    const a = lockup.querySelector('a[href*="watch?v="]');
    if (a) {
      const m = (a.getAttribute('href') || '').match(/[?&]v=([^&]+)/);
      if (m) return m[1];
    }
    const el = lockup.querySelector('[class*="content-id-"]');
    if (el) {
      const m = el.className.match(/content-id-([A-Za-z0-9_-]+)/);
      if (m) return m[1];
    }
    return null;
  }

  function createSvgIconFromString(svgString, sizePx) {
    const div = document.createElement('div');
    div.innerHTML = svgString.trim();
    const svg = div.firstElementChild;
    if (!svg) return null;
    svg.setAttribute('width', String(sizePx || 14));
    svg.setAttribute('height', String(sizePx || 14));
    svg.style.display = 'inline-block';
    svg.style.verticalAlign = 'middle';
    svg.style.marginRight = '2px';
    return svg;
  }

  const LOCKUP_RATING_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" /></svg>';
  const LOCKUP_LIKE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>';
  const LOCKUP_DISLIKE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" /></svg>';

  function injectLockupCachedStats() {
    if (!window.location.href.includes('youtube.com')) return;
    document.querySelectorAll('yt-lockup-view-model').forEach((lockup) => {
      if (lockup.hasAttribute('data-yt-tools-lockup-stats')) return;
      const videoId = getVideoIdFromLockup(lockup);
      if (!videoId) return;
      const cached = getLikesDislikesFromPersistedCache(videoId);
      if (!cached) return;
      const hasRating = cached.rating != null;
      const hasLikes = cached.likes != null;
      const hasDislikes = cached.dislikes != null;
      if (!hasRating && !hasLikes && !hasDislikes) return;
      const meta = lockup.querySelector('yt-content-metadata-view-model');
      if (!meta) return;
      const row = document.createElement('div');
      row.className = 'yt-content-metadata-view-model__metadata-row';
      row.setAttribute('data-yt-tools-lockup-stats-row', '1');
      const wrap = document.createElement('span');
      wrap.className = 'yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color';
      wrap.setAttribute('dir', 'auto');
      wrap.setAttribute('role', 'text');
      const sep = () => { const s = document.createTextNode(' · '); return s; };
      if (hasRating) {
        const ratingIcon = createSvgIconFromString(LOCKUP_RATING_SVG, 14);
        if (ratingIcon) wrap.appendChild(ratingIcon);
        wrap.appendChild(document.createTextNode(' ' + cached.rating.toFixed(1)));
        if (hasLikes || hasDislikes) wrap.appendChild(sep());
      }
      if (hasLikes) {
        const likeIcon = createSvgIconFromString(LOCKUP_LIKE_SVG, 14);
        if (likeIcon) wrap.appendChild(likeIcon);
        wrap.appendChild(document.createTextNode(' ' + FormatterNumber(cached.likes, 0)));
        if (hasDislikes) wrap.appendChild(sep());
      }
      if (hasDislikes) {
        const dislikeIcon = createSvgIconFromString(LOCKUP_DISLIKE_SVG, 14);
        if (dislikeIcon) wrap.appendChild(dislikeIcon);
        wrap.appendChild(document.createTextNode(' ' + FormatterNumber(cached.dislikes, 0)));
      }
      row.appendChild(wrap);
      meta.appendChild(row);
      lockup.setAttribute('data-yt-tools-lockup-stats', videoId);
    });
  }

  function getVideoIdFromShortsLockup(item) {
    if (item.dataset.ytToolsShortsVideoId) return item.dataset.ytToolsShortsVideoId;
    var a = item.querySelector('a[href^="/shorts/"]');
    if (!a) return null;
    var m = (a.getAttribute('href') || '').match(/\/shorts\/([^/?]+)/);
    return m ? m[1] : null;
  }

  function injectShortsLockupCachedStats() {
    if (!window.location.href.includes('youtube.com')) return;
    // Process inner lockup (has metadata); v2 wraps it and would duplicate
    document.querySelectorAll('ytm-shorts-lockup-view-model').forEach(function (item) {
      if (item.hasAttribute('data-yt-tools-shorts-stats')) return;
      var videoId = getVideoIdFromShortsLockup(item);
      if (!videoId) return;
      var cached = getLikesDislikesFromPersistedCache(videoId);
      if (!cached) return;
      var hasLikes = cached.likes != null;
      var hasDislikes = cached.dislikes != null;
      if (!hasLikes && !hasDislikes) return;
      var subhead = item.querySelector(
        '.ShortsLockupViewModelHostOutsideMetadataSubhead,' +
        '.shortsLockupViewModelHostOutsideMetadataSubhead,' +
        '.ShortsLockupViewModelHostMetadataSubhead,' +
        '.shortsLockupViewModelHostMetadataSubhead'
      );
      if (!subhead || !subhead.parentElement) return;
      var wrap = document.createElement('span');
      wrap.className = 'yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color yt-tools-shorts-stats-row';
      wrap.setAttribute('dir', 'auto');
      wrap.setAttribute('role', 'text');
      wrap.setAttribute('style', 'color: #aaa !important;');
      var sep = function () { return document.createTextNode(' \u00b7 '); };
      if (hasLikes) {
        var likeIcon = createSvgIconFromString(LOCKUP_LIKE_SVG, 12);
        if (likeIcon) { likeIcon.style.setProperty('color', '#aaa', 'important'); wrap.appendChild(likeIcon); }
        wrap.appendChild(document.createTextNode(' ' + FormatterNumber(cached.likes, 0)));
        if (hasDislikes) wrap.appendChild(sep());
      }
      if (hasDislikes) {
        var dislikeIcon = createSvgIconFromString(LOCKUP_DISLIKE_SVG, 12);
        if (dislikeIcon) { dislikeIcon.style.setProperty('color', '#aaa', 'important'); wrap.appendChild(dislikeIcon); }
        wrap.appendChild(document.createTextNode(' ' + FormatterNumber(cached.dislikes, 0)));
      }
      var row = document.createElement('div');
      row.className = 'yt-tools-shorts-stats-wrap';
      row.setAttribute('style', 'color: #aaa !important;');
      row.appendChild(wrap);
      subhead.parentElement.appendChild(row);
      item.setAttribute('data-yt-tools-shorts-stats', videoId);
    });
  }

  function createLockupStatsObserver(target) {
    var lockupStatsDebounceT = null;
    var lockupStatsScheduled = false;
    var obs = new MutationObserver(function () {
      if (lockupStatsScheduled) return;
      lockupStatsScheduled = true;
      clearTimeout(lockupStatsDebounceT);
      lockupStatsDebounceT = setTimeout(function () {
        lockupStatsScheduled = false;
        if (!window.location.href.includes('youtube.com')) return;
        injectLockupCachedStats();
        injectShortsLockupCachedStats();
        // Extra passes for late-rendered lockups (infinite scroll / related column / SPA)
        [500, 1100, 2000].forEach(function (delay) {
          setTimeout(function () {
            if (!window.location.href.includes('youtube.com')) return;
            injectLockupCachedStats();
            injectShortsLockupCachedStats();
          }, delay);
        });
      }, 280);
    });
    obs.observe(target, { childList: true, subtree: true });
    return obs;
  }

  function retargetLockupStatsObserverIfNeeded() {
    if (!window.location.href.includes('youtube.com/watch')) return;
    var secondary = document.getElementById('secondary') || document.querySelector('ytd-watch-next-secondary-results-renderer');
    if (!secondary || !secondary.parentNode) return;
    if (__ytToolsRuntime.lockupCachedStatsObserveTarget === secondary) return;
    var obs = __ytToolsRuntime.lockupCachedStatsObserver;
    if (!obs) return;
    obs.disconnect();
    __ytToolsRuntime.lockupCachedStatsObserver = createLockupStatsObserver(secondary);
    __ytToolsRuntime.lockupCachedStatsObserveTarget = secondary;
  }

  function hasUnprocessedLockups() {
    var normal = document.querySelectorAll('yt-lockup-view-model:not([data-yt-tools-lockup-stats])').length > 0;
    var shorts = document.querySelectorAll('ytm-shorts-lockup-view-model:not([data-yt-tools-shorts-stats])').length > 0;
    return normal || shorts;
  }

  function runLockupCachedStatsCatchUp() {
    if (!window.location.href.includes('youtube.com')) return;
    if (document.visibilityState !== 'visible') return;
    if (!hasUnprocessedLockups()) return;
    injectLockupCachedStats();
    injectShortsLockupCachedStats();
  }

  function setupLockupCachedStats() {
    if (!window.location.href.includes('youtube.com')) return;
    injectLockupCachedStats();
    injectShortsLockupCachedStats();
    var secondary = document.getElementById('secondary') || document.querySelector('ytd-watch-next-secondary-results-renderer');
    var observeTarget = secondary && secondary.parentNode ? secondary : document.body;
    if (__ytToolsRuntime.lockupCachedStatsObserver) {
      if (observeTarget !== __ytToolsRuntime.lockupCachedStatsObserveTarget) {
        __ytToolsRuntime.lockupCachedStatsObserver.disconnect();
        __ytToolsRuntime.lockupCachedStatsObserver = createLockupStatsObserver(observeTarget);
        __ytToolsRuntime.lockupCachedStatsObserveTarget = observeTarget;
      }
      return;
    }
    __ytToolsRuntime.lockupCachedStatsObserver = createLockupStatsObserver(observeTarget);
    __ytToolsRuntime.lockupCachedStatsObserveTarget = observeTarget;
    // Catch-up interval: apply stats to any new cards (scroll, filters, SPA) every 1.8s when there are unprocessed lockups
    if (!__ytToolsRuntime.lockupCachedStatsIntervalId) {
      __ytToolsRuntime.lockupCachedStatsIntervalId = setInterval(runLockupCachedStatsCatchUp, 1800);
    }
  }
