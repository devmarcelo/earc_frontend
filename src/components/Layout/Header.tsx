import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext"; // To potentially display logo
import i18n from "../../i18n";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const { theme } = useTheme();

  return (
    <header
      className="bg-primary text-primary-content flex items-center justify-between p-4 shadow-md"
      style={{
        backgroundColor: theme.primaryColor || "#4f46e5",
        color: theme.textColor || "#1f2937",
      }}
    >
      {/* Placeholder for Logo - using theme variable */}
      <div
        className="h-8 w-32 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: theme.logoUrl || "url(/default-logo.png)" }}
      >
        {/* Logo will be applied via background image */}
      </div>
      <div className="flex items-center space-x-4">
        {/* Imagem do usuário */}
        {user?.imagem && (
          <img
            src={user.imagem}
            alt="Avatar do usuário"
            className="h-10 w-10 rounded-full object-cover"
          />
        )}
        <span className="font-medium text-gray-800">
          {user
            ? `${t("welcome")}, ${user?.apelido || user.email}`
            : t("welcome")}
        </span>
        {/* Language Switcher Placeholder */}
        <div>
          {/* Implement language switcher dropdown later */}
          <span>
            {t("language")}: {i18n.language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{
            backgroundColor: theme.secondaryColor || "#ec4899",
            color: "#ffffff",
          }} // Example secondary color styling
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
};

export default Header;
