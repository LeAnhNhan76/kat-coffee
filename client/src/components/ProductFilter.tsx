import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setAvailableOnly,
  setCategory,
  setMaxPrice,
  setMinPrice,
  setSearchTerm,
  getValidPriceRange,
} from "../store/filterSlice";

const CATEGORIES = [
  { id: null, label: "Tất cả" },
  { id: "coffee", label: "Cà phê" },
  { id: "tea", label: "Trà trái cây" },
  { id: "bakery", label: "Bánh ngọt" },
];

export const ProductFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categoryId, searchTerm, minPrice, maxPrice, availableOnly } =
    useAppSelector((state) => state.filters);
  const isPriceRangeValid = getValidPriceRange(minPrice, maxPrice) !== null;

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

      <div style={styles.additionalFilters}>
        <label style={styles.priceField}>
          Giá từ
          <input
            type="number"
            min="0"
            step="any"
            value={minPrice}
            onChange={(e) => dispatch(setMinPrice(e.target.value))}
            aria-invalid={!isPriceRangeValid}
            aria-describedby={!isPriceRangeValid ? "price-range-error" : undefined}
            style={styles.priceInput}
          />
        </label>
        <label style={styles.priceField}>
          Đến
          <input
            type="number"
            min="0"
            step="any"
            value={maxPrice}
            onChange={(e) => dispatch(setMaxPrice(e.target.value))}
            aria-invalid={!isPriceRangeValid}
            aria-describedby={!isPriceRangeValid ? "price-range-error" : undefined}
            style={styles.priceInput}
          />
        </label>
        <label style={styles.availabilityField}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => dispatch(setAvailableOnly(e.target.checked))}
          />
          Chỉ hiển thị món còn bán
        </label>
      </div>
      {!isPriceRangeValid && (
        <p id="price-range-error" role="alert" style={styles.validationMessage}>
          Vui lòng nhập giá không âm và đảm bảo giá từ không lớn hơn giá đến.
        </p>
      )}
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
  additionalFilters: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  priceField: { display: "flex", alignItems: "center", gap: "6px" },
  priceInput: {
    width: "120px",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  availabilityField: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  validationMessage: { margin: 0, color: "#b42318", fontSize: "14px" },
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
