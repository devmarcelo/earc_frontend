import React, { useEffect } from "react";
import { useErrorStore } from "../hooks/useErrorStore";
import { useNavigate } from "react-router-dom";
import { Frown, AlertTriangle } from "lucide-react"; // ou qualquer ícone desejado
import { Button } from "../components/Shared";

const ErrorPage: React.FC = () => {
  const { error, clearError } = useErrorStore();
  const navigate = useNavigate();

  const handleBack = () => {
    if (error?.from) {
      clearError();
      navigate(error.from, { replace: true });
    } else {
      clearError();
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    // Se não há erro no store, redirecione para home
    if (!error) navigate("/", { replace: true });
    // Limpa erro ao sair da página
    return () => clearError();
  }, [error, navigate, clearError]);

  if (!error) {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-red-100">
      <div className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-10 text-center shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          {error.status && (
            <span className="mb-2 text-6xl font-extrabold text-red-500">
              <Frown size={56} />
            </span>
          )}
          <h1 className="my-2 text-3xl font-bold text-gray-900">
            {error.title || "Ocorreu um erro"}
          </h1>
          <p className="mb-5 text-lg text-gray-600">
            {error.message ||
              "Tente novamente ou entre em contato com o suporte."}
          </p>
          <Button
            onClick={handleBack}
            variant="primary"
            className="mt-6 px-8 text-lg font-semibold"
          >
            {error.actionText ?? "Voltar ao início"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
