export interface CanvasFlower {
  instanceId: string;
  productId: string;
  size: "LG" | "SM";
  position: { x: number; y: number };
  zIndex: number;
  rotation: number;
  flipped: boolean;
}

export interface CanvasStand {
  instanceId: string;
  productId: string;
  position: { x: number; y: number };
  zIndex: number;
}

export interface ArrangementState {
  flowers: CanvasFlower[];
  stands: CanvasStand[];
  nextZIndex: number;
  selectedId: string | null;
}
