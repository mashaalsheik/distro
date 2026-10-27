#!/usr/bin/env node
// One-time local setup: point assets/ at the distro-assets folder in Google Drive for Desktop,
// so everything saved into assets/ syncs to Drive.
// Usage: node tools/setup-local.mjs [--drive "<path to My Drive or distro-assets>"]
import { existsSync, lstatSync, readdirSync, renameSync, rmSync, symlinkSync, mkdirSync, readlinkSync, cpSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { homedir, platform } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
const FOLDER = 'distro-assets';

function candidates() {
  const found = [];
  const cloud = join(homedir(), 'Library', 'CloudStorage'); // macOS
  if (existsSync(cloud)) {
    for (const name of readdirSync(cloud)) {
      if (name.startsWith('GoogleDrive-')) found.push(join(cloud, name, 'My Drive'));
    }
  }
  if (platform() === 'win32') {
    for (const letter of 'DEFGHIJKLMNOPQRSTUVWXYZ') found.push(`${letter}:\\My Drive`);
    found.push(join(homedir(), 'Google Drive', 'My Drive'), join(homedir(), 'My Drive'));
  }
  found.push(join(homedir(), 'Google Drive', 'My Drive'), join(homedir(), 'Google Drive'));
  return found.map((p) => join(p, FOLDER)).filter((p) => existsSync(p));
}

const flag = process.argv.indexOf('--drive');
let target;
if (flag !== -1) {
  const given = process.argv[flag + 1];
  if (!given) { console.error('--drive needs a path'); process.exit(1); }
  target = basename(given) === FOLDER ? given : join(given, FOLDER);
  if (!existsSync(target)) { console.error(`Not found: ${target}`); process.exit(1); }
} else {
  const found = candidates();
  if (found.length === 0) {
    console.error(`Couldn't find a "${FOLDER}" folder in Google Drive for Desktop.
Install Drive for Desktop (https://www.google.com/drive/download/), sign in with the account that owns ${FOLDER},
wait for it to appear, then run again, or pass the path: node tools/setup-local.mjs --drive "<path to My Drive>"`);
    process.exit(1);
  }
  if (found.length > 1) {
    console.error(`Found more than one "${FOLDER}":\n${found.map((f) => `  ${f}`).join('\n')}\nPick one with --drive.`);
    process.exit(1);
  }
  target = found[0];
}

if (existsSync(assets) && lstatSync(assets).isSymbolicLink()) {
  console.log(`assets/ already links to ${readlinkSync(assets)}`);
  process.exit(0);
}

// Move anything already collected locally into Drive, without overwriting what's there.
if (existsSync(assets)) {
  for (const name of readdirSync(assets)) {
    const from = join(assets, name);
    const to = join(target, name);
    if (name === 'README.md' || name === '.DS_Store') continue;
    if (existsSync(to)) {
      if (lstatSync(from).isDirectory()) {
        cpSync(from, to, { recursive: true, force: false, errorOnExist: false });
      } else {
        console.warn(`  skipped ${name}: already in Drive`);
        continue;
      }
      rmSync(from, { recursive: true });
    } else {
      renameSync(from, to);
    }
    console.log(`  moved ${name} → Drive`);
  }
  rmSync(assets, { recursive: true });
}

mkdirSync(join(target, 'inbox'), { recursive: true });
symlinkSync(target, assets, platform() === 'win32' ? 'junction' : 'dir');
console.log(`assets/ → ${target}
Files saved in assets/ now sync to Drive. Drop new references in assets/inbox/ (Drive: ${FOLDER}/inbox).`);
