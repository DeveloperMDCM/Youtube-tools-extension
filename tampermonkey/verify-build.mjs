import fs from 'fs';

const built = fs.readFileSync('tampermonkey/youtube-tools.user.js', 'utf8');

const checks = [
  ['starts with UserScript', built.startsWith('// ==UserScript==')],
  ['has IIFE open', built.includes('(function () {')],
  ['has IIFE close', /\}\)\(\);\s*$/.test(built)],
  ['has font-awesome CSS', built.includes('font-awesome/6.4.0')],
  ['has GM_addStyle', built.includes('GM_addStyle')],
  ['no CSS placeholder', !built.includes('__INJECT_STYLES_CSS__')],
  ['has download fn', built.includes('startDownloadVideoOrAudio')],
  ['has menuHTML', built.includes('menuHTML')],
  ['has continue watching', built.includes('setupContinueWatchingFeature')],
  ['has bookmarks', built.includes('applyBookmarksIfEnabled')],
  ['has dislikes', built.includes('videoDislike')],
  ['has DeveloperMDCM console', built.includes('DeveloperMDCM')],
  ['version 2.5', built.includes('@version      2.5')],
];

let ok = true;
for (const [label, pass] of checks) {
  console.log((pass ? 'OK  ' : 'FAIL') + '  ' + label);
  if (!pass) ok = false;
}

console.log('');
console.log('built lines:', built.split(/\n/).length);
console.log('built bytes:', built.length);
process.exit(ok ? 0 : 1);
