import type { Tenant } from "../@types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenantState] = useState<Tenant | null>(null);

  // Salva no localStorage e sincroniza com o state
  useEffect(() => {
    const storedTenant = localStorage.getItem("tenant");
    if (storedTenant) {
      setTenantState(JSON.parse(storedTenant));
    }
  }, []);

  const setTenant = (tenant: Tenant | null) => {
    setTenantState(tenant);
    if (tenant) {
      localStorage.setItem("tenant", JSON.stringify(tenant));
    } else {
      localStorage.removeItem("tenant");
    }
  };

  const clearTenant = () => setTenant(null);

  return (
    <TenantContext.Provider value={{ tenant, setTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

// Hook para usar facilmente em qualquer componente
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
