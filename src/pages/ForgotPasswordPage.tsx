import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormField } from "../components/Shared";
import { requestPasswordReset } from "../services/resetPasswordService";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          {t("forgot_password_title", { defaultValue: "Recuperar senha" })}
        </h2>
        {sent ? (
          <div className="text-center text-green-600">
            {t("forgot_password_email_sent", {
              defaultValue:
                "Se seu e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
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
              id="email"
              name="email"
              type="email"
              label={t("email", { defaultValue: "Email" })}
              placeholder={t("email_placeholder", {
                defaultValue: "seu@email.com",
              })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              disabled={loading}
            >
              {t("send_reset_email", {
                defaultValue: "Enviar link de redefinição",
              })}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
