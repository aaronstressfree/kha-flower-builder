import type { FlowerProduct } from "../../types/product";
import { Plus } from "lucide-react";
import "./FlowerCard.css";

interface Props {
  flower: FlowerProduct;
  onAdd: () => void;
}

export function FlowerCard({ flower, onAdd }: Props) {
  return (
    <div className="flower-card" onClick={onAdd}>
      <div className="flower-card-image">
        <img
          src={`/flowers/${flower.id}.png`}
          alt={flower.name}
        />
        <button className="flower-card-add" aria-label={`Add ${flower.name}`}>
          <Plus size={16} />
        </button>
      </div>
      <div className="flower-card-info">
        <span className="flower-card-name">{flower.name}</span>
        <span className="flower-card-price">
          ${flower.variants.sm.price.toFixed(2)} &ndash; ${flower.variants.lg.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
