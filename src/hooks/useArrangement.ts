import { useCallback, useState } from "react";
import type { ArrangementState } from "../types/canvas";
import type { SlotDef } from "../types/canvas";
import { standConfigs } from "../data/stands";
import { flowers as catalog } from "../data/catalog";

/** Check if a flower has the variant required by a slot's size */
function canFitSlot(productId: string, slot: SlotDef): boolean {
  const product = catalog.find((f) => f.id === productId);
  if (!product) return false;
  const sizeKey = slot.size.toLowerCase() as "lg" | "sm";
  return !!product.variants[sizeKey];
}

function makeInitial(standIndex: number): ArrangementState {
  const flowers: Record<string, string | null> = {};
  for (const slot of standConfigs[standIndex].slots) {
    flowers[slot.key] = null;
  }
  return { flowers, selectedSlot: null, standIndex };
}

export function useArrangement() {
  const [state, setState] = useState<ArrangementState>(makeInitial(0));

  const stand = standConfigs[state.standIndex];

  const selectSlot = useCallback((slotKey: string | null) => {
    setState((s) => ({ ...s, selectedSlot: slotKey }));
  }, []);

  const placeFlower = useCallback((productId: string) => {
    setState((s) => {
      const currentStand = standConfigs[s.standIndex];

      // If a slot is selected, place into that slot (only if flower fits)
      if (s.selectedSlot && s.selectedSlot in s.flowers) {
        const slot = currentStand.slots.find((sl) => sl.key === s.selectedSlot);
        if (slot && canFitSlot(productId, slot)) {
          return {
            ...s,
            flowers: { ...s.flowers, [s.selectedSlot]: productId },
            selectedSlot: null,
          };
        }
        // Flower doesn't fit this slot — ignore
        return s;
      }

      // Otherwise fill the first empty slot that this flower can fit
      for (const slot of currentStand.slots) {
        if (!s.flowers[slot.key] && canFitSlot(productId, slot)) {
          return {
            ...s,
            flowers: { ...s.flowers, [slot.key]: productId },
            selectedSlot: null,
          };
        }
      }

      // All compatible slots full — replace the first compatible slot
      for (const slot of currentStand.slots) {
        if (canFitSlot(productId, slot)) {
          return {
            ...s,
            flowers: { ...s.flowers, [slot.key]: productId },
            selectedSlot: null,
          };
        }
      }

      // No compatible slots at all — do nothing
      return s;
    });
  }, []);

  const removeFlower = useCallback((slotKey: string) => {
    setState((s) => ({
      ...s,
      flowers: { ...s.flowers, [slotKey]: null },
      selectedSlot: null,
    }));
  }, []);

  const setStandIndex = useCallback((index: number) => {
    setState(() => makeInitial(index));
  }, []);

  const clearAll = useCallback(() => {
    setState((s) => makeInitial(s.standIndex));
  }, []);

  return {
    state,
    stand,
    selectSlot,
    placeFlower,
    removeFlower,
    setStandIndex,
    clearAll,
  };
}
