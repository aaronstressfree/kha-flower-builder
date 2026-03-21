import type { ArrangementState, SlotPosition } from "../../types/canvas";
import { flowers as catalog, stands as standCatalog } from "../../data/catalog";
import { FlowerSlotView } from "./FlowerSlotView";
import "./ArrangementCanvas.css";

interface Props {
  state: ArrangementState;
  onSelectSlot: (slot: SlotPosition | null) => void;
  onRemoveFlower: (slot: SlotPosition) => void;
}

export function ArrangementCanvas({
  state,
  onSelectSlot,
  onRemoveFlower,
}: Props) {
  const stand = standCatalog.find((s) => s.id === state.standId);
  const backFlower = state.back.productId
    ? catalog.find((f) => f.id === state.back.productId)
    : null;
  const frontLeftFlower = state.frontLeft.productId
    ? catalog.find((f) => f.id === state.frontLeft.productId)
    : null;
  const frontRightFlower = state.frontRight.productId
    ? catalog.find((f) => f.id === state.frontRight.productId)
    : null;

  return (
    <div
      className="arrangement-canvas"
      onClick={() => onSelectSlot(null)}
    >
      <div className="arrangement-display">
        {/* Back slot — large flower */}
        <div className="slot-back">
          <FlowerSlotView
            flower={backFlower}
            size="LG"
            isSelected={state.selectedSlot === "back"}
            isEmpty={!state.back.productId}
            label="Large (Back)"
            onSelect={(e) => {
              e.stopPropagation();
              onSelectSlot("back");
            }}
            onRemove={(e) => {
              e.stopPropagation();
              onRemoveFlower("back");
            }}
          />
        </div>

        {/* Front row — two small flowers */}
        <div className="slot-front-row">
          <div className="slot-front-left">
            <FlowerSlotView
              flower={frontLeftFlower}
              size="SM"
              isSelected={state.selectedSlot === "frontLeft"}
              isEmpty={!state.frontLeft.productId}
              label="Small (Left)"
              onSelect={(e) => {
                e.stopPropagation();
                onSelectSlot("frontLeft");
              }}
              onRemove={(e) => {
                e.stopPropagation();
                onRemoveFlower("frontLeft");
              }}
            />
          </div>
          <div className="slot-front-right">
            <FlowerSlotView
              flower={frontRightFlower}
              size="SM"
              isSelected={state.selectedSlot === "frontRight"}
              isEmpty={!state.frontRight.productId}
              label="Small (Right)"
              onSelect={(e) => {
                e.stopPropagation();
                onSelectSlot("frontRight");
              }}
              onRemove={(e) => {
                e.stopPropagation();
                onRemoveFlower("frontRight");
              }}
            />
          </div>
        </div>

        {/* Stand image */}
        <div className="stand-display">
          {stand && (
            <img
              src={stand.image}
              alt={stand.name}
              className="stand-image"
            />
          )}
        </div>
      </div>
    </div>
  );
}
