import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import { AxiosError } from "axios"; // Import AxiosError
import { type Cliente } from "../../Audit/types"; // Import Cliente interface
import AuditInfo from "../../Audit/AuditInfo";

// Define the interface for form data (can be simpler than the full Cliente)
interface ClienteFormData {
  nome: string;
  contato?: string;
  endereco?: string;
}

interface ClientesFormProps {
  cliente?: Cliente | null; // Pass existing cliente data for editing
  onSuccess: () => void; // Callback after successful save/update
  onCancel: () => void; // Callback to close the form
}

const ClientesForm: React.FC<ClientesFormProps> = ({
  cliente,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    defaultValues: cliente
      ? {
          nome: cliente.nome,
          contato: cliente.contato,
          endereco: cliente.endereco,
        }
      : { nome: "", contato: "", endereco: "" },
  });
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form if the cliente prop changes (e.g., opening form for a different client)
    reset(
      cliente
        ? {
            nome: cliente.nome,
            contato: cliente.contato,
            endereco: cliente.endereco,
          }
        : { nome: "", contato: "", endereco: "" },
    );
    setServerError(null); // Clear server error when form data changes
  }, [cliente, reset]);

  // Function to parse backend validation errors
  const parseApiErrors = (error: any): string => {
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data === "object"
    ) {
      // Example: Extract field-specific errors
      const fieldErrors = Object.entries(error.response.data)
        .map(
          ([field, messages]) =>
            `${field}: ${(messages as string[]).join(", ")}`,
        )
        .join("; ");
      if (fieldErrors) return fieldErrors;
      // Example: Extract non-field errors
      if (error.response.data.detail) {
        return error.response.data.detail;
      }
    }
    return t("errors.failedToSaveCliente"); // Default error
  };

  const onSubmit: SubmitHandler<ClienteFormData> = async (data) => {
    setServerError(null);
    try {
      if (cliente?.id) {
        // Update existing cliente
        await apiClient.put(`/financial/clientes/${cliente.id}/`, data);
        console.log("Updating cliente:", cliente.id, data);
      } else {
        // Create new cliente
        await apiClient.post("/financial/clientes/", data);
        console.log("Creating new cliente:", data);
      }
      onSuccess(); // Call success callback
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error saving cliente:", axiosError);
      setServerError(parseApiErrors(axiosError));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg bg-white p-6 shadow-xl"
    >
      <h3 className="mb-6 border-b pb-2 text-xl font-semibold text-gray-800">
        {cliente?.id
          ? t("financial.clientes.editTitle")
          : t("financial.clientes.addTitle")}
      </h3>

      {serverError && (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          <span className="font-medium">{t("errors.errorOccurred")}:</span>{" "}
          {serverError}
        </div>
      )}

      {/* Nome */}
      <div>
        <label
          htmlFor="nome"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.clientes.form.nome")}
        </label>
        <input
          id="nome"
          type="text"
          {...register("nome", { required: t("validation.requiredField") })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.nome ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} rounded-md shadow-sm focus:ring-1 focus:outline-none sm:text-sm`}
          aria-invalid={errors.nome ? "true" : "false"}
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.nome.message}
          </p>
        )}
      </div>

      {/* Contato */}
      <div>
        <label
          htmlFor="contato"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.clientes.form.contato")}
        </label>
        <input
          id="contato"
          type="text" // Consider type="email" or type="tel"
          {...register("contato")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
        />
      </div>

      {/* Endereço */}
      <div>
        <label
          htmlFor="endereco"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.clientes.form.endereco")}
        </label>
        <textarea
          id="endereco"
          rows={3}
          {...register("endereco")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
        />
      </div>

      {/* Audit Information - Show only when editing existing cliente */}
      {cliente?.id && (
        <div className="border-t pt-4">
          <AuditInfo auditData={cliente} compact={true} className="text-xs" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg
                className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("common.saving")}...
            </>
          ) : (
            t("common.save")
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientesForm;
