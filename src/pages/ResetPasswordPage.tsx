import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../services/resetPasswordService";
import { Button, FormField } from "../components/Shared";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Pega o parâmetro da URL (depois da interrogação ?)
  const paramsB64 = window.location.search.replace("?", "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (password !== repeatPassword) {
      setFormError(
        t("repeat_password_invalid", {
          defaultValue: "As senhas não coincidem.",
        }),
      );
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(paramsB64, password);
      setSuccess(true);
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          t("reset_password_failed", {
            defaultValue: "Falha ao redefinir senha.",
          }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          {t("reset_password_title", { defaultValue: "Redefinir senha" })}
        </h2>
        {success ? (
          <div className="text-center text-green-600">
            {t("reset_password_success", {
              defaultValue:
                "Senha redefinida com sucesso. Faça login novamente.",
            })}
            <Button
              variant="link"
              className="mt-4"
              onClick={() => navigate("/login")}
            >
              {t("back_to_login", { defaultValue: "Voltar para login" })}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <FormField
              id="password"
              name="password"
              type="password"
              label={t("new_password", { defaultValue: "Nova senha" })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <FormField
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              label={t("repeat_password", {
                defaultValue: "Repita a nova senha",
              })}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              minLength={6}
              matchValue={password}
            />
            {formError && <div className="text-red-600">{formError}</div>}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              disabled={loading}
            >
              {t("reset_password_button", { defaultValue: "Redefinir senha" })}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
