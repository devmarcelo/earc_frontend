import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as loginService } from "../services/loginService";
import { useTenant } from "../contexts/TenantContext";
import SocialLoginButton from "../components/Shared/Social/SocialLoginButton";
import { googleLogin } from "../services/googleLoginService";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { setTenant } = useTenant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Get the location to redirect to after login
  const from = location.state?.from?.pathname || "/";

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

      // Redireciona normalmente
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        t("login_failed", {
          defaultValue: "Falha no login. Verifique suas credenciais.",
        }),
      );
      // Limpa storage por segurança
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("tenantId");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (tokenResponse: { code: string }) => {
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
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("tenantId");
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
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("eARC System")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("login_subtitle", { defaultValue: "Entre na sua conta" })}
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
            {/**
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button> 
            */}

            {/* Botão do GitHub desativado
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="ml-2">GitHub</span>
            </button>
            */}
          </div>
        </div>

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
