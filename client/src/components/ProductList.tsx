import React from "react";
import { type Product, useProducts } from "../hooks/useProducts";
import { useAppDispatch } from "../store";
import { addToCart } from "../store/cartSlice";

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading)
    return <div style={styles.status}>⌛ Đang tải danh sách món...</div>;
  if (isError)
    return (
      <div style={styles.status}>❌ Đã có lỗi xảy ra khi lấy dữ liệu!</div>
    );
  if (!products || products.length === 0)
    return <div style={styles.status}>🚫 Không tìm thấy sản phẩm phù hợp.</div>;

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }),
    );
  };

  return (
    <div style={styles.grid}>
      {products.map((item) => (
        <div key={item.id} style={styles.card}>
          <div style={styles.icon}>{item.imageUrl}</div>
          <h4 style={styles.name}>{item.name}</h4>
          <p style={styles.price}>{item.price.toLocaleString("vi-VN")} đ</p>
          <button style={styles.addBtn} onClick={() => handleAddToCart(item)}>
            + Thêm vào giỏ
          </button>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "16px",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  icon: { fontSize: "40px", marginBottom: "8px" },
  name: { margin: "8px 0 4px", fontSize: "16px", color: "#333" },
  price: { color: "#e63946", fontWeight: "bold", marginBottom: "12px" },
  addBtn: {
    width: "100%",
    padding: "8px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  status: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
    fontSize: "16px",
  },
};
