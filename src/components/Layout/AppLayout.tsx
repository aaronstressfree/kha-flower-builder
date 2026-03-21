import type { ReactNode } from "react";
import "./AppLayout.css";

interface Props {
  sidebar: ReactNode;
  canvas: ReactNode;
  cartBar: ReactNode;
}

export function AppLayout({ sidebar, canvas, cartBar }: Props) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">Kimberly Hodges</h1>
        <span className="app-subtitle">Flower Arrangement Builder</span>
      </header>
      <div className="app-body">
        <aside className="app-sidebar">{sidebar}</aside>
        <main className="app-canvas">{canvas}</main>
      </div>
      <footer className="app-cart-bar">{cartBar}</footer>
    </div>
  );
}
