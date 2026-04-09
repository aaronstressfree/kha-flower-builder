import type { StandConfig } from "../types/canvas";

const CDN = "https://cdn.shopify.com/s/files/1/0918/1478/9427/files";

// Real-world reference (from DazzleUSA product specs):
// SM single: 2.5" × 1.75" × 0.5"  → baseWidth 56px
// LG single: 3.5" × 2.5" × 0.5"  → baseWidth 79px
// Double:    4" × 3" × 0.5"       → baseWidth 90px
// Triple:    4" × 3" × 0.5"       → baseWidth 90px
// Using 1" ≈ 22.5px (before responsive scaling)

export const standConfigs: StandConfig[] = [
  // --- Triple stands (1 LG back + 2 SM front) ---
  {
    id: "triple-green-lotus",
    name: "Triple Green Lotus",
    variantId: "51468138742067",
    price: 23.85,
    image: `${CDN}/KHA-S003_Triple_Stand_Green_Lotus.jpg`,
    baseWidth: 90,
    slots: [
      {
        key: "back",
        label: "Large (Back)",
        size: "LG",
        x: 50,
        y: 0,
        flowerHeight: 270,
      },
      {
        key: "frontLeft",
        label: "Small (Left)",
        size: "SM",
        x: 30,
        y: 0,
        flowerHeight: 135,
      },
      {
        key: "frontRight",
        label: "Small (Right)",
        size: "SM",
        x: 70,
        y: 0,
        flowerHeight: 135,
      },
    ],
  },
  {
    id: "triple-clear",
    name: "Triple Clear",
    variantId: "51468139528499",
    price: 23.85,
    image: `${CDN}/KHA-S007_Triple_Stand.jpg`,
    baseWidth: 90,
    slots: [
      {
        key: "back",
        label: "Large (Back)",
        size: "LG",
        x: 50,
        y: 0,
        flowerHeight: 270,
      },
      {
        key: "frontLeft",
        label: "Small (Left)",
        size: "SM",
        x: 30,
        y: 0,
        flowerHeight: 135,
      },
      {
        key: "frontRight",
        label: "Small (Right)",
        size: "SM",
        x: 70,
        y: 0,
        flowerHeight: 135,
      },
    ],
  },
  // --- Double stands (1 LG + 1 SM) ---
  {
    id: "grasses-double",
    name: "Grasses Double",
    variantId: "51468122423603",
    price: 23.85,
    image: `${CDN}/KHA-S008_Double_Stand.jpg`,
    baseWidth: 90,
    slots: [
      {
        key: "left",
        label: "Large",
        size: "LG",
        x: 38,
        y: 0,
        flowerHeight: 270,
      },
      {
        key: "right",
        label: "Small",
        size: "SM",
        x: 68,
        y: 0,
        flowerHeight: 135,
      },
    ],
  },
  {
    id: "clover-moss-double",
    name: "Clover & Moss Double",
    variantId: "52858369376563",
    price: 23.85,
    image: `${CDN}/KHA-548_Double_Stand_Pattern_Clover_and_Moss_8b0fac9d-ff2a-4562-ab41-ba62db36815a.jpg`,
    baseWidth: 90,
    slots: [
      {
        key: "left",
        label: "Large",
        size: "LG",
        x: 38,
        y: 0,
        flowerHeight: 270,
      },
      {
        key: "right",
        label: "Small",
        size: "SM",
        x: 68,
        y: 0,
        flowerHeight: 135,
      },
    ],
  },
  // --- Double stands (Poinsettia) ---
  {
    id: "poinsettia-double",
    name: "Poinsettia Double",
    variantId: "51778935783731",
    price: 23.85,
    image: `${CDN}/1_-_Poinsettia_Pattern_Double_Stand_KHA-S012.jpg`,
    baseWidth: 90,
    slots: [
      {
        key: "left",
        label: "Large",
        size: "LG",
        x: 38,
        y: 0,
        flowerHeight: 270,
      },
      {
        key: "right",
        label: "Small",
        size: "SM",
        x: 68,
        y: 0,
        flowerHeight: 135,
      },
    ],
  },
];
