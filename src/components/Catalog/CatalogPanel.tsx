import { useState } from "react";
import { flowers, stands, categoryLabels } from "../../data/catalog";
import { FlowerCard } from "./FlowerCard";
import { StandCard } from "./StandCard";
import "./CatalogPanel.css";

interface Props {
  onAddFlower: (productId: string) => void;
  onAddStand: (productId: string) => void;
}

type Tab = "flowers" | "stands";

export function CatalogPanel({ onAddFlower, onAddStand }: Props) {
  const [tab, setTab] = useState<Tab>("flowers");
  const [category, setCategory] = useState<string>("all");

  const categories = ["all", ...new Set(flowers.map((f) => f.category))];

  const filtered =
    category === "all"
      ? flowers
      : flowers.filter((f) => f.category === category);

  return (
    <div className="catalog-panel">
      <div className="catalog-tabs">
        <button
          className={`catalog-tab ${tab === "flowers" ? "active" : ""}`}
          onClick={() => setTab("flowers")}
        >
          Flowers
        </button>
        <button
          className={`catalog-tab ${tab === "stands" ? "active" : ""}`}
          onClick={() => setTab("stands")}
        >
          Stands
        </button>
      </div>

      {tab === "flowers" && (
        <>
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
        </>
      )}

      {tab === "stands" && (
        <div className="catalog-grid stands-grid">
          {stands.map((stand) => (
            <StandCard
              key={stand.id}
              stand={stand}
              onAdd={() => onAddStand(stand.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
