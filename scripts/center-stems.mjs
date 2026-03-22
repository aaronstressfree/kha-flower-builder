import sharp from "sharp";
import { readdirSync } from "fs";

const DIR = "public/flowers";

async function centerStem(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Find stem center: average x of non-transparent pixels in bottom 15%
  const bottomStart = Math.floor(height * 0.85);
  let sumX = 0, count = 0;
  for (let y = bottomStart; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (data[idx + 3] > 100) {
        sumX += x;
        count++;
      }
    }
  }

  if (count === 0) return; // No stem found

  const stemCenter = Math.round(sumX / count);
  const imageCenter = Math.round(width / 2);
  const shift = imageCenter - stemCenter; // positive = shift right

  if (Math.abs(shift) < 10) return; // Already centered enough

  // Create new buffer with shifted pixels
  const newData = Buffer.alloc(data.length, 0); // All transparent

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const newX = x + shift;
      if (newX >= 0 && newX < width) {
        const dstIdx = (y * width + newX) * channels;
        newData[dstIdx] = data[srcIdx];
        newData[dstIdx + 1] = data[srcIdx + 1];
        newData[dstIdx + 2] = data[srcIdx + 2];
        newData[dstIdx + 3] = data[srcIdx + 3];
      }
    }
  }

  await sharp(newData, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(filePath);

  return shift;
}

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".png"));
  console.log(`Centering stems for ${files.length} flowers...`);

  for (let i = 0; i < files.length; i++) {
    const path = `${DIR}/${files[i]}`;
    const shift = await centerStem(path);
    const name = files[i].replace(".png", "");
    if (shift) {
      console.log(`  ${name}: shifted ${shift > 0 ? "right" : "left"} ${Math.abs(shift)}px`);
    }
  }
  console.log("Done!");
}

main();
