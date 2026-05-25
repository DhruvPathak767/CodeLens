import axios from "axios";

// Railway Fullstack Deployment API Instance
const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const apiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",

      status: error.response?.status || 500,

      details: error.response?.data?.data || null,

      raw: error,
    };

    // Handle Unauthorized Access
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");

      // Prevent redirect loop
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(apiError);
  }
);

export default api;