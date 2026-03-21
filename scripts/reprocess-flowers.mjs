import sharp from "sharp";
import { readdirSync } from "fs";
import { join } from "path";

const FLOWERS_DIR = "public/flowers";
const STANDS_DIR = "public/stands";

async function featherEdges(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Pass 1: More aggressive white removal with wider threshold
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max > 0 ? (max - min) / max : 0;

    if (brightness > 235 && sat < 0.10) {
      data[i + 3] = 0;
    } else if (brightness > 210 && sat < 0.15) {
      const alpha = Math.round(((235 - brightness) / 25) * 255);
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
    // Also catch light gray backgrounds
    if (brightness > 200 && sat < 0.05 && data[i + 3] > 0) {
      const alpha = Math.round(((220 - brightness) / 20) * 255);
      data[i + 3] = Math.min(data[i + 3], Math.max(0, Math.min(255, alpha)));
    }
  }

  // Pass 2: Feather edges — for any pixel that borders a transparent pixel, soften it
  const alphaBuffer = Buffer.from(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * channels;
      if (alphaBuffer[idx + 3] === 0) continue;

      // Check neighbors for transparency
      let transparentNeighbors = 0;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
        const ni = ((y + dy) * width + (x + dx)) * channels;
        if (alphaBuffer[ni + 3] === 0) transparentNeighbors++;
      }

      // Edge pixel — soften alpha
      if (transparentNeighbors >= 2) {
        const currentAlpha = data[idx + 3];
        const factor = 1 - (transparentNeighbors / 12);
        data[idx + 3] = Math.round(currentAlpha * factor);
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  const files = readdirSync(FLOWERS_DIR).filter(f => f.endsWith('.png'));
  console.log(`Re-processing ${files.length} flower images with edge feathering...`);

  for (let i = 0; i < files.length; i++) {
    const path = join(FLOWERS_DIR, files[i]);
    await featherEdges(path, path);
    process.stdout.write(`\r  ${i + 1}/${files.length}`);
  }
  console.log("\n  Done flowers!");

  const standFiles = readdirSync(STANDS_DIR).filter(f => f.endsWith('.png'));
  console.log(`Re-processing ${standFiles.length} stand images...`);
  for (let i = 0; i < standFiles.length; i++) {
    const path = join(STANDS_DIR, standFiles[i]);
    await featherEdges(path, path);
    process.stdout.write(`\r  ${i + 1}/${standFiles.length}`);
  }
  console.log("\n  Done stands!");
}

main();
