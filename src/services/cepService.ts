import axios from "axios";
import type { CepApiResponse } from "../@types";

export async function fetchAddressByZipcode(
  zipcode: string,
): Promise<CepApiResponse> {
  try {
    const response = await axios.get<CepApiResponse>(
      `https://viacep.com.br/ws/${zipcode.replace("-", "")}/json/`,
    );

    if (response.data.erro) {
      throw new Error("CEP não encontrado");
    }

    return response.data;
  } catch (error) {
    // Aqui poderia ser logado ou tratado globalmente
    throw new Error("Erro ao buscar o CEP");
  }
}
