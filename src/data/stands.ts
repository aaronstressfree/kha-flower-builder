import type { StandConfig } from "../types/canvas";

const CDN = "https://cdn.shopify.com/s/files/1/0918/1478/9427/files";

export const standConfigs: StandConfig[] = [
  {
    id: "triple-green-lotus",
    name: "Triple Green Lotus",
    variantId: "51468138742067",
    price: 23.85,
    image: `${CDN}/KHA-S003_Triple_Stand_Green_Lotus.jpg`,
    slots: [
      { key: "back", label: "Back", size: "LG", x: 50, y: 16, flowerHeight: 340 },
      { key: "frontLeft", label: "Front Left", size: "SM", x: 34, y: 6, flowerHeight: 240 },
      { key: "frontRight", label: "Front Right", size: "SM", x: 66, y: 6, flowerHeight: 240 },
    ],
  },
  {
    id: "triple-clear",
    name: "Triple Clear",
    variantId: "51468139528499",
    price: 23.85,
    image: `${CDN}/KHA-S007_Triple_Stand.jpg`,
    slots: [
      { key: "back", label: "Back", size: "LG", x: 50, y: 16, flowerHeight: 340 },
      { key: "frontLeft", label: "Front Left", size: "SM", x: 34, y: 6, flowerHeight: 240 },
      { key: "frontRight", label: "Front Right", size: "SM", x: 66, y: 6, flowerHeight: 240 },
    ],
  },
  {
    id: "grasses-double",
    name: "Grasses Double",
    variantId: "51468122423603",
    price: 23.85,
    image: `${CDN}/KHA-S008_Double_Stand.jpg`,
    slots: [
      { key: "left", label: "Left", size: "LG", x: 42, y: 12, flowerHeight: 320 },
      { key: "right", label: "Right", size: "SM", x: 58, y: 6, flowerHeight: 240 },
    ],
  },
  {
    id: "clover-moss-double",
    name: "Clover & Moss Double",
    variantId: "52858369376563",
    price: 23.85,
    image: `${CDN}/KHA-548_Double_Stand_Pattern_Clover_and_Moss_8b0fac9d-ff2a-4562-ab41-ba62db36815a.jpg`,
    slots: [
      { key: "left", label: "Left", size: "LG", x: 42, y: 12, flowerHeight: 320 },
      { key: "right", label: "Right", size: "SM", x: 58, y: 6, flowerHeight: 240 },
    ],
  },
  {
    id: "lg-leaf",
    name: "Single Leaf",
    variantId: "51468139004211",
    price: 23.85,
    image: `${CDN}/KHA-S002_Single_Stand_LG_Leaf.jpg`,
    slots: [
      { key: "center", label: "Flower", size: "LG", x: 50, y: 12, flowerHeight: 340 },
    ],
  },
  {
    id: "lg-lotus",
    name: "Single Lotus",
    variantId: "51468138905907",
    price: 23.85,
    image: `${CDN}/KHA-S004_Single_Stand_LG_Lotus.jpg`,
    slots: [
      { key: "center", label: "Flower", size: "LG", x: 50, y: 12, flowerHeight: 340 },
    ],
  },
];
