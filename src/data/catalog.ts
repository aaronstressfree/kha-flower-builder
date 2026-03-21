import type { FlowerProduct, StandProduct } from "../types/product";

const CDN = "https://cdn.shopify.com/s/files/1/0918/1478/9427/files";

// Only flowers with clean single-flower cutout images (no pair photos)
export const flowers: FlowerProduct[] = [
  {
    id: "aqua-blossoms",
    name: "Aqua Blossoms",
    category: "blossom",
    variants: {
      lg: { variantId: "52558784659763", price: 37.35 },
      sm: { variantId: "52558864974131", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Aqua_Blossoms.jpg`,
      cutout: `${CDN}/Aqua_Blossoms_45a49da4-1aec-4068-aa11-60c54e3b116f.jpg`,
    },
  },
  {
    id: "classic-fern",
    name: "Classic Fern",
    category: "fern",
    variants: {
      lg: { variantId: "52558786330931", price: 37.35 },
      sm: { variantId: "52558865629491", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/ClassicFern-SmallAcrylicSingleFlower-KHA-010.jpg`,
      cutout: `${CDN}/Classic_Fern_5feee426-8982-43bc-8b6d-bc0b9fd84ed0.jpg`,
    },
  },
  {
    id: "coral-charm-peony",
    name: "Coral Charm Peony",
    category: "peony",
    variants: {
      lg: { variantId: "52558786789683", price: 37.35 },
      sm: { variantId: "52558865793331", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Coral_Charm_Peony.jpg`,
      cutout: `${CDN}/Coral_Charm_Peony_a2d6f9ec-980c-4088-9ae3-5696f1e331ef.jpg`,
    },
  },
  {
    id: "cream-peony",
    name: "Cream Peony",
    category: "peony",
    variants: {
      lg: { variantId: "52558786986291", price: 37.35 },
      sm: { variantId: "52558865957171", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Cream_Peony.jpg`,
      cutout: `${CDN}/Cream_Peony_b4612dc8-5cfa-45cb-b89b-d5aa35dfe2dd.jpg`,
    },
  },
  {
    id: "cupcake-zinnia",
    name: "Cupcake Zinnia",
    category: "zinnia",
    variants: {
      lg: { variantId: "52558787182899", price: 37.35 },
      sm: { variantId: "52558866121011", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Cupcake_Zinnia.jpg`,
      cutout: `${CDN}/Cupcake_Zinnia_70596c82-2644-433f-859e-9dc6521b7d41.jpg`,
    },
  },
  {
    id: "curved-peony",
    name: "Curved Peony",
    category: "peony",
    variants: {
      lg: { variantId: "52558787576115", price: 37.35 },
      sm: { variantId: "52558866284851", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Curved_Peony.jpg`,
      cutout: `${CDN}/Curved_Peony_a2b91aaf-e5f4-4cb2-bcc8-38f89da7db97.jpg`,
    },
  },
  {
    id: "dahlia-blossoms",
    name: "Dahlia Blossoms",
    category: "dahlia",
    variants: {
      lg: { variantId: "52558787805491", price: 37.35 },
      sm: { variantId: "52558866448691", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/DahliaBlossoms-SmallSingleAcrylicFlower-KHA-020.jpg`,
      cutout: `${CDN}/Dahlia_Blossoms_6aac4403-a5e1-4486-a97f-f88dedc45400.jpg`,
    },
  },
  {
    id: "double-zinnia",
    name: "Double Zinnia",
    category: "zinnia",
    variants: {
      lg: { variantId: "52558788002099", price: 37.35 },
      sm: { variantId: "52558866612531", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Double_Zinnia.jpg`,
      cutout: `${CDN}/Double_Zinnia_951ce7cc-6573-4ecf-a5e0-e3ee8e56a69e.jpg`,
    },
  },
  {
    id: "gerbera-daisy",
    name: "Gerbera Daisy",
    category: "other",
    variants: {
      lg: { variantId: "52558788395315", price: 37.35 },
      sm: { variantId: "52558866776371", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/GerberaDaisy-SmallAcrylicSingleFlower-KHA-024.jpg`,
      cutout: `${CDN}/Gerbera_Daisy_484cc24a-7cfc-4f14-ba64-5da978c45a6b.jpg`,
    },
  },
  {
    id: "green-leaves",
    name: "Green Leaves",
    category: "fern",
    variants: {
      lg: { variantId: "52558788690227", price: 37.35 },
      sm: { variantId: "52558866940211", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Green_Leaves.jpg`,
      cutout: `${CDN}/Green_Leaves_076ae0ec-eb81-4ff9-93e8-ccd804926ca0.jpg`,
    },
  },
  {
    id: "hydrangea-royal-blue",
    name: "Hydrangea Royal Blue",
    category: "hydrangea",
    variants: {
      lg: { variantId: "52558789443891", price: 37.35 },
      sm: { variantId: "52558867267891", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/HydrangeaRoyalBlue-LargeAcrylicSingleFlower-KHA-029.jpg`,
      cutout: `${CDN}/Hydrangea_Royal_Blue_db80a37c-84ae-4c35-a2dd-8a86009166ef.jpg`,
    },
  },
  {
    id: "lavender-peony",
    name: "Lavender Peony",
    category: "peony",
    variants: {
      lg: { variantId: "52558789640499", price: 37.35 },
      sm: { variantId: "52558867464499", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Lavender_Peony.jpg`,
      cutout: `${CDN}/Lavender_Peony.jpg`,
    },
  },
  {
    id: "maidenhair-fern",
    name: "Maidenhair Fern",
    category: "fern",
    variants: {
      lg: { variantId: "52558790492467", price: 37.35 },
      sm: { variantId: "52558868021555", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/maidenhairfernacrylicpair.jpg`,
      cutout: `${CDN}/Maidenhair_Fern_057381f8-ab29-49e6-ae53-af5e186f6bb1.jpg`,
    },
  },
  {
    id: "navy-fleur",
    name: "Navy Fleur",
    category: "other",
    variants: {
      lg: { variantId: "52558790689075", price: 37.35 },
      sm: { variantId: "52558868185395", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Navy_Fleur.jpg`,
      cutout: `${CDN}/Navy_Fleur_62f521ef-39a5-4352-aec6-afc6fcb8e477.jpg`,
    },
  },
  {
    id: "orange-berries",
    name: "Orange Berries",
    category: "other",
    variants: {
      lg: { variantId: "52558790885683", price: 37.35 },
      sm: { variantId: "52558868349235", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Orange_Berries.jpg`,
      cutout: `${CDN}/Orange_Berries_244a947d-3997-4c35-8a8d-b48f721a53f2.jpg`,
    },
  },
  {
    id: "orange-ranunculus",
    name: "Orange Ranunculus",
    category: "other",
    variants: {
      lg: { variantId: "52558791082291", price: 37.35 },
      sm: { variantId: "52558868513075", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Orange_Ranunculus.jpg`,
      cutout: `${CDN}/Orange_Ranunculus_bc4a0d16-d45c-4066-89d4-54cac020688f.jpg`,
    },
  },
  {
    id: "peach-blossoms",
    name: "Peach Blossoms",
    category: "blossom",
    variants: {
      lg: { variantId: "52558791704883", price: 37.35 },
      sm: { variantId: "52558868676915", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Peach_Blossoms.jpg`,
      cutout: `${CDN}/Peach_Blossoms_cac4a778-e727-47df-a278-690144068f84.jpg`,
    },
  },
  {
    id: "peach-cosmos",
    name: "Peach Cosmos",
    category: "other",
    variants: {
      lg: { variantId: "52558791934259", price: 37.35 },
      sm: { variantId: "52558868840755", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Peach_Comsmos.jpg`,
      cutout: `${CDN}/Peach_Cosmos_063d342c-d67d-4b9f-bde3-bdc646e2436d.jpg`,
    },
  },
  {
    id: "peach-iceland-poppy",
    name: "Peach Iceland Poppy",
    category: "poppy",
    variants: {
      lg: { variantId: "52558792163635", price: 37.35 },
      sm: { variantId: "52558869004595", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Peach_Iceland_Poppy.jpg`,
      cutout: `${CDN}/Peach_Iceland_Poppy_53fd4d76-fa55-4e1f-8d3c-57d5ac5621e5.jpg`,
    },
  },
  {
    id: "red-zinnia",
    name: "Red Zinnia",
    category: "zinnia",
    variants: {
      lg: { variantId: "52558793408819", price: 37.35 },
      sm: { variantId: "52558869332275", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/RedZinnia-SmallAcrylicSingleFlower-KHA-054.jpg`,
      cutout: `${CDN}/Red_Zinnia_65f52925-6911-43c7-a1f4-b38962c9db8d.jpg`,
    },
  },
  {
    id: "ruffle-amaryllis",
    name: "Ruffle Amaryllis",
    category: "amaryllis",
    variants: {
      lg: { variantId: "52558793605427", price: 37.35 },
      sm: { variantId: "52558873461043", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg`,
      cutout: `${CDN}/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg`,
    },
  },
];

export const stands: StandProduct[] = [
  {
    id: "sm-clear",
    name: "SM Single Stand Clear",
    variantId: "51468138643763",
    price: 19.35,
    image: `${CDN}/KHA-S005_Single_Stand_SM.jpg`,
  },
  {
    id: "lg-leaf",
    name: "LG Single Stand Leaf",
    variantId: "51468139004211",
    price: 23.85,
    image: `${CDN}/KHA-S002_Single_Stand_LG_Leaf.jpg`,
  },
  {
    id: "lg-lotus",
    name: "LG Single Stand Lotus",
    variantId: "51468138905907",
    price: 23.85,
    image: `${CDN}/KHA-S004_Single_Stand_LG_Lotus.jpg`,
  },
  {
    id: "triple-green-lotus",
    name: "Triple Stand Green Lotus",
    variantId: "51468138742067",
    price: 23.85,
    image: `${CDN}/KHA-S003_Triple_Stand_Green_Lotus.jpg`,
  },
  {
    id: "triple-clear",
    name: "Triple Stand Clear",
    variantId: "51468139528499",
    price: 23.85,
    image: `${CDN}/KHA-S007_Triple_Stand.jpg`,
  },
  {
    id: "grasses-double",
    name: "Grasses Double Stand",
    variantId: "51468122423603",
    price: 23.85,
    image: `${CDN}/KHA-S008_Double_Stand.jpg`,
  },
  {
    id: "clover-moss-double",
    name: "Clover and Moss Double Stand",
    variantId: "52858369376563",
    price: 23.85,
    image: `${CDN}/KHA-548_Double_Stand_Pattern_Clover_and_Moss_8b0fac9d-ff2a-4562-ab41-ba62db36815a.jpg`,
  },
];

export const categoryLabels: Record<string, string> = {
  all: "All Flowers",
  peony: "Peonies",
  dahlia: "Dahlias",
  zinnia: "Zinnias",
  poppy: "Poppies",
  hydrangea: "Hydrangeas",
  fern: "Ferns & Foliage",
  blossom: "Blossoms",
  amaryllis: "Amaryllis",
  other: "Other",
};
