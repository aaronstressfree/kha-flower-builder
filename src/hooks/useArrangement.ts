import { useCallback, useState } from "react";
import type { ArrangementState, CanvasFlower, CanvasStand } from "../types/canvas";

let nextId = 1;
function genId() {
  return `item-${nextId++}`;
}

const initial: ArrangementState = {
  flowers: [],
  stands: [],
  nextZIndex: 1,
  selectedId: null,
};

export function useArrangement() {
  const [state, setState] = useState<ArrangementState>(initial);

  const addFlower = useCallback((productId: string, x: number, y: number) => {
    setState((s) => {
      const flower: CanvasFlower = {
        instanceId: genId(),
        productId,
        size: "LG",
        position: { x, y },
        zIndex: s.nextZIndex,
        rotation: 0,
        flipped: false,
      };
      return {
        ...s,
        flowers: [...s.flowers, flower],
        nextZIndex: s.nextZIndex + 1,
        selectedId: flower.instanceId,
      };
    });
  }, []);

  const addStand = useCallback((productId: string, x: number, y: number) => {
    setState((s) => {
      const stand: CanvasStand = {
        instanceId: genId(),
        productId,
        position: { x, y },
        zIndex: 0,
      };
      return {
        ...s,
        stands: [...s.stands, stand],
        selectedId: stand.instanceId,
      };
    });
  }, []);

  const select = useCallback((id: string | null) => {
    setState((s) => ({ ...s, selectedId: id }));
  }, []);

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setState((s) => ({
      ...s,
      flowers: s.flowers.map((f) =>
        f.instanceId === id ? { ...f, position: { x, y } } : f
      ),
      stands: s.stands.map((st) =>
        st.instanceId === id ? { ...st, position: { x, y } } : st
      ),
    }));
  }, []);

  const toggleSize = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flowers: s.flowers.map((f) =>
        f.instanceId === id
          ? { ...f, size: f.size === "LG" ? "SM" : "LG" }
          : f
      ),
    }));
  }, []);

  const rotate = useCallback((id: string, degrees: number) => {
    setState((s) => ({
      ...s,
      flowers: s.flowers.map((f) =>
        f.instanceId === id
          ? { ...f, rotation: (f.rotation + degrees) % 360 }
          : f
      ),
    }));
  }, []);

  const flip = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flowers: s.flowers.map((f) =>
        f.instanceId === id ? { ...f, flipped: !f.flipped } : f
      ),
    }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flowers: s.flowers.map((f) =>
        f.instanceId === id ? { ...f, zIndex: s.nextZIndex } : f
      ),
      nextZIndex: s.nextZIndex + 1,
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flowers: s.flowers.filter((f) => f.instanceId !== id),
      stands: s.stands.filter((st) => st.instanceId !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState(initial);
  }, []);

  return {
    state,
    addFlower,
    addStand,
    select,
    moveItem,
    toggleSize,
    rotate,
    flip,
    bringToFront,
    removeItem,
    clearAll,
  };
}
