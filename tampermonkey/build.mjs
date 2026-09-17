/**
 * Build Tampermonkey userscript from modular sources.
 *
 * Edits live in tampermonkey/src/
 * Output: tampermonkey/youtube-tools.user.js  (single file for install / Greasy Fork)
 *
 * Usage: node tampermonkey/build.mjs
 *    or: npm run build:userscript
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');
const outFile = path.join(__dirname, 'youtube-tools.user.js');

const MODULES = [
  '01-config-utils.js',
  '02-download.js',
  '03-storage-version.js',
  '04-continue-watching.js',
  '05-shorts-channel.js',
  '06-lockup-stats.js',
  '07-bookmarks.js',
  '08-dislikes.js',
  '09-styles.js',
  '10-player-buttons.js',
  '11-menu-ui.js',
  '12-app.js',
  '13-transcript.js',
];

function read(file) {
  return fs.readFileSync(path.join(srcDir, file), 'utf8');
}

function stripBanner(source) {
  return source.replace(
    /^\/\/ ={10,}[\s\S]*?\/\/ ={10,}\r?\n\r?\n?/,
    ''
  );
}

const header = stripBanner(read('header.meta.js')).trimEnd();
const stylesCss = read('styles.css');

const bodyParts = MODULES.map((file) => {
  let code = stripBanner(read(file));
  if (file === '09-styles.js') {
    code = code.replace(
      '/* __INJECT_STYLES_CSS__ */',
      () => stylesCss.replace(/`/g, '\\`')
    );
  }
  return `  // --- ${file} ---\n${code.trimEnd()}`;
});

const built = [
  header,
  '',
  '(function () {',
  "  'use strict';",
  '',
  bodyParts.join('\n\n'),
  '',
  '})();',
  '',
].join('\n');

fs.writeFileSync(outFile, built, 'utf8');

const lineCount = built.split(/\r?\n/).length;
console.log(`Built ${path.relative(process.cwd(), outFile)}`);
console.log(`  ${MODULES.length} modules + styles.css → ${lineCount} lines`);
