import axios from "axios";

// Determine the base URL for the API
// Use environment variable in production, fallback to localhost for development
const hostProtocol = window.location.protocol;
const hostName = window.location.hostname;
const baseURL = `${hostProtocol}//${hostName}:8000`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || baseURL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the JWT token and Tenant ID to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const tenantId = localStorage.getItem("tenantId");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers["X-Tenant-Id"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle responses (e.g., redirect on 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - redirecting to login");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
