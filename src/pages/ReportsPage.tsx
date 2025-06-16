import React from "react";
import { useTranslation } from "react-i18next";

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("reports")}</h1>
      {/* Placeholder for different report views/components */}
      <p>Conteúdo da página de relatórios aqui...</p>
      {/* Example: Links to specific reports like Cash Flow, Expenses by Category */}
    </div>
  );
};

export default ReportsPage;
