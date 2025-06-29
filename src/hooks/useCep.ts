import { fetchAddressByCep } from "../services/cepService";
import type { CepApiResponse } from "../@types";
import { useState } from "react";

export function useCep(onAddressFound?: (address: CepApiResponse) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCep = async (cep: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await fetchAddressByCep(cep);
      if (onAddressFound) {
        onAddressFound(address);
      }
    } catch (error) {
      setError("CEP não encontrado.");
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchCep, isLoading, error };
}
