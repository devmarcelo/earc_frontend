// src/services/loginService.ts
import apiClient from "./apiClient";
import type { Tenant, User } from "../@types";

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  refresh: string;
  user: User;
  tenant: Tenant;
}

export async function login({
  email,
  password,
}: LoginParams): Promise<LoginResult> {
  try {
    // 1. Realiza autenticação
    const response = await apiClient.post("/api/v1/auth/login/", {
      email,
      password,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    const { access, refresh, user, tenant } = response.data.data;

    if (!access || !user || !tenant) {
      throw new Error(response.data.message);
    }

    localStorage.setItem("authToken", access);
    if (tenant?.id) {
      localStorage.setItem("tenantId", tenant.id);
    }

    return {
      token: access,
      refresh,
      user,
      tenant,
    };
  } catch (error: any) {
    // Tratamento customizado de erro para UX amigável
    let message = "Falha ao realizar login. Tente novamente.";
    if (error.response?.data?.detail) {
      message = error.response.data.detail;
    }
    throw new Error(message);
  }
}
