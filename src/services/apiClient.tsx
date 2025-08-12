import axios from "axios";
import { useToastStore, type ToastMessage } from "../hooks/useToastStore";

const { protocol, hostname } = window.location;
const schema_name = hostname.split(".")[0];
const isDev = import.meta.env.DEV;

const PUBLIC_API_BASE_URL = isDev
  ? `${protocol}//${(import.meta.env.VITE_PUBLIC_API_HOST as string) ?? "localhost"}:8000`
  : `${protocol}//${import.meta.env.VITE_API_BASE_URL}`;

const TENANT_API_BASE_URL = isDev
  ? `${protocol}//${hostname}:8000`
  : `${protocol}//${schema_name}.${import.meta.env.VITE_API_BASE_URL}`;

const apiClient = axios.create({
  timeout: 30000,
});

const showToast = useToastStore.getState().showToast;

// Define public endpoints
const isPublicEndpoints = (url?: string) => {
  if (!url) {
    return false;
  }

  if (/^https?:\/\//i.test(url)) {
    return false;
  }

  if (url.startsWith("/register-company") || url === "/register-company") {
    return true;
  }

  return false;
};

// Interceptor to add the JWT token and Tenant ID to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || undefined;
    const tenantId = localStorage.getItem("tenantId") || undefined;
    const url = config.url ?? "";

    if (!config.headers) {
      config.headers = {} as import("axios").AxiosRequestHeaders;
    }

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormData && "Content-Type" in config.headers) {
      delete (config.headers as import("axios").AxiosRequestHeaders)[
        "Content-Type"
      ];
    }

    if (!("Accept" in config.headers)) {
      (config.headers as import("axios").AxiosRequestHeaders)["Accept"] =
        "application/json";
    }

    if (!/^https?:\/\//i.test(url)) {
      if (isPublicEndpoints(url)) {
        config.baseURL = PUBLIC_API_BASE_URL;
        delete config.headers["Authorization"];
        delete config.headers["X-Tenant-Id"];
      } else {
        config.baseURL = TENANT_API_BASE_URL;

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        if (tenantId) {
          config.headers["X-Tenant-Id"] = tenantId;
        }
      }
    } else {
      if (isPublicEndpoints(url)) {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        if (tenantId) {
          config.headers["X-Tenant-Id"] = tenantId;
        }
      }
    }

    if (isDev) {
      console.log(
        "[api] ->",
        config.method?.toUpperCase(),
        (config.baseURL ?? "") + (config.url ?? ""),
      );
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
    const status = error.response?.status || 404;
    const url = error.config?.url;

    if (status === 400) {
      let toastMessage: ToastMessage = { type: "error", message: "" };

      if (url?.includes("/login/")) {
        toastMessage.title = "Falha no login";
        toastMessage.message = "Verifique suas credenciais.";
      } else {
        toastMessage.title = "400 - Dados inválidos";
        toastMessage.message = "Recurso não encontrado no sistema.";
      }

      showToast(toastMessage);
      return;
    }

    if (status === 401) {
      showToast({
        type: "error",
        title: "401 - Acesso não autorizado",
        message: "Sua sessão expirou ou você não tem permissão.",
      });
      localStorage.removeItem("authToken");
      return;
    }

    if (status === 403) {
      showToast({
        type: "error",
        title: "403 - Acesso proibido",
        message: "Você não tem permissão para acessar este recurso.",
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
