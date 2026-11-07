# Maintaining the local userscript

For end-user installation and use, see the [main README](../README.md).

On 64-bit Windows, run **Start YouTube Tools.cmd** from the project root. It
bootstraps a pinned Node.js executable if necessary and runs `dev.mjs`. The
service verifies or installs its pinned yt-dlp, FFmpeg and FFprobe binaries in
`.local/bin`. It builds the userscript, serves the installer at
`http://127.0.0.1:8766/`, and watches the modular sources for changes. Nothing
is installed system-wide. Developers with Node.js on PATH can instead run
`npm run dev:userscript`.

Edit files in `tampermonkey/src`; do not edit the generated
`tampermonkey/youtube-tools.user.js`. Run `npm run check:userscript` to build,
verify and syntax-check it. The running service rebuilds after source changes.
Install changes from the local install page or Tampermonkey's **YouTube Tools:
install or update** menu and refresh YouTube. The script uses ordinary compiled
source, not runtime `eval`.

The local userscript retains its original **YouTube Tools - Local Development**
name and namespace so previous installations update in place and keep their
Tampermonkey storage. The original upstream script uses different storage and
should be disabled to avoid duplicate controls.

The service listens only on loopback, checks the Host header, and restricts
download requests to a local token, supported formats, and YouTube video IDs.
Its token is generated in `.local/dev/download-token` and inserted into the
locally served userscript. Install the script again if moving the project to a
new folder, which creates a new token. The service stores downloads in Windows'
Downloads folder and must remain running for video and audio downloads.

The versions, sources and SHA-256 hashes for the managed tools are pinned in
`start-local.ps1`, `ensure-yt-dlp.mjs` and `ensure-ffmpeg.mjs`. Update the
version and corresponding hashes together after validating upstream releases;
yt-dlp and YouTube change regularly. FFmpeg binaries and their license
information are published in the [ffmpeg-static release](https://github.com/eugeneware/ffmpeg-static/releases/tag/b6.1.1).

The browser-extension build under `extension/` is inherited from upstream and is
not currently integrated with the local installer or covered by its testing.
