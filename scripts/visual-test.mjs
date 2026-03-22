/**
 * Comprehensive Visual Test Suite
 *
 * Tests every stand type × flower shape profile × screen size.
 * Focuses on spacing, centering, and layout quality.
 *
 * Flower shape profiles:
 *   standard  — coral-charm-peony (symmetric, round)
 *   thin      — peach-cosmos (tall, narrow)
 *   asymmetric — aqua-blossoms (leans to one side)
 *   wide      — hydrangea-royal-blue (bushy, fills width)
 *   foliage   — maidenhair-fern (organic, irregular spread)
 *   tall      — cream-peony (elongated vertical)
 *   spiky     — classic-fern (narrow, directional)
 */

import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:5173";
const OUT_DIR = join(import.meta.dirname, "..", "test-screenshots", "visual-audit");

// --- Screen sizes ---
const VIEWPORTS = [
  { name: "desktop-lg", width: 1920, height: 1080 },
  { name: "desktop-md", width: 1440, height: 900 },
  { name: "desktop-sm", width: 1280, height: 720 },
  { name: "tablet-land", width: 1024, height: 768 },
  { name: "tablet-port", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

// --- Stand indices (from standConfigs array) ---
// 0: triple-green-lotus, 1: triple-clear
// 2: grasses-double, 3: clover-moss-double
// 4: lg-leaf, 5: lg-lotus
// 6: sm-clear, 7: sm-spiral-vine
const STANDS = [
  { index: 0, name: "triple-green-lotus", type: "triple", slots: ["back", "frontLeft", "frontRight"] },
  { index: 1, name: "triple-clear", type: "triple", slots: ["back", "frontLeft", "frontRight"] },
  { index: 2, name: "grasses-double", type: "double", slots: ["left", "right"] },
  { index: 3, name: "clover-moss-double", type: "double", slots: ["left", "right"] },
  { index: 4, name: "lg-leaf", type: "single-lg", slots: ["center"] },
  { index: 5, name: "lg-lotus", type: "single-lg", slots: ["center"] },
  { index: 6, name: "sm-clear", type: "single-sm", slots: ["center"] },
  { index: 7, name: "sm-spiral-vine", type: "single-sm", slots: ["center"] },
];

// --- Representative flowers by shape profile ---
const FLOWERS = {
  standard: "Coral Charm Peony",
  thin: "Peach Cosmos",
  asymmetric: "Aqua Blossoms",
  wide: "Hydrangea Royal Blue",
  foliage: "Maidenhair Fern",
  tall: "Cream Peony",
  spiky: "Classic Fern",
};

// --- Test combos per stand type ---
// For single stands: test every flower profile
// For multi-slot stands: test strategic combinations

const SINGLE_COMBOS = [
  { name: "standard", flowers: ["standard"] },
  { name: "thin", flowers: ["thin"] },
  { name: "asymmetric", flowers: ["asymmetric"] },
  { name: "wide", flowers: ["wide"] },
  { name: "foliage", flowers: ["foliage"] },
  { name: "tall", flowers: ["tall"] },
  { name: "spiky", flowers: ["spiky"] },
];

const DOUBLE_COMBOS = [
  // Homogeneous
  { name: "both-standard", flowers: ["standard", "standard"] },
  { name: "both-thin", flowers: ["thin", "thin"] },
  { name: "both-wide", flowers: ["wide", "wide"] },
  { name: "both-asymmetric", flowers: ["asymmetric", "asymmetric"] },
  // Mixed — contrast cases
  { name: "thin-wide", flowers: ["thin", "wide"] },
  { name: "wide-thin", flowers: ["wide", "thin"] },
  { name: "standard-asymmetric", flowers: ["standard", "asymmetric"] },
  { name: "tall-foliage", flowers: ["tall", "foliage"] },
  { name: "asymmetric-thin", flowers: ["asymmetric", "thin"] },
  { name: "foliage-spiky", flowers: ["foliage", "spiky"] },
  { name: "standard-thin", flowers: ["standard", "thin"] },
];

const TRIPLE_COMBOS = [
  // Homogeneous
  { name: "all-standard", flowers: ["standard", "standard", "standard"] },
  { name: "all-thin", flowers: ["thin", "thin", "thin"] },
  { name: "all-wide", flowers: ["wide", "wide", "wide"] },
  { name: "all-asymmetric", flowers: ["asymmetric", "asymmetric", "asymmetric"] },
  // Mixed — stress tests
  { name: "thin-wide-thin", flowers: ["thin", "wide", "thin"] },
  { name: "wide-thin-thin", flowers: ["wide", "thin", "thin"] },
  { name: "standard-asymmetric-foliage", flowers: ["standard", "asymmetric", "foliage"] },
  { name: "tall-thin-wide", flowers: ["tall", "thin", "wide"] },
  { name: "asymmetric-standard-spiky", flowers: ["asymmetric", "standard", "spiky"] },
  { name: "foliage-foliage-foliage", flowers: ["foliage", "foliage", "foliage"] },
  { name: "wide-asymmetric-standard", flowers: ["wide", "asymmetric", "standard"] },
  { name: "spiky-thin-asymmetric", flowers: ["spiky", "thin", "asymmetric"] },
  // Partially filled
  { name: "back-only-wide", flowers: ["wide", null, null] },
  { name: "fronts-only-thin", flowers: [null, "thin", "thin"] },
];

function getCombos(standType) {
  switch (standType) {
    case "triple": return TRIPLE_COMBOS;
    case "double": return DOUBLE_COMBOS;
    case "single-lg":
    case "single-sm": return SINGLE_COMBOS;
  }
}

async function selectStand(page, standIndex) {
  const picks = page.locator(".stand-float-pick");
  await picks.nth(standIndex).click();
  await page.waitForTimeout(300);
}

async function addFlowerToSlot(page, flowerName, slotIndex) {
  // Click the slot to select it
  const slots = page.locator(".slot-area");
  await slots.nth(slotIndex).click();
  await page.waitForTimeout(200);

  // Find and click the flower card in the catalog
  const card = page.locator(`.flower-card-name:has-text("${flowerName}")`).first();

  // May need to scroll to it or reset category filter
  const allChip = page.locator('.category-chip:has-text("All Flowers")');
  await allChip.click();
  await page.waitForTimeout(100);

  await card.scrollIntoViewIfNeeded();
  // Click the parent flower-card
  await card.locator("..").locator("..").click();
  await page.waitForTimeout(300);
}

async function clearArrangement(page) {
  const clearBtn = page.locator(".cart-clear");
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await page.waitForTimeout(200);
  }
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  let totalScreenshots = 0;
  let totalCombos = 0;

  // Calculate totals
  for (const stand of STANDS) {
    totalCombos += getCombos(stand.type).length;
  }
  const totalTests = totalCombos * VIEWPORTS.length;
  console.log(`\nVisual Test Suite`);
  console.log(`  ${STANDS.length} stands × flower combos × ${VIEWPORTS.length} viewports = ${totalTests} screenshots\n`);

  for (const viewport of VIEWPORTS) {
    const vpDir = join(OUT_DIR, viewport.name);
    mkdirSync(vpDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    console.log(`\n📐 ${viewport.name} (${viewport.width}×${viewport.height})`);

    for (const stand of STANDS) {
      const standDir = join(vpDir, stand.name);
      mkdirSync(standDir, { recursive: true });

      await selectStand(page, stand.index);
      const combos = getCombos(stand.type);

      for (const combo of combos) {
        // Clear previous
        await clearArrangement(page);
        await selectStand(page, stand.index);

        // Fill slots
        for (let i = 0; i < combo.flowers.length; i++) {
          const flowerProfile = combo.flowers[i];
          if (!flowerProfile) continue;
          const flowerName = FLOWERS[flowerProfile];
          await addFlowerToSlot(page, flowerName, i);
        }

        // Deselect any slot
        await page.locator(".arrangement-canvas").click();
        await page.waitForTimeout(200);

        // Screenshot just the canvas area
        const canvas = page.locator(".arrangement-canvas");
        const fileName = `${stand.name}--${combo.name}.png`;
        await canvas.screenshot({ path: join(standDir, fileName) });

        totalScreenshots++;
        process.stdout.write(`\r  ${stand.name} | ${combo.name} (${totalScreenshots}/${totalTests})`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n\n✅ Done! ${totalScreenshots} screenshots saved to test-screenshots/visual-audit/`);
  console.log(`\nDirectory structure:`);
  console.log(`  visual-audit/`);
  for (const vp of VIEWPORTS) {
    console.log(`    ${vp.name}/`);
    console.log(`      {stand-name}/`);
    console.log(`        {stand}--{flower-combo}.png`);
  }
}

run().catch(console.error);
