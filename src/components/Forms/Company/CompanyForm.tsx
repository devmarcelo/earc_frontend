import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormField, FormFieldImage, ImageUploadModal } from "../../Shared";
import type { CompanyFormProps, ImageData } from "../../../@types";
import { formatDocument } from "../../../utils/formatters";

const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  setFormData,
  onChange,
  onNext,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageSelect = (imageData: ImageData) => {
    const syntheticEvent = {
      target: {
        name: "logo",
        value: imageData.type === "file" ? imageData.file : imageData.url,
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext();
  };

  const handleChangeDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDoc = formatDocument(e.target.value);

    setFormData({
      ...formData,
      document: formattedDoc,
    });
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

      <form id="company-form" onSubmit={handleSubmit} className="space-y-4">
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
            defaultValue: "Ex: minhaempresa",
          })}
          value={formData.schema_name}
          onChange={onChange}
          required
          pattern="^[a-z0-9]+$"
        />

        <FormField
          id="document"
          name="document"
          type="text"
          label={t("company_document", {
            defaultValue: "Documento (CNPJ ou CPF)",
          })}
          value={formData.document}
          onChange={handleChangeDocument}
          placeholder={t("company_document_placeholder", {
            defaultValue: "Informe o CNPJ ou CPF",
          })}
          required
          maxlength={18}
        />

        <FormFieldImage
          id="logo"
          label={t("company_logo", { defaultValue: "Logo da Empresa" })}
          value={formData.logo}
          onOpenModal={handleOpenModal}
          onRemove={handleRemoveImage}
        />

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
