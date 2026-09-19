import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartFinalTotal,
  selectCartItems,
  selectCartSubtotal,
  selectDiscountAmount,
  setDiscountPercent,
} from "../store/cartSlice";

export const CartCheckout: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Đọc state và calculated selectors từ Redux
  const cartItems = useAppSelector(selectCartItems);
  const discountPercent = useAppSelector((state) => state.cart.discountPercent);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discountAmount = useAppSelector(selectDiscountAmount);
  const finalTotal = useAppSelector(selectCartFinalTotal);

  // Mutation thanh toán với TanStack Query
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        orderId: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    },
    onSuccess: (data) => {
      alert(
        `🎉 Thanh toán thành công!\nMã đơn: ${data.orderId}\nTổng tiền: ${finalTotal.toLocaleString("vi-VN")} đ`,
      );
      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <div style={styles.cartContainer}>
      <h3 style={styles.title}>🛒 Giỏ Hàng POS</h3>

      {cartItems.length === 0 ? (
        <p style={styles.empty}>Chưa có sản phẩm nào trong giỏ.</p>
      ) : (
        <>
          {/* Danh sách món */}
          <div style={styles.itemList}>
            {cartItems.map((item) => (
              <div key={item.productId} style={styles.itemRow}>
                <div style={{ flex: 1 }}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemSub}>
                    {item.price.toLocaleString("vi-VN")} đ
                  </div>
                </div>

                {/* Bộ điều khiển số lượng */}
                <div style={styles.qtyControl}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => dispatch(decrementQuantity(item.productId))}
                  >
                    -
                  </button>
                  <span style={styles.qtyText}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => dispatch(incrementQuantity(item.productId))}
                  >
                    +
                  </button>
                </div>

                <div style={styles.itemTotal}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </div>

                {/* Nút Xóa */}
                <button
                  style={styles.deleteBtn}
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  title="Xóa món"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Ô nhập Giảm Giá */}
          <div style={styles.discountRow}>
            <span>Giảm giá (%):</span>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent || ""}
              onChange={(e) =>
                dispatch(setDiscountPercent(Number(e.target.value)))
              }
              placeholder="0"
              style={styles.discountInput}
            />
          </div>

          {/* Bảng tổng tiền */}
          <div style={styles.summaryContainer}>
            <div style={styles.summaryRow}>
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ ...styles.summaryRow, color: "#28a745" }}>
                <span>Chiết khấu ({discountPercent}%):</span>
                <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
              </div>
            )}
            <div style={styles.finalRow}>
              <span>Tổng thanh toán:</span>
              <span style={styles.totalPrice}>
                {finalTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          {/* Nút bấm hành động */}
          <div style={styles.actionGroup}>
            <button
              style={styles.clearBtn}
              onClick={() => dispatch(clearCart())}
            >
              Xóa hết
            </button>
            <button
              style={styles.checkoutBtn}
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
            >
              {checkoutMutation.isPending
                ? "⏳ Đang xử lý..."
                : "⚡ Thanh Toán"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  cartContainer: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  title: {
    margin: "0 0 16px 0",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px",
  },
  empty: { color: "#888", textAlign: "center", margin: "auto 0" },
  itemList: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px dashed #eee",
    paddingBottom: "8px",
  },
  itemName: { fontWeight: "bold", fontSize: "14px" },
  itemSub: { fontSize: "12px", color: "#666" },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    background: "#f1f3f5",
    borderRadius: "4px",
  },
  qtyBtn: {
    border: "none",
    background: "transparent",
    padding: "4px 8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  qtyText: { padding: "0 4px", fontSize: "13px", fontWeight: "bold" },
  itemTotal: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "13px",
    minWidth: "70px",
    textAlign: "right",
  },
  deleteBtn: {
    border: "none",
    background: "transparent",
    color: "#dc3545",
    cursor: "pointer",
    fontWeight: "bold",
  },
  discountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid #eee",
  },
  discountInput: {
    width: "60px",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    textAlign: "right",
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "12px 0",
    borderTop: "1px solid #eee",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#555",
  },
  finalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "4px",
  },
  totalPrice: { color: "#e63946" },
  actionGroup: { display: "flex", gap: "8px", marginTop: "12px" },
  clearBtn: {
    padding: "12px",
    background: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
  },
  checkoutBtn: {
    flex: 1,
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
