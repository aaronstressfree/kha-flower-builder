import sharp from "sharp";

const CDN = "https://cdn.shopify.com/s/files/1/0918/1478/9427/files";

const flowers = [
  { id: "aqua-blossoms", url: `${CDN}/Aqua_Blossoms_45a49da4-1aec-4068-aa11-60c54e3b116f.jpg` },
  { id: "classic-fern", url: `${CDN}/Classic_Fern_5feee426-8982-43bc-8b6d-bc0b9fd84ed0.jpg` },
  { id: "coral-charm-peony", url: `${CDN}/Coral_Charm_Peony_a2d6f9ec-980c-4088-9ae3-5696f1e331ef.jpg` },
  { id: "cream-peony", url: `${CDN}/Cream_Peony_b4612dc8-5cfa-45cb-b89b-d5aa35dfe2dd.jpg` },
  { id: "cupcake-zinnia", url: `${CDN}/Cupcake_Zinnia_70596c82-2644-433f-859e-9dc6521b7d41.jpg` },
  { id: "curved-peony", url: `${CDN}/Curved_Peony_a2b91aaf-e5f4-4cb2-bcc8-38f89da7db97.jpg` },
  { id: "dahlia-blossoms", url: `${CDN}/Dahlia_Blossoms_6aac4403-a5e1-4486-a97f-f88dedc45400.jpg` },
  { id: "double-zinnia", url: `${CDN}/Double_Zinnia_951ce7cc-6573-4ecf-a5e0-e3ee8e56a69e.jpg` },
  { id: "gerbera-daisy", url: `${CDN}/Gerbera_Daisy_484cc24a-7cfc-4f14-ba64-5da978c45a6b.jpg` },
  { id: "green-leaves", url: `${CDN}/Green_Leaves_076ae0ec-eb81-4ff9-93e8-ccd804926ca0.jpg` },
  { id: "hydrangea-royal-blue", url: `${CDN}/Hydrangea_Royal_Blue_db80a37c-84ae-4c35-a2dd-8a86009166ef.jpg` },
  { id: "lavender-peony", url: `${CDN}/Lavender_Peony.jpg` },
  { id: "maidenhair-fern", url: `${CDN}/Maidenhair_Fern_057381f8-ab29-49e6-ae53-af5e186f6bb1.jpg` },
  { id: "navy-fleur", url: `${CDN}/Navy_Fleur_62f521ef-39a5-4352-aec6-afc6fcb8e477.jpg` },
  { id: "orange-berries", url: `${CDN}/Orange_Berries_244a947d-3997-4c35-8a8d-b48f721a53f2.jpg` },
  { id: "orange-ranunculus", url: `${CDN}/Orange_Ranunculus_bc4a0d16-d45c-4066-89d4-54cac020688f.jpg` },
  { id: "peach-blossoms", url: `${CDN}/Peach_Blossoms_cac4a778-e727-47df-a278-690144068f84.jpg` },
  { id: "peach-cosmos", url: `${CDN}/Peach_Cosmos_063d342c-d67d-4b9f-bde3-bdc646e2436d.jpg` },
  { id: "peach-iceland-poppy", url: `${CDN}/Peach_Iceland_Poppy_53fd4d76-fa55-4e1f-8d3c-57d5ac5621e5.jpg` },
  { id: "red-zinnia", url: `${CDN}/Red_Zinnia_65f52925-6911-43c7-a1f4-b38962c9db8d.jpg` },
  { id: "ruffle-amaryllis", url: `${CDN}/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg` },
  // Holiday collection
  { id: "red-orange-amaryllis", url: `${CDN}/KHA-153_Red_Orange_Amaryllis_fc696643-b1b4-40c8-a9e5-4288730a34ef.jpg` },
  { id: "red-star-amaryllis", url: `${CDN}/KHA-151_Red_Star_Amaryllis_bf9ab0d2-d8bd-4f0b-9b9e-fed948471c7a.jpg` },
  { id: "white-amaryllis", url: `${CDN}/White_Amaryllis_LG_KHA-157_c8d11664-a12d-4a92-abe3-81e579241b70.jpg` },
  { id: "blossom-peacock-amaryllis", url: `${CDN}/KHA-159_Small_Amaryllis_a20bd175-13e4-449d-91fa-86dedb18b508.jpg` },
  { id: "holly-greenery", url: `${CDN}/Holly_Greenery_LG_KHA-212_21314970-c817-4767-b1cb-5c5c15018d7a.jpg` },
  { id: "brewer-spruce", url: `${CDN}/KHA-188_Brewer_Spruce_d13b16ee-a3b2-4dca-9455-089b009d6b85.jpg` },
  { id: "hellebore-flower", url: `${CDN}/KHA-168_Hellebore_Flower_eecfa4cd-f918-42f4-b9d9-d9b575e4a400.jpg` },
  { id: "cardinal-with-pine-cones", url: `${CDN}/Cardinal_with_Pine_Cones_LG_KHA-210_e2143269-79e9-44f9-8bdf-7306604e50db.jpg` },
  // Botanical/Florals — new additions
  { id: "strawflower", url: `${CDN}/5201064.jpg` },
  { id: "tall-magenta-peony", url: `${CDN}/Tall_Magenta_Peony_LG_KHA-071.jpg` },
  { id: "foxglove-flower", url: `${CDN}/KHA-515_Foxglove_Flower_SM_1dcb31d5-7a16-4ee4-879a-02bb975600b7.jpg` },
  { id: "striped-anemone", url: `${CDN}/Striped_Anemone_LG_KHA-065.jpg` },
  { id: "vanda-orchid", url: `${CDN}/KHA-495_Vanda_Orchid_LG_48436e70-86af-4243-a5d3-a7253acc9aea.jpg` },
  { id: "thistle-zinnia", url: `${CDN}/Thistle_Zinnia_bc7dcd30-d1d8-4431-9aa2-a4634b9abfb8.jpg` },
  { id: "yellow-ranunculus", url: `${CDN}/Yellow_Ranunculus_LG_KHA-077.jpg` },
];

