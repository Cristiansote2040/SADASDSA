import axios from "axios";

const API = "https://backend-c5fo.onrender.com/api/auth";

const apis = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const registerUser = async (data) => {
  const res = await apis.post("/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  (data);
  
  const res = await apis.post("/login", data);
  
  return res.data;
};

export const logoutUser = async () => {
  const res = await apis.post("/logout");
  return res.data;
};

export const forgotPassword = async (email) => {
  try {
    const res = await apis.post("/forgot-password", { email });
    return res.data; // ✅ ahora sí existe
  } catch (err) {
    throw err; // importante para que lo maneje el frontend
  }
};

export const resetPassword = async (token, newPassword) => {
  const res = await apis.post(`/reset-password/${token}`, {
    newPassword,
  });
  return res.data;
};