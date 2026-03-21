import { useCallback, useState } from "react";
import type { ArrangementState, SlotPosition } from "../types/canvas";

const initial: ArrangementState = {
  back: { productId: null },
  frontLeft: { productId: null },
  frontRight: { productId: null },
  selectedSlot: null,
  standId: "triple-green-lotus",
};

export function useArrangement() {
  const [state, setState] = useState<ArrangementState>(initial);

  const selectSlot = useCallback((slot: SlotPosition | null) => {
    setState((s) => ({ ...s, selectedSlot: slot }));
  }, []);

  const placeFlower = useCallback((productId: string) => {
    setState((s) => {
      // If a slot is selected, replace that slot
      if (s.selectedSlot) {
        return {
          ...s,
          [s.selectedSlot]: { productId },
          selectedSlot: null,
        };
      }

      // Otherwise fill the first empty slot: back first, then frontLeft, frontRight
      if (!s.back.productId) {
        return { ...s, back: { productId }, selectedSlot: null };
      }
      if (!s.frontLeft.productId) {
        return { ...s, frontLeft: { productId }, selectedSlot: null };
      }
      if (!s.frontRight.productId) {
        return { ...s, frontRight: { productId }, selectedSlot: null };
      }

      // All slots full — replace back by default
      return { ...s, back: { productId }, selectedSlot: null };
    });
  }, []);

  const removeFlower = useCallback((slot: SlotPosition) => {
    setState((s) => ({
      ...s,
      [slot]: { productId: null },
      selectedSlot: null,
    }));
  }, []);

  const setStand = useCallback((standId: string) => {
    setState((s) => ({ ...s, standId }));
  }, []);

  const clearAll = useCallback(() => {
    setState(initial);
  }, []);

  return {
    state,
    selectSlot,
    placeFlower,
    removeFlower,
    setStand,
    clearAll,
  };
}
