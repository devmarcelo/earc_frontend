// src/routes.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterCompany from "./pages/RegisterCompanyPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading Authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Placeholder pages
const DashboardPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      {t("dashboard")} Page Placeholder - Add charts later
    </div>
  );
};

const FinancialPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      {t("financial")} Page Placeholder - Implement CRUDs
    </div>
  );
};

const InventoryPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      {t("inventory")} Page Placeholder - Implement CRUDs
    </div>
  );
};

const HrPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">{t("hr")} Page Placeholder - Implement CRUDs</div>
  );
};

const ReportsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      {t("reports")} Page Placeholder - Implement report views
    </div>
  );
};

const SettingsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      {t("settings")} Page Placeholder - Implement theme/user settings
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/register-company" element={<RegisterCompany />} />

      {/* Rotas protegidas multitenant */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/financial"
        element={
          <ProtectedRoute>
            <FinancialPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr"
        element={
          <ProtectedRoute>
            <HrPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback: redireciona para login */}
    </Routes>
  );
}
