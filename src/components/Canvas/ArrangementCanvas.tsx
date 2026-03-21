import { useRef, useCallback } from "react";
import type { ArrangementState } from "../../types/canvas";
import { flowers as catalog, stands as standCatalog } from "../../data/catalog";
import { PlacedFlower } from "./PlacedFlower";
import { PlacedStand } from "./PlacedStand";
import "./ArrangementCanvas.css";

interface Props {
  state: ArrangementState;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onToggleSize: (id: string) => void;
  onRotate: (id: string, degrees: number) => void;
  onFlip: (id: string) => void;
  onBringToFront: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ArrangementCanvas({
  state,
  onSelect,
  onMove,
  onToggleSize,
  onRotate,
  onFlip,
  onBringToFront,
  onRemove,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onSelect(null);
      }
    },
    [onSelect]
  );

  const handleDrag = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      onMove(id, x, y);
    },
    [onMove]
  );

  const isEmpty = state.flowers.length === 0 && state.stands.length === 0;

  return (
    <div
      className="arrangement-canvas"
      ref={canvasRef}
      onClick={handleCanvasClick}
    >
      {isEmpty && (
        <div className="canvas-empty">
          <p className="canvas-empty-text">
            Click a flower to add it to your arrangement
          </p>
          <p className="canvas-empty-hint">
            Then drag, resize, rotate, and flip to create your perfect display
          </p>
        </div>
      )}

      {state.stands.map((stand) => {
        const product = standCatalog.find((s) => s.id === stand.productId);
        if (!product) return null;
        return (
          <PlacedStand
            key={stand.instanceId}
            stand={stand}
            product={product}
            isSelected={state.selectedId === stand.instanceId}
            onSelect={() => onSelect(stand.instanceId)}
            onDrag={(cx, cy) => handleDrag(stand.instanceId, cx, cy)}
            onRemove={() => onRemove(stand.instanceId)}
          />
        );
      })}

      {state.flowers.map((flower) => {
        const product = catalog.find((f) => f.id === flower.productId);
        if (!product) return null;
        return (
          <PlacedFlower
            key={flower.instanceId}
            flower={flower}
            product={product}
            isSelected={state.selectedId === flower.instanceId}
            onSelect={() => onSelect(flower.instanceId)}
            onDrag={(cx, cy) => handleDrag(flower.instanceId, cx, cy)}
            onToggleSize={() => onToggleSize(flower.instanceId)}
            onRotate={(deg) => onRotate(flower.instanceId, deg)}
            onFlip={() => onFlip(flower.instanceId)}
            onBringToFront={() => onBringToFront(flower.instanceId)}
            onRemove={() => onRemove(flower.instanceId)}
          />
        );
      })}
    </div>
  );
}
