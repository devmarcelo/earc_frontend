import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import { format } from "date-fns"; // For date formatting
import { AxiosError } from "axios"; // Import AxiosError for type checking
import type { Receita, PaginatedResponse } from "../../Audit/types";
import AuditInfo from "../../Audit/AuditInfo";
import { formatDate, formatUser } from "../../../utils/formatters";

interface ReceitasTableProps {
  onEdit: (receita: Receita) => void;
  onDeleteSuccess: () => void; // Callback to refresh data after delete
  refreshTrigger: number; // Add a trigger to force refresh
  showAuditInfo?: boolean;
  expandedRows?: Set<number>;
  onToggleExpand?: (id: number) => void;
}

const ReceitasTable: React.FC<ReceitasTableProps> = ({
  onEdit,
  onDeleteSuccess,
  refreshTrigger,
  showAuditInfo = false,
  expandedRows = new Set(),
  onToggleExpand,
}) => {
  const { t } = useTranslation();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for pagination (currentPage, totalPages, etc.)

  const fetchReceitas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual API call using apiClient
      const response = await apiClient.get<PaginatedResponse<Receita>>(
        "/financial/receitas/",
      );
      setReceitas(response.data.results); // Assuming pagination
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching receitas:", axiosError);
      if (axiosError.response?.status === 401) {
        setError(t("errors.unauthorized"));
      } else {
        setError(t("errors.failedToFetchReceitas")); // i18n key for error
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchReceitas();
  }, [fetchReceitas, refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleDelete = async (id: number) => {
    // TODO: Add confirmation dialog
    if (!window.confirm(t("financial.receitas.confirmDelete"))) {
      return;
    }
    try {
      await apiClient.delete(`/financial/receitas/${id}/`);
      // Refresh the list after successful deletion
      onDeleteSuccess();
    } catch (err) {
      console.error("Error deleting receita:", err);
      // TODO: Show error message to user
      alert(t("errors.failedToDeleteReceita"));
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
              {t("financial.receitas.table.data")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.receitas.table.descricao")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.receitas.table.cliente")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.receitas.table.categoria")}
            </th>
            <th className="border-b px-4 py-2 text-right text-sm font-semibold text-gray-600">
              {t("financial.receitas.table.valor")}
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
          {receitas.length > 0 ? (
            receitas.map((receita) => (
              <React.Fragment key={receita.id}>
                <tr className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2 text-sm">
                    {format(new Date(receita.data + "T00:00:00"), "dd/MM/yyyy")}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {receita.descricao}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {receita.cliente?.nome ?? "-"}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {receita.categoria.nome}
                  </td>
                  <td className="border-b px-4 py-2 text-right text-sm">
                    {parseFloat(receita.valor.toString()).toLocaleString(
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
                        {formatUser(receita.created_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(receita.created_on)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(receita.updated_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(receita.updated_at)}
                      </td>
                    </>
                  )}
                  <td className="border-b px-4 py-2 text-sm">
                    <button
                      onClick={() => onEdit(receita)}
                      className="mr-3 font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(receita.id)}
                      className="font-medium text-red-600 hover:text-red-900"
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                  {onToggleExpand && (
                    <td className="border-b px-4 py-2 text-center">
                      <button
                        onClick={() => handleToggleExpand(receita.id)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        {expandedRows.has(receita.id) ? "▼" : "▶"}
                      </button>
                    </td>
                  )}
                </tr>
                {onToggleExpand && expandedRows.has(receita.id) && (
                  <tr>
                    <td
                      colSpan={showAuditInfo ? 11 : 7}
                      className="bg-gray-50 px-4 py-2"
                    >
                      <AuditInfo
                        auditData={receita}
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
                {t("financial.receitas.table.noReceitas")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* TODO: Add pagination controls if API supports it */}
    </div>
  );
};

export default ReceitasTable;
