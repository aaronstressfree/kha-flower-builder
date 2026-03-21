import { useRef, useEffect, useState } from "react";
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!canvasRef.current) return;
      const h = canvasRef.current.clientHeight;
      const available = h - 200; // reserve for picker + padding
      const maxFlower = Math.max(...stand.slots.map((s) => s.flowerHeight));
      const s = Math.min((available * 0.75) / maxFlower, 1.5);
      setScale(Math.max(s, 0.5));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stand]);

  const backSlot = stand.slots.find((s) => s.key === "back" || s.key === "center" || s.key === "left");
  const frontSlots = stand.slots.filter((s) => s !== backSlot);
  const hasBackAndFront = stand.slots.length > 1 && stand.slots.some((s) => s.key === "back");

  return (
    <div ref={canvasRef} className="arrangement-canvas" onClick={() => onSelectSlot(null)}>
      <div className="composition">
        <div className="arrangement-group">
          {hasBackAndFront ? (
            /* Triple/multi-slot: back flower centered behind front flowers */
            <div className="flowers-layered">
              {/* Back flower — centered, taller */}
              {backSlot && (
                <SlotView
                  slot={backSlot}
                  state={state}
                  scale={scale}
                  isBack
                  onSelectSlot={onSelectSlot}
                  onRemoveFlower={onRemoveFlower}
                />
              )}
              {/* Front flowers row */}
              <div className="front-flowers-row">
                {frontSlots.map((slot) => (
                  <SlotView
                    key={slot.key}
                    slot={slot}
                    state={state}
                    scale={scale}
                    onSelectSlot={onSelectSlot}
                    onRemoveFlower={onRemoveFlower}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Single or double without "back" key */
            <div className="flowers-row">
              {stand.slots.map((slot) => (
                <SlotView
                  key={slot.key}
                  slot={slot}
                  state={state}
                  scale={scale}
                  onSelectSlot={onSelectSlot}
                  onRemoveFlower={onRemoveFlower}
                />
              ))}
            </div>
          )}

          {/* Stand base */}
          <div className="stand-base">
            <div
              className="stand-constructed"
              style={{ width: stand.baseWidth * scale }}
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

/* Reusable slot component */
function SlotView({
  slot,
  state,
  scale,
  isBack,
  onSelectSlot,
  onRemoveFlower,
}: {
  slot: (typeof standConfigs)[0]["slots"][0];
  state: ArrangementState;
  scale: number;
  isBack?: boolean;
  onSelectSlot: (key: string | null) => void;
  onRemoveFlower: (key: string) => void;
}) {
  const productId = state.flowers[slot.key];
  const product = productId ? catalog.find((f) => f.id === productId) : null;
  const isSelected = state.selectedSlot === slot.key;

  return (
    <div
      className={`slot-area ${isSelected ? "selected" : ""} ${product ? "has-flower" : "empty-slot"} ${isBack ? "is-back" : ""}`}
      style={{
        height: slot.flowerHeight * scale,
        width: (slot.size === "LG" ? 180 : 115) * scale,
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
}
