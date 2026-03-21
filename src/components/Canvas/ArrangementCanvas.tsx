import type { ArrangementState } from "../../types/canvas";
import type { StandConfig } from "../../types/canvas";
import { flowers as catalog } from "../../data/catalog";
import { standConfigs } from "../../data/stands";
import { X } from "lucide-react";
import "./ArrangementCanvas.css";

interface Props {
  state: ArrangementState;
  stand: StandConfig;
  onSelectSlot: (slotKey: string | null) => void;
  onRemoveFlower: (slotKey: string) => void;
  onChangeStand: (index: number) => void;
}

export function ArrangementCanvas({
  state,
  stand,
  onSelectSlot,
  onRemoveFlower,
  onChangeStand,
}: Props) {
  return (
    <div className="arrangement-canvas" onClick={() => onSelectSlot(null)}>
      {/* Composition area */}
      <div className="composition">
        {/* Flowers layer — behind the stand at the base */}
        <div className="flowers-layer">
          {stand.slots.map((slot) => {
            const productId = state.flowers[slot.key];
            const product = productId
              ? catalog.find((f) => f.id === productId)
              : null;
            const isSelected = state.selectedSlot === slot.key;

            return (
              <div
                key={slot.key}
                className={`flower-position ${isSelected ? "selected" : ""} ${product ? "filled" : "empty"}`}
                style={{
                  left: `${slot.x}%`,
                  bottom: `${slot.y}%`,
                  height: slot.flowerHeight,
                  width: slot.size === "LG" ? 180 : 140,
                  zIndex: slot.key === "back" ? 1 : 3,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSlot(slot.key);
                }}
              >
                {product ? (
                  <>
                    <img
                      src={product.images.cutout}
                      alt={product.name}
                      className="flower-image"
                    />
                    <div className="flower-label">
                      <span className="flower-label-name">{product.name}</span>
                      <span className="flower-label-size">{slot.size}</span>
                    </div>
                    {isSelected && (
                      <button
                        className="flower-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFlower(slot.key);
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className={`empty-slot ${isSelected ? "active" : ""}`}>
                    <span className="empty-slot-label">{slot.label}</span>
                    <span className="empty-slot-size">{slot.size}</span>
                    <span className="empty-slot-hint">
                      {isSelected ? "Pick a flower" : "Click to fill"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stand layer — in front of flower stems */}
        <div className="stand-layer">
          <img
            src={stand.image}
            alt={stand.name}
            className="stand-image"
          />
        </div>
      </div>

      {/* Stand selector */}
      <div className="stand-selector" onClick={(e) => e.stopPropagation()}>
        <span className="stand-selector-label">Stand:</span>
        {standConfigs.map((sc, i) => (
          <button
            key={sc.id}
            className={`stand-option ${state.standIndex === i ? "active" : ""}`}
            onClick={() => onChangeStand(i)}
            title={sc.name}
          >
            <img src={sc.image} alt={sc.name} />
          </button>
        ))}
      </div>
    </div>
  );
}
