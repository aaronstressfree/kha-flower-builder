import { ShoppingCart, Trash2 } from "lucide-react";
import "./CartBar.css";

interface Props {
  itemCount: number;
  total: number;
  onCheckout: () => void;
  onClear: () => void;
}

export function CartBar({ itemCount, total, onCheckout, onClear }: Props) {
  return (
    <div className="cart-bar">
      <div className="cart-info">
        <ShoppingCart size={18} />
        <span className="cart-count">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        {itemCount > 0 && (
          <span className="cart-total">${total.toFixed(2)}</span>
        )}
      </div>
      <div className="cart-actions">
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
