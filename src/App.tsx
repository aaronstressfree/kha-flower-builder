import { useCallback, useRef } from "react";
import { AppLayout } from "./components/Layout/AppLayout";
import { CatalogPanel } from "./components/Catalog/CatalogPanel";
import { ArrangementCanvas } from "./components/Canvas/ArrangementCanvas";
import { CartBar } from "./components/Cart/CartBar";
import { useArrangement } from "./hooks/useArrangement";
import { useCart } from "./hooks/useCart";

export default function App() {
  const {
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
  } = useArrangement();

  const { total, itemCount, checkout } = useCart(state);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddFlower = useCallback(
    (productId: string) => {
      const canvas = document.querySelector(".arrangement-canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 + (Math.random() - 0.5) * 200;
      const y = rect.height / 2 + (Math.random() - 0.5) * 200;
      addFlower(productId, x, y);
    },
    [addFlower]
  );

  const handleAddStand = useCallback(
    (productId: string) => {
      const canvas = document.querySelector(".arrangement-canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 + (Math.random() - 0.5) * 100;
      const y = rect.height * 0.75 + (Math.random() - 0.5) * 50;
      addStand(productId, x, y);
    },
    [addStand]
  );

  return (
    <AppLayout
      sidebar={
        <CatalogPanel
          onAddFlower={handleAddFlower}
          onAddStand={handleAddStand}
        />
      }
      canvas={
        <div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
          <ArrangementCanvas
            state={state}
            onSelect={select}
            onMove={moveItem}
            onToggleSize={toggleSize}
            onRotate={rotate}
            onFlip={flip}
            onBringToFront={bringToFront}
            onRemove={removeItem}
          />
        </div>
      }
      cartBar={
        <CartBar
          itemCount={itemCount}
          total={total}
          onCheckout={checkout}
          onClear={clearAll}
        />
      }
    />
  );
}
