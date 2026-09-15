// One-off asset build for the scroll-scrubbed balcony push-in sequence
// (components/home/BalconyZoomReveal.tsx). Separate from build-hero-atlas.mjs
// on purpose: this source is a linear dolly push, not an orbit, and scroll-
// scrubbing benefits from a higher frame count than drag-driven rotation.
//
// Requires a local ffmpeg on PATH. Not part of `next build` — rerun manually
// only if the source clip changes:
//   node scripts/build-zoom-atlas.mjs [path-to-video]

import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const VIDEO_PATH = path.resolve(
  process.argv[2] || path.join(projectRoot, "..", "zoomin-herovideo.mp4"),
);
const OUT_DIR = path.join(projectRoot, "public", "hero-atlas");
const MANIFEST_PATH = path.join(projectRoot, "data", "balconyZoomManifest.json");

const FPS = 15; // 8s clip @ 24fps source -> 120 frames at 15fps
const COLS = 10;
const ROWS = 12;
const FRAME_COUNT = COLS * ROWS; // 120

const TIERS = {
  lg: { cellW: 800, cellH: 450 },
  sm: { cellW: 400, cellH: 225 },
};

async function extractFrames(tmpDir) {
  await fs.mkdir(tmpDir, { recursive: true });
  const pattern = path.join(tmpDir, "frame_%03d.png");
  execFileSync(
    "ffmpeg",
    ["-y", "-i", VIDEO_PATH, "-vf", `fps=${FPS}`, "-frames:v", String(FRAME_COUNT), pattern],
    { stdio: "inherit" },
  );
  const files = (await fs.readdir(tmpDir)).filter((f) => f.endsWith(".png")).sort();
  if (files.length !== FRAME_COUNT) {
    throw new Error(`Expected ${FRAME_COUNT} extracted frames, got ${files.length}.`);
  }
  return files.map((f) => path.join(tmpDir, f));
}

async function buildTier(tierKey, { cellW, cellH }, framePaths) {
  const sheetW = cellW * COLS;
  const sheetH = cellH * ROWS;

  const composites = await Promise.all(
    framePaths.map(async (framePath, i) => {
      const tileBuffer = await sharp(framePath)
        .resize(cellW, cellH, { fit: "cover", position: "centre" })
        .toBuffer();
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      return { input: tileBuffer, left: col * cellW, top: row * cellH };
    }),
  );

  const outPath = path.join(OUT_DIR, `balcony-${tierKey}.webp`);
  await sharp({
    create: { width: sheetW, height: sheetH, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(composites)
    .webp({ quality: 68, effort: 6, smartSubsample: true })
    .toFile(outPath);

  const stat = await fs.stat(outPath);
  console.log(
    `[${tierKey}] ${sheetW}x${sheetH} sheet, ${FRAME_COUNT} frames, ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${path.relative(projectRoot, outPath)}`,
  );

  return { cellW, cellH, sheetW, sheetH, src: `/hero-atlas/balcony-${tierKey}.webp` };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const tmpDir = path.join(os.tmpdir(), "balcony-zoom-frames");

  console.log(`Extracting ${FRAME_COUNT} frames @ ${FPS}fps from ${VIDEO_PATH} ...`);
  const framePaths = await extractFrames(tmpDir);

  const manifest = { frameCount: FRAME_COUNT, cols: COLS, rows: ROWS, tiers: {} };
  for (const [tierKey, dims] of Object.entries(TIERS)) {
    manifest.tiers[tierKey] = await buildTier(tierKey, dims, framePaths);
  }

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest -> ${path.relative(projectRoot, MANIFEST_PATH)}`);

  await fs.rm(tmpDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
