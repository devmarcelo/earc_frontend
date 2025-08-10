import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as loginService } from "../services/loginService";
import { useTenant } from "../contexts/TenantContext";
import type { Tenant } from "../@types";
import { fetchPublicTenantSettings } from "../services/tenantService";
import { Button, FormField } from "../components/Shared";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setTenant } = useTenant();
  const [branding, setBranding] = useState<Tenant | null>(null);

  useEffect(() => {
    const schema_name = window.location.hostname.split(".")[0];

    if (schema_name) {
      fetchPublicTenantSettings(schema_name)
        .then((data) => {
          setBranding(data);
          setTenant(data);
        })
        .catch(() => {});
    }
  }, []);

  // Get the location to redirect to after login
  const from = location.state?.from?.pathname || "/";

  const clearLocalStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("tenantId");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { token, refresh, user, tenant } = await loginService({
        email,
        password,
      });

      login(token, user); // Atualiza o Auth Context
      setTenant(tenant);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login failed:", err);

      setError(
        t("login_failed", {
          defaultValue: "Falha no login. Verifique suas credenciais.",
        }),
      );

      clearLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100"
      style={
        branding?.theme?.background
          ? { background: branding.theme.background }
          : undefined
      }
    >
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          {branding?.logo && (
            <img
              src={branding.logo}
              alt={branding.name}
              className="mx-auto mb-3 h-16"
            />
          )}
          <h2 className="text-3xl font-bold text-gray-900">
            {branding?.name ?? "eARC System"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {branding?.theme?.custom_login_message ??
              t("login_subtitle", { defaultValue: "Entre na sua conta" })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormField
            id="email"
            name="email"
            type="email"
            label={t("email", { defaultValue: "Email" })}
            placeholder={t("email_placeholder", {
              defaultValue: "seu@suaempresa.com",
            })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            required
          />

          <FormField
            id="password"
            name="password"
            type="password"
            label={t("password", { defaultValue: "Senha" })}
            placeholder={t("password_placeholder", {
              defaultValue: "Sua senha",
            })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxlength={16}
          />

          <div className="-mt-2 mb-4 flex justify-end">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              {t("forgot_password", { defaultValue: "Esqueceu a senha?" })}
            </button>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              fullWidth
              className="flex justify-center"
              disabled={isLoading}
            >
              {isLoading
                ? t("logging_in", { defaultValue: "Entrando..." })
                : t("login", { defaultValue: "Entrar" })}
            </Button>
          </div>
        </form>

        {/* Link para cadastro de empresa */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t("dont_have_account", {
              defaultValue: "Não possui uma conta?",
            })}{" "}
            <button
              onClick={() => navigate("/register-company")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("register_company", {
                defaultValue: "Cadastre sua empresa",
              })}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
