import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import Select from "react-select"; // Assuming react-select is installed
import { AxiosError } from "axios"; // Import AxiosError
import type { Receita } from "../../Audit/types"; // Import Receita interface

// Define interfaces for related data (Cliente, Categoria)
interface SelectOption {
  value: number;
  label: string;
}

interface ClienteOption extends SelectOption {}
interface CategoriaOption extends SelectOption {}

// Define the interface for Receita form data
interface ReceitaFormData {
  data: string; // YYYY-MM-DD
  descricao: string;
  valor: number;
  cliente_id?: number | null; // Send ID to backend
  categoria_id?: number; // Send ID to backend
}

interface ReceitasFormProps {
  receita?: Receita | null; // Pass existing receita data for editing
  onSuccess: () => void; // Callback after successful save/update
  onCancel: () => void; // Callback to close the form
}

const ReceitasForm: React.FC<ReceitasFormProps> = ({
  receita,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReceitaFormData>({
    defaultValues: receita
      ? {
          data: receita.data,
          descricao: receita.descricao,
          valor: parseFloat(receita.valor.toString()), // Convert string back to number for form
          cliente_id: receita.cliente_id,
          categoria_id: receita.categoria_id,
        }
      : {
          data: new Date().toISOString().split("T")[0], // Default to today
          descricao: "",
          valor: 0,
          cliente_id: null,
          categoria_id: 0,
        },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [clienteOptions, setClienteOptions] = useState<ClienteOption[]>([]);
  const [categoriaOptions, setCategoriaOptions] = useState<CategoriaOption[]>(
    [],
  );
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  // Fetch options for Cliente and Categoria dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Replace with actual API calls
        const [clientesRes, categoriasRes] = await Promise.all([
          apiClient.get("/financial/clientes/?limit=1000"), // Fetch all clients for dropdown
          apiClient.get("/core/categories/?tipo=Receita&limit=1000"), // Fetch Receita categories
        ]);

        setClienteOptions(
          clientesRes.data.results.map((c: any) => ({
            value: c.id,
            label: c.nome,
          })),
        );
        setCategoriaOptions(
          categoriasRes.data.results.map((c: any) => ({
            value: c.id,
            label: c.nome,
          })),
        );
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
        setServerError(t("errors.failedToLoadOptions"));
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, [t]);

  useEffect(() => {
    // Reset form if the receita prop changes
    reset(
      receita
        ? {
            data: receita.data,
            descricao: receita.descricao,
            valor: parseFloat(receita.valor.toString()),
            cliente_id: receita.cliente_id,
            categoria_id: receita.categoria_id,
          }
        : {
            data: new Date().toISOString().split("T")[0],
            descricao: "",
            valor: 0,
            cliente_id: null,
            categoria_id: 0,
          },
    );
    setServerError(null); // Clear server error when form data changes
  }, [receita, reset]);

  // Function to parse backend validation errors
  const parseApiErrors = (error: any): string => {
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data === "object"
    ) {
      const fieldErrors = Object.entries(error.response.data)
        .map(
          ([field, messages]) =>
            `${field}: ${(messages as string[]).join(", ")}`,
        )
        .join("; ");
      if (fieldErrors) return fieldErrors;
      if (error.response.data.detail) {
        return error.response.data.detail;
      }
    }
    return t("errors.failedToSaveReceita"); // Default error
  };

  const onSubmit: SubmitHandler<ReceitaFormData> = async (data) => {
    setServerError(null);
    const payload = {
      ...data,
      valor: data.valor.toFixed(2), // Ensure value is sent as string with 2 decimal places
      cliente: data.cliente_id, // Send only ID
      categoria: data.categoria_id, // Send only ID
    };
    // Remove temporary fields if backend expects only 'cliente' and 'categoria' keys with IDs
    delete payload.cliente_id;
    delete payload.categoria_id;

    try {
      if (receita?.id) {
        // Update existing receita
        await apiClient.put(`/financial/receitas/${receita.id}/`, payload);
        console.log("Updating receita:", receita.id, payload);
      } else {
        // Create new receita
        await apiClient.post("/financial/receitas/", payload);
        console.log("Creating new receita:", payload);
      }
      onSuccess(); // Call success callback
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error saving receita:", axiosError);
      setServerError(parseApiErrors(axiosError));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg bg-white p-6 shadow-xl"
    >
      <h3 className="mb-6 border-b pb-2 text-xl font-semibold text-gray-800">
        {receita?.id
          ? t("financial.receitas.editTitle")
          : t("financial.receitas.addTitle")}
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

      {/* Data */}
      <div>
        <label
          htmlFor="data"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.receitas.form.data")}
        </label>
        <input
          id="data"
          type="date"
          {...register("data", { required: t("validation.requiredField") })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.data ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} rounded-md shadow-sm focus:ring-1 focus:outline-none sm:text-sm`}
          aria-invalid={errors.data ? "true" : "false"}
        />
        {errors.data && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.data.message}
          </p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label
          htmlFor="descricao"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.receitas.form.descricao")}
        </label>
        <input
          id="descricao"
          type="text"
          {...register("descricao", {
            required: t("validation.requiredField"),
          })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.descricao ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} rounded-md shadow-sm focus:ring-1 focus:outline-none sm:text-sm`}
          aria-invalid={errors.descricao ? "true" : "false"}
        />
        {errors.descricao && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.descricao.message}
          </p>
        )}
      </div>

      {/* Valor */}
      <div>
        <label
          htmlFor="valor"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.receitas.form.valor")}
        </label>
        <input
          id="valor"
          type="number"
          step="0.01"
          {...register("valor", {
            required: t("validation.requiredField"),
            valueAsNumber: true,
            min: {
              value: 0.01,
              message: t("validation.minValue", { min: 0.01 }),
            },
          })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.valor ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} rounded-md shadow-sm focus:ring-1 focus:outline-none sm:text-sm`}
          aria-invalid={errors.valor ? "true" : "false"}
        />
        {errors.valor && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.valor.message}
          </p>
        )}
      </div>

      {/* Cliente (Optional) */}
      <div>
        <label
          htmlFor="cliente_id"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.receitas.form.cliente")}
        </label>
        <Controller
          name="cliente_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              inputId="cliente_id"
              options={clienteOptions}
              isLoading={loadingOptions}
              value={clienteOptions.find((c) => c.value === field.value)}
              onChange={(val) => field.onChange(val?.value ?? null)}
              isClearable
              placeholder={t("common.selectPlaceholder")}
              className="mt-1"
              classNamePrefix="react-select"
              // Add styles for react-select if needed
            />
          )}
        />
      </div>

      {/* Categoria (Required) */}
      <div>
        <label
          htmlFor="categoria_id"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.receitas.form.categoria")}
        </label>
        <Controller
          name="categoria_id"
          control={control}
          rules={{ required: t("validation.requiredField") }}
          render={({ field }) => (
            <Select
              {...field}
              inputId="categoria_id"
              options={categoriaOptions}
              isLoading={loadingOptions}
              value={categoriaOptions.find((c) => c.value === field.value)}
              onChange={(val) => field.onChange(val?.value)}
              placeholder={t("common.selectPlaceholder")}
              className={`mt-1 ${errors.categoria_id ? "react-select-error" : ""}`}
              classNamePrefix="react-select"
              // Add styles for react-select if needed
            />
          )}
        />
        {errors.categoria_id && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.categoria_id.message}
          </p>
        )}
      </div>

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
          disabled={isSubmitting || loadingOptions}
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

export default ReceitasForm;
