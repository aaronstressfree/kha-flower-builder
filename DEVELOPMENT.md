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

**Categories:** peony, dahlia, zinnia, poppy, hydrangea, fern, blossom, amaryllis, holiday, other

### Adding New Stands
1. Get the stand product image URL and variant ID from the site
2. Add to `scripts/process-images.mjs` standImages array and run it
3. Add to `src/data/stands.ts` with slot definitions
4. Define `baseWidth` and `slots` array with proper sizes

## Responsive Scaling

The canvas component measures height and viewport width to compute a scale factor:
```
desktop: scale = min((available * 0.82) / maxFlowerHeight, 3.5)
mobile:  scale = min((available * 0.95) / maxFlowerHeight, 3.5)
```

Slot widths are viewport-responsive (using `window.innerWidth`, not canvas element width):
- Desktop (>768px): LG=160px, SM=96px
- Mobile (≤768px): LG=120px, SM=72px

### Z-Index Layers (within arrangement-group)
| z-index | Element | Purpose |
|---------|---------|---------|
| 1 | LG (back) flower slot | Behind front flowers |
| 2 | SM (front) flower slots | In front of LG, creates depth |
| 5 | Stand base bar | Covers flower stems (plugged-in look) |
| 6 | Empty slot "+" buttons | Always visible above stand |
| 10 | Selected flower slot | Pops above everything for interaction |
| 20 | Remove (X) button | Always on top within selected slot |

A `::after` mask on the stand-base (z-index 4) hides any flower content below the stand.

## Deployment

```bash
# Local dev
npm run dev

# Build + deploy to Vercel
vercel build --prod
vercel deploy --prebuilt --prod
```

The project uses prebuilt deployment (build locally, deploy artifacts) because the `playwright` dev dependency caused npm install failures on Vercel's build servers.

## Key CSS Techniques

- **Adaptive background removal + defringe** in image processing — handles white, grey, and colored backgrounds from source photos
- **Negative margins** on flower slots — creates tight overlapping arrangement
- **Backdrop blur** on floating stand picker — glass-like appearance
- **`object-position: bottom center`** on flower images — anchors flowers to the bottom of their containers so stems align with the base

## File Size Budget

All flower PNGs are ~250-500KB each (800x800, compressed). Total `public/` assets are ~15MB. Vercel serves them via CDN with automatic caching.
