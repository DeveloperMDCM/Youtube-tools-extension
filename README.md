# YouTube Tools: local downloads

This fork of [DeveloperMDCM's YouTube Tools](https://github.com/DeveloperMDCM/Youtube-tools-extension) adds one-click video and transcript downloads to the YouTube player. A small service on your computer uses yt-dlp to save videos; the transcript button saves Markdown directly from the browser.

## Install on Windows

This setup supports **64-bit Windows**, Chrome, and Tampermonkey. You need internet access for the initial setup. The local service automatically downloads pinned copies of Node.js, yt-dlp, FFmpeg and FFprobe into the project folder and verifies their checksums. You don't need to install those tools, Python, or npm system-wide.

1. Install [Tampermonkey](https://www.tampermonkey.net/) in Chrome. In Chrome's Tampermonkey extension settings, enable **Allow User Scripts** if available. See [Tampermonkey's instructions](https://www.tampermonkey.net/faq.php?q=Q209) if the option is missing.
2. [Download the project ZIP](https://github.com/neuronsarealsocool/Youtube-tools-extension/archive/refs/heads/dev/live-testing.zip) and **extract it** to a folder you intend to keep. Do not run it from inside the ZIP.
3. In the extracted folder, double-click **Start YouTube Tools.cmd**. The first start downloads the local tools and may take several minutes. Wait until the window says YouTube Tools is ready, and leave it open while downloading.
4. Open [http://127.0.0.1:8766/](http://127.0.0.1:8766/) in Chrome. Click **Install or update the YouTube Tools userscript** and confirm the installation in Tampermonkey. If Tampermonkey asks to allow connections to the local service, allow them.
5. If you already have another YouTube Tools userscript enabled, disable the older one in the Tampermonkey dashboard to avoid duplicate controls. Refresh YouTube.

The Tampermonkey entry is named **YouTube Tools - Local Development** for compatibility with earlier installs of this fork. Its name and namespace are kept so existing settings are retained when updating.

## Use

- Open a YouTube video and click **MP4** beside the play button. The download starts immediately and its status appears in the player, including in full screen. The initial default is 720p.
- Click **Transcript ↓** beside the play button to save a Markdown (`.md`) transcript with the video title, link and timestamps. In the YouTube Tools settings panel (gear icon), choose **Default transcript language**. If the requested language isn't available, the script attempts a YouTube translation when available; otherwise it reports an error.
- In the same settings panel, choose **Default MP4 download resolution**. The downloader chooses an available stream at or below that resolution. The MP4 download attempts to embed the YouTube thumbnail as cover art; Windows File Explorer may choose a different preview frame.
- Video and audio downloads are saved to your Windows Downloads folder. Transcript files use the browser's configured download location. The local service handles one video or audio download at a time.

The player controls can be enabled or disabled with the corresponding YouTube Tools button settings. Existing tools inherited from upstream remain available in the Tampermonkey version.

## Start and update later

Start **Start YouTube Tools.cmd** each time you want local video or audio downloads, and leave its window open. It does not currently start automatically with Windows. The transcript button does not need the local service once the userscript is installed.

To update, download and extract the newer project version, start its launcher, visit [http://127.0.0.1:8766/](http://127.0.0.1:8766/) and choose **Install or update**. Alternatively, with YouTube open, use the Tampermonkey menu **YouTube Tools: install or update**. Accept the update and refresh YouTube. Don't run two copies of the local service at the same time.

The tools downloaded into `.local/bin` are pinned and checksum-verified. Updating the project is how you receive a newer pinned tool version. Moving the project to a new folder requires starting the new copy and updating the userscript so it has the new local service's token.

## Troubleshooting

- **No player buttons:** refresh YouTube, confirm the local userscript is enabled and that Tampermonkey has permission to run user scripts. Check the YouTube Tools settings if a button is hidden.
- **Local service unavailable:** start the launcher and leave it open. If setup reports an error, check the window for details and your internet connection. Port `127.0.0.1:8766` must be available.
- **No transcript or wrong language:** not every video has captions or translation for every language. Change the default transcript language in settings or use the existing transcript panel to select an available caption track.
- **Download fails:** YouTube or yt-dlp may have changed, or the video may be unavailable. Update the project and try again. The existing public-provider paths in the upstream extension are separate from this local-service setup.
- **Can't find the file:** check the Windows Downloads folder for video and audio, and Chrome's Downloads page for transcripts.

## How it works and source

The launcher starts a loopback-only service on `127.0.0.1:8766`. The service accepts a video ID and supported format, authenticates requests using a locally generated token, and saves downloads to the Windows Downloads folder. The userscript and service need to be installed from the same project folder. The service's first-run downloads are verified against hashes pinned in the repository. See [local development notes](tampermonkey/LOCAL-DEVELOPMENT.md) for maintainers and [changes in this fork](CHANGELOG.md).

This fork's supported install path is the Tampermonkey userscript generated by the local service. The upstream browser-extension source remains in `extension/`; this local download setup has not been packaged or tested as a standalone browser extension. The upstream [userscript metadata](tampermonkey/src/header.meta.js) declares MIT; this repository does not contain a separate project license file.
