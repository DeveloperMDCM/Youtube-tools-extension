// =============================================================================
// 12-app.js — Settings, features UI, init
// Source lines 4440-6851 of youtube_script_new_ui.js
// =============================================================================

  function addIcon() {
    const topBar = $e('ytd-topbar-menu-button-renderer');
    if (!topBar || $id('icon-menu-settings')) return;

    const toggleButton = $cl('div');
    toggleButton.id = 'toggle-button';

    const icon = $cl('i');
    icon.id = 'icon-menu-settings';
    icon.classList.add('fa-solid', 'fa-gear');

    toggleButton.appendChild(icon);
    topBar.parentElement.insertBefore(toggleButton, topBar);
      // Toggle panel visibility
    let openMenu = false;
    toggleButton.addEventListener('click', () => {
      openMenu = !openMenu;
      panel.classList.toggle('is-open', openMenu);
      panel.style.display = openMenu ? 'flex' : 'none';
    });


    }


  // In extension mode the popup owns the UI — do not inject the YouTube gear button.
  if (!IS_EXTENSION) {
    addIcon();
  }
  let openMenu = false;

  const close_menu_settings = $e('.close_menu_settings');
  if (close_menu_settings && !IS_EXTENSION) {
    close_menu_settings.addEventListener('click', () => {
      openMenu = false;
      panel.classList.remove('is-open');
      panel.style.display = 'none';
    });
  }

  // Tab + Home navigation (matches extension popup shell)
  // Scope to panel — YouTube also has #home / other IDs on the page
  const tabButtons = panel.querySelectorAll('.tab-mdcm');
  const tabContents = panel.querySelectorAll('.tab-content');
  const homeNavBtn = panel.querySelector('#home-nav-btn');

  function showPanelView(tabName) {
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    tabContents.forEach((content) => content.classList.remove('active'));
    const isHome = tabName === 'yt-tools-home' || tabName === 'home';
    homeNavBtn?.classList.toggle('active', isHome);
    const targetId = isHome ? 'yt-tools-home' : tabName;
    const target = panel.querySelector(`#${targetId}`);
    if (target) target.classList.add('active');
    if (!isHome) {
      const btn = panel.querySelector(`.tab-mdcm[data-tab="${tabName}"]`);
      if (btn) btn.classList.add('active');
    }
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      if (tabName) showPanelView(tabName);
    });
  });

  if (homeNavBtn) {
    homeNavBtn.addEventListener('click', () => showPanelView('yt-tools-home'));
  }

  function readBtnToggle(id) {
    const el = $id(id);
    return el ? el.checked : true;
  }

  // Function to save settings
  function saveSettings() {
    // Extension popup owns persistence — never overwrite chrome.storage from the hidden DOM panel.
    if (IS_EXTENSION) return;

    const settings = {
      theme: $e('input[name="theme"]:checked').value,
      bgColorPicker: $id('bg-color-picker').value,
      progressbarColorPicker: $id('progressbar-color-picker').value,
      primaryColorPicker: $id('primary-color-picker').value,
      secondaryColorPicker: $id('secondary-color-picker').value,
      headerColorPicker: $id('header-color-picker').value,
      iconsColorPicker: $id('icons-color-picker').value,
      menuColorPicker: $id('menu-color-picker').value,
      lineColorPicker: $id('line-color-picker').value,
      timeColorPicker: $id('time-color-picker').value,
      dislikes: $id('dislikes-toggle').checked,
      likeDislikeBar: $id('like-dislike-bar-toggle').checked,
      bookmarks: $id('bookmarks-toggle').checked,
      continueWatching: $id('continue-watching-toggle').checked,
      shortsChannelName: $id('shorts-channel-name-toggle').checked,
      themes: $id('themes-toggle').checked,
      translation: $id('translation-toggle').checked,
      avatars: $id('avatars-toggle').checked,
      reverseMode: $id('reverse-mode-toggle').checked,
      waveVisualizer: $id('wave-visualizer-toggle').checked,
      waveVisualizerSelected: $id('select-wave-visualizer-select').value,
      hideComments: $id('hide-comments-toggle').checked,
      hideSidebar: $id('hide-sidebar-toggle').checked,
      disableAutoplay: $id('autoplay-toggle').checked,
      cinematicLighting: $id('cinematic-lighting-toggle').checked,
      syncCinematic: $id('sync-cinematic-toggle').checked, // NUEVO SETTING
      disableSubtitles: $id('subtitles-toggle').checked,
      // fontSize: $id('font-size-slider').value,
      playerSize: $id('player-size-slider').value,
      selectVideoQuality: $id('select-video-qualitys-select').value,
      languagesComments: $id('select-languages-comments-select').value,
      btnThumbnail: readBtnToggle('btn-thumbnail-toggle'),
      btnBuffer: readBtnToggle('btn-buffer-toggle'),
      btnFilterEyes: readBtnToggle('btn-filter-eyes-toggle'),
      btnReset: readBtnToggle('btn-reset-toggle'),
      btnRepeat: readBtnToggle('btn-repeat-toggle'),
      btnBookmark: readBtnToggle('btn-bookmark-toggle'),
      btnContinueWatching: readBtnToggle('btn-continue-toggle'),
      btnTranscript: readBtnToggle('btn-transcript-toggle'),
      btnDownloadMp4: readBtnToggle('btn-mp4-toggle'),
      btnDownloadMp3: readBtnToggle('btn-mp3-toggle'),
      btnExternalDownload: readBtnToggle('btn-external-toggle'),
      btnViewExternal: readBtnToggle('btn-view-external-toggle'),
      btnPip: readBtnToggle('btn-pip-toggle'),
      btnScreenshot: readBtnToggle('btn-screenshot-toggle'),
      btnCheckUpdates: readBtnToggle('btn-updates-toggle'),
      menu_developermdcm: {
        bg: selectedBgColor,
        color: selectedTextColor,
        accent: selectedBgAccentColor
      }
    };

    GM_setValue('ytSettingsMDCM', JSON.stringify(settings));
  }



  // Function to load settings
  function loadSettings() {
    const settings = JSON.parse(GM_getValue('ytSettingsMDCM', '{}'));
    // Mark as loaded early so applySettings/saveSettings don't overwrite persisted values with defaults.
    __ytToolsRuntime.settingsLoaded = true;

    if (settings.theme) {
      $e(`input[name="theme"][value="${settings.theme}"]`).checked = true;
    }
    settings.menu_developermdcm = settings.menu_developermdcm || {
      bg: "#0c0c0c",
      color: "#ffffff",
      accent: "#ff0000"
    };
    $id('bg-color-picker').value = settings.bgColorPicker || '#000000';
    $id('progressbar-color-picker').value = settings.progressbarColorPicker || '#ff0000';
    $id('primary-color-picker').value = settings.primaryColorPicker || '#ffffff';
    $id('secondary-color-picker').value = settings.secondaryColorPicker || '#ffffff';
    $id('header-color-picker').value = settings.headerColorPicker || '#000';
    $id('icons-color-picker').value = settings.iconsColorPicker || '#ffffff';
    $id('menu-color-picker').value = settings.menuColorPicker || '#000';
    $id('line-color-picker').value = settings.lineColorPicker || '#ff0000';
    $id('time-color-picker').value = settings.timeColorPicker || '#ffffff';
    $id('dislikes-toggle').checked = settings.dislikes || false;
    $id('like-dislike-bar-toggle').checked = settings.likeDislikeBar || false;
    $id('bookmarks-toggle').checked = settings.bookmarks || false;
    $id('continue-watching-toggle').checked = settings.continueWatching || false;
    $id('shorts-channel-name-toggle').checked = settings.shortsChannelName || false;
    $id('themes-toggle').checked = settings.themes || false;
    $id('translation-toggle').checked = settings.translation || false;
    $id('avatars-toggle').checked = settings.avatars || false;
    $id('reverse-mode-toggle').checked = settings.reverseMode || false;
    $id('wave-visualizer-toggle').checked = settings.waveVisualizer || false;
    $id('select-wave-visualizer-select').value = settings.waveVisualizerSelected || 'dinamica';
    $id('hide-comments-toggle').checked = settings.hideComments || false;
    $id('hide-sidebar-toggle').checked = settings.hideSidebar || false;
    $id('autoplay-toggle').checked = settings.disableAutoplay || false;
    $id('cinematic-lighting-toggle').checked = settings.cinematicLighting || false;
    $id('sync-cinematic-toggle').checked = settings.syncCinematic || false;
    $id('subtitles-toggle').checked = settings.disableSubtitles || false;
    // $id('font-size-slider').value = settings.fontSize || 16;
    $id('player-size-slider').value = settings.playerSize || 100;
    $id('select-video-qualitys-select').value = settings.selectVideoQuality || 'user';
    $id('select-languages-comments-select').value = settings.languagesComments || 'en';
    const setBtn = (id, value) => {
      const el = $id(id);
      if (el) el.checked = value !== false;
    };
    setBtn('btn-thumbnail-toggle', settings.btnThumbnail);
    setBtn('btn-buffer-toggle', settings.btnBuffer);
    setBtn('btn-filter-eyes-toggle', settings.btnFilterEyes);
    setBtn('btn-reset-toggle', settings.btnReset);
    setBtn('btn-repeat-toggle', settings.btnRepeat);
    setBtn('btn-bookmark-toggle', settings.btnBookmark);
    setBtn('btn-continue-toggle', settings.btnContinueWatching);
    setBtn('btn-transcript-toggle', settings.btnTranscript);
    setBtn('btn-mp4-toggle', settings.btnDownloadMp4);
    setBtn('btn-mp3-toggle', settings.btnDownloadMp3);
    setBtn('btn-external-toggle', settings.btnExternalDownload);
    setBtn('btn-view-external-toggle', settings.btnViewExternal);
    setBtn('btn-pip-toggle', settings.btnPip);
    setBtn('btn-screenshot-toggle', settings.btnScreenshot);
    setBtn('btn-updates-toggle', settings.btnCheckUpdates);
    // Asegurar existencia de menu_developermdcm


    selectedBgColor = settings.menu_developermdcm.bg;
    selectedTextColor = settings.menu_developermdcm.color;
    selectedBgAccentColor = settings.menu_developermdcm.accent;


    $m('#bg-color-options .color-box').forEach(el => {
      el.classList.toggle('selected', el.dataset.value === selectedBgColor);
    });

    $m('#text-color-options .color-box').forEach(el => {
      el.classList.toggle('selected', el.dataset.value === selectedTextColor);
    });

    $m('#bg-accent-color-options .color-box').forEach(el => {
      el.classList.toggle('selected', el.dataset.value === selectedBgAccentColor);
    });

    // Apply menu colors (popup shell + legacy aliases)
    $sp('--popup-bg', selectedBgColor);
    $sp('--popup-text', selectedTextColor);
    $sp('--popup-accent', selectedBgAccentColor);
    $sp('--yt-enhance-menu-bg', selectedBgColor);
    $sp('--yt-enhance-menu-text', selectedTextColor);
    $sp('--yt-enhance-menu-accent', selectedBgAccentColor);
    updateSliderValues();

    setTimeout(() => {
      applySettings();
      if(settings.dislikes) {
          videoDislike();
          shortDislike();
          showDislikes = true;
      }

      if (window.location.href.includes('youtube.com/watch?v=')) {
        detectInitialCinematicState();
      }
    }, 500);
  }

  // Check if the video is in cinematic mode
  async function detectInitialCinematicState() {
    return new Promise((resolve) => {
      const waitForVideo = () => {
        const video = $e('video');
        const cinematicDiv = $id('cinematics');

        if (!video || !cinematicDiv || isNaN(video.duration) || video.duration === 0) {
          setTimeout(waitForVideo, 500);
          return;
        }
        
        const settings = JSON.parse(GM_getValue('ytSettingsMDCM', '{}'));
        if (!settings.syncCinematic) {
          // apply cinematic toggle
          const cinematicToggle = $id('cinematic-lighting-toggle');
          if (cinematicToggle && cinematicDiv) {
            cinematicDiv.style.display = cinematicToggle.checked ? 'block' : 'none';
          }
          resolve(false);
          return;
        }

        const startTime = video.currentTime;
        const checkPlayback = () => {
          if (video.currentTime >= startTime + 1) {
            const isActive = isCinematicActive();
           
            const cinematicToggle = $id('cinematic-lighting-toggle');
            if (cinematicToggle && cinematicToggle.checked !== isActive) {
              cinematicToggle.checked = isActive;
              saveSettings();
            }

            resolve(isActive);
          } else {
            setTimeout(checkPlayback, 300);
          }
        };

        checkPlayback();
      };

      waitForVideo();
    });
  }

  $m('.color-box').forEach(box => {
    box.addEventListener('click', () => {
      const type = box.dataset.type;
      const value = box.dataset.value;

      if (type === 'bg') {
        selectedBgColor = value;
        $sp('--popup-bg', value);
        $sp('--yt-enhance-menu-bg', value);
        $m('#bg-color-options .color-box').forEach(el => {
          el.classList.remove('selected');
        });
        box.classList.add('selected');
      } else if (type === 'color') {
        selectedTextColor = value;
        $sp('--popup-text', value);
        $sp('--yt-enhance-menu-text', value);
        $m('#text-color-options .color-box').forEach(el => {
          el.classList.remove('selected');
        });
        box.classList.add('selected');
      }
       else if (type === 'accent') {
        selectedBgAccentColor = value;
        $sp('--popup-accent', value);
        $sp('--yt-enhance-menu-accent', value);
        $m('#bg-accent-color-options .color-box').forEach(el => {
          el.classList.remove('selected');
        });
        box.classList.add('selected');
      }
      saveSettings();
    });
  });


  function updateSliderValues() {
    $id('player-size-value').textContent = $id('player-size-slider').value;

  }

  $id('reset-player-size').addEventListener('click', () => {
    $id('player-size-slider').value = 100;
    updateSliderValues();
    applySettings();
  });

   // Initialize header buttons once
  function initializeHeaderButtons() {
    const shareBtn = $id('shareBtn-mdcm');
    const importExportBtn = $id('importExportBtn');
    const closeImportExportBtn = $id('closeImportExportBtn');

    if (shareBtn && !shareBtn.dataset.initialized) {
      shareBtn.dataset.initialized = 'true';
      shareBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        const dropdown = $id('shareDropdown');
        const importExportArea = $id('importExportArea');
        if (importExportArea) importExportArea.classList.remove('active');
        if (dropdown) {
          const open = !dropdown.classList.contains('is-open');
          dropdown.classList.toggle('is-open', open);
          dropdown.style.display = open ? 'block' : 'none';
        }
      });
    }

    if (importExportBtn && !importExportBtn.dataset.initialized) {
      importExportBtn.dataset.initialized = 'true';
      importExportBtn.addEventListener('click', function() {
        const importExportArea = $id('importExportArea');
        const dropdown = $id('shareDropdown');
        if (dropdown) {
          dropdown.classList.remove('is-open');
          dropdown.style.display = 'none';
        }
        if (importExportArea) {
          importExportArea.classList.toggle('active');
        }
      });
    }

    if (closeImportExportBtn && !closeImportExportBtn.dataset.initialized) {
      closeImportExportBtn.dataset.initialized = 'true';
      closeImportExportBtn.addEventListener('click', function() {
        const importExportArea = $id('importExportArea');
        if (importExportArea) {
          importExportArea.classList.remove('active');
        }
      });
    }
  }

  // Cinematic Lighting Control Functions
  function isWatchPage() {
    return window.location.href.includes('youtube.com/watch?v=');
  }

  function isCinematicActive() {
    const cinematicDiv = document.getElementById('cinematics');
    if (!cinematicDiv) {
      return false;
    }

    const hasContent = cinematicDiv.innerHTML.trim() !== '';
    const hasCanvas = cinematicDiv.querySelector('canvas') !== null;
    const hasChildren = cinematicDiv.children.length > 0;
   
    const hasCinematicElements = cinematicDiv.querySelector('div[style*="position: fixed"]') !== null;

    return hasContent || hasCanvas || hasChildren || hasCinematicElements;
  }

  function toggleCinematicLighting() {
    const settingsButton = $e('.ytp-button.ytp-settings-button');
    if (!settingsButton) {
      console.log('Settings button not found');
      return;
    }


    settingsButton.click();

   
    const observer = new MutationObserver((mutations) => {
      const menuItems = $m('.ytp-menuitem');

      for (let item of menuItems) {
        const text = item.textContent?.toLowerCase();
        const icon = item.querySelector('.ytp-menuitem-icon svg path');

       
        if (text && (text.includes('cinematic') || text.includes('lighting') || text.includes('cinema'))) {
          console.log('Found cinematic lighting option:', text);
          item.click();

         
          setTimeout(() => {
            const menu = $e('.ytp-settings-menu');
            if (menu) {
              document.body.click();
            }
          }, 100);

          observer.disconnect();
          return;
        }

        
        if (icon && (icon.getAttribute('d')?.includes('M21 7v10H3V7') ||
                    icon.getAttribute('d')?.includes('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'))) {
          console.log('Found cinematic lighting option by SVG path');
          item.click();
          
          setTimeout(() => {
            const menu = $e('.ytp-settings-menu');
            if (menu) {
              document.body.click();
            }
          }, 100);

          observer.disconnect();
          return;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
    setTimeout(() => {
      observer.disconnect();
      const menu = $e('.ytp-settings-menu');
      if (menu) {
        document.body.click();
      }
    }, 5000);
  }

  function syncPlayerButtonsVisibility(settings) {
    const root = $e('.containerButtons');
    if (!root) return;
    const setVisible = (selector, visible) => {
      root.querySelectorAll(selector).forEach((el) => {
        el.style.display = visible ? '' : 'none';
      });
    };
    setVisible('#imagen', settings.btnThumbnail !== false);
    setVisible('.buffer_video', settings.btnBuffer !== false);
    // Filter-eyes block (wrapper div containing #eyes)
    root.querySelectorAll('div').forEach((div) => {
      if (div.querySelector && div.querySelector('#eyes')) {
        div.style.display = settings.btnFilterEyes !== false ? '' : 'none';
      }
    });
    setVisible('#reset_button', settings.btnReset !== false);
    setVisible('#repeatvideo', settings.btnRepeat !== false);
    const showBookmarks = !!settings.bookmarks && settings.btnBookmark !== false;
    setVisible('#yt-bookmark-add', showBookmarks);
    setVisible('#yt-bookmark-toggle', showBookmarks);
    const showContinue = !!settings.continueWatching && settings.btnContinueWatching !== false;
    setVisible('#yt-cw-history-toggle', showContinue);
    setVisible('#yt-transcript-btn', settings.btnTranscript !== false);
    setVisible('.btn1', settings.btnDownloadMp4 !== false);
    setVisible('.btn2', settings.btnDownloadMp3 !== false);
    setVisible('.btn3', settings.btnDownloadMp4 !== false || settings.btnDownloadMp3 !== false);
    setVisible('.external_link', settings.btnExternalDownload !== false);
    setVisible('.view_external_link', settings.btnViewExternal !== false);
    setVisible('.video_picture_to_picture', settings.btnPip !== false);
    setVisible('.screenshot_video', settings.btnScreenshot !== false);
    setVisible('.checked_updates', settings.btnCheckUpdates !== false);
  }

  function syncHiddenPanelFromSettings(settings) {
    if (!$id('dislikes-toggle')) return;
    try {
      const themeVal = String(settings.theme ?? 'custom');
      const themeInput = $e(`input[name="theme"][value="${themeVal}"]`);
      if (themeInput) themeInput.checked = true;
      else if (themeVal !== 'custom' && themeVal !== 'normal') {
        const normal = $e('input[name="theme"][value="normal"]');
        if (normal) normal.checked = true;
      }

      const setVal = (id, value) => {
        const el = $id(id);
        if (el && value != null) el.value = value;
      };
      const setCheck = (id, value) => {
        const el = $id(id);
        if (el) el.checked = !!value;
      };

      setVal('bg-color-picker', settings.bgColorPicker || '#000000');
      setVal('progressbar-color-picker', settings.progressbarColorPicker || '#ff0000');
      setVal('primary-color-picker', settings.primaryColorPicker || '#ffffff');
      setVal('secondary-color-picker', settings.secondaryColorPicker || '#ffffff');
      setVal('header-color-picker', settings.headerColorPicker || '#000000');
      setVal('icons-color-picker', settings.iconsColorPicker || '#ffffff');
      setVal('menu-color-picker', settings.menuColorPicker || '#000000');
      setVal('line-color-picker', settings.lineColorPicker || '#ff0000');
      setVal('time-color-picker', settings.timeColorPicker || '#ffffff');
      setCheck('dislikes-toggle', settings.dislikes);
      setCheck('like-dislike-bar-toggle', settings.likeDislikeBar);
      setCheck('bookmarks-toggle', settings.bookmarks);
      setCheck('continue-watching-toggle', settings.continueWatching);
      setCheck('shorts-channel-name-toggle', settings.shortsChannelName);
      setCheck('themes-toggle', settings.themes);
      setCheck('translation-toggle', settings.translation);
      setCheck('avatars-toggle', settings.avatars);
      setCheck('reverse-mode-toggle', settings.reverseMode);
      setCheck('wave-visualizer-toggle', settings.waveVisualizer);
      setVal('select-wave-visualizer-select', settings.waveVisualizerSelected || 'dinamica');
      setCheck('hide-comments-toggle', settings.hideComments);
      setCheck('hide-sidebar-toggle', settings.hideSidebar);
      setCheck('autoplay-toggle', settings.disableAutoplay);
      setCheck('cinematic-lighting-toggle', settings.cinematicLighting);
      setCheck('sync-cinematic-toggle', settings.syncCinematic);
      setCheck('subtitles-toggle', settings.disableSubtitles);
      setVal('player-size-slider', settings.playerSize ?? 100);
      setVal('select-video-qualitys-select', settings.selectVideoQuality || 'user');
      setVal('select-languages-comments-select', settings.languagesComments || 'en');
      setCheck('btn-thumbnail-toggle', settings.btnThumbnail !== false);
      setCheck('btn-buffer-toggle', settings.btnBuffer !== false);
      setCheck('btn-filter-eyes-toggle', settings.btnFilterEyes !== false);
      setCheck('btn-reset-toggle', settings.btnReset !== false);
      setCheck('btn-repeat-toggle', settings.btnRepeat !== false);
      setCheck('btn-bookmark-toggle', settings.btnBookmark !== false);
      setCheck('btn-continue-toggle', settings.btnContinueWatching !== false);
      setCheck('btn-transcript-toggle', settings.btnTranscript !== false);
      setCheck('btn-mp4-toggle', settings.btnDownloadMp4 !== false);
      setCheck('btn-mp3-toggle', settings.btnDownloadMp3 !== false);
      setCheck('btn-external-toggle', settings.btnExternalDownload !== false);
      setCheck('btn-view-external-toggle', settings.btnViewExternal !== false);
      setCheck('btn-pip-toggle', settings.btnPip !== false);
      setCheck('btn-screenshot-toggle', settings.btnScreenshot !== false);
      setCheck('btn-updates-toggle', settings.btnCheckUpdates !== false);

      const menu = settings.menu_developermdcm || {};
      selectedBgColor = menu.bg || selectedBgColor;
      selectedTextColor = menu.color || selectedTextColor;
      selectedBgAccentColor = menu.accent || selectedBgAccentColor;
    } catch (err) {
      console.warn('[Youtube Tools] syncHiddenPanelFromSettings', err);
    }
  }

  // Function to apply settings
  function applySettings() {
    const formulariodescarga = $e('.formulariodescarga');
    const formulariodescargaaudio = $e('.formulariodescargaaudio');
      if (formulariodescarga != undefined) {
        formulariodescarga.classList.add('ocultarframe');
        formulariodescargaaudio.classList.add('ocultarframe');
      }

    // Prefer storage when running as extension (popup is source of truth).
    let settings;
    try {
      const stored = JSON.parse(GM_getValue('ytSettingsMDCM', '{}') || '{}');
      if (IS_EXTENSION || !$id('dislikes-toggle')) {
        settings = {
          theme: stored.theme || 'custom',
          bgColorPicker: stored.bgColorPicker || '#000000',
          progressbarColorPicker: stored.progressbarColorPicker || '#ff0000',
          primaryColorPicker: stored.primaryColorPicker || '#ffffff',
          secondaryColorPicker: stored.secondaryColorPicker || '#ffffff',
          headerColorPicker: stored.headerColorPicker || '#000000',
          iconsColorPicker: stored.iconsColorPicker || '#ffffff',
          menuColorPicker: stored.menuColorPicker || '#000000',
          lineColorPicker: stored.lineColorPicker || '#ff0000',
          timeColorPicker: stored.timeColorPicker || '#ffffff',
          dislikes: !!stored.dislikes,
          likeDislikeBar: !!stored.likeDislikeBar,
          bookmarks: !!stored.bookmarks,
          continueWatching: !!stored.continueWatching,
          shortsChannelName: !!stored.shortsChannelName,
          themes: !!stored.themes,
          translation: !!stored.translation,
          avatars: !!stored.avatars,
          reverseMode: !!stored.reverseMode,
          waveVisualizer: !!stored.waveVisualizer,
          waveVisualizerSelected: stored.waveVisualizerSelected || 'dinamica',
          hideComments: !!stored.hideComments,
          hideSidebar: !!stored.hideSidebar,
          disableAutoplay: !!stored.disableAutoplay,
          cinematicLighting: !!stored.cinematicLighting,
          syncCinematic: !!stored.syncCinematic,
          disableSubtitles: !!stored.disableSubtitles,
          playerSize: stored.playerSize ?? 100,
          selectVideoQuality: stored.selectVideoQuality || 'user',
          languagesComments: stored.languagesComments || 'en',
          btnThumbnail: stored.btnThumbnail !== false,
          btnBuffer: stored.btnBuffer !== false,
          btnFilterEyes: stored.btnFilterEyes !== false,
          btnReset: stored.btnReset !== false,
          btnRepeat: stored.btnRepeat !== false,
          btnBookmark: stored.btnBookmark !== false,
          btnContinueWatching: stored.btnContinueWatching !== false,
          btnTranscript: stored.btnTranscript !== false,
          btnDownloadMp4: stored.btnDownloadMp4 !== false,
          btnDownloadMp3: stored.btnDownloadMp3 !== false,
          btnExternalDownload: stored.btnExternalDownload !== false,
          btnViewExternal: stored.btnViewExternal !== false,
          btnPip: stored.btnPip !== false,
          btnScreenshot: stored.btnScreenshot !== false,
          btnCheckUpdates: stored.btnCheckUpdates !== false,
          menu_developermdcm: stored.menu_developermdcm || {
            bg: selectedBgColor,
            color: selectedTextColor,
            accent: selectedBgAccentColor,
          },
        };
        selectedBgColor = settings.menu_developermdcm.bg;
        selectedTextColor = settings.menu_developermdcm.color;
        selectedBgAccentColor = settings.menu_developermdcm.accent;
        if (IS_EXTENSION) syncHiddenPanelFromSettings(settings);
      }
    } catch (e) {
      settings = null;
    }

    if (!settings) {
      settings = {
        theme: $e('input[name="theme"]:checked')?.value,
        bgColorPicker: $id('bg-color-picker')?.value,
        progressbarColorPicker: $id('progressbar-color-picker')?.value,
        primaryColorPicker: $id('primary-color-picker')?.value,
        secondaryColorPicker: $id('secondary-color-picker')?.value,
        headerColorPicker: $id('header-color-picker')?.value,
        iconsColorPicker: $id('icons-color-picker')?.value,
        menuColorPicker: $id('menu-color-picker')?.value,
        lineColorPicker: $id('line-color-picker')?.value,
        timeColorPicker: $id('time-color-picker')?.value,
        dislikes: $id('dislikes-toggle')?.checked,
        likeDislikeBar: $id('like-dislike-bar-toggle')?.checked,
        bookmarks: $id('bookmarks-toggle')?.checked,
        continueWatching: $id('continue-watching-toggle')?.checked,
        shortsChannelName: $id('shorts-channel-name-toggle')?.checked,
        themes: $id('themes-toggle')?.checked,
        translation: $id('translation-toggle')?.checked,
        avatars: $id('avatars-toggle')?.checked,
        reverseMode: $id('reverse-mode-toggle')?.checked,
        waveVisualizer: $id('wave-visualizer-toggle')?.checked,
        waveVisualizerSelected: $id('select-wave-visualizer-select')?.value,
        hideComments: $id('hide-comments-toggle')?.checked,
        hideSidebar: $id('hide-sidebar-toggle')?.checked,
        disableAutoplay: $id('autoplay-toggle')?.checked,
        cinematicLighting: $id('cinematic-lighting-toggle')?.checked,
        syncCinematic: $id('sync-cinematic-toggle')?.checked,
        disableSubtitles: $id('subtitles-toggle')?.checked,
        playerSize: $id('player-size-slider')?.value,
        selectVideoQuality: $id('select-video-qualitys-select')?.value,
        languagesComments: $id('select-languages-comments-select')?.value,
        btnThumbnail: readBtnToggle('btn-thumbnail-toggle'),
        btnBuffer: readBtnToggle('btn-buffer-toggle'),
        btnFilterEyes: readBtnToggle('btn-filter-eyes-toggle'),
        btnReset: readBtnToggle('btn-reset-toggle'),
        btnRepeat: readBtnToggle('btn-repeat-toggle'),
        btnBookmark: readBtnToggle('btn-bookmark-toggle'),
        btnContinueWatching: readBtnToggle('btn-continue-toggle'),
        btnTranscript: readBtnToggle('btn-transcript-toggle'),
        btnDownloadMp4: readBtnToggle('btn-mp4-toggle'),
        btnDownloadMp3: readBtnToggle('btn-mp3-toggle'),
        btnExternalDownload: readBtnToggle('btn-external-toggle'),
        btnViewExternal: readBtnToggle('btn-view-external-toggle'),
        btnPip: readBtnToggle('btn-pip-toggle'),
        btnScreenshot: readBtnToggle('btn-screenshot-toggle'),
        btnCheckUpdates: readBtnToggle('btn-updates-toggle'),
        menu_developermdcm: {
          bg: selectedBgColor,
          color: selectedTextColor,
          accent: selectedBgAccentColor
        }
      };
    }
    $sp('--popup-bg', settings.menu_developermdcm.bg);
    $sp('--popup-text', settings.menu_developermdcm.color);
    $sp('--popup-accent', settings.menu_developermdcm.accent);
    $sp('--yt-enhance-menu-bg', settings.menu_developermdcm.bg);
    $sp('--yt-enhance-menu-text', settings.menu_developermdcm.color);
    $sp('--yt-enhance-menu-accent', settings.menu_developermdcm.accent);

    renderizarButtons();

        // Initialize header buttons
    if (!IS_EXTENSION) {
      initializeHeaderButtons();
    }




    // Hide comments
    const commentsSection = $id('comments');
    if (commentsSection) {
      commentsSection.style.display = settings.hideComments ? 'none' : 'block';
    }

     // Active inactive Themes
     const themesMenuSection = $e('.themes-hidden');
     if (themesMenuSection) {
      themesMenuSection.style.display = settings.themes ? 'block' : 'none';
     }

    // Hide sidebar
    const sidebarSection = $e('#secondary > #secondary-inner');

    if (sidebarSection) {
      sidebarSection.classList.add('side-moi');
    const sidebarSection2 = $e('.side-moi');

    sidebarSection2.style.display = settings.hideSidebar ? 'none' : 'block';
    }

    // Disable autoplay
    const autoplayToggle = $e('.ytp-autonav-toggle-button');
    if (autoplayToggle) {
      const isCurrentlyOn =
        autoplayToggle.getAttribute('aria-checked') === 'true';
      if (settings.disableAutoplay && isCurrentlyOn) {
        autoplayToggle.click();
      } else if (!settings.disableAutoplay && !isCurrentlyOn) {
        autoplayToggle.click();
      }
    }
    // Disable subtitles
    const subtitleToggle = $e('.ytp-subtitles-button');
    if (subtitleToggle) {
      const isCurrentlyOn =
        subtitleToggle.getAttribute('aria-pressed') === 'true';
      if (settings.disableSubtitles && isCurrentlyOn) {
        subtitleToggle.click();
      } else if (!settings.disableSubtitles && !isCurrentlyOn) {
        subtitleToggle.click();
      }
    }
    // Apply cinematic lighting setting
    if (isWatchPage()) {
      setTimeout(() => {
        const isCurrentlyActive = isCinematicActive();
        // Si la sincronización está activa, funciona como antes
        if (settings.syncCinematic) {
          if (settings.cinematicLighting && !isCurrentlyActive) {
            toggleCinematicLighting();
          } else if (!settings.cinematicLighting && isCurrentlyActive) {
            toggleCinematicLighting();
          }
        } else {
          // Si NO está activa, solo mostrar/ocultar #cinematics
          const cinematicDiv = $id('cinematics');
          if (cinematicDiv) {
            cinematicDiv.style.display = settings.cinematicLighting ? 'block' : 'none';
          }
        }
      }, 1000);
    }

    // Adjust font size
    // $e('body').style.fontSize = `${settings.fontSize}px`;

    // Adjust player size
    const player = $e('video');
    if (player) {
      player.style.transform = `scale(${settings.playerSize / 100})`;
    }

    // selected video quality
    const video = $e('div#movie_player');
    let ytPlayerQuality = localStorage.getItem('yt-player-quality');

    // only force quality if the user didn't select "user"
    if (video != undefined && settings.selectVideoQuality !== "user") {
      if (ytPlayerQuality) {
        let qualitySettings = JSON.parse(ytPlayerQuality);
        qualitySettings.data = JSON.stringify({ quality: settings.selectVideoQuality, previousQuality: 240 });
        localStorage.setItem('yt-player-quality', JSON.stringify(qualitySettings));

      } else {
        let defaultQualitySettings = {
          data: JSON.stringify({ quality: 720, previousQuality: 240 }),
          expiration: Date.now() + (365 * 24 * 60 * 60 * 1000),
          creation: Date.now()
        };
        localStorage.setItem('yt-player-quality', JSON.stringify(defaultQualitySettings));
      }
    }
   
    // Apply menu appearance settings
    // $sp('--yt-enhance-menu-bg', settings.menuBgColor);
    // $sp('--yt-enhance-menu-text', settings.menuTextColor);
    // $sp('--yt-enhance-menu-font-size', `${settings.menuFontSize}px`);

    // Apply theme (use settings, not hidden DOM radios — popup is source of truth in extension)
    const themeKey = String(settings.theme ?? 'custom');
    const selectedTheme = themes[themeKey] || themes[0];
    const isThemeCustom = themeKey === 'custom';
    const isThemeNormal = themeKey === 'normal';
    const themeCustomOptions = $e('.theme-custom-options');
    const themeNormal = $e('.theme-selected-normal');
    // Dynamic CSS (avoid GM_addStyle accumulating thousands of style tags)
    let dynamicCss = '';
    const addDynamicCss = (css) => {
      if (!css) return;
      dynamicCss += `\n${css}\n`;
    };
    if (themeNormal && themeCustomOptions) {
      if (isThemeCustom) {
        themeNormal.style.display = 'flex';
        themeCustomOptions.style.display = 'flex';
        const opts = $e('.themes-options');
        if (opts) opts.style.display = 'none';
      } else if (isThemeNormal) {
        const customRadio = $e('input[name="theme"][value="custom"]');
        if (customRadio) customRadio.checked = false;
        themeNormal.style.display = 'flex';
        themeCustomOptions.style.display = 'none';
        const opts = $e('.themes-options');
        if (opts) opts.style.display = 'block';
      } else {
        themeNormal.style.display = 'none';
        themeCustomOptions.style.display = 'none';
        const opts = $e('.themes-options');
        if (opts) opts.style.display = 'block';
      }
    }




    function checkDarkMode() {

      if(settings.themes) {

        if (isDarkModeActive === 'dark' && !isThemeCustom) {
          // Apply theme
          $e('.themes-options').style.display = "block";
          themeNormal.style.display = "none";
          themeCustomOptions.style.display = "none";

          if(settings.theme === '0') {
            addDynamicCss(`
              .botones_div {
               background-color: transparent;
               border: none;
               color: #ccc !important;
               user-select: none;
             }
               `);
            return;
          }

            $sp('--yt-spec-base-background', selectedTheme.gradient);
            $sp('--yt-spec-text-primary', selectedTheme.textColor);
            $sp('--yt-spec-text-secondary', selectedTheme.textColor);
            $sp('--yt-spec-menu-background', selectedTheme.gradient);
            // Same pipeline as custom iconsColorPicker — one color for all YT + toolbar icons
            const iconColor = selectedTheme.colorIcons || selectedTheme.textLogo || '#ffffff';
            const logoColor = selectedTheme.textLogo || iconColor;
            $sp('--yt-spec-icon-inactive', iconColor);
            $sp('--yt-spec-brand-icon-inactive', iconColor);
            $sp('--yt-spec-brand-icon-active', selectedTheme.gradient);
            $sp('--yt-spec-static-brand-red', selectedTheme.gradient); // line current time
            $sp('--yt-spec-raised-background', selectedTheme.raised);
            $sp('--yt-spec-static-brand-red', selectedTheme.CurrentProgressVideo);
            $sp('--yt-spec-static-brand-white', selectedTheme.textColor);
            $sp('--ytd-searchbox-background', selectedTheme.gradient);
            $sp('--ytd-searchbox-text-color', selectedTheme.textColor);
            $sp('--ytcp-text-primary', selectedTheme.textColor);
            addDynamicCss(`
              .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox {
              background:  ${selectedTheme.gradient} !important;
              }
            #background.ytd-masthead { background: ${selectedTheme.gradient}  !important; }
            .ytp-swatch-background-color {
            background: ${
              selectedTheme.gradient
            } !important;
          }
          #shorts-container, #page-manager.ytd-app {
            background: ${selectedTheme.gradient.replace(/(#[0-9a-fA-F]{6})/g, `$1${36}`)};
          }
            ytd-engagement-panel-title-header-renderer[shorts-panel] #header.ytd-engagement-panel-title-header-renderer {
            background: ${selectedTheme.gradient}  !important;}
            .buttons-tranlate {
            background: ${selectedTheme.btnTranslate} !important;
            }
            .badge-shape-wiz--thumbnail-default {
            color: ${selectedTheme.videoDuration} !important;
            background: ${selectedTheme.gradient} !important;
            }

          /* === iconsColorPicker-equivalent rules (preset colorIcons) === */
          .ytp-menuitem .ytp-menuitem-icon svg path {
            fill: ${iconColor} !important;
          }
          a svg > path,
          .ytp-button svg path {
            fill: ${iconColor} !important;
          }
          svg.path {
            fill: ${iconColor} !important;
          }
          svg {
            color: ${iconColor} !important;
          }
          .ytp-volume-slider-handle:before,
          .ytp-volume-slider-handle,
          .ytp-tooltip.ytp-preview:not(.ytp-text-detail) {
            background-color: ${iconColor} !important;
          }
          .ytp-autonav-toggle-button[aria-checked=true] {
            background-color: ${iconColor} !important;
          }
          .tp-yt-iron-icon {
            fill: ${iconColor} !important;
          }
          .botones_div {
            background-color: transparent !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            color: ${iconColor} !important;
            user-select: none;
          }
          /* Color via currentColor only — do not force stroke on all paths
             (Tabler has a full-box path with stroke="none"; forcing stroke draws a square) */
          .botones_div svg,
          .containerButtons .botones_div svg {
            color: ${iconColor} !important;
            fill: none !important;
          }
          .yt-spec-icon-shape {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: ${iconColor} !important;
          }
          .ytp-time-current, .ytp-time-separator, .ytp-time-duration {
            color: ${iconColor} !important;
          }
          #logo-icon,
          ytd-logo #logo-icon,
          #logo #logo-icon,
          ytd-masthead ytd-logo #logo-icon {
            color: ${logoColor} !important;
          }
          #buttons.ytd-masthead yt-icon,
          #buttons.ytd-masthead .yt-spec-icon-shape,
          #buttons.ytd-masthead .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text,
          .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text {
            color: ${iconColor} !important;
          }
          .ytd-topbar-menu-button-renderer #button.ytd-topbar-menu-button-renderer {
            color: ${iconColor} !important;
          }
          .yt-spec-icon-badge-shape--style-overlay .yt-spec-icon-badge-shape__icon {
            color: ${iconColor} !important;
          }
          ytd-masthead #guide-button yt-icon,
          ytd-masthead #guide-button .yt-spec-icon-shape,
          ytd-masthead #start yt-icon,
          ytd-masthead #end yt-icon,
          ytd-masthead ytd-button-renderer yt-icon,
          ytd-masthead ytd-notification-topbar-button-renderer yt-icon {
            color: ${iconColor} !important;
          }
          .ytp-svg-fill {
            fill: ${iconColor} !important;
          }
          #ytp-id-30,#ytp-id-17,#ytp-id-19,#ytp-id-20 {
            fill: ${iconColor} !important;
          }

            `);
        } else if(isDarkModeActive === 'dark' && isThemeCustom) {
          $sp('--yt-spec-base-background', settings.bgColorPicker);
          $sp('--yt-spec-text-primary', settings.primaryColorPicker);
          $sp('--yt-spec-text-secondary', settings.secondaryColorPicker);
          $sp('--yt-spec-menu-background', settings.menuColorPicker);
          $sp('--yt-spec-icon-inactive', settings.iconsColorPicker);
          $sp('--yt-spec-brand-icon-inactive', settings.primaryColorPicker);
          $sp('--yt-spec-brand-icon-active', settings.primaryColorPicker);
          $sp('--yt-spec-raised-background', settings.headerColorPicker);
          $sp('--yt-spec-static-brand-red', settings.lineColorPicker);
          $sp('--yt-spec-static-brand-white', settings.timeColorPicker);
          $sp('--ytd-searchbox-background', settings.primaryColorPicker);
          $sp('--ytd-searchbox-text-color', settings.secondaryColorPicker);
          $sp('--ytcp-text-primary', settings.primaryColorPicker);
          addDynamicCss(`
            .html5-video-player {
                color: ${settings.primaryColorPicker} !important;
              }
                .ytProgressBarLineProgressBarPlayed {
                background: linear-gradient(to right, ${settings.progressbarColorPicker} 80%, ${settings.progressbarColorPicker} 100%);

                }
              .ytp-menuitem .ytp-menuitem-icon svg path{
                fill: ${settings.iconsColorPicker} !important;
                }
                .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {
                  background: linear-gradient(to right, ${settings.lineColorPicker} 80%, ${settings.lineColorPicker} 100%) !important;
                }
                .yt-badge-shape--thumbnail-default {
                  color: ${settings.timeColorPicker} !important;
                }
                a svg > path, .ytp-button svg path  {
                  fill: ${settings.iconsColorPicker} !important;
              }
                svg.path{ 
                 fill: ${settings.iconsColorPicker} !important;
                }

              svg {
                color: ${settings.iconsColorPicker} !important;
                } 
              .ytp-volume-slider-handle:before, .ytp-volume-slider-handle, .ytp-tooltip.ytp-preview:not(.ytp-text-detail) {
                background-color: ${settings.iconsColorPicker} !important;
              }
                .ytp-autonav-toggle-button[aria-checked=true] {
                  background-color: ${settings.iconsColorPicker} !important;
                }
                  .tp-yt-iron-icon {
                   fill: ${settings.iconsColorPicker} !important;
                  }

             .botones_div {
            background-color: transparent;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            color: ${settings.iconsColorPicker} !important;
            user-select: none;
          }
          .botones_div svg,
          .containerButtons .botones_div svg {
            color: ${settings.iconsColorPicker} !important;
            fill: none !important;
          }
              #container.ytd-searchbox {
              color: red !important;
              }
            .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox {
            background:  ${settings.primaryColorPicker} !important;
            }
            .yt-spec-icon-shape {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              color: ${settings.iconsColorPicker} !important;
          }
            .ytp-time-current, .ytp-time-separator, .ytp-time-duration {
              color: ${settings.iconsColorPicker} !important;
            }
            #background.ytd-masthead { background: ${settings.headerColorPicker}  !important; }
            .ytp-swatch-background-color {
            background: ${
              settings.progressbarColorPicker
            } !important;
          }
        #shorts-container, #page-manager.ytd-app {
            background: ${settings.bgColorPicker}36;
            }
            ytd-engagement-panel-title-header-renderer[shorts-panel] #header.ytd-engagement-panel-title-header-renderer {
            background: ${settings.bgColorPicker}  !important;}

            .badge-shape-wiz--thumbnail-default {
            color: ${settings.timeColorPicker} !important;
             background: ${settings.secondaryColor} !important;
            }
             #logo-icon,
             ytd-logo #logo-icon,
             #logo #logo-icon,
             ytd-masthead ytd-logo yt-icon {
             color: unset !important;
             fill: unset !important;
          }
          #buttons.ytd-masthead yt-icon,
          #buttons.ytd-masthead .yt-spec-icon-shape,
          #buttons.ytd-masthead .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text,
          .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text {
            color:  ${settings.iconsColorPicker} !important;
          }
          .ytd-topbar-menu-button-renderer #button.ytd-topbar-menu-button-renderer {
            color:  ${settings.iconsColorPicker} !important;
          }
          .yt-spec-icon-badge-shape--style-overlay .yt-spec-icon-badge-shape__icon {
            color:  ${settings.iconsColorPicker} !important;
          }
          .ytp-svg-fill {
            fill:  ${settings.iconsColorPicker} !important;
          }
          #ytp-id-30,#ytp-id-17,#ytp-id-19,#ytp-id-20{
            fill:  ${settings.iconsColorPicker} !important;
          }
            `);
        } else {
          addDynamicCss(`
            .botones_div {
             background-color: transparent;
             border: none;
             color: #000 !important;
             user-select: none;
           }
             `);
        }

      } else {
        addDynamicCss(`
          .botones_div {
           background-color: transparent;
           border: none;
           color: #ccc !important;
           user-select: none;
         }
           `);
      }

    }


    addDynamicCss(`
      #columns.style-scope.ytd-watch-flexy {
        flex-direction: ${settings.reverseMode ? 'row-reverse' : 'row'} !important;
        padding-left: ${settings.reverseMode ? '20px' : '0'} !important;
        }
        #secondary.style-scope.ytd-watch-flexy {display: ${settings.hideSidebar ? 'none' : 'block'} !important;}


        #icon-menu-settings {
         color: ${settings.iconsColorPicker} !important;
        }


      `);

    checkDarkMode();
    // Apply dynamic CSS once per settings update
    setDynamicCss(dynamicCss);

    // Apply new features (safe, no heavy loops)
    applyBookmarksIfEnabled(settings);
    setupContinueWatchingFeature(settings.continueWatching);
    // After feature setup so bookmark / continue-watching buttons respect both feature + btn toggles
    syncPlayerButtonsVisibility(settings);
    scheduleLikeBarUpdate(settings, 5);
    setupShortsChannelNameFeature(settings.shortsChannelName);
    setupLockupCachedStats();
   function checkForVideo() {
    // Keep wave style in sync with popup/storage (even if analyzer already running)
    waveStyle = settings.waveVisualizerSelected || waveStyle || 'dinamica';

    if (!settings.waveVisualizer) {
      cleanup(true); // Limpieza completa
      return;
    }
    const video = $e('video');
    const miniPlayer = $e('.ytp-miniplayer-ui');
    if ((video && document.location.href.includes('watch')) || miniPlayer) {

      // Solo si el video cambió o no está configurado
      if (video !== currentVideo || !isSetup) {
        cleanup(true); // Limpieza completa antes de crear uno nuevo
        setupAudioAnalyzer(video);
      } else if (controlPanel && video.paused === false) {
        showCanvas();
      }
    }
  }


  checkForVideo();

    function downloadDescriptionVideo() {
      if (!window.location.href.includes('youtube.com/watch')) return;
      if ($e('#button_copy_description')) return;

      const containerDescription = $e('#bottom-row.style-scope.ytd-watch-metadata');
      if (!containerDescription) return;

      const buttomHTML = `
        <div id="button_copy_description" style="display: flex; justify-content: end; align-items: center;margin-top: 10px;" >
          <button id="copy-description" title="Copy description" class="botones_div" type="button" style="cursor: pointer;">
            <i style="font-size: 20px;" class="fa-solid fa-copy"></i>
          </button>
        </div>
      `;

      containerDescription.insertAdjacentHTML('beforebegin', buttomHTML);

      $id('copy-description').addEventListener('click', () => {
        const ldJson = [...$m('script[type="application/ld+json"]')];
        for (let script of ldJson) {
          try {
            const data = JSON.parse(script.innerText);
            if (data['@type'] === 'VideoObject') {
              const description =
                `📅 Date published: ${data.uploadDate || 'No disponible'}\n` +
                `Author: ${data.author || 'No disponible'}\n` +
                `🎬 Name video: ${data.name || 'No disponible'}\n` +
                `🖼️ Thumbnail: ${Array.isArray(data.thumbnailUrl) ? data.thumbnailUrl.join(', ') : data.thumbnailUrl || 'No disponible'}\n` +
                `📝 Description: ${data.description || 'No disponible'}\n\n\n` +
                `🎭 Category: ${data.genre || 'No disponible'}\n`;

              navigator.clipboard.writeText(description);
            }
          } catch (e) {
            Notify('error', 'Error parsing JSON-LD');
          } finally {
            Notify('success', 'Description copied');
          }
        }
      });
    }

    downloadDescriptionVideo();


    async function traductor() {
      const texto = $m('#content-text');
      if ($e('.buttons-tranlate')) return;

      const languages = languagesTranslate;
      const idiomaDestino = $id('select-languages-comments-select').value;

      for (let i = 0; i < texto.length; i++) {

        const optionsHTML = Object.entries(languages)
          .map(([code, name]) => {
            const selected = code === idiomaDestino ? 'selected' : '';
            return `<option value="${code}" ${selected}>${name}</option>`;
          })
          .join('');

        const controlsHTML = `
          <div class="traductor-container" data-index="${i}">
          <button class="buttons-tranlate" id="btn${i}"> Translate <i class="fa-solid fa-language"></i></button>
          <select class="select-traductor" id="select${i}">
           ${optionsHTML}
          </select>
          </div>
        `;

        texto[i].insertAdjacentHTML('afterend', controlsHTML);
      }

      const botones = $m('.buttons-tranlate');
      const selects = $m('.select-traductor');

      botones.forEach((boton, i) => {
        boton.addEventListener('click', () => {
          const selectedLang = selects[i].value;
          const urlLista = `?client=dict-chrome-ex&sl=auto&tl=${selectedLang}&q=` + texto[i].textContent;

          fetch(apiGoogleTranslate + urlLista)
            .then((response) => response.json())
            .then((datos) => {
              texto[i].textContent = datos[0][0];
              botones[i].textContent = 'Translated';
            })
            .catch((err) => {
              console.error('Error en la traducción:', err);
            });
        });
      });
    }



    function limpiarHTML(selector) {
      $m(selector).forEach((button) => button.remove());
    }

    function checkScroll () {
      const avatars = $m('#author-thumbnail-button #img.style-scope.yt-img-shadow');

      if (avatars.length > 0 && settings.avatars) {
        limpiarHTML('.yt-image-avatar-download');
        agregarBotonesDescarga();
      }

      const divEl = $e('#content-text');
      const divEl2 = $e('ytd-item-section-renderer[static-comments-header] #contents');

      if (settings.translation) {
        if (divEl !== undefined || divEl2 !== undefined) {
          limpiarHTML('.buttons-tranlate');
          limpiarHTML('.select-traductor');
          traductor();
        }
      }

    }

    window.onscroll = () => {
      checkScroll();
    }


  const contentScrollable = $e('.anchored-panel.style-scope.ytd-shorts #contents.style-scope.ytd-item-section-renderer.style-scope.ytd-item-section-renderer');
  if (contentScrollable) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          contentScrollable.addEventListener('scroll', () => {
            checkScroll();
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(contentScrollable);
  }

    function agregarBotonesDescarga() {
      const avatars = $m('#author-thumbnail-button #img.style-scope.yt-img-shadow');


      avatars.forEach((img) => {

        if (img.parentElement.querySelector('.yt-image-avatar-download')) return;

        const button = $cl('button');
        button.innerHTML = '<i class="fa fa-download"></i>';
        button.classList.add('yt-image-avatar-download');

        button.onclick = async function () {
          try {
            const imageUrl = img.src.split('=')[0];
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const parentComment = img.closest('ytd-comment-thread-renderer, ytd-comment-renderer');
            const nameElement = parentComment?.querySelector('#author-text');
            let authorName = nameElement ? nameElement.textContent.trim() : 'avatar';
            authorName = authorName.replace(/[\/\\:*?"<>|]/g, '');

            const link = $cl('a');
            link.href = blobUrl;
            link.download = `${authorName}_avatar.jpg` || 'avatar.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } catch (error) {
            console.error('Error al descargar la imagen:', error);
          }
        };

        img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(button);
      });
    }

    const redirectToClassic = () => {
      const videoId = window.location.pathname.split('/').pop();
      const classicUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(classicUrl, '_blank');
      $e('video.video-stream.html5-main-video').pause();
    };

    // Update the Shorts "views" button label (same bar as Classic). Call with viewCount from API/cache.
    function updateShortsViewsButton(videoId, viewCount) {
      const bar = $e('reel-action-bar-view-model');
      if (!bar) return;
      const viewsWrap = bar.querySelector('[data-yt-tools-shorts-views]');
      if (!viewsWrap) return;
      const labelSpan = viewsWrap.querySelector('.yt-spec-button-shape-with-label__label span, [role="text"]');
      if (!labelSpan) return;
      labelSpan.textContent = Number.isFinite(viewCount) && viewCount >= 0 ? FormatterNumber(viewCount, 0) : '—';
    }

    // Update the Shorts "rating" button label (rating 0–5 from API/cache, shown as e.g. "4.9").
    function updateShortsRatingButton(videoId, rating) {
      const bar = $e('reel-action-bar-view-model');
      if (!bar) return;
      const ratingWrap = bar.querySelector('[data-yt-tools-shorts-rating]');
      if (!ratingWrap) return;
      const labelSpan = ratingWrap.querySelector('.yt-spec-button-shape-with-label__label span, [role="text"]');
      if (!labelSpan) return;
      labelSpan.textContent = (Number.isFinite(rating) && rating >= 0 && rating <= 5) ? rating.toFixed(1) : '—';
    }

    // Build one YT-style button for the reel action bar (same structure as like/dislike/comments).
    function createReelBarButton(opts) {
      const wrap = document.createElement('div');
      wrap.className = 'button-view-model ytSpecButtonViewModelHost';
      if (opts.dataAttr) wrap.setAttribute(opts.dataAttr, '1');
      wrap.innerHTML = `
        <label class="yt-spec-button-shape-with-label">
          <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment" title="${opts.title || ''}" aria-label="${opts.ariaLabel || ''}">
            <div class="yt-spec-button-shape-next__icon" aria-hidden="true">
              <span class="yt-icon-shape ytSpecIconShapeHost">${opts.iconSvg || ''}</span>
            </div>
          </button>
          <div class="yt-spec-button-shape-with-label__label" aria-hidden="false">
            <span class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping" role="text">${opts.labelText || ''}</span>
          </div>
        </label>
      `;
      const btn = wrap.querySelector('button');
      if (opts.onclick) btn.addEventListener('click', opts.onclick);
      return wrap;
    }

    const eyeIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>';
    const classicIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" /><path d="M16 3l-4 4l-4 -4" /></svg>';
    const starIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    function insertReelBarButtons() {
      const isShortsPage = document.location.pathname.startsWith('/shorts');
      const bar = $e('reel-action-bar-view-model');
      if (!isShortsPage || !bar) {
        document.querySelectorAll('[data-yt-tools-shorts-classic], [data-yt-tools-shorts-views], [data-yt-tools-shorts-rating]').forEach(el => el.remove());
        return;
      }
      if (bar.querySelector('[data-yt-tools-shorts-classic]')) return;

      const classicBtn = createReelBarButton({
        dataAttr: 'data-yt-tools-shorts-classic',
        title: 'Classic mode',
        ariaLabel: 'Classic mode',
        iconSvg: classicIconSvg,
        labelText: 'Clásico',
        onclick: redirectToClassic,
      });
      const viewsBtn = createReelBarButton({
        dataAttr: 'data-yt-tools-shorts-views',
        title: 'Vistas',
        ariaLabel: 'Vistas',
        iconSvg: eyeIconSvg,
        labelText: '—',
        onclick: function () {},
      });
      const ratingBtn = createReelBarButton({
        dataAttr: 'data-yt-tools-shorts-rating',
        title: 'Rating (likes/dislikes)',
        ariaLabel: 'Rating',
        iconSvg: starIconSvg,
        labelText: '—',
        onclick: function () {},
      });

      bar.insertBefore(ratingBtn, bar.firstChild);
      bar.insertBefore(viewsBtn, bar.firstChild);
      bar.insertBefore(classicBtn, bar.firstChild);

      const videoId = (document.location.pathname.split('/').filter(Boolean))[1];
      if (videoId) {
        const persisted = getLikesDislikesFromPersistedCache(videoId);
        if (persisted && persisted.viewCount != null) updateShortsViewsButton(videoId, persisted.viewCount);
        if (persisted && persisted.rating != null) updateShortsRatingButton(videoId, persisted.rating);
      }
      __ytToolsRuntime.updateShortsViewsButton = updateShortsViewsButton;
      __ytToolsRuntime.updateShortsRatingButton = updateShortsRatingButton;
    }

    const insertButtons = () => {
      insertReelBarButtons();
    };

  const observeDOM = () => {
      if (__ytToolsRuntime.shortsObserver) return;
      const observer = new MutationObserver(() => {
          insertButtons();
          addIcon();
          // obs.disconnect();
      });
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
      __ytToolsRuntime.shortsObserver = observer;
  };

    if (!__ytToolsRuntime.shortsObserver) {
      insertButtons();
      observeDOM();
    }


    const targetNode = $e('body');

    if (targetNode != undefined) {
      const element = $e('ytd-item-section-renderer[static-comments-header] #contents');
      if(element != undefined && settings.theme !== 'custom') {
        const observerElementDom = (elem) => {
          const observer = new IntersectionObserver(entries => {

              if(entries[0].isIntersecting) {

                element.style.background = `${selectedTheme.gradient ?? ''}`;
              } else {return}
          })

          return observer.observe($e(`${elem}`))

        }
        observerElementDom('ytd-item-section-renderer[static-comments-header] #contents')
      }
    }

    // Stats

    function formatTime(seconds) {
      if (isNaN(seconds)) return '0h 0m 0s';
      seconds = Math.floor(seconds);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}h ${m}m ${s}s`;
    }

  function updateUI() {
      $id('total-time').textContent = formatTime(usageTime);
      $id('video-time').textContent = formatTime(videoTime);
      $id('shorts-time').textContent = formatTime(shortsTime);

      const maxTime = 86400; // 24 hours
      $id('usage-bar').style.width =
          `${(usageTime / maxTime) * 100}%`;
      $id('video-bar').style.width =
          `${(videoTime / maxTime) * 100}%`;
      $id('shorts-bar').style.width =
          `${(shortsTime / maxTime) * 100}%`;
  }

  function detectContentType(videoElement) {
      if (/\/shorts\//.test(window.location.pathname)) return 'shorts';

      let parent = videoElement;
      while ((parent = parent.parentElement) !== null) {
          if (parent.classList.contains('shorts-container') ||
              parent.classList.contains('reel-video') ||
              parent.tagName === 'YTD-REEL-VIDEO-RENDERER') {
              return 'shorts';
          }
      }


      if (videoElement.closest('ytd-watch-flexy') ||
          videoElement.closest('#primary-inner')) {
          return 'video';
      }
      if (videoElement.closest('ytd-thumbnail') ||
          videoElement.closest('ytd-rich-item-renderer')) {
          return 'video';
      }

      return null;
    }

    function findActiveVideo() {
        const videos = $m('video');
        for (const video of videos) {
            if (!video.paused && !video.ended && video.readyState > 2) {
                return video;
            }
        }
        return null;
    }


   function cleanup(fullCleanup = false) {
      if (fullCleanup && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      if (currentVideo) {
        currentVideo.removeEventListener('play', showCanvas);
        currentVideo.removeEventListener('pause', hideCanvas);
        currentVideo.removeEventListener('ended', hideCanvas);
      }
      if (fullCleanup) {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
          canvas = null;
          ctx = null;
        }
        if (controlPanel && controlPanel.parentNode) {
          controlPanel.parentNode.removeChild(controlPanel);
          controlPanel = null;
        }
        if (source) {
          try { source.disconnect(); } catch (err) {}
          source = null;
        }
        if (audioCtx) {
          try { audioCtx.close(); } catch (err) {}
          audioCtx = null;
        }
        if (currentVideo && currentVideo[PROCESSED_FLAG]) {
          delete currentVideo[PROCESSED_FLAG];
        }
        currentVideo = null;
        isSetup = false;
      } else {
        if (canvas) canvas.style.opacity = '0';
        if (controlPanel) controlPanel.style.opacity = '0';
      }
  }



    function createCanvasOverlay() {
        if (canvas) return;
        const parent = document.body;
        canvas = document.createElement('canvas');
        canvas.id = 'wave-visualizer-canvas';
        canvas.width = window.innerWidth;
        canvas.height = canvasHeight;
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.backgroundColor = 'transparent';
        canvas.style.zIndex = '10000';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.3s';

        parent.appendChild(canvas);
        ctx = canvas.getContext('2d');
    }


    function createControlPanelWave() {
      // Always refresh style from current settings (popup may change it live)
      waveStyle = settings.waveVisualizerSelected || waveStyle || 'dinamica';
      if (controlPanel) return;

      controlPanel = $cl('div');
      controlPanel.id = 'wave-visualizer-control';
      const selectAppend = $id('select-wave-visualizer-select');

      if (selectAppend && selectAppend.dataset.ytWaveBound !== '1') {
        selectAppend.dataset.ytWaveBound = '1';
        selectAppend.addEventListener('change', (e) => {
          waveStyle = e.target.value;
          selectAppend.value = e.target.value;
          saveSettings();
        });
      }
  }




    // setting Audio y Analyser
    function setupAudioAnalyzer(video) {
      if (!video || video[PROCESSED_FLAG]) return;
      video[PROCESSED_FLAG] = true;
      cleanup(false);
      currentVideo = video;
      createCanvasOverlay();
      createControlPanelWave();

      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
        audioCtx = null;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;
      bufferLength = analyser.fftSize;
      dataArray = new Uint8Array(bufferLength);
      smoothedData = new Array(bufferLength).fill(128);

      try {
        source = audioCtx.createMediaElementSource(video);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
      } catch (e) {
        Notify('error', "MediaElementSource or error:", e);
        cleanup(true);
        return;
      }

      video.removeEventListener('play', showCanvas);
      video.removeEventListener('pause', hideCanvas);
      video.removeEventListener('ended', hideCanvas);

      video.addEventListener('play', showCanvas);
      video.addEventListener('pause', hideCanvas);
      video.addEventListener('ended', hideCanvas);

      const updateCanvasSize = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = canvasHeight;
        }
      };

      window.removeEventListener('resize', updateCanvasSize);
      window.addEventListener('resize', updateCanvasSize);

      draw();
      isSetup = true;
    }
      function draw() {
          animationId = requestAnimationFrame(draw);

          if (parseFloat(canvas.style.opacity) <= 0) return;

          analyser.getByteTimeDomainData(dataArray);
          for (let i = 0; i < bufferLength; i++) {
              smoothedData[i] += smoothingFactor * (dataArray[i] - smoothedData[i]);
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let sliceWidth = canvas.width / bufferLength;

          switch(waveStyle) {

          case 'linea': {
              ctx.lineWidth = 2;
              ctx.strokeStyle = 'lime';
              ctx.beginPath();
              let x = 0;
              for (let i = 0; i < bufferLength; i++) {
                  let amplitude = Math.max(0, smoothedData[i] - 128) * scale;
                  if (i === 0) ctx.moveTo(x, amplitude);
                  else ctx.lineTo(x, amplitude);
                  x += sliceWidth;
              }
              ctx.stroke();
              break;
          }
          case 'barras': {
              let x = 0;
              for (let i = 0; i < bufferLength; i += 5) {
                  let amplitude = Math.max(0, smoothedData[i] - 128) * scale;
                  ctx.fillStyle = 'cyan';
                  ctx.fillRect(x, 0, sliceWidth * 4, amplitude);
                  x += sliceWidth * 5;
              }
              break;
          }
          case 'curva': {
              ctx.lineWidth = 2;
              ctx.strokeStyle = 'yellow';
              ctx.beginPath();
              ctx.moveTo(0, Math.max(0, smoothedData[0] - 128) * scale);
              for (let i = 0; i < bufferLength - 1; i++) {
                  let x0 = i * sliceWidth;
                  let x1 = (i + 1) * sliceWidth;
                  let y0 = Math.max(0, smoothedData[i] - 128) * scale;
                  let y1 = Math.max(0, smoothedData[i + 1] - 128) * scale;
                  let cp1x = x0 + sliceWidth / 3;
                  let cp1y = y0;
                  let cp2x = x1 - sliceWidth / 3;
                  let cp2y = y1;
                  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);
              }
              ctx.stroke();
              break;
          }
          case 'picos': {
              ctx.fillStyle = 'magenta';
              let x = 0;
              for (let i = 0; i < bufferLength; i += 5) {
                  let amplitude = Math.max(0, smoothedData[i] - 128) * scale;
                  ctx.beginPath();
                  ctx.arc(x, amplitude, 2, 0, Math.PI * 2);
                  ctx.fill();
                  x += sliceWidth * 5;
              }
              break;
          }
          case 'solida': {
              ctx.beginPath();
              let x = 0;
              ctx.moveTo(0, 0);
              for (let i = 0; i < bufferLength; i++) {
                  let amplitude = Math.max(0, smoothedData[i] - 128) * scale;
                  ctx.lineTo(x, amplitude);
                  x += sliceWidth;
              }
              ctx.lineTo(canvas.width, 0);
              ctx.closePath();
              ctx.fillStyle = 'rgba(0,255,0,0.3)';
              ctx.fill();
              break;
          }
          case 'dinamica': {
              let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
              gradient.addColorStop(0, 'red');
              gradient.addColorStop(0.5, 'purple');
              gradient.addColorStop(1, 'blue');
              ctx.lineWidth = 3;
              ctx.strokeStyle = gradient;
              ctx.beginPath();
              let x = 0;
              for (let i = 0; i < bufferLength; i++) {
                  let amplitude = Math.max(0, smoothedData[i] - 128) * scale;
                  if (i === 0) ctx.moveTo(x, amplitude);
                  else ctx.lineTo(x, amplitude);
                  x += sliceWidth;
              }
              ctx.stroke();
              break;
          }
          case 'montana': {
              ctx.beginPath();
              let x = 0;
              ctx.moveTo(0, 0);
              for (let i = 0; i < bufferLength; i++) {
                  let amp = (smoothedData[i] - 128) * scale * 0.8;
                  ctx.lineTo(x, amp);
                  x += sliceWidth;
              }
              ctx.lineTo(canvas.width, 0);
              ctx.closePath();
              ctx.fillStyle = 'rgba(128,128,255,0.4)';
              ctx.fill();
              break;
          }

          default:
              break;
          }
      }



  if (!__ytToolsRuntime.statsObserver) {
    const observer = new MutationObserver(() => {
        const newVideo = findActiveVideo();
        if (newVideo !== activeVideo) {
            activeVideo = newVideo;
            if (activeVideo) {
                activeType = detectContentType(activeVideo);
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
    __ytToolsRuntime.statsObserver = observer;
  }

        checkForVideo();

  if (!__ytToolsRuntime.statsIntervalId) {
    __ytToolsRuntime.statsIntervalId = setInterval(() => {

        const now = Date.now();
        // checkForVideo();
        const delta = (now - lastUpdate) / 1000;
        if (document.visibilityState === 'visible') {
            usageTime += delta;
        }

        if (activeVideo && !activeVideo.paused) {
            if (activeType === 'video') {
                videoTime += delta;
            } else if (activeType === 'shorts') {
                shortsTime += delta;
            }
        }
        lastUpdate = now;
        // save stats
        GM_setValue(STORAGE.USAGE, usageTime);
        GM_setValue(STORAGE.VIDEO, videoTime);
        GM_setValue(STORAGE.SHORTS, shortsTime);
        updateUI();
    }, UPDATE_INTERVAL);
  }






  updateUI();

  // end stats — only persist from DOM in Tampermonkey (never in extension popup mode)
  if (__ytToolsRuntime.settingsLoaded && !IS_EXTENSION) {
    saveSettings();
  }

  }

  let validoBotones = true;
  function renderizarButtons() {
    const addButton = $e('.style-scope .ytd-watch-metadata');
    const addButton2 = $e('#contents');

    if (addButton != undefined && validoBotones) {
        validoBotones = false;
        const isVisible = !!(
          addButton.offsetWidth ||
          addButton.offsetHeight ||
          addButton.getClientRects().length
        );
        if (isVisible) {
          addButton.insertAdjacentHTML("beforebegin", menuBotones);
        } else if (addButton2 != undefined) {
          addButton.insertAdjacentHTML("beforebegin", menuBotones);
        }
    }

    const formulariodescarga      = $e('.formulariodescarga');
    const formulariodescargaaudio = $e('.formulariodescargaaudio');
    const btn1mp4               = $e('.btn1');
    const btn2mp3               = $e('.btn2');
    const btn3cancel            = $e('.btn3');
    const selectcalidades       = $e('.selectcalidades');
    const selectcalidadesaudio  = $e('.selectcalidadesaudio');

    [formulariodescarga, formulariodescargaaudio].forEach(form => {
      if (!form) return;
      if (form.dataset.ytToolsPreventDefault === '1') return;
      form.addEventListener('click', e => e.preventDefault());
      form.dataset.ytToolsPreventDefault = '1';
    });

    if (selectcalidades && selectcalidades.dataset.ytToolsBound !== '1') {
      selectcalidades.dataset.ytToolsBound = '1';
      selectcalidades.addEventListener('change', e => {
      const quality = e.target.value;
      if (!quality) return; // Don't proceed if no quality selected

      const downloadContainer = $id('descargando');
      const downloadText = downloadContainer.querySelector('.download-text');
      const downloadQuality = downloadContainer.querySelector('.download-quality');
      const downloadBtn = downloadContainer.querySelector('.download-btn');
      const retryBtn = downloadContainer.querySelector('.retry-btn');
      const progressContainer = downloadContainer.querySelector('.progress-container');

      // Update UI
      downloadContainer.classList.add('video');
      downloadContainer.classList.remove('ocultarframe');
      downloadText.textContent = `Download ${quality.toUpperCase()} And Please Wait...`;
      downloadQuality.textContent = `${quality}p`;

      // Show download button, hide progress
      downloadBtn.style.display = 'block';
      retryBtn.style.display = 'none';
      progressContainer.style.display = 'none';

      // Store quality for later use
      downloadContainer.dataset.quality = quality;
      downloadContainer.dataset.type = 'video';
      });
    }

    if (selectcalidadesaudio && selectcalidadesaudio.dataset.ytToolsBound !== '1') {
      selectcalidadesaudio.dataset.ytToolsBound = '1';
      selectcalidadesaudio.addEventListener('change', e => {
      const format = e.target.value;
      if (!format) return; // Don't proceed if no format selected

      const downloadContainer = $id('descargandomp3');
      const downloadText = downloadContainer.querySelector('.download-text');
      const downloadQuality = downloadContainer.querySelector('.download-quality');
      const downloadBtn = downloadContainer.querySelector('.download-btn');
      const retryBtn = downloadContainer.querySelector('.retry-btn');
      const progressContainer = downloadContainer.querySelector('.progress-container');

      // Update UI
      downloadContainer.classList.add('audio');
      downloadContainer.classList.remove('ocultarframeaudio');
      downloadText.textContent = `Download ${format.toUpperCase()} And Please Wait...`;
      downloadQuality.textContent = format.toUpperCase();

      // Show download button, hide progress
      downloadBtn.style.display = 'block';
      retryBtn.style.display = 'none';
      progressContainer.style.display = 'none';

      // Store format for later use
      downloadContainer.dataset.quality = format;
      downloadContainer.dataset.type = 'audio';
      });
    }

    if (btn3cancel && btn3cancel.dataset.ytToolsBound !== '1') {
      btn3cancel.dataset.ytToolsBound = '1';
      btn3cancel.addEventListener('click', () => {
      // Hide all selects
      selectcalidades?.classList.add('ocultarframe');
      selectcalidadesaudio?.classList.add('ocultarframeaudio');

      // Hide all download containers
      const videoContainer = $id('descargando');
      const audioContainer = $id('descargandomp3');

      if (videoContainer) {
        videoContainer.classList.add('ocultarframe');
        videoContainer.classList.remove('video', 'audio', 'completed');
        videoContainer.removeAttribute('data-quality');
        videoContainer.removeAttribute('data-type');
        videoContainer.removeAttribute('data-downloading');
        videoContainer.removeAttribute('data-url-opened');
        videoContainer.removeAttribute('data-last-download-url');
        videoContainer.querySelector?.('.download-again-btn')?.style && (videoContainer.querySelector('.download-again-btn').style.display = 'none');
      }

      if (audioContainer) {
        audioContainer.classList.add('ocultarframeaudio');
        audioContainer.classList.remove('video', 'audio', 'completed');
        audioContainer.removeAttribute('data-quality');
        audioContainer.removeAttribute('data-type');
        audioContainer.removeAttribute('data-downloading');
        audioContainer.removeAttribute('data-url-opened');
        audioContainer.removeAttribute('data-last-download-url');
        audioContainer.querySelector?.('.download-again-btn')?.style && (audioContainer.querySelector('.download-again-btn').style.display = 'none');
      }

      // Hide all forms
      formulariodescarga?.classList.add('ocultarframe');
      formulariodescargaaudio?.classList.add('ocultarframe');

      // Reset forms
      formulariodescarga?.reset();
      formulariodescargaaudio?.reset();
      });
    }

      // Add event listeners for download buttons (only once)
  if (!__ytToolsRuntime.downloadClickHandlerInitialized) {
    __ytToolsRuntime.downloadClickHandlerInitialized = true;
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const clicked =
        target.closest('.download-btn') ||
        target.closest('.retry-btn') ||
        target.closest('.progress-retry-btn') ||
        target.closest('.download-again-btn');
      if (!clicked) return;

      const container = clicked.closest('.download-container');
      if (!container) return;

      const quality = container.dataset.quality;
      const type = container.dataset.type;
      // download-again just re-opens the last URL (no restart)
      if (clicked.classList.contains('download-again-btn')) {
        const url = container.dataset.lastDownloadUrl;
        if (url) window.open(url);
        return;
      }
      if (!quality || !type) return;

      if (clicked.classList.contains('progress-retry-btn')) {
        container.dataset.downloading = 'false';
        container.dataset.urlOpened = 'false';
        container.dataset.lastDownloadUrl = '';
        container.querySelector?.('.download-again-btn')?.style && (container.querySelector('.download-again-btn').style.display = 'none');
      }
      startDownloadVideoOrAudio(quality, container);
    });
  }



    if (btn1mp4 && btn1mp4.dataset.ytToolsBound !== '1') {
      btn1mp4.dataset.ytToolsBound = '1';
      btn1mp4.addEventListener('click', () => {
      // Show video select, hide audio select
      selectcalidades?.classList.remove('ocultarframe');
      selectcalidadesaudio?.classList.add('ocultarframeaudio');

      // Hide all download containers
      const videoContainer = $id('descargando');
      const audioContainer = $id('descargandomp3');

      if (videoContainer) {
        videoContainer.classList.add('ocultarframe');
        videoContainer.classList.remove('video', 'audio', 'completed');
        videoContainer.removeAttribute('data-quality');
        videoContainer.removeAttribute('data-type');
        videoContainer.removeAttribute('data-downloading');
        videoContainer.removeAttribute('data-url-opened');
      }

      if (audioContainer) {
        audioContainer.classList.add('ocultarframeaudio');
        audioContainer.classList.remove('video', 'audio', 'completed');
        audioContainer.removeAttribute('data-quality');
        audioContainer.removeAttribute('data-type');
        audioContainer.removeAttribute('data-downloading');
        audioContainer.removeAttribute('data-url-opened');
      }

      // Show video form
      formulariodescarga?.classList.remove('ocultarframe');
      formulariodescarga.style.display = '';
      formulariodescargaaudio?.classList.add('ocultarframe');

      // Reset forms
      formulariodescarga?.reset();
      formulariodescargaaudio?.reset();
      });
    }

    if (btn2mp3 && btn2mp3.dataset.ytToolsBound !== '1') {
      btn2mp3.dataset.ytToolsBound = '1';
      btn2mp3.addEventListener('click', () => {
      // Show audio select, hide video select
      selectcalidadesaudio?.classList.remove('ocultarframeaudio');
      selectcalidades?.classList.add('ocultarframe');

      // Hide all download containers
      const videoContainer = $id('descargando');
      const audioContainer = $id('descargandomp3');

      if (videoContainer) {
        videoContainer.classList.add('ocultarframe');
        videoContainer.classList.remove('video', 'audio', 'completed');
        videoContainer.removeAttribute('data-quality');
        videoContainer.removeAttribute('data-type');
        videoContainer.removeAttribute('data-downloading');
        videoContainer.removeAttribute('data-url-opened');
      }

      if (audioContainer) {
        audioContainer.classList.add('ocultarframeaudio');
        audioContainer.classList.remove('video', 'audio', 'completed');
        audioContainer.removeAttribute('data-quality');
        audioContainer.removeAttribute('data-type');
        audioContainer.removeAttribute('data-downloading');
        audioContainer.removeAttribute('data-url-opened');
      }

      // Show audio form
      formulariodescargaaudio?.classList.remove('ocultarframe');
      formulariodescargaaudio.style.display = '';
      formulariodescarga?.classList.add('ocultarframe');

      // Reset forms
      formulariodescargaaudio?.reset();
      formulariodescarga?.reset();
      });
    }
      // Invertir contenido




      const btnImagen = $e('#imagen');
      const formularioButtons = $e('#eyes');

      function initClickEvent() {
        const bufferVideo = $e('.buffer_video');

        if (!bufferVideo) {

          return;
        }

        // Evita duplicar el evento
        if (!bufferVideo.dataset.listenerAdded) {
          bufferVideo.addEventListener("click", () => {
            const video = $e("video.video-stream.html5-main-video");

            if (!video) {
              console.log("No se encontró el video en la página.");
              return;
            }

            const event = new MouseEvent("contextmenu", {
              bubbles: true,
              cancelable: true
            });

            video.dispatchEvent(event);

            setTimeout(() => {
              const option = $e("body > div.ytp-popup.ytp-contextmenu > div > div > div:nth-child(7)");
              if (option) {
                option.click();
              } else {
                console.log("Opción no encontrada, intenta aumentar el tiempo de espera.");
              }
            }, 1000);
          });

          bufferVideo.dataset.listenerAdded = "true";
        }
      }

      // Run once; renderizarButtons() may run multiple times and we guard with dataset.listenerAdded
      initClickEvent();



      // valido modo oscuro y venta de video
      // Repeat video button
      let countRepeat = 0; // count
      const repeat = $e('#repeatvideo'); // Repeat button
      const imarepeat = $e('.icon-tabler-repeat'); // img repeat
      const videoFull = $e(
        '#movie_player > div.html5-video-container > video'
      );
      if(repeat != undefined) {

        repeat.onclick = () => {
          if (
            $e('#cinematics > div') != undefined ||
            videoFull != undefined
          ) {
            countRepeat += 1;
            switch (countRepeat) {
              case 1:
                document
                  .querySelector('#movie_player > div.html5-video-container > video')
                  ?.setAttribute('loop', 'true');
                imarepeat.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 12v-3c0 -1.336 .873 -2.468 2.08 -2.856m3.92 -.144h10m-3 -3l3 3l-3 3"></path>
                    <path d="M20 12v3a3 3 0 0 1 -.133 .886m-1.99 1.984a3 3 0 0 1 -.877 .13h-13m3 3l-3 -3l3 -3"></path>
                    <path d="M3 3l18 18"></path>
                 </svg> `; // img repeat
                break;
              case 2:
                countRepeat = 0;
                document
                  .querySelector('#movie_player > div.html5-video-container > video')
                  ?.removeAttribute('loop');
                imarepeat.innerHTML = ` <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat" width="24"
                    height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
                    <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
                  </svg>`;
                break;
            }
          }
          }
      }

      // Background transparent

      const cinematica = $e('#cinematics > div');
      if (cinematica != undefined) {
        cinematica.style =
          'position: fixed; inset: 0px; pointer-events: none; transform: scale(1.5, 2)';
      }
      const btnReset = $e('#reset_button'); // Reset button
      if (btnReset != undefined) {
        btnReset.addEventListener('click', function () {
          if (localStorage.getItem('colores') != null) {
            localStorage.removeItem('colores');
            $e('#ojosprotect').style.backgroundColor =
              'transparent';
            setTimeout(() => {
              location.reload();
            }, 400);
          }
        });
      }

      if (btnImagen != undefined) {
        btnImagen.onclick = () => {
          if (
            $e('#cinematics > div') != undefined ||
            videoFull != undefined
          ) {
            const parametrosURL = new URLSearchParams(window.location.search);
            let enlace = parametrosURL.get('v');

            const imageUrl = `https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`;

            fetch(imageUrl)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
              })
              .then((blob) => {
                const imageSizeKB = blob.size / 1024;

                if (imageSizeKB >= 20) {
                  window.open(
                    `https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`,
                    'popUpWindow',
                    'height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
                  );
                  const imageUrlObject = URL.createObjectURL(blob);

                  const enlaceDescarga = $cl('a');
                  enlaceDescarga.href = imageUrlObject;
                  const titleVideo = $e(
                    'h1.style-scope.ytd-watch-metadata'
                  ).innerText;
                  enlaceDescarga.download = `${titleVideo}_maxresdefault.jpg`;
                  enlaceDescarga.click();

                  URL.revokeObjectURL(imageUrlObject);
                } else {
                  console.log(
                    'La imagen no excede los 20 KB. No se descargará.'
                  );
                }
              })
              .catch((error) => {
                alert('No found image');
                console.error('Error al obtener la imagen:', error);
              });
          }
        };
      }
      // for background image file photo higt quality
      // for background image file photo higt quality
      const fileInput = $id('background_image');
      const backgroundDiv = $e('ytd-app');
 
      const storedImage = localStorage.getItem('backgroundImage');
      if (storedImage) {
        backgroundDiv.style = `
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
 
        background-image: url(${storedImage}) !important`;
      }
 
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const imageUrl = e.target.result;
            localStorage.setItem('backgroundImage', imageUrl);
            backgroundDiv.style.backgroundImage = `url(${imageUrl})`;
          };
          reader.readAsDataURL(file);
        }
      });


      const externalLink = $e('.external_link');
      if (externalLink != undefined) {
        externalLink.onclick = () => {
          const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
          let enlace;
          enlace = parametrosURL.get('v');
          window.open(
            `https://ssyoutube.com/watch?v=${enlace}&t=2s`,
            'popUpWindow',
            'height=800,width=1000,left=50%,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=yes,location=no,directories=yes, status=no'
          );
        };
      }
      const viewExternalLink = $e('.view_external_link');
      if (viewExternalLink != undefined) {
        viewExternalLink.onclick = () => {
          $e('video').click();
          const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
          let enlace;
          enlace = parametrosURL.get('v');
          window.open(
            `https://www.youtube.com/embed/${enlace}?rel=0&controls=2&color=white&iv_load_policy=3&showinfo=0&modestbranding=1&autoplay=1`
          );
        };
      }
      const viewPictureToPicture = $e(
        '.video_picture_to_picture'
      );
      if (viewPictureToPicture != undefined) {
        viewPictureToPicture.onclick = () => {
          const video = $e('video');
          if ('pictureInPictureEnabled' in document) {
            if (!document.pictureInPictureElement) {

              video
                .requestPictureInPicture()
                .then(() => {
                })
                .catch((error) => {
                  console.error(
                    'Error al activar el modo Picture-in-Picture:',
                    error
                  );
                });
            } else {
              // video picture
            }
          } else {
            alert('Picture-in-Picture not supported');
          }
        };

        // Filtro de pantalla
        if (formularioButtons != undefined) {
          formularioButtons.addEventListener('input', function () {
            if (
              $e('#cinematics > div') != undefined ||
              videoFull != undefined
            ) {
              $e('#ojosprotect').style.backgroundColor =
                formularioButtons.value;
            }
          });
        }
        clearInterval(renderizarButtons);
      }

      const checked_updates = $e('.checked_updates');

      if (checked_updates != undefined) {
        checked_updates.onclick = () => {
          window.open(
            `https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.user.js`
          );
        };
      }

      const screenShotVideo = $e('.screenshot_video');
      if (screenShotVideo != undefined) {
        screenShotVideo.onclick = () => {
          const video = $e('video');
          const canvas = $cl('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imagenURL = canvas.toDataURL('image/png');
          const enlaceDescarga = $cl('a');
          enlaceDescarga.href = imagenURL;
          const titleVideo = $e(
            'h1.style-scope.ytd-watch-metadata'
          ).innerText;
          enlaceDescarga.download = `${video.currentTime.toFixed(
            0
          )}s_${titleVideo}.png`;
          enlaceDescarga.click();
        };
      } else {
        const containerButtons = $e('.containerButtons');

        if (containerButtons != undefined) {
          containerButtons.innerHTML = '';
        }
      }
      clearInterval(renderizarButtons);
    }




  console.log('Script en ejecución by: DeveloperMDCM');
  const HEADER_STYLE = 'color: #F00; font-size: 24px; font-family: sans-serif;';
  const MESSAGE_STYLE = 'color: #00aaff; font-size: 16px; font-family: sans-serif;';
  const CODE_STYLE = 'font-size: 14px; font-family: monospace;';

  console.log(
    '%cYoutube Tools Extension NEW UI\n' +
      '%cRun %c(v2.5.1)\n' +
      'By: DeveloperMDCM.',
    HEADER_STYLE,
    CODE_STYLE,
    MESSAGE_STYLE
  );

  if (!localStorage.getItem('notification-developerMDCM')) {
    Notify('info', 'Youtube Tools by: DeveloperMDCM :)');
    localStorage.setItem('notification-developerMDCM', true);
  }






  // Add event listeners to all inputs
  const inputs = $m('input');
  inputs.forEach((input) => {
    input.addEventListener('change', scheduleApplySettings);
    if (input.type === 'range') {
      input.addEventListener('change', () => {
        updateSliderValues();
        scheduleApplySettings();
      });
    }
  });

  // Some settings are controlled by <select> elements; ensure they persist and apply without duplicating listeners.
  function bindSelectOnce(id) {
    const el = $id(id);
    if (!el) return;
    if (el.dataset.ytToolsBound === '1') return;
    el.dataset.ytToolsBound = '1';
    el.addEventListener('change', () => {
      // Persist immediately
      try {
        saveSettings();
      } catch (e) {
        console.error('saveSettings error:', e);
      }
      // Apply with debounce
      scheduleApplySettings();
    });
  }

  bindSelectOnce('select-video-qualitys-select');
  bindSelectOnce('select-languages-comments-select');
  bindSelectOnce('select-wave-visualizer-select');

  // Export configuration

