import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  isNotEmpty,
  isValidRegex,
  isValidMinLength,
  isValidDocument,
  isValidPhone,
  isValidPasswordMatch,
} from "../../utils/validators";

interface FormFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string | React.ReactNode;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  maxlength?: number;
  pattern?: string;
  className?: string;
  helpText?: string;
  customValidation?: (value: string) => string | null;
  matchValue?: string;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  checked,
  onChange,
  required = false,
  minLength,
  maxlength,
  pattern,
  className = "",
  helpText,
  customValidation,
  matchValue = "",
  children,
}) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Validate field
  const validateField = (fieldValue: string | boolean): string | null => {
    if (type === "checkbox" && required && !checked) {
      return t("field_required", {
        field: label,
        defaultValue: "Este campo é obrigatório",
      });
    }

    if (
      required &&
      type !== "checkbox" &&
      !isNotEmpty((fieldValue as string).trim())
    ) {
      return t("field_required", {
        field: label,
        defaultValue: "Este campo é obrigatório",
      });
    }

    if (
      fieldValue &&
      minLength &&
      type !== "checkbox" &&
      !isValidMinLength(fieldValue as string, minLength)
    ) {
      return t("min_length_error", {
        minLength,
        defaultValue: `Mínimo de ${minLength} caracteres`,
      });
    }

    if (
      fieldValue &&
      type !== "checkbox" &&
      name === "document" &&
      !isValidDocument(fieldValue as string)
    ) {
      return t("document_error", { defaultValue: "Documento inválido" });
    }

    if (
      fieldValue &&
      type !== "checkbox" &&
      name === "phone" &&
      !isValidPhone(fieldValue as string)
    ) {
      return t("phone_invalid", {
        defaultValue: "Formato de telefone inválido.",
      });
    }

    if (
      fieldValue &&
      type === "password" &&
      isNotEmpty(matchValue) &&
      !isValidPasswordMatch(matchValue, fieldValue as string)
    ) {
      return t("repeat_password_invalid", {
        defaultValue: "As senhas não coincidem.",
      });
    }

    if (
      fieldValue &&
      pattern &&
      type !== "checkbox" &&
      !isValidRegex(fieldValue as string, pattern)
    ) {
      if (type === "email") {
        return t("invalid_email", {
          defaultValue: "Email inválido",
        });
      }

      if (pattern === "^[a-z0-9]+$") {
        return t("schema_name_invalid", {
          defaultValue: "Apenas letras minúsculas e números são permitidos",
        });
      }

      return t("invalid_format", {
        defaultValue: "Formato inválido",
      });
    }

    if (customValidation && type !== "checkbox") {
      return customValidation(fieldValue as string);
    }

    return null;
  };

  // Update error message when value changes
  useEffect(() => {
    if (touched) {
      const error = validateField(
        type === "checkbox" ? !!checked : (value as string),
      );
      setErrorMessage(error);
    }
  }, [value, touched]);

  const handleBlur = () => {
    setTouched(true);
    const error = validateField(
      type === "checkbox" ? !!checked : (value as string),
    );
    setErrorMessage(error);
  };

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  const hasError = touched && errorMessage;

  if (type === "checkbox") {
    return (
      <div className="space-x-2">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={!!checked}
          required={required}
          onChange={(e) => {
            onChange(e);
            setTouched(true);
          }}
          onBlur={handleBlur}
          className={`h-4 w-4 rounded border-gray-300 transition-colors focus:ring-2 focus:ring-indigo-500 ${hasError ? "border-red-500 ring-2 ring-red-400" : ""}`}
        />
        <label htmlFor={id} className="flex-1 cursor-pointer select-none">
          {label}
          {children}
        </label>
        {hasError && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-alert-icon lucide-circle-alert mr-1 h-4 w-4 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="space-y-1">
        <label
          htmlFor={id}
          className={`ml-1 block text-sm font-medium transition-colors ${
            hasError ? "text-red-600" : "text-gray-700"
          }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          <input
            type={type === "password" && showPassword ? "text" : type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            required={required}
            minLength={minLength}
            maxLength={maxlength}
            pattern={pattern}
            className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm transition-colors focus:ring-1 focus:outline-none ${
              hasError
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            } invalid:border-red-300 invalid:text-red-900 invalid:ring-red-300 ${className} `}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={handleClick}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {hasError && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-alert-icon lucide-circle-alert mr-1 h-4 w-4 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {!hasError && helpText && (
          <p className="mt-1 text-xs text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
};

export default FormField;
