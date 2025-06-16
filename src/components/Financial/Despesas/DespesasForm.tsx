import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import Select from "react-select"; // Assuming react-select is installed
import { AxiosError } from "axios"; // Import AxiosError
import { type Despesa } from "./DespesasTable"; // Import Despesa interface

// Define interfaces for related data (Fornecedor, Categoria)
interface SelectOption {
  value: number;
  label: string;
}

interface FornecedorOption extends SelectOption {}
interface CategoriaOption extends SelectOption {}

// Define the interface for Despesa form data
interface DespesaFormData {
  data: string; // YYYY-MM-DD
  descricao: string;
  valor: number;
  fornecedor_id?: number | null; // Send ID to backend
  categoria_id?: number; // Send ID to backend
}

interface DespesasFormProps {
  despesa?: Despesa | null; // Pass existing despesa data for editing
  onSuccess: () => void; // Callback after successful save/update
  onCancel: () => void; // Callback to close the form
}

const DespesasForm: React.FC<DespesasFormProps> = ({
  despesa,
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
  } = useForm<DespesaFormData>({
    defaultValues: despesa
      ? {
          data: despesa.data,
          descricao: despesa.descricao,
          valor: parseFloat(despesa.valor), // Convert string back to number for form
          fornecedor_id: despesa.fornecedor?.id,
          categoria_id: despesa.categoria.id,
        }
      : {
          data: new Date().toISOString().split("T")[0], // Default to today
          descricao: "",
          valor: 0,
          fornecedor_id: null,
          categoria_id: 0,
        },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [fornecedorOptions, setFornecedorOptions] = useState<
    FornecedorOption[]
  >([]);
  const [categoriaOptions, setCategoriaOptions] = useState<CategoriaOption[]>(
    [],
  );
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  // Fetch options for Fornecedor and Categoria dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Replace with actual API calls
        const [fornecedoresRes, categoriasRes] = await Promise.all([
          apiClient.get("/financial/fornecedores/?limit=1000"),
          apiClient.get("/core/categories/?tipo=Despesa&limit=1000"), // Fetch Despesa categories
        ]);

        setFornecedorOptions(
          fornecedoresRes.data.results.map((f: any) => ({
            value: f.id,
            label: f.nome,
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
    // Reset form if the despesa prop changes
    reset(
      despesa
        ? {
            data: despesa.data,
            descricao: despesa.descricao,
            valor: parseFloat(despesa.valor),
            fornecedor_id: despesa.fornecedor?.id,
            categoria_id: despesa.categoria.id,
          }
        : {
            data: new Date().toISOString().split("T")[0],
            descricao: "",
            valor: 0,
            fornecedor_id: null,
            categoria_id: 0,
          },
    );
    setServerError(null); // Clear server error when form data changes
  }, [despesa, reset]);

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
    return t("errors.failedToSaveDespesa"); // Default error
  };

  const onSubmit: SubmitHandler<DespesaFormData> = async (data) => {
    setServerError(null);
    const payload = {
      ...data,
      valor: data.valor.toFixed(2), // Ensure value is sent as string with 2 decimal places
      fornecedor: data.fornecedor_id, // Send only ID
      categoria: data.categoria_id, // Send only ID
    };
    // Remove temporary fields if backend expects only 'fornecedor' and 'categoria' keys with IDs
    delete payload.fornecedor_id;
    delete payload.categoria_id;

    try {
      if (despesa?.id) {
        // Update existing despesa
        await apiClient.put(`/financial/despesas/${despesa.id}/`, payload);
        console.log("Updating despesa:", despesa.id, payload);
      } else {
        // Create new despesa
        await apiClient.post("/financial/despesas/", payload);
        console.log("Creating new despesa:", payload);
      }
      onSuccess(); // Call success callback
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error saving despesa:", axiosError);
      setServerError(parseApiErrors(axiosError));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg bg-white p-6 shadow-xl"
    >
      <h3 className="mb-6 border-b pb-2 text-xl font-semibold text-gray-800">
        {despesa?.id
          ? t("financial.despesas.editTitle")
          : t("financial.despesas.addTitle")}
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
          {t("financial.despesas.form.data")}
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
          {t("financial.despesas.form.descricao")}
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
          {t("financial.despesas.form.valor")}
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

      {/* Fornecedor (Optional) */}
      <div>
        <label
          htmlFor="fornecedor_id"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("financial.despesas.form.fornecedor")}
        </label>
        <Controller
          name="fornecedor_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              inputId="fornecedor_id"
              options={fornecedorOptions}
              isLoading={loadingOptions}
              value={fornecedorOptions.find((f) => f.value === field.value)}
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
          {t("financial.despesas.form.categoria")}
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

export default DespesasForm;
