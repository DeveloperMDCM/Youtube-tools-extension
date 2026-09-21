/**
 * Build extension packages for Chrome, Edge, and Firefox.
 * Also generates content/generated-userscript.js from the Tampermonkey build.
 */
import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(root, '..');
const distRoot = path.join(root, 'dist');
const browsers = ['chrome', 'edge', 'firefox'];

function rimraf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function generateUserscriptModule() {
  const userscriptPath = path.join(repoRoot, 'tampermonkey', 'youtube-tools.user.js');
  if (!fs.existsSync(userscriptPath)) {
    throw new Error('Missing tampermonkey/youtube-tools.user.js — run npm run build:userscript first');
  }

  let code = fs.readFileSync(userscriptPath, 'utf8');
  code = code.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/, '');
  code = code.replace(/^\s*\(function\s*\(\s*\)\s*\{/, '');
  code = code.replace(/\}\)\s*\(\s*\)\s*;?\s*$/, '');

  const out = `/* eslint-disable */
/* Auto-generated from tampermonkey/youtube-tools.user.js — do not edit */
export function runYoutubeTools() {
  const GM_info = globalThis.GM_info;
  const GM_getValue = globalThis.GM_getValue.bind(globalThis);
  const GM_setValue = globalThis.GM_setValue.bind(globalThis);
  const GM_addStyle = globalThis.GM_addStyle.bind(globalThis);
  const GM_registerMenuCommand = globalThis.GM_registerMenuCommand.bind(globalThis);
  const GM_xmlhttpRequest = globalThis.GM_xmlhttpRequest.bind(globalThis);
  const GM = globalThis.GM || { xmlHttpRequest: GM_xmlhttpRequest };
  const unsafeWindow = globalThis.unsafeWindow || window;
  const iziToast = globalThis.iziToast;

${code}

  // Live reload hooks for the extension popup
  globalThis.__ytToolsLoadSettings = function () {
    try {
      if (globalThis.__YT_TOOLS_EXTENSION__) {
        __ytToolsRuntime.settingsLoaded = true;
        if (typeof applySettings === 'function') applySettings();
        return;
      }
      if (!document.getElementById('dislikes-toggle')) return;
      if (typeof loadSettings === 'function') loadSettings();
    } catch (err) {
      console.warn('[Youtube Tools] __ytToolsLoadSettings', err);
    }
  };
  globalThis.__ytToolsApplySettings = typeof applySettings === 'function' ? applySettings : null;
  globalThis.__ytToolsSaveSettings = typeof saveSettings === 'function' ? saveSettings : null;
}
`;

  const dest = path.join(root, 'src', 'content', 'generated-userscript.js');
  fs.writeFileSync(dest, out, 'utf8');
  console.log('Generated src/content/generated-userscript.js');
}

async function buildPopup(outDir) {
  await build({
    configFile: false,
    root,
    base: './',
    plugins: [react(), tailwindcss()],
    css: {
      postcss: {
        plugins: [],
      },
    },
    resolve: {
      alias: {
        '@shared': path.resolve(root, 'src/shared'),
        '@popup': path.resolve(root, 'src/popup'),
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: path.resolve(root, 'index.html'),
      },
    },
  });
}

async function buildIife(entry, fileName, outDir) {
  await build({
    configFile: false,
    root,
    plugins: fileName === 'content.js' ? [tailwindcss()] : [],
    css: {
      postcss: {
        plugins: [],
      },
    },
    resolve: {
      alias: {
        '@shared': path.resolve(root, 'src/shared'),
      },
    },
    build: {
      outDir,
      emptyOutDir: false,
      sourcemap: true,
      cssCodeSplit: false,
      lib: {
        entry,
        name: fileName.replace(/\.js$/, '').replace(/-/g, '_'),
        formats: ['iife'],
        fileName: () => fileName,
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          assetFileNames: fileName === 'content.js' ? 'content[extname]' : 'assets/[name][extname]',
        },
      },
    },
  });
}

function packageBrowser(browser, stagingDir) {
  const target = path.join(distRoot, browser);
  rimraf(target);
  copyDir(stagingDir, target);
  fs.copyFileSync(
    path.join(root, 'manifests', `${browser}.json`),
    path.join(target, 'manifest.json')
  );
  copyDir(path.join(root, 'public', 'icons'), path.join(target, 'icons'));

  // If content build emitted CSS (iziToast), keep it next to content.js
  console.log(`✓ ${browser} → extension/dist/${browser}`);
}

async function main() {
  process.env.EXT_BUILD = '1';

  // Ensure userscript artifact exists
  const usPath = path.join(repoRoot, 'tampermonkey', 'youtube-tools.user.js');
  if (!fs.existsSync(usPath)) {
    console.log('Building userscript first…');
    const { spawnSync } = await import('child_process');
    const r = spawnSync('node', [path.join(repoRoot, 'tampermonkey', 'build.mjs')], {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: true,
    });
    if (r.status !== 0) process.exit(r.status || 1);
  }

  generateUserscriptModule();
  rimraf(distRoot);
  const staging = path.join(distRoot, '_staging');

  console.log('Building popup…');
  await buildPopup(staging);

  console.log('Building background.js…');
  await buildIife(
    path.resolve(root, 'src/background/service-worker.ts'),
    'background.js',
    staging
  );

  console.log('Building content.js (userscript + polyfill)…');
  await buildIife(path.resolve(root, 'src/content/index.ts'), 'content.js', staging);

  for (const browser of browsers) {
    packageBrowser(browser, staging);
  }

  rimraf(staging);
  console.log('\nLoad unpacked:');
  console.log('  Chrome → extension/dist/chrome');
  console.log('  Edge   → extension/dist/edge');
  console.log('  Firefox → extension/dist/firefox/manifest.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
