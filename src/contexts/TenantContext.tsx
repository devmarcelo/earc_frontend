import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    const schema_name = window.location.hostname.split(".")[0];

    if (schema_name && (!tenant || tenant?.schema_name !== schema_name)) {
      setTenantState({ ...tenant, schema_name: schema_name } as Tenant);
      localStorage.setItem("tenantId", schema_name);
    }
  }, [location]);

  const setTenant = (tenant: Tenant | null) => {
    setTenantState(tenant);
    if (tenant) {
      localStorage.setItem("tenantId", tenant.schema_name);
    } else {
      localStorage.removeItem("tenantId");
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
