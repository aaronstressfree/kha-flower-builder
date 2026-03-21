import { useState } from "react";
import { flowers, categoryLabels } from "../../data/catalog";
import { FlowerCard } from "./FlowerCard";
import "./CatalogPanel.css";

interface Props {
  onAddFlower: (productId: string) => void;
  selectedSlotLabel: string | null;
}

export function CatalogPanel({ onAddFlower, selectedSlotLabel }: Props) {
  const [category, setCategory] = useState<string>("all");

  const categories = ["all", ...new Set(flowers.map((f) => f.category))];

  const filtered =
    category === "all"
      ? flowers
      : flowers.filter((f) => f.category === category);

  return (
    <div className="catalog-panel">
      <div className="catalog-header">
        <h2 className="catalog-title">Choose Your Flowers</h2>
        {selectedSlotLabel ? (
          <p className="catalog-subtitle swap-mode">
            Pick a flower for the <strong>{selectedSlotLabel}</strong> slot
          </p>
        ) : (
          <p className="catalog-subtitle">
            Click a flower to add it to your arrangement
          </p>
        )}
      </div>
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>
      <div className="catalog-grid">
        {filtered.map((flower) => (
          <FlowerCard
            key={flower.id}
            flower={flower}
            onAdd={() => onAddFlower(flower.id)}
          />
        ))}
      </div>
    </div>
  );
}
