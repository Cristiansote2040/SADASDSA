import api from "./api";

export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);
export const getUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
