import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; // Replace 'any' with a proper User type later
  token: string | null;
  tenantId: string | null;
  isLoading: boolean;
}

interface AuthContextProps extends AuthState {
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    tenantId: null,
    isLoading: true, // Start loading initially
  });

  useEffect(() => {
    // Try to load auth data from localStorage on initial mount
    const token = localStorage.getItem("authToken");
    const userString = localStorage.getItem("userData");
    const tenantId = localStorage.getItem("tenantId");

    if (token && userString && tenantId) {
      try {
        const userData = JSON.parse(userString);
        setAuthState({
          isAuthenticated: true,
          user: userData,
          token: token,
          tenantId: tenantId,
          isLoading: false,
        });
        // Optionally verify token with backend here
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("tenantId");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (token: string, userData: any) => {
    const tenantId = userData?.tenant?.id || null; // Adjust based on actual user data structure
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    if (tenantId) {
      localStorage.setItem("tenantId", tenantId.toString());
    }
    setAuthState({
      isAuthenticated: true,
      user: userData,
      token: token,
      tenantId: tenantId ? tenantId.toString() : null,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("tenantId");
    // Optionally call a backend logout endpoint
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      tenantId: null,
      isLoading: false,
    });
    // Redirect to login handled by ProtectedRoute or response interceptor
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {!authState.isLoading ? children : <div>Loading Authentication...</div>}{" "}
      {/* Show loading indicator */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
