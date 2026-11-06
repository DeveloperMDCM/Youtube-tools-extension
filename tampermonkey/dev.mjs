import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, watch } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);
const output = join(root, '.local', 'dev');
const base = 'http://127.0.0.1:8766';
mkdirSync(output, { recursive: true });
let bundle;
let loader;
let error = null;
let pending;

function build() {
  try {
    const result = spawnSync(process.execPath, [join(here, 'build.mjs')], {
      cwd: root, encoding: 'utf8', windowsHide: true,
    });
    if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Build failed');
    const built = readFileSync(join(here, 'youtube-tools.user.js'), 'utf8');
    // The release build stays unchanged; dev-only substitutions live in memory.
    const code = built.slice(built.indexOf('// ==/UserScript==') + '// ==/UserScript=='.length)
      .replace('  async function checkNewVersion() {', '  async function checkNewVersion() { return;');
    new Script(code, { filename: 'youtube-tools-local-runtime.js' });
    const revision = createHash('sha256').update(code).digest('hex').slice(0, 12);
    const header = built.slice(0, built.indexOf('// ==/UserScript=='))
      .split(/\r?\n/)
      .filter(line => !/^\/\/ @(?:name(?::\S+)?|namespace|homepage|updateURL|downloadURL|version|description(?::\S+)?)\s/.test(line));
    header.push(
      '// @name         YouTube Tools - Local Development',
      '// @namespace    https://github.com/neuronsarealsocool/Youtube-tools-extension/local-dev',
      '// @homepage     https://github.com/neuronsarealsocool/Youtube-tools-extension',
      '// @description  Runs this local checkout on YouTube. Keep the original script disabled while testing.',
      '// @version      1.0.0',
      '// @updateURL    none',
      '// @downloadURL  none',
      '// @noframes',
      '// ==/UserScript==',
    );
    const nextLoader = header.join('\n') + '\n\n' + readFileSync(join(here, 'dev-loader.js'), 'utf8');
    new Script(nextLoader, { filename: 'youtube-tools-local-dev.user.js' });
    writeFileSync(join(output, 'youtube-tools-local-dev.user.js'), nextLoader);
    bundle = { revision, code };
    loader = nextLoader;
    error = null;
    console.log(`[${new Date().toISOString()}] Build ready: ${revision}`);
  } catch (failure) {
    error = failure.message;
    console.error('Build failed; keeping last good build:', error);
  }
}

build();
if (!bundle) process.exit(1);
const server = createServer((request, response) => {
  // Serve only known development endpoints on loopback, never the repository tree.
  if (request.headers.host !== '127.0.0.1:8766') {
    response.writeHead(403).end(); return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return;
  }
  const route = new URL(request.url, base).pathname;
  let body;
  let type = 'application/json; charset=utf-8';
  if (route === '/bundle') body = JSON.stringify(bundle);
  else if (route === '/revision' || route === '/health') body = JSON.stringify({ revision: bundle.revision, error });
  else if (route === '/youtube-tools-local-dev.user.js') {
    body = loader; type = 'application/javascript; charset=utf-8';
  } else if (route === '/') {
    type = 'text/html; charset=utf-8';
    body = '<!doctype html><meta charset="utf-8"><title>YouTube Tools local development</title>' +
      '<h1>YouTube Tools local development</h1><p>The local build watcher is running.</p>' +
      '<p><a href="/youtube-tools-local-dev.user.js">Install local development userscript</a></p>' +
      '<p>Disable the original YouTube Tools script while testing. The development copy uses separate Tampermonkey storage.</p>' +
      '<p>Edit tampermonkey/src/. Valid builds trigger a YouTube reload. Toggle reload in the Tampermonkey menu.</p>';
  } else { response.writeHead(404).end(); return; }
  response.writeHead(200, {
    'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
  });
  response.end(request.method === 'HEAD' ? undefined : body);
});
server.on('error', failure => { console.error(failure.message); process.exit(1); });
server.listen(8766, '127.0.0.1', () => console.log(`Development server: ${base}`));
const queueBuild = () => { clearTimeout(pending); pending = setTimeout(build, 200); };
const sourceWatcher = watch(join(here, 'src'), queueBuild);
const buildWatcher = watch(join(here, 'build.mjs'), queueBuild);
function stop() { clearTimeout(pending); sourceWatcher.close(); buildWatcher.close(); server.close(); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
