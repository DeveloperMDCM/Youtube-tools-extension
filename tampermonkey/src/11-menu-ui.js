// =============================================================================
// 11-menu-ui.js — Themes + settings menu HTML + panel
// Source lines 3848-4437 of youtube_script_new_ui.js
// =============================================================================

  const themes = [
    {
      name: 'Default / Reload',
      gradient: '',
      textColor: '',
      raised: '',
      btnTranslate: '',
      CurrentProgressVideo: '',
      videoDuration: '',
      colorIcons: '',
      textLogo: '',
      primaryColor: '',
      secondaryColor: '',
    },
    {
      name: 'Midnight Blue',
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      textColor: '#ffffff',
      raised: '#f00',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Forest Green',
      gradient: 'linear-gradient(135deg, #14532d, #22c55e)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Sunset Orange',
      gradient: 'linear-gradient(135deg, #7c2d12, #f97316)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Royal Purple',
      gradient: 'linear-gradient(135deg, #4c1d95, #8b5cf6)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Cherry Blossom',
      gradient: 'linear-gradient(135deg, #a9005c, #fc008f)',
      textColor: '#ffffff',
      raised: '#fc008f',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Red Dark',
      gradient: 'linear-gradient(135deg, #790909, #f70131)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Raind',
      gradient: 'linear-gradient(90deg, #3f5efb 0%, #fc466b 100%)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Neon',
      gradient: 'linear-gradient(273deg, #ee49fd 0%, #6175ff 100%)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Azure',
      gradient: 'linear-gradient(273deg, #0172af 0%, #74febd 100%)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Butterfly',
      gradient: 'linear-gradient(273deg, #ff4060 0%, #fff16a 100%)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Colombia',
      gradient: 'linear-gradient(174deg, #fbf63f 0%, #0000bb 45%, #ff0000 99%)',
      textColor: '#ffffff',
      raised: '#303131',
      btnTranslate: '#000',
      CurrentProgressVideo: '#0f0',
      videoDuration: '#fff',
      colorIcons: '#fff',
      textLogo: '#f00',
    },
    {
      name: 'Mexico',
      gradient: 'linear-gradient(180deg, #006847 0%, #ffffff 48%, #ce1126 100%)',
      textColor: '#1a1a1a',
      raised: '#006847',
      btnTranslate: '#000',
      CurrentProgressVideo: '#ce1126',
      videoDuration: '#1a1a1a',
      // Black contrasts on green / white / red bands (green icons vanished on green)
      colorIcons: '#1a1a1a',
      textLogo: '#ce1126',
    },
    {
      name: 'Brazil',
      gradient: 'linear-gradient(135deg, #009c3b 0%, #ffdf00 50%, #002776 100%)',
      textColor: '#ffffff',
      raised: '#002776',
      btnTranslate: '#000',
      CurrentProgressVideo: '#ffdf00',
      videoDuration: '#fff',
      colorIcons: '#002776',
      textLogo: '#ffdf00',
    },
    {
      name: 'Argentina',
      gradient: 'linear-gradient(180deg, #74acdf 0%, #ffffff 45%, #74acdf 100%)',
      textColor: '#0a2540',
      raised: '#74acdf',
      btnTranslate: '#000',
      CurrentProgressVideo: '#fcbf49',
      videoDuration: '#0a2540',
      // Sun gold — readable on light-blue and white stripes
      colorIcons: '#c58b00',
      textLogo: '#0a2540',
    },
    {
      name: 'Spain',
      gradient: 'linear-gradient(180deg, #aa151b 0%, #f1bf00 45%, #aa151b 100%)',
      textColor: '#ffffff',
      raised: '#aa151b',
      btnTranslate: '#000',
      CurrentProgressVideo: '#f1bf00',
      videoDuration: '#fff',
      colorIcons: '#aa151b',
      textLogo: '#f1bf00',
    },
    {
      name: 'France',
      gradient: 'linear-gradient(90deg, #002395 0%, #ffffff 50%, #ed2939 100%)',
      textColor: '#0b1b3a',
      raised: '#002395',
      btnTranslate: '#000',
      CurrentProgressVideo: '#ed2939',
      videoDuration: '#0b1b3a',
      colorIcons: '#002395',
      textLogo: '#ed2939',
    },
    {
      name: 'Germany',
      gradient: 'linear-gradient(180deg, #000000 0%, #dd0000 50%, #ffce00 100%)',
      textColor: '#ffffff',
      raised: '#111111',
      btnTranslate: '#000',
      CurrentProgressVideo: '#ffce00',
      videoDuration: '#fff',
      colorIcons: '#ffce00',
      textLogo: '#dd0000',
    },
    {
      name: 'Italy',
      gradient: 'linear-gradient(90deg, #009246 0%, #ffffff 50%, #ce2b37 100%)',
      textColor: '#0f2a1a',
      raised: '#009246',
      btnTranslate: '#000',
      CurrentProgressVideo: '#ce2b37',
      videoDuration: '#0f2a1a',
      colorIcons: '#009246',
      textLogo: '#ce2b37',
    },
    {
      name: 'Japan',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #bc002d 55%, #111111 100%)',
      textColor: '#ffffff',
      raised: '#bc002d',
      btnTranslate: '#000',
      CurrentProgressVideo: '#bc002d',
      videoDuration: '#fff',
      colorIcons: '#bc002d',
      textLogo: '#bc002d',
    },
    {
      name: 'South Korea',
      gradient: 'linear-gradient(135deg, #003478 0%, #ffffff 45%, #c60c30 100%)',
      textColor: '#ffffff',
      raised: '#003478',
      btnTranslate: '#000',
      CurrentProgressVideo: '#c60c30',
      videoDuration: '#fff',
      colorIcons: '#003478',
      textLogo: '#c60c30',
    },
    {
      name: 'USA',
      gradient: 'linear-gradient(135deg, #3c3b6e 0%, #ffffff 45%, #b22234 100%)',
      textColor: '#ffffff',
      raised: '#3c3b6e',
      btnTranslate: '#000',
      CurrentProgressVideo: '#b22234',
      videoDuration: '#fff',
      colorIcons: '#3c3b6e',
      textLogo: '#b22234',
    },
    {
      name: 'United Kingdom',
      gradient: 'linear-gradient(135deg, #012169 0%, #ffffff 40%, #c8102e 100%)',
      textColor: '#ffffff',
      raised: '#012169',
      btnTranslate: '#000',
      CurrentProgressVideo: '#c8102e',
      videoDuration: '#fff',
      colorIcons: '#012169',
      textLogo: '#c8102e',
    },
    {
      name: 'India',
      gradient: 'linear-gradient(180deg, #ff9933 0%, #ffffff 48%, #138808 100%)',
      textColor: '#0b2a12',
      raised: '#138808',
      btnTranslate: '#000',
      CurrentProgressVideo: '#000080',
      videoDuration: '#0b2a12',
      // Ashoka blue — readable on saffron / white / green (orange vanished on saffron)
      colorIcons: '#000080',
      textLogo: '#ff9933',
    },
    {
      name: 'Canada',
      gradient: 'linear-gradient(90deg, #ff0000 0%, #ffffff 50%, #ff0000 100%)',
      textColor: '#1a1a1a',
      raised: '#ff0000',
      btnTranslate: '#000',
      CurrentProgressVideo: '#ff0000',
      videoDuration: '#1a1a1a',
      colorIcons: '#ff0000',
      textLogo: '#ff0000',
    },
    {
      name: 'Chile',
      gradient: 'linear-gradient(180deg, #d52b1e 0%, #ffffff 50%, #0039a6 100%)',
      textColor: '#ffffff',
      raised: '#0039a6',
      btnTranslate: '#000',
      CurrentProgressVideo: '#d52b1e',
      videoDuration: '#fff',
      colorIcons: '#d52b1e',
      textLogo: '#0039a6',
    },
  ];

  // Create our enhancement panel
  const panel = $cl('div');

  panel.id = 'yt-enhancement-panel';

  // Generate theme options HTML
  const themeOptionsHTML = themes
    .map(
      (theme, index) => `
        <label >
          <div class="theme-option">
          <div class="theme-preview" style="background: ${theme.gradient};"></div>
          <input type="radio" name="theme" value="${index}" ${
              index === 0 ? 'checked' : ''
            }>
              <span style="${theme.name === 'Default / Reload Page' ? 'color: red; ' : '' }" class="theme-name">${theme.name}</span>
              </div>
        </label>
    `
    )
    .join('');

    const languageOptionsHTML = Object.entries(languagesTranslate)
    .map(([code, name]) => {
      const selected = code === languagesTranslate ? 'selected' : '';
      return `<option value="${code}" ${selected}>${name}</option>`;
    })
    .join('');



   function checkDarkModeActive() {
      const prefCookie = document.cookie.split('; ').find(c => c.startsWith('PREF='));
      if (!prefCookie) return 'light';

      const prefValue = prefCookie.substring(5); 
      const params = new URLSearchParams(prefValue);

      const f6Value = params.get('f6');
      const darkModes = ['400', '4000000', '40000400', '40000000'];

      return darkModes.includes(f6Value) ? 'dark' : 'light';
    }


    let isDarkModeActive = checkDarkModeActive();


  const ytToggle = (id, label, checked = false) => `
    <label class="yt-toggle-row">
      <input type="checkbox" class="checkbox-mdcm yt-check" id="${id}"${checked ? ' checked' : ''}>
      <span class="checkmark" aria-hidden="true"></span>
      <span class="yt-toggle-label">${label}</span>
    </label>`;

  // Use Trusted Types to set innerHTML
  const menuHTML = `
  <div class="container-mdcm">
    <header class="popup-header header-mdcm">
      <div class="popup-header-top">
        <div class="popup-brand">
          <div class="popup-brand-row">
            <span class="popup-brand-icon"><i class="fa-brands fa-youtube"></i></span>
            <h1>Youtube Tools</h1>
          </div>
          <p>Themes, downloads, dislikes and more for YouTube</p>
        </div>
        <div class="icons-mdcm">
          <button type="button" class="icon-btn-mdcm active" id="home-nav-btn" title="Home">
            <i class="fa-solid fa-house"></i>
          </button>
          <a class="icon-btn-mdcm" href="https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.user.js" target="_blank" title="Update">
            <i class="fa-solid fa-arrows-rotate"></i>
          </a>
          <button type="button" class="icon-btn-mdcm close_menu_settings" title="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <nav class="tabs-mdcm">
        <button type="button" class="tab-mdcm" data-tab="general">
          <i class="fa-solid fa-sliders"></i>
          <span>General</span>
        </button>
        <button type="button" class="tab-mdcm" data-tab="themes">
          <i class="fa-solid fa-palette"></i>
          <span>Themes</span>
        </button>
        <button type="button" class="tab-mdcm" data-tab="stats">
          <i class="fa-solid fa-chart-simple"></i>
          <span>Stats</span>
        </button>
        <button type="button" class="tab-mdcm" data-tab="menu-settings">
          <i class="fa-solid fa-swatchbook"></i>
          <span>Menu</span>
        </button>
      </nav>
    </header>

    <main class="popup-main">
      <div id="yt-tools-home" class="tab-content active">
        <div class="yt-home-hero">
          <h2>Youtube Tools</h2>
          <p>Userscript that enhances YouTube: themes, MP3/MP4 download, dislikes, bookmarks, continue watching, wave visualizer and more.</p>
          <p class="yt-home-hint">Open General to toggle features, Themes for looks, Menu to style this panel.</p>
        </div>
        <div class="yt-version-grid">
          <div class="yt-version-chip">
            <div class="label">Extension</div>
            <div class="value">v2.0.0</div>
          </div>
          <div class="yt-version-chip">
            <div class="label">Script</div>
            <div class="value">v2.5.1</div>
          </div>
        </div>
        <div class="yt-action-grid">
          <button type="button" id="shareBtn-mdcm"><i class="fa-solid fa-share-nodes"></i> Share</button>
          <button type="button" id="importExportBtn"><i class="fa-solid fa-file-import"></i> Import / Export</button>
        </div>
        <div id="shareDropdown">
          <p class="yt-page-desc" style="margin-top:0">Share Youtube Tools with others</p>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${urlSharedCode}" target="_blank" data-network="facebook" class="share-link"><i class="fa-brands fa-facebook"></i> Facebook</a>
          <a href="https://twitter.com/intent/tweet?url=${urlSharedCode}" target="_blank" data-network="twitter" class="share-link"><i class="fa-brands fa-twitter"></i> X / Twitter</a>
          <a href="https://api.whatsapp.com/send?text=${urlSharedCode}" target="_blank" data-network="whatsapp" class="share-link"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${urlSharedCode}" target="_blank" data-network="linkedin" class="share-link"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
        </div>
        <div id="importExportArea">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h3>Import / Export</h3>
            <button type="button" class="icon-btn-mdcm" id="closeImportExportBtn" title="Close"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <p class="yt-page-desc">Back up or restore settings</p>
          <textarea id="config-data" placeholder="Paste configuration here to import"></textarea>
          <div class="action-buttons-mdcm">
            <button type="button" id="export-config" class="action-btn-mdcm">Export</button>
            <button type="button" id="import-config" class="action-btn-mdcm">Import</button>
          </div>
        </div>
        <p class="yt-page-desc" style="text-align:center;margin:0">Userscript · Tampermonkey</p>
      </div>

      <div id="general" class="tab-content">
        <h2 class="yt-page-title">Features</h2>
        <p class="yt-page-desc">Toggle YouTube enhancements</p>
        <div class="yt-toggle-grid">
          ${ytToggle('hide-comments-toggle', 'Hide Comments')}
          ${ytToggle('hide-sidebar-toggle', 'Hide Sidebar')}
          ${ytToggle('autoplay-toggle', 'Disable Autoplay')}
          ${ytToggle('subtitles-toggle', 'Disable Subtitles')}
          ${ytToggle('dislikes-toggle', 'Show Dislikes', true)}
          ${ytToggle('like-dislike-bar-toggle', 'Like vs Dislike bar')}
          ${ytToggle('bookmarks-toggle', 'Bookmarks (timestamps)')}
          ${ytToggle('continue-watching-toggle', 'Continue watching')}
          ${ytToggle('shorts-channel-name-toggle', 'Shorts: show channel name')}
          ${ytToggle('themes-toggle', 'Active Themes')}
          ${ytToggle('translation-toggle', 'Translate comments')}
          ${ytToggle('avatars-toggle', 'Download avatars')}
          ${ytToggle('reverse-mode-toggle', 'Reverse mode')}
          ${ytToggle('cinematic-lighting-toggle', 'Cinematic Mode')}
          ${ytToggle('wave-visualizer-toggle', 'Wave visualizer Beta', true)}
          ${ytToggle('sync-cinematic-toggle', 'Sync Ambient Mode YT')}
        </div>
        <div style="margin-top:12px;display:grid;gap:8px;">
          <div class="yt-field">
            <label class="yt-field-label" for="select-wave-visualizer-select">Effect wave visualizer</label>
            <select class="yt-select" id="select-wave-visualizer-select">
              <option value="linea">Line smooth</option>
              <option value="barras">Vertical bars</option>
              <option value="curva">Curved</option>
              <option value="picos">Smooth peaks</option>
              <option value="solida">Solid wave</option>
              <option value="dinamica">Dynamic wave</option>
              <option value="montana">Smooth mountain</option>
            </select>
          </div>
          <div class="yt-field">
            <label class="yt-field-label" for="select-video-qualitys-select">Default video player quality</label>
            <select class="yt-select" id="select-video-qualitys-select">
              <option value="user">User Default</option>
              <option value="">Auto</option>
              <option value="144">144</option>
              <option value="240">240</option>
              <option value="360">360</option>
              <option value="480">480</option>
              <option value="720">720</option>
              <option value="1080">1080</option>
              <option value="1440">1440</option>
              <option value="2160">2160</option>
            </select>
          </div>
          <div class="yt-field">
            <label class="yt-field-label" for="select-languages-comments-select">Language for translate comments</label>
            <select class="yt-select" id="select-languages-comments-select">${languageOptionsHTML}</select>
          </div>
          <div class="slider-container-mdcm">
            <label>Video Player Size: <span id="player-size-value">100</span>%</label>
            <input type="range" id="player-size-slider" class="slider-mdcm yt-range" min="50" max="150" value="100">
            <button type="button" class="reset-btn-mdcm" id="reset-player-size">Reset video size</button>
          </div>
        </div>
      </div>

      <div id="themes" class="tab-content">
        <h2 class="yt-page-title">Themes</h2>
        <p class="yt-page-desc">Customize YouTube colors and presets</p>
        <div id="background-image-container" class="background-image-container">
          <h4>Background Image</h4>
          <input type="file" id="background_image" accept="image/png, image/jpeg" style="display:none;" />
          <div id="background-image-preview" class="background-image-preview">
            <span class="background-image-overlay">
              <i class="fa fa-camera"></i>
              <span class="background-image-text">Select image</span>
            </span>
            <button type="button" id="remove-background-image" class="remove-background-image" title="Quitar fondo">&times;</button>
          </div>
        </div>
        <div class="themes-hidden">
          <p class="yt-page-desc">Disable Cinematic Mode on General for best results.${isDarkModeActive === 'dark' ? '' : ' <span style="color:#f66;">Activate dark mode to use themes.</span>'}</p>
          <div class="yt-toggle-grid" style="margin-bottom:10px;">
            <label class="yt-toggle-row">
              <input type="radio" class="radio-mdcm" name="theme" value="custom" checked>
              <span class="yt-toggle-label">Custom</span>
            </label>
            <label class="yt-toggle-row theme-selected-normal">
              <input type="radio" class="radio-mdcm" name="theme" value="normal">
              <span class="yt-toggle-label">Selected Themes</span>
            </label>
          </div>
          <div class="themes-options">
            <div class="options-mdcm">${themeOptionsHTML}</div>
          </div>
          <div class="theme-custom-options">
            <div class="options-mdcm">
              <div class="option-mdcm"><div class="card-items-end"><label>Progressbar Video:</label><input type="color" id="progressbar-color-picker" class="color-picker-mdcm" value="#ff0000"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Background Color:</label><input type="color" id="bg-color-picker" class="color-picker-mdcm" value="#000000"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Primary Color:</label><input type="color" id="primary-color-picker" class="color-picker-mdcm" value="#ffffff"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Secondary Color:</label><input type="color" id="secondary-color-picker" class="color-picker-mdcm" value="#ffffff"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Header Color:</label><input type="color" id="header-color-picker" class="color-picker-mdcm" value="#000000"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Icons Color:</label><input type="color" id="icons-color-picker" class="color-picker-mdcm" value="#ffffff"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Menu Color:</label><input type="color" id="menu-color-picker" class="color-picker-mdcm" value="#000000"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Line Color Preview:</label><input type="color" id="line-color-picker" class="color-picker-mdcm" value="#ff0000"></div></div>
              <div class="option-mdcm"><div class="card-items-end"><label>Time Color Preview:</label><input type="color" id="time-color-picker" class="color-picker-mdcm" value="#ffffff"></div></div>
            </div>
          </div>
        </div>
      </div>

      <div id="stats" class="tab-content">
        <h2 class="yt-page-title">Statistics</h2>
        <p class="yt-page-desc">Time spent on YouTube</p>
        <div id="yt-stats-toggle">
          <div class="stat-row">
            <div>Foreground Time</div>
            <div class="progress"><div class="progress-bar total-bar" id="usage-bar"></div></div>
            <div id="total-time">0h 0m 0s</div>
          </div>
          <div class="stat-row">
            <div>Video Time</div>
            <div class="progress"><div class="progress-bar video-bar" id="video-bar"></div></div>
            <div id="video-time">0h 0m 0s</div>
          </div>
          <div class="stat-row">
            <div>Shorts Time</div>
            <div class="progress"><div class="progress-bar shorts-bar" id="shorts-bar"></div></div>
            <div id="shorts-time">0h 0m 0s</div>
          </div>
        </div>
      </div>

      <div id="menu-settings" class="tab-content">
        <h2 class="yt-page-title">Menu appearance</h2>
        <p class="yt-page-desc">Colors for this settings panel</p>
        <div class="options-settings-mdcm">
          <div class="option-settings-mdcm">
            <label>Backgrounds</label>
            <div class="color-boxes" id="bg-color-options">
              <div class="color-box" data-type="bg" data-value="#0c0c0c" style="background-color:#0c0c0c;"></div>
              <div class="color-box" data-type="bg" data-value="#252525" style="background-color:#252525;"></div>
              <div class="color-box" data-type="bg" data-value="#1e1e1e" style="background-color:#1e1e1e;"></div>
              <div class="color-box" data-type="bg" data-value="#3a3a3a" style="background-color:#3a3a3a;"></div>
              <div class="color-box" data-type="bg" data-value="#000000" style="background-color:#000000;"></div>
              <div class="color-box" data-type="bg" data-value="#2d2d2d" style="background-color:#2d2d2d;"></div>
              <div class="color-box" data-type="bg" data-value="#444444" style="background-color:#444;"></div>
            </div>
          </div>
          <div class="option-settings-mdcm">
            <label>Accent</label>
            <div class="color-boxes" id="bg-accent-color-options">
              <div class="color-box" data-type="accent" data-value="#ff0000" style="background-color:#ff0000;"></div>
              <div class="color-box" data-type="accent" data-value="#e11d1d" style="background-color:#e11d1d;"></div>
              <div class="color-box" data-type="accent" data-value="#009c37" style="background-color:#009c37;"></div>
              <div class="color-box" data-type="accent" data-value="#0c02a0" style="background-color:#0c02a0;"></div>
              <div class="color-box" data-type="accent" data-value="#000000" style="background-color:#000000;"></div>
            </div>
          </div>
          <div class="option-settings-mdcm">
            <label>Text</label>
            <div class="color-boxes" id="text-color-options">
              <div class="color-box" data-type="color" data-value="#ffffff" style="background-color:#ffffff;"></div>
              <div class="color-box" data-type="color" data-value="#cccccc" style="background-color:#cccccc;"></div>
              <div class="color-box" data-type="color" data-value="#b3b3b3" style="background-color:#b3b3b3;"></div>
              <div class="color-box" data-type="color" data-value="#00ffff" style="background-color:#00ffff;"></div>
              <div class="color-box" data-type="color" data-value="#00ff00" style="background-color:#00ff00;"></div>
              <div class="color-box" data-type="color" data-value="#ffff00" style="background-color:#ffff00;"></div>
              <div class="color-box" data-type="color" data-value="#ffcc00" style="background-color:#ffcc00;"></div>
              <div class="color-box" data-type="color" data-value="#ff66cc" style="background-color:#ff66cc;"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="popup-footer actions-mdcm">
      <div class="popup-footer-versions">
        <span>Ext v2.0.0</span>
        <span>·</span>
        <span>Script v2.5.1</span>
      </div>
      <a href="https://github.com/DeveloperMDCM" target="_blank" rel="noreferrer">
        <i class="fa-brands fa-github"></i> DeveloperMDCM
      </a>
    </footer>
  </div>
  `;
  const panelHTML = policy?.createHTML
  ? policy.createHTML(`${menuHTML}`)
  : `${menuHTML}`;

  panel.innerHTML = panelHTML;

  $ap(panel);

  // Extension mode: keep panel in DOM (for loadSettings/applySettings) but never show it or the gear.
  if (IS_EXTENSION) {
    document.documentElement.dataset.ytToolsExtension = '1';
    panel.style.cssText =
      'display:none!important;visibility:hidden!important;pointer-events:none!important;position:fixed!important;left:-99999px!important;opacity:0!important;';
    GM_addStyle(`
      html[data-yt-tools-extension="1"] #yt-enhancement-panel,
      html[data-yt-tools-extension="1"] #toggle-button,
      html[data-yt-tools-extension="1"] #icon-menu-settings {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `);
  }
