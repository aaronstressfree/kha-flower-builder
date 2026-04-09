# Kimberly Hodges Flower Arrangement Builder — Development Guide

## Overview

Interactive web app where users preview acrylic flower arrangements on different stand types, then checkout via Shopify cart permalink. Built with React 19 + TypeScript + Vite, deployed on Vercel.

**Live:** https://kha-flower-builder.vercel.app
**Shopify store:** https://www.kimberlyhodges.com

---

## Architecture

```
src/
  App.tsx                         — Root component, wires hooks to UI
  types/
    product.ts                    — FlowerProduct, StandProduct types
    canvas.ts                     — StandConfig, SlotDef, ArrangementState
  data/
    catalog.ts                    — All flower products with Shopify variant IDs
    stands.ts                     — Stand configs with slot positions and base widths
  hooks/
    useArrangement.ts             — State: flowers in slots, selected slot, stand index
    useCart.ts                    — Price calculation + Shopify cart URL generation
  components/
    Layout/AppLayout.tsx          — Header + sidebar + canvas + cart bar
    Catalog/CatalogPanel.tsx      — Flower grid with category filters
    Catalog/FlowerCard.tsx        — Individual flower card
    Canvas/ArrangementCanvas.tsx  — Composition view + floating stand picker
    Cart/CartBar.tsx              — Price total + Add to Cart + disclaimer
scripts/
  process-images.mjs             — Download + remove white backgrounds from source
  final-clean.mjs                — Flood-fill background removal (best quality)
  center-stems.mjs               — Shift flowers so stem is centered horizontally
  reprocess-flowers.mjs          — Edge erosion passes
public/
  flowers/                        — Transparent PNG cutouts (800x800, stems centered)
  stands/                         — Transparent PNG stand images (600x600)
```

## Data Model

### Flowers (`src/data/catalog.ts`)

Each flower has:
- `id` — matches the PNG filename in `public/flowers/`
- `name` — display name
- `category` — for filtering (peony, dahlia, zinnia, poppy, hydrangea, fern, blossom, amaryllis, holiday, other)
- `variants.lg` — Shopify variant ID + price ($37.35) for Large size (optional)
- `variants.sm` — Shopify variant ID + price ($19.35) for Small size (optional)
- `images.thumbnail` / `images.cutout` — Shopify CDN URLs (kept for reference, app uses local PNGs)

**At least one of `lg` or `sm` must be present.** Most flowers have both. The stand's slot determines which size variant is used.

### Size Compatibility Rules

- A flower with both `lg` and `sm` variants can go in any slot.
- A flower with only `lg` can only go in LG slots (e.g., Hellebore, Cardinal).
- A flower with only `sm` can only go in SM slots.
- The `canFitSlot()` function in `useArrangement.ts` enforces this at placement time.
- The cart and price display handle optional variants gracefully.

### Stands (`src/data/stands.ts`)

Each stand has:
- `id` — matches PNG filename in `public/stands/`
- `variantId` — Shopify variant ID for the stand itself
- `price` — LG stands $23.85, SM stands $19.35
- `baseWidth` — pixel width of the constructed base strip (scales with responsive factor)
- `slots[]` — array of slot definitions:
  - `key` — unique identifier ("back", "frontLeft", "frontRight", "left", "right", "center")
  - `size` — "LG" or "SM" (determines which flower variant goes here)
  - `flowerHeight` — base height in pixels (scaled by responsive factor)
  - `label` — display text for empty slot placeholder

**Stand types:**
| Type | Slots | Base Width | Price |
|------|-------|-----------|-------|
| Triple (Green Lotus, Clear) | 1 LG + 2 SM | 200px | $23.85 |
| Double (Grasses, Clover & Moss) | 1 LG + 1 SM | 160px | $23.85 |
| Single LG (Leaf, Lotus) | 1 LG | 140px | $23.85 |
| Single SM (Clear, Vine) | 1 SM | 100px | $19.35 |

## Slot System

For triple stands, the layout uses a **layered approach**:
- Back flower: absolutely positioned, centered, `z-index: 1` (behind front flowers)
- Front flowers: in a flex row, `z-index: 3`, with negative margins for overlap
- Stand base: `z-index: 5`, overlaps flower stems by 18px

For double/single stands, flowers are in a simple flex row aligned to bottom.

### Interaction Flow
1. User clicks a flower card → fills the first empty slot (or replaces selected slot)
2. User clicks a filled slot → selects it (gold glow, shows X button and name)
3. User clicks another flower → replaces the selected slot
4. User clicks X → removes flower from slot
5. Catalog header shows "Pick a flower for the [slot name] slot" when a slot is selected

## Shopify Cart Integration

**Zero-auth approach** — no API keys needed.

Cart permalink format: `https://www.kimberlyhodges.com/cart/VARIANT_ID:QTY,VARIANT_ID:QTY`

The `useCart` hook:
1. Always includes 1x stand variant
2. For each filled slot, adds the flower's LG or SM variant based on `slot.size`
3. Deduplicates variant IDs (if same flower in multiple slots, qty increases)
4. Opens the permalink in a new tab → Shopify creates the cart

