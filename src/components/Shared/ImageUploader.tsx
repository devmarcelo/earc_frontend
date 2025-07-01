import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";
import type { ImageData } from "../../@types";

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (data: ImageData) => void;
  title?: string;
  acceptedFormats?: string;
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageChange,
  title,
  acceptedFormats = "PNG, JPG, GIF",
  maxSizeMB = 5,
}) => {
  const { t } = useTranslation();
  const { modalState, openModal, closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        t("invalid_file_type", {
          defaultValue: "Por favor, selecione apenas arquivos de imagem",
        }),
      );
      return;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(
        t("file_too_large", {
          maxSize: maxSizeMB,
          defaultValue: `Arquivo muito grande. Máximo ${maxSizeMB}MB.`,
        }),
      );
      return;
    }

    setSelectedFile(file);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onImageChange({ url: result, file, type: "file" });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreviewUrl("");
    setSelectedFile(null);
    onImageChange({ url: "", type: "url" });
  };

  return (
    <div>
      <label className="ml-1 block text-left text-sm font-medium text-gray-700">
        {title || t("company_logo", { defaultValue: "Logo da Empresa" })}
      </label>

      {previewUrl ? (
        <div className="mt-2">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-24 w-24 rounded-lg border border-gray-300 bg-gray-50 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml;base64,..."; // fallback genérico
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              title={t("remove_image", { defaultValue: "Remover imagem" })}
            >
              ✕
            </button>
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => openModal("custom", null, { type: "upload" })}
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
            onClick={() => openModal("custom", null, { type: "upload" })}
            className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 text-sm text-gray-600 hover:border-gray-400"
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
            {t("add_image", { defaultValue: "Adicionar imagem" })}
          </button>
        </div>
      )}

      {modalState.isOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              {t("upload_image", { defaultValue: "Carregar imagem" })}
            </h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mb-4 w-full rounded border border-gray-300 p-2"
            />
            {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              >
                {t("cancel", { defaultValue: "Cancelar" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
