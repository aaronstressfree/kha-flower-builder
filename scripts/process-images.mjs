import sharp from "sharp";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

const FLOWERS_DIR = "public/flowers";
const STANDS_DIR = "public/stands";

// All flower cutout image URLs + IDs
const flowerImages = [
  { id: "aqua-blossoms", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Aqua_Blossoms_45a49da4-1aec-4068-aa11-60c54e3b116f.jpg" },
  { id: "blue-anemone", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Blue_Anemone.jpg" },
  { id: "blossom-peacock-amaryllis", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/BlossomPeacockAmaryllis-LargeSingleFlowerKHA-159.jpg" },
  { id: "cafe-au-lait-dahlia", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Cafe_Au_Lait_Dahlia.jpg" },
  { id: "carmine-peony", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Carmine_Peony.jpg" },
  { id: "chrysanthemum", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Chrysanthemum.jpg" },
  { id: "classic-fern", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Classic_Fern_5feee426-8982-43bc-8b6d-bc0b9fd84ed0.jpg" },
  { id: "cockscomb", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Cockscomb.jpg" },
  { id: "coral-charm-peony", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Coral_Charm_Peony_a2d6f9ec-980c-4088-9ae3-5696f1e331ef.jpg" },
  { id: "cream-peony", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Cream_Peony_b4612dc8-5cfa-45cb-b89b-d5aa35dfe2dd.jpg" },
  { id: "cupcake-zinnia", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Cupcake_Zinnia_70596c82-2644-433f-859e-9dc6521b7d41.jpg" },
  { id: "curved-peony", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Curved_Peony_a2b91aaf-e5f4-4cb2-bcc8-38f89da7db97.jpg" },
  { id: "dahlia-blossoms", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Dahlia_Blossoms_6aac4403-a5e1-4486-a97f-f88dedc45400.jpg" },
  { id: "double-zinnia", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Double_Zinnia_951ce7cc-6573-4ecf-a5e0-e3ee8e56a69e.jpg" },
  { id: "gerbera-daisy", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Gerbera_Daisy_484cc24a-7cfc-4f14-ba64-5da978c45a6b.jpg" },
  { id: "green-leaves", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Green_Leaves_076ae0ec-eb81-4ff9-93e8-ccd804926ca0.jpg" },
  { id: "hydrangea-light", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Hydrangea_Light.jpg" },
  { id: "hydrangea-royal-blue", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Hydrangea_Royal_Blue_db80a37c-84ae-4c35-a2dd-8a86009166ef.jpg" },
  { id: "lavender-peony", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Lavender_Peony.jpg" },
  { id: "lotus-flower", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Lotus_Flower.jpg" },
  { id: "magnolia", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Magnolia.jpg" },
  { id: "magenta-anemone", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Magenta_Anemone.jpg" },
  { id: "maidenhair-fern", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Maidenhair_Fern_057381f8-ab29-49e6-ae53-af5e186f6bb1.jpg" },
  { id: "navy-fleur", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Navy_Fleur_62f521ef-39a5-4352-aec6-afc6fcb8e477.jpg" },
  { id: "orange-berries", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Orange_Berries_244a947d-3997-4c35-8a8d-b48f721a53f2.jpg" },
  { id: "orange-ranunculus", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Orange_Ranunculus_bc4a0d16-d45c-4066-89d4-54cac020688f.jpg" },
  { id: "pale-yellow-iceland-poppy", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Pale_Yellow_Iceland_Poppy.jpg" },
  { id: "passion-flowers", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Passion_Flowers.jpg" },
  { id: "peach-blossoms", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Peach_Blossoms_cac4a778-e727-47df-a278-690144068f84.jpg" },
  { id: "peach-cosmos", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Peach_Cosmos_063d342c-d67d-4b9f-bde3-bdc646e2436d.jpg" },
  { id: "peach-iceland-poppy", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Peach_Iceland_Poppy_53fd4d76-fa55-4e1f-8d3c-57d5ac5621e5.jpg" },
  { id: "purple-clematis", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/PurpleClemetis-SmallSingleAcrylicFlower-KHA-140.jpg" },
  { id: "red-iceland-poppy", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Red_Iceland_Poppy.jpg" },
  { id: "red-star-amaryllis", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/RedStarAmaryllis-LargeAcrylicSingleFlowerKHA-151.jpg" },
  { id: "red-zinnia", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Red_Zinnia_65f52925-6911-43c7-a1f4-b38962c9db8d.jpg" },
  { id: "ruffle-amaryllis", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg" },
  { id: "scarlet-mauve-peony", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/scarlet_mauve_peony_acrylic_pair.jpg" },
  { id: "small-iceland-poppy", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/small_iceland_poppy_acrylic_pair.jpg" },
  { id: "sonic-bloom-dahlia", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/sonic_bloom_dahlia_acrylic_pair.jpg" },
  { id: "tulips", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/Tulips_acrylic_pair.jpg" },
  { id: "white-amaryllis", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/5201097.jpg" },
];

const standImages = [
  { id: "triple-green-lotus", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S003_Triple_Stand_Green_Lotus.jpg" },
  { id: "triple-clear", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S007_Triple_Stand.jpg" },
  { id: "grasses-double", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S008_Double_Stand.jpg" },
  { id: "clover-moss-double", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-548_Double_Stand_Pattern_Clover_and_Moss_8b0fac9d-ff2a-4562-ab41-ba62db36815a.jpg" },
  { id: "lg-leaf", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S002_Single_Stand_LG_Leaf.jpg" },
  { id: "lg-lotus", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S004_Single_Stand_LG_Lotus.jpg" },
  { id: "sm-clear", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S005_Single_Stand_SM.jpg" },
  { id: "sm-spiral-vine", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/KHA-S001_Single_Stand_SM_Spiral_Vine.jpg" },
];

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function removeWhiteBackground(inputBuffer, outputPath) {
  // Resize to reasonable size first (max 800px)
  const resized = await sharp(inputBuffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;
  const { width, height, channels } = info;

  // Remove white/near-white pixels
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate "whiteness" — how close to pure white
    const brightness = (r + g + b) / 3;
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;

    if (brightness > 240 && saturation < 0.08) {
      // Pure white — fully transparent
      data[i + 3] = 0;
    } else if (brightness > 220 && saturation < 0.12) {
      // Near-white — partial transparency for smooth edges
      const alpha = Math.round(((240 - brightness) / 20) * 255);
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
    // Everything else keeps full opacity
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function processStandImage(inputBuffer, outputPath) {
  // Same white removal but keep more detail for stands
  const resized = await sharp(inputBuffer)
    .resize(600, 600, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

    if (brightness > 235 && sat < 0.06) {
      data[i + 3] = 0;
    } else if (brightness > 215 && sat < 0.10) {
      const alpha = Math.round(((235 - brightness) / 20) * 255);
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  console.log("Processing flower images...");
  let done = 0;
  for (const { id, url } of flowerImages) {
    const outPath = join(FLOWERS_DIR, `${id}.png`);
    if (existsSync(outPath)) { done++; continue; }
    try {
      const buf = await downloadImage(url);
      await removeWhiteBackground(buf, outPath);
      done++;
      process.stdout.write(`\r  Flowers: ${done}/${flowerImages.length}`);
    } catch (err) {
      console.error(`\n  Failed: ${id}: ${err.message}`);
    }
  }
  console.log(`\n  Done: ${done}/${flowerImages.length} flowers`);

  console.log("Processing stand images...");
  done = 0;
  for (const { id, url } of standImages) {
    const outPath = join(STANDS_DIR, `${id}.png`);
    if (existsSync(outPath)) { done++; continue; }
    try {
      const buf = await downloadImage(url);
      await processStandImage(buf, outPath);
      done++;
      process.stdout.write(`\r  Stands: ${done}/${standImages.length}`);
    } catch (err) {
      console.error(`\n  Failed: ${id}: ${err.message}`);
    }
  }
  console.log(`\n  Done: ${done}/${standImages.length} stands`);
  console.log("All done!");
}

main();
