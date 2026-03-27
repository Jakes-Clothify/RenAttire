import api from "./api";

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/me", data);
export const getWishlist = () => api.get("/auth/wishlist");
export const toggleWishlist = (clothId) => api.put(`/auth/wishlist/${clothId}`);
