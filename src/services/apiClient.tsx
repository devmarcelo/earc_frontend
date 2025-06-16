import axios from "axios";
import { type PaginatedResponse } from "../components/Audit/types";

// Determine the base URL for the API
// Use environment variable in production, fallback to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the JWT token and Tenant ID to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Or get from auth context
    const tenantId = localStorage.getItem("tenantId"); // Or get from tenant context/URL

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (tenantId) {
      // Adjust header name if different in your backend middleware
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - redirecting to login");
      localStorage.removeItem("authToken"); // Clear token
      localStorage.removeItem("tenantId"); // Clear tenant info
      // Use window.location or router history to redirect
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
