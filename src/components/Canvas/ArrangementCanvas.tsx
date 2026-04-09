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
  if (slotCount === 2) return -(wide ? 50 : 38) * scale;
  return -(wide ? 55 : 40) * scale;
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
    const el = canvasRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.clientHeight;
      const vw = window.innerWidth;
      const mobile = vw <= 768;
      const compact = mobile || h < 500;
      const reserved = compact ? 45 : 75;
      const available = h - reserved;
      const maxFlower = Math.max(...stand.slots.map((s) => s.flowerHeight));
      const fillFactor = compact ? 0.95 : 0.82;
      const s = Math.min((available * fillFactor) / maxFlower, 3.5);
      setScale(Math.max(s, 0.5));
      setCanvasWidth(vw);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
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

  const isMobile = canvasWidth <= 768;

  if (isMobile) {
    return (
      <MobileCanvas
        canvasRef={canvasRef}
        state={state}
        stand={stand}
        onSelectSlot={onSelectSlot}
        onRemoveFlower={onRemoveFlower}
        onChangeStand={onChangeStand}
      />
    );
  }

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

/**
 * Mobile-only canvas: absolute positioning relative to stand center.
 * Completely independent from desktop layout.
 */
function MobileCanvas({
  canvasRef,
  state,
  stand,
  onSelectSlot,
  onRemoveFlower,
  onChangeStand,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  state: ArrangementState;
  stand: StandConfig;
  onSelectSlot: (key: string | null) => void;
  onRemoveFlower: (key: string) => void;
  onChangeStand: (index: number) => void;
}) {
  // Measure canvas height — use state + ResizeObserver so we re-render on resize
  const [canvasH, setCanvasH] = useState(0);
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setCanvasH(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasRef]);

  const vw = typeof window !== "undefined" ? window.innerWidth : 390;
  const effectiveH = canvasH || (canvasRef.current?.clientHeight ?? 400);
  const standBarWidth = Math.min(vw * 0.5, 200);
  const standBarHeight = 22;

  // Fill the canvas: subtract stand picker (44px) and stand bar, use the rest
  const flowerArea = effectiveH - 44 - standBarHeight;
  // Flower PNGs are square (800×800) — container width determines visible height
  // via object-fit:contain. Make containers wide enough to fill the vertical space.
  const lgWidth = Math.min(flowerArea * 0.7, vw * 0.68);
  const lgHeight = flowerArea * 0.96;
  const smWidth = lgWidth * 0.55;
  const smHeight = lgHeight * 0.52;

  // How deep flowers sink into the stand (overlap with stand bar)
  const sinkDepth = standBarHeight * 0.55;

  // Build slot positions: absolute x/y relative to stand center
  type SlotPos = {
    slot: (typeof stand.slots)[0];
    x: number; // center offset from stand center (px)
    width: number;
    height: number;
    z: number;
  };

  const positions: SlotPos[] = (() => {
    const slots = stand.slots;
    const lgSlots = slots.filter((s) => s.size === "LG");
    const smSlots = slots.filter((s) => s.size === "SM");

    if (slots.length === 2 && lgSlots.length === 1 && smSlots.length === 1) {
      // Double: LG slightly left, SM slightly right and in front
      const spread = standBarWidth * 0.22;
      return [
        { slot: lgSlots[0], x: -spread, width: lgWidth, height: lgHeight, z: 1 },
        { slot: smSlots[0], x: spread, width: smWidth, height: smHeight, z: 2 },
      ];
    }

    if (slots.length === 3 && lgSlots.length === 1 && smSlots.length === 2) {
      // Triple: SM left, LG center, SM right
      const spread = standBarWidth * 0.3;
      return [
        { slot: smSlots[0], x: -spread, width: smWidth, height: smHeight, z: 2 },
        { slot: lgSlots[0], x: 0, width: lgWidth, height: lgHeight, z: 1 },
        { slot: smSlots[1], x: spread, width: smWidth, height: smHeight, z: 2 },
      ];
    }

    // Fallback: evenly distribute
    const step = standBarWidth / (slots.length + 1);
    return slots.map((slot, i) => {
      const isLg = slot.size === "LG";
      return {
        slot,
        x: (i + 1) * step - standBarWidth / 2,
        width: isLg ? lgWidth : smWidth,
        height: isLg ? lgHeight : smHeight,
        z: isLg ? 1 : 2,
      };
    });
  })();

  const handleSlotTap = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSlot(state.selectedSlot === key ? null : key);
  };

  // Long-press preview for stand thumbnails
  const [previewStand, setPreviewStand] = useState<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStandTouchStart = (index: number) => {
    longPressTimer.current = setTimeout(() => {
      setPreviewStand(index);
    }, 300);
  };

  const handleStandTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setPreviewStand(null);
  };

  return (
    <div
      ref={canvasRef}
      className="arrangement-canvas mobile-canvas"
      onClick={() => onSelectSlot(null)}
    >
      {/* Arrangement: positioned relative to this container */}
      <div
        className="mobile-arrangement"
        style={{ height: lgHeight + standBarHeight - sinkDepth }}
      >
        {/* Flowers — absolutely positioned relative to stand */}
        {positions.map(({ slot, x, width, height, z }) => {
          const productId = state.flowers[slot.key];
          const product = productId
            ? catalog.find((f) => f.id === productId)
            : null;
          const isSelected = state.selectedSlot === slot.key;

          return (
            <div
              key={slot.key}
              className={`mobile-slot ${isSelected ? "selected" : ""} ${product ? "has-flower" : "empty"}`}
              style={{
                width,
                height,
                left: `calc(50% + ${x}px - ${width / 2}px)`,
                bottom: standBarHeight - sinkDepth,
                zIndex: isSelected ? 10 : !product ? 6 : z,
              }}
              onClick={(e) => handleSlotTap(slot.key, e)}
            >
              {product ? (
                <>
                  <img
                    src={`/flowers/${product.id}.png`}
                    alt={product.name}
                    className="mobile-flower-img"
                  />
                  {isSelected && (
                    <button
                      className="mobile-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFlower(slot.key);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </>
              ) : (
                <div className={`mobile-add-btn ${isSelected ? "active" : ""}`}>
                  <span className="mobile-add-icon">+</span>
                  <span className="mobile-add-size">{slot.size}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Stand bar */}
        <div
          className="mobile-stand-bar"
          style={{ width: standBarWidth, height: standBarHeight }}
        >
          <div className="stand-slots-indicator">
            {stand.slots.map((s) => (
              <div key={s.key} className="stand-slot-mark" />
            ))}
          </div>
        </div>
        <div className="mobile-stand-shadow" style={{ width: standBarWidth * 0.9 }} />
        {/* Mask below stand */}
        <div className="mobile-stand-mask" />
      </div>

      {/* Stand picker */}
      <div className="stand-float" onClick={(e) => e.stopPropagation()}>
        <span className="stand-float-label">Stand</span>
        <div className="stand-float-options">
          {standConfigs.map((sc, i) => (
            <button
              key={sc.id}
              className={`stand-float-pick ${state.standIndex === i ? "active" : ""}`}
              onClick={() => onChangeStand(i)}
              onTouchStart={() => handleStandTouchStart(i)}
              onTouchEnd={handleStandTouchEnd}
              onTouchCancel={handleStandTouchEnd}
            >
              <img src={`/stands/${sc.id}.png`} alt={sc.name} />
            </button>
          ))}
        </div>
      </div>

      {/* Long-press stand preview */}
      {previewStand !== null && (
        <div className="mobile-stand-preview-overlay" onTouchEnd={handleStandTouchEnd}>
          <div className="mobile-stand-preview">
            <img
              src={`/stands/${standConfigs[previewStand].id}.png`}
              alt={standConfigs[previewStand].name}
            />
            <span className="mobile-stand-preview-name">
              {standConfigs[previewStand].name}
            </span>
            <span className="mobile-stand-preview-slots">
              {standConfigs[previewStand].slots.filter((s) => s.size === "LG").length} Large +{" "}
              {standConfigs[previewStand].slots.filter((s) => s.size === "SM").length} Small
            </span>
          </div>
        </div>
      )}
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
