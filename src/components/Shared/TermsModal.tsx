import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
}) => {
  const { t } = useTranslation();
  const [termsContent, setTermsContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Load terms content when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTermsContent();
    }
  }, [isOpen]);

  const loadTermsContent = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Try to load PDF first, fallback to markdown
      const pdfUrl = "/src/assets/documents/termos-de-uso.pdf";
      const markdownUrl = "/src/assets/documents/termos-de-uso.md";

      // Check if PDF exists
      try {
        const pdfResponse = await fetch(pdfUrl);
        if (pdfResponse.ok) {
          // PDF exists, we'll display it in an iframe
          setTermsContent(pdfUrl);
          setIsLoading(false);
          return;
        }
      } catch (pdfError) {
        console.log("PDF not found, trying markdown...");
      }

      // Fallback to markdown
      try {
        const markdownResponse = await fetch(markdownUrl);
        if (markdownResponse.ok) {
          const markdownText = await markdownResponse.text();
          setTermsContent(markdownText);
        } else {
          throw new Error("Não foi possível carregar os termos de uso");
        }
      } catch (markdownError) {
        // Final fallback - embedded terms
        setTermsContent(getEmbeddedTerms());
      }
    } catch (err) {
      setError(
        t("terms_load_error", {
          defaultValue: "Erro ao carregar os termos de uso. Tente novamente.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getEmbeddedTerms = () => {
    return `# Termos de Uso - Sistema eARC

## 1. Aceitação dos Termos
Ao utilizar o sistema eARC, você concorda em cumprir e estar vinculado a estes Termos de Uso.

## 2. Descrição do Serviço
O eARC é um sistema de gestão empresarial multitenant que oferece funcionalidades de gestão financeira, controle de inventário, recursos humanos e relatórios.

## 3. Responsabilidades do Usuário
- Manter a confidencialidade de suas credenciais
- Utilizar o sistema apenas para fins legítimos
- Ser responsável por todas as atividades em sua conta

## 4. Privacidade e Proteção de Dados
Coletamos apenas os dados necessários para o funcionamento do sistema e implementamos medidas de segurança adequadas.

## 5. Limitações de Responsabilidade
Nos esforçamos para manter alta disponibilidade, mas não garantimos funcionamento ininterrupto.

## 6. Propriedade Intelectual
O sistema é de nossa propriedade. Cliente mantém propriedade de seus dados.

## 7. Lei Aplicável
Estes termos são regidos pelas leis brasileiras, incluindo LGPD e Marco Civil da Internet.

**Última atualização:** 23 de junho de 2025`;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <svg
              className="h-6 w-6 animate-spin text-indigo-600"
              viewBox="0 0 24 24"
            >
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
            <span className="text-gray-600">
              {t("loading_terms", {
                defaultValue: "Carregando termos de uso...",
              })}
            </span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
          <button
            onClick={loadTermsContent}
            className="mt-2 text-sm text-red-600 underline hover:text-red-500"
          >
            {t("try_again", { defaultValue: "Tentar novamente" })}
          </button>
        </div>
      );
    }

    // Check if content is a PDF URL
    if (termsContent.endsWith(".pdf")) {
      return (
        <div className="h-96">
          <iframe
            src={termsContent}
            className="h-full w-full rounded border"
            title={t("terms_of_use", { defaultValue: "Termos de Uso" })}
            onLoad={() => setHasScrolledToBottom(true)} // Consider PDF as "read"
          />
        </div>
      );
    }

    // Render markdown content
    return (
      <div
        className="h-96 overflow-y-auto rounded border bg-gray-50 p-4"
        onScroll={handleScroll}
      >
        <div className="prose prose-sm max-w-none">
          {termsContent.split("\n").map((line, index) => {
            if (line.startsWith("# ")) {
              return (
                <h1
                  key={index}
                  className="mb-4 text-xl font-bold text-gray-900"
                >
                  {line.substring(2)}
                </h1>
              );
            }
            if (line.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="mt-6 mb-3 text-lg font-semibold text-gray-800"
                >
                  {line.substring(3)}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-md mt-4 mb-2 font-medium text-gray-700"
                >
                  {line.substring(4)}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={index} className="ml-4 text-gray-600">
                  {line.substring(2)}
                </li>
              );
            }
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p key={index} className="mt-2 font-semibold text-gray-700">
                  {line.substring(2, line.length - 2)}
                </p>
              );
            }
            if (line.trim() === "") {
              return <br key={index} />;
            }
            if (line.startsWith("---")) {
              return <hr key={index} className="my-4 border-gray-300" />;
            }
            return (
              <p key={index} className="mb-2 text-gray-600">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-4xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("terms_of_use", { defaultValue: "Termos de Uso" })}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label={t("close", { defaultValue: "Fechar" })}
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

        {/* Content */}
        <div className="px-6 py-4">{renderContent()}</div>

        {/* Scroll indicator */}
        {!hasScrolledToBottom &&
          !isLoading &&
          !error &&
          !termsContent.endsWith(".pdf") && (
            <div className="px-6 py-2">
              <div className="flex items-center justify-center rounded-md bg-amber-50 p-2 text-sm text-amber-600">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                {t("scroll_to_continue", {
                  defaultValue:
                    "Role até o final para habilitar os botões de aceite",
                })}
              </div>
            </div>
          )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onDecline}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            {t("decline", { defaultValue: "Recusar" })}
          </button>
          <button
            onClick={onAccept}
            disabled={!hasScrolledToBottom && !termsContent.endsWith(".pdf")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("accept_terms", { defaultValue: "Aceitar Termos" })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
