import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.some((cartItem) => cartItem._id === item._id);
      if (exists) return;

      state.push({
        ...item,
        rentalDays: 2,
      });
    },
    removeFromCart: (state, action) => state.filter((item) => item._id !== action.payload),
    updateRentalDays: (state, action) => {
      const { id, rentalDays } = action.payload;
      const item = state.find((cartItem) => cartItem._id === id);
      if (!item) return;

      item.rentalDays = Math.max(1, Number(rentalDays) || 1);
    },
    clearCart: () => []
  }
});

export const { addToCart, removeFromCart, updateRentalDays, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
