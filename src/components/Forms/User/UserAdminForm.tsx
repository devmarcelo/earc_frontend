import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageUploadModal, TermsModal, FormField } from "../../Shared";
import { useModal } from "../../../hooks";
import type { UserAdminFormProps, ImageData } from "../../../@types";

const UserAdminForm: React.FC<UserAdminFormProps> = ({
  formData,
  onChange,
  error,
  onImageChange,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  const termsModal = useModal();

  const handleImageSelect = (imageData: ImageData) => {
    // Update form data with image information
    if (onImageChange) {
      onImageChange(imageData);
    } else {
      // Fallback: create synthetic event for image URL
      const syntheticEvent = {
        target: {
          name: "imagem",
          value: imageData.url,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    setIsModalOpen(false);
  };

  const handleRemoveImage = () => {
    const syntheticEvent = {
      target: {
        name: "imagem",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);

    // Also clear file data if using onImageChange
    if (onImageChange) {
      onImageChange({ url: "", type: "url" });
    }
  };

  const handleTermsLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    termsModal.openModal("add");
  };

  const handleTermsAccept = () => {
    // Update the checkbox to checked
    const syntheticEvent = {
      target: {
        name: "aceite",
        value: "",
        type: "checkbox",
        checked: true,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setTermsError(null);
    termsModal.closeModal();
  };

  const handleTermsDecline = () => {
    // Ensure checkbox remains unchecked
    const syntheticEvent = {
      target: {
        name: "aceite",
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
    if (e.target.checked) {
      setTermsError(null);
    } else {
      setTermsError(
        t("terms_required", {
          defaultValue: "Você deve aceitar os termos de uso",
        }),
      );
    }
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

      <div className="space-y-4">
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
          pattern="/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
          required
        />

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
        />

        <FormField
          id="apelido"
          name="apelido"
          type="text"
          label={t("nickname", { defaultValue: "Nome/Apelido" })}
          placeholder={t("nickname_placeholder", {
            defaultValue: "Como você gostaria de ser chamado",
          })}
          value={formData.apelido}
          onChange={onChange}
        />

        {/* Profile Image Upload Section */}
        <div>
          <label
            htmlFor="imagem"
            className="ml-2 block text-left text-sm font-medium text-gray-700"
          >
            {t("profile_image", { defaultValue: "Foto de Perfil" })}
          </label>

          {/* Image Preview */}
          {formData.imagem ? (
            <div className="mt-2">
              <div className="relative inline-block">
                <img
                  src={formData.imagem}
                  alt="Profile preview"
                  className="h-20 w-20 rounded-full border border-gray-300 bg-gray-50 object-cover"
                  onError={(e) => {
                    // Handle broken image - show default avatar
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAwLTQtNEg4YTQgNCAwIDAwLTQgNHYyIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K";
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                  title={t("remove_image", { defaultValue: "Remover foto" })}
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
                  {t("change_photo", { defaultValue: "Alterar foto" })}
                </button>
              </div>
            </div>
          ) : (
            /* Upload Button */
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {t("add_profile_photo", {
                  defaultValue: "Adicionar foto de perfil",
                })}
              </button>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-1">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="aceite"
                name="aceite"
                type="checkbox"
                checked={formData.aceite}
                onChange={handleTermsChange}
                required
                className={`h-4 w-4 rounded border transition-colors focus:ring-1 focus:ring-offset-0 ${
                  termsError
                    ? "border-red-300 text-red-600 focus:ring-red-500"
                    : "border-gray-300 text-indigo-600 focus:ring-indigo-500"
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="aceite"
                className={`font-medium transition-colors ${
                  termsError ? "text-red-600" : "text-gray-700"
                }`}
              >
                {t("terms_acceptance", {
                  defaultValue: "Li e aceito os",
                })}{" "}
                <button
                  type="button"
                  onClick={handleTermsLinkClick}
                  className="text-indigo-600 underline hover:text-indigo-500"
                >
                  {t("terms_of_use", { defaultValue: "termos de uso" })}
                </button>{" "}
                <span className="text-red-500">*</span>
              </label>
              <p className="text-gray-500">
                {t("terms_description", {
                  defaultValue:
                    "Clique no link acima para ler os termos completos antes de aceitar",
                })}
              </p>
            </div>
          </div>

          {termsError && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <svg
                className="mr-1 h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{termsError}</span>
            </div>
          )}
        </div>

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
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImage={formData.imagem}
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
