import React from "react";
import { useTranslation } from "react-i18next";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("settings")}</h1>
      {/* Placeholder for settings components (e.g., Theme customization, User profile) */}
      <p>Conteúdo da página de configurações aqui...</p>
    </div>
  );
};

export default SettingsPage;
