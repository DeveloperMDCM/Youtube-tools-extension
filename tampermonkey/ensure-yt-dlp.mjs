import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Official Windows release; update the version and checksum together.
const VERSION = '2026.10.26';
const SHA256 = 'f5389d3698ecde4ef06f4e6b1ce0294fe9ac1396228c8990b8d3416d6d177a7d';
const URL = `https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/yt-dlp.exe`;
const digest = data => createHash('sha256').update(data).digest('hex');

export async function ensureYtDlp(directory) {
  if (process.platform !== 'win32' || process.arch !== 'x64') {
    throw new Error('Automatic yt-dlp setup currently supports 64-bit Windows only.');
  }
  const executable = join(directory, 'yt-dlp.exe');
  try {
    if (digest(await readFile(executable)) === SHA256) return executable;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  console.log(`Installing yt-dlp ${VERSION} locally (one-time download)…`);
  const response = await fetch(URL, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`Could not download yt-dlp: HTTP ${response.status}`);
  const expectedSize = Number(response.headers.get('content-length'));
  if (expectedSize > 60 * 1024 * 1024) throw new Error('Unexpected yt-dlp download size');
  const binary = Buffer.from(await response.arrayBuffer());
  if (binary.length > 60 * 1024 * 1024 || digest(binary) !== SHA256) {
    throw new Error('yt-dlp checksum did not match; installation stopped');
  }
  await mkdir(directory, { recursive: true });
  const temporary = join(directory, `yt-dlp-${process.pid}.tmp`);
  try {
    await writeFile(temporary, binary, { flag: 'wx' });
    await rename(temporary, executable);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  console.log('yt-dlp installed and checksum verified.');
  return executable;
}
