import { useMemo } from "react";
import type { ArrangementState } from "../types/canvas";
import type { StandConfig } from "../types/canvas";
import { flowers as catalog } from "../data/catalog";

export function useCart(state: ArrangementState, stand: StandConfig) {
  const total = useMemo(() => {
    let sum = stand.price;

    for (const slot of stand.slots) {
      const pid = state.flowers[slot.key];
      if (pid) {
        const product = catalog.find((f) => f.id === pid);
        if (product) {
          sum += slot.size === "LG" ? product.variants.lg.price : product.variants.sm.price;
        }
      }
    }

    return sum;
  }, [state.flowers, stand]);

  const filledCount = Object.values(state.flowers).filter(Boolean).length;

  const cartUrl = useMemo(() => {
    const counts = new Map<string, number>();
    counts.set(stand.variantId, 1);

    for (const slot of stand.slots) {
      const pid = state.flowers[slot.key];
      if (pid) {
        const product = catalog.find((f) => f.id === pid);
        if (product) {
          const vid = slot.size === "LG"
            ? product.variants.lg.variantId
            : product.variants.sm.variantId;
          counts.set(vid, (counts.get(vid) || 0) + 1);
        }
      }
    }

    const items = Array.from(counts.entries())
      .map(([vid, qty]) => `${vid}:${qty}`)
      .join(",");

    return `https://www.kimberlyhodges.com/cart/${items}`;
  }, [state.flowers, stand]);

  const checkout = () => {
    if (filledCount === 0) return;
    window.open(cartUrl, "_blank");
  };

  return { total, filledCount, cartUrl, checkout };
}
