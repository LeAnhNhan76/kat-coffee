import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from './index';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
  discountPercent: number; // Phần trăm giảm giá (0 - 100)
  selectedTableId: string | null; // ID bàn (dùng cho POS F&B)
  orderNote: string; // Ghi chú chung cho đơn hàng
}

const initialState: CartState = {
  items: [],
  discountPercent: 0,
  selectedTableId: null,
  orderNote: '',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm món vào giỏ (Nếu đã có thì cộng dồn số lượng)
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const { productId, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, quantity });
      }
    },

    // 2. Xóa hẳn 1 món khỏi giỏ
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },

    // 3. Tăng số lượng 1 món
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    // 4. Giảm số lượng 1 món (Nếu về 0 thì tự động xoá món)
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.productId !== action.payload);
        }
      }
    },

    // 5. Cập nhật trực tiếp số lượng món
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        const item = state.items.find((i) => i.productId === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
    },

    // 6. Áp mã / Phần trăm giảm giá
    setDiscountPercent: (state, action: PayloadAction<number>) => {
      state.discountPercent = Math.min(100, Math.max(0, action.payload));
    },

    // 7. Chọn bàn
    setSelectedTable: (state, action: PayloadAction<string | null>) => {
      state.selectedTableId = action.payload;
    },

    // 8. Cập nhật ghi chú đơn
    setOrderNote: (state, action: PayloadAction<string>) => {
      state.orderNote = action.payload;
    },

    // 9. Reset sạch giỏ hàng sau khi thanh toán
    clearCart: () => initialState,
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  setDiscountPercent,
  setSelectedTable,
  setOrderNote,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ==========================================
// SELECTORS (Tối ưu tính toán với Reselect)
// ==========================================

const selectCartState = (state: RootState) => state.cart;

// Lấy danh sách món
export const selectCartItems = createSelector(selectCartState, (cart) => cart.items);

// Tính tổng số lượng tất cả món (Dùng hiển thị badge 🛒)
export const selectCartTotalCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

// Tạm tính (Chưa áp giảm giá)
export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Số tiền được giảm
export const selectDiscountAmount = createSelector(
  [selectCartSubtotal, (state: RootState) => state.cart.discountPercent],
  (subtotal, discountPercent) => (subtotal * discountPercent) / 100
);

// Tổng tiền phải thanh toán cuối cùng
export const selectCartFinalTotal = createSelector(
  [selectCartSubtotal, selectDiscountAmount],
  (subtotal, discountAmount) => Math.max(0, subtotal - discountAmount)
);