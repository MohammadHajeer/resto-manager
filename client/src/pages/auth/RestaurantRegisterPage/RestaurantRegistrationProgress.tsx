import { useEffect, useState } from "react";
import { Check, LoaderCircle, ShieldCheck } from "lucide-react";

type RestaurantRegistrationProgressProps = {
  open: boolean;
  phase: "registration" | "login";
  isResolved: boolean;
  onComplete: () => void;
};

const registrationSteps = [
  "Preparing your registration",
  "Uploading restaurant images",
  "Uploading verification documents",
  "Creating owner account",
  "Assigning restaurant owner access",
  "Submitting restaurant for admin review",
  "Almost done",
];

const loginSteps = [
  "Registration submitted successfully",
  "Logging you in",
  "Preparing your owner account",
  "Redirecting to your review status page",
];

export function RestaurantRegistrationProgress({
  open,
  phase,
  isResolved,
  onComplete,
}: RestaurantRegistrationProgressProps) {
  const [progress, setProgress] = useState(phase === "login" ? 28 : 8);
  const progressSteps =
    phase === "registration" ? registrationSteps : loginSteps;

  useEffect(() => {
    if (!open) return;

    const interval = window.setInterval(() => {
      setProgress((currentProgress) => {
        const ceiling = isResolved ? 100 : 92;

        if (currentProgress >= ceiling) {
          return ceiling;
        }

        const remaining = ceiling - currentProgress;
        const increment = isResolved
          ? Math.max(5, remaining * 0.35)
          : Math.max(0.5, remaining * 0.05);

        return Math.min(ceiling, currentProgress + increment);
      });
    }, isResolved ? 90 : 450);

    return () => window.clearInterval(interval);
  }, [isResolved, open]);

  useEffect(() => {
    if (!open || !isResolved || progress < 100) return;

    const completionDelay = window.setTimeout(onComplete, 700);

    return () => window.clearTimeout(completionDelay);
  }, [isResolved, onComplete, open, progress]);

  if (!open) return null;

  const isFinished = progress >= 100;
  const activeStep = isFinished
    ? progressSteps.length
    : Math.min(
        progressSteps.length - 1,
        Math.floor((progress / 100) * progressSteps.length),
      );
  const title = isFinished
    ? phase === "registration"
      ? "Registration submitted successfully"
      : "Owner account ready"
    : phase === "registration"
      ? "Submitting your registration"
      : "Logging you in";
  const description = isFinished
    ? phase === "registration"
      ? "Your registration is ready. We will securely sign you in next."
      : "Your secure session is ready. Redirecting you now."
    : phase === "registration"
      ? "We are securely preparing your restaurant for review."
      : "We are preparing your owner account and review status page.";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-progress-title"
      aria-describedby="registration-progress-note"
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-xl sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isFinished ? (
              <Check className="size-5" aria-hidden="true" />
            ) : (
              <ShieldCheck className="size-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <h2
              id="registration-progress-title"
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Estimated progress</span>
            <span className="text-foreground">{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ol className="space-y-3" aria-live="polite">
          {progressSteps.map((step, index) => {
            const isComplete = isFinished || index < activeStep;
            const isActive = !isFinished && index === activeStep;

            return (
              <li
                key={step}
                className={`flex items-center gap-3 text-sm ${
                  isActive
                    ? "font-medium text-foreground"
                    : isComplete
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60"
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                    isComplete
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background"
                  }`}
                >
                  {isComplete ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : isActive ? (
                    <LoaderCircle
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                  )}
                </span>
                {step}
              </li>
            );
          })}
        </ol>

        <p
          id="registration-progress-note"
          className="mt-6 rounded-md border border-border bg-muted/50 px-4 py-3 text-center text-xs text-muted-foreground"
        >
          {isFinished
            ? phase === "registration"
              ? "Registration complete. Starting secure sign-in now."
              : "Sign-in complete. Taking you to your review status page."
            : "Please do not close this page while we finish setting up your account."}
        </p>
      </div>
    </div>
  );
}
