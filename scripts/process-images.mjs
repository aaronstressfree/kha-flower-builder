import sharp from "sharp";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

const FLOWERS_DIR = "public/flowers";
const STANDS_DIR = "public/stands";

// IMAGE RULES:
// - Always use the clean single-flower cutout (UUID-suffixed URL from Shopify)
// - Never use thumbnail/product photos (flower on stand, with background, pair shots)
// - Never use dimension-annotated images
// - The cutout URL is the `cutout` field in catalog.ts — keep this list in sync
const CDN = "https://cdn.shopify.com/s/files/1/0918/1478/9427/files";
const flowerImages = [
  { id: "aqua-blossoms", url: `${CDN}/Aqua_Blossoms_45a49da4-1aec-4068-aa11-60c54e3b116f.jpg` },
  { id: "blue-anemone", url: `${CDN}/Blue_Anemone_0a6acb8d-99f1-4a64-b5bd-4eed14423b76.jpg` },
  { id: "blossom-peacock-amaryllis", url: `${CDN}/KHA-159_Small_Amaryllis_a20bd175-13e4-449d-91fa-86dedb18b508.jpg` },
  { id: "cafe-au-lait-dahlia", url: `${CDN}/Cafe_Au_Lait_Dahlia_32f1e184-eefe-48a9-976b-2a523fce0905.jpg` },
  { id: "carmine-peony", url: `${CDN}/Carmine_Peony_1e67bf73-39c5-4422-9672-cba05a17e4a6.jpg` },
  { id: "chrysanthemum", url: `${CDN}/Chrysanthemum_LG_KHA-143_697602e2-b84e-4c3d-9341-ef38d3006577.jpg` },
  { id: "classic-fern", url: `${CDN}/Classic_Fern_5feee426-8982-43bc-8b6d-bc0b9fd84ed0.jpg` },
  { id: "cockscomb", url: `${CDN}/Cockscomb_LG_KHA-144_ab42a7f1-3397-454f-b6bf-f74aa02cdc35.jpg` },
  { id: "coral-charm-peony", url: `${CDN}/Coral_Charm_Peony_a2d6f9ec-980c-4088-9ae3-5696f1e331ef.jpg` },
  { id: "cream-peony", url: `${CDN}/Cream_Peony_b4612dc8-5cfa-45cb-b89b-d5aa35dfe2dd.jpg` },
  { id: "cupcake-zinnia", url: `${CDN}/Cupcake_Zinnia_70596c82-2644-433f-859e-9dc6521b7d41.jpg` },
  { id: "curved-peony", url: `${CDN}/Curved_Peony_a2b91aaf-e5f4-4cb2-bcc8-38f89da7db97.jpg` },
  { id: "dahlia-blossoms", url: `${CDN}/Dahlia_Blossoms_6aac4403-a5e1-4486-a97f-f88dedc45400.jpg` },
  { id: "double-zinnia", url: `${CDN}/Double_Zinnia_951ce7cc-6573-4ecf-a5e0-e3ee8e56a69e.jpg` },
  { id: "gerbera-daisy", url: `${CDN}/Gerbera_Daisy_484cc24a-7cfc-4f14-ba64-5da978c45a6b.jpg` },
  { id: "green-leaves", url: `${CDN}/Green_Leaves_076ae0ec-eb81-4ff9-93e8-ccd804926ca0.jpg` },
  { id: "hydrangea-light", url: `${CDN}/Hydrangea_Light_e1649a33-e3a0-4c91-9876-1cf8f3955760.jpg` },
  { id: "hydrangea-royal-blue", url: `${CDN}/Hydrangea_Royal_Blue_db80a37c-84ae-4c35-a2dd-8a86009166ef.jpg` },
  { id: "lavender-peony", url: `${CDN}/Lavender_Peony.jpg` },
  { id: "lotus-flower", url: `${CDN}/Lotus_Flower_LG_KHA-145_c20b38a1-af2f-4577-9ecb-0ea9db2bc54e.jpg` },
  { id: "magnolia", url: `${CDN}/Magnolia_e4fa9f35-8097-4955-895e-d1362b7edc1b.jpg` },
  { id: "magenta-anemone", url: `${CDN}/Magenta_Anemone_740b178e-f826-458b-b9ef-4f513dfd85a1.jpg` },
  { id: "maidenhair-fern", url: `${CDN}/Maidenhair_Fern_057381f8-ab29-49e6-ae53-af5e186f6bb1.jpg` },
  { id: "navy-fleur", url: `${CDN}/Navy_Fleur_62f521ef-39a5-4352-aec6-afc6fcb8e477.jpg` },
  { id: "orange-berries", url: `${CDN}/Orange_Berries_244a947d-3997-4c35-8a8d-b48f721a53f2.jpg` },
  { id: "orange-ranunculus", url: `${CDN}/Orange_Ranunculus_bc4a0d16-d45c-4066-89d4-54cac020688f.jpg` },
  { id: "pale-yellow-iceland-poppy", url: `${CDN}/Pale_Yellow_Iceland_Poppy_LG_KHA-146_5474829d-a24d-47f5-82d6-ee07fb6d3c80.jpg` },
  { id: "passion-flowers", url: `${CDN}/Passion_Flowers_LG_KHA-147_aee156d8-e0bf-4c8a-9886-0341994ef3e3.jpg` },
  { id: "peach-blossoms", url: `${CDN}/Peach_Blossoms_cac4a778-e727-47df-a278-690144068f84.jpg` },
  { id: "peach-cosmos", url: `${CDN}/Peach_Cosmos_063d342c-d67d-4b9f-bde3-bdc646e2436d.jpg` },
  { id: "peach-iceland-poppy", url: `${CDN}/Peach_Iceland_Poppy_53fd4d76-fa55-4e1f-8d3c-57d5ac5621e5.jpg` },
  { id: "periwinkle-blossoms", url: `${CDN}/Periwinkle_Blossoms_712b4e19-31cd-42ff-a347-af73b2228204.jpg` },
  { id: "purple-clematis", url: `${CDN}/Purple_Clemetis_LG_KHA-148_9568095a-c7a6-4aaa-a8a1-ea83eaf5c4a6.jpg` },
  { id: "red-iceland-poppy", url: `${CDN}/Red_Iceland_Poppy_SM_KHA-141_f57c4930-9a3f-40f9-bfcb-2bc93da5c1d8.jpg` },
  { id: "red-star-amaryllis", url: `${CDN}/KHA-151_Red_Star_Amaryllis_bf9ab0d2-d8bd-4f0b-9b9e-fed948471c7a.jpg` },
  { id: "red-zinnia", url: `${CDN}/Red_Zinnia_65f52925-6911-43c7-a1f4-b38962c9db8d.jpg` },
  { id: "ruffle-amaryllis", url: `${CDN}/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg` },
  { id: "red-orange-amaryllis", url: `${CDN}/KHA-153_Red_Orange_Amaryllis_fc696643-b1b4-40c8-a9e5-4288730a34ef.jpg` },
  { id: "white-amaryllis", url: `${CDN}/White_Amaryllis_LG_KHA-157_c8d11664-a12d-4a92-abe3-81e579241b70.jpg` },
  { id: "aphrodite-orchid", url: `${CDN}/KHA-480_Aphrodite_Orchid_SM_29d69fbe-b333-4c83-84d1-972a67eb0ca9.jpg` },
  { id: "foxglove-flower", url: `${CDN}/KHA-515_Foxglove_Flower_SM_1dcb31d5-7a16-4ee4-879a-02bb975600b7.jpg` },
  { id: "vanda-orchid", url: `${CDN}/KHA-495_Vanda_Orchid_LG_48436e70-86af-4243-a5d3-a7253acc9aea.jpg` },
  { id: "thistle-zinnia", url: `${CDN}/Thistle_Zinnia_bc7dcd30-d1d8-4431-9aa2-a4634b9abfb8.jpg` },
  { id: "holly-greenery", url: `${CDN}/Holly_Greenery_LG_KHA-212_21314970-c817-4767-b1cb-5c5c15018d7a.jpg` },
  { id: "brewer-spruce", url: `${CDN}/KHA-188_Brewer_Spruce_d13b16ee-a3b2-4dca-9455-089b009d6b85.jpg` },
  { id: "hellebore-flower", url: `${CDN}/KHA-168_Hellebore_Flower_eecfa4cd-f918-42f4-b9d9-d9b575e4a400.jpg` },
  { id: "cardinal-with-pine-cones", url: `${CDN}/Cardinal_with_Pine_Cones_LG_KHA-210_e2143269-79e9-44f9-8bdf-7306604e50db.jpg` },
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
  // Holiday stands
  { id: "sm-pine-pattern", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/1_Pine_Pattern_Stand-Small_Acrylic_Base_KHA-SO13.jpg" },
  { id: "lg-pinecone-holly", url: "https://cdn.shopify.com/s/files/1/0918/1478/9427/files/1_-_Pinecone_Holly_Large_Stand_KHA-S011_1.jpg" },
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
