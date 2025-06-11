import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // your backend URL
  withCredentials: true, // sends cookies like refresh token
});

// Attach access token automatically
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle expired access token and refresh automatically
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry // to prevent infinite loop
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.get("/user/refresh", {
          withCredentials: true,
        });

        const newAccessToken = refreshRes.data.accessToken;
        sessionStorage.setItem("accessToken", newAccessToken);

        // Retry the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
