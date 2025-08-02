import apiClient from "./apiClient";
import type { Tenant } from "../@types";
import { useToastStore } from "../hooks/useToastStore";

const showToast = useToastStore.getState().showToast;

export interface TenantBranding {
  name: string;
  logo?: string;
  theme?: {
    primary_color?: string;
    background?: string;
    custom_login_message?: string;
  };
}

function isTenantBranding(obj: any): obj is TenantBranding {
  return (
    obj &&
    typeof obj.name === "string" &&
    (obj.logo === undefined || typeof obj.logo === "string") &&
    (obj.theme === undefined ||
      (typeof obj.theme === "object" &&
        (obj.theme.primary_color === undefined ||
          typeof obj.theme.primary_color === "string") &&
        (obj.theme.background === undefined ||
          typeof obj.theme.background === "string")))
  );
}

export async function fetchPublicTenantSettings(slug: string): Promise<Tenant> {
  const res = await apiClient.get(`/api/v1/tenants/${slug}/public-settings/`);

  if (!isTenantBranding(res.data.data)) {
    showToast({
      type: "error",
      title: "Erro de branding",
      message: "Dados da empresa inválidos.",
    });
    throw new Error("Dados de branding do tenant inválidos. Verifique a URL.");
  }

  showToast({
    type: "success",
    title: "Empresa encontrada",
    message: `Bem-vindo ${res.data.data.name}.`,
  });

  return res.data.data as Tenant;
}
