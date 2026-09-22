// One-off: splits public/images/svgs-home.png (a 2x2 icon sprite, already
// alpha-transparent) into 4 individual PNGs for the homepage credentials
// row. Order (row-major, matches the reference layout):
//   0 top-left: sun + window        -> Passive Solar & Climate Control
//   1 top-right: shield + approved  -> PDA, CDA & KDA Bylaw Mastery
//   2 bottom-left: building on ground -> Seismic & Structural Safety
//   3 bottom-right: shield + chart  -> 50% Advance Milestone Terms
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("public/images/svgs-home.png");
const OUT_DIR = path.resolve("public/images/credentials");

const names = [
  "passive-solar.png",
  "bylaw-approved.png",
  "seismic-structural.png",
  "milestone-terms.png",
];

async function main() {
  const { width, height } = await sharp(SRC).metadata();
  const cellW = Math.floor(width / 2);
  const cellH = Math.floor(height / 2);
  console.log(`source: ${width}x${height}, cell: ${cellW}x${cellH}`);

  const cells = [
    { left: 0, top: 0 },
    { left: width - cellW, top: 0 },
    { left: 0, top: height - cellH },
    { left: width - cellW, top: height - cellH },
  ];

  for (let i = 0; i < cells.length; i++) {
    const { left, top } = cells[i];
    console.log(`cell ${i}: left=${left} top=${top} w=${cellW} h=${cellH}`);
    const outPath = path.join(OUT_DIR, names[i]);
    await sharp(SRC)
      .extract({ left, top, width: cellW, height: cellH })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`${names[i]}: ${meta.width}x${meta.height}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
