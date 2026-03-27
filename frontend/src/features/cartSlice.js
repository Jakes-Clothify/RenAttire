import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = "renattire_cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep cart functional even if storage is unavailable.
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.find((cartItem) => cartItem._id === item._id);

      if (existingItem) {
        existingItem.rentalDays = Math.max(1, Number(item.rentalDays) || existingItem.rentalDays || 2);
        existingItem.startDate = item.startDate || existingItem.startDate || "";
        existingItem.endDate = item.endDate || existingItem.endDate || "";
        saveCart(state);
        return;
      }

      state.push({
        ...item,
        rentalDays: Math.max(1, Number(item.rentalDays) || 2),
        startDate: item.startDate || "",
        endDate: item.endDate || "",
      });
      saveCart(state);
    },
    removeFromCart: (state, action) => {
      const nextState = state.filter((item) => item._id !== action.payload);
      saveCart(nextState);
      return nextState;
    },
    updateRentalDays: (state, action) => {
      const { id, rentalDays } = action.payload;
      const item = state.find((cartItem) => cartItem._id === id);
      if (!item) return;

      item.rentalDays = Math.max(1, Number(rentalDays) || 1);
      if (item.startDate) {
        const start = new Date(item.startDate);
        if (!Number.isNaN(start.getTime())) {
          const end = new Date(start);
          end.setDate(end.getDate() + item.rentalDays);
          item.endDate = end.toISOString();
        }
      }
      saveCart(state);
    },
    updateRentalWindow: (state, action) => {
      const { id, startDate, endDate } = action.payload;
      const item = state.find((cartItem) => cartItem._id === id);
      if (!item) return;

      item.startDate = startDate || "";
      item.endDate = endDate || "";

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
        item.rentalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      }

      saveCart(state);
    },
    clearCart: () => {
      saveCart([]);
      return [];
    }
  }
});

export const { addToCart, removeFromCart, updateRentalDays, updateRentalWindow, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
