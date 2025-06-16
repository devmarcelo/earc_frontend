import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient.tsx"; // Adjust path as needed
import { format } from "date-fns"; // For date formatting
import { AxiosError } from "axios"; // Import AxiosError for type checking

// Define the interface for ContaPagarReceber data based on backend model
export interface ContaPagarReceber {
  id: number;
  tipo: "Pagar" | "Receber";
  descricao: string;
  valor: string; // Decimal string
  data_vencimento: string; // Date string (e.g., "YYYY-MM-DD")
  status: "Pendente" | "Pago" | "Atrasado" | "Cancelado";
  data_pagamento?: string | null; // Date string or null
  cliente?: { id: number; nome: string }; // Optional, for Receber
  fornecedor?: { id: number; nome: string }; // Optional, for Pagar
  created_at: string;
  updated_at: string;
}

// Define the interface for the API response (assuming pagination)
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ContasPagarReceberTableProps {
  onEdit: (conta: ContaPagarReceber) => void;
  onMarkAsPaidSuccess: () => void; // Callback after marking as paid
  onDeleteSuccess: () => void; // Callback to refresh data after delete
  refreshTrigger: number; // Add a trigger to force refresh
}

const ContasPagarReceberTable: React.FC<ContasPagarReceberTableProps> = ({
  onEdit,
  onMarkAsPaidSuccess,
  onDeleteSuccess,
  refreshTrigger,
}) => {
  const { t } = useTranslation();
  const [contas, setContas] = useState<ContaPagarReceber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for pagination and filtering/sorting

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "text-green-700 bg-green-100";
      case "Atrasado":
        return "text-red-700 bg-red-100";
      case "Pendente":
        return "text-yellow-700 bg-yellow-100";
      case "Cancelado":
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const fetchContas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual API call using apiClient
      const response = await apiClient.get<
        PaginatedResponse<ContaPagarReceber>
      >("/financial/contas-pagar-receber/");
      setContas(response.data.results); // Assuming pagination
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching contas:", axiosError);
      if (axiosError.response?.status === 401) {
        setError(t("errors.unauthorized"));
      } else {
        setError(t("errors.failedToFetchContasPagarReceber")); // i18n key
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchContas();
  }, [fetchContas, refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleMarkAsPaid = async (id: number) => {
    // TODO: Add confirmation dialog
    if (!window.confirm(t("financial.contasPagarReceber.confirmMarkAsPaid"))) {
      return;
    }
    try {
      // Assuming an endpoint exists to mark as paid, e.g., PATCH /financial/contas-pagar-receber/{id}/mark_paid/
      await apiClient.patch(`/financial/contas-pagar-receber/${id}/mark_paid/`);
      onMarkAsPaidSuccess(); // Refresh data via parent
    } catch (err) {
      console.error("Error marking conta as paid:", err);
      alert(t("errors.failedToMarkAsPaid"));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("financial.contasPagarReceber.confirmDelete"))) {
      return;
    }
    try {
      await apiClient.delete(`/financial/contas-pagar-receber/${id}/`);
      onDeleteSuccess(); // Refresh data via parent
    } catch (err) {
      console.error("Error deleting conta:", err);
      alert(t("errors.failedToDeleteConta"));
    }
  };

  if (loading) {
    return <div className="p-4 text-center">{t("common.loading")}...</div>;
  }

  if (error) {
    return <div className="rounded bg-red-100 p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.contasPagarReceber.table.tipo")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.contasPagarReceber.table.descricao")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.contasPagarReceber.table.clienteFornecedor")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.contasPagarReceber.table.vencimento")}
            </th>
            <th className="border-b px-4 py-2 text-right text-sm font-semibold text-gray-600">
              {t("financial.contasPagarReceber.table.valor")}
            </th>
            <th className="border-b px-4 py-2 text-center text-sm font-semibold text-gray-600">
              {t("financial.contasPagarReceber.table.status")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {contas.length > 0 ? (
            contas.map((conta) => (
              <tr key={conta.id} className="hover:bg-gray-50">
                <td
                  className={`border-b px-4 py-2 text-sm font-medium ${conta.tipo === "Pagar" ? "text-red-600" : "text-green-600"}`}
                >
                  {t(`financial.contasPagarReceber.tipos.${conta.tipo}`)}
                </td>
                <td className="border-b px-4 py-2 text-sm">
                  {conta.descricao}
                </td>
                <td className="border-b px-4 py-2 text-sm">
                  {conta.cliente?.nome ?? conta.fornecedor?.nome ?? "–"}
                </td>
                <td className="border-b px-4 py-2 text-sm">
                  {format(
                    new Date(conta.data_vencimento + "T00:00:00"),
                    "dd/MM/yyyy",
                  )}
                </td>
                <td className="border-b px-4 py-2 text-right text-sm">
                  {parseFloat(conta.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(conta.status)}`}
                  >
                    {t(`financial.contasPagarReceber.status.${conta.status}`)}
                  </span>
                </td>
                <td className="border-b px-4 py-2 text-sm whitespace-nowrap">
                  <button
                    onClick={() => onEdit(conta)}
                    className="mr-3 font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {t("common.edit")}
                  </button>
                  {conta.status === "Pendente" ||
                  conta.status === "Atrasado" ? (
                    <button
                      onClick={() => handleMarkAsPaid(conta.id)}
                      className="mr-3 font-medium text-green-600 hover:text-green-900"
                    >
                      {t("financial.contasPagarReceber.actions.markAsPaid")}
                    </button>
                  ) : null}
                  <button
                    onClick={() => handleDelete(conta.id)}
                    className="font-medium text-red-600 hover:text-red-900"
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                {t("financial.contasPagarReceber.table.noContas")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* TODO: Add pagination controls if API supports it */}
    </div>
  );
};

export default ContasPagarReceberTable;
