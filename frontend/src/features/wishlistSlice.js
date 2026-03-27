import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "renattire_wishlist";

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveWishlist = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore local storage issues and keep the UI responsive.
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: loadWishlist(),
  reducers: {
    setWishlist: (_state, action) => {
      const nextState = Array.isArray(action.payload) ? action.payload : [];
      saveWishlist(nextState);
      return nextState;
    },
    toggleWishlistLocal: (state, action) => {
      const item = action.payload;
      const exists = state.some((wishlistItem) => wishlistItem._id === item._id);
      const nextState = exists
        ? state.filter((wishlistItem) => wishlistItem._id !== item._id)
        : [item, ...state];
      saveWishlist(nextState);
      return nextState;
    },
    clearWishlist: () => {
      saveWishlist([]);
      return [];
    }
  }
});

export const { setWishlist, toggleWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
