import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import { format } from "date-fns"; // For date formatting
import { AxiosError } from "axios"; // Import AxiosError for type checking
import type { Despesa, PaginatedResponse } from "../../Audit/types";
import { formatDate, formatUser } from "../../../utils/formatters";
import AuditInfo from "../../Audit/AuditInfo";

interface DespesasTableProps {
  onEdit: (despesa: Despesa) => void;
  onDeleteSuccess: () => void; // Callback to refresh data after delete
  refreshTrigger: number; // Add a trigger to force refresh
  showAuditInfo?: boolean;
  expandedRows?: Set<number>;
  onToggleExpand?: (id: number) => void;
}

const DespesasTable: React.FC<DespesasTableProps> = ({
  onEdit,
  onDeleteSuccess,
  refreshTrigger,
  showAuditInfo = false,
  expandedRows = new Set(),
  onToggleExpand,
}) => {
  const { t } = useTranslation();
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for pagination (currentPage, totalPages, etc.)

  const fetchDespesas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual API call using apiClient
      const response = await apiClient.get<PaginatedResponse<Despesa>>(
        "/financial/despesas/",
      );
      setDespesas(response.data.results); // Assuming pagination
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching despesas:", axiosError);
      if (axiosError.response?.status === 401) {
        setError(t("errors.unauthorized"));
      } else {
        setError(t("errors.failedToFetchDespesas")); // i18n key for error
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDespesas();
  }, [fetchDespesas, refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleDelete = async (id: number) => {
    // TODO: Add confirmation dialog
    if (!window.confirm(t("financial.despesas.confirmDelete"))) {
      return;
    }
    try {
      await apiClient.delete(`/financial/despesas/${id}/`);
      // Refresh the list after successful deletion
      onDeleteSuccess();
    } catch (err) {
      console.error("Error deleting despesa:", err);
      // TODO: Show error message to user
      alert(t("errors.failedToDeleteDespesa"));
    }
  };

  const handleToggleExpand = (id: number) => {
    if (onToggleExpand) {
      onToggleExpand(id);
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
              {t("financial.despesas.table.data")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.despesas.table.descricao")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.despesas.table.fornecedor")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.despesas.table.categoria")}
            </th>
            <th className="border-b px-4 py-2 text-right text-sm font-semibold text-gray-600">
              {t("financial.despesas.table.valor")}
            </th>
            {showAuditInfo && (
              <>
                <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  {t("common.audit.createdBy")}
                </th>
                <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  {t("common.audit.createdOn")}
                </th>
                <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  {t("common.audit.updatedBy")}
                </th>
                <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  {t("common.audit.updatedAt")}
                </th>
              </>
            )}
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("common.actions")}
            </th>
            {onToggleExpand && (
              <th className="border-b px-4 py-2 text-center text-sm font-semibold text-gray-600">
                {t("common.details")}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {despesas.length > 0 ? (
            despesas.map((despesa) => (
              <React.Fragment key={despesa.id}>
                <tr className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2 text-sm">
                    {format(new Date(despesa.data + "T00:00:00"), "dd/MM/yyyy")}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {despesa.descricao}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {despesa.fornecedor?.nome ?? "-"}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {despesa.categoria?.nome}
                  </td>
                  <td className="border-b px-4 py-2 text-right text-sm">
                    {parseFloat(despesa.valor.toString()).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </td>
                  {showAuditInfo && (
                    <>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(despesa.created_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(despesa.created_on)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(despesa.updated_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(despesa.updated_at)}
                      </td>
                    </>
                  )}
                  <td className="border-b px-4 py-2 text-sm">
                    <button
                      onClick={() => onEdit(despesa)}
                      className="mr-3 font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(despesa.id)}
                      className="font-medium text-red-600 hover:text-red-900"
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                  {onToggleExpand && (
                    <td className="border-b px-4 py-2 text-center">
                      <button
                        onClick={() => handleToggleExpand(despesa.id)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        {expandedRows.has(despesa.id) ? "▼" : "▶"}
                      </button>
                    </td>
                  )}
                </tr>
                {onToggleExpand && expandedRows.has(despesa.id) && (
                  <tr>
                    <td
                      colSpan={showAuditInfo ? 11 : 7}
                      className="bg-gray-50 px-4 py-2"
                    >
                      <AuditInfo
                        auditData={despesa}
                        compact={false}
                        className="max-w-2xl"
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  showAuditInfo
                    ? onToggleExpand
                      ? 11
                      : 10
                    : onToggleExpand
                      ? 7
                      : 6
                }
                className="px-4 py-4 text-center text-gray-500"
              >
                {t("financial.despesas.table.noDespesas")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* TODO: Add pagination controls if API supports it */}
    </div>
  );
};

export default DespesasTable;
