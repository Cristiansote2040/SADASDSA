import api from "./api";

export const applyCoupon = (code, total) => api.post("/coupons/apply", { code, total });
export const getCoupons = () => api.get("/coupons");
export const createCoupon = (data) => api.post("/coupons", data);
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);