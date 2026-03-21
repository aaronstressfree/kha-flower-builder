import sharp from "sharp";
import { readdirSync } from "fs";
import { join } from "path";

const FLOWERS_DIR = "public/flowers";

async function cleanEdges(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Pass 1: Remove white, near-white, light grays, and blue-gray backgrounds
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max > 0 ? (max - min) / max : 0;

    if (brightness > 225 && sat < 0.15) {
      data[i + 3] = 0;
    } else if (brightness > 195 && sat < 0.12) {
      const alpha = Math.round(((225 - brightness) / 30) * 255);
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
  }

  // Pass 2-4: Erode edges multiple times for clean cutout
  for (let pass = 0; pass < 3; pass++) {
    const snapshot = Buffer.from(data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * channels;
        if (snapshot[idx + 3] === 0) continue;

        let transparentCount = 0;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
          const ni = ((y + dy) * width + (x + dx)) * channels;
          if (ni >= 0 && ni < snapshot.length && snapshot[ni + 3] < 20) transparentCount++;
        }

        if (transparentCount >= 3) {
          data[idx + 3] = Math.round(data[idx + 3] * 0.15);
        } else if (transparentCount >= 2) {
          data[idx + 3] = Math.round(data[idx + 3] * 0.4);
        } else if (transparentCount >= 1) {
          data[idx + 3] = Math.round(data[idx + 3] * 0.75);
        }
      }
    }
  }

  // Pass 5: Remove any remaining near-edge artifacts (isolated semi-transparent pixels)
  const final = Buffer.from(data);
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const idx = (y * width + x) * channels;
      if (final[idx + 3] > 0 && final[idx + 3] < 60) {
        // Check if this is an isolated low-alpha pixel
        let lowNeighbors = 0;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const ni = ((y + dy) * width + (x + dx)) * channels;
          if (final[ni + 3] < 60) lowNeighbors++;
        }
        if (lowNeighbors >= 2) data[idx + 3] = 0;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  const files = readdirSync(FLOWERS_DIR).filter(f => f.endsWith('.png'));
  console.log(`Deep-cleaning ${files.length} flower images...`);
  for (let i = 0; i < files.length; i++) {
    const path = join(FLOWERS_DIR, files[i]);
    await cleanEdges(path, path);
    process.stdout.write(`\r  ${i + 1}/${files.length}`);
  }
  console.log("\n  Done!");
}

main();
