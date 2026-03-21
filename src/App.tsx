import { AppLayout } from "./components/Layout/AppLayout";
import { CatalogPanel } from "./components/Catalog/CatalogPanel";
import { ArrangementCanvas } from "./components/Canvas/ArrangementCanvas";
import { CartBar } from "./components/Cart/CartBar";
import { useArrangement } from "./hooks/useArrangement";
import { useCart } from "./hooks/useCart";

export default function App() {
  const {
    state,
    stand,
    selectSlot,
    placeFlower,
    removeFlower,
    setStandIndex,
    clearAll,
  } = useArrangement();

  const { total, filledCount, checkout } = useCart(state, stand);

  return (
    <AppLayout
      sidebar={
        <CatalogPanel
          onAddFlower={placeFlower}
          selectedSlotLabel={
            state.selectedSlot
              ? stand.slots.find((s) => s.key === state.selectedSlot)?.label ?? null
              : null
          }
        />
      }
      canvas={
        <ArrangementCanvas
          state={state}
          stand={stand}
          onSelectSlot={selectSlot}
          onRemoveFlower={removeFlower}
          onChangeStand={setStandIndex}
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
