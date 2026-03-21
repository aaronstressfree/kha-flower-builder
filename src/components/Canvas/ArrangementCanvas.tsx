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
      <div className="composition">
        <div className="arrangement-group">
          {/* Flowers in a row, aligned to bottom */}
          <div className="flowers-row">
            {stand.slots.map((slot) => {
              const productId = state.flowers[slot.key];
              const product = productId
                ? catalog.find((f) => f.id === productId)
                : null;
              const isSelected = state.selectedSlot === slot.key;

              return (
                <div
                  key={slot.key}
                  className={`slot-area ${isSelected ? "selected" : ""} ${product ? "has-flower" : "empty-slot"}`}
                  style={{
                    height: slot.flowerHeight,
                    width: slot.size === "LG" ? 240 : 145,
                    zIndex: slot.key === "back" ? 1 : 4,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSlot(slot.key);
                  }}
                >
                  {product ? (
                    <>
                      <img
                        src={`/flowers/${product.id}.png`}
                        alt={product.name}
                        className="slot-flower-img"
                      />
                      {isSelected && (
                        <>
                          <button
                            className="slot-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFlower(slot.key);
                            }}
                          >
                            <X size={12} />
                          </button>
                          <span className="slot-flower-tag">{product.name}</span>
                        </>
                      )}
                    </>
                  ) : (
                    <div className={`slot-placeholder ${isSelected ? "active" : ""}`}>
                      <div className="slot-placeholder-icon">+</div>
                      <span className="slot-placeholder-label">{slot.label}</span>
                      <span className="slot-placeholder-size">{slot.size}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stand base — width varies by stand type */}
          <div className="stand-base">
            <div
              className="stand-constructed"
              style={{ width: stand.baseWidth }}
            >
              <div className="stand-slots-indicator">
                {stand.slots.map((s) => (
                  <div key={s.key} className="stand-slot-mark" />
                ))}
              </div>
            </div>
            <div className="stand-shadow" />
          </div>
        </div>
      </div>

      {/* Stand picker */}
      <div className="stand-picker" onClick={(e) => e.stopPropagation()}>
        <span className="stand-picker-label">Choose Stand</span>
        <div className="stand-picker-options">
          {standConfigs.map((sc, i) => (
            <button
              key={sc.id}
              className={`stand-pick ${state.standIndex === i ? "active" : ""}`}
              onClick={() => onChangeStand(i)}
              title={sc.name}
            >
              <img src={`/stands/${sc.id}.png`} alt={sc.name} />
              <span className="stand-pick-name">{sc.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