//   Settings saved
//   const settings = GM_getValue('ytSettingsMDCM', '{}');
//   $id('config-data').value = settings;

  $id('export-config').addEventListener('click', () => {
    const settings = GM_getValue('ytSettingsMDCM', '{}');
    $id('config-data').value = settings;
    const configData = settings;
    try {
      JSON.parse(configData); // Validate JSON
      GM_setValue('ytSettingsMDCM', configData);
      setTimeout(() => {
        Notify('success', 'Configuration export successfully!');
      }, 1000);
    } catch (e) {
      Notify('error', 'Invalid configuration data. Please check and try again.');
    }
  });
  // Import configuration
  $id('import-config').addEventListener('click', () => {
    const configData = $id('config-data').value;
    try {
      JSON.parse(configData); // Validate JSON
      GM_setValue('ytSettingsMDCM', configData);
      setTimeout(() => {
        Notify('success', 'Configuration imported successfully!');
        window.location.reload();
      }, 1000);
      window.location.reload();
    } catch (e) {
      Notify('error', 'Invalid configuration data. Please check and try again.');
    }
  });
  panel.style.display = 'none';

  // var for wave

  // Load saved settings
  // Visible element DOM
  function checkElement(selector, callback) {
    const interval = setInterval(() => {
      if ($e(selector)) {
        clearInterval(interval);
        callback();
      }
    }, 100);
  }

  const checkActiveWave = $id('wave-visualizer-toggle');
  checkActiveWave.addEventListener('change', () => {
    const waveVisualizer = $e('#wave-visualizer-toggle');
    if (waveVisualizer.checked) {
      Notify('success', 'Wave visualizer enabled');
    } else {
      hideCanvas();
      Notify('success', 'Wave visualizer disabled realod page');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });

  // Cinematic lighting toggle event listener
  const checkCinematicLighting = $id('cinematic-lighting-toggle');
  if (checkCinematicLighting) {
    checkCinematicLighting.addEventListener('change', () => {
      const cinematicToggle = $e('#cinematic-lighting-toggle');
      const syncToggle = $e('#sync-cinematic-toggle');
      const cinematicDiv = $id('cinematics');
      
      if (cinematicToggle.checked) {
        Notify('success', 'Cinematic mode enabled');
      } else {
        Notify('success', 'Cinematic mode disabled');
      }
      
      // Aplicar el comportamiento según el estado de sincronización
      if (syncToggle.checked) {
        // Si hay sincronización, usar toggleCinematicLighting
        setTimeout(() => {
          toggleCinematicLighting();
        }, 300);
      } else {
        // Si no hay sincronización, aplicar display inmediatamente
        if (cinematicDiv) {
          cinematicDiv.style.display = cinematicToggle.checked ? 'block' : 'none';
        }
      }
    });
  }

  // Sync cinematic toggle event listener
  const checkSyncCinematic = $id('sync-cinematic-toggle');
  if (checkSyncCinematic) {
    checkSyncCinematic.addEventListener('change', () => {
      const syncToggle = $e('#sync-cinematic-toggle');
      const cinematicToggle = $e('#cinematic-lighting-toggle');
      const cinematicDiv = $id('cinematics');
      
      if (syncToggle.checked) {
        Notify('success', 'Sync with YouTube enabled');
        // Si se activa la sincronización y el modo cinematic está activado, sincronizar con YouTube
        if (cinematicToggle.checked) {
          setTimeout(() => {
            toggleCinematicLighting();
          }, 500);
        }
      } else {
        Notify('success', 'Sync with YouTube disabled');
        // Si se desactiva la sincronización, aplicar inmediatamente el estado del toggle
        if (cinematicDiv) {
          cinematicDiv.style.display = cinematicToggle.checked ? 'block' : 'none';
        }
      }
    });
  }

  checkElement('ytd-topbar-menu-button-renderer', () => {
    loadSettings();
    initializeHeaderButtons();
    setTimeout(checkNewVersion, 3000);
  });
  // validate change url SPA youtube

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement !== null) {
      hideCanvas();
    } else {
      showCanvas();
    }
  });

  document.addEventListener('yt-navigate-finish', () => {
    if (!document.location.href.includes('watch')) {
      hideCanvas();
    }
    scheduleApplySettings();
    if (!document.location.href.includes('youtube.com')) return;
    // Re-inject lockup stats when landing on watch (related column often renders late when coming from home)
    if (document.location.href.includes('youtube.com/watch')) {
      [300, 600, 1200, 2200, 3500].forEach((ms) => setTimeout(() => {
        injectLockupCachedStats();
        injectShortsLockupCachedStats();
        retargetLockupStatsObserverIfNeeded();
      }, ms));
    } else {
      // Re-inject when landing on home (feed often renders after SPA nav from watch/shorts)
      [300, 700, 1500, 2800].forEach((ms) => setTimeout(() => {
        injectLockupCachedStats();
        injectShortsLockupCachedStats();
      }, ms));
    }
  });
    GM_registerMenuCommand('Update Script by: DeveloperMDCM', function() {
      window.open('https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.user.js', '_blank');
    });

    // apis for download
    // https://video-download-api.com
    // 4kdownload

  // --- Background Image Customization ---
  const inputFile = $id('background_image');
  const preview = $id('background-image-preview');
  const removeBtn = $id('remove-background-image');

  // show preview
  const storedImage = localStorage.getItem('backgroundImage');
  if (storedImage) {
    preview.style.backgroundImage = `url(${storedImage})`;
    preview.classList.add('has-image');
    removeBtn.style.display = 'flex';
  } else {
    preview.style.backgroundImage = '';
    preview.classList.remove('has-image');
    removeBtn.style.display = 'none';
  }


  preview.addEventListener('click', (e) => {
    if (e.target === removeBtn) return;
    inputFile.click();
  });

    // add background image (bind once)
    inputFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        const dataUrl = ev.target.result;
        preview.style.backgroundImage = `url(${dataUrl})`;
        preview.classList.add('has-image');
        localStorage.setItem('backgroundImage', dataUrl);
        removeBtn.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });

    // Remove background image (bind once)
    if (removeBtn && removeBtn.dataset.ytToolsBound !== '1') {
      removeBtn.dataset.ytToolsBound = '1';
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only allow real user click to remove stored background
        if (e.isTrusted === false) return;
        preview.style.backgroundImage = '';
        preview.classList.remove('has-image');
        localStorage.removeItem('backgroundImage');
        removeBtn.style.display = 'none';
      });
    }
