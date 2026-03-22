import sharp from "sharp";
import { readdirSync } from "fs";

const DIR = "public/flowers";
const TARGET = 800;

async function normalize(filePath) {
  const meta = await sharp(filePath).metadata();
  const { width, height } = meta;

  // Already square-ish (within 10%), skip
  if (Math.abs(width - height) < TARGET * 0.1) return null;

  // Determine the larger dimension and pad the smaller
  const maxDim = Math.max(width, height);

  // Calculate padding to center the image in a square canvas
  const newWidth = maxDim;
  const newHeight = maxDim;
  const left = Math.round((newWidth - width) / 2);
  const top = 0; // Keep flowers anchored to top (bloom), pad bottom
  const bottom = newHeight - height;
  const right = newWidth - width - left;

  await sharp(filePath)
    .extend({
      top,
      bottom,
      left,
      right,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(TARGET, TARGET, { fit: "inside", withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(filePath + ".tmp");

  // Replace original
  const { renameSync } = await import("fs");
  renameSync(filePath + ".tmp", filePath);

  return { width, height, padded: `${newWidth}x${newHeight}` };
}

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".png"));
  console.log(`Normalizing ${files.length} flowers to ${TARGET}x${TARGET}...`);

  for (const file of files) {
    const path = `${DIR}/${file}`;
    const result = await normalize(path);
    const name = file.replace(".png", "");
    if (result) {
      console.log(`  ${name}: ${result.width}x${result.height} → ${result.padded}`);
    }
  }
  console.log("Done!");
}

main();
