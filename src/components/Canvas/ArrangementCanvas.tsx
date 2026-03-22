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
      // Reserve space for stand bar + stand picker + padding-bottom
      const reserved = window.innerWidth <= 768 ? 100 : 80;
      const available = h - reserved;
      const maxFlower = Math.max(...stand.slots.map((s) => s.flowerHeight));
      const s = Math.min((available * 0.85) / maxFlower, 1.8);
      setScale(Math.max(s, 0.4));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stand]);

  return (
    <div ref={canvasRef} className="arrangement-canvas" onClick={() => onSelectSlot(null)}>
      <div className="arrangement-group">
          <div className="flowers-row">
            {(() => {
              // For triple: reorder to SM, LG, SM (big flower in center)
              const slots = [...stand.slots];
              if (slots.length === 3) {
                const lg = slots.find(s => s.size === "LG");
                const sms = slots.filter(s => s.size === "SM");
                if (lg && sms.length === 2) {
                  return [sms[0], lg, sms[1]];
                }
              }
              return slots;
            })().map((slot) => (
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
  onSelectSlot,
  onRemoveFlower,
}: {
  slot: (typeof standConfigs)[0]["slots"][0];
  state: ArrangementState;
  scale: number;
  onSelectSlot: (key: string | null) => void;
  onRemoveFlower: (key: string) => void;
}) {
  const productId = state.flowers[slot.key];
  const product = productId ? catalog.find((f) => f.id === productId) : null;
  const isSelected = state.selectedSlot === slot.key;

  const slotHeight = slot.flowerHeight * scale;

  return (
    <div
      className={`slot-area ${isSelected ? "selected" : ""} ${product ? "has-flower" : "empty-slot"}`}
      style={{
        height: slotHeight,
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
