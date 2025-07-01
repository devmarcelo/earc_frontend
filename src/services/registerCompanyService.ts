import apiClient from "./apiClient";
import { useTranslation } from "react-i18next";

export const registerCompany = async (formData: FormData): Promise<string> => {
  const { t } = useTranslation();
  try {
    const response = await apiClient.post("/api/register-tenant/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return (
      response.data?.message ||
      t("register_success", { defaultValue: "Cadastro realizado com sucesso." })
    );
  } catch (error: any) {
    console.error("Erro ao registrar empresa:", error);
    throw new Error(
      error?.response?.data?.detail ||
        error?.message ||
        t("register_error", {
          defaultValue: "Erro desconhecido ao cadastrar empresa.",
        }),
    );
  }
};
