import {
  RotateCcw,
  RotateCw,
  FlipHorizontal2,
  ArrowUpToLine,
  Trash2,
} from "lucide-react";
import "./FlowerControls.css";

interface Props {
  size: "LG" | "SM";
  onToggleSize: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlip: () => void;
  onBringToFront: () => void;
  onRemove: () => void;
}

export function FlowerControls({
  size,
  onToggleSize,
  onRotateLeft,
  onRotateRight,
  onFlip,
  onBringToFront,
  onRemove,
}: Props) {
  const stop = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flower-controls" onPointerDown={stop} onClick={stop}>
      <button
        className="fc-btn fc-size"
        onClick={onToggleSize}
        title={`Switch to ${size === "LG" ? "Small" : "Large"}`}
      >
        {size === "LG" ? "SM" : "LG"}
      </button>
      <button className="fc-btn" onClick={onRotateLeft} title="Rotate left">
        <RotateCcw size={14} />
      </button>
      <button className="fc-btn" onClick={onRotateRight} title="Rotate right">
        <RotateCw size={14} />
      </button>
      <button className="fc-btn" onClick={onFlip} title="Flip horizontal">
        <FlipHorizontal2 size={14} />
      </button>
      <button className="fc-btn" onClick={onBringToFront} title="Bring to front">
        <ArrowUpToLine size={14} />
      </button>
      <button className="fc-btn fc-delete" onClick={onRemove} title="Remove">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
