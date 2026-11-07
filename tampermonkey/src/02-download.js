// =============================================================================
// 02-download.js — MP3/MP4 download + paramsVideoURL
// Source lines 370-611 of youtube_script_new_ui.js
// =============================================================================

  function resetDownloadState(container) {
    if (!container) return;
    container.__ytDownloadGeneration = (container.__ytDownloadGeneration || 0) + 1;
    if (container.__ytDownloadPoll) clearInterval(container.__ytDownloadPoll);
    container.__ytDownloadPoll = null;
    container.classList.remove('completed');
    for (const name of ['downloading', 'urlOpened', 'lastDownloadUrl']) delete container.dataset[name];
    const show = (selector, value) => { const node = container.querySelector(selector); if (node) node.style.display = value; };
    show('.download-btn', 'block');
    show('.retry-btn', 'none');
    show('.progress-retry-btn', 'none');
    show('.download-again-btn', 'none');
    show('.progress-container', 'none');
    const fill = container.querySelector('.progress-fill');
    const progress = container.querySelector('.progress-text');
    if (fill) fill.style.width = '0%';
    if (progress) progress.textContent = '0%';
  }

  async function startLocalDownload(format, container) {
    if (container.dataset.downloading === 'true') return;
    const videoId = paramsVideoURL();
    const generation = container.__ytDownloadGeneration || 0;
    const isCurrent = () => (container.__ytDownloadGeneration || 0) === generation;
    const download = container.querySelector('.download-btn');
    const retry = container.querySelector('.retry-btn');
    const progress = container.querySelector('.progress-container');
    const progressText = container.querySelector('.progress-text');
    const progressFill = container.querySelector('.progress-fill');
    const label = container.querySelector('.download-text');
    const progressRetry = container.querySelector('.progress-retry-btn');
    const again = container.querySelector('.download-again-btn');
    container.dataset.downloading = 'true';
    download.style.display = 'none'; retry.style.display = 'none';
    progressRetry.style.display = 'none'; if (again) again.style.display = 'none';
    progress.style.display = 'flex'; progressFill.style.width = '0%';
    progressText.textContent = 'Starting…';
    const request = (method, url, data) => new Promise((resolve, reject) => {
      GM_xmlhttpRequest({ method, url, timeout: 15000,
        headers: { 'Content-Type': 'application/json', 'X-YT-Tools-Token': localDownloadToken },
        data: data ? JSON.stringify(data) : undefined,
        onload: response => {
          let result = {}; try { result = JSON.parse(response.responseText); } catch {}
          if (response.status >= 200 && response.status < 300) resolve(result);
          else reject(new Error(result.error || `Local service returned HTTP ${response.status}`));
        },
        onerror: () => reject(new Error('Local download service is unavailable. Start the development server.')),
        ontimeout: () => reject(new Error('Local download service timed out.')),
      });
    });
    try {
      const base = 'http://127.0.0.1:8766/local-download';
      const job = await request('POST', base, { videoId, format: String(format) });
      if (!isCurrent()) return;
      let state;
      do {
        await new Promise(resolve => setTimeout(resolve, 1500));
        state = await request('GET', `${base}?id=${encodeURIComponent(job.id)}`);
        if (!isCurrent()) return;
        progressText.textContent = state.message;
        const percent = state.message.match(/(\d+(?:\.\d+)?)%/);
        if (percent) progressFill.style.width = `${percent[1]}%`;
      } while (state.state === 'running');
      if (state.state !== 'complete') throw new Error(state.message);
      progressFill.style.width = '100%';
      label.textContent = 'Saved to Downloads';
      progressText.textContent = 'Complete';
      container.classList.add('completed');
      container.dataset.downloading = 'false';
    } catch (error) {
      if (!isCurrent()) return;
      label.textContent = error.message;
      progress.style.display = 'none'; retry.style.display = 'block';
      container.dataset.downloading = 'false';
      console.error('Local download failed:', error);
    }
  }

  async function startDownloadVideoOrAudio(format, container) {
    if (typeof localDownloadToken !== 'undefined') return startLocalDownload(format, container);
    const videoURL = window.location.href;
    // Notify('info', 'Starting download...');

    // Check if already downloading
    if (container.dataset.downloading === 'true') {
      return;
    }

    // Stop any previous poller (avoid leaks on retry)
    try {
      if (container.__ytDownloadPoll) {
        clearInterval(container.__ytDownloadPoll);
        container.__ytDownloadPoll = null;
      }
    } catch (e) {}

    // Get UI elements from the container
    const downloadBtn = container.querySelector('.download-btn');
    const retryBtn = container.querySelector('.retry-btn');
    const progressRetryBtn = container.querySelector('.progress-retry-btn');
    const downloadAgainBtn = container.querySelector('.download-again-btn');
    const progressContainer = container.querySelector('.progress-container');
    const progressFill = container.querySelector('.progress-fill');
    const progressText = container.querySelector('.progress-text');
    const downloadText = container.querySelector('.download-text');

    // Set downloading flag
    container.dataset.downloading = 'true';
    container.dataset.urlOpened = 'false';
    container.dataset.lastDownloadUrl = '';

    // Update UI to show progress
    downloadBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    progressRetryBtn.style.display = 'block';
    if (downloadAgainBtn) downloadAgainBtn.style.display = 'none';
    progressContainer.style.display = 'flex';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    // Prefer GM_xmlhttpRequest so provider calls are not blocked by page CORS.
    const fetchJsonWithTimeout = (url, timeoutMs = 20000) => {
      const gmXhr =
        typeof GM_xmlhttpRequest === 'function'
          ? GM_xmlhttpRequest
          : typeof globalThis.GM_xmlhttpRequest === 'function'
            ? globalThis.GM_xmlhttpRequest.bind(globalThis)
            : typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function'
              ? GM.xmlHttpRequest.bind(GM)
              : typeof globalThis.GM?.xmlHttpRequest === 'function'
                ? globalThis.GM.xmlHttpRequest.bind(globalThis.GM)
                : null;

      if (gmXhr) {
        return new Promise((resolve, reject) => {
          let settled = false;
          const done = (fn, value) => {
            if (settled) return;
            settled = true;
            fn(value);
          };
          gmXhr({
            method: 'GET',
            url: String(url),
            timeout: timeoutMs,
            anonymous: true,
            headers: {
              Accept: 'application/json, text/plain, */*',
            },
            onload: (res) => {
              const status = Number(res.status) || 0;
              if (status < 200 || status >= 300) {
                done(reject, new Error(`HTTP ${status}`));
                return;
              }
              try {
                const text = res.responseText ?? '';
                done(resolve, text ? JSON.parse(text) : {});
              } catch (err) {
                done(reject, err instanceof Error ? err : new Error(String(err)));
              }
            },
            onerror: () => done(reject, new Error('Network error')),
            ontimeout: () => done(reject, new Error('Request timeout')),
            onabort: () => done(reject, new Error('Request aborted')),
          });
        });
      }

      // Fallback (extension polyfill should provide GM_xmlhttpRequest)
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      return fetch(url, { signal: ctrl.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .finally(() => clearTimeout(t));
    };

    const setErrorState = () => {
      retryBtn.style.display = 'block';
      progressContainer.style.display = 'none';
      progressRetryBtn.style.display = 'none';
      if (downloadAgainBtn) downloadAgainBtn.style.display = 'none';
      container.dataset.downloading = 'false';
      container.dataset.urlOpened = 'false';
      container.dataset.lastDownloadUrl = '';
    };

    const markCompleteAndOpen = (downloadUrl) => {
      if (!downloadUrl) {
        setErrorState();
        return;
      }
      // Save for the \"download again\" button
      container.dataset.lastDownloadUrl = String(downloadUrl);
      // Check if URL was already opened
      if (container.dataset.urlOpened === 'true') return;
      // Mark URL as opened
      container.dataset.urlOpened = 'true';
      // Update UI to show completion
      container.classList.add('completed');
      container.classList.remove('video', 'audio');
      downloadText.textContent = 'Download Complete!';
      progressFill.style.width = '100%';
      progressText.textContent = '100%';
      progressRetryBtn.style.display = 'none';
      if (downloadAgainBtn) downloadAgainBtn.style.display = 'flex';
      container.dataset.downloading = 'false';
      try {
        window.open(downloadUrl);
      } catch (e) {
        console.warn('Could not open download URL:', e);
      }
    };

    const pollProgressUrl = (progressURL) => {
      container.__ytDownloadPoll = setInterval(async () => {
        try {
          const progressData = await fetchJsonWithTimeout(progressURL, 15000);

          const progress = Math.min((Number(progressData.progress) || 0) / 10, 100);
          progressFill.style.width = `${progress}%`;
          progressText.textContent = `${Math.round(progress)}%`;

          if (Number(progressData.progress) >= 1000 && progressData.download_url) {
            clearInterval(container.__ytDownloadPoll);
            container.__ytDownloadPoll = null;
            markCompleteAndOpen(progressData.download_url);
          }
        } catch (e) {
          console.error('Error in progress:', e);
          clearInterval(container.__ytDownloadPoll);
          container.__ytDownloadPoll = null;
          setErrorState();
        }
      }, 3000);
    };

    const trySaveNowProvider = async (baseUrl) => {
      const url = new URL('/ajax/download.php', baseUrl);
      url.searchParams.set('copyright', '0');
      url.searchParams.set('allow_extended_duration', '1');
      url.searchParams.set('format', String(format));
      url.searchParams.set('url', videoURL);
      url.searchParams.set('api', API_KEY_DEVELOPERMDCM);
      const data = await fetchJsonWithTimeout(url.toString(), 25000);
      if (!data?.success || !data?.progress_url) {
        throw new Error('SaveNow provider did not return success/progress_url');
      }
      return data;
    };

    const tryDubsProvider = async () => {
      const videoId = paramsVideoURL();
      if (!videoId) throw new Error('Missing videoId');

      const startUrl = new URL(DUBS_START_ENDPOINT);
      startUrl.searchParams.set('id', videoId);
      startUrl.searchParams.set('format', String(format));

      const startData = await fetchJsonWithTimeout(startUrl.toString(), 25000);
      if (!startData?.success || !startData?.progressId) {
        throw new Error('Dubs provider did not return success/progressId');
      }

      const statusUrl = new URL(DUBS_STATUS_ENDPOINT);
      statusUrl.searchParams.set('id', startData.progressId);

      container.__ytDownloadPoll = setInterval(async () => {
        try {
          const st = await fetchJsonWithTimeout(statusUrl.toString(), 20000);
          const rawProgress = Number(st?.progress) || 0; // 0..1000
          const progress = Math.min(rawProgress / 10, 100);
          progressFill.style.width = `${progress}%`;
          progressText.textContent = `${Math.round(progress)}%`;

          if (st?.finished && st?.downloadUrl) {
            clearInterval(container.__ytDownloadPoll);
            container.__ytDownloadPoll = null;
            markCompleteAndOpen(st.downloadUrl);
          }
        } catch (e) {
          console.error('❌ Error polling dubs status:', e);
          clearInterval(container.__ytDownloadPoll);
          container.__ytDownloadPoll = null;
          setErrorState();
        }
      }, 3000);
    };

    try {
        let started = null;
        let lastErr = null;

        for (const base of DOWNLOAD_API_FALLBACK_BASES) {
          try {
            started = await trySaveNowProvider(base);
            break;
          } catch (e) {
            lastErr = e;
          }
        }

        if (started?.success && started?.progress_url) {
          pollProgressUrl(started.progress_url);
          return;
        }

        console.warn('SaveNow providers failed, falling back to dubs.io', lastErr);
        await tryDubsProvider();
    } catch (error) {
        setErrorState();
        console.error('❌ Error starting download:', error);
    }
}


  const UPDATE_INTERVAL = 1000;
    const STORAGE = {
        USAGE: 'YT_TOTAL_USAGE',
        VIDEO: 'YT_VIDEO_TIME',
        SHORTS: 'YT_SHORTS_TIME'
    };

    let usageTime = GM_getValue(STORAGE.USAGE, 0);
    let videoTime = GM_getValue(STORAGE.VIDEO, 0);
    let shortsTime = GM_getValue(STORAGE.SHORTS, 0);
    let lastUpdate = Date.now();
    let activeVideo = null;
    let activeType = null;

    // Inicializar almacenamiento
    GM_setValue(STORAGE.USAGE, usageTime);
    GM_setValue(STORAGE.VIDEO, videoTime);
    GM_setValue(STORAGE.SHORTS, shortsTime);

  function FormatterNumber(num, digits) {
    const lookup = [
      {
        value: 1,
        symbol: '',
      },
      {
        value: 1e3,
        symbol: ' K',
      },
      {
        value: 1e6,
        symbol: ' M',
      },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find((item) => {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
      : '0';
  }

  function paramsVideoURL() {
    const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
    return parametrosURL.get('v');
  }
