// =============================================================================
// 02-download.js — MP3/MP4 download + paramsVideoURL
// Source lines 370-611 of youtube_script_new_ui.js
// =============================================================================

  async function startDownloadVideoOrAudio(format, container) {
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
          : typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function'
            ? GM.xmlHttpRequest.bind(GM)
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
