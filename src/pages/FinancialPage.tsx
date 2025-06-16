import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ClientesTable from "../components/Financial/Clientes/ClientesTable";
import ClientesForm from "../components/Financial/Clientes/ClientesForm";
import FornecedoresTable from "../components/Financial/Fornecedores/FornecedoresTable";
import FornecedoresForm from "../components/Financial/Fornecedores/FornecedoresForm";
import ReceitasTable from "../components/Financial/Receitas/ReceitasTable";
import ReceitasForm from "../components/Financial/Receitas/ReceitasForm";
import DespesasTable from "../components/Financial/Despesas/DespesasTable";
import DespesasForm from "../components/Financial/Despesas/DespesasForm";
import ContasPagarReceberTable from "../components/Financial/ContasPagarReceber/ContasPagarReceberTable";
import ContasPagarReceberForm from "../components/Financial/ContasPagarReceber/ContasPagarReceberForm";
import { useModal } from "../hooks/useModal";

// Define types for the active section and modal state
type FinancialSection =
  | "clientes"
  | "fornecedores"
  | "receitas"
  | "despesas"
  | "contas";
interface ModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  data?: any; // Data for editing
}

const FinancialPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] =
    useState<FinancialSection>("receitas"); // Default section

  const { modalState, openModal, closeModal, onClose } = useModal();

  const handleSuccess = () => {
    closeModal();
    // TODO: Add logic to refresh the table data after successful save/update
    console.log("Operation successful, refreshing data...");
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "clientes":
        return (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => openModal("add")}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {t("financial.clientes.addTitle")}
              </button>
            </div>
            <ClientesTable />
            {/* TODO: Integrate Modal for Form */}
            {modalState.isOpen && (
              <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
                <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
                  <ClientesForm
                    cliente={
                      modalState.mode === "edit" ? modalState.data : null
                    }
                    onSuccess={handleSuccess}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "fornecedores":
        return (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => openModal("add")}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {t("financial.fornecedores.addTitle")}
              </button>
            </div>
            <FornecedoresTable />
            {/* TODO: Integrate Modal for Form */}
            {modalState.isOpen && (
              <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
                <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
                  <FornecedoresForm
                    fornecedor={
                      modalState.mode === "edit" ? modalState.data : null
                    }
                    onSuccess={handleSuccess}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "receitas":
        return (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => openModal("add")}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {t("financial.receitas.addTitle")}
              </button>
            </div>
            <ReceitasTable />
            {/* TODO: Integrate Modal for Form */}
            {modalState.isOpen && (
              <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
                <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
                  <ReceitasForm
                    receita={
                      modalState.mode === "edit" ? modalState.data : null
                    }
                    onSuccess={handleSuccess}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "despesas":
        return (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => openModal("add")}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {t("financial.despesas.addTitle")}
              </button>
            </div>
            <DespesasTable />
            {/* TODO: Integrate Modal for Form */}
            {modalState.isOpen && (
              <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
                <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
                  <DespesasForm
                    despesa={
                      modalState.mode === "edit" ? modalState.data : null
                    }
                    onSuccess={handleSuccess}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "contas":
        return (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => openModal("add")}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {t("financial.contasPagarReceber.addTitle")}
              </button>
            </div>
            <ContasPagarReceberTable />
            {/* TODO: Integrate Modal for Form */}
            {modalState.isOpen && (
              <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
                <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
                  <ContasPagarReceberForm
                    conta={modalState.mode === "edit" ? modalState.data : null}
                    onSuccess={handleSuccess}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const getButtonClass = (section: FinancialSection) => {
    return `px-4 py-2 rounded-t-lg ${activeSection === section ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">{t("sidebar.financial")}</h1>

      {/* Tabs for sections */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-1" aria-label="Tabs">
          <button
            onClick={() => setActiveSection("receitas")}
            className={getButtonClass("receitas")}
          >
            {t("financial.receitas.title")}
          </button>
          <button
            onClick={() => setActiveSection("despesas")}
            className={getButtonClass("despesas")}
          >
            {t("financial.despesas.title")}
          </button>
          <button
            onClick={() => setActiveSection("contas")}
            className={getButtonClass("contas")}
          >
            {t("financial.contasPagarReceber.title")}
          </button>
          <button
            onClick={() => setActiveSection("clientes")}
            className={getButtonClass("clientes")}
          >
            {t("financial.clientes.title")}
          </button>
          <button
            onClick={() => setActiveSection("fornecedores")}
            className={getButtonClass("fornecedores")}
          >
            {t("financial.fornecedores.title")}
          </button>
        </nav>
      </div>

      {/* Render active section content */}
      <div>{renderSectionContent()}</div>
    </div>
  );
};

export default FinancialPage;
