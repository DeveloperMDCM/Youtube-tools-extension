// =============================================================================
// 13-transcript.js — Transcript: copy / download as .txt (multi-language,
// optional timestamps). Works in Tampermonkey and in the browser extension.
// Captions are fetched through the InnerTube ANDROID client, whose caption
// track URLs still work (WEB timedtext now needs a proof-of-origin token).
// =============================================================================

  const __ytTranscriptState = {
    panelOpen: false,
    tracks: [],
    cues: [],
    text: '',
    videoId: null,
    langIndex: 0,
    translate: '',
    withTimestamps: true,
    loading: false,
    resolved: false,
    fetchToken: 0,
  };

  function ytTranscriptPageWindow() {
    try {
      if (typeof unsafeWindow !== 'undefined' && unsafeWindow) return unsafeWindow;
    } catch (e) {}
    return typeof window !== 'undefined' ? window : null;
  }

  function ytTranscriptEscapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ytTranscriptTrackName(track) {
    const name = track?.name;
    if (name?.simpleText) return name.simpleText;
    if (Array.isArray(name?.runs)) return name.runs.map((r) => r.text || '').join('').trim();
    return track?.languageCode || 'Unknown';
  }

  // Extract a JSON object that follows `marker` in a page HTML string.
  function ytTranscriptExtractJson(html, marker) {
    const at = html.indexOf(marker);
    if (at === -1) return null;
    const start = html.indexOf('{', at);
    if (start === -1) return null;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < html.length; i++) {
      const ch = html[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return html.slice(start, i + 1);
      }
    }
    return null;
  }

  async function ytTranscriptFetchPagePlayerResponse() {
    const pageWin = ytTranscriptPageWindow();
    try {
      if (pageWin && pageWin.ytInitialPlayerResponse) return pageWin.ytInitialPlayerResponse;
    } catch (e) {}
    const res = await fetch(window.location.href, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const json = ytTranscriptExtractJson(html, 'ytInitialPlayerResponse');
    if (!json) throw new Error('Player response not found');
    return JSON.parse(json);
  }

  // The WEB caption URLs now return empty bodies without a proof-of-origin token.
  // The ANDROID InnerTube client still returns working caption track URLs.
  async function ytTranscriptFetchInnertubePlayer(videoId) {
    const client = {
      clientName: 'ANDROID',
      clientVersion: '20.10.38',
      androidSdkVersion: 30,
      hl: 'en',
      gl: 'US',
    };
    try {
      const cfg = ytTranscriptPageWindow()?.ytcfg;
      const hl = cfg?.get?.('HL');
      const gl = cfg?.get?.('GL');
      if (hl) client.hl = hl;
      if (gl) client.gl = gl;
    } catch (e) {}

    const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: { client },
        videoId,
        contentCheckOk: true,
        racyCheckOk: true,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function ytTranscriptResolvePlayerResponse(videoId) {
    try {
      const android = await ytTranscriptFetchInnertubePlayer(videoId);
      if (ytTranscriptGetTracks(android).length) return android;
      const page = await ytTranscriptFetchPagePlayerResponse();
      if (ytTranscriptGetTracks(page).length) return page;
      return android;
    } catch (err) {
      console.warn('[Youtube Tools] innertube player failed, using page response', err);
      return ytTranscriptFetchPagePlayerResponse();
    }
  }

  function ytTranscriptGetTracks(playerResponse) {
    const list = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    return Array.isArray(list) ? list.filter((t) => t && t.baseUrl) : [];
  }

  function ytTranscriptFormatTime(sec) {
    const total = Math.max(0, Math.floor(Number(sec) || 0));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
    return `${h > 0 ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
  }

  function ytTranscriptParseJson3(data) {
    const events = Array.isArray(data?.events) ? data.events : [];
    const cues = [];
    for (const ev of events) {
      if (!Array.isArray(ev?.segs)) continue;
      const text = ev.segs.map((s) => s.utf8 || '').join('').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      cues.push({ start: (Number(ev.tStartMs) || 0) / 1000, text });
    }
    return cues;
  }

  function ytTranscriptParseXml(xml) {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    return Array.from(doc.querySelectorAll('text'))
      .map((node) => ({
        start: parseFloat(node.getAttribute('start')) || 0,
        text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
      }))
      .filter((cue) => cue.text);
  }

  async function ytTranscriptFetchCues(track, tlang) {
    const jsonUrl = new URL(track.baseUrl);
    jsonUrl.searchParams.set('fmt', 'json3');
    if (tlang) jsonUrl.searchParams.set('tlang', tlang);

    const res = await fetch(jsonUrl.toString(), { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    const body = await res.text();

    if (body.trim().startsWith('<')) return ytTranscriptParseXml(body);

    try {
      const cues = ytTranscriptParseJson3(JSON.parse(body));
      if (cues.length) return cues;
    } catch (e) {}

    if (contentType.includes('json')) return [];
    return ytTranscriptParseXml(body);
  }

  function ytTranscriptBuildText(cues, withTimestamps) {
    if (!cues || !cues.length) return '';
    if (withTimestamps) {
      return cues.map((c) => `[${ytTranscriptFormatTime(c.start)}] ${c.text}`).join('\n');
    }
    let out = '';
    for (const cue of cues) {
      out += `${cue.text} `;
      if (/[.!?。！？…]["')\]]?$/.test(cue.text)) out += '\n';
    }
    out = out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!out.includes('\n') && cues.length > 1) out = cues.map((c) => c.text).join(' ');
    return out;
  }

  function ytTranscriptFilename() {
    const id = getCurrentVideoId() || 'video';
    let title = '';
    try {
      title = $e('h1.style-scope.ytd-watch-metadata')?.innerText || '';
      if (!title) title = (document.title || '').replace(/\s*-\s*YouTube\s*$/, '');
    } catch (e) {}
    title = String(title).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    return `${title || id} - transcript.txt`;
  }

  function ytTranscriptDownloadText(text) {
    const blob = new Blob([`\uFEFF${text}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = $cl('a');
    link.href = url;
    link.download = ytTranscriptFilename();
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function ytTranscriptCopyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const area = $cl('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      area.remove();
      return ok;
    }
  }

  function ytTranscriptSetStatus(message, kind) {
    const status = $id('yt-tr-status');
    if (!status) return;
    status.textContent = message || '';
    status.dataset.kind = kind || '';
  }

  function ytTranscriptUpdatePreview() {
    const preview = $id('yt-tr-preview');
    const copyBtn = $id('yt-tr-copy');
    const downloadBtn = $id('yt-tr-download');
    const text = ytTranscriptBuildText(__ytTranscriptState.cues, __ytTranscriptState.withTimestamps);
    __ytTranscriptState.text = text;

    if (preview) preview.textContent = text.length > 8000 ? `${text.slice(0, 8000)}\n…` : text;
    const hasText = !!text;
    if (copyBtn) copyBtn.disabled = !hasText;
    if (downloadBtn) downloadBtn.disabled = !hasText;
  }

  function ytTranscriptRenderPanel() {
    const panel = $id('yt-transcript-panel');
    if (!panel) return;

    const tracks = __ytTranscriptState.tracks;
    if (!__ytTranscriptState.resolved) {
      panel.innerHTML = `
        <div class="yt-tr-header">
          <span class="yt-tr-title"><i class="fa-solid fa-align-left"></i> Transcript</span>
          <button type="button" class="yt-tr-close" id="yt-tr-close" title="Close">✕</button>
        </div>
        <div class="yt-tr-empty">Reading available captions…</div>
      `;
      $id('yt-tr-close')?.addEventListener('click', () => ytTranscriptToggle(false));
      return;
    }
    if (!tracks.length) {
      panel.innerHTML = `
        <div class="yt-tr-header">
          <span class="yt-tr-title"><i class="fa-solid fa-align-left"></i> Transcript</span>
          <button type="button" class="yt-tr-close" id="yt-tr-close" title="Close">✕</button>
        </div>
        <div class="yt-tr-empty">No captions / transcript available for this video.</div>
      `;
      $id('yt-tr-close')?.addEventListener('click', () => ytTranscriptToggle(false));
      return;
    }

    const langOptions = tracks
      .map((track, index) => {
        const auto = track.kind === 'asr' ? ' (auto)' : '';
        return `<option value="${index}">${ytTranscriptEscapeHtml(ytTranscriptTrackName(track) + auto)}</option>`;
      })
      .join('');

    const translateOptions = Object.entries(languagesTranslate)
      .map(([code, name]) => `<option value="${code}">${ytTranscriptEscapeHtml(name)}</option>`)
      .join('');

    panel.innerHTML = `
      <div class="yt-tr-header">
        <span class="yt-tr-title"><i class="fa-solid fa-align-left"></i> Transcript</span>
        <button type="button" class="yt-tr-close" id="yt-tr-close" title="Close">✕</button>
      </div>
      <div class="yt-tr-controls">
        <label class="yt-tr-field">
          <span>Language</span>
          <select id="yt-tr-lang">${langOptions}</select>
        </label>
        <label class="yt-tr-field">
          <span>Translate to</span>
          <select id="yt-tr-translate">
            <option value="">Original (no translation)</option>
            ${translateOptions}
          </select>
        </label>
        <label class="yt-tr-check">
          <input type="checkbox" id="yt-tr-timestamps"${__ytTranscriptState.withTimestamps ? ' checked' : ''}>
          <span>Include timestamps</span>
        </label>
      </div>
      <div class="yt-tr-actions">
        <button type="button" class="yt-tr-btn" id="yt-tr-copy" disabled><i class="fa-solid fa-copy"></i> Copy</button>
        <button type="button" class="yt-tr-btn primary" id="yt-tr-download" disabled><i class="fa-solid fa-download"></i> Download .txt</button>
      </div>
      <div class="yt-tr-status" id="yt-tr-status"></div>
      <pre class="yt-tr-preview" id="yt-tr-preview"></pre>
    `;

    $id('yt-tr-close')?.addEventListener('click', () => ytTranscriptToggle(false));

    const langSelect = $id('yt-tr-lang');
    const translateSelect = $id('yt-tr-translate');
    const timestampsCheck = $id('yt-tr-timestamps');

    if (langSelect) langSelect.value = String(__ytTranscriptState.langIndex || 0);
    if (translateSelect) translateSelect.value = __ytTranscriptState.translate || '';

    langSelect?.addEventListener('change', () => {
      __ytTranscriptState.langIndex = Number(langSelect.value) || 0;
      ytTranscriptLoad();
    });
    translateSelect?.addEventListener('change', () => {
      __ytTranscriptState.translate = translateSelect.value || '';
      ytTranscriptLoad();
    });
    timestampsCheck?.addEventListener('change', () => {
      __ytTranscriptState.withTimestamps = !!timestampsCheck.checked;
      ytTranscriptUpdatePreview();
    });

    $id('yt-tr-copy')?.addEventListener('click', async () => {
      if (!__ytTranscriptState.text) return;
      const ok = await ytTranscriptCopyText(__ytTranscriptState.text);
      ytTranscriptSetStatus(ok ? 'Transcript copied to clipboard' : 'Could not copy transcript', ok ? 'ok' : 'error');
      if (ok) Notify('success', 'Transcript copied');
    });
    $id('yt-tr-download')?.addEventListener('click', () => {
      if (!__ytTranscriptState.text) return;
      ytTranscriptDownloadText(__ytTranscriptState.text);
      ytTranscriptSetStatus('Transcript downloaded as .txt', 'ok');
      Notify('success', 'Transcript downloaded');
    });
  }

  async function ytTranscriptLoad() {
    const tracks = __ytTranscriptState.tracks;
    if (!tracks.length) return;

    const token = ++__ytTranscriptState.fetchToken;
    const track = tracks[__ytTranscriptState.langIndex] || tracks[0];
    const tlang = __ytTranscriptState.translate;

    __ytTranscriptState.loading = true;
    ytTranscriptSetStatus('Loading transcript…', 'loading');

    try {
      const cues = await ytTranscriptFetchCues(track, tlang);
      if (token !== __ytTranscriptState.fetchToken) return;
      __ytTranscriptState.cues = cues;
      __ytTranscriptState.loading = false;
      if (!cues.length) {
        ytTranscriptSetStatus('No transcript content for this language.', 'error');
      } else {
        const shown = `${cues.length} segments${tlang ? ` · translated to ${languagesTranslate[tlang] || tlang}` : ''}`;
        ytTranscriptSetStatus(shown, 'ok');
      }
      ytTranscriptUpdatePreview();
    } catch (err) {
      if (token !== __ytTranscriptState.fetchToken) return;
      __ytTranscriptState.loading = false;
      __ytTranscriptState.cues = [];
      ytTranscriptUpdatePreview();
      ytTranscriptSetStatus('Could not load transcript. Try another language.', 'error');
      console.warn('[Youtube Tools] transcript error', err);
    }
  }

  async function ytTranscriptEnsureLoaded(videoId) {
    if (__ytTranscriptState.videoId === videoId && __ytTranscriptState.tracks.length) return;
    __ytTranscriptState.videoId = videoId;
    __ytTranscriptState.tracks = [];
    __ytTranscriptState.cues = [];
    __ytTranscriptState.langIndex = 0;
    __ytTranscriptState.translate = '';
    __ytTranscriptState.text = '';
    __ytTranscriptState.resolved = false;
    ytTranscriptRenderPanel();
    ytTranscriptSetStatus('Reading available captions…', 'loading');
    try {
      const playerResponse = await ytTranscriptResolvePlayerResponse(videoId);
      if (__ytTranscriptState.videoId !== videoId) return;
      __ytTranscriptState.tracks = ytTranscriptGetTracks(playerResponse);
      __ytTranscriptState.resolved = true;
      ytTranscriptRenderPanel();
      if (__ytTranscriptState.tracks.length) await ytTranscriptLoad();
      else ytTranscriptSetStatus('No captions / transcript available for this video.', 'error');
    } catch (err) {
      if (__ytTranscriptState.videoId !== videoId) return;
      __ytTranscriptState.resolved = true;
      ytTranscriptRenderPanel();
      ytTranscriptSetStatus('Could not read captions for this video.', 'error');
      console.warn('[Youtube Tools] transcript error', err);
    }
  }

  function ytTranscriptToggle(force) {
    const panel = $id('yt-transcript-panel');
    if (!panel) return;
    __ytToolsRuntime.transcriptPanelOpen = force == null
      ? !__ytToolsRuntime.transcriptPanelOpen
      : !!force;
    panel.style.display = __ytToolsRuntime.transcriptPanelOpen ? 'block' : 'none';
    if (__ytToolsRuntime.transcriptPanelOpen) {
      const videoId = getCurrentVideoId();
      if (!videoId) return;
      ytTranscriptEnsureLoaded(videoId);
      setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  }

  function ytTranscriptHandleButtonClick() {
    if (!window.location.href.includes('youtube.com/watch')) {
      Notify('info', 'Open a video to use the transcript tool');
      return;
    }
    ytTranscriptToggle();
  }

  (function ytTranscriptBind() {
    if (__ytToolsRuntime.transcriptClickHandlerInitialized) return;
    __ytToolsRuntime.transcriptClickHandlerInitialized = true;

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('#yt-transcript-btn')) return;
      e.preventDefault();
      e.stopPropagation();
      ytTranscriptHandleButtonClick();
    });

    document.addEventListener('yt-navigate-finish', () => {
      // Reset between videos (SPA navigation keeps the panel in the DOM).
      const wasOpen = __ytToolsRuntime.transcriptPanelOpen;
      __ytTranscriptState.videoId = null;
      __ytTranscriptState.tracks = [];
      __ytTranscriptState.cues = [];
      __ytTranscriptState.text = '';
      __ytTranscriptState.resolved = false;
      const panel = $id('yt-transcript-panel');
      if (!panel) return;
      const onWatch = window.location.href.includes('youtube.com/watch');
      if (wasOpen && onWatch) {
        ytTranscriptToggle(true);
      } else {
        panel.innerHTML = '';
        panel.style.display = 'none';
        __ytToolsRuntime.transcriptPanelOpen = false;
      }
    });
  })();
