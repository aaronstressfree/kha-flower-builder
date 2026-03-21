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
        {/* Back flowers (behind stand) */}
        {stand.slots
          .filter((s) => s.key === "back" || stand.slots.length === 1)
          .map((slot) => {
            const productId = state.flowers[slot.key];
            const product = productId ? catalog.find((f) => f.id === productId) : null;
            const isSelected = state.selectedSlot === slot.key;
            return (
              <FlowerInSlot
                key={slot.key}
                slot={slot}
                product={product}
                isSelected={isSelected}
                zIndex={2}
                onSelect={() => onSelectSlot(slot.key)}
                onRemove={() => onRemoveFlower(slot.key)}
              />
            );
          })}

        {/* Stand */}
        <div className="stand-base">
          <div
            className="stand-constructed"
            style={{ backgroundImage: `url(/stands/${stand.id}.png)` }}
          >
            <div className="stand-slots-indicator">
              {stand.slots.map((s) => (
                <div key={s.key} className="stand-slot-mark" />
              ))}
            </div>
          </div>
          <div className="stand-shadow" />
        </div>

        {/* Front flowers (in front of stand) */}
        {stand.slots
          .filter((s) => s.key !== "back" && stand.slots.length > 1)
          .map((slot) => {
            const productId = state.flowers[slot.key];
            const product = productId ? catalog.find((f) => f.id === productId) : null;
            const isSelected = state.selectedSlot === slot.key;
            return (
              <FlowerInSlot
                key={slot.key}
                slot={slot}
                product={product}
                isSelected={isSelected}
                zIndex={8}
                onSelect={() => onSelectSlot(slot.key)}
                onRemove={() => onRemoveFlower(slot.key)}
              />
            );
          })}
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

/* Individual flower in a slot */
function FlowerInSlot({
  slot,
  product,
  isSelected,
  zIndex,
  onSelect,
  onRemove,
}: {
  slot: (typeof standConfigs)[0]["slots"][0];
  product: ReturnType<typeof catalog.find> | null;
  isSelected: boolean;
  zIndex: number;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`slot-area ${isSelected ? "selected" : ""} ${product ? "has-flower" : "empty-slot"}`}
      style={{
        left: `${slot.x}%`,
        bottom: `${slot.y}%`,
        height: slot.flowerHeight,
        width: slot.size === "LG" ? 220 : 165,
        zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
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
            <button
              className="slot-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X size={12} />
            </button>
          )}
          <span className="slot-flower-tag">{product.name}</span>
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
}
