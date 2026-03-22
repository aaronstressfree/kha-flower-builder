import type { FlowerProduct } from "../../types/product";
import { Plus } from "lucide-react";
import "./FlowerCard.css";

interface Props {
  flower: FlowerProduct;
  onAdd: () => void;
  disabled?: boolean;
  sizeLabel?: string;
}

export function FlowerCard({ flower, onAdd, disabled, sizeLabel }: Props) {
  return (
    <div
      className={`flower-card ${disabled ? "flower-card-disabled" : ""}`}
      onClick={disabled ? undefined : onAdd}
    >
      <div className="flower-card-image">
        <img
          src={`/flowers/${flower.id}.png`}
          alt={flower.name}
        />
        {!disabled && (
          <button className="flower-card-add" aria-label={`Add ${flower.name}`}>
            <Plus size={16} />
          </button>
        )}
        {sizeLabel && (
          <span className="flower-card-size-badge">{sizeLabel}</span>
        )}
      </div>
      <div className="flower-card-info">
        <span className="flower-card-name">{flower.name}</span>
        <span className="flower-card-price">
          {flower.variants.sm && flower.variants.lg
            ? `$${flower.variants.sm.price.toFixed(2)} – $${flower.variants.lg.price.toFixed(2)}`
            : `$${(flower.variants.lg?.price ?? flower.variants.sm?.price ?? 0).toFixed(2)}`}
        </span>
      </div>
    </div>
  );
}
