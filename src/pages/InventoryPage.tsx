import React from "react";
import { useTranslation } from "react-i18next";

const InventoryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("inventory")}</h1>
      {/* Placeholder for Inventory CRUD components */}
      <p>Conteúdo da página de estoque aqui...</p>
    </div>
  );
};

export default InventoryPage;
