import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import StepIndicators from "./StepIndicators";

interface Step {
  title: string;
  component: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
  isValid?: boolean;
  customValidate?: () => boolean | Promise<boolean>;
}

interface StepperProps {
  steps: Step[];
  onStepChange?: (stepIndex: number) => void;
  onFinish?: () => void | Promise<void>;
  showValidationErrors?: boolean;
  isLoading?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  onStepChange,
  onFinish,
  showValidationErrors = true,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValidation, setStepValidation] = useState<boolean[]>(
    new Array(steps.length).fill(false),
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const currentStepData = steps[currentStep];

    if (!currentStepData.validate && !currentStepData.customValidate) {
      return true; // No validation function means step is valid
    }

    setIsValidating(true);
    setValidationErrors([]);

    try {
      let isValid = true;

      if (currentStepData.validate) {
        isValid = await currentStepData.validate();
      }

      if (currentStepData.customValidate) {
        isValid = await currentStepData.customValidate();
      }

      // Update step validation state
      setStepValidation((prev) => {
        const newValidation = [...prev];
        newValidation[currentStep] = isValid;
        return newValidation;
      });

      if (!isValid) {
        // Get validation errors from the form
        const errors = getFormValidationErrors();
        setValidationErrors(errors);
      }

      return isValid;
    } catch (error) {
      console.error("Validation error:", error);
      setValidationErrors([
        t("validation_error", {
          defaultValue: "Erro na validação. Tente novamente.",
        }),
      ]);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, steps, t]);

  // Get validation errors from current form
  const getFormValidationErrors = useCallback((): string[] => {
    const errors: string[] = [];
    const currentForm = containerRef.current?.querySelector("form");

    if (currentForm && steps[currentStep].validate) {
      const requiredInputs = currentForm.querySelectorAll(
        "input[required], select[required]",
      );

      requiredInputs.forEach((input) => {
        const inputElement = input as HTMLInputElement | HTMLSelectElement;
        const label =
          currentForm.querySelector(`label[for="${inputElement.id}"]`)
            ?.textContent || inputElement.name;

        if (!inputElement.value.trim()) {
          errors.push(
            t("field_required", {
              field: label,
              defaultValue: `${label} é obrigatório`,
            }),
          );
        } else if (
          inputElement.type === "email" &&
          !isValidEmail(inputElement.value)
        ) {
          errors.push(
            t("invalid_email", {
              defaultValue: "Email inválido",
            }),
          );
        } else if (
          inputElement.type === "password" &&
          inputElement.value.length < 8
        ) {
          errors.push(
            t("password_min_length", {
              defaultValue: "Senha deve ter pelo menos 8 caracteres",
            }),
          );
        }
      });

      // Check for checkboxes (like terms acceptance)
      const requiredCheckboxes = currentForm.querySelectorAll(
        'input[type="checkbox"][required]',
      );
      requiredCheckboxes.forEach((checkbox) => {
        const checkboxElement = checkbox as HTMLInputElement;
        if (!checkboxElement.checked) {
          const label =
            currentForm.querySelector(`label[for="${checkboxElement.id}"]`)
              ?.textContent || "Campo obrigatório";
          errors.push(
            t("checkbox_required", {
              field: label,
              defaultValue: `${label} deve ser marcado`,
            }),
          );
        }
      });
    }

    return errors;
  }, [t]);

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle finish action
  const handleFinish = useCallback(async (): Promise<void> => {
    if (!onFinish) return;

    // Validate current step before finishing
    const isValid = await validateCurrentStep();

    if (!isValid) return;

    setIsFinishing(true);

    try {
      await onFinish();
    } catch (error) {
      console.error("Finish error:", error);
      setValidationErrors([
        t("finish_error", {
          defaultValue: "Erro ao finalizar. Tente novamente.",
        }),
      ]);
    } finally {
      setIsFinishing(false);
    }
  }, [onFinish, validateCurrentStep, t]);

  // Navigate to next step with validation
  const nextStep = useCallback(async (): Promise<void> => {
    if (currentStep >= steps.length - 1) {
      // If it's the last step, trigger finish
      await handleFinish();
      return;
    }

    const isValid = await validateCurrentStep();

    if (isValid) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setValidationErrors([]);

      if (onStepChange) {
        onStepChange(newStep);
      }
    }
  }, [
    currentStep,
    steps.length,
    validateCurrentStep,
    onStepChange,
    handleFinish,
  ]);

  // Navigate to previous step
  const prevStep = useCallback((): void => {
    if (currentStep <= 0) return;

    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    setValidationErrors([]);

    if (onStepChange) {
      onStepChange(newStep);
    }
  }, [currentStep, onStepChange]);

  // Keyboard Navigation (Ctrl + Arrow to navigate)
  const handleKeyDown = useCallback(
    async (event: KeyboardEvent): Promise<void> => {
      if (
        containerRef.current &&
        containerRef.current.contains(document.activeElement)
      ) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); // Stop text cursor movement inside stepper
        }

        if (event.ctrlKey) {
          if (event.key === "ArrowRight") {
            await nextStep();
          }
          if (event.key === "ArrowLeft") {
            prevStep();
          }
        }
      }
    },
    [nextStep, prevStep],
  );

  useEffect(() => {
    const handleKeyDownWrapper = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    document.addEventListener("keydown", handleKeyDownWrapper);
    return () => document.removeEventListener("keydown", handleKeyDownWrapper);
  }, [handleKeyDown]);

  // Clear validation errors when step changes
  useEffect(() => {
    setValidationErrors([]);
  }, [currentStep]);

  const isButtonLoading = isValidating || isFinishing || isLoading;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-lg px-4 focus:outline-none"
      tabIndex={0}
    >
      {/* Step Indicators */}
      <StepIndicators
        steps={steps.map((step) => step.title)}
        currentStep={currentStep}
        stepValidation={stepValidation}
      />

      {/* Validation Errors */}
      {showValidationErrors && validationErrors.length > 0 && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t("validation_errors", {
                  defaultValue: "Corrija os seguintes erros:",
                })}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Step Content */}
      <div className="rounded-md border border-gray-300 p-4 shadow-md">
        {steps[currentStep].component}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex flex-col justify-between gap-2 sm:flex-row">
        <button
          type="button"
          className="rounded bg-gray-500 px-4 py-2 text-white transition-all duration-200 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={prevStep}
          disabled={currentStep === 0 || isButtonLoading}
        >
          {t("previous", { defaultValue: "Anterior" })}
        </button>

        <button
          type="button"
          className={`rounded px-4 py-2 text-white transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isLastStep
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-300"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
          }`}
          onClick={nextStep}
          disabled={isButtonLoading}
        >
          {isButtonLoading ? (
            <span className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {isLastStep
                ? t("creating_company", { defaultValue: "Criando empresa..." })
                : t("validating", { defaultValue: "Validando..." })}
            </span>
          ) : isLastStep ? (
            t("create_company", { defaultValue: "Criar Empresa" })
          ) : (
            t("next", { defaultValue: "Próximo" })
          )}
        </button>
      </div>

      {/* Accessibility Hint */}
      <p className="mt-4 text-center text-sm text-gray-500">
        {t("keyboard_navigation_hint", {
          defaultValue: "Use Ctrl + ← / → para navegar entre os passos",
        })}
      </p>
    </div>
  );
};

export default Stepper;
