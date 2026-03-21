export interface FlowerSlot {
  productId: string | null;
}

export interface ArrangementState {
  back: FlowerSlot;
  frontLeft: FlowerSlot;
  frontRight: FlowerSlot;
  selectedSlot: SlotPosition | null;
  standId: string;
}

export type SlotPosition = "back" | "frontLeft" | "frontRight";
