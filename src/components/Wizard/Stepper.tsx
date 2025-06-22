import { useState, useCallback, useEffect, useRef } from "react";
import StepIndicators from "./StepIndicators";

interface Step {
  title: string;
  component: React.ReactNode;
}
interface StepperProps {
  steps: Step[];
}
const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextStep = useCallback((): void => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  }, [steps.length]);
  const prevStep = useCallback((): void => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);
  // Prevent stepper navigation when inside an input field
  const isTyping = (): boolean => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement
    );
  };
  // Keyboard Navigation (Ctrl + Arrow to navigate)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (
        containerRef.current &&
        containerRef.current.contains(document.activeElement)
      ) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); // Stop text cursor movement inside stepper
        }
        if (event.ctrlKey) {
          if (event.key === "ArrowRight") nextStep();
          if (event.key === "ArrowLeft") prevStep();
        }
      }
    },
    [nextStep, prevStep],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
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
      />
      {/* Render Step Content */}
      <div className="rounded-md border border-gray-300 p-4 text-center shadow-md">
        {steps[currentStep].component}
      </div>
      {/* Navigation Buttons */}
      <div className="mt-6 flex flex-col justify-between gap-2 sm:flex-row">
        <button
          className="rounded bg-gray-500 px-4 py-2 text-white transition-all duration-200 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      {/* Accessibility Hint */}
      <p className="mt-4 text-center text-sm text-gray-500">
        Use <kbd className="rounded bg-gray-200 px-1">Ctrl</kbd> +{" "}
        <kbd className="rounded bg-gray-200 px-1">←</kbd> /{" "}
        <kbd className="rounded bg-gray-200 px-1">→</kbd> to navigate steps.
      </p>
    </div>
  );
};

export default Stepper;
