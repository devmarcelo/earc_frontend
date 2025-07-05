import { t } from "i18next";
import type { CepApiResponse, ZipcodeData } from "../@types";

/**
 * Busca informações de endereço através do CEP usando a API ViaCEP
 * @param zipcode - CEP a ser consultado (apenas números)
 * @returns Promise com dados do endereço ou null se não encontrado
 * @throws Error se houver problema na requisição
 */
export const handleZipcodeApi = async (
  zipcode: string,
): Promise<ZipcodeData | null> => {
  // Remove caracteres não numéricos
  const cleanZipcode = zipcode.replace(/\D/g, "");

  // Valida se o CEP tem 8 dígitos
  if (cleanZipcode.length !== 8) {
    throw new Error(
      t("zipcode_minlength_error", { defaultValue: "CEP deve ter 8 dígitos" }),
    );
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanZipcode}/json/`,
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data: CepApiResponse = await response.json();

    // Verifica se a API retornou erro
    if (data.erro) {
      return null; // CEP não encontrado
    }

    // Mapeia os dados da API para o formato esperado
    return {
      address: data.logradouro || "",
      neighborhood: data.bairro || "",
      town: data.localidade || "",
      address_state: data.uf || "",
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    throw new Error(
      t("zipcode_fetching_error", {
        defaultValue:
          "Erro ao consultar CEP. Verifique sua conexão e tente novamente.",
      }),
    );
  }
};

// Re-export existing services if any
export * from "./apiClient";
