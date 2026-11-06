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
the code. Tampermonkey installs the complete compiled source, and a status badge
polls the local build revision every 1.5 seconds. On a changed build, click
**Update local build**, accept Tampermonkey's update, then refresh YouTube.
The Tampermonkey menu also has **Local development: install latest build**.

The engine is embedded as ordinary source code, without runtime eval or a Function
constructor. This avoids YouTube's Trusted Types restriction that blocked the
initial dynamic loader. A green badge identifies the installed build; a red badge
reports startup errors. Browser checks remain necessary after engine changes.

The server listens only on 127.0.0.1:8766 and serves a fixed set of endpoints, never
arbitrary local files. Invalid builds keep the last good code. A stopped server
does not stop the installed script; existing and new pages still run the last
installed build, with an offline status until the server is restarted.

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
