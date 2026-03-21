export type FlowerCategory =
  | "peony"
  | "dahlia"
  | "zinnia"
  | "poppy"
  | "hydrangea"
  | "fern"
  | "blossom"
  | "amaryllis"
  | "other";

export interface FlowerProduct {
  id: string;
  name: string;
  category: FlowerCategory;
  variants: {
    lg: { variantId: string; price: number };
    sm: { variantId: string; price: number };
  };
  images: {
    thumbnail: string;
    cutout: string;
  };
}

export interface StandProduct {
  id: string;
  name: string;
  variantId: string;
  price: number;
  image: string;
}
