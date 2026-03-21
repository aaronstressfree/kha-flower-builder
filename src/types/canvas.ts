export interface FlowerSlot {
  productId: string | null;
  size: "LG" | "SM";
}

export interface StandConfig {
  id: string;
  name: string;
  variantId: string;
  price: number;
  image: string;
  slots: SlotDef[];
}

export interface SlotDef {
  key: string;
  label: string;
  size: "LG" | "SM";
  // Position as percentages of the composition area
  x: number; // percent from left
  y: number; // percent from bottom (how high the flower sits)
  flowerHeight: number; // height of flower image in px
}

export interface ArrangementState {
  flowers: Record<string, string | null>; // slotKey -> productId
  selectedSlot: string | null;
  standIndex: number;
}
