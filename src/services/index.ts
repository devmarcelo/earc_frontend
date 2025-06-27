import type { CepApiResponse, CepData } from "../@types";

/**
 * Busca informações de endereço através do CEP usando a API ViaCEP
 * @param cep - CEP a ser consultado (apenas números)
 * @returns Promise com dados do endereço ou null se não encontrado
 * @throws Error se houver problema na requisição
 */
export const handleCepApi = async (cep: string): Promise<CepData | null> => {
  // Remove caracteres não numéricos
  const cleanCep = cep.replace(/\D/g, "");

  // Valida se o CEP tem 8 dígitos
  if (cleanCep.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos");
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

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
      endereco: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    throw new Error(
      "Erro ao consultar CEP. Verifique sua conexão e tente novamente.",
    );
  }
};

// Re-export existing services if any
export * from "./apiClient";
