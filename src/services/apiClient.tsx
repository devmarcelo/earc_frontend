import axios from "axios";
import { useToastStore, type ToastMessage } from "../hooks/useToastStore";

// Determine the base URL for the API
// Use environment variable in production, fallback to localhost for development
const hostProtocol = window.location.protocol;
const schema_name = window.location.hostname.split(".")[0];
const API_BASE_URL = `${hostProtocol}//${schema_name}.${import.meta.env.VITE_API_BASE_URL}`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const showToast = useToastStore.getState().showToast;

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
    const duration = 1000;

    if (status === 401) {
      showToast({
        type: "error",
        title: "401 - Acesso não autorizado",
        message: "Sua sessão expirou ou você não tem permissão.",
        duration: duration,
      });
      localStorage.removeItem("authToken");
      return;
    }

    if (status === 403) {
      showToast({
        type: "error",
        title: "403 - Acesso proibido",
        message: "Você não tem permissão para acessar este recurso.",
        duration: duration,
      });
      return;
    }

    if (status === 404) {
      let toastMessage: ToastMessage = { type: "error", message: "" };

      if (url?.includes("/public-settings/")) {
        toastMessage.title = "404 - Empresa não encontrada";
        toastMessage.message =
          "O endereço de empresa informado não existe ou está inativo.";
      } else {
        toastMessage.title = "Recurso não encontrado";
        toastMessage.message = "Página ou recurso não existe.";
      }

      showToast(toastMessage);
      return;
    }

    if (status === 429) {
      showToast({
        type: "error",
        title: "429 - Muitas solicitações",
        message: "Erro ao processar requisição.",
      });
      return;
    }

    if (status >= 500) {
      showToast({
        type: "error",
        title: "500 - Erro interno",
        message: "Ocorreu um erro inesperado.",
      });
      return;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
