import api from "./api";

export const getBanners = (page, position) =>
  api.get("/banners", { params: { page, position } });

export const createBanner = (data) =>
  api.post("/banners", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });