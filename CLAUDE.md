# KHA Flower Arrangement Builder

## Project Overview

Interactive web app for Kimberly Hodges Art and Design. Users preview acrylic flower arrangements on different stand types, then checkout via Shopify cart.

**Stack:** React 19 + TypeScript + Vite (static site, no SSR)
**Live:** https://kha-flower-builder.vercel.app
**Shopify store:** https://www.kimberlyhodges.com
**Repo:** github.com/aaronstressfree/kha-flower-builder

## Deploy Workflow

**Must use prebuilt deploy — Vercel GitHub auto-build WILL FAIL.**

```bash
npm run build                           # or: vercel build --prod
vercel deploy --prebuilt --prod         # uploads pre-built dist/
```

Git push requires personal SSH key:
```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes" git push origin main
```

## Architecture: Two Independent Rendering Paths

Desktop (>768px) and mobile (≤768px) use **completely separate code** in `ArrangementCanvas.tsx`. Do NOT try to make one layout work for both.

- **Desktop:** flex row + negative margins + scale factor
- **Mobile:** absolute positioning relative to stand center

See DEVELOPMENT.md "Rendering Architecture" for full details.

## Flower Positioning — The Golden Rules

1. Flowers must look **planted in the stand** — stem tips sink into the stand bar
2. Flowers must be **horizontally centered over the stand bar** — not hanging off edges
3. **LG flowers behind, SM in front** (z-index 1 vs 2)
4. Flowers should **fill the available canvas space** — no large empty areas
5. The **stand bar must always be visible** — never hidden behind the stand picker

## Common Mistakes to Avoid

- **Desktop fillFactor > 0.95** → stand disappears behind picker (arrangement overflows)
- **Changing slot widths without adjusting overlap margins** → flowers spread off stand
- **Making mobile containers narrow** → flowers look small (square PNGs need wide containers for `object-fit: contain` to render them large)
- **Deploying via `vercel deploy --prod`** (without `--prebuilt`) → triggers remote build which crashes

## Image Processing

`sharp` and `playwright` are NOT in package.json. Install when needed:
```bash
npm install --no-save sharp playwright
node scripts/process-images.mjs
```

Only use UUID-suffixed cutout images from Shopify CDN. See DEVELOPMENT.md "Image Rules" section.

## Stakeholder

Aaron's dad (Kimberly Hodges Art) is the primary stakeholder. Requests come via email through Aaron. The Shopify store at kimberlyhodges.com is the source for variant IDs, product images, and pricing.
