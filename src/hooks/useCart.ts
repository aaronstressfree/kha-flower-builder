import { useMemo } from "react";
import type { ArrangementState } from "../types/canvas";
import { flowers as catalog, stands as standCatalog } from "../data/catalog";

export function useCart(state: ArrangementState) {
  const total = useMemo(() => {
    let sum = 0;

    // Stand price
    const stand = standCatalog.find((s) => s.id === state.standId);
    if (stand) sum += stand.price;

    // Back flower = LG
    if (state.back.productId) {
      const p = catalog.find((f) => f.id === state.back.productId);
      if (p) sum += p.variants.lg.price;
    }

    // Front flowers = SM
    if (state.frontLeft.productId) {
      const p = catalog.find((f) => f.id === state.frontLeft.productId);
      if (p) sum += p.variants.sm.price;
    }
    if (state.frontRight.productId) {
      const p = catalog.find((f) => f.id === state.frontRight.productId);
      if (p) sum += p.variants.sm.price;
    }

    return sum;
  }, [state]);

  const filledCount = [state.back, state.frontLeft, state.frontRight].filter(
    (s) => s.productId
  ).length;

  const cartUrl = useMemo(() => {
    const counts = new Map<string, number>();

    // Always include the stand
    const stand = standCatalog.find((s) => s.id === state.standId);
    if (stand) {
      counts.set(stand.variantId, 1);
    }

    // Back = LG variant
    if (state.back.productId) {
      const p = catalog.find((f) => f.id === state.back.productId);
      if (p) {
        const vid = p.variants.lg.variantId;
        counts.set(vid, (counts.get(vid) || 0) + 1);
      }
    }

    // Front = SM variants
    for (const slot of [state.frontLeft, state.frontRight]) {
      if (slot.productId) {
        const p = catalog.find((f) => f.id === slot.productId);
        if (p) {
          const vid = p.variants.sm.variantId;
          counts.set(vid, (counts.get(vid) || 0) + 1);
        }
      }
    }

    const items = Array.from(counts.entries())
      .map(([vid, qty]) => `${vid}:${qty}`)
      .join(",");

    return `https://www.kimberlyhodges.com/cart/${items}`;
  }, [state]);

  const checkout = () => {
    if (filledCount === 0) return;
    window.open(cartUrl, "_blank");
  };

  return { total, filledCount, cartUrl, checkout };
}
