import api from "./api";   // IMPORTANT: not axios
export const getMyRentals = () => api.get("/rentals/my");
export const returnRental = (id) => api.put(`/rentals/return/${id}`);
export const clearHistory = () => api.delete("/rentals/clear-history");

export const rentCloth = (clothesId, days) => {
  return api.post("/rentals", {
    clothesId: clothesId,
    rentalDays: days
  });
};

export const checkoutCart = (items) => {
  return api.post("/rentals/checkout", { items });
};
