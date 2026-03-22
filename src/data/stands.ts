import type { StandConfig } from "../types/canvas";

const CDN = "https://cdn.shopify.com/s/files/1/0918/1478/9427/files";

export const standConfigs: StandConfig[] = [
  // --- Triple stands (1 LG back + 2 SM front) ---
  {
    id: "triple-green-lotus",
    name: "Triple Green Lotus",
    variantId: "51468138742067",
    price: 23.85,
    image: `${CDN}/KHA-S003_Triple_Stand_Green_Lotus.jpg`,
    baseWidth: 150,
    slots: [
      { key: "back", label: "Large (Back)", size: "LG", x: 50, y: 0, flowerHeight: 300 },
      { key: "frontLeft", label: "Small (Left)", size: "SM", x: 30, y: 0, flowerHeight: 190 },
      { key: "frontRight", label: "Small (Right)", size: "SM", x: 70, y: 0, flowerHeight: 190 },
    ],
  },
  {
    id: "triple-clear",
    name: "Triple Clear",
    variantId: "51468139528499",
    price: 23.85,
    image: `${CDN}/KHA-S007_Triple_Stand.jpg`,
    baseWidth: 150,
    slots: [
      { key: "back", label: "Large (Back)", size: "LG", x: 50, y: 0, flowerHeight: 300 },
      { key: "frontLeft", label: "Small (Left)", size: "SM", x: 30, y: 0, flowerHeight: 190 },
      { key: "frontRight", label: "Small (Right)", size: "SM", x: 70, y: 0, flowerHeight: 190 },
    ],
  },
  // --- Double stands (1 LG + 1 SM) ---
  {
    id: "grasses-double",
    name: "Grasses Double",
    variantId: "51468122423603",
    price: 23.85,
    image: `${CDN}/KHA-S008_Double_Stand.jpg`,
    baseWidth: 120,
    slots: [
      { key: "left", label: "Large", size: "LG", x: 38, y: 0, flowerHeight: 300 },
      { key: "right", label: "Small", size: "SM", x: 68, y: 0, flowerHeight: 190 },
    ],
  },
  {
    id: "clover-moss-double",
    name: "Clover & Moss Double",
    variantId: "52858369376563",
    price: 23.85,
    image: `${CDN}/KHA-548_Double_Stand_Pattern_Clover_and_Moss_8b0fac9d-ff2a-4562-ab41-ba62db36815a.jpg`,
    baseWidth: 120,
    slots: [
      { key: "left", label: "Large", size: "LG", x: 38, y: 0, flowerHeight: 300 },
      { key: "right", label: "Small", size: "SM", x: 68, y: 0, flowerHeight: 190 },
    ],
  },
  // --- Single LG stands ---
  {
    id: "lg-leaf",
    name: "Single Leaf (LG)",
    variantId: "51468139004211",
    price: 23.85,
    image: `${CDN}/KHA-S002_Single_Stand_LG_Leaf.jpg`,
    baseWidth: 95,
    slots: [
      { key: "center", label: "Large", size: "LG", x: 50, y: 0, flowerHeight: 300 },
    ],
  },
  {
    id: "lg-lotus",
    name: "Single Lotus (LG)",
    variantId: "51468138905907",
    price: 23.85,
    image: `${CDN}/KHA-S004_Single_Stand_LG_Lotus.jpg`,
    baseWidth: 95,
    slots: [
      { key: "center", label: "Large", size: "LG", x: 50, y: 0, flowerHeight: 300 },
    ],
  },
  // --- Single SM stands ---
  {
    id: "sm-clear",
    name: "Single Clear (SM)",
    variantId: "51468138643763",
    price: 19.35,
    image: `${CDN}/KHA-S005_Single_Stand_SM.jpg`,
    baseWidth: 70,
    slots: [
      { key: "center", label: "Small", size: "SM", x: 50, y: 0, flowerHeight: 190 },
    ],
  },
  {
    id: "sm-spiral-vine",
    name: "Single Vine (SM)",
    variantId: "51468139594035",
    price: 19.35,
    image: `${CDN}/KHA-S001_Single_Stand_SM_Spiral_Vine.jpg`,
    baseWidth: 70,
    slots: [
      { key: "center", label: "Small", size: "SM", x: 50, y: 0, flowerHeight: 190 },
    ],
  },
  // --- Holiday stands ---
  {
    id: "sm-pine-pattern",
    name: "Pine Pattern (SM)",
    variantId: "51766600139059",
    price: 19.35,
    image: `${CDN}/1_Pine_Pattern_Stand-Small_Acrylic_Base_KHA-SO13.jpg`,
    baseWidth: 70,
    slots: [
      { key: "center", label: "Small", size: "SM", x: 50, y: 0, flowerHeight: 190 },
    ],
  },
  {
    id: "lg-pinecone-holly",
    name: "Pinecone & Holly (LG)",
    variantId: "51778935816499",
    price: 23.85,
    image: `${CDN}/1_-_Pinecone_Holly_Large_Stand_KHA-S011_1.jpg`,
    baseWidth: 95,
    slots: [
      { key: "center", label: "Large", size: "LG", x: 50, y: 0, flowerHeight: 300 },
    ],
  },
];
