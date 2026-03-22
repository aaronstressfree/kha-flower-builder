import { useState } from "react";
import { flowers, categoryLabels } from "../../data/catalog";
import { FlowerCard } from "./FlowerCard";
import "./CatalogPanel.css";

interface Props {
  onAddFlower: (productId: string) => void;
  selectedSlotLabel: string | null;
  selectedSlotSize: "LG" | "SM" | null;
  availableSizes: ("LG" | "SM")[];
}

/** Check if a flower can fit into the current slot context */
function canFlowerFit(
  flower: (typeof flowers)[0],
  selectedSlotSize: "LG" | "SM" | null,
  availableSizes: ("LG" | "SM")[]
): boolean {
  // If a specific slot is selected, flower must have that size variant
  if (selectedSlotSize) {
    const key = selectedSlotSize.toLowerCase() as "lg" | "sm";
    return !!flower.variants[key];
  }
  // Otherwise, flower must fit at least one available slot size
  return availableSizes.some((size) => {
    const key = size.toLowerCase() as "lg" | "sm";
    return !!flower.variants[key];
  });
}

export function CatalogPanel({
  onAddFlower,
  selectedSlotLabel,
  selectedSlotSize,
  availableSizes,
}: Props) {
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
        {filtered.map((flower) => {
          const compatible = canFlowerFit(flower, selectedSlotSize, availableSizes);
          return (
            <FlowerCard
              key={flower.id}
              flower={flower}
              onAdd={() => onAddFlower(flower.id)}
              disabled={!compatible}
              sizeLabel={
                !flower.variants.sm ? "LG only" :
                !flower.variants.lg ? "SM only" :
                undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
