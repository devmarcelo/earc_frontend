import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext"; // Assuming AuthContext provides user/tenant info

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl: string;
}

interface ThemeContextProps {
  theme: ThemeSettings;
  applyTheme: (settings: ThemeSettings) => void;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#4f46e5", // Default Indigo
  secondaryColor: "#ec4899", // Default Pink
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  logoUrl: "../default-logo.png", // Default logo path in /public
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const { user } = useAuth(); // Get user info which might contain tenant theme settings

  // Function to apply theme settings to CSS variables
  const applyThemeToDOM = (settings: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty(
      "--primary-color",
      settings.primaryColor || defaultTheme.primaryColor,
    );
    root.style.setProperty(
      "--secondary-color",
      settings.secondaryColor || defaultTheme.secondaryColor,
    );
    root.style.setProperty(
      "--background-color",
      settings.backgroundColor || defaultTheme.backgroundColor,
    );
    root.style.setProperty(
      "--text-color",
      settings.textColor || defaultTheme.textColor,
    );
    root.style.setProperty(
      "--logo-url",
      `url(${settings.logoUrl || defaultTheme.logoUrl})`,
    );
    setTheme(settings);
  };

  useEffect(() => {
    // Apply theme based on user/tenant data when auth state changes
    if (user && user.tenant && user.tenant.theme_settings) {
      // Merge tenant settings with defaults
      const tenantSettings = {
        ...defaultTheme,
        ...user.tenant.theme_settings,
      };
      applyThemeToDOM(tenantSettings);
    } else {
      // Apply default theme if no user or no tenant settings
      applyThemeToDOM(defaultTheme);
    }
  }, [user]); // Re-apply theme when user data changes

  return (
    <ThemeContext.Provider value={{ theme, applyTheme: applyThemeToDOM }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
