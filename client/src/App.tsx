import React from "react";
import { CartCheckout } from "./components/CartCheckout";
import { ProductFilter } from "./components/ProductFilter";
import { ProductList } from "./components/ProductList";

const App: React.FC = () => {
  return (
    <div style={styles.appWrapper}>
      <header style={styles.header}>
        <h2>☕ Coffee & Bakery POS System</h2>
        <span style={styles.badge}>Redux + TanStack Query</span>
      </header>

      <main style={styles.mainLayout}>
        <section style={styles.leftColumn}>
          <ProductFilter />
          <ProductList />
        </section>

        <aside style={styles.rightColumn}>
          <CartCheckout />
        </aside>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appWrapper: {
    fontFamily: "Segoe UI, sans-serif",
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  header: {
    background: "#1e293b",
    color: "#fff",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    background: "#3b82f6",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "24px",
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  leftColumn: { display: "flex", flexDirection: "column" },
  rightColumn: {
    position: "sticky",
    top: "24px",
    height: "calc(100vh - 120px)",
  },
};

export default App;
