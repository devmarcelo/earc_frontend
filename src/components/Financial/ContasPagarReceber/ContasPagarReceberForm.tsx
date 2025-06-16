import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient.tsx"; // Adjust path as needed
import Select from "react-select"; // Assuming react-select is installed

// Define interfaces for related data
interface SelectOption {
  value: number;
  label: string;
}
interface ClienteOption extends SelectOption {}
interface FornecedorOption extends SelectOption {}

// Define the interface for ContaPagarReceber form data
interface ContaPagarReceberFormData {
  tipo: "Pagar" | "Receber";
  descricao: string;
  valor: number;
  data_vencimento: string; // YYYY-MM-DD
  cliente_id?: number | null;
  fornecedor_id?: number | null;
  // Status and data_pagamento are usually handled by backend logic or separate actions
}

// Define the interface for the full ContaPagarReceber object (if needed for editing)
interface ContaPagarReceber extends ContaPagarReceberFormData {
  id: number;
  status: string;
  data_pagamento?: string | null;
  cliente?: { id: number; nome: string };
  fornecedor?: { id: number; nome: string };
}

interface ContasPagarReceberFormProps {
  conta?: ContaPagarReceber | null; // Pass existing conta data for editing
  onSuccess: () => void; // Callback after successful save/update
  onCancel: () => void; // Callback to close the form
}

