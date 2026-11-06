  // Keep the download UI inside the player so it remains visible in fullscreen.
  (() => {
    let panel;
    let button;
    const element = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text) node.textContent = text;
      return node;
    };

    function closePanel() {
      if (panel) panel.hidden = true;
      if (button) button.setAttribute('aria-expanded', 'false');
    }

    function createPanel(player) {
      panel = element('section', 'yt-tools-player-download');
      panel.id = 'yt-tools-player-download';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Download video');
      panel.hidden = true;
      const header = element('div', 'yt-tools-player-download-header');
      header.appendChild(element('strong', '', 'Download MP4'));
      const close = element('button', 'yt-tools-player-close', '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close download panel');
      close.addEventListener('click', closePanel);
      header.appendChild(close);
      panel.appendChild(header);
      const select = element('select', 'yt-tools-player-quality');
      select.setAttribute('aria-label', 'Video quality');
      [['', 'Choose video quality'], ['144', '144p MP4'], ['240', '240p MP4'],
        ['360', '360p MP4'], ['480', '480p MP4'], ['720', '720p HD MP4'],
        ['1080', '1080p Full HD MP4'], ['4k', '2160p 4K WEBM'], ['8k', '4320p 8K WEBM']]
        .forEach(([value, label]) => { const option = element('option', '', label); option.value = value; select.appendChild(option); });
      panel.appendChild(select);
      const box = element('div', 'download-container yt-tools-player-download-box');
      box.dataset.type = 'video';
      box.hidden = true;
      const text = element('span', 'download-text', 'Download video');
      const quality = element('span', 'download-quality');
      const download = element('button', 'download-btn', 'Download');
      download.type = 'button';
      const retry = element('button', 'retry-btn', 'Retry');
      retry.type = 'button'; retry.style.display = 'none';
      const progressRetry = element('button', 'progress-retry-btn', 'Retry');
      progressRetry.type = 'button'; progressRetry.style.display = 'none';
      const again = element('button', 'download-again-btn', 'Download again');
      again.type = 'button'; again.style.display = 'none';
      const progress = element('div', 'progress-container'); progress.style.display = 'none';
      const bar = element('div', 'progress-bar');
      bar.appendChild(element('div', 'progress-fill'));
      progress.append(bar, element('span', 'progress-text', '0%'));
      box.append(text, quality, download, retry, progressRetry, again, progress);
      panel.appendChild(box);
      select.addEventListener('change', () => {
        if (!select.value) return;
        box.hidden = false;
        box.dataset.quality = select.value;
        quality.textContent = ' ' + select.options[select.selectedIndex].text;
      });
      panel.addEventListener('click', event => {
        const target = event.target.closest('button');
        if (target && box.contains(target)) {
          event.preventDefault();
          if (target === again) { if (box.dataset.lastDownloadUrl) window.open(box.dataset.lastDownloadUrl); }
          else if (box.dataset.quality) {
            if (target === progressRetry) box.dataset.downloading = 'false';
            startDownloadVideoOrAudio(box.dataset.quality, box);
          }
        }
        event.stopPropagation();
      });
      panel.addEventListener('keydown', event => {
        if (event.key === 'Escape') { closePanel(); button?.focus(); event.stopPropagation(); }
      });
      player.appendChild(panel);
    }

    function ensurePlayerButton() {
      const player = document.querySelector('#movie_player');
      const controls = player?.querySelector('.ytp-left-controls');
      const play = controls?.querySelector('.ytp-play-button');
      if (!player || !controls || !play) return;
      if (button?.parentElement !== controls) {
        button = element('button', 'ytp-button yt-tools-player-mp4', 'MP4');
        button.id = 'yt-tools-player-mp4';
        button.type = 'button';
        button.title = 'Download video (MP4)';
        button.setAttribute('aria-label', 'Download video (MP4)');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'yt-tools-player-download');
        button.addEventListener('click', event => {
          event.preventDefault(); event.stopPropagation();
          if (!panel || panel.parentElement !== player) createPanel(player);
          panel.hidden = !panel.hidden;
          button.setAttribute('aria-expanded', String(!panel.hidden));
          if (!panel.hidden) panel.querySelector('select').focus();
        });
        play.insertAdjacentElement('afterend', button);
      }
      const settings = readJsonGM('ytSettingsMDCM', {});
      button.hidden = settings.btnDownloadMp4 === false;
    }

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      const controls = document.querySelector('#movie_player .ytp-left-controls');
      if (controls && button?.parentElement === controls) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; ensurePlayerButton(); });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-start', closePanel);
    document.addEventListener('yt-navigate-finish', ensurePlayerButton);
    ensurePlayerButton();
  })();
