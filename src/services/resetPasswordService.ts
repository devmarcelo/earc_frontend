import apiClient from "./apiClient";

export async function requestPasswordReset(email: string) {
  return apiClient.post("/api/v1/auth/password/reset/", { email });
}

export async function confirmPasswordReset(
  paramsB64: string,
  newPassword: string,
) {
  return apiClient.post("/api/v1/auth/password/reset/confirm/", {
    params: paramsB64,
    new_password: newPassword,
  });
}
