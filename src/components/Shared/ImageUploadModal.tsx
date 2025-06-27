import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export interface ImageData {
  url: string;
  file?: File;
  type: "url" | "file";
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: ImageData) => void;
  currentImage?: string;
  title?: string;
  acceptedFormats?: string;
  maxSizeText?: string;
  maxSizeMB?: number;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  currentImage,
  title,
  acceptedFormats = "PNG, JPG, GIF",
  maxSizeText = "até 5MB",
  maxSizeMB = 5,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState(currentImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(
          t("invalid_file_type", {
            defaultValue: "Por favor, selecione apenas arquivos de imagem",
          }),
        );
        return;
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError(
          t("file_too_large", {
            maxSize: maxSizeText,
            defaultValue: `Arquivo muito grande. Máximo ${maxSizeText}`,
          }),
        );
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setUrlInput(url);
    setError("");

    // Simple URL validation
    if (url && isValidUrl(url)) {
      setPreviewUrl(url);
    } else if (!url) {
      setPreviewUrl("");
    }
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUrlTest = async () => {
    if (!urlInput || !isValidUrl(urlInput)) {
      setError(
        t("invalid_url", {
          defaultValue: "URL inválida",
        }),
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Test if image loads
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(urlInput);
        setIsLoading(false);
      };
      img.onerror = () => {
        setError(
          t("image_load_error", {
            defaultValue: "Não foi possível carregar a imagem desta URL",
          }),
        );
        setIsLoading(false);
      };
      img.src = urlInput;
    } catch (err) {
      setError(
        t("image_load_error", {
          defaultValue: "Erro ao carregar imagem",
        }),
      );
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (activeTab === "url" && urlInput) {
      if (!isValidUrl(urlInput)) {
        setError(t("invalid_url", { defaultValue: "URL inválida" }));
        return;
      }
      onImageSelect({ url: urlInput, type: "url" });
    } else if (activeTab === "upload" && selectedFile) {
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect({ url: result, file: selectedFile, type: "file" });
      };
      reader.readAsDataURL(selectedFile);
    }
    onClose();
  };

  const handleRemoveImage = () => {
    setUrlInput("");
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetModal = () => {
    setActiveTab("url");
    setUrlInput(currentImage || "");
    setSelectedFile(null);
    setPreviewUrl(currentImage || "");
    setError("");
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset modal when it opens
  if (isOpen && !previewUrl && currentImage) {
    setPreviewUrl(currentImage);
    setUrlInput(currentImage);
  }

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {title || t("select_image", { defaultValue: "Selecionar Imagem" })}
          </h3>
          <button
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
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

        {/* Tabs */}
        <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("url")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "url"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("url_tab", { defaultValue: "URL" })}
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("upload_tab", { defaultValue: "Upload" })}
          </button>
        </div>

        {/* URL Tab */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("image_url", { defaultValue: "URL da Imagem" })}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="url"
                  value={urlInput}
                  onChange={handleUrlChange}
                  placeholder="https://exemplo.com/imagem.png"
                  className="block w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleUrlTest}
                  disabled={isLoading || !urlInput}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    t("test", { defaultValue: "Testar" })
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("select_file", { defaultValue: "Selecionar Arquivo" })}
              </label>
              <div className="mt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {t("file_requirements", {
                  formats: acceptedFormats,
                  maxSize: maxSizeText,
                  defaultValue: `${acceptedFormats} ${maxSizeText}`,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("preview", { defaultValue: "Pré-visualização" })}
            </label>
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-full rounded-md border border-gray-300 bg-gray-50 object-contain"
                onError={() => {
                  setError(
                    t("image_load_error", {
                      defaultValue: "Erro ao carregar imagem",
                    }),
                  );
                  setPreviewUrl("");
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                title={t("remove_image", { defaultValue: "Remover imagem" })}
              >
                <svg
                  className="h-4 w-4"
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
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            {t("cancel", { defaultValue: "Cancelar" })}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              (activeTab === "url" && (!urlInput || !previewUrl)) ||
              (activeTab === "upload" && !selectedFile)
            }
            className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("confirm", { defaultValue: "Confirmar" })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
