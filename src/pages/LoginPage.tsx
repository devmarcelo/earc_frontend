import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../services/apiClient"; // Assuming apiClient handles base URL

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the location to redirect to after login
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("<<<>>><<<>>><<<>>>", "ESTOU NO TRY");
      // 1. Obtain JWT token
      const tokenResponse = await apiClient.post("/auth/token/", {
        email,
        password,
      });
      const { access: token } = tokenResponse.data; // Assuming 'access' is the token key

      if (!token) {
        throw new Error("Token not received");
      }

      // Set token for subsequent requests (apiClient interceptor handles this)
      // localStorage.setItem('authToken', token);

      // 2. Fetch user data (assuming an endpoint like /auth/user/ exists)
      //    Alternatively, user data might be included in the token response
      //    or decoded from the JWT if it contains necessary info.
      //    Let's assume we need a separate call for user details.

      // Temporarily store token to make the next request
      localStorage.setItem("tempAuthToken", token);

      // Create a temporary client instance with the new token for the user fetch
      const tempApiClient = axios.create({
        baseURL: apiClient.defaults.baseURL,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Adjust endpoint as needed. This endpoint should return user details including tenant info.
      const userResponse = await tempApiClient.get("/auth/user/me/");
      const userData = userResponse.data;

      // Clear temporary token
      localStorage.removeItem("tempAuthToken");

      // 3. Update Auth Context
      login(token, userData); // Pass token and user data to context

      // 4. Redirect to the intended page or dashboard
      navigate(from, { replace: true });
    } catch (err: any) {
      console.log("<<<>>><<<>>><<<>>>", "AGORA ESTOU NO CATCH");
      console.error("Login failed:", err);
      setError(
        t("login_failed", {
          defaultValue: "Login failed. Please check your credentials.",
        }),
      );
      // Clear any potentially stored invalid token/data
      localStorage.removeItem("tempAuthToken");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("tenantId");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold">{t("login")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("email")}
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
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("password")}
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
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              style={{ backgroundColor: "var(--primary-color)" }} // Use theme color
            >
              {isLoading
                ? t("logging_in", { defaultValue: "Logging in..." })
                : t("login")}
            </button>
          </div>
        </form>
        {/* Add links for password reset or registration if needed */}
        {/* Add OAuth login buttons here */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            {t("or_login_with", { defaultValue: "Or login with:" })}
          </p>
          {/* Placeholder for OAuth buttons */}
          <div className="mt-2 flex justify-center space-x-4">
            <button className="rounded border p-2 hover:bg-gray-100">
              Google
            </button>
            <button className="rounded border p-2 hover:bg-gray-100">
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Need to import axios for the temporary client
import axios from "axios";

export default LoginPage;
