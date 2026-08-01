// =============================================================================
// 07-bookmarks.js — Video bookmarks
// Source lines 1732-1857 of youtube_script_new_ui.js
// =============================================================================

  // ------------------------------
  // Feature: Bookmarks per video (persisted)
  // ------------------------------
  function getBookmarksForVideo(videoId) {
    const all = readJsonGM(STORAGE_KEYS_MDCM.BOOKMARKS, {});
    const list = Array.isArray(all[videoId]) ? all[videoId] : [];
    return { all, list };
  }

  function saveBookmark(videoId, seconds, label) {
    const { all, list } = getBookmarksForVideo(videoId);
    const t = Math.max(0, Math.floor(Number(seconds) || 0));
    const exists = list.some(b => b && b.t === t);
    const item = { t, label: (label || formatTimeShort(t)).trim(), createdAt: Date.now() };
    const nextList = exists ? list.map(b => (b.t === t ? item : b)) : [...list, item];
    nextList.sort((a, b) => a.t - b.t);
    all[videoId] = nextList;
    writeJsonGM(STORAGE_KEYS_MDCM.BOOKMARKS, all);
  }

  function deleteBookmark(videoId, seconds) {
    const { all, list } = getBookmarksForVideo(videoId);
    const t = Math.max(0, Math.floor(Number(seconds) || 0));
    all[videoId] = list.filter(b => b && b.t !== t);
    writeJsonGM(STORAGE_KEYS_MDCM.BOOKMARKS, all);
  }

  function renderBookmarksPanel(videoId) {
    const panel = $id('yt-bookmarks-panel');
    if (!panel) return;

    const { list } = getBookmarksForVideo(videoId);
    if (!list.length) {
      panel.innerHTML = `<div class="yt-bm-empty">No bookmarks yet. Click ★ to save one.</div>`;
      return;
    }

    panel.innerHTML = list
      .map((b) => {
        const time = formatTimeShort(b.t);
        const safeLabel = (b.label || time).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
          <div class="yt-bm-item">
            <button type="button" class="yt-bm-go" data-action="go" data-t="${b.t}" title="Go to ${time}">${time}</button>
            <div class="yt-bm-label" title="${safeLabel}">${safeLabel}</div>
            <button type="button" class="yt-bm-del" data-action="del" data-t="${b.t}" title="Delete">✕</button>
          </div>
        `;
      })
      .join('');
  }

  function applyBookmarksIfEnabled(settings) {
    const addBtn = $id('yt-bookmark-add');
    const toggleBtn = $id('yt-bookmark-toggle');
    const panel = $id('yt-bookmarks-panel');

    if (!addBtn || !toggleBtn || !panel) return;

    const enabled = !!settings?.bookmarks && settings?.btnBookmark !== false;
    addBtn.style.display = enabled ? 'inline-flex' : 'none';
    toggleBtn.style.display = enabled ? 'inline-flex' : 'none';
    panel.style.display = enabled && __ytToolsRuntime.bookmarksPanelOpen ? 'block' : 'none';

    if (!enabled) return;

    const videoId = getCurrentVideoId();
    if (!videoId) return;
    renderBookmarksPanel(videoId);

    if (__ytToolsRuntime.bookmarkClickHandlerInitialized) return;
    __ytToolsRuntime.bookmarkClickHandlerInitialized = true;

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const add = target.closest('#yt-bookmark-add');
      const tog = target.closest('#yt-bookmark-toggle');
      const actionBtn = target.closest('[data-action][data-t]');

      if (add) {
        e.preventDefault();
        e.stopPropagation();
        const v = $e('video');
        const vid = getCurrentVideoId();
        if (!v || !vid) return;
        const t = Math.floor(v.currentTime || 0);
        const defaultLabel = formatTimeShort(t);
        const label = prompt('Bookmark name (optional):', defaultLabel) || defaultLabel;
        saveBookmark(vid, t, label);
        __ytToolsRuntime.bookmarksPanelOpen = true;
        panel.style.display = 'block';
        renderBookmarksPanel(vid);
        Notify('success', `Bookmark saved at ${defaultLabel}`);
        return;
      }

      if (tog) {
        e.preventDefault();
        e.stopPropagation();
        __ytToolsRuntime.bookmarksPanelOpen = !__ytToolsRuntime.bookmarksPanelOpen;
        panel.style.display = __ytToolsRuntime.bookmarksPanelOpen ? 'block' : 'none';
        const vid = getCurrentVideoId();
        if (vid && __ytToolsRuntime.bookmarksPanelOpen) renderBookmarksPanel(vid);
        return;
      }

      if (actionBtn) {
        e.preventDefault();
        e.stopPropagation();
        const action = actionBtn.getAttribute('data-action');
        const t = Number(actionBtn.getAttribute('data-t'));
        const v = $e('video');
        const vid = getCurrentVideoId();
        if (!v || !vid) return;
        if (action === 'go') {
          v.currentTime = Math.max(0, t || 0);
          v.play?.().catch(() => {});
        } else if (action === 'del') {
          deleteBookmark(vid, t);
          renderBookmarksPanel(vid);
        }
      }
    });
  }
