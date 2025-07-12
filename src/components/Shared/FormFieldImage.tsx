import { useTranslation } from "react-i18next";
import React from "react";

interface FormFieldImageProps {
  id: string;
  label: string;
  value?: File | string;
  required?: boolean;
  onOpenModal: () => void;
  onRemove?: () => void;
  helpText?: string;
}

const FormFieldImage: React.FC<FormFieldImageProps> = ({
  id,
  label,
  value,
  required = false,
  onOpenModal,
  onRemove,
  helpText,
}) => {
  const { t } = useTranslation();
  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
        ? value
        : undefined;

  const hasError = false;

  return (
    <div className="mb-2">
      <label
        htmlFor={id}
        className={`ml-1 block text-sm font-medium transition-colors ${
          hasError ? "text-red-600" : "text-gray-700"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {preview ? (
        <div className="mt-2 flex items-center gap-2">
          <div className="relative inline-block">
            <img
              src={preview}
              alt={t("image_preview", { defaultValue: "Pré-visualizar" })}
              className="h-20 w-20 rounded-md border border-gray-300 bg-gray-50 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "";
              }}
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              title={t("remove_image", { defaultValue: "Remover imagem" })}
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
              onClick={onRemove}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {t("change_image", { defaultValue: "Alterar imagem" })}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <button
            type="button"
            onClick={onOpenModal}
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
            {t("add_image", {
              defaultValue: "Adicionar imagem",
            })}
          </button>
        </div>
      )}
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};

export default FormFieldImage;
