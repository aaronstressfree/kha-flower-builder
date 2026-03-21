import { useRef, useCallback, useEffect } from "react";
import type { CanvasStand } from "../../types/canvas";
import type { StandProduct } from "../../types/product";
import { X } from "lucide-react";
import "./PlacedFlower.css";

interface Props {
  stand: CanvasStand;
  product: StandProduct;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
}

export function PlacedStand({
  stand,
  product,
  isSelected,
  onSelect,
  onMove,
  onRemove,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect();
      dragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { x: stand.position.x, y: stand.position.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onSelect, stand.position.x, stand.position.y]
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

  return (
    <div
      ref={ref}
      className={`placed-stand ${isSelected ? "selected" : ""}`}
      style={{
        left: stand.position.x,
        top: stand.position.y,
        zIndex: stand.zIndex,
        width: 80,
        height: 80,
        transform: "translate(-50%, -50%)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img
        src={product.image}
        alt={product.name}
        draggable={false}
      />
      {isSelected && (
        <button className="stand-remove" onClick={onRemove}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
