import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import { AxiosError } from "axios"; // Import AxiosError for type checking
import type { Fornecedor, PaginatedResponse } from "../../Audit/types";
import AuditInfo from "../../Audit/AuditInfo";
import { formatDate, formatUser } from "../../../utils/formatters";

interface FornecedoresTableProps {
  onEdit: (fornecedor: Fornecedor) => void;
  onDeleteSuccess: () => void; // Callback to refresh data after delete
  refreshTrigger: number; // Add a trigger to force refresh
  showAuditInfo?: boolean;
  expandedRows?: Set<number>;
  onToggleExpand?: (id: number) => void;
}

const FornecedoresTable: React.FC<FornecedoresTableProps> = ({
  onEdit,
  onDeleteSuccess,
  refreshTrigger,
  showAuditInfo = false,
  expandedRows = new Set(),
  onToggleExpand,
}) => {
  const { t } = useTranslation();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for pagination (currentPage, totalPages, etc.)

  const fetchFornecedores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual API call using apiClient
      const response = await apiClient.get<PaginatedResponse<Fornecedor>>(
        "/financial/fornecedores/",
      );
      setFornecedores(response.data.results); // Assuming pagination
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching fornecedores:", axiosError);
      if (axiosError.response?.status === 401) {
        setError(t("errors.unauthorized"));
      } else {
        setError(t("errors.failedToFetchFornecedores")); // i18n key for error
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores, refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleDelete = async (id: number) => {
    // TODO: Add confirmation dialog
    if (!window.confirm(t("financial.fornecedores.confirmDelete"))) {
      return;
    }
    try {
      await apiClient.delete(`/financial/fornecedores/${id}/`);
      // Refresh the list after successful deletion
      onDeleteSuccess();
    } catch (err) {
      console.error("Error deleting fornecedor:", err);
      // TODO: Show error message to user
      alert(t("errors.failedToDeleteFornecedor"));
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
              {t("financial.fornecedores.table.nome")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.fornecedores.table.contato")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.fornecedores.table.cnpj")}
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
          {fornecedores.length > 0 ? (
            fornecedores.map((fornecedor) => (
              <React.Fragment key={fornecedor.id}>
                <tr className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2 text-sm">
                    {fornecedor.nome}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {fornecedor.contato ?? "–"}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {fornecedor.endereco ?? "–"}
                  </td>
                  {showAuditInfo && (
                    <>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(fornecedor.created_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(fornecedor.created_on)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(fornecedor.updated_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(fornecedor.updated_at)}
                      </td>
                    </>
                  )}
                  <td className="border-b px-4 py-2 text-sm">
                    <button
                      onClick={() => onEdit(fornecedor)}
                      className="mr-3 font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(fornecedor.id)}
                      className="font-medium text-red-600 hover:text-red-900"
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                  {onToggleExpand && (
                    <td className="border-b px-4 py-2 text-center">
                      <button
                        onClick={() => handleToggleExpand(fornecedor.id)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        {expandedRows.has(fornecedor.id) ? "▼" : "▶"}
                      </button>
                    </td>
                  )}
                </tr>
                {onToggleExpand && expandedRows.has(fornecedor.id) && (
                  <tr>
                    <td
                      colSpan={showAuditInfo ? 8 : 4}
                      className="bg-gray-50 px-4 py-2"
                    >
                      <AuditInfo
                        auditData={fornecedor}
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
                      ? 8
                      : 7
                    : onToggleExpand
                      ? 4
                      : 3
                }
                className="px-4 py-4 text-center text-gray-500"
              >
                {t("financial.fornecedores.table.noFornecedores")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* TODO: Add pagination controls if API supports it */}
    </div>
  );
};

export default FornecedoresTable;
