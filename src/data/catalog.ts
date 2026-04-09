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
    dimensions: { height: 11.4, width: 6.2 },
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
    dimensions: { height: 12, width: 6.7 },
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
    dimensions: { height: 10.6, width: 6 },
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
    dimensions: { height: 11.1, width: 3.9 },
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
    dimensions: { height: 13.2, width: 5.3 },
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
    dimensions: { height: 10.9, width: 4.7 },
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
    dimensions: { height: 11.8, width: 7.2 },
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
    dimensions: { height: 10, width: 4.7 },
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
    dimensions: { height: 13.29, width: 4.62 },
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
    dimensions: { height: 10.96, width: 7.99 },
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
    dimensions: { height: 8.88, width: 6.49 },
    images: {
      thumbnail: `${CDN}/Lavender_Peony_d5512f67-dda9-4d3d-b786-a2ea4d517f03.jpg`,
      cutout: `${CDN}/Lavender_Peony_d5512f67-dda9-4d3d-b786-a2ea4d517f03.jpg`,
    },
  },
  {
    id: "maidenhair-fern",
    name: "Maidenhair Fern",
    category: "fern",
    popular: true,
    variants: {
      lg: { variantId: "52558790492467", price: 37.35 },
      sm: { variantId: "52558868021555", price: 19.35 },
    },
    dimensions: { height: 10.48, width: 4.7 },
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
    dimensions: { height: 13.01, width: 5.88 },
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
    dimensions: { height: 12.82, width: 7.51 },
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
    dimensions: { height: 12.79, width: 5.83 },
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
    dimensions: { height: 11.97, width: 3.3 },
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
    dimensions: { height: 10.95, width: 6.9 },
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
    dimensions: { height: 12.52, width: 3.74 },
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
    dimensions: { height: 12.01, width: 4.87 },
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
    dimensions: { height: 11.7, width: 3.66 },
    images: {
      thumbnail: `${CDN}/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg`,
      cutout: `${CDN}/KHA-155_Ruffle_Amaryllis_7ff0fe5d-a82c-43a6-9862-6c5f15d35a70.jpg`,
    },
  },
  {
    id: "periwinkle-blossoms",
    name: "Periwinkle Blossoms",
    category: "blossom",
    variants: {
      lg: { variantId: "52558792393011", price: 37.35 },
      sm: { variantId: "52558869168435", price: 19.35 },
    },
    dimensions: { height: 13.4, width: 6.7 },
    images: {
      thumbnail: `${CDN}/Periwinkle_Blossoms_712b4e19-31cd-42ff-a347-af73b2228204.jpg`,
      cutout: `${CDN}/Periwinkle_Blossoms_712b4e19-31cd-42ff-a347-af73b2228204.jpg`,
    },
  },
  {
    id: "aphrodite-orchid",
    name: "Aphrodite Orchid",
    category: "orchid",
    popular: true,
    variants: {
      lg: { variantId: "52858353058099", price: 37.35 },
      sm: { variantId: "52858353090867", price: 19.35 },
    },
    dimensions: { height: 13.74, width: 4.35 },
    images: {
      thumbnail: `${CDN}/KHA-480_Aphrodite_Orchid_SM_29d69fbe-b333-4c83-84d1-972a67eb0ca9.jpg`,
      cutout: `${CDN}/KHA-480_Aphrodite_Orchid_SM_29d69fbe-b333-4c83-84d1-972a67eb0ca9.jpg`,
    },
  },
  // Botanical collection
  {
    id: "blue-anemone",
    name: "Blue Anemone",
    category: "blossom",
    variants: {
      lg: { variantId: "52558785052979", price: 37.35 },
      sm: { variantId: "52558865137971", price: 19.35 },
    },
    dimensions: { height: 12.6, width: 8 },
    images: {
      thumbnail: `${CDN}/Blue_Anemone.jpg`,
      cutout: `${CDN}/Blue_Anemone_0a6acb8d-99f1-4a64-b5bd-4eed14423b76.jpg`,
    },
  },
  {
    id: "cafe-au-lait-dahlia",
    name: "Cafe Au Lait Dahlia",
    category: "dahlia",
    variants: {
      lg: { variantId: "52558785642803", price: 37.35 },
      sm: { variantId: "52558865301811", price: 19.35 },
    },
    dimensions: { height: 11.7, width: 5.9 },
    images: {
      thumbnail: `${CDN}/Cafe_Au_Lait_Dahlia.jpg`,
      cutout: `${CDN}/Cafe_Au_Lait_Dahlia_32f1e184-eefe-48a9-976b-2a523fce0905.jpg`,
    },
  },
  {
    id: "carmine-peony",
    name: "Carmine Peony",
    category: "peony",
    variants: {
      lg: { variantId: "52558785937715", price: 37.35 },
      sm: { variantId: "52558865465651", price: 19.35 },
    },
    dimensions: { height: 13.4, width: 5.9 },
    images: {
      thumbnail: `${CDN}/Carmine_Peony.jpg`,
      cutout: `${CDN}/Carmine_Peony_1e67bf73-39c5-4422-9672-cba05a17e4a6.jpg`,
    },
  },
  {
    id: "chrysanthemum",
    name: "Chrysanthemum",
    category: "blossom",
    variants: {
      lg: { variantId: "52558786134323", price: 37.35 },
      sm: { variantId: "52558871822643", price: 19.35 },
    },
    dimensions: { height: 8.7, width: 3.7 },
    images: {
      thumbnail: `${CDN}/Chrysanthemum.jpg`,
      cutout: `${CDN}/Chrysanthemum_LG_KHA-143_697602e2-b84e-4c3d-9341-ef38d3006577.jpg`,
    },
  },
  {
    id: "cockscomb",
    name: "Cockscomb",
    category: "blossom",
    variants: {
      lg: { variantId: "52558786527539", price: 37.35 },
      sm: { variantId: "52558871986483", price: 19.35 },
    },
    dimensions: { height: 13.9, width: 6.4 },
    images: {
      thumbnail: `${CDN}/Cockscomb.jpg`,
      cutout: `${CDN}/Cockscomb_LG_KHA-144_ab42a7f1-3397-454f-b6bf-f74aa02cdc35.jpg`,
    },
  },
  {
    id: "hydrangea-light",
    name: "Hydrangea Light",
    category: "hydrangea",
    variants: {
      lg: { variantId: "52558789247283", price: 37.35 },
      sm: { variantId: "52558867104051", price: 19.35 },
    },
    dimensions: { height: 12.2, width: 5.6 },
    images: {
      thumbnail: `${CDN}/Hydrangea_Light.jpg`,
      cutout: `${CDN}/Hydrangea_Light_e1649a33-e3a0-4c91-9876-1cf8f3955760.jpg`,
    },
  },
  {
    id: "lotus-flower",
    name: "Lotus Flower",
    category: "blossom",
    variants: {
      lg: { variantId: "52558789902643", price: 37.35 },
      sm: { variantId: "52558872150323", price: 19.35 },
    },
    dimensions: { height: 10.33, width: 7.68 },
    images: {
      thumbnail: `${CDN}/Lotus_Flower.jpg`,
      cutout: `${CDN}/Lotus_Flower_LG_KHA-145_c20b38a1-af2f-4577-9ecb-0ea9db2bc54e.jpg`,
    },
  },
  {
    id: "magenta-anemone",
    name: "Magenta Anemone",
    category: "blossom",
    variants: {
      lg: { variantId: "52558790099251", price: 37.35 },
      sm: { variantId: "52558867628339", price: 19.35 },
    },
    dimensions: { height: 9.5, width: 9.5 },
    images: {
      thumbnail: `${CDN}/Magenta_Anemone.jpg`,
      cutout: `${CDN}/Magenta_Anemone_740b178e-f826-458b-b9ef-4f513dfd85a1.jpg`,
    },
  },
  {
    id: "magnolia",
    name: "Magnolia",
    category: "blossom",
    variants: {
      lg: { variantId: "52558790295859", price: 37.35 },
      sm: { variantId: "52558867824947", price: 19.35 },
    },
    dimensions: { height: 10.89, width: 4.15 },
    images: {
      thumbnail: `${CDN}/Magnolia.jpg`,
      cutout: `${CDN}/Magnolia_e4fa9f35-8097-4955-895e-d1362b7edc1b.jpg`,
    },
  },
  {
    id: "pale-yellow-iceland-poppy",
    name: "Pale Yellow Iceland Poppy",
    category: "poppy",
    variants: {
      lg: { variantId: "52558791278899", price: 37.35 },
      sm: { variantId: "52558872314163", price: 19.35 },
    },
    dimensions: { height: 9.6, width: 6.6 },
    images: {
      thumbnail: `${CDN}/Pale_Yellow_Iceland_Poppy.jpg`,
      cutout: `${CDN}/Pale_Yellow_Iceland_Poppy_LG_KHA-146_5474829d-a24d-47f5-82d6-ee07fb6d3c80.jpg`,
    },
  },
  {
    id: "passion-flowers",
    name: "Passion Flowers",
    category: "blossom",
    variants: {
      lg: { variantId: "52558791508275", price: 37.35 },
      sm: { variantId: "52558872478003", price: 19.35 },
    },
    dimensions: { height: 13.5, width: 7.4 },
    images: {
      thumbnail: `${CDN}/Passion_Flowers.jpg`,
      cutout: `${CDN}/Passion_Flowers_LG_KHA-147_aee156d8-e0bf-4c8a-9886-0341994ef3e3.jpg`,
    },
  },
  {
    id: "purple-clematis",
    name: "Purple Clematis",
    category: "blossom",
    popular: true,
    variants: {
      lg: { variantId: "52558792622387", price: 37.35 },
      sm: { variantId: "52558872641843", price: 19.35 },
    },
    dimensions: { height: 12.8, width: 5.3 },
    images: {
      thumbnail: `${CDN}/PurpleClemetis-SmallSingleAcrylicFlower-KHA-140.jpg`,
      cutout: `${CDN}/Purple_Clemetis_LG_KHA-148_9568095a-c7a6-4aaa-a8a1-ea83eaf5c4a6.jpg`,
    },
  },
  {
    id: "red-iceland-poppy",
    name: "Red Iceland Poppy",
    category: "poppy",
    variants: {
      lg: { variantId: "52558792818995", price: 37.35 },
      sm: { variantId: "52558872805683", price: 19.35 },
    },
    dimensions: { height: 12.2, width: 5.3 },
    images: {
      thumbnail: `${CDN}/Red_Iceland_Poppy.jpg`,
      cutout: `${CDN}/Red_Iceland_Poppy_SM_KHA-141_f57c4930-9a3f-40f9-bfcb-2bc93da5c1d8.jpg`,
    },
  },
  // NOTE: scarlet-mauve-peony, small-iceland-poppy, sonic-bloom-dahlia, tulips,
  // spotted-dahlia, strawberry-stalk, strawflower, striped-anemone, sweet-pink-peony,
  // tall-magenta-peony, yellow-ranunculus, moon-orchid, pansy-orchid
  // omitted — Shopify only has product photos or pair photos, no clean UUID cutouts.
  // Re-add when UUID cutouts are uploaded.
  // Wildflower collection
  {
    id: "delphine-flower",
    name: "Delphine Flower",
    category: "wildflower",
    popular: true,
    variants: {
      lg: { variantId: "52858358104371", price: 37.35 },
      sm: { variantId: "52858358137139", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/KHA-509.jpg`,
      cutout: `${CDN}/KHA-509_Delphine_Flower_SM_ffdab3c3-c10e-4d6d-9b49-34e73978286a.jpg`,
    },
  },
  {
    id: "eden-flower",
    name: "Eden Flower",
    category: "wildflower",
    popular: true,
    variants: {
      lg: { variantId: "52858357973299", price: 37.35 },
      sm: { variantId: "52858358006067", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/KHA-511.jpg`,
      cutout: `${CDN}/KHA-512_Eden_Flower_LG_b62d7d6c-ffe2-48e5-b021-27697a0e7352.jpg`,
    },
  },
  {
    id: "meadow-flower",
    name: "Meadow Flower",
    category: "wildflower",
    popular: true,
    variants: {
      lg: { variantId: "52858357842227", price: 37.35 },
      sm: { variantId: "52858357874995", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/KHA-513.jpg`,
      cutout: `${CDN}/KHA-513_Meadow_Flower_SM_6c667589-d961-4d1b-8b06-1908805431b0.jpg`,
    },
  },
  // Orchid collection
  {
    id: "cattleya-orchid",
    name: "Cattleya Orchid",
    category: "orchid",
    variants: {
      lg: { variantId: "52858353549619", price: 37.35 },
      sm: { variantId: "52858353582387", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Cattleya_Orchid_LG_KHA-483.jpg`,
      cutout: `${CDN}/KHA-483_Cattleya_Orchid_LG_8718ef6b-618b-4616-bf11-2dc33cd2dfc8.jpg`,
    },
  },
  {
    id: "coral-orchid",
    name: "Coral Orchid",
    category: "orchid",
    variants: {
      lg: { variantId: "52858353844531", price: 37.35 },
      sm: { variantId: "52858353877299", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Coral_Orchid_LG_KHA-485.jpg`,
      cutout: `${CDN}/KHA-484_Coral_Orchid_SM_e0a3eb8a-6f6a-4293-8521-0857cf80c5ec.jpg`,
    },
  },
  {
    id: "leopard-orchid",
    name: "Leopard Orchid",
    category: "orchid",
    variants: {
      lg: { variantId: "52858354041139", price: 37.35 },
      sm: { variantId: "52858354073907", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Leopard_Orchid_LG_KHA-487.jpg`,
      cutout: `${CDN}/KHA-487_Leopard_Orchid_LG_168e4e0d-1df7-4509-90e3-10ee0ea0cff7.jpg`,
    },
  },
  {
    id: "pink-stripe-orchid",
    name: "Pink Stripe Orchid",
    category: "orchid",
    popular: true,
    variants: {
      lg: { variantId: "52858354499891", price: 37.35 },
      sm: { variantId: "52858354532659", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Pink_Stripe_Orchid_LG_KHA-493.jpg`,
      cutout: `${CDN}/KHA-492_Pink_Stripe_Orchid_SM_680ad2e5-4bd0-473d-9f3e-0a964182b313.jpg`,
    },
  },
  {
    id: "yellow-king-orchid",
    name: "Yellow King Orchid",
    category: "orchid",
    variants: {
      lg: { variantId: "52858354827571", price: 37.35 },
      sm: { variantId: "52858354860339", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Yellow_King_Orchid_LG_KHA-497.jpg`,
      cutout: `${CDN}/KHA-496_Yellow_King_Orchid_SM_2f825380-2981-4afc-a1b7-063ec28567f6.jpg`,
    },
  },
  // Core collection additions
  {
    id: "sunflower",
    name: "Sunflower",
    category: "blossom",
    popular: true,
    variants: {
      lg: { variantId: "52558795243827", price: 37.35 },
      sm: { variantId: "52558870511923", price: 19.35 },
    },
    images: {
      thumbnail: `${CDN}/Sunflower.jpg`,
      cutout: `${CDN}/Sunflower_617f9248-0be1-4fd7-905a-d33cf7a86cfc.jpg`,
    },
  },
  {
    id: "foxglove-flower",
    name: "Foxglove Flower",
    category: "wildflower",
    popular: true,
    variants: {
      lg: { variantId: "52858357514547", price: 37.35 },
      sm: { variantId: "52858357547315", price: 19.35 },
    },
    dimensions: { height: 11.1, width: 4.2 },
    images: {
      thumbnail: `${CDN}/KHA-515.jpg`,
      cutout: `${CDN}/KHA-515_Foxglove_Flower_SM_1dcb31d5-7a16-4ee4-879a-02bb975600b7.jpg`,
    },
  },
  {
    id: "vanda-orchid",
    name: "Vanda Orchid",
    category: "orchid",
    variants: {
      lg: { variantId: "52858354663731", price: 37.35 },
      sm: { variantId: "52858354696499", price: 19.35 },
    },
    dimensions: { height: 12.9, width: 5.8 },
    images: {
      thumbnail: `${CDN}/Vanda_Orchid_LG_KHA-495.jpg`,
      cutout: `${CDN}/KHA-495_Vanda_Orchid_LG_48436e70-86af-4243-a5d3-a7253acc9aea.jpg`,
    },
  },
  {
    id: "thistle-zinnia",
    name: "Thistle Zinnia",
    category: "zinnia",
    variants: {
      lg: { variantId: "52558795833651", price: 37.35 },
      sm: { variantId: "52558871036211", price: 19.35 },
    },
    dimensions: { height: 12.5, width: 6.7 },
    images: {
      thumbnail: `${CDN}/Thistle_Zinnia.jpg`,
      cutout: `${CDN}/Thistle_Zinnia_bc7dcd30-d1d8-4431-9aa2-a4634b9abfb8.jpg`,
    },
  },
  // Holiday collection
  {
    id: "red-orange-amaryllis",
    name: "Red Orange Amaryllis",
    category: "amaryllis",
    variants: {
      lg: { variantId: "52558793015603", price: 37.35 },
      sm: { variantId: "52558873297203", price: 19.35 },
    },
    dimensions: { height: 10.83, width: 4.55 },
    images: {
      thumbnail: `${CDN}/Red_Orange_Amaryllis_LG_KHA-153.jpg`,
      cutout: `${CDN}/KHA-153_Red_Orange_Amaryllis_fc696643-b1b4-40c8-a9e5-4288730a34ef.jpg`,
    },
  },
  {
    id: "red-star-amaryllis",
    name: "Red Star Amaryllis",
    category: "amaryllis",
    variants: {
      lg: { variantId: "52558793212211", price: 37.35 },
      sm: { variantId: "52558873133363", price: 19.35 },
    },
    dimensions: { height: 14.1, width: 6.6 },
    images: {
      thumbnail: `${CDN}/Red_Star_Amaryllis_LG_KHA-151.jpg`,
      cutout: `${CDN}/KHA-151_Red_Star_Amaryllis_bf9ab0d2-d8bd-4f0b-9b9e-fed948471c7a.jpg`,
    },
  },
  {
    id: "white-amaryllis",
    name: "White Amaryllis",
    category: "amaryllis",
    variants: {
      lg: { variantId: "52558796226867", price: 37.35 },
      sm: { variantId: "52558873624883", price: 19.35 },
    },
    dimensions: { height: 14.4, width: 6.1 },
    images: {
      thumbnail: `${CDN}/White_Amaryllis_LG_KHA-157.jpg`,
      cutout: `${CDN}/White_Amaryllis_LG_KHA-157_c8d11664-a12d-4a92-abe3-81e579241b70.jpg`,
    },
  },
  {
    id: "blossom-peacock-amaryllis",
    name: "Blossom Peacock Amaryllis",
    category: "amaryllis",
    variants: {
      lg: { variantId: "52558784856371", price: 37.35 },
      sm: { variantId: "52558873788723", price: 19.35 },
    },
    dimensions: { height: 11.9, width: 7 },
    images: {
      thumbnail: `${CDN}/Blossom_Peacock_Amaryllis_LG_KHA-159.jpg`,
      cutout: `${CDN}/KHA-159_Small_Amaryllis_a20bd175-13e4-449d-91fa-86dedb18b508.jpg`,
    },
  },
  {
    id: "holly-greenery",
    name: "Holly Greenery",
    category: "holiday",
    variants: {
      lg: { variantId: "52558789050675", price: 37.35 },
      sm: { variantId: "52558874706227", price: 19.35 },
    },
    dimensions: { height: 10.4, width: 6.1 },
    images: {
      thumbnail: `${CDN}/Holly_Greenery_LG_KHA-212.jpg`,
      cutout: `${CDN}/Holly_Greenery_LG_KHA-212_21314970-c817-4767-b1cb-5c5c15018d7a.jpg`,
    },
  },
  {
    id: "brewer-spruce",
    name: "Brewer Spruce",
    category: "holiday",
    variants: {
      lg: { variantId: "52558785446195", price: 37.35 },
      sm: { variantId: "52558874476851", price: 19.35 },
    },
    dimensions: { height: 13.3, width: 5.3 },
    images: {
      thumbnail: `${CDN}/Brewer_Spruce_LG_KHA-188.jpg`,
      cutout: `${CDN}/KHA-188_Brewer_Spruce_d13b16ee-a3b2-4dca-9455-089b009d6b85.jpg`,
    },
  },
  {
    id: "hellebore-flower",
    name: "Hellebore Flower",
    category: "holiday",
    variants: {
      lg: { variantId: "52558788886835", price: 37.35 },
    },
    dimensions: { height: 14.2, width: 6.2 },
    images: {
      thumbnail: `${CDN}/HelleboreFlower-LargeAcrylicFlowerKHA-168.jpg`,
      cutout: `${CDN}/KHA-168_Hellebore_Flower_eecfa4cd-f918-42f4-b9d9-d9b575e4a400.jpg`,
    },
  },
  {
    id: "cardinal-with-pine-cones",
    name: "Cardinal with Pine Cones",
    category: "holiday",
    variants: {
      lg: { variantId: "52558785839411", price: 37.35 },
    },
    dimensions: { height: 6.9, width: 6.2 },
    images: {
      thumbnail: `${CDN}/CardinalwithPineCones-LargeKHA-210.jpg`,
      cutout: `${CDN}/Cardinal_with_Pine_Cones_LG_KHA-210_e2143269-79e9-44f9-8bdf-7306604e50db.jpg`,
    },
  },
  // Animals collection
  {
    id: "bluebird-of-happiness",
    name: "Bluebird of Happiness",
    category: "animal",
    popular: true,
    variants: {
      lg: { variantId: "52858356728115", price: 37.35 },
      sm: { variantId: "52858356760883", price: 19.35 },
    },
    dimensions: { height: 8.0, width: 4.5 },
    images: {
      thumbnail: `${CDN}/KHA-539_Bluebird_of_Happiness_SM.jpg`,
      cutout: `${CDN}/KHA-539_Bluebird_of_Happiness_SM_3fd11dec-7d6b-4d2c-9740-b0832e3fb798.jpg`,
    },
  },
  {
    id: "spring-cardinal",
    name: "Spring Cardinal",
    category: "animal",
    popular: true,
    variants: {
      lg: { variantId: "52858356990259", price: 37.35 },
      sm: { variantId: "52858356957491", price: 19.35 },
    },
    dimensions: { height: 8.0, width: 5.75 },
    images: {
      thumbnail: `${CDN}/KHA-541_Spring_Cardinal_SM.jpg`,
      cutout: `${CDN}/KHA-541_Spring_Cardinal_SM_c4d0f76e-863f-4031-8bbe-77e8faa532bf.jpg`,
    },
  },
  {
    id: "hummingbird",
    name: "Hummingbird",
    category: "animal",
    variants: {
      lg: { variantId: "52858376585523", price: 37.35 },
      sm: { variantId: "52858376618291", price: 19.35 },
    },
    dimensions: { height: 6.5, width: 8.0 },
    images: {
      thumbnail: `${CDN}/KHA-604_Hummingbird_SM.jpg`,
      cutout: `${CDN}/KHA-605_Hummingbird_LG_e45e6ebe-3cfd-4003-9f15-08503f90f482.jpg`,
    },
  },
  {
    id: "indigo-bunting-with-clover",
    name: "Indigo Bunting with Clover",
    category: "animal",
    variants: {
      lg: { variantId: "52858357252403", price: 37.35 },
      sm: { variantId: "52858357285171", price: 19.35 },
    },
    dimensions: { height: 8.0, width: 3.75 },
    images: {
      thumbnail: `${CDN}/KHA-535_Indigo_Bunting_with_Clover_SM.jpg`,
      cutout: `${CDN}/KHA-535_Indigo_Bunting_with_Clover_SM_c18ddb1b-1501-43c6-9e34-8185a7e8b685.jpg`,
    },
  },
  {
    id: "running-rabbit",
    name: "Running Rabbit",
    category: "animal",
    variants: {
      lg: { variantId: "52858370326835", price: 37.35 },
      sm: { variantId: "52858370359603", price: 19.35 },
    },
    dimensions: { height: 14.0, width: 7.0 },
    images: {
      thumbnail: `${CDN}/KHA-596_Running_Rabbit_SM.jpg`,
      cutout: `${CDN}/KHA-597_Running_Rabbit_LG_0e71fe30-1098-40c6-83bf-5d325ebaa48c.jpg`,
    },
  },
  {
    id: "chickadee-and-forget-me-nots",
    name: "Chickadee and Forget Me Nots",
    category: "animal",
    variants: {
      lg: { variantId: "52858356597043", price: 37.35 },
      sm: { variantId: "52858356629811", price: 19.35 },
    },
    dimensions: { height: 7.25, width: 6.75 },
    images: {
      thumbnail: `${CDN}/KHA-542_Chicakadee_and_Forget_me_Nots_SM.jpg`,
      cutout: `${CDN}/KHA-542_Chicakadee_and_Forget_me_Nots_SM_c28bd420-0cd0-44b8-96dd-53f24ac94f72.jpg`,
    },
  },
  {
    id: "purple-poppy-mallow-warbler",
    name: "Purple Poppy Mallow Warbler",
    category: "animal",
    variants: {
      lg: { variantId: "52858357121331", price: 37.35 },
      sm: { variantId: "52858357154099", price: 19.35 },
    },
    dimensions: { height: 8.0, width: 7.25 },
    images: {
      thumbnail: `${CDN}/KHA-537_Purple_Poppy_Mallow_Warbler_SM.jpg`,
      cutout: `${CDN}/KHA-537_Purple_Poppy_Mallow_Warbler_SM_f57722dc-617a-4acc-8e37-8a5a483a29a7.jpg`,
    },
  },
  {
    id: "chipping-sparrow-with-daffodils",
    name: "Chipping Sparrow with Daffodils",
    category: "animal",
    variants: {
      lg: { variantId: "52858355876147", price: 37.35 },
      sm: { variantId: "52858355908915", price: 19.35 },
    },
    dimensions: { height: 8.0, width: 5.75 },
    images: {
      thumbnail: `${CDN}/KHA-546_Chipping_Sparrow_with_Daffodils_SM.jpg`,
      cutout: `${CDN}/KHA-546_Chipping_Sparrow_with_Daffodils_SM_40b738d9-b4a7-4c73-952c-6cb069a73703.jpg`,
    },
  },
  {
    id: "robin-and-nasturtiums",
    name: "Robin and Nasturtiums",
    category: "animal",
    variants: {
      lg: { variantId: "52858356171059", price: 37.35 },
      sm: { variantId: "52858356203827", price: 19.35 },
    },
    dimensions: { height: 14.0, width: 7.0 },
    images: {
      thumbnail: `${CDN}/KHA-544_Robin_and_Nasturtiums_SM.jpg`,
      cutout: `${CDN}/KHA-544_Robin_and_Nasturtiums_SM_8e98aba4-574b-4cd6-a8f0-774112262bde.jpg`,
    },
  },
];

export const stands: StandProduct[] = [
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
  {
    id: "poinsettia-double",
    name: "Poinsettia Double Stand",
    variantId: "51778935783731",
    price: 23.85,
    image: `${CDN}/1_-_Poinsettia_Pattern_Double_Stand_KHA-S012.jpg`,
  },
];

export const categoryLabels: Record<string, string> = {
  all: "All",
  popular: "Popular",
  orchid: "Orchids",
  wildflower: "Wildflowers",
  peony: "Peonies",
  dahlia: "Dahlias",
  zinnia: "Zinnias",
  poppy: "Poppies",
  hydrangea: "Hydrangeas",
  fern: "Ferns & Foliage",
  blossom: "Blossoms",
  amaryllis: "Amaryllis",
  holiday: "Holiday",
  animal: "Animals",
  other: "Other",
};
