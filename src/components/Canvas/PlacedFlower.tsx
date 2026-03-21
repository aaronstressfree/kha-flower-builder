import { useRef, useCallback, useEffect } from "react";
import type { CanvasFlower } from "../../types/canvas";
import type { FlowerProduct } from "../../types/product";
import { FlowerControls } from "./FlowerControls";
import "./PlacedFlower.css";

interface Props {
  flower: CanvasFlower;
  product: FlowerProduct;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onToggleSize: () => void;
  onRotate: (degrees: number) => void;
  onFlip: () => void;
  onBringToFront: () => void;
  onRemove: () => void;
}

export function PlacedFlower({
  flower,
  product,
  isSelected,
  onSelect,
  onMove,
  onToggleSize,
  onRotate,
  onFlip,
  onBringToFront,
  onRemove,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const size = flower.size === "LG" ? 160 : 110;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect();
      dragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { x: flower.position.x, y: flower.position.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onSelect, flower.position.x, flower.position.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      onMove(startPos.current.x + dx, startPos.current.y + dy);
    },
    [onMove]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (dragging.current) e.preventDefault();
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  const transform = [
    `translate(-50%, -50%)`,
    `rotate(${flower.rotation}deg)`,
    flower.flipped ? `scaleX(-1)` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={`placed-flower ${isSelected ? "selected" : ""}`}
      style={{
        left: flower.position.x,
        top: flower.position.y,
        zIndex: flower.zIndex,
        width: size,
        height: size,
        transform,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img
        src={product.images.cutout}
        alt={product.name}
        draggable={false}
      />
      {isSelected && (
        <FlowerControls
          size={flower.size}
          onToggleSize={onToggleSize}
          onRotateLeft={() => onRotate(-15)}
          onRotateRight={() => onRotate(15)}
          onFlip={onFlip}
          onBringToFront={onBringToFront}
          onRemove={onRemove}
        />
      )}
    </div>
  );
}
