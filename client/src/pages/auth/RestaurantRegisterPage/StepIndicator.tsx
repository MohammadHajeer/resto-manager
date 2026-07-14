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
  const currentStepDetails = steps[currentStep - 1];

  return (
    <nav className="mb-5 sm:mb-7" aria-label="Registration progress">
      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm sm:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              {currentStepDetails?.label}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={currentStep}
          aria-label={`Step ${currentStep} of ${totalSteps}: ${currentStepDetails?.label}`}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative mx-auto hidden max-w-3xl sm:block">
        <span className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 rounded-full bg-border" />
        <span
          className="absolute left-[12.5%] top-5 h-0.5 rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${progressPercentage * 0.75}%` }}
          aria-hidden="true"
        />

        <ol className="relative flex items-start justify-between px-4">
          {steps.map((item) => {
            const isCompleted = item.step < currentStep;
            const isActive = item.step === currentStep;
            const Icon = item.icon;

            return (
              <li
                key={item.step}
                aria-current={isActive ? "step" : undefined}
                className="relative z-10 flex basis-1/4 flex-col items-center gap-2.5 text-center"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : isActive
                        ? "border-primary bg-card text-primary ring-4 ring-primary/10"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold transition-colors duration-300 lg:text-sm ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
