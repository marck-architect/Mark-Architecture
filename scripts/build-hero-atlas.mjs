// One-off asset build: extracts frames from the hero orbit clip and packs
// them into responsive sprite atlas sheets for components/home/VillaOrbitViewer.tsx.
//
// Requires a local ffmpeg on PATH. Not part of `next build` — rerun manually
// only when a source clip changes:
//   node scripts/build-hero-atlas.mjs [path-to-video] [suffix]
//
// suffix (default "") names a second, independent asset set for comparison,
// e.g. suffix "2" -> villa2-lg.webp / villa2-sm.webp / heroAtlasManifest2.json,
// leaving the default set untouched. Video defaults to ../Hero-Video.mp4.

import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const VIDEO_PATH = path.resolve(
  process.argv[2] || path.join(projectRoot, "..", "Hero-Video.mp4"),
);
const SUFFIX = process.argv[3] || "";
const OUT_DIR = path.join(projectRoot, "public", "hero-atlas");
const MANIFEST_PATH = path.join(projectRoot, "data", `heroAtlasManifest${SUFFIX}.json`);

// Rotation and zoom/pan are independent layers (see build spec); these
// constants only describe the atlas geometry, not playback behavior.
const FPS = 12; // 8s clip @ 24fps source -> 96 frames at 12fps
const COLS = 8;
const ROWS = 12;
const FRAME_COUNT = COLS * ROWS; // 96

// No gutter padding: playback uses the exact CSS percentage sprite technique
// (background-size: cols*100% / row*100%, background-position: col/(cols-1)*100%),
// which selects cells by precise math rather than pixel offsets, and bleed risk
// is low here since adjacent frames are near-identical (a smooth continuous pan).
// lg sized for a full-bleed hero background (not a ~900px contained panel):
// 8 cols is the binding dimension against the ~8192px safe sheet ceiling
// (8 * 1024 = 8192 exactly), so 1000 leaves a deliberate safety margin.
const TIERS = {
  lg: { cellW: 1000, cellH: 563 },
  sm: { cellW: 480, cellH: 270 },
};

async function extractFrames(tmpDir) {
  await fs.mkdir(tmpDir, { recursive: true });
  const pattern = path.join(tmpDir, "frame_%03d.png");
  execFileSync(
    "ffmpeg",
    ["-y", "-i", VIDEO_PATH, "-vf", `fps=${FPS}`, "-frames:v", String(FRAME_COUNT), pattern],
    { stdio: "inherit" },
  );
  const files = (await fs.readdir(tmpDir))
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (files.length !== FRAME_COUNT) {
    throw new Error(
      `Expected ${FRAME_COUNT} extracted frames, got ${files.length}. Check clip length/fps.`,
    );
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

  const outPath = path.join(OUT_DIR, `villa${SUFFIX}-${tierKey}.webp`);
  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite(composites)
    .webp({ quality: 66, effort: 6, smartSubsample: true })
    .toFile(outPath);

  const stat = await fs.stat(outPath);
  console.log(
    `[${tierKey}] ${sheetW}x${sheetH} sheet, ${FRAME_COUNT} frames, ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${path.relative(projectRoot, outPath)}`,
  );

  return { cellW, cellH, sheetW, sheetH, src: `/hero-atlas/villa${SUFFIX}-${tierKey}.webp` };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const tmpDir = path.join(os.tmpdir(), `hero-atlas-frames${SUFFIX}`);

  console.log(`Extracting ${FRAME_COUNT} frames @ ${FPS}fps from ${VIDEO_PATH} ...`);
  const framePaths = await extractFrames(tmpDir);

  const manifest = {
    frameCount: FRAME_COUNT,
    cols: COLS,
    rows: ROWS,
    tiers: {},
  };

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
