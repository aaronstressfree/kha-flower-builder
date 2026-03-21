const { chromium } = require("playwright");

const SCREENSHOT_DIR = "/Users/aaronstevens/Development/kha-flower-builder/test-screenshots";
const BASE_URL = "http://localhost:5190";

(async () => {
  const results = [];
  let passed = 0;
  let failed = 0;

  function record(test, pass, detail) {
    const status = pass ? "PASS" : "FAIL";
    results.push({ test, status, detail });
    if (pass) passed++;
    else failed++;
    console.log(`[${status}] ${test}: ${detail}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });
  const page = await context.newPage();

  // Block popups so "Add to Cart" doesn't actually open a tab
  let lastPopupUrl = null;
  context.on("page", async (newPage) => {
    lastPopupUrl = newPage.url();
    await newPage.close();
  });

  // Also capture window.open calls
  await page.addInitScript(() => {
    window.__openedUrls = [];
    const origOpen = window.open;
    window.open = function (url) {
      window.__openedUrls.push(url);
      // don't actually open
    };
  });

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${SCREENSHOT_DIR}/01-initial-load.png`, fullPage: true });

  // ============================================================
  // TEST 1: CATALOG BROWSING
  // ============================================================
  console.log("\n=== TEST 1: CATALOG BROWSING ===");

  // 1a. Verify flower cards show names and prices
  const flowerCards = await page.locator(".flower-card").all();
  record("1a-flower-cards-exist", flowerCards.length > 0, `Found ${flowerCards.length} flower cards`);

  // Check first card has name and price
  const firstName = await page.locator(".flower-card-name").first().textContent();
  const firstPrice = await page.locator(".flower-card-price").first().textContent();
  record("1b-card-has-name", !!firstName && firstName.length > 0, `First card name: "${firstName}"`);
  record("1c-card-has-price", !!firstPrice && firstPrice.includes("$"), `First card price: "${firstPrice}"`);

  // 1d. Verify "All Flowers" is initially active
  const activeChip = await page.locator(".category-chip.active").textContent();
  record("1d-all-flowers-active", activeChip === "All Flowers", `Active category: "${activeChip}"`);

  // Count cards with "All Flowers" selected
  const allFlowersCount = await page.locator(".flower-card").count();

  // 1e. Click "Peonies" category and verify filtering
  await page.locator(".category-chip", { hasText: "Peonies" }).click();
  await page.waitForTimeout(300);
  const peonyCards = await page.locator(".flower-card").count();
  // We know there are 6 peonies in catalog data
  record("1e-peony-filter", peonyCards > 0 && peonyCards < allFlowersCount, `Peonies filter: ${peonyCards} cards (vs ${allFlowersCount} for All)`);

  // Verify all visible cards are peonies
  const peonyNames = await page.locator(".flower-card-name").allTextContents();
  const allArePeonies = peonyNames.every((n) => n.toLowerCase().includes("peony"));
  record("1f-peony-names-correct", allArePeonies, `Peony names: ${peonyNames.join(", ")}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/02-peony-filter.png`, fullPage: true });

  // 1g. Click "Dahlias" category
  await page.locator(".category-chip", { hasText: "Dahlias" }).click();
  await page.waitForTimeout(300);
  const dahliaCards = await page.locator(".flower-card").count();
  const dahliaNames = await page.locator(".flower-card-name").allTextContents();
  const allAreDahlias = dahliaNames.every((n) => n.toLowerCase().includes("dahlia") || n.toLowerCase().includes("sonic"));
  record("1g-dahlia-filter", dahliaCards > 0 && allAreDahlias, `Dahlias: ${dahliaCards} cards: ${dahliaNames.join(", ")}`);

  // Reset to All
  await page.locator(".category-chip", { hasText: "All Flowers" }).click();
  await page.waitForTimeout(300);

  // ============================================================
  // TEST 2: ADDING FLOWERS
  // ============================================================
  console.log("\n=== TEST 2: ADDING FLOWERS ===");

  // Verify canvas starts empty
  const emptyText = await page.locator(".canvas-empty-text").textContent();
  record("2a-canvas-empty", emptyText?.includes("Click a flower"), `Empty text: "${emptyText}"`);

  // Verify cart starts at 0
  const initialCount = await page.locator(".cart-count").textContent();
  record("2b-cart-starts-zero", initialCount?.includes("0"), `Initial cart: "${initialCount}"`);

  // Click first flower card (Aqua Blossoms)
  await page.locator(".flower-card").first().click();
  await page.waitForTimeout(500);

  // Verify placed flower appears on canvas
  const placedFlowers1 = await page.locator(".placed-flower").count();
  record("2c-flower-added-to-canvas", placedFlowers1 === 1, `Placed flowers: ${placedFlowers1}`);

  // Verify cart count updated
  const count1 = await page.locator(".cart-count").textContent();
  record("2d-cart-count-1", count1?.includes("1"), `Cart after 1 flower: "${count1}"`);

  // Verify cart total shows $37.35 (LG price)
  const total1 = await page.locator(".cart-total").textContent();
  record("2e-cart-total-37.35", total1 === "$37.35", `Cart total: "${total1}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/03-one-flower-added.png`, fullPage: true });

  // Add a second flower
  await page.locator(".flower-card").nth(1).click();
  await page.waitForTimeout(500);

  const placedFlowers2 = await page.locator(".placed-flower").count();
  record("2f-two-flowers-on-canvas", placedFlowers2 === 2, `Placed flowers: ${placedFlowers2}`);

  const count2 = await page.locator(".cart-count").textContent();
  record("2g-cart-count-2", count2?.includes("2"), `Cart after 2 flowers: "${count2}"`);

  const total2 = await page.locator(".cart-total").textContent();
  record("2h-cart-total-74.70", total2 === "$74.70", `Cart total: "${total2}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/04-two-flowers-added.png`, fullPage: true });

  // ============================================================
  // TEST 3: DRAG AND DROP
  // ============================================================
  console.log("\n=== TEST 3: DRAG AND DROP ===");

  // Select the first placed flower
  const firstPlaced = page.locator(".placed-flower").first();

  // Get initial position
  const initialStyle = await firstPlaced.getAttribute("style");
  const leftMatch = initialStyle.match(/left:\s*([\d.]+)/);
  const topMatch = initialStyle.match(/top:\s*([\d.]+)/);
  const initialLeft = parseFloat(leftMatch[1]);
  const initialTop = parseFloat(topMatch[1]);

  // Get the bounding box of the flower element and the canvas
  const box = await firstPlaced.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  // Use dispatchEvent to fire proper PointerEvents on the element
  // The component uses React onPointerDown/Move/Up with setPointerCapture
  const dragResult = await page.evaluate(async ({ startX, startY, deltaX, deltaY }) => {
    const el = document.querySelector(".placed-flower");
    if (!el) return { success: false, reason: "no element" };

    // Get the img inside (that's the actual drag target that captures pointer)
    const target = el.querySelector("img") || el;

    // Create and dispatch pointer events
    const down = new PointerEvent("pointerdown", {
      clientX: startX, clientY: startY,
      pointerId: 1, bubbles: true, cancelable: true,
      pointerType: "mouse", isPrimary: true,
    });
    target.dispatchEvent(down);

    // Simulate multiple move steps
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const x = startX + (deltaX * i) / steps;
      const y = startY + (deltaY * i) / steps;
      const move = new PointerEvent("pointermove", {
        clientX: x, clientY: y,
        pointerId: 1, bubbles: true, cancelable: true,
        pointerType: "mouse", isPrimary: true,
      });
      target.dispatchEvent(move);
      await new Promise((r) => setTimeout(r, 16));
    }

    const up = new PointerEvent("pointerup", {
      clientX: startX + deltaX, clientY: startY + deltaY,
      pointerId: 1, bubbles: true, cancelable: true,
      pointerType: "mouse", isPrimary: true,
    });
    target.dispatchEvent(up);

    return { success: true };
  }, { startX: centerX, startY: centerY, deltaX: 80, deltaY: 60 });

  await page.waitForTimeout(300);

  // Check new position
  const newStyle = await firstPlaced.getAttribute("style");
  const newLeftMatch = newStyle.match(/left:\s*([\d.]+)/);
  const newTopMatch = newStyle.match(/top:\s*([\d.]+)/);
  const newLeft = parseFloat(newLeftMatch[1]);
  const newTop = parseFloat(newTopMatch[1]);

  const moved = Math.abs(newLeft - initialLeft) > 5 || Math.abs(newTop - initialTop) > 5;
  record("3a-drag-changes-position", moved, `Position: (${initialLeft.toFixed(0)},${initialTop.toFixed(0)}) -> (${newLeft.toFixed(0)},${newTop.toFixed(0)})`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/05-after-drag.png`, fullPage: true });

  // ============================================================
  // TEST 4: SIZE TOGGLE
  // ============================================================
  console.log("\n=== TEST 4: SIZE TOGGLE ===");

  // Clear and start fresh for clean pricing test
  // First clear everything
  if (await page.locator(".cart-clear").count() > 0) {
    await page.locator(".cart-clear").click();
    await page.waitForTimeout(300);
  }

  // Add one flower (defaults to LG @ $37.35)
  await page.locator(".flower-card").first().click();
  await page.waitForTimeout(500);

  const totalBeforeToggle = await page.locator(".cart-total").textContent();
  record("4a-default-lg-price", totalBeforeToggle === "$37.35", `Default LG total: "${totalBeforeToggle}"`);

  // Click the placed flower to select it (should already be selected after adding)
  await page.locator(".placed-flower").first().click({ force: true });
  await page.waitForTimeout(300);

  // Check that the size toggle button shows "SM" (meaning current is LG, button offers SM)
  const sizeBtn = page.locator(".fc-size");
  const sizeBtnText = await sizeBtn.textContent();
  record("4b-size-btn-shows-sm", sizeBtnText === "SM", `Size toggle button text: "${sizeBtnText}"`);

  // Click SM to toggle size
  await sizeBtn.click();
  await page.waitForTimeout(300);

  // Verify cart total changed to SM price ($19.35)
  const totalAfterToggle = await page.locator(".cart-total").textContent();
  record("4c-sm-price-19.35", totalAfterToggle === "$19.35", `SM total: "${totalAfterToggle}"`);

  // Verify button now shows "LG" (to switch back)
  const sizeBtnTextAfter = await sizeBtn.textContent();
  record("4d-size-btn-shows-lg", sizeBtnTextAfter === "LG", `Size toggle after: "${sizeBtnTextAfter}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/06-size-toggle-sm.png`, fullPage: true });

  // Toggle back to LG
  await sizeBtn.click();
  await page.waitForTimeout(300);
  const totalBackToLg = await page.locator(".cart-total").textContent();
  record("4e-toggle-back-to-lg", totalBackToLg === "$37.35", `Toggled back to LG: "${totalBackToLg}"`);

  // ============================================================
  // TEST 5: CONTROLS (Rotate, Flip, Delete)
  // ============================================================
  console.log("\n=== TEST 5: CONTROLS ===");

  // The flower should still be selected from test 4
  // Get the current transform
  const transformBefore = await page.locator(".placed-flower").first().getAttribute("style");

  // 5a. Rotate right
  await page.locator('.fc-btn[title="Rotate right"]').click();
  await page.waitForTimeout(200);
  const transformAfterRotate = await page.locator(".placed-flower").first().getAttribute("style");
  const hasRotation = transformAfterRotate.includes("rotate(15deg)");
  record("5a-rotate-right", hasRotation, `Transform after rotate: ${transformAfterRotate.match(/rotate\([^)]+\)/)?.[0] || "none"}`);

  // 5b. Rotate left
  await page.locator('.fc-btn[title="Rotate left"]').click();
  await page.waitForTimeout(200);
  const transformAfterRotateLeft = await page.locator(".placed-flower").first().getAttribute("style");
  const backToZero = transformAfterRotateLeft.includes("rotate(0deg)");
  record("5b-rotate-left", backToZero, `Transform after rotate left: ${transformAfterRotateLeft.match(/rotate\([^)]+\)/)?.[0] || "none"}`);

  // 5c. Flip
  await page.locator('.fc-btn[title="Flip horizontal"]').click();
  await page.waitForTimeout(200);
  const transformAfterFlip = await page.locator(".placed-flower").first().getAttribute("style");
  const hasFlip = transformAfterFlip.includes("scaleX(-1)");
  record("5c-flip-horizontal", hasFlip, `Transform after flip: has scaleX(-1) = ${hasFlip}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/07-after-rotate-flip.png`, fullPage: true });

  // 5d. Delete
  const countBeforeDelete = await page.locator(".placed-flower").count();
  await page.locator('.fc-btn.fc-delete[title="Remove"]').click();
  await page.waitForTimeout(300);
  const countAfterDelete = await page.locator(".placed-flower").count();
  record("5d-delete-removes-flower", countAfterDelete === countBeforeDelete - 1, `Flowers: ${countBeforeDelete} -> ${countAfterDelete}`);

  // Check cart updates after delete
  const countAfterDeleteCart = await page.locator(".cart-count").textContent();
  record("5e-cart-updates-after-delete", countAfterDeleteCart?.includes("0"), `Cart after delete: "${countAfterDeleteCart}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/08-after-delete.png`, fullPage: true });

  // ============================================================
  // TEST 6: STANDS
  // ============================================================
  console.log("\n=== TEST 6: STANDS ===");

  // Click Stands tab
  await page.locator(".catalog-tab", { hasText: "Stands" }).click();
  await page.waitForTimeout(300);

  // Verify stand cards appear
  const standCards = await page.locator(".flower-card").count(); // stands use same class
  record("6a-stand-cards-visible", standCards > 0, `Stand cards: ${standCards}`);

  // Verify stand card shows name and price
  const standName = await page.locator(".flower-card-name").first().textContent();
  const standPrice = await page.locator(".flower-card-price").first().textContent();
  record("6b-stand-has-name", !!standName, `First stand name: "${standName}"`);
  record("6c-stand-has-price", standPrice?.includes("$"), `First stand price: "${standPrice}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/09-stands-tab.png`, fullPage: true });

  // Add a stand (first stand is SM Single Stand Clear at $19.35)
  await page.locator(".flower-card").first().click();
  await page.waitForTimeout(500);

  // Verify stand appears on canvas
  const placedStands = await page.locator(".placed-stand").count();
  record("6d-stand-on-canvas", placedStands === 1, `Placed stands: ${placedStands}`);

  // Verify cart updates with stand
  const cartCountWithStand = await page.locator(".cart-count").textContent();
  const cartTotalWithStand = await page.locator(".cart-total").textContent();
  record("6e-cart-count-with-stand", cartCountWithStand?.includes("1"), `Cart count: "${cartCountWithStand}"`);
  record("6f-cart-total-stand", cartTotalWithStand === "$19.35", `Cart total with stand: "${cartTotalWithStand}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/10-stand-added.png`, fullPage: true });

  // Clear for next test
  await page.locator(".cart-clear").click();
  await page.waitForTimeout(300);

  // ============================================================
  // TEST 7: CART PRICING ACCURACY
  // ============================================================
  console.log("\n=== TEST 7: CART PRICING ACCURACY ===");

  // Switch back to Flowers tab
  await page.locator(".catalog-tab", { hasText: "Flowers" }).click();
  await page.waitForTimeout(300);

  // 7a. 1 LG flower = $37.35
  await page.locator(".flower-card").first().click();
  await page.waitForTimeout(400);
  const total7a = await page.locator(".cart-total").textContent();
  record("7a-1-lg-flower", total7a === "$37.35", `1 LG flower: "${total7a}"`);

  // 7b. 2 LG flowers = $74.70
  await page.locator(".flower-card").nth(1).click();
  await page.waitForTimeout(400);
  const total7b = await page.locator(".cart-total").textContent();
  record("7b-2-lg-flowers", total7b === "$74.70", `2 LG flowers: "${total7b}"`);

  // 7c. 1 LG + 1 SM = $56.70
  // Toggle second flower to SM
  // First select the second flower
  const secondFlower = page.locator(".placed-flower").nth(1);
  await secondFlower.click({ force: true });
  await page.waitForTimeout(300);

  // Click SM toggle
  await page.locator(".fc-size").click();
  await page.waitForTimeout(300);
  const total7c = await page.locator(".cart-total").textContent();
  record("7c-1-lg-1-sm", total7c === "$56.70", `1 LG + 1 SM: "${total7c}"`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/11-pricing-1lg-1sm.png`, fullPage: true });

  // Clear for test 7d
  await page.locator(".cart-clear").click();
  await page.waitForTimeout(300);

  // 7d. 1 LG flower + 1 stand ($19.35) = $56.70
  await page.locator(".flower-card").first().click();
  await page.waitForTimeout(400);

  // Switch to stands and add first stand
  await page.locator(".catalog-tab", { hasText: "Stands" }).click();
  await page.waitForTimeout(300);
  await page.locator(".flower-card").first().click();
  await page.waitForTimeout(400);

  const total7d = await page.locator(".cart-total").textContent();
  const count7d = await page.locator(".cart-count").textContent();
  record("7d-1-lg-1-stand", total7d === "$56.70", `1 LG flower + 1 stand: "${total7d}" (${count7d})`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/12-pricing-1lg-1stand.png`, fullPage: true });

  // ============================================================
  // TEST 8: CART URL
  // ============================================================
  console.log("\n=== TEST 8: CART URL ===");

  // The current state has 1 flower + 1 stand. Click "Add to Cart"
  await page.locator(".cart-checkout").click();
  await page.waitForTimeout(500);

  // Check captured URL from window.open override
  const openedUrls = await page.evaluate(() => window.__openedUrls);
  const cartUrl = openedUrls.length > 0 ? openedUrls[openedUrls.length - 1] : null;

  const urlStartsCorrectly = cartUrl?.startsWith("https://www.kimberlyhodges.com/cart/");
  record("8a-cart-url-prefix", urlStartsCorrectly, `Cart URL: "${cartUrl}"`);

  // Verify URL contains variant IDs
  if (cartUrl) {
    const hasVariantIds = cartUrl.includes(":") && cartUrl.length > "https://www.kimberlyhodges.com/cart/".length;
    record("8b-cart-url-has-variants", hasVariantIds, `URL has variant data: ${hasVariantIds}`);
  } else {
    record("8b-cart-url-has-variants", false, "No URL captured");
  }

  // ============================================================
  // TEST 9: CLEAR
  // ============================================================
  console.log("\n=== TEST 9: CLEAR ===");

  // We still have items from test 7d
  const countBeforeClear = await page.locator(".cart-count").textContent();
  record("9a-items-before-clear", !countBeforeClear?.includes("0"), `Items before clear: "${countBeforeClear}"`);

  // Click Clear
  await page.locator(".cart-clear").click();
  await page.waitForTimeout(300);

  // Verify canvas is empty
  const flowersAfterClear = await page.locator(".placed-flower").count();
  const standsAfterClear = await page.locator(".placed-stand").count();
  record("9b-canvas-empty-after-clear", flowersAfterClear === 0 && standsAfterClear === 0, `After clear: ${flowersAfterClear} flowers, ${standsAfterClear} stands`);

  // Verify cart shows 0 items
  const countAfterClear = await page.locator(".cart-count").textContent();
  record("9c-cart-zero-after-clear", countAfterClear?.includes("0"), `Cart after clear: "${countAfterClear}"`);

  // Verify empty state message appears
  const emptyMsg = await page.locator(".canvas-empty-text").count();
  record("9d-empty-message-shown", emptyMsg === 1, `Empty message visible: ${emptyMsg === 1}`);

  // Verify "Add to Cart" button is disabled
  const checkoutDisabled = await page.locator(".cart-checkout").isDisabled();
  record("9e-checkout-disabled", checkoutDisabled, `Checkout disabled when empty: ${checkoutDisabled}`);

  // Verify no Clear button shown when 0 items
  const clearBtnCount = await page.locator(".cart-clear").count();
  record("9f-clear-hidden-when-empty", clearBtnCount === 0, `Clear button hidden when empty: ${clearBtnCount === 0}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/13-after-clear.png`, fullPage: true });

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n========================================");
  console.log("           TEST SUMMARY");
  console.log("========================================");
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("========================================\n");

  if (failed > 0) {
    console.log("FAILURES:");
    results.filter((r) => r.status === "FAIL").forEach((r) => {
      console.log(`  - ${r.test}: ${r.detail}`);
    });
    console.log("");
  }

  console.log("ALL RESULTS:");
  results.forEach((r) => {
    console.log(`  [${r.status}] ${r.test}: ${r.detail}`);
  });

  await browser.close();
})();
