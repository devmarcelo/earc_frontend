import React from "react";
import { useTranslation } from "react-i18next";
import { type AuditFields } from "./types";

interface AuditInfoProps {
  auditData: AuditFields;
  showCreatedBy?: boolean;
  showUpdatedBy?: boolean;
  showTenantId?: boolean;
  compact?: boolean;
  className?: string;
}

const AuditInfo: React.FC<AuditInfoProps> = ({
  auditData,
  showCreatedBy = true,
  showUpdatedBy = true,
  showTenantId = false,
  compact = false,
  className = "",
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatUser = (userId?: number | string) => {
    if (!userId) return "–";
    // Se for um número, assumimos que é um ID de usuário
    // Se for string, assumimos que já é o nome do usuário
    return typeof userId === "number" ? `Usuário ${userId}` : userId;
  };

  if (compact) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        <div>
          {t("common.audit.created")}: {formatDate(auditData.created_on)}
          {showCreatedBy &&
            auditData.created_by &&
            ` por ${formatUser(auditData.created_by)}`}
        </div>
        {auditData.updated_at !== auditData.created_on && (
          <div>
            {t("common.audit.updated")}: {formatDate(auditData.updated_at)}
            {showUpdatedBy &&
              auditData.updated_by &&
              ` por ${formatUser(auditData.updated_by)}`}
          </div>
        )}
        {showTenantId && auditData.tenant_id && (
          <div>Tenant ID: {auditData.tenant_id}</div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-md border bg-gray-50 p-3 ${className}`}>
      <h4 className="mb-2 text-sm font-medium text-gray-700">
        {t("common.audit.title")}
      </h4>
      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
        <div>
          <span className="font-medium">{t("common.audit.createdOn")}:</span>
          <br />
          {formatDate(auditData.created_on)}
          {showCreatedBy && auditData.created_by && (
            <>
              <br />
              <span className="font-medium">
                {t("common.audit.createdBy")}:
              </span>{" "}
              {formatUser(auditData.created_by)}
            </>
          )}
        </div>
        {auditData.updated_at !== auditData.created_on && (
          <div>
            <span className="font-medium">{t("common.audit.updatedAt")}:</span>
            <br />
            {formatDate(auditData.updated_at)}
            {showUpdatedBy && auditData.updated_by && (
              <>
                <br />
                <span className="font-medium">
                  {t("common.audit.updatedBy")}:
                </span>{" "}
                {formatUser(auditData.updated_by)}
              </>
            )}
          </div>
        )}
        {showTenantId && auditData.tenant_id && (
          <div className="col-span-full">
            <span className="font-medium">Tenant ID:</span>{" "}
            {auditData.tenant_id}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditInfo;
