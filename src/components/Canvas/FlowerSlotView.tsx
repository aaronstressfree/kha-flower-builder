import type { FlowerProduct } from "../../types/product";
import { X } from "lucide-react";
import "./FlowerSlotView.css";

interface Props {
  flower: FlowerProduct | null | undefined;
  size: "LG" | "SM";
  isSelected: boolean;
  isEmpty: boolean;
  label: string;
  onSelect: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
}

export function FlowerSlotView({
  flower,
  size,
  isSelected,
  isEmpty,
  label,
  onSelect,
  onRemove,
}: Props) {
  const slotSize = size === "LG" ? 180 : 130;

  return (
    <div
      className={`flower-slot ${isSelected ? "selected" : ""} ${isEmpty ? "empty" : "filled"}`}
      style={{ width: slotSize, height: slotSize }}
      onClick={onSelect}
    >
      {flower ? (
        <>
          <img
            src={flower.images.cutout}
            alt={flower.name}
            className="flower-slot-image"
          />
          <span className="flower-slot-name">{flower.name}</span>
          <span className="flower-slot-price">
            ${size === "LG" ? flower.variants.lg.price.toFixed(2) : flower.variants.sm.price.toFixed(2)}
          </span>
          {isSelected && (
            <button className="flower-slot-remove" onClick={onRemove}>
              <X size={14} />
            </button>
          )}
        </>
      ) : (
        <div className="flower-slot-empty">
          <span className="flower-slot-label">{label}</span>
          <span className="flower-slot-hint">
            {isSelected ? "Choose a flower" : "Click to select"}
          </span>
        </div>
      )}
    </div>
  );
}
