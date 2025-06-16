import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext"; // To potentially style sidebar

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-4 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700 font-bold" : ""}`;

  return (
    <aside
      className="fixed h-screen w-64 bg-gray-800 p-4 text-white"
      style={{
        backgroundColor: theme.primaryColor
          ? theme.primaryColor + "cc"
          : "#374151",
      }}
    >
      {" "}
      {/* Example: Use primary color with opacity */}
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={navLinkClass} end>
              {t("dashboard")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/financial" className={navLinkClass}>
              {t("financial")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className={navLinkClass}>
              {t("inventory")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr" className={navLinkClass}>
              {t("hr")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={navLinkClass}>
              {t("reports")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={navLinkClass}>
              {t("settings")}
            </NavLink>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
