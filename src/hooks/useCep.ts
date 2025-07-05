import { fetchAddressByZipcode } from "../services/cepService";
import type { CepApiResponse } from "../@types";
import { useState } from "react";

export function useZipcode(onAddressFound?: (address: CepApiResponse) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchZipcode = async (zipcode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await fetchAddressByZipcode(zipcode);
      if (onAddressFound) {
        onAddressFound(address);
      }
    } catch (error) {
      setError("CEP não encontrado.");
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchZipcode, isLoading, error };
}
