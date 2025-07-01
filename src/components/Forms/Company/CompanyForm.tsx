import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormField, ImageUploadModal } from "../../Shared";
import type { CompanyFormProps, ImageData } from "../../../@types";

const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  onChange,
  onNext,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageSelect = (imageData: ImageData) => {
    const syntheticEvent = {
      target: {
        name: "logo",
        value: imageData.url,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setIsModalOpen(false);
  };

  const handleRemoveImage = () => {
    const syntheticEvent = {
      target: {
        name: "logo",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("company_information", { defaultValue: "Informações da Empresa" })}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t("company_form_description", {
            defaultValue: "Preencha os dados básicos da sua empresa",
          })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="company_name"
          name="company_name"
          type="text"
          label={t("company_name", { defaultValue: "Nome da Empresa" })}
          placeholder={t("company_name_placeholder", {
            defaultValue: "Digite o nome da sua empresa",
          })}
          value={formData.company_name}
          onChange={onChange}
          required
        />

        <FormField
          id="schema_name"
          name="schema_name"
          type="text"
          label={t("schema_name", { defaultValue: "Identificador" })}
          placeholder={t("schema_name_placeholder", {
            defaultValue: "ex: minhaempresa",
          })}
          value={formData.schema_name}
          onChange={onChange}
          required
          pattern="^[a-z0-9]+$"
        />

        <div>
          <label
            htmlFor="logo"
            className="ml-2 block text-left text-sm font-medium text-gray-700"
          >
            {t("company_logo", { defaultValue: "Logo da Empresa" })}
          </label>

          {formData.logo ? (
            <div className="mt-2">
              <div className="relative inline-block">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-20 w-20 rounded-md border border-gray-300 bg-gray-50 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "";
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  title={t("remove_image", { defaultValue: "Remover logo" })}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {t("change_logo", { defaultValue: "Alterar logo" })}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {t("add_logo", {
                  defaultValue: "Adicionar logo da empresa",
                })}
              </button>
            </div>
          )}
        </div>

        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageSelect={handleImageSelect}
          currentImage={formData.logo}
          title={t("select_logo", {
            defaultValue: "Selecionar Logo da Empresa",
          })}
          acceptedFormats="PNG, JPG, GIF"
          maxSizeText="até 2MB"
          maxSizeMB={2}
        />

        {onNext && (
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              {t("next_step", { defaultValue: "Próximo Passo" })}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyForm;
