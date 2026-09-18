

<p align="center">
  <a href="https://github.com/DeveloperMDCM/Youtube-tools-extension/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/DeveloperMDCM/Youtube-tools-extension"></a>
  <a href="https://github.com/DeveloperMDCM/Youtube-tools-extension"><img alt="GitHub stars" src="https://img.shields.io/github/stars/DeveloperMDCM/Youtube-tools-extension"></a>
</p>

<img width="1717" height="916" alt="d059976e-54fa-4ff0-91ba-946cd55d3075" src="https://github.com/user-attachments/assets/366d5e95-507b-480c-b0d9-a10e80253b75" />

# Youtube Tools

Enhancements for YouTube: themes, downloads, dislikes, bookmarks, continue watching, wave visualizer, and more.

This repository ships **two ways** to use the same tools:

| | Browser extension | Tampermonkey userscript |
|---|---|---|
| **Where** | Chrome · Edge · Firefox | Tampermonkey / Greasy Fork |
| **UI** | Popup (settings) | Gear menu on YouTube |
| **Version** | Extension package | Script **v2.5** |
| **Install** | Load unpacked build | Install `.user.js` |
| **Publish** | Store / self-host | [Greasy Fork](https://greasyfork.org/es/scripts/460680-youtube-tools-all-in-one-local-download-mp3-mp4-higt-quality-return-dislikes-and-more) |

Features are **shared** (same engine). Prefer the **extension** for a modern popup and sync via browser storage; prefer the **userscript** if you already use Tampermonkey.

---

## Features

<details open>
<summary>Click to expand / collapse</summary>

- Continue watching (history)
- Bookmarks (timestamps)
- Like vs Dislike bar
- Shorts: show channel name
- Download fallbacks (extra providers)
- Download again button
- Download audio: Flac, WAV, WebM, MP3, M4A, AAC, OPUS, OGG
- Download MP4 / MP3 up to 8K
- Default video player quality
- Copy video description
- Transcript: copy / download .txt (multi-language, optional timestamps)
- Playback stats
- Hide comments / hide sidebar
- Cinematic mode + sync with YouTube ambient mode
- Disable autoplay / subtitles
- Wave visualizer effects
- Download avatars (including comments)
- Change video player size
- Custom themes + country presets
- Background image / colors
- Skip ads (where supported)
- Picture-in-Picture
- Loop / repeat video
- Dislikes on videos and Shorts
- Rate video with stars
- Customize text / icon colors
- Download thumbnail
- Video screenshot
- Translate comments (videos & Shorts)
- Screen filter / mirror mode
- Adapt background to video
- Reset settings
- Import / export config (`.developermdcm`)
- Multi-language popup (extension)

</details>

### Download note

If MP3/MP4 download fails in the browser, install and enable this Chrome/Brave helper extension:

https://chrome.google.com/webstore/detail/lfhmikememgdcahcdlaciloancbhjino

---

## Repository layout

```
Youtube-tools-extension/
├── extension/          ← Browser extension (React popup + content script)
│   ├── src/popup/      ← Settings UI
│   ├── src/content/    ← Runs on YouTube (bundles userscript engine)
│   ├── scripts/        ← Build (Chrome / Edge / Firefox)
│   └── dist/           ← Output after build (load unpacked)
├── tampermonkey/       ← Userscript sources + build
│   ├── src/            ← Modular script (edit here)
│   ├── build.mjs
│   └── youtube-tools.user.js   ← Generated file to install
├── images/             ← Screenshots for this README
├── package.json
└── README.md
```

---

## Requirements

- **Node.js** ≥ 18
- npm

```bash
npm install
```

---

## Build

### Extension (Chrome / Edge / Firefox)

```bash
npm run build:extension
```

Outputs:

| Browser | Load this folder |
|---------|------------------|
| Chrome | `extension/dist/chrome` |
| Edge | `extension/dist/edge` |
| Firefox | `extension/dist/firefox` (or its `manifest.json`) |

`npm run build` is an alias for `build:extension`.

**Dev popup preview** (UI only):

```bash
npm run dev
```

### Userscript (Tampermonkey)

```bash
npm run build:userscript
```

Output: `tampermonkey/youtube-tools.user.js`

Edit modules under `tampermonkey/src/`, then rebuild. Do not hand-edit the generated `.user.js`.

More detail: [`tampermonkey/README.md`](tampermonkey/README.md)

---

## Install

### A) Browser extension (from this repo)

1. Run `npm install` and `npm run build:extension`.
2. Open `chrome://extensions/` (or Edge / Firefox equivalents).
3. Enable **Developer mode**.
4. **Load unpacked** → select `extension/dist/chrome` (or `edge` / `firefox`).
5. Open YouTube and use the extension popup to change settings.

<img src="/images/how%20install.png" width="670" alt="How to install the extension">

### B) Tampermonkey userscript

**From Greasy Fork (users):**

[Install on Greasy Fork](https://greasyfork.org/es/scripts/460680-youtube-tools-all-in-one-local-download-mp3-mp4-higt-quality-return-dislikes-and-more)

**From this repo (developers):**

1. Run `npm run build:userscript`.
2. In Tampermonkey → **Create a new script** / **Install from file**.
3. Use `tampermonkey/youtube-tools.user.js`.
4. Open YouTube → use the **gear** icon in the top bar to open settings.

---

## Screenshots

<img src="/images/multi.png" width="470" alt="Multi features">
<img src="/images/ex2.png" width="470" alt="Example 2">

<div align="center">
  <img src="/images/ex1.png" width="470" alt="Example 1">
  <img src="/images/ex3.png" width="470" alt="Example 3">
</div>

---

## Scripts reference

| Command | Description |
|---------|-------------|
| `npm run build:extension` | Build Chrome / Edge / Firefox packages |
| `npm run build:userscript` | Build Tampermonkey `.user.js` |
| `npm run build` | Same as `build:extension` |
| `npm run dev` | Preview extension popup (Vite) |
| `npm run preview` | Preview production popup build |

---

## Author

[DeveloperMDCM](https://github.com/DeveloperMDCM)

[![Star History Chart](https://star-history.dera.page/svg?repos=DeveloperMDCM/Youtube-tools-extension&type=Date)](https://star-history.dera.page/#DeveloperMDCM/Youtube-tools-extension&Date)