### Price Verification
| Config | Price |
|--------|-------|
| Triple: stand + 1 LG + 2 SM | $23.85 + $37.35 + $19.35×2 = $99.90 |
| Double: stand + 1 LG + 1 SM | $23.85 + $37.35 + $19.35 = $80.55 |
| Single LG: stand + 1 LG | $23.85 + $37.35 = $61.20 |
| Single SM: stand + 1 SM | $19.35 + $19.35 = $38.70 |

## Image Rules (IMPORTANT)

**Always use the clean single-flower cutout image** — the UUID-suffixed URL from Shopify CDN. Never use:
- Thumbnail/product photos (flower shown on a stand)
- Pair photos (LG + SM shown together)
- Dimension-annotated images (with ruler markings)
- Lifestyle photos (flower in a room setting)

The correct URL pattern: `Flower_Name_UUID.jpg` (e.g., `Red_Iceland_Poppy_SM_KHA-141_f57c4930-...jpg`)
The wrong URL pattern: `Flower_Name.jpg` or `FlowerName-SmallAcrylicSingleFlower-KHA-054.jpg`

The `cutout` field in `catalog.ts` is the source of truth. Keep `process-images.mjs` in sync with it.

To verify: open a flower PNG in `public/flowers/` — it should show a single flower on transparent background, no stand, no background artifacts, no measurement markings.

## Image Processing Pipeline (`scripts/process-images.mjs`)

The main script handles downloading and processing all flower and stand images.

### Background Removal Algorithm

Uses a 3-pass approach that works with any background color (white, grey, or colored):

**Pass 0 — Edge clear:** Makes the outer 2px border fully transparent. Many Shopify source images have a thin dark border from JPEG encoding that would otherwise block the flood fill.

**Pass 1 — Adaptive flood-fill:**
1. **Detect background color** by sampling corner patches (3% of image dimension)
2. **Calculate adaptive threshold** — higher for non-white backgrounds to handle gradients: `min(90, 55 + max(0, (245 - bgBrightness) * 1.5))`
3. **Seed** from all edge-adjacent pixels (within 5px of borders) that match the background
4. **BFS flood-fill** — spreads to adjacent pixels within threshold distance (RGB Euclidean). Close matches get `alpha=0`, borderline matches get proportional alpha.

