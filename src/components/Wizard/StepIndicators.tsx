interface StepIndicatorsProps {
  steps: string[];
  currentStep: number;
  stepValidation?: boolean[];
}

const StepIndicators: React.FC<StepIndicatorsProps> = ({
  steps,
  currentStep,
  stepValidation = [],
}) => {
  const getStepStatus = (index: number) => {
    if (index < currentStep) {
      // Completed step - check if it was validated
      return stepValidation[index] ? "completed" : "completed-invalid";
    } else if (index === currentStep) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "completed-invalid":
        return "bg-yellow-500 text-white border-yellow-500";
      case "current":
        return "bg-blue-500 text-white border-blue-500 ring-2 ring-blue-200";
      case "upcoming":
        return "bg-gray-300 text-gray-700 border-gray-300";
      default:
        return "bg-gray-300 text-gray-700 border-gray-300";
    }
  };

  const getStepIcon = (status: string, stepNumber: number) => {
    switch (status) {
      case "completed":
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "completed-invalid":
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return <span className="font-bold">{stepNumber}</span>;
    }
  };

  return (
    <div className="mb-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const stepClasses = getStepClasses(status);

            return (
              <li key={index} className="flex flex-1 flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${stepClasses}`}
                  aria-current={index === currentStep ? "step" : undefined}
                >
                  {getStepIcon(status, index + 1)}
                </div>

                {/* Step Label */}
                <p
                  className={`mt-2 text-xs font-medium sm:text-sm ${
                    index === currentStep
                      ? "text-blue-600"
                      : index < currentStep
                        ? stepValidation[index]
                          ? "text-green-600"
                          : "text-yellow-600"
                        : "text-gray-500"
                  }`}
                >
                  {step}
                </p>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute mt-5 h-0.5 w-full transition-all duration-200 ${
                      index < currentStep
                        ? stepValidation[index]
                          ? "bg-green-500"
                          : "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                    style={{
                      left: "50%",
                      right: "-50%",
                      zIndex: -1,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default StepIndicators;
