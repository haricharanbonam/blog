import axios from "axios";

const API = axios.create({
  baseURL: "https://blog-n2cx.onrender.com",
  withCredentials: true,
});

const refreshAPI = axios.create({
  baseURL: "https://blog-n2cx.onrender.com",
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.message ===
        "Access token has expired. Please login again." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await refreshAPI.post("/user/refresh-token");

        console.log("Refresh success → retrying original request");
        return API(originalRequest);
      } catch (err) {
        console.error("Refresh failed:", err);
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
