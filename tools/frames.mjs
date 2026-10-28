#!/usr/bin/env node
// Extract frames and a timestamped contact sheet for video references.
// Usage: node tools/frames.mjs [SW-001 SW-002 …] [--fps 2] [--force]
// With no IDs, processes every assets/SW-*/ folder that has a video but no contact sheet.
// A folder with exactly one video that isn't named source.* has it renamed to source.<ext>.
// A record's `frames_fps:` frontmatter overrides the automatic rate (e.g. for fast cuts).
// Originals committed in originals/SW-###.<ext> are copied into assets/SW-###/ when that folder has no video,
// so after the local setup this also fills the Drive folders.
import { existsSync, readdirSync, readFileSync, renameSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
const originals = join(root, 'originals');
const VIDEO = new Set(['.mp4', '.mov', '.m4v', '.webm', '.mkv']);

const args = process.argv.slice(2);
const force = args.includes('--force');
const fpsFlag = args.indexOf('--fps');
const fpsOverride = fpsFlag === -1 ? null : Number(args[fpsFlag + 1]);
const ids = args.filter((a, i) => /^SW-\d+$/.test(a) && args[i - 1] !== '--fps');

try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch {
  console.error('ffmpeg not found. Install it (macOS: brew install ffmpeg · Windows: winget install ffmpeg) and run again.');
  process.exit(1);
}

const run = (cmd, a) => execFileSync(cmd, a, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

const committed = new Map((existsSync(originals) ? readdirSync(originals) : [])
  .filter((n) => /^SW-\d+\./.test(n) && VIDEO.has(extname(n).toLowerCase()))
  .map((n) => [n.slice(0, n.indexOf('.')), n]));
const listed = existsSync(assets) ? readdirSync(assets).filter((n) => /^SW-\d+$/.test(n)) : [];
const folders = ids.length ? ids : [...new Set([...listed, ...committed.keys()])].sort();
for (const id of folders) {
  const dir = join(assets, id);
  const hasVideo = () => existsSync(dir) && readdirSync(dir).some((n) => VIDEO.has(extname(n).toLowerCase()));
  if (!hasVideo() && committed.has(id)) {
    const name = committed.get(id);
    mkdirSync(dir, { recursive: true });
    copyFileSync(join(originals, name), join(dir, `source${extname(name).toLowerCase()}`));
    console.log(`${id}: copied originals/${name} into assets/${id}/`);
  }
  if (!existsSync(dir)) { console.warn(`${id}: no assets/${id}/ folder`); continue; }
  const videos = readdirSync(dir).filter((n) => VIDEO.has(extname(n).toLowerCase()));
  let source = videos.find((n) => n.toLowerCase().startsWith('source.'));
  if (!source && videos.length === 1) {
    source = `source${extname(videos[0]).toLowerCase()}`;
    renameSync(join(dir, videos[0]), join(dir, source));
    console.log(`${id}: renamed ${videos[0]} → ${source}`);
  }
  if (!source) {
    if (videos.length > 1) console.warn(`${id}: several videos and none named source.*; rename the right one`);
    continue;
  }
  const sheet = join(dir, 'contact-sheet.png');
  if (existsSync(sheet) && !force && !ids.length) continue;

  const input = join(dir, source);
  const duration = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', input]));
  const record = join(root, 'library', 'swipes', `${id}.md`);
  const recordFps = existsSync(record) ? Number(readFileSync(record, 'utf8').match(/^frames_fps:\s*([\d.]+)/m)?.[1]) || null : null;
  const fps = fpsOverride ?? recordFps ?? (duration < 15 ? 2 : duration > 60 ? 0.5 : 1);
  const frames = join(dir, 'frames');
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames);
  run('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-vf', `fps=${fps}`, join(frames, '%03d.png')]);
  const count = readdirSync(frames).length;
  const cols = count > 35 ? 9 : 7;
  const tile = `tile=${cols}x${Math.ceil(count / cols)}`;
  const stamp = "drawtext=text='%{pts\\:hms}':x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.7";
  try {
    run('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-vf', `fps=${fps},scale=300:-1,${stamp},${tile}`, '-frames:v', '1', sheet]);
  } catch {
    // Some ffmpeg builds have no font support for drawtext; fall back to a sheet without timestamps.
    run('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-vf', `fps=${fps},scale=300:-1,${tile}`, '-frames:v', '1', sheet]);
    console.warn(`${id}: contact sheet made without timestamps (ffmpeg has no drawtext font support)`);
  }
  console.log(`${id}: ${duration.toFixed(1)}s, ${count} frames at ${fps} fps, contact sheet written`);
}
