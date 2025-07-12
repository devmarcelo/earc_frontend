import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageUploadModal,
  TermsModal,
  FormField,
  FormFieldImage,
} from "../../Shared";
import { useModal } from "../../../hooks";
import type { UserAdminFormProps, ImageData } from "../../../@types";
import { formatPhone } from "../../../utils/formatters";

const UserAdminForm: React.FC<UserAdminFormProps> = ({
  formData,
  setFormData,
  onChange,
  error,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const termsModal = useModal();

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);

    setFormData({
      ...formData,
      phone: formattedPhone,
    });
  };

  const handleImageSelect = (imageData: ImageData) => {
    const syntheticEvent = {
      target: {
        name: "avatar",
        value: imageData.type === "file" ? imageData.file : imageData.url,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setIsModalOpen(false);
  };

  const handleRemoveImage = () => {
    const syntheticEvent = {
      target: {
        name: "avatar",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleTermsLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    termsModal.openModal("add");
  };

  const handleTermsAccept = () => {
    // Update the checkbox to checked
    const syntheticEvent = {
      target: {
        name: "acceptance",
        value: "",
        type: "checkbox",
        checked: true,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    termsModal.closeModal();
  };

  const handleTermsDecline = () => {
    // Ensure checkbox remains unchecked
    const syntheticEvent = {
      target: {
        name: "acceptance",
        value: "",
        type: "checkbox",
        checked: false,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    termsModal.closeModal();
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("admin_information", {
            defaultValue: "Dados do Administrador",
          })}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t("admin_form_description", {
            defaultValue:
              "Configure a conta do administrador principal da empresa",
          })}
        </p>
      </div>

      <form id="user-admin-form" className="space-y-4">
        <FormField
          id="email"
          name="email"
          type="email"
          label={t("email", { defaultValue: "Email" })}
          placeholder={t("email_placeholder", {
            defaultValue: "admin@suaempresa.com",
          })}
          value={formData.email}
          onChange={onChange}
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          required
        />

        <FormField
          id="phone"
          name="phone"
          label={t("phone", { defaultValue: "Telefone" })}
          type="text"
          value={formData.phone}
          onChange={handleChangePhone}
          placeholder="(99) 99999-9999"
          required
          maxlength={15}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="password"
            name="password"
            type="password"
            label={t("password", { defaultValue: "Senha" })}
            placeholder={t("password_placeholder", {
              defaultValue: "Digite uma senha segura",
            })}
            value={formData.password}
            onChange={onChange}
            required
            minLength={8}
            maxlength={16}
          />

          <FormField
            id="repeat_password"
            name="repeat_password"
            label={t("repeat_password", { defaultValue: "Repetir Senha" })}
            type="password"
            value={formData.repeat_password || ""}
            onChange={onChange}
            placeholder={t("repeat_password_placeholder", "Confirme sua senha")}
            required
            minLength={8}
            maxlength={16}
            matchValue={formData.password}
          />
        </div>

        <FormField
          id="nickname"
          name="nickname"
          type="text"
          label={t("nickname", { defaultValue: "Nome/Apelido" })}
          placeholder={t("nickname_placeholder", {
            defaultValue: "Como você gostaria de ser chamado",
          })}
          value={formData.nickname}
          onChange={onChange}
        />

        {/* Profile Image Upload Section */}
        <FormFieldImage
          id="avatar"
          label={t("profile_image", { defaultValue: "Foto de Perfil" })}
          value={formData.avatar}
          onOpenModal={handleOpenModal}
          onRemove={handleRemoveImage}
        />

        {/* Terms and Conditions */}
        <FormField
          id="acceptance"
          name="acceptance"
          type="checkbox"
          label={
            <span className="text-sm font-medium transition-colors">
              {t("terms_acceptance", {
                defaultValue: "Li e aceito os",
              })}{" "}
              <button
                type="button"
                className="text-indigo-600 underline hover:text-indigo-500"
                onClick={handleTermsLinkClick}
              >
                {t("terms_of_use", { defaultValue: "Termos de Uso" })}
              </button>
            </span>
          }
          checked={formData.acceptance}
          onChange={handleTermsChange}
          required
        />
        {/* Fim Terms and Conditions */}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImage={formData.avatar}
        title={t("select_profile_photo", {
          defaultValue: "Selecionar Foto de Perfil",
        })}
        acceptedFormats="PNG, JPG, GIF"
        maxSizeText="até 2MB"
        maxSizeMB={2}
      />

      {/* Terms Modal using useModal hook */}
      <TermsModal
        isOpen={termsModal.modalState.isOpen}
        onClose={termsModal.closeModal}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    </div>
  );
};

export default UserAdminForm;
