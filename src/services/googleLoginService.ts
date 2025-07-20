// src/services/googleLoginService.ts
import apiClient from "./apiClient";

interface GoogleLoginParams {
  code: string;
}

export async function googleLogin({ code }: GoogleLoginParams) {
  const response = await apiClient.post("/api/v1/auth/social/google/", {
    code,
  });

  return response.data;
}