const ContasPagarReceberForm: React.FC<ContasPagarReceberFormProps> = ({
  conta,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContaPagarReceberFormData>({
    defaultValues: conta
      ? {
          ...conta,
          valor: parseFloat(conta.valor.toString()),
          cliente_id: conta.cliente?.id,
          fornecedor_id: conta.fornecedor?.id,
        }
      : {
          tipo: "Pagar", // Default type
          descricao: "",
          valor: 0,
          data_vencimento: new Date().toISOString().split("T")[0],
          cliente_id: null,
          fornecedor_id: null,
        },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [clienteOptions, setClienteOptions] = useState<ClienteOption[]>([]);
  const [fornecedorOptions, setFornecedorOptions] = useState<
    FornecedorOption[]
  >([]);

  const selectedTipo = watch("tipo"); // Watch the 'tipo' field to conditionally show Cliente/Fornecedor

  // Fetch options for Cliente and Fornecedor dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // TODO: Replace with actual API calls
        // const clientesRes = await apiClient.get('/financial/clientes/?limit=1000');
        // const fornecedoresRes = await apiClient.get('/financial/fornecedores/?limit=1000');

        // Placeholder options
        const placeholderClientes: ClienteOption[] = [
          { value: 1, label: "Cliente Exemplo 1" },
          { value: 2, label: "Cliente Exemplo 2" },
        ];
        const placeholderFornecedores: FornecedorOption[] = [
          { value: 1, label: "Fornecedor Exemplo A" },
          { value: 2, label: "Fornecedor Exemplo B" },
        ];

        // setClienteOptions(clientesRes.data.results.map((c: any) => ({ value: c.id, label: c.nome })));
        // setFornecedorOptions(fornecedoresRes.data.results.map((f: any) => ({ value: f.id, label: f.nome })));
        setClienteOptions(placeholderClientes);
        setFornecedorOptions(placeholderFornecedores);
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    // Reset form if the conta prop changes
    reset(
      conta
        ? {
            ...conta,
            valor: parseFloat(conta.valor.toString()),
            cliente_id: conta.cliente?.id,
            fornecedor_id: conta.fornecedor?.id,
          }
        : {
            tipo: "Pagar",
            descricao: "",
            valor: 0,
            data_vencimento: new Date().toISOString().split("T")[0],
            cliente_id: null,
            fornecedor_id: null,
          },
    );
  }, [conta, reset]);

  const onSubmit: SubmitHandler<ContaPagarReceberFormData> = async (data) => {
    setServerError(null);
    const payload = {
      ...data,
      valor: data.valor.toFixed(2),
      cliente: data.tipo === "Receber" ? data.cliente_id : null,
      fornecedor: data.tipo === "Pagar" ? data.fornecedor_id : null,
    };
    delete payload.cliente_id;
    delete payload.fornecedor_id;

    try {
      if (conta?.id) {
        // Update existing conta
        // TODO: Replace with actual API call
        // await apiClient.put(`/financial/contas-pagar-receber/${conta.id}/`, payload);
        console.log("Updating conta:", conta.id, payload);
      } else {
        // Create new conta
        // TODO: Replace with actual API call
        // await apiClient.post('/financial/contas-pagar-receber/', payload);
        console.log("Creating new conta:", payload);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Error saving conta:", err);
      setServerError(t("errors.failedToSaveContaPagarReceber"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded bg-white p-4 shadow-md"
    >
      <h3 className="mb-4 text-xl font-semibold">
        {conta?.id
          ? t("financial.contasPagarReceber.editTitle")
          : t("financial.contasPagarReceber.addTitle")}
      </h3>

      {serverError && (
        <div className="rounded bg-red-100 p-2 text-red-500">{serverError}</div>
      )}

      {/* Tipo */}
      <div>
        <label
          htmlFor="tipo"
          className="block text-sm font-medium text-gray-700"
        >
          {t("financial.contasPagarReceber.form.tipo")}
        </label>
        <select
          id="tipo"
          {...register("tipo", { required: t("validation.requiredField") })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.tipo ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm`}
        >
          <option value="Pagar">
            {t("financial.contasPagarReceber.tipos.Pagar")}
          </option>
          <option value="Receber">
            {t("financial.contasPagarReceber.tipos.Receber")}
          </option>
        </select>
        {errors.tipo && (
          <p className="mt-1 text-sm text-red-500">{errors.tipo.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-gray-700"
        >
          {t("financial.contasPagarReceber.form.descricao")}
        </label>
        <input
          id="descricao"
          type="text"
          {...register("descricao", {
            required: t("validation.requiredField"),
          })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.descricao ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm`}
        />
        {errors.descricao && (
          <p className="mt-1 text-sm text-red-500">
            {errors.descricao.message}
          </p>
        )}
      </div>

      {/* Valor */}
      <div>
        <label
          htmlFor="valor"
          className="block text-sm font-medium text-gray-700"
        >
          {t("financial.contasPagarReceber.form.valor")}
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
          className={`mt-1 block w-full border px-3 py-2 ${errors.valor ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm`}
        />
        {errors.valor && (
          <p className="mt-1 text-sm text-red-500">{errors.valor.message}</p>
        )}
      </div>

      {/* Data Vencimento */}
      <div>
        <label
          htmlFor="data_vencimento"
          className="block text-sm font-medium text-gray-700"
        >
          {t("financial.contasPagarReceber.form.vencimento")}
        </label>
        <input
          id="data_vencimento"
          type="date"
          {...register("data_vencimento", {
            required: t("validation.requiredField"),
          })}
          className={`mt-1 block w-full border px-3 py-2 ${errors.data_vencimento ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm`}
        />
        {errors.data_vencimento && (
          <p className="mt-1 text-sm text-red-500">
            {errors.data_vencimento.message}
          </p>
        )}
      </div>

      {/* Cliente (Conditional) */}
      {selectedTipo === "Receber" && (
        <div>
          <label
            htmlFor="cliente_id"
            className="block text-sm font-medium text-gray-700"
          >
            {t("financial.contasPagarReceber.form.cliente")}
          </label>
          <Controller
            name="cliente_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                inputId="cliente_id"
                options={clienteOptions}
                value={clienteOptions.find((c) => c.value === field.value)}
                onChange={(val) => field.onChange(val?.value ?? null)}
                isClearable
                placeholder={t("common.selectPlaceholder")}
                className="mt-1"
                classNamePrefix="react-select"
              />
            )}
          />
          {/* Add validation if cliente is required for 'Receber' type */}
        </div>
      )}

      {/* Fornecedor (Conditional) */}
      {selectedTipo === "Pagar" && (
        <div>
          <label
            htmlFor="fornecedor_id"
            className="block text-sm font-medium text-gray-700"
          >
            {t("financial.contasPagarReceber.form.fornecedor")}
          </label>
          <Controller
            name="fornecedor_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                inputId="fornecedor_id"
                options={fornecedorOptions}
                value={fornecedorOptions.find((f) => f.value === field.value)}
                onChange={(val) => field.onChange(val?.value ?? null)}
                isClearable
                placeholder={t("common.selectPlaceholder")}
                className="mt-1"
                classNamePrefix="react-select"
              />
            )}
          />
          {/* Add validation if fornecedor is required for 'Pagar' type */}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </form>
  );
};

export default ContasPagarReceberForm;
