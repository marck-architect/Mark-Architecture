// One-off: thickens the raster credential icons' hairline strokes via a
// morphological dilate (shift the alpha mask in 8 directions, composite
// with "lighten" == per-pixel max, use that as the new wider alpha). This
// is the raster equivalent of bumping stroke-width on a real vector icon —
// there's no actual SVG source here, only the split PNGs, so this is the
// closest approximation without visible blur.
import sharp from "sharp";
import path from "node:path";

const DIR = path.resolve("public/images/credentials");
const files = [
  "passive-solar.png",
  "bylaw-approved.png",
  "seismic-structural.png",
  "milestone-terms.png",
];

const PASSES = 1; // each pass grows strokes ~1px in 4 directions

async function shiftAlphaMask(width, height, alpha, dx, dy) {
  // Shift the single-channel alpha buffer by (dx, dy), zero-padding.
  const out = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++) {
    const sy = y - dy;
    if (sy < 0 || sy >= height) continue;
    for (let x = 0; x < width; x++) {
      const sx = x - dx;
      if (sx < 0 || sx >= width) continue;
      out[y * width + x] = alpha[sy * width + sx];
    }
  }
  return out;
}

async function processFile(name) {
  const p = path.join(DIR, name);
  let { data, info } = await sharp(p)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let alpha = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) alpha[i] = data[i * channels + 3];

  for (let pass = 0; pass < PASSES; pass++) {
    const shifts = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    let grown = Buffer.from(alpha);
    for (const [dx, dy] of shifts) {
      const shifted = await shiftAlphaMask(width, height, alpha, dx, dy);
      for (let i = 0; i < grown.length; i++) {
        if (shifted[i] > grown[i]) grown[i] = shifted[i];
      }
    }
    alpha = grown;
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    rgba[i * 4] = data[srcIdx];
    rgba[i * 4 + 1] = data[srcIdx + 1];
    rgba[i * 4 + 2] = data[srcIdx + 2];
    rgba[i * 4 + 3] = alpha[i];
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(p);
  console.log(`bolded ${name}: ${width}x${height}`);
}

async function main() {
  for (const f of files) {
    await processFile(f);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
