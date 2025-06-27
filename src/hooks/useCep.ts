import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { handleCepApi } from "../services";
import type { CepData, UseCepReturn } from "../@types";

/**
 * Hook para busca de CEP com estado de loading e tratamento de erros
 * Inclui funções para validação e manipulação de eventos de CEP
 * @returns Objeto com estado de loading, erro, funções de busca, validação e manipulação
 */
export const useCep = (): UseCepReturn => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca dados do endereço pelo CEP
   * @param cep - CEP a ser consultado
   * @returns Promise com dados do endereço ou null se não encontrado
   */
  const searchCep = useCallback(
    async (cep: string): Promise<CepData | null> => {
      // Limpa erro anterior
      setError(null);

      // Remove caracteres não numéricos
      const cleanCep = cep.replace("-", "");

      // Valida se o CEP tem 8 dígitos
      if (cleanCep.length !== 8) {
        setError(
          t("invalid_cep", {
            defaultValue: "CEP deve ter 8 dígitos",
          }),
        );
        return null;
      }

      setIsLoading(true);

      try {
        const result = await handleCepApi(cleanCep);

        if (!result) {
          setError(
            t("cep_not_found", {
              defaultValue: "CEP não encontrado",
            }),
          );
          return null;
        }

        console.log("CEP Data received:", result); // Debug
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t("cep_search_error", {
                defaultValue: "Erro ao buscar CEP. Tente novamente.",
              });

        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  /**
   * Valida formato do CEP
   * @param value - Valor do CEP a ser validado
   * @returns String com erro ou null se válido
   */
  const validateCep = useCallback(
    (value: string): string | null => {
      const cleanCep = value.replace("-", "");
      if (cleanCep.length !== 8) {
        return t("invalid_cep", {
          defaultValue: "CEP deve ter 8 dígitos",
        });
      }
      return null;
    },
    [t],
  );

  /**
   * Limpa o estado de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Manipula mudança no campo CEP com formatação e busca automática
   * @param e - Evento de mudança do input
   * @param onChange - Função de callback para atualizar o formulário
   */
  const handleCepChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    ): Promise<void> => {
      const inputValue = e.target.value;
      console.log("Input value:", inputValue); // Debug

      // Remove caracteres não numéricos
      const cep = inputValue.replace("-", "");
      console.log("Clean CEP:", cep); // Debug

      // Limpa erro anterior
      clearError();

      // Formata CEP com máscara (00000-000) apenas se tiver dígitos suficientes
      let formattedCep = cep;
      if (cep.length > 5) {
        formattedCep = cep.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
      }
      console.log("Formatted CEP:", formattedCep); // Debug

      // Cria evento sintético para atualizar o campo CEP
      const syntheticEvent = {
        target: {
          name: "cep",
          value: formattedCep,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      // Atualiza o campo CEP no formulário
      onChange(syntheticEvent);

      // Auto-preenchimento se CEP estiver completo (8 dígitos)
      if (cep.length === 8) {
        const cepData = await searchCep(cep);

        if (cepData) {
          console.log("Searching CEP:", cep); // Debug

          // Lista de campos para atualizar com dados do CEP
          const fieldsToUpdate = [
            { name: "endereco", value: cepData.endereco },
            { name: "bairro", value: cepData.bairro },
            { name: "cidade", value: cepData.cidade },
            { name: "estado", value: cepData.estado },
          ];

          // Atualiza cada campo imediatamente
          fieldsToUpdate.forEach((field) => {
            if (field.value) {
              console.log(
                `Updating field ${field.name} with value:`,
                field.value,
              ); // Debug
              const fieldEvent = {
                target: {
                  name: field.name,
                  value: field.value,
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(fieldEvent);
            }
          });
        }
      }
    },
    [searchCep, clearError],
  );

  return {
    isLoading,
    error,
    searchCep,
    clearError,
    handleCepChange,
    validateCep,
  };
};
