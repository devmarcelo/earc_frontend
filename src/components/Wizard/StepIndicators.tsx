interface StepIndicatorsProps {
  steps: string[];
  currentStep: number;
}

const StepIndicators: React.FC<StepIndicatorsProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="mb-6 flex justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${index === currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
          >
            {index + 1}
          </div>
          <p className="mt-1 text-xs sm:text-sm">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StepIndicators;
