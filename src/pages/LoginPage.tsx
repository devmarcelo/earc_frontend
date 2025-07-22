import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams, data } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as loginService } from "../services/loginService";
import { useTenant } from "../contexts/TenantContext";
import SocialLoginButton from "../components/Shared/Social/SocialLoginButton";
import { googleLogin } from "../services/googleLoginService";
import type { Tenant } from "../@types";
import { fetchPublicTenantSettings } from "../services/tenantService";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { tenant: tenantFromContext, setTenant } = useTenant();
  const { tenant: tenantSlug } = useParams<{ tenant: string }>();
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

  /*const handleGoogleLogin = async (tokenResponse: { code: string }) => {
    setIsLoadingGoogle(true);
    setError(null);

    try {
      const { access, user, tenant } = await googleLogin({
        code: tokenResponse.code,
      });

      login(access, user);
      setTenant(tenant);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        t("login_google_failed", {
          defaultValue:
            "Falha no login Google. Usuário não autorizado ou não cadastrado.",
        }),
      );

      clearLocalStorage();
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleGoogleLogin,
    onError: () =>
      setError(
        t("login_google_failed", {
          defaultValue:
            "Falha no login Google. Usuário não autorizado ou não cadastrado.",
        }),
      ),
    scope: "openid email profile",
  });*/

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("email", { defaultValue: "E-mail" })}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              placeholder={t("email_placeholder", {
                defaultValue: "seu@email.com",
              })}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("password", { defaultValue: "Senha" })}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              placeholder={t("password_placeholder", {
                defaultValue: "Sua senha",
              })}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("logging_in", { defaultValue: "Entrando..." })}
                </div>
              ) : (
                t("login")
              )}
            </button>
          </div>
        </form>

        {/*
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                {t("or_continue_with", { defaultValue: "Ou continue com" })}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <SocialLoginButton
              provider="google"
              loading={isLoadingGoogle}
              onClick={() => googleLoginHandler()}
            />
          </div>
        </div>
        */}

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
