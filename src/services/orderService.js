import api from "./api";

export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my-orders");
export const getOrders = () => api.get("/orders");
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const verifyPickup = (code) => api.post("/orders/verify-pickup", { code });