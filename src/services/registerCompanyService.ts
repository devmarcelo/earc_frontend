import apiClient from "./apiClient";

export const registerCompany = async (formData: FormData): Promise<string> => {
  try {
    const response = await apiClient.post("/api/register-company/", formData);

    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar empresa:", error);
    throw error.response?.data;
  }
};
