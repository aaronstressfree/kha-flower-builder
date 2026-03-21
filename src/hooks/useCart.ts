import { useMemo } from "react";
import type { ArrangementState } from "../types/canvas";
import { flowers as catalog, stands as standCatalog } from "../data/catalog";

export function useCart(state: ArrangementState) {
  const total = useMemo(() => {
    let sum = 0;
    for (const f of state.flowers) {
      const product = catalog.find((p) => p.id === f.productId);
      if (product) {
        sum += f.size === "LG" ? product.variants.lg.price : product.variants.sm.price;
      }
    }
    for (const s of state.stands) {
      const product = standCatalog.find((p) => p.id === s.productId);
      if (product) {
        sum += product.price;
      }
    }
    return sum;
  }, [state.flowers, state.stands]);

  const itemCount = state.flowers.length + state.stands.length;

  const cartUrl = useMemo(() => {
    const counts = new Map<string, number>();

    for (const f of state.flowers) {
      const product = catalog.find((p) => p.id === f.productId);
      if (!product) continue;
      const vid =
        f.size === "LG"
          ? product.variants.lg.variantId
          : product.variants.sm.variantId;
      counts.set(vid, (counts.get(vid) || 0) + 1);
    }

    for (const s of state.stands) {
      const product = standCatalog.find((p) => p.id === s.productId);
      if (!product) continue;
      counts.set(product.variantId, (counts.get(product.variantId) || 0) + 1);
    }

    const items = Array.from(counts.entries())
      .map(([vid, qty]) => `${vid}:${qty}`)
      .join(",");

    return `https://www.kimberlyhodges.com/cart/${items}`;
  }, [state.flowers, state.stands]);

  const checkout = () => {
    if (itemCount === 0) return;
    window.open(cartUrl, "_blank");
  };

  return { total, itemCount, cartUrl, checkout };
}
