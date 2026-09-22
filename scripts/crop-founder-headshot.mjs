// The founder photo was a near-full-torso shot (960x1280), which fights
// object-fit: cover in a container sized to match the text column's
// natural height — either too much of the suit shows, or the crop lands at
// an arbitrary, awkward stopping point. This re-crops it to a proper
// head-and-shoulders portrait (4:5, attention/saliency-based framing so it
// centers on the face) and overwrites the file in place, since every
// reference to the founder's photo across the site (About page, OG image,
// JSON-LD) points at this same static path.
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const SRC = path.resolve("public/images/profile.jpeg");
const BACKUP = path.resolve("public/images/profile-original-fullbody.jpeg");
const CROP_WIDTH = 900;
const CROP_HEIGHT = 1125; // 4:5, head-and-shoulders portrait ratio

async function main() {
  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(SRC, BACKUP);
    console.log("Backed up original to", BACKUP);
  }

  await sharp(BACKUP)
    .resize(CROP_WIDTH, CROP_HEIGHT, {
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .jpeg({ quality: 90 })
    .toFile(SRC);

  console.log(`Wrote ${SRC} at ${CROP_WIDTH}x${CROP_HEIGHT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
