import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts"; // Initialize i18next
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { TenantProvider } from "./contexts/TenantContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/*<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>*/}
    <BrowserRouter>
      <React.Suspense fallback="loading translations...">
        <TenantProvider>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </TenantProvider>
      </React.Suspense>
    </BrowserRouter>
    {/*</GoogleOAuthProvider>*/}
  </React.StrictMode>,
);
