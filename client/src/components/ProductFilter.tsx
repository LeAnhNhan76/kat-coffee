import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setCategory, setSearchTerm } from "../store/filterSlice";

const CATEGORIES = [
  { id: null, label: "Tất cả" },
  { id: "coffee", label: "Cà phê" },
  { id: "tea", label: "Trà trái cây" },
  { id: "bakery", label: "Bánh ngọt" },
];

export const ProductFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categoryId, searchTerm } = useAppSelector((state) => state.filters);

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="🔍 Tìm kiếm món ăn, đồ uống..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        style={styles.searchInput}
      />

      <div style={styles.categoryGroup}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id ?? "all"}
            onClick={() => dispatch(setCategory(cat.id))}
            style={{
              ...styles.categoryBtn,
              ...(categoryId === cat.id ? styles.activeBtn : {}),
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  searchInput: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
  },
  categoryGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
  categoryBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    background: "#f8f9fa",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeBtn: {
    background: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
    fontWeight: "bold",
  },
};
