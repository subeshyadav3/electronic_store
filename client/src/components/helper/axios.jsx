import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL:import.meta.env.VITE_API_URL,
    // baseURL: "https://store-one-henna.vercel.app/api",
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = apiClient.get("/auth/refresh", { withCredentials: true })
          .finally(() => (isRefreshing = false));
      }

      try {
        await refreshPromise;
        return apiClient(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
