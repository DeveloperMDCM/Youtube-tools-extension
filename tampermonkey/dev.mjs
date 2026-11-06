import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, watch, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { homedir } from 'node:os';
import { Script } from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);
const output = join(root, '.local', 'dev');
const base = 'http://127.0.0.1:8766';
function downloadsDirectory() {
  if (process.platform === 'win32') {
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      "(New-Object -ComObject Shell.Application).Namespace('shell:Downloads').Self.Path"],
    { encoding: 'utf8', windowsHide: true });
    const path = result.stdout?.trim();
    if (result.status === 0 && path && existsSync(path)) return path;
    throw new Error('Could not locate the Windows Downloads folder');
  }
  return join(homedir(), 'Downloads');
}
const downloads = downloadsDirectory();
mkdirSync(output, { recursive: true });
const tokenFile = join(output, 'download-token');
let downloadToken;
try { downloadToken = readFileSync(tokenFile, 'utf8').trim(); }
catch { downloadToken = randomBytes(32).toString('hex'); writeFileSync(tokenFile, downloadToken, { mode: 0o600 }); }
const jobs = new Map();
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
    const wrapper = readFileSync(join(here, 'dev-loader.js'), 'utf8');
    const revision = createHash('sha256').update(code).update(wrapper).digest('hex').slice(0, 12);
    const header = built.slice(0, built.indexOf('// ==/UserScript=='))
      .split(/\r?\n/)
      .filter(line => !/^\/\/ @(?:name(?::\S+)?|namespace|homepage|updateURL|downloadURL|version|description(?::\S+)?)\s/.test(line));
    header.push(
      '// @name         YouTube Tools - Local Development',
      '// @namespace    https://github.com/neuronsarealsocool/Youtube-tools-extension/local-dev',
      '// @homepage     https://github.com/neuronsarealsocool/Youtube-tools-extension',
      '// @description  Compiled local build. Use Update local build after editing sources. Keep the original script disabled while testing.',
      '// @version      1.0.1.' + Date.now(),
      '// @updateURL    ' + base + '/youtube-tools-local-dev.user.js',
      '// @downloadURL  ' + base + '/youtube-tools-local-dev.user.js',
      '// @noframes',
      '// ==/UserScript==',
    );
    const nextLoader = header.join('\n') + '\n\n' + wrapper
      .replace("'__LOCAL_BUILD_REVISION__'", JSON.stringify(revision))
      .replace("'__LOCAL_DOWNLOAD_TOKEN__'", JSON.stringify(downloadToken))
      .replace('// __LOCAL_ENGINE__', () => code);
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
  const route = new URL(request.url, base).pathname;
  if (route === '/local-download') {
    if (request.headers['x-yt-tools-token'] !== downloadToken) { response.writeHead(403).end(); return; }
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'no-store');
    if (request.method === 'GET') {
      const id = new URL(request.url, base).searchParams.get('id');
      const job = jobs.get(id);
      if (!job) { response.writeHead(404).end(); return; }
      response.end(JSON.stringify(job)); return;
    }
    if (request.method !== 'POST' || !String(request.headers['content-type']).startsWith('application/json')) { response.writeHead(405).end(); return; }
    let body = '';
    request.on('data', chunk => { body += chunk; if (body.length > 4096) request.destroy(); });
    request.on('end', () => {
      let input;
      try { input = JSON.parse(body); } catch { response.writeHead(400).end(); return; }
      const qualities = ['144', '240', '360', '480', '720', '1080', '4k', '8k'];
      const audio = ['mp3', 'm4a', 'aac', 'opus', 'ogg', 'flac', 'wav', 'webm'];
      if (!/^[A-Za-z0-9_-]{11}$/.test(input.videoId) || ![...qualities, ...audio].includes(input.format)) { response.writeHead(400).end(); return; }
      if ([...jobs.values()].some(job => job.state === 'running')) { response.writeHead(409).end(JSON.stringify({ error: 'Another download is in progress.' })); return; }
      const id = randomUUID();
      const job = { state: 'running', message: 'Downloading to your Downloads folder…' };
      jobs.set(id, job);
      const args = ['-m', 'yt_dlp', '--ignore-config', '--no-playlist', '--no-overwrites', '--js-runtimes', 'node', '--newline', '--print', 'after_move:YT_TOOLS_FILE:%(filepath)s', '-P', downloads, '-o', '%(title).150B [%(id)s].%(ext)s'];
      if (audio.includes(input.format)) {
        args.push('-x', '--audio-format', input.format === 'webm' ? 'best' : input.format);
      } else {
        const h = input.format === '4k' ? 2160 : input.format === '8k' ? 4320 : Number(input.format);
        const ext = h > 1080 ? 'webm' : 'mp4';
        const aext = ext === 'mp4' ? 'm4a' : 'webm';
        args.push('-f', `bv*[ext=${ext}][height<=${h}]+ba[ext=${aext}]/b[ext=${ext}][height<=${h}]/b[height<=${h}]`, '--merge-output-format', ext);
        if (ext === 'mp4') args.push('--embed-thumbnail', '--convert-thumbnails', 'jpg');
      }
      args.push(`https://www.youtube.com/watch?v=${input.videoId}`);
      const child = spawn('py', args, { windowsHide: true, env: { ...process.env, PYTHONPATH: join(root, '.local', 'python-deps'), PYTHONIOENCODING: 'utf-8' } });
      let lastError = '';
      let output = '';
      child.stderr.on('data', chunk => { lastError = (lastError + chunk.toString()).slice(-1500); });
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', chunk => {
        output = (output + chunk).slice(-10000);
        const matches = [...chunk.matchAll(/\[download\]\s+(\d+(?:\.\d+)?)%/g)];
        if (matches.length) job.message = `Downloading: ${matches.at(-1)[1]}%`;
      });
      child.on('error', e => { job.state = 'error'; job.message = e.message; });
      child.on('close', code => {
        if (job.state === 'error') return;
        const file = output.match(/YT_TOOLS_FILE:([^\r\n]+)/)?.[1]?.trim();
        const complete = code === 0 && file && existsSync(file);
        job.state = complete ? 'complete' : 'error';
        job.message = complete ? `Saved to ${file}` : (lastError.trim().split('\n').at(-1) || 'The downloader did not produce a file.');
      });
      response.writeHead(202).end(JSON.stringify({ id }));
    });
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return;
  }
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
      '<p>Edit tampermonkey/src/. Click Update local build, accept the update, then refresh YouTube.</p>';
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
const wrapperWatcher = watch(join(here, 'dev-loader.js'), queueBuild);
function stop() { clearTimeout(pending); sourceWatcher.close(); buildWatcher.close(); wrapperWatcher.close(); server.close(); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
