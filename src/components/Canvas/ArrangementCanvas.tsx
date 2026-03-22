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
      const available = h - 40; // just a small padding
      const maxFlower = Math.max(...stand.slots.map((s) => s.flowerHeight));
      const s = Math.min((available * 0.85) / maxFlower, 1.8);
      setScale(Math.max(s, 0.5));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stand]);

  const hasBackAndFront = stand.slots.length > 1 && stand.slots.some((s) => s.key === "back");

  return (
    <div ref={canvasRef} className="arrangement-canvas" onClick={() => onSelectSlot(null)}>
      <div className="arrangement-group">
        {hasBackAndFront ? (
          <div className="flowers-layered">
            {/* Back flower centered behind front */}
            {stand.slots
              .filter((s) => s.key === "back")
              .map((slot) => (
                <SlotView
                  key={slot.key}
                  slot={slot}
                  state={state}
                  scale={scale}
                  isBack
                  onSelectSlot={onSelectSlot}
                  onRemoveFlower={onRemoveFlower}
                />
              ))}
            <div className="front-flowers-row">
              {stand.slots
                .filter((s) => s.key !== "back")
                .map((slot) => (
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

      {/* Floating stand picker */}
      <div className="stand-float" onClick={(e) => e.stopPropagation()}>
        <span className="stand-float-label">Stand</span>
        <div className="stand-float-options">
          {standConfigs.map((sc, i) => (
            <button
              key={sc.id}
              className={`stand-float-pick ${state.standIndex === i ? "active" : ""}`}
              onClick={() => onChangeStand(i)}
            >
              <img src={`/stands/${sc.id}.png`} alt={sc.name} />
              <div className="stand-float-preview">
                <img src={`/stands/${sc.id}.png`} alt={sc.name} />
                <span>{sc.name}</span>
                <span className="stand-float-preview-slots">
                  {sc.slots.length === 1
                    ? sc.slots[0].size === "LG" ? "1 Large flower" : "1 Small flower"
                    : sc.slots.filter(s => s.size === "LG").length + " Large + " +
                      sc.slots.filter(s => s.size === "SM").length + " Small"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
        width: (slot.size === "LG" ? 160 : 110) * scale,
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
