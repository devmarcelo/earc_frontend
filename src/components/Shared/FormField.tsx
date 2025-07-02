import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  isNotEmpty,
  isValidRegex,
  isValidMinLength,
  isValidDocument,
} from "../../utils/validators";

interface FormFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  maxlength?: number;
  pattern?: string;
  className?: string;
  helpText?: string;
  customValidation?: (value: string) => string | null;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  maxlength,
  pattern,
  className = "",
  helpText,
  customValidation,
}) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate field
  const validateField = (fieldValue: string): string | null => {
    if (required && !isNotEmpty(fieldValue.trim())) {
      return t("field_required", {
        field: label,
        defaultValue: "Este campo é obrigatório",
      });
    }

    if (fieldValue && minLength && !isValidMinLength(fieldValue, minLength)) {
      return t("min_length_error", {
        minLength,
        defaultValue: `Mínimo de ${minLength} caracteres`,
      });
    }

    if (fieldValue && id === "document" && !isValidDocument(fieldValue)) {
      return t("document_error", { defaultValue: "Documento inválido" });
    }

    if (fieldValue && pattern && !isValidRegex(fieldValue, pattern)) {
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

    if (customValidation) {
      return customValidation(fieldValue);
    }

    return null;
  };

  // Update error message when value changes
  useEffect(() => {
    if (touched) {
      const error = validateField(value);
      setErrorMessage(error);
    }
  }, [value, touched]);

  const handleBlur = () => {
    setTouched(true);
    const error = validateField(value);
    setErrorMessage(error);
  };

  const hasError = touched && errorMessage;

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

      <input
        type={type}
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

      {hasError && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <svg
            className="mr-1 h-4 w-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {!hasError && helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;
