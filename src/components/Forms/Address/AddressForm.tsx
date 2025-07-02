import { useTranslation } from "react-i18next";
import { FormField } from "../../Shared";
import { useCep } from "../../../hooks/useCep";
import type { AddressFormProps } from "../../../@types";
import { batchUpdateFormData } from "../../../utils/batchUpdateFormData";
import { useState } from "react";
import { formatCep } from "../../../utils/formatters";

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  setFormData,
  onChange,
  onNext,
  onPrevious,
}) => {
  const { t } = useTranslation();
  const [cep, setCep] = useState("");

  const { fetchCep, isLoading, error } = useCep((address) => {
    batchUpdateFormData(
      {
        cep: address.cep,
        endereco: address.logradouro,
        bairro: address.bairro,
        cidade: address.localidade,
        estado: address.uf,
      },
      formData,
      setFormData,
    );
  });

  const handleChangeCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatCep(raw);
    setCep(formatted);

    setFormData({
      ...formData,
      cep: formatted,
    });

    if (formatted.length === 9) {
      fetchCep(formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("address_information", { defaultValue: "Endereço da Empresa" })}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t("address_form_description", {
            defaultValue: "Informe o endereço completo da sua empresa",
          })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FormField
            id="cep"
            name="cep"
            type="text"
            label={t("cep", { defaultValue: "CEP" })}
            placeholder="00000-000"
            value={formData.cep}
            onChange={handleChangeCep}
            required
            maxlength={9}
          />
          {isLoading && (
            <div className="absolute top-8 right-3 flex items-center">
              <svg
                className="h-4 w-4 animate-spin text-indigo-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          {error && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <svg
                className="mr-1 h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="text-right text-sm">
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-1 font-medium text-indigo-600 italic underline hover:text-indigo-500"
          >
            Não sei meu CEP
          </a>
        </div>

        <FormField
          id="endereco"
          name="endereco"
          type="text"
          label={t("address", { defaultValue: "Endereço" })}
          placeholder={t("address_placeholder", {
            defaultValue: "Rua, Avenida, etc.",
          })}
          value={formData.endereco}
          onChange={onChange}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="numero"
            name="numero"
            type="text"
            label={t("number", { defaultValue: "Número" })}
            placeholder="123"
            value={formData.numero}
            onChange={onChange}
            required
          />

          <FormField
            id="complemento"
            name="complemento"
            type="text"
            label={t("complement", { defaultValue: "Complemento" })}
            placeholder={t("complement_placeholder", {
              defaultValue: "Apto, Sala, etc.",
            })}
            value={formData.complemento}
            onChange={onChange}
          />
        </div>

        <FormField
          id="bairro"
          name="bairro"
          type="text"
          label={t("neighborhood", { defaultValue: "Bairro" })}
          placeholder={t("neighborhood_placeholder", {
            defaultValue: "Nome do bairro",
          })}
          value={formData.bairro}
          onChange={onChange}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="cidade"
            name="cidade"
            type="text"
            label={t("city", { defaultValue: "Cidade" })}
            placeholder={t("city_placeholder", {
              defaultValue: "Nome da cidade",
            })}
            value={formData.cidade}
            onChange={onChange}
            required
          />

          <FormField
            id="estado"
            name="estado"
            type="text"
            label={t("state", { defaultValue: "Estado" })}
            placeholder="SP"
            value={formData.estado}
            onChange={onChange}
            required
          />
        </div>

        <FormField
          id="pais"
          name="pais"
          type="text"
          label={t("country", { defaultValue: "País" })}
          placeholder={t("country_placeholder", {
            defaultValue: "Brasil",
          })}
          value={formData.pais}
          onChange={onChange}
          required
        />

        {(onNext || onPrevious) && (
          <div className="flex justify-between pt-4">
            {onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                {t("previous_step", { defaultValue: "Passo Anterior" })}
              </button>
            )}
            {onNext && (
              <button
                type="submit"
                onClick={onNext}
                className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                {t("next_step", { defaultValue: "Próximo Passo" })}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddressForm;