function isBackground(r, g, b) {
  const brightness = (r + g + b) / 3;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx > 0 ? (mx - mn) / mx : 0;
  return brightness > 210 && sat < 0.15;
}

function isMaybeBackground(r, g, b) {
  const brightness = (r + g + b) / 3;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx > 0 ? (mx - mn) / mx : 0;
  return brightness > 185 && sat < 0.18;
}

async function processFlower(id, url) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());

  const { data, info } = await sharp(buf)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // --- Flood-fill from edges ---
  // Only remove background pixels that are connected to the image border.
  // This preserves light-colored petals in the flower interior.
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed the queue with all border pixels that look like background
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = (y * width + x) * channels;
      if (isMaybeBackground(data[idx], data[idx + 1], data[idx + 2])) {
        queue.push(y * width + x);
        visited[y * width + x] = 1;
      }
    }
  }
  for (let y = 1; y < height - 1; y++) {
    for (const x of [0, width - 1]) {
      const idx = (y * width + x) * channels;
      if (isMaybeBackground(data[idx], data[idx + 1], data[idx + 2])) {
        queue.push(y * width + x);
        visited[y * width + x] = 1;
      }
    }
  }

  // BFS flood fill — only spread to adjacent background-like pixels
  while (queue.length > 0) {
    const pos = queue.shift();
    const px = pos % width;
    const py = (pos - px) / width;
    const idx = pos * channels;

    // Mark as transparent
    data[idx + 3] = 0;

    // Spread to 8-connected neighbors
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const npos = ny * width + nx;
      if (visited[npos]) continue;
      const ni = npos * channels;
      if (isMaybeBackground(data[ni], data[ni + 1], data[ni + 2])) {
        visited[npos] = 1;
        queue.push(npos);
      }
    }
  }

  // --- Gentle edge softening (1 pass) ---
  // Soften pixels right at the boundary between flower and removed background
  // to avoid hard aliased edges, but do NOT erode into the flower.
  const snap = Buffer.from(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * channels;
      if (snap[idx + 3] === 0) continue;

      let transparent = 0;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const ni = ((y + dy) * width + (x + dx)) * channels;
        if (snap[ni + 3] === 0) transparent++;
      }

      // Only soften pixels directly adjacent to the background
      if (transparent >= 3) {
        // Mostly surrounded by background — likely a stray edge pixel
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (isBackground(r, g, b)) {
          data[idx + 3] = 0;
        } else {
          data[idx + 3] = Math.round(data[idx + 3] * 0.3);
        }
      } else if (transparent >= 2) {
        data[idx + 3] = Math.round(data[idx + 3] * 0.7);
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer()
    .then(b => sharp(b).trim().png({ compressionLevel: 9 }).toFile(`public/flowers/${id}.png`));
}

async function main() {
  console.log(`Processing ${flowers.length} flowers from source...`);
  for (let i = 0; i < flowers.length; i++) {
    await processFlower(flowers[i].id, flowers[i].url);
    process.stdout.write(`\r  ${i + 1}/${flowers.length}`);
  }
  console.log("\n  Done!");
}

main();
