import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react"; // Import React
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/Layout/MainLayout"; // Import MainLayout
import LoginPage from "./pages/LoginPage";
import RegisterCompany from "./pages/RegisterCompanyPage";

// Placeholder Pages (Create these components later in src/pages/)
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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading Authentication...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children within the MainLayout
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  // AuthProvider and ThemeProvider are already wrapping App in main.tsx

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-company" element={<RegisterCompany />} />

      {/* Protected Routes using the ProtectedRoute component */}
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

      {/* Fallback for unknown routes - redirect to dashboard if logged in, else login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
