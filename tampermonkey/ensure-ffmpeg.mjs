import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

// Pinned static FFmpeg builds from the ffmpeg-static project's b6.1.1 release.
const BASE = 'https://github.com/eugeneware/ffmpeg-static/releases/download/b6.1.1';
const FILES = [
  { name: 'ffmpeg', archive: '8883a3dffbd0a16cf4ef95206ea05283f78908dbfb118f73c83f4951dcc06d77', binary: '04e1307997530f9cf2fe35cba2ca7e8875ca91da02f89d6c7243df819c94ad00' },
  { name: 'ffprobe', archive: 'f309e6223ad89d2fe54bccd420a7709b66fd27540674e92309578ed491a43c8d', binary: '3a7e2dc003dc2cd1472827e4c7c4f056ae1ae0ae7c5bbc580c99b49827351ba4' },
];
const digest = data => createHash('sha256').update(data).digest('hex');

export async function ensureFfmpeg(directory) {
  if (process.platform !== 'win32' || process.arch !== 'x64') throw new Error('Automatic FFmpeg setup currently supports 64-bit Windows only.');
  await mkdir(directory, { recursive: true });
  for (const file of FILES) {
    const output = join(directory, `${file.name}.exe`);
    try { if (digest(await readFile(output)) === file.binary) continue; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    console.log(`Installing ${file.name} locally (one-time download)…`);
    const response = await fetch(`${BASE}/${file.name}-win32-x64.gz`, { signal: AbortSignal.timeout(180000) });
    if (!response.ok) throw new Error(`Could not download ${file.name}: HTTP ${response.status}`);
    if (Number(response.headers.get('content-length')) > 60 * 1024 * 1024) throw new Error(`Unexpected ${file.name} download size`);
    const archive = Buffer.from(await response.arrayBuffer());
    if (archive.length > 60 * 1024 * 1024 || digest(archive) !== file.archive) throw new Error(`${file.name} download checksum did not match`);
    const binary = gunzipSync(archive, { maxOutputLength: 120 * 1024 * 1024 });
    if (digest(binary) !== file.binary) throw new Error(`${file.name} executable checksum did not match`);
    const temporary = join(directory, `${file.name}-${process.pid}.tmp`);
    try { await writeFile(temporary, binary, { flag: 'wx' }); await rename(temporary, output); }
    finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
    console.log(`${file.name} installed and checksum verified.`);
  }
  return directory;
}
