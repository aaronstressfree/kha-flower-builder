import sharp from "sharp";
import { join } from "path";

const FLOWERS_DIR = "public/flowers";

// Animals that need edge cleanup
const ANIMALS = [
  "bluebird-of-happiness",
  "spring-cardinal",
  "hummingbird",
  "indigo-bunting-with-clover",
  "running-rabbit",
  "chickadee-and-forget-me-nots",
  "purple-poppy-mallow-warbler",
  "chipping-sparrow-with-daffodils",
  "robin-and-nasturtiums",
];

async function cleanEdges(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Pass 1: Remove white/near-white/light-grey pixels
  // More aggressive thresholds than the flower version
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max > 0 ? (max - min) / max : 0;

    if (data[i + 3] === 0) continue;

    // Pure white/near-white
    if (brightness > 220 && sat < 0.15) {
      data[i + 3] = 0;
    }
    // Light grey with low saturation
    else if (brightness > 190 && sat < 0.12) {
      const alpha = Math.round(((220 - brightness) / 30) * 255);
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
  }

  // Pass 2-5: Edge erosion (4 passes for aggressive cleanup)
  for (let pass = 0; pass < 4; pass++) {
    const snapshot = Buffer.from(data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * channels;
        if (snapshot[idx + 3] === 0) continue;

        // Count transparent neighbors (8-connected)
        let transparentCount = 0;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
          const ni = ((y + dy) * width + (x + dx)) * channels;
          if (ni >= 0 && ni < snapshot.length && snapshot[ni + 3] < 20) transparentCount++;
        }

        if (transparentCount >= 3) {
          // Mostly surrounded by transparent — likely fringe
          data[idx + 3] = Math.round(data[idx + 3] * 0.1);
        } else if (transparentCount >= 2) {
          data[idx + 3] = Math.round(data[idx + 3] * 0.3);
        } else if (transparentCount >= 1) {
          // Single transparent neighbor — soften edge
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          const brightness = (r + g + b) / 3;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max > 0 ? (max - min) / max : 0;
          // Only erode if this pixel is light/unsaturated (likely background bleed)
          if (brightness > 200 && sat < 0.2) {
            data[idx + 3] = Math.round(data[idx + 3] * 0.5);
          }
        }
      }
    }
  }

  // Pass 6: Remove isolated semi-transparent pixels
  const final = Buffer.from(data);
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const idx = (y * width + x) * channels;
      if (final[idx + 3] > 0 && final[idx + 3] < 50) {
        let lowNeighbors = 0;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const ni = ((y + dy) * width + (x + dx)) * channels;
          if (final[ni + 3] < 50) lowNeighbors++;
        }
        if (lowNeighbors >= 2) data[idx + 3] = 0;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(inputPath + ".tmp");

  const { renameSync } = await import("fs");
  renameSync(inputPath + ".tmp", inputPath);
}

async function main() {
  console.log(`Cleaning edges on ${ANIMALS.length} animal images...`);
  for (let i = 0; i < ANIMALS.length; i++) {
    const path = join(FLOWERS_DIR, `${ANIMALS[i]}.png`);
    await cleanEdges(path);
    console.log(`  ${i + 1}/${ANIMALS.length}: ${ANIMALS[i]}`);
  }
  console.log("Done!");
}

main();
