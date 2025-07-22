import axios from "axios";
import { useErrorStore, type ErrorData } from "../hooks/useErrorStore";

// Determine the base URL for the API
// Use environment variable in production, fallback to localhost for development
const hostProtocol = window.location.protocol;
const hostName = window.location.hostname;
const baseURL = `${hostProtocol}//${hostName}:8000`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || baseURL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const setErrorAndRedirect = (errorData: ErrorData) => {
  useErrorStore.getState().setError(errorData);
  window.location.href = "/error";
};

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
    const status = error.response?.status;
    const url = error.config?.url;
    const from = window.location.pathname; //router.location

    if (status === 401) {
      setErrorAndRedirect({
        status: 401,
        title: "Acesso não autorizado",
        message: "Sua sessão expirou ou você não tem permissão.",
        from: from,
      });
      localStorage.removeItem("authToken");
      return;
    }

    if (status === 403) {
      setErrorAndRedirect({
        status: 403,
        title: "Acesso proibido",
        message: "Você não tem permissão para acessar este recurso.",
        from: from,
      });
      return;
    }

    if (status === 404) {
      let errorData: ErrorData = { status: 404, from: from };

      if (url?.includes("/public-settings/")) {
        errorData.title = "Empresa não encontrada";
        errorData.message =
          "O endereço de empresa informado não existe ou está inativo.";
      } else {
        errorData.title = "Recurso não encontrado";
        errorData.message = "Página ou recurso não existe.";
      }

      setErrorAndRedirect(errorData);
      return;
    }

    if (status >= 500) {
      setErrorAndRedirect({
        status: 500,
        title: "Erro interno",
        message: "Ocorreu um erro inesperado.",
        from: from,
      });
      return;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
