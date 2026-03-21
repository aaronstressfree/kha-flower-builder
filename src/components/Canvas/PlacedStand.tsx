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
  onDrag: (clientX: number, clientY: number) => void;
  onRemove: () => void;
}

export function PlacedStand({
  stand,
  product,
  isSelected,
  onSelect,
  onDrag,
  onRemove,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect();
      dragging.current = true;
      offset.current = {
        x: e.clientX - stand.position.x,
        y: e.clientY - stand.position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onSelect, stand.position.x, stand.position.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      onDrag(e.clientX - offset.current.x, e.clientY - offset.current.y);
    },
    [onDrag]
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
