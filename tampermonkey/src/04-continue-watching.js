// =============================================================================
// 04-continue-watching.js — Continue watching feature
// Source lines 788-1340 of youtube_script_new_ui.js
// =============================================================================

  // ------------------------------
  // Feature: History / Continue watching (per video)
  // ------------------------------
  function getMainVideoEl() {
    return (
      document.querySelector('#movie_player video.video-stream.html5-main-video') ||
      document.querySelector('ytd-player video.video-stream.html5-main-video') ||
      document.querySelector('video.video-stream.html5-main-video') ||
      document.querySelector('video')
    );
  }

  function getCurrentVideoMeta() {
    try {
      // DOM first (updates earlier on SPA navigation)
      const domTitle =
        $e('ytd-watch-metadata h1 yt-formatted-string')?.textContent?.trim() ||
        $e('h1.ytd-watch-metadata yt-formatted-string')?.textContent?.trim() ||
        '';
      const domAuthor =
        $e('#owner ytd-channel-name a, ytd-video-owner-renderer ytd-channel-name a, #text-container.ytd-channel-name a')?.textContent?.trim() ||
        $e('#owner a[href^="/@"], #owner a[href^="/channel/"]')?.textContent?.trim() ||
        '';
      const titleFromDom = (domTitle || document.title || '').replace(/\s*-\s*YouTube\s*$/i, '').trim();
      const authorFromDom = (domAuthor || '').trim();

      const w = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;
      const pr = w?.ytInitialPlayerResponse || window.ytInitialPlayerResponse;
      const vd = pr?.videoDetails || null;
      const title = (titleFromDom || vd?.title || document.title || '').replace(/\s*-\s*YouTube\s*$/i, '').trim();
      const author = (authorFromDom || vd?.author || '').trim();
      const thumbs = vd?.thumbnail?.thumbnails;
      const thumb = Array.isArray(thumbs) ? (thumbs[thumbs.length - 1]?.url || '') : '';
      return { title, author, thumb };
    } catch (e) {
      return { title: '', author: '', thumb: '' };
    }
  }

  function ensureContinueWatchingMapLoaded() {
    const rt = __ytToolsRuntime.continueWatching;
    if (!rt.map) rt.map = readJsonGM(STORAGE_KEYS_MDCM.CONTINUE_WATCHING, {});
    if (typeof rt.map !== 'object' || !rt.map) rt.map = {};
    return rt.map;
  }

  function pruneContinueWatchingMap(map, maxEntries = 200) {
    try {
      const entries = Object.entries(map || {}).filter(([, v]) => v && typeof v === 'object');
      entries.sort((a, b) => (Number(b[1].updatedAt) || 0) - (Number(a[1].updatedAt) || 0));
      const keep = entries.slice(0, maxEntries);
      const next = {};
      for (const [k, v] of keep) next[k] = v;
      return next;
    } catch (e) {
      return map || {};
    }
  }

  function scheduleContinueWatchingFlush() {
    const rt = __ytToolsRuntime.continueWatching;
    clearTimeout(rt.flushT);
    rt.flushT = setTimeout(() => {
      try {
        if (!rt.map) return;
        rt.map = pruneContinueWatchingMap(rt.map, 200);
        writeJsonGM(STORAGE_KEYS_MDCM.CONTINUE_WATCHING, rt.map);
      } catch (e) {}
    }, 800);
  }

  function clearContinueWatchingForVideo(videoId) {
    if (!videoId) return;
    const rt = __ytToolsRuntime.continueWatching;
    const map = ensureContinueWatchingMapLoaded();
    if (map && Object.prototype.hasOwnProperty.call(map, videoId)) {
      delete map[videoId];
      rt.map = map;
      scheduleContinueWatchingFlush();
    }
  }

  function setContinueWatchingForVideo(videoId, seconds, durationSec) {
    if (!videoId) return;
    const rt = __ytToolsRuntime.continueWatching;
    const map = ensureContinueWatchingMapLoaded();
    const t = Math.max(0, Math.floor(Number(seconds) || 0));
    const d = Math.max(0, Math.floor(Number(durationSec) || 0));
    const prev = map[videoId] && typeof map[videoId] === 'object' ? map[videoId] : {};
    const meta = getCurrentVideoMeta();
    map[videoId] = {
      t,
      d,
      updatedAt: Date.now(),
      title: meta.title || prev.title || '',
      author: meta.author || prev.author || '',
      thumb: meta.thumb || prev.thumb || '',
    };
    rt.map = map;
    scheduleContinueWatchingFlush();
  }

  function getContinueWatchingTime(videoId) {
    if (!videoId) return null;
    const map = ensureContinueWatchingMapLoaded();
    const entry = map?.[videoId];
    const t = Number(entry?.t);
    return Number.isFinite(t) ? t : null;
  }

  function updateContinueWatchingButton() {
    const rt = __ytToolsRuntime.continueWatching;
    const enabled = !!rt.enabled;
    if (!enabled || !isWatchPage()) return;

    const videoId = getCurrentVideoId();
    if (!videoId) return;

    const v = getMainVideoEl();
    const t = getContinueWatchingTime(videoId);
    const dur = Number(v?.duration);
    const hasDur = Number.isFinite(dur) && dur > 0;

    if (!t || t < 5) return;

    if (hasDur && t >= (dur - 5)) {
      clearContinueWatchingForVideo(videoId);
      return;
    }
  }

  function updateContinueWatchingHistoryUi() {
    const rt = __ytToolsRuntime.continueWatching;
    const btn = $id('yt-cw-history-toggle');
    const panel = $id('yt-continue-watching-panel');
    if (!btn || !panel) return;

    let btnAllowed = true;
    try {
      const stored = JSON.parse(GM_getValue('ytSettingsMDCM', '{}') || '{}');
      btnAllowed = stored.btnContinueWatching !== false;
    } catch (e) {}

    const enabled = !!rt.enabled && btnAllowed;
    if (!enabled || !isWatchPage()) {
      btn.style.display = 'none';
      panel.style.display = 'none';
      return;
    }

    btn.style.display = 'inline-flex';
    panel.style.display = rt.panelOpen ? 'block' : 'none';
  }

  function cssEscapeLite(s) {
    const str = String(s || '');
    if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(str);
    // minimal escape for attribute selector
    return str.replace(/["\\]/g, '\\$&');
  }

  function updateContinueWatchingPanelRow(videoId) {
    try {
      const rt = __ytToolsRuntime.continueWatching;
      if (!rt.enabled || !rt.panelOpen || !isWatchPage()) return false;
      const panel = $id('yt-continue-watching-panel');
      if (!panel) return false;

      const key = cssEscapeLite(videoId);
      const row = panel.querySelector(`.yt-cw-item[data-video-id="${key}"]`);
      if (!row) return false;

      const entry = ensureContinueWatchingMapLoaded()?.[videoId];
      const t = Number(entry?.t);
      if (!Number.isFinite(t)) return false;

      const meta = row.querySelector('.yt-cw-meta');
      if (!meta) return false;
      const author = String(entry?.author || '').trim();
      meta.textContent = `${formatTimeShort(t)}${author ? ` • ${author}` : ''}`;
      return true;
    } catch (e) {
      return false;
    }
  }

  function navigateToWatchSpa(videoId, seconds) {
    const t = Number(seconds);
    const url = `/watch?v=${encodeURIComponent(videoId)}${Number.isFinite(t) ? `&t=${Math.max(0, Math.floor(t))}s` : ''}`;
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_self';
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    } catch (e) {}
    location.href = url;
  }

  function renderContinueWatchingPanel() {
    const panel = $id('yt-continue-watching-panel');
    if (!panel) return;

    const rt = __ytToolsRuntime.continueWatching;
    if (!rt.enabled || !rt.panelOpen || !isWatchPage()) {
      panel.style.display = 'none';
      return;
    }

    const map = pruneContinueWatchingMap(ensureContinueWatchingMapLoaded(), 200);
    rt.map = map;
    const currentVid = getCurrentVideoId();

    const entries = Object.entries(map)
      .map(([videoId, v]) => ({ videoId, ...v }))
      .filter((e) => e.videoId && Number.isFinite(Number(e.t)) && Number(e.t) >= 5)
      .sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0))
      .slice(0, 25);

    panel.replaceChildren();

    const header = document.createElement('div');
    header.className = 'yt-cw-header';

    const hTitle = document.createElement('div');
    hTitle.className = 'yt-cw-header-title';
    hTitle.textContent = 'Continue watching';

    const clearAll = document.createElement('button');
    clearAll.type = 'button';
    clearAll.className = 'yt-cw-clear';
    clearAll.textContent = 'Clear';
    clearAll.dataset.cwAction = 'clearAll';

    header.appendChild(hTitle);
    header.appendChild(clearAll);
    panel.appendChild(header);

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'yt-cw-empty';
      empty.textContent = 'No history yet. Watch a bit, then reopen any video.';
      panel.appendChild(empty);
      return;
    }

    for (const e of entries) {
      const item = document.createElement('div');
      item.className = 'yt-cw-item';
      item.dataset.videoId = e.videoId;

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'yt-cw-thumb-wrap';
      const img = document.createElement('img');
      img.className = 'yt-cw-thumb';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = '';
      const thumbSrc = (e.thumb || '').trim() || `https://i.ytimg.com/vi/${encodeURIComponent(e.videoId)}/hqdefault.jpg`;
      img.src = thumbSrc;
      thumbWrap.appendChild(img);

      const info = document.createElement('div');
      info.className = 'yt-cw-info';

      const title = document.createElement('div');
      title.className = 'yt-cw-title';
      const safeTitle = (e.title || '').trim();
      title.textContent = safeTitle ? safeTitle : e.videoId;

      const meta = document.createElement('div');
      meta.className = 'yt-cw-meta';
      const author = (e.author || '').trim();
      meta.textContent = `${formatTimeShort(e.t)}${author ? ` • ${author}` : ''}`;

      info.appendChild(title);
      info.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'yt-cw-actions';

      const tSec = Math.max(0, Math.floor(Number(e.t) || 0));
      let go = null;
      if (currentVid && currentVid === e.videoId) {
        const seek = document.createElement('button');
        seek.type = 'button';
        seek.className = 'yt-cw-go';
        seek.textContent = 'Resume';
        seek.dataset.cwAction = 'seek';
        seek.dataset.t = String(tSec);
        go = seek;
      } else {
        const a = document.createElement('a');
        a.className = 'yt-simple-endpoint yt-cw-go';
        a.textContent = 'Resume';
        a.href = `/watch?v=${encodeURIComponent(e.videoId)}&t=${tSec}s`;
        a.target = '_self';
        a.rel = 'noopener';
        go = a;
      }

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'yt-cw-del';
      del.textContent = '✕';
      del.title = 'Delete';
      del.dataset.cwAction = 'del';
      del.dataset.videoId = e.videoId;

      actions.appendChild(go);
      actions.appendChild(del);

      item.appendChild(thumbWrap);
      item.appendChild(info);
      item.appendChild(actions);
      panel.appendChild(item);
    }
  }

  function setupContinueWatchingFeature(enabled) {
    const rt = __ytToolsRuntime.continueWatching;
    rt.enabled = !!enabled;

    // Keep UI in sync across YouTube SPA navigations
    if (!rt.navHandlerInitialized) {
      rt.navHandlerInitialized = true;
      const onNav = () => {
        try {
          const vid = getCurrentVideoId();
          if (rt.lastKnownVideoId !== vid) {
            rt.lastKnownVideoId = vid;
            // reset throttles so new video can save properly
            rt.lastSaveAt = 0;
            rt.lastSavedTime = -1;
            rt.boundVideoId = vid;
            updateContinueWatchingButton();
            updateContinueWatchingHistoryUi();
            if (rt.panelOpen) renderContinueWatchingPanel();
          } else {
            updateContinueWatchingButton();
            updateContinueWatchingHistoryUi();
            if (rt.panelOpen) renderContinueWatchingPanel();
          }
        } catch (e) {}
      };
      window.addEventListener('yt-navigate-finish', onNav, true);
      window.addEventListener('popstate', onNav, true);
      window.addEventListener('hashchange', onNav, true);
    }

    // Ensure click handler only once
    if (!rt.clickHandlerInitialized) {
      rt.clickHandlerInitialized = true;
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const historyBtn = target.closest('#yt-cw-history-toggle');
        const cwActionBtn = target.closest('[data-cw-action]');

        if (historyBtn) {
          e.preventDefault();
          e.stopPropagation();
          rt.panelOpen = !rt.panelOpen;
          updateContinueWatchingHistoryUi();
          if (rt.panelOpen) renderContinueWatchingPanel(); // render only when opened
          return;
        }

        if (cwActionBtn) {
          const action = cwActionBtn.getAttribute('data-cw-action');
          if (!action) return;
          e.preventDefault();
          e.stopPropagation();
          if (action === 'clearAll') {
            rt.map = {};
            writeJsonGM(STORAGE_KEYS_MDCM.CONTINUE_WATCHING, {});
            renderContinueWatchingPanel();
            updateContinueWatchingButton();
            try { Notify('success', 'History cleared'); } catch (e2) {}
            return;
          }
          if (action === 'del') {
            const vid = cwActionBtn.getAttribute('data-video-id') || '';
            if (vid) clearContinueWatchingForVideo(vid);
            renderContinueWatchingPanel();
            updateContinueWatchingButton();
            return;
          }
          if (action === 'seek') {
            const t = Number(cwActionBtn.getAttribute('data-t'));
            const v = getMainVideoEl();
            if (!v || !Number.isFinite(t)) return;
            v.currentTime = Math.max(0, t);
            v.play?.().catch(() => {});
            try { Notify('success', `Resume: ${formatTimeShort(t)}`); } catch (e2) {}
            updateContinueWatchingButton();
            return;
          }
        }
      }, true);
    }

    // Save on tab close / navigation (once)
    if (!rt.pagehideHandlerInitialized) {
      rt.pagehideHandlerInitialized = true;
      window.addEventListener('pagehide', () => {
        try {
          if (!rt.enabled) return;
          if (!isWatchPage()) return;
          const vid = getCurrentVideoId();
          const v = getMainVideoEl();
          if (!vid || !v) return;
          const t = Number(v.currentTime);
          const d = Number(v.duration);
          if (Number.isFinite(t) && t >= 5) setContinueWatchingForVideo(vid, t, d);
          // best-effort immediate flush
          if (rt.flushT) {
            clearTimeout(rt.flushT);
            rt.flushT = null;
          }
          if (rt.map) writeJsonGM(STORAGE_KEYS_MDCM.CONTINUE_WATCHING, pruneContinueWatchingMap(rt.map, 200));
        } catch (e) {}
      }, { capture: true });
    }

    const historyBtn = $id('yt-cw-history-toggle');
    const panel = $id('yt-continue-watching-panel');
    if (historyBtn && !rt.enabled) historyBtn.style.display = 'none';
    if (panel && !rt.enabled) panel.style.display = 'none';

    // Not on watch page: detach video listeners and hide
    if (!rt.enabled || !isWatchPage()) {
      try {
        if (rt.boundVideo && rt.handlers) {
          rt.boundVideo.removeEventListener('timeupdate', rt.handlers.timeupdate);
          rt.boundVideo.removeEventListener('pause', rt.handlers.pause);
          rt.boundVideo.removeEventListener('ended', rt.handlers.ended);
          rt.boundVideo.removeEventListener('loadedmetadata', rt.handlers.loadedmetadata);
          rt.boundVideo.removeEventListener('seeked', rt.handlers.seeked);
        }
      } catch (e) {}
      rt.boundVideo = null;
      rt.boundVideoId = null;
      rt.handlers = null;
      updateContinueWatchingButton();
      updateContinueWatchingHistoryUi();
      return;
    }

    const v = getMainVideoEl();
    const videoId = getCurrentVideoId();
    if (!v || !videoId) {
      updateContinueWatchingButton();
      updateContinueWatchingHistoryUi();
      return;
    }

    // VideoId can change while YouTube reuses the same <video> element
    if (rt.boundVideoId !== videoId) {
      rt.boundVideoId = videoId;
      rt.lastSaveAt = 0;
      rt.lastSavedTime = -1;
    }

    // If video element changed, rebind listeners (avoid leaks)
    if (rt.boundVideo && rt.boundVideo !== v && rt.handlers) {
      try {
        rt.boundVideo.removeEventListener('timeupdate', rt.handlers.timeupdate);
        rt.boundVideo.removeEventListener('pause', rt.handlers.pause);
        rt.boundVideo.removeEventListener('ended', rt.handlers.ended);
        rt.boundVideo.removeEventListener('loadedmetadata', rt.handlers.loadedmetadata);
        rt.boundVideo.removeEventListener('seeked', rt.handlers.seeked);
      } catch (e) {}
      rt.boundVideo = null;
      rt.boundVideoId = null;
      rt.handlers = null;
    }

    rt.boundVideo = v;
    rt.boundVideoId = videoId;

    if (!rt.handlers) {
      rt.handlers = {
        timeupdate: () => {
          try {
            if (!rt.enabled) return;
            const vid = getCurrentVideoId();
            if (!vid) return;
            const now = Date.now();
            if (now - rt.lastSaveAt < 5000) return; // throttle
            if (v.paused) return;
            const t = Number(v.currentTime);
            const d = Number(v.duration);
            if (!Number.isFinite(t)) return;
            if (Math.abs(t - rt.lastSavedTime) < 2) return;
            rt.lastSaveAt = now;
            rt.lastSavedTime = t;
            if (t < 5) return;
            setContinueWatchingForVideo(vid, t, d);
            updateContinueWatchingButton();
            // Avoid re-rendering the whole panel every few seconds.
            // If panel is open and row exists, just update its text.
            if (rt.panelOpen) {
              if (!updateContinueWatchingPanelRow(vid)) renderContinueWatchingPanel();
            }
          } catch (e) {}
        },
        pause: () => {
          try {
            if (!rt.enabled) return;
            const vid = getCurrentVideoId();
            if (!vid) return;
            const t = Number(v.currentTime);
            const d = Number(v.duration);
            if (!Number.isFinite(t)) return;
            if (t < 5) {
              clearContinueWatchingForVideo(vid);
            } else {
              setContinueWatchingForVideo(vid, t, d);
            }
            updateContinueWatchingButton();
            if (rt.panelOpen) {
              if (!updateContinueWatchingPanelRow(vid)) renderContinueWatchingPanel();
            }
          } catch (e) {}
        },
        ended: () => {
          try {
            const vid = getCurrentVideoId();
            if (vid) clearContinueWatchingForVideo(vid);
            updateContinueWatchingButton();
            if (rt.panelOpen) renderContinueWatchingPanel();
          } catch (e) {}
        },
        loadedmetadata: () => {
          updateContinueWatchingButton();
          if (rt.panelOpen) renderContinueWatchingPanel();
        },
        seeked: () => {
          updateContinueWatchingButton();
          const vid = getCurrentVideoId();
          if (rt.panelOpen && vid) updateContinueWatchingPanelRow(vid);
        },
      };

      v.addEventListener('timeupdate', rt.handlers.timeupdate, { passive: true });
      v.addEventListener('pause', rt.handlers.pause, { passive: true });
      v.addEventListener('ended', rt.handlers.ended, { passive: true });
      v.addEventListener('loadedmetadata', rt.handlers.loadedmetadata, { passive: true });
      v.addEventListener('seeked', rt.handlers.seeked, { passive: true });
    }

    updateContinueWatchingButton();
    updateContinueWatchingHistoryUi();
  }
