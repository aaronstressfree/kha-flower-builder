import { ShoppingCart, Trash2, Camera } from "lucide-react";
import "./CartBar.css";

interface Props {
  itemCount: number;
  total: number;
  onCheckout: () => void;
  onClear: () => void;
  onOpenGallery: () => void;
}

export function CartBar({ itemCount, total, onCheckout, onClear, onOpenGallery }: Props) {
  return (
    <div className="cart-bar">
      <div className="cart-info">
        <ShoppingCart size={18} />
        <span className="cart-count">
          {itemCount} {itemCount === 1 ? "flower" : "flowers"} + stand
        </span>
        <span className="cart-total">${total.toFixed(2)}</span>
      </div>
      <div className="cart-actions">
        <div className="cart-meta">
          <button className="cart-gallery-trigger" onClick={onOpenGallery}>
            <Camera size={14} />
            <span>See real arrangements</span>
          </button>
          <span className="cart-disclaimer">
            Simulation only. Actual product may vary. <a href="https://www.kimberlyhodges.com" target="_blank" rel="noopener noreferrer">kimberlyhodges.com</a>
          </span>
        </div>
        {itemCount > 0 && (
          <button className="cart-clear" onClick={onClear}>
            <Trash2 size={14} />
            Clear
          </button>
        )}
        <button
          className="cart-checkout"
          onClick={onCheckout}
          disabled={itemCount === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
