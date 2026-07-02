import { Check, FileCheck2, IdCard, Store, UserRound } from "lucide-react";
import { totalSteps } from "./types";

const steps = [
  { step: 1, label: "Owner Info", icon: UserRound },
  { step: 2, label: "Details", icon: Store },
  { step: 3, label: "Verification", icon: IdCard },
  { step: 4, label: "Review", icon: FileCheck2 },
];

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative mx-auto mb-8 flex max-w-2xl items-start justify-between px-3 sm:mb-10 sm:px-6">
      <div className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-border" />
      <div
        className="absolute left-[12.5%] top-4 h-px bg-primary transition-all duration-500"
        style={{ width: `${progressPercentage * 0.75}%` }}
      />

      {steps.map((item) => {
        const isCompleted = item.step < currentStep;
        const isActive = item.step === currentStep;
        const Icon = item.icon;

        return (
          <div
            key={item.step}
            className="relative z-10 flex basis-1/4 flex-col items-center gap-2 text-center"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border bg-background transition-all duration-300 ${
                isCompleted || isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icon className="h-4 w-4" aria-hidden="true" />
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-300 sm:text-sm ${
                isActive
                  ? "text-foreground"
                  : isCompleted
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
