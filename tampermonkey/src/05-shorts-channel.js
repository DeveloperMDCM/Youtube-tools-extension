// =============================================================================
// 05-shorts-channel.js — Shorts channel name feature
// Source lines 1342-1524 of youtube_script_new_ui.js
// =============================================================================

  // ------------------------------
  // Feature: Show channel name on Shorts list (Home / feeds) 
  // Adapted from: @𝖢𝖸 𝖥𝗎𝗇𝗀
  // ------------------------------
  function setupShortsChannelNameFeature(enabled) {
    __ytToolsRuntime.shortsChannelName.enabled = !!enabled;
    document.documentElement.dataset.mdcmShortsChannelName = enabled ? '1' : '0';

    // Disable: stop observers to reduce overhead
    if (!enabled) {
      try { __ytToolsRuntime.shortsChannelName.observer?.disconnect?.(); } catch (e) {}
      try { __ytToolsRuntime.shortsChannelName.io?.disconnect?.(); } catch (e) {}
      __ytToolsRuntime.shortsChannelName.observer = null;
      __ytToolsRuntime.shortsChannelName.io = null;
      clearTimeout(__ytToolsRuntime.shortsChannelName.scanT);
      __ytToolsRuntime.shortsChannelName.scanT = null;
      return;
    }

    const rt = __ytToolsRuntime.shortsChannelName;

    const getShortsVideoIdFromItem = (item) => {
      const a = item.querySelector('a[href^="/shorts/"]');
      const href = a?.getAttribute('href') || '';
      const m = href.match(/\/shorts\/([^/?]+)/);
      return m?.[1] || null;
    };

    const findSubhead = (item) => {
      return item.querySelector(
        '.ShortsLockupViewModelHostOutsideMetadataSubhead,' +
        ' .shortsLockupViewModelHostOutsideMetadataSubhead,' +
        ' .ShortsLockupViewModelHostMetadataSubhead,' +
        ' .shortsLockupViewModelHostMetadataSubhead'
      );
    };

    const ensureLabel = (subhead) => {
      const parent = subhead?.parentElement;
      if (!parent) return null;
      let el = parent.querySelector('.yt-tools-shorts-channel-name');
      if (!el) {
        el = document.createElement('div');
        el.className = 'yt-tools-shorts-channel-name';
        el.textContent = '';
        parent.insertBefore(el, subhead);
      }
      return el;
    };

    const tryExtractChannelNameFromDom = (item) => {
      const a = item.querySelector('a[href^="/@"], a[href^="/channel/"]');
      const name = (a?.textContent || a?.getAttribute('title') || '').trim();
      return name || null;
    };

    const fetchChannelNameFromWatch = (videoId) => {
      rt.fetchChain = rt.fetchChain.then(async () => {
        if (rt.cache.has(videoId)) return rt.cache.get(videoId);
        let res = null;
        try {
          res = await fetch(`/watch?v=${videoId}`, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'force-cache',
          });
        } catch (e) {
          return '';
        }
        if (!res?.ok) return '';
        const html = await res.text();

        const idx = html.indexOf('itemprop="author"');
        if (idx < 0) return '';
        const start = html.lastIndexOf('<span', idx);
        const end = html.indexOf('</span>', idx);
        if (start < 0 || end < 0) return '';
        const chunk = html.slice(start, end + 7);

        const doc = new DOMParser().parseFromString(chunk, 'text/html');
        const link = doc.querySelector('link[itemprop="name"]');
        return (link?.getAttribute('content') || '').trim();
      });
      return rt.fetchChain;
    };

    const getChannelName = (videoId, item) => {
      const cached = rt.cache.get(videoId);
      if (cached) return Promise.resolve(cached);

      const persisted = getShortsChannelFromPersistedCache(videoId);
      if (persisted) {
        rt.cache.set(videoId, persisted);
        return Promise.resolve(persisted);
      }

      const domName = tryExtractChannelNameFromDom(item);
      if (domName) {
        rt.cache.set(videoId, domName);
        setShortsChannelToPersistedCache(videoId, domName);
        return Promise.resolve(domName);
      }

      const inflight = rt.inflight.get(videoId);
      if (inflight) return inflight;

      const p = fetchChannelNameFromWatch(videoId)
        .then((name) => {
          const finalName = (name || '').trim();
          if (finalName) {
            rt.cache.set(videoId, finalName);
            setShortsChannelToPersistedCache(videoId, finalName);
          }
          return finalName;
        })
        .finally(() => {
          rt.inflight.delete(videoId);
        });
      rt.inflight.set(videoId, p);
      return p;
    };

    const processItem = (item) => {
      if (!(item instanceof Element)) return;
      if (item.dataset.ytToolsShortsChannelProcessed === '1') return;

      const subhead = findSubhead(item);
      if (!subhead) return;

      const videoId = getShortsVideoIdFromItem(item);
      if (!videoId) return;

      item.dataset.ytToolsShortsChannelProcessed = '1';
      item.dataset.ytToolsShortsVideoId = videoId;

      const label = ensureLabel(subhead);
      if (!label) return;
      label.textContent = '';

      rt.io?.observe(item);
    };

    if (!rt.io) {
      rt.io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const item = entry.target;
          const videoId = item?.dataset?.ytToolsShortsVideoId;
          const subhead = findSubhead(item);
          const label = subhead?.parentElement?.querySelector?.('.yt-tools-shorts-channel-name');

          if (!videoId || !label) {
            rt.io.unobserve(item);
            continue;
          }

          getChannelName(videoId, item)
            .then((name) => {
              if (name) label.textContent = name;
            })
            .finally(() => {
              rt.io.unobserve(item);
            });
        }
      }, { threshold: 0.15 });
    }

    const scan = () => {
      clearTimeout(rt.scanT);
      rt.scanT = setTimeout(() => {
        document
          .querySelectorAll('ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2')
          .forEach(processItem);
      }, 120);
    };

    if (!rt.observer) {
      rt.observer = new MutationObserver(scan);
      rt.observer.observe(document.body, { childList: true, subtree: true });
    }

    scan();
  }
