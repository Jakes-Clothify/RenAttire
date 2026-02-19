import api from "./api";

export const getClothes = (params = {}) => api.get("/clothes", { params });

export const addCloth = (data) => api.post("/clothes", data);
