import { useRef, useEffect, useState } from "react";
import type { ArrangementState } from "../../types/canvas";
import type { StandConfig } from "../../types/canvas";
import { flowers as catalog } from "../../data/catalog";
import { standConfigs } from "../../data/stands";
import { X } from "lucide-react";
import "./ArrangementCanvas.css";

function getSlotWidths(viewportWidth: number) {
  if (viewportWidth <= 768) return { lg: 120, sm: 72 };
  return { lg: 160, sm: 96 };
}

function getOverlapMargin(
  slotCount: number,
  scale: number,
  wide: boolean,
): number {
  if (slotCount === 1) return 0;
  if (slotCount === 2) return -(wide ? 50 : 22) * scale;
  return -(wide ? 55 : 25) * scale;
}

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
  const [canvasWidth, setCanvasWidth] = useState(800);

  useEffect(() => {
    const measure = () => {
      if (!canvasRef.current) return;
      const h = canvasRef.current.clientHeight;
      const vw = window.innerWidth;
      const mobile = vw <= 768;
      const reserved = mobile ? 60 : 75;
      const available = h - reserved;
      const maxFlower = Math.max(...stand.slots.map((s) => s.flowerHeight));
      const fillFactor = mobile ? 0.9 : 0.82;
      const s = Math.min((available * fillFactor) / maxFlower, 3.5);
      setScale(Math.max(s, 0.5));
      setCanvasWidth(vw);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stand]);

  const isWide = canvasWidth > 768;
  const slotWidths = getSlotWidths(canvasWidth);
  const slotCount = stand.slots.length;
  const overlapMargin = getOverlapMargin(slotCount, scale, isWide);

  // For double stands (LG+SM), the wider LG slot shifts the visual center
  // rightward. Compensate by shifting the row left to center over the stand.
  const hasAsymmetricSlots =
    slotCount === 2 &&
    stand.slots.some((s) => s.size === "LG") &&
    stand.slots.some((s) => s.size === "SM");
  const centeringOffset = hasAsymmetricSlots
    ? ((slotWidths.lg - slotWidths.sm) * scale) / 4
    : 0;

  const displaySlots = (() => {
    const slots = [...stand.slots];
    if (slots.length === 3) {
      const lg = slots.find((s) => s.size === "LG");
      const sms = slots.filter((s) => s.size === "SM");
      if (lg && sms.length === 2) return [sms[0], lg, sms[1]];
    }
    return slots;
  })();

  const flowersRowRef = useRef<HTMLDivElement>(null);

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!flowersRowRef.current || displaySlots.length <= 1) {
      if (displaySlots.length === 1) {
        const key = displaySlots[0].key;
        onSelectSlot(state.selectedSlot === key ? null : key);
      }
      return;
    }

    const rect = flowersRowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relX = x / rect.width;

    if (displaySlots.length === 3) {
      const sel =
        relX < 0.33 ? displaySlots[0].key :
        relX > 0.67 ? displaySlots[2].key :
        displaySlots[1].key;
      onSelectSlot(state.selectedSlot === sel ? null : sel);
    } else {
      const sel = relX < 0.5 ? displaySlots[0].key : displaySlots[1].key;
      onSelectSlot(state.selectedSlot === sel ? null : sel);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="arrangement-canvas"
      onClick={() => onSelectSlot(null)}
    >
      <div className="arrangement-group">
        <div
          ref={flowersRowRef}
          className="flowers-row"
          onClick={handleRowClick}
          style={
            centeringOffset
              ? { transform: `translateX(-${centeringOffset}px)` }
              : undefined
          }
        >
          {displaySlots.map((slot) => (
            <SlotView
              key={slot.key}
              slot={slot}
              state={state}
              scale={scale}
              slotWidths={slotWidths}
              overlapMargin={overlapMargin}
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
                    ? sc.slots[0].size === "LG"
                      ? "1 Large flower"
                      : "1 Small flower"
                    : sc.slots.filter((s) => s.size === "LG").length +
                      " Large + " +
                      sc.slots.filter((s) => s.size === "SM").length +
                      " Small"}
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
  slotWidths,
  overlapMargin,
  onRemoveFlower,
}: {
  slot: (typeof standConfigs)[0]["slots"][0];
  state: ArrangementState;
  scale: number;
  slotWidths: { lg: number; sm: number };
  overlapMargin: number;
  onRemoveFlower: (key: string) => void;
}) {
  const productId = state.flowers[slot.key];
  const product = productId ? catalog.find((f) => f.id === productId) : null;
  const isSelected = state.selectedSlot === slot.key;

  const slotHeight = slot.flowerHeight * scale;
  const slotWidth = (slot.size === "LG" ? slotWidths.lg : slotWidths.sm) * scale;

  return (
    <div
      className={`slot-area ${isSelected ? "selected" : ""} ${product ? "has-flower" : "empty-slot"}`}
      style={{
        height: slotHeight,
        width: slotWidth,
        marginLeft: overlapMargin || undefined,
        marginRight: overlapMargin || undefined,
        zIndex: isSelected ? 10 : !product ? 6 : slot.size === "SM" ? 2 : 1,
      }}
    >
      {product ? (
        <div className="slot-hit-target">
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
                onRemoveFlower(slot.key);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className={`slot-add-btn ${isSelected ? "active" : ""}`}>
          <span className="slot-add-icon">+</span>
          <span className="slot-add-size">{slot.size}</span>
        </div>
      )}
    </div>
  );
}
