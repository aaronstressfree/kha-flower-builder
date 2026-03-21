# Kimberly Hodges Flower Arrangement Builder

Interactive web app for composing custom acrylic flower arrangements from [Kimberly Hodges Art and Design](https://www.kimberlyhodges.com/). Browse flowers, drag them onto a canvas, and checkout via Shopify.

## Features

- 41 acrylic flower products with real Shopify variant IDs
- 10 acrylic stand/base options
- Category filtering (Peonies, Dahlias, Zinnias, Poppies, Hydrangeas, Ferns, Amaryllis, etc.)
- Drag-and-drop canvas with rotate, flip, resize, and layer controls
- Real-time price calculation
- Shopify cart permalink checkout (zero-auth, no API key needed)
- Responsive layout with Cormorant Garamond brand font

## Stack

- React 19 + TypeScript + Vite
- Deployed on [Vercel](https://vercel.com)

## Development

```bash
npm install
npm run dev
```

## Deployment

Hosted on Vercel. Push to main to auto-deploy, or manually:

```bash
npm run build
vercel --prod
```
