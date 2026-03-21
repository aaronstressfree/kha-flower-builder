import { useCallback, useState } from "react";
import type { ArrangementState } from "../types/canvas";
import { standConfigs } from "../data/stands";

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

      // If a slot is selected, place into that slot
      if (s.selectedSlot && s.selectedSlot in s.flowers) {
        return {
          ...s,
          flowers: { ...s.flowers, [s.selectedSlot]: productId },
          selectedSlot: null,
        };
      }

      // Otherwise fill the first empty slot
      for (const slot of currentStand.slots) {
        if (!s.flowers[slot.key]) {
          return {
            ...s,
            flowers: { ...s.flowers, [slot.key]: productId },
            selectedSlot: null,
          };
        }
      }

      // All full — replace the first slot
      const firstKey = currentStand.slots[0].key;
      return {
        ...s,
        flowers: { ...s.flowers, [firstKey]: productId },
        selectedSlot: null,
      };
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
