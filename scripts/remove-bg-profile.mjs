// One-off asset processing: the source portrait's studio backdrop is a
// clean, uniform near-black. Rather than faking a "blended" look with CSS
// masks/gradients on top of the image, this actually cuts the flat backdrop
// out of the asset itself via a border-flood-fill (only pixels connected to
// the frame edge through background-like color are removed, so the dark
// suit/hair — which touch the frame edge in places but are a visibly
// different color from the pure-black backdrop — are left intact), then
// feathers the resulting alpha mask for a soft, anti-aliased edge.
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("public/images/profile.jpeg");
const OUT = path.resolve("public/images/profile-cutout.png");

const BG_THRESHOLD = 6; // max(R,G,B) <= this counts as "background-like"

async function main() {
  const image = sharp(SRC).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBgLike = (idx) =>
    data[idx] <= BG_THRESHOLD &&
    data[idx + 1] <= BG_THRESHOLD &&
    data[idx + 2] <= BG_THRESHOLD;

  const bgMask = new Uint8Array(width * height); // 1 = background
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  const pushIfBg = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    const idx = p * channels;
    if (isBgLike(idx)) {
      bgMask[p] = 1;
      queue[qTail++] = p;
    }
  };

  // Seed the flood fill from every border pixel.
  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  while (qHead < qTail) {
    const p = queue[qHead++];
    const x = p % width;
    const y = (p / width) | 0;
    pushIfBg(x + 1, y);
    pushIfBg(x - 1, y);
    pushIfBg(x, y + 1);
    pushIfBg(x, y - 1);
  }

  let removed = 0;
  const alpha = Buffer.alloc(width * height);
  for (let p = 0; p < width * height; p++) {
    if (bgMask[p]) {
      alpha[p] = 0;
      removed++;
    } else {
      alpha[p] = 255;
    }
  }
  console.log(
    `Background pixels removed: ${removed} / ${width * height} (${((removed / (width * height)) * 100).toFixed(1)}%)`,
  );

  // Feather the hard flood-fill edge so the cutout isn't jagged.
  // extractChannel(0) is required: sharp silently promotes a 1-channel raw
  // buffer to 3 channels internally during blur(), so without it the
  // output buffer is 3x the expected size and every byte read afterwards
  // is misaligned.
  const feathered = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .blur(2.2)
    .extractChannel(0)
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const srcIdx = p * channels;
    const dstIdx = p * 4;
    rgba[dstIdx] = data[srcIdx];
    rgba[dstIdx + 1] = data[srcIdx + 1];
    rgba[dstIdx + 2] = data[srcIdx + 2];
    rgba[dstIdx + 3] = feathered[p];
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  console.log("Wrote", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
