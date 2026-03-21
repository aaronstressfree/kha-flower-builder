import { AppLayout } from "./components/Layout/AppLayout";
import { CatalogPanel } from "./components/Catalog/CatalogPanel";
import { ArrangementCanvas } from "./components/Canvas/ArrangementCanvas";
import { CartBar } from "./components/Cart/CartBar";
import { useArrangement } from "./hooks/useArrangement";
import { useCart } from "./hooks/useCart";

export default function App() {
  const {
    state,
    selectSlot,
    placeFlower,
    removeFlower,
    clearAll,
  } = useArrangement();

  const { total, filledCount, checkout } = useCart(state);

  return (
    <AppLayout
      sidebar={
        <CatalogPanel
          onAddFlower={placeFlower}
          onAddStand={() => {}}
        />
      }
      canvas={
        <ArrangementCanvas
          state={state}
          onSelectSlot={selectSlot}
          onRemoveFlower={removeFlower}
        />
      }
      cartBar={
        <CartBar
          itemCount={filledCount}
          total={total}
          onCheckout={checkout}
          onClear={clearAll}
        />
      }
    />
  );
}
