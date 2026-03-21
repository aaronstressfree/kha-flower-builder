import type { StandProduct } from "../../types/product";
import { Plus } from "lucide-react";
import "./FlowerCard.css";

interface Props {
  stand: StandProduct;
  onAdd: () => void;
}

export function StandCard({ stand, onAdd }: Props) {
  return (
    <div className="flower-card" onClick={onAdd}>
      <div className="flower-card-image">
        <img
          src={stand.image}
          alt={stand.name}
          loading="lazy"
        />
        <button className="flower-card-add" aria-label={`Add ${stand.name}`}>
          <Plus size={16} />
        </button>
      </div>
      <div className="flower-card-info">
        <span className="flower-card-name">{stand.name}</span>
        <span className="flower-card-price">${stand.price.toFixed(2)}</span>
      </div>
    </div>
  );
}
