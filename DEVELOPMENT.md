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

## Image Processing Pipeline

### Step 1: Download from Shopify CDN
Source images are the UUID-suffixed clean cutout JPGs (e.g., `Flower_Name_UUID.jpg`). These show individual flowers on white backgrounds.

### Step 2: Background Removal (`scripts/final-clean.mjs`)
Uses **flood-fill from edges** (not global threshold):
1. Seed a BFS queue with all border pixels that look like background
2. Spread to adjacent pixels matching background criteria (brightness > 185, saturation < 0.18)
3. Set alpha to 0 for all connected background pixels
4. One pass of edge softening (reduce alpha for pixels adjacent to transparent)
5. Auto-trim transparent borders via `sharp.trim()`

This preserves light-colored petals that a global threshold would remove.

### Step 3: Center Stems (`scripts/center-stems.mjs`)
1. Find the average X position of non-transparent pixels in the bottom 15% (the stem)
2. Calculate horizontal shift needed to center the stem
3. Physically shift all pixels in the image

### Adding New Flowers
1. Find the product on kimberlyhodges.com
2. Get the UUID-suffixed cutout image URL (4th image on product page usually) — must be a **single flower on white background**, not a pair or lifestyle photo
3. Get LG/No Stand and SM/No Stand variant IDs from the page source
   - If the product only has LG (no SM variant), omit `sm` from the `variants` object — the app will restrict it to LG-only slots
   - If the product only has SM (no LG variant), omit `lg` — it will be restricted to SM-only slots
4. Add to `scripts/final-clean.mjs` flowers array with `{ id, url }` and run it
5. Run `node scripts/center-stems.mjs` to center the stem
6. Add entry to `src/data/catalog.ts` with appropriate category
7. Verify the PNG looks good: `open public/flowers/new-flower.png`

**Categories:** peony, dahlia, zinnia, poppy, hydrangea, fern, blossom, amaryllis, holiday, other

### Adding New Stands
1. Get the stand product image URL and variant ID from the site
2. Add to `scripts/process-images.mjs` standImages array and run it
3. Add to `src/data/stands.ts` with slot definitions
4. Define `baseWidth` and `slots` array with proper sizes

## Responsive Scaling

The canvas component measures its own height and computes a scale factor:
```
scale = min((availableHeight * 0.85) / maxFlowerHeight, 1.8)
```
All flower heights, widths, and base widths are multiplied by this scale. This ensures the arrangement fills the canvas proportionally on any screen size.

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

- **`mix-blend-mode: multiply`** on flower images — eliminates any remaining gray edge artifacts by blending them into the background
- **Negative margins** on flower slots — creates tight overlapping arrangement
- **Backdrop blur** on floating stand picker — glass-like appearance
- **`object-position: bottom center`** on flower images — anchors flowers to the bottom of their containers so stems align with the base

## File Size Budget

All flower PNGs are ~250-500KB each (800x800, compressed). Total `public/` assets are ~15MB. Vercel serves them via CDN with automatic caching.