This handles white, grey, and colored backgrounds (like lavender-peony's blue-grey studio backdrop) because it adapts to the actual background color detected from corners.

**Pass 2 — Defringe (5 passes):**
Erodes remaining JPEG compression artifacts at flower edges:
1. For each opaque pixel adjacent to a transparent pixel
2. If its RGB distance from background < threshold+15 → fully transparent
3. If distance < threshold+35 → alpha reduced to 25%
4. Repeats 5 times to eat through thick fringes

### Why This Approach Works

Previous attempts used fixed brightness/saturation thresholds (e.g., `brightness > 220`), which only worked for pure white backgrounds. The adaptive approach:
- **Detects** the actual background from corner samples
- **Flood-fills** connected regions (only reaches background, not flower interiors)
- **Defringe** removes JPEG compression blending at edges

### Known Limitations

- `lavender-peony` uses a product photo (no cutout URL available on Shopify CDN). Its blue-grey studio background with cast shadow is partially but not fully removed.
- Flowers with very thin, wispy features may lose some edge detail from defringe passes.

### CSS Edge Softening

In addition to image processing, the rendered flowers get CSS filters:
```css
filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.25))
  drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.06))
  saturate(1.25) brightness(1.08);
```
The subtle white glow softens remaining edge artifacts, while saturate/brightness enhance the painted look.

### Adding New Flowers
1. Find the product on kimberlyhodges.com
2. Get the UUID-suffixed cutout image URL — must be a **single flower on white background**, not a pair or lifestyle photo
3. Get LG/No Stand and SM/No Stand variant IDs from the page source
   - If the product only has LG (no SM variant), omit `sm` from the `variants` object — the app will restrict it to LG-only slots
   - If the product only has SM (no LG variant), omit `lg` — it will be restricted to SM-only slots
4. Add to `scripts/process-images.mjs` flowerImages array with `{ id, url }` and delete the existing PNG
5. Run `node scripts/process-images.mjs`
6. Optionally run `node scripts/center-stems.mjs` to center the stem
7. Add entry to `src/data/catalog.ts` with appropriate category
8. Verify the PNG looks good: `open public/flowers/new-flower.png`

**Categories:** popular (cross-cutting flag), orchid, wildflower, peony, dahlia, zinnia, poppy, hydrangea, fern, blossom, amaryllis, holiday, animal, other

"Popular" is a `popular: true` boolean on the FlowerProduct, not a category value. The CatalogPanel filters on this flag when the Popular chip is selected. A flower can be Popular AND belong to another category (e.g., orchid).

### Adding New Stands
1. Get the stand product image URL and variant ID from the site
2. Add to `scripts/process-images.mjs` standImages array and run it
3. Add to `src/data/stands.ts` with slot definitions
4. Define `baseWidth` and `slots` array with proper sizes

## Rendering Architecture

Desktop (>768px) and mobile (≤768px) use **completely separate rendering paths** in `ArrangementCanvas.tsx`. The `isMobile` flag branches to `MobileCanvas` — a different component with its own layout logic and CSS classes. This avoids the complexity of making one layout work at both sizes.

### Flower Positioning Principles

The goal is to make flowers look like they're **planted in the stand**:

1. **Stem tip inserted into the stand** — flowers overlap the stand bar by a "sink depth" so the bottom of each flower disappears into the stand base
2. **Horizontally centered over the stand** — flowers should be evenly distributed across the stand bar, not hanging off the sides
3. **LG behind, SM in front** — creates depth via z-index layering (LG=1, SM=2)
4. **Flowers should fill the available space** — don't leave large empty areas above or beside the arrangement

### Desktop Layout

Uses a **flex row with negative margins** for flower overlap:

```
fillFactor: 0.93 (scales flowers to 93% of available canvas height)
slotWidths: LG=200px, SM=120px (base widths before scale multiplier)
overlapMargin: doubles=-62*scale, triples=-72*scale (pulls flowers together)
```

The scale factor is computed from available canvas height:
```
scale = min((canvasHeight - reserved) * fillFactor / maxFlowerHeight, 3.5)
```

Everything scales proportionally — flower widths, heights, stand bar width, and overlap margins all multiply by the same scale factor.

**If you change slot widths, you must also adjust overlap margins** proportionally, or flowers will spread off the stand. The ratio should be roughly: `overlapMargin ≈ slotWidth * 0.35`.

### Mobile Layout

Uses **absolute positioning** relative to the stand center — no flex rows, no scale factors:

```
Container widths: lgWidth = min(flowerArea * 0.7, vw * 0.68)
Container heights: lgHeight = flowerArea * 0.96
SM sizes: smWidth = lgWidth * 0.55, smHeight = lgHeight * 0.52
Sink depth: standBarHeight * 0.55
```

Flower PNGs are square (800×800). Because `object-fit: contain` is used, the **container width determines the visible flower height**. A narrow container will show a small flower even if the container is very tall. This is why `lgWidth` is based on `flowerArea` — wider containers = visually bigger flowers.

Slot positions are computed as x-offsets from stand center:
- **Double (LG+SM):** LG at -22% of stand width, SM at +22%
- **Triple (SM+LG+SM):** SM at -30%, LG at center, SM at +30%

Mobile also has a **long-press preview** on stand thumbnails (300ms hold shows a popup with larger image + name).

### Z-Index Layers (both layouts)
| z-index | Element | Purpose |
|---------|---------|---------|
| 1 | LG (back) flower slot | Behind front flowers |
| 2 | SM (front) flower slots | In front of LG, creates depth |
| 4-5 | Stand base bar + mask | Covers flower stems (planted look) |
| 6 | Empty slot "+" buttons | Always visible above stand |
| 10 | Selected flower slot | Pops above everything for interaction |
| 20 | Remove (X) button | Always on top within selected slot |

A mask element below the stand bar (z-index 4) hides any flower content that leaks below.

### Common Pitfalls

- **Flowers too small on mobile:** Increase `lgWidth` cap (the vw multiplier). Container width drives visible flower size because PNGs are square.
- **Flowers off the stand on desktop:** Overlap margins are too small for the slot widths. Increase overlap margin proportionally.
- **Stand hidden behind picker:** `fillFactor` is too high. Keep it ≤0.95 or the arrangement overflows the available space.
- **Flowers beside the stand on mobile:** Increase the x-offset spread values or the sink depth so flowers overlap the stand bar more.

## Deployment

```bash
# Local dev
npm run dev

# Build + deploy to Vercel
vercel build --prod
vercel deploy --prebuilt --prod
```

The project uses prebuilt deployment (build locally, deploy artifacts) because npm install crashes on Vercel's build VMs. Do NOT rely on Vercel's GitHub auto-build — it will fail.

`sharp` and `playwright` are NOT in package.json — install them locally when needed:
```bash
npm install --no-save sharp playwright   # for image processing / screenshots
```

Git push requires the personal SSH key (not the squareup cert):
```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes" git push origin main
```

## Key CSS Techniques

- **Adaptive background removal + defringe** in image processing — handles white, grey, and colored backgrounds from source photos
- **Negative margins** on flower slots (desktop) — creates tight overlapping arrangement
- **Absolute positioning** (mobile) — pixel-perfect flower placement relative to stand center
- **Backdrop blur** on floating stand picker — glass-like appearance
- **`object-position: bottom center`** on flower images — anchors flowers to the bottom of their containers so stems align with the base
- **`object-fit: contain`** — square PNGs scale to fit container while maintaining aspect ratio; container WIDTH controls visible flower size

## File Size Budget

All flower PNGs are ~250-500KB each (800x800, compressed). Total `public/` assets are ~15MB. Vercel serves them via CDN with automatic caching.
