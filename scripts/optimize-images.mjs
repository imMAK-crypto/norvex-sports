import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('../public/images/', import.meta.url));
const MAX_WIDTH = 1920;
const QUALITY = 78;

function isSourceImage(name) {
  const ext = extname(name).toLowerCase();
  return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
}

async function processOne(file) {
  const full = join(DIR, file);
  const base = basename(file, extname(file));
  const out = join(DIR, `${base}.webp`);
  const beforeBytes = (await stat(full)).size;

  const meta = await sharp(full).metadata();
  let pipeline = sharp(full).rotate();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: QUALITY, effort: 5 }).toFile(out);
  const afterBytes = (await stat(out)).size;

  if (full !== out) {
    await unlink(full).catch(() => {});
  }

  const pct = Math.round((1 - afterBytes / beforeBytes) * 100);
  console.log(
    `${file.padEnd(50)} ${(beforeBytes / 1024).toFixed(0).padStart(6)} KB -> ${(afterBytes / 1024).toFixed(0).padStart(6)} KB  (-${pct}%)`,
  );
}

const entries = await readdir(DIR);
const targets = entries.filter(isSourceImage);
console.log(`Optimizing ${targets.length} images in ${DIR}\n`);
let beforeTotal = 0;
let afterTotal = 0;
for (const f of targets) {
  const before = (await stat(join(DIR, f))).size;
  beforeTotal += before;
  await processOne(f);
  const after = (await stat(join(DIR, `${basename(f, extname(f))}.webp`))).size;
  afterTotal += after;
}
console.log(
  `\nTotal: ${(beforeTotal / 1024 / 1024).toFixed(2)} MB -> ${(afterTotal / 1024 / 1024).toFixed(2)} MB  (${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller)`,
);
