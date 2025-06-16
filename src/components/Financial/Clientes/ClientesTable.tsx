import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../../../services/apiClient"; // Adjust path as needed
import { AxiosError } from "axios"; // Import AxiosError for type checking
import AuditInfo from "../../Audit/AuditInfo";
import { formatDate, formatUser } from "../../../utils/formatters";
import type { Cliente, PaginatedResponse } from "../../Audit/types";

interface ClientesTableProps {
  onEdit: (cliente: Cliente) => void;
  onDeleteSuccess: () => void; // Callback to refresh data after delete
  refreshTrigger: number; // Add a trigger to force refresh
  showAuditInfo?: boolean;
  expandedRows?: Set<number>;
  onToggleExpand?: (id: number) => void;
}

const ClientesTable: React.FC<ClientesTableProps> = ({
  onEdit,
  onDeleteSuccess,
  refreshTrigger,
  showAuditInfo = false,
  expandedRows = new Set(),
  onToggleExpand,
}) => {
  const { t } = useTranslation();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for pagination (currentPage, totalPages, etc.)

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual API call using apiClient
      const response = await apiClient.get<PaginatedResponse<Cliente>>(
        "/financial/clientes/",
      );
      setClientes(response.data.results); // Assuming pagination
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching clientes:", axiosError);
      if (axiosError.response?.status === 401) {
        setError(t("errors.unauthorized"));
      } else {
        setError(t("errors.failedToFetchClientes")); // i18n key for error
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes, refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleDelete = async (id: number) => {
    // TODO: Add confirmation dialog
    if (!window.confirm(t("financial.clientes.confirmDelete"))) {
      return;
    }

    try {
      await apiClient.delete(`/financial/clientes/${id}/`);
      // Refresh the list after successful deletion
      // fetchClientes(); // Or rely on parent component triggering refresh
      onDeleteSuccess();
    } catch (err) {
      console.error("Error deleting cliente:", err);
      // TODO: Show error message to user
      alert(t("errors.failedToDeleteCliente"));
    }
  };

  if (loading) {
    return <div className="p-4 text-center">{t("common.loading")}...</div>;
  }

  if (error) {
    return <div className="rounded bg-red-100 p-4 text-red-500">{error}</div>;
  }

  const handleToggleExpand = (id: number) => {
    if (onToggleExpand) {
      onToggleExpand(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.clientes.table.nome")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.clientes.table.contato")}
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-600">
              {t("financial.clientes.table.endereco")}
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
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <React.Fragment key={cliente.id}>
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2 text-sm">{cliente.nome}</td>
                  <td className="border-b px-4 py-2 text-sm">
                    {cliente.contato ?? "–"}
                  </td>
                  <td className="border-b px-4 py-2 text-sm">
                    {cliente.endereco ?? "–"}
                  </td>
                  {showAuditInfo && (
                    <>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(cliente.created_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(cliente.created_on)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatUser(cliente.updated_by)}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {formatDate(cliente.updated_at)}
                      </td>
                    </>
                  )}
                  <td className="border-b px-4 py-2 text-sm">
                    <button
                      onClick={() => onEdit(cliente)}
                      className="mr-3 font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="font-medium text-red-600 hover:text-red-900"
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                  {onToggleExpand && (
                    <td className="border-b px-4 py-2 text-center">
                      <button
                        onClick={() => handleToggleExpand(cliente.id)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        {expandedRows.has(cliente.id) ? "▼" : "▶"}
                      </button>
                    </td>
                  )}
                </tr>
                {onToggleExpand && expandedRows.has(cliente.id) && (
                  <tr>
                    <td
                      colSpan={showAuditInfo ? 9 : 5}
                      className="bg-gray-50 px-4 py-2"
                    >
                      <AuditInfo
                        auditData={cliente}
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
                      ? 9
                      : 8
                    : onToggleExpand
                      ? 5
                      : 4
                }
                className="px-4 py-4 text-center text-gray-500"
              >
                {t("financial.clientes.table.noClientes")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* TODO: Add pagination controls if API supports it */}
    </div>
  );
};

export default ClientesTable;
