import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-c5fo.onrender.com/api",
  withCredentials: true,
});
export default instance;
