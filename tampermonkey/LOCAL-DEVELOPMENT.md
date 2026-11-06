# Local YouTube testing

Fork: https://github.com/neuronsarealsocool/Youtube-tools-extension

Upstream: https://github.com/DeveloperMDCM/Youtube-tools-extension

## Start

Node.js is the only dependency for the userscript workflow; no npm install is needed.

```powershell
npm run dev:userscript
```

Open http://127.0.0.1:8766 and install **YouTube Tools - Local Development**
in Tampermonkey. Disable the original YouTube Tools script while testing so the
two engines do not both run on YouTube. Keep it installed for rollback.

The development copy has its own name, namespace and Tampermonkey storage. Its
settings, bookmarks and history start separately. The engine also uses YouTube's
localStorage for some appearance settings, so those remain shared on that origin.

## Edit and inspect

Edit modules and CSS under `tampermonkey/src/`. The watcher rebuilds and syntax-checks
the code. The loader requests that code from loopback, using the existing GM grants,
and polls its revision every 1.5 seconds. A changed build reloads the YouTube page.
Use Tampermonkey's **Local development: toggle automatic reload** command to pause
reloads while watching a video. A badge on YouTube identifies the active build.

The loader executes the locally fetched source in its userscript sandbox, passing
through the GM APIs and iziToast. Its first execution in the real Tampermonkey
sandbox must be verified in Chrome; Node checks cannot verify browser sandbox/CSP behavior.

The server listens only on 127.0.0.1:8766 and serves a fixed set of endpoints, never
arbitrary local files. Invalid builds keep the last good code. A stopped server
does not stop an already loaded page; a new page needs the server running.

The loader has no automatic update URL. Its own metadata or loader changes require
reinstalling the development userscript. Source module and CSS changes need no reinstall.
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
