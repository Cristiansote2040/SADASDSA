import api from "./api";

export const createPayment = async (paymentData) => {

  const { data } = await api.post("/payments/create", paymentData);

  return data; // { init_point: "..." }

};