import AppRoutes from "./routes";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationService from "./services/NavigationService";
import { useEffect } from "react";
import ToastProvider from "./components/Shared/ToastProvider";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    NavigationService.setNavigate(navigate, location);
  }, [navigate, location]);

  return (
    <>
      <AppRoutes />
      <ToastProvider />
    </>
  );
}
