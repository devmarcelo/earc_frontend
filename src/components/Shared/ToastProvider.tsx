import { useEffect } from "react";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useToastStore } from "../../hooks/useToastStore";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import Button from "./Button";

const typeIcon = {
  info: <Info className="text-cyan-500" size={28} />,
  success: <CheckCircle className="text-green-500" size={28} />,
  warning: <AlertTriangle className="text-yellow-500" size={28} />,
  error: <XCircle className="text-red-500" size={28} />,
};

const typeText = {
  info: "text-cyan-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

const defaultOptions: Record<string, ToastOptions> = {
  info: { type: "info", autoClose: 4000 },
  success: { type: "success", autoClose: 4000 },
  warning: { type: "warning", autoClose: 6000 },
  error: { type: "error", autoClose: 8000 },
};

function getToastClasses(type: string) {
  switch (type) {
    case "success":
      return "border-green-400 bg-green-100 text-gree-900";
    case "info":
      return "border-cyan-400 bg-cyan-100 text-cyan-900";
    case "warning":
      return "border-yellow-400 bg-yellow-100 text-yellow-900";
    case "error":
    default:
      return "border-red-400 bg-red-100 text-red-900";
  }
}

export default function ToastProvider() {
  const { messages, clearToast } = useToastStore();

  useEffect(() => {
    messages.forEach((msg) => {
      const toastId = toast(
        <div className="flex w-full flex-col">
          <div className="mb-1 flex items-center gap-2">
            {typeIcon[msg.type]}
            {msg.title && (
              <span className={`${typeText[msg.type]} font-bold`}>
                {msg.title}
              </span>
            )}
          </div>
          <div className={`${typeText[msg.type]} mt-1 text-sm`}>
            {msg.message}
          </div>
          {msg.actionText && msg.onAction && (
            <Button
              onClick={() => {
                msg.onAction?.();
                clearToast(msg.id);
              }}
              variant="primary"
            >
              {msg.actionText}
            </Button>
          )}
        </div>,
        {
          ...defaultOptions[msg.type],
          toastId: msg.id,
          onClose: () => clearToast(msg.id),
          icon: false,
          closeButton: true,
          hideProgressBar: false,
          position: "top-right",
          closeOnClick: false,
          draggable: false,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          className: `rounded-md border-1 shadow-lg px-6 py-3 min-w-[320px] flex items-start justify-between gap-3 ${getToastClasses(msg.type)} toast-bg-color-${msg.type}`,
          style: { width: "auto", minWidth: 320, margin: "5px" },
        },
      );
    });
    // Limpa todos após exibir
    if (messages.length) {
      clearToast();
    }
    // eslint-disable-next-line
  }, [messages]);

  return <ToastContainer />;
}
