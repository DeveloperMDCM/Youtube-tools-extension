# Local YouTube testing

Fork: https://github.com/neuronsarealsocool/Youtube-tools-extension

Upstream: https://github.com/DeveloperMDCM/Youtube-tools-extension

## Start

On 64-bit Windows, double-click **Start YouTube Tools.cmd** in the repository
folder. The first start downloads pinned standalone builds of Node.js, yt-dlp,
FFmpeg and FFprobe into `.local/bin/` and verifies their SHA-256 checksums.
No system-wide installation, Python, pip, npm, Node.js or FFmpeg on PATH is
required. The first setup needs internet access and downloads roughly 150 MB.
Keep the launcher window open while downloading.

Alternatively, if Node.js is already installed, `npm run dev:userscript` starts
the service and automatically installs the other local tools.

The local service must be started for downloads; the userscript alone cannot
install or run native programs. If setup fails, the terminal reports the cause.
Pinned versions and checksums live in `start-local.ps1`, `ensure-yt-dlp.mjs`,
and `ensure-ffmpeg.mjs`. Update each version and its checksums together. The
FFmpeg binaries are obtained from the [ffmpeg-static release](https://github.com/eugeneware/ffmpeg-static/releases/tag/b6.1.1),
which includes licensing and source information for those binaries.

Open http://127.0.0.1:8766 and install **YouTube Tools - Local Development**
in Tampermonkey. Disable the original YouTube Tools script while testing so the
two engines do not both run on YouTube. Keep it installed for rollback.

The development copy has its own name, namespace and Tampermonkey storage. Its
settings, bookmarks and history start separately. The engine also uses YouTube's
localStorage for some appearance settings, so those remain shared on that origin.

## Edit and inspect

Edit modules and CSS under `tampermonkey/src/`. The watcher rebuilds and syntax-checks
the code. Tampermonkey installs the complete compiled source. After editing, click
**Update local build**, accept Tampermonkey's update, then refresh YouTube.
The Tampermonkey menu also has **Local development: install latest build**.

The engine is embedded as ordinary source code, without runtime eval or a Function
constructor. This avoids YouTube's Trusted Types restriction that blocked the
initial dynamic loader. A green badge identifies the installed build; a red badge
reports startup errors. Browser checks remain necessary after engine changes.

The server listens only on 127.0.0.1:8766 and serves a fixed set of endpoints, never
arbitrary local files. Invalid builds keep the last good code. A stopped server
does not stop the installed script; existing and new pages still run the last
installed build. The server must remain running for local downloads. The download
buttons send the video ID and quality to the local service, which writes to the
Windows Downloads folder. The service accepts only supported formats and uses a
local token. It reports success only when the output file exists.

The development script's update/download URLs point to loopback. Each build has
a new version. All source changes take effect after updating the installed script.
The upstream update notification is suppressed only in the development response.

## Check a release build

```powershell
npm run check:userscript
```

Build the release artifact with `npm run build:userscript`. Do not manually edit
`tampermonkey/youtube-tools.user.js`. Development outputs and local backups are in
`.local/`, which Git ignores.

## Roll back

Disable the local development userscript, enable the original script and refresh
YouTube. Stop the development server with Ctrl+C when running it in a terminal.

## Initial inspection, 6 November 2026

Chrome/Tampermonkey had YouTube Tools **2.5.2** enabled. The upstream GitHub metadata
is **2.5.1**. The published Greasy Fork 2.5.2 source was downloaded to
`.local/backups/greasyfork-current.user.js` for comparison; it is not an export of
private Tampermonkey settings. The installed script was also exported through
Tampermonkey to `.local/backups/installed-2.5.2.user.js`. Compared with the repository build, differences are
the version/update metadata and additional GM request fallbacks in the repository.
The original browser installation is preserved.

The corrected compiled development build was verified in the live Chrome profile:
the green `YT Tools LOCAL` badge and update button appeared, the player toolbar
rendered, and the top-right gear opened the YouTube Tools settings panel. The
original script remains disabled during testing. The development wrapper has no
runtime evaluation.
