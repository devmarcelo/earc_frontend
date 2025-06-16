import React from "react";
import { useTranslation } from "react-i18next";

const HrPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("hr")}</h1>
      {/* Placeholder for HR CRUD components (e.g., Funcionarios) */}
      <p>Conteúdo da página de RH aqui...</p>
    </div>
  );
};

export default HrPage;
