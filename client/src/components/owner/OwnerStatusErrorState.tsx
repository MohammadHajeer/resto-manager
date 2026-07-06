import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type OwnerStatusErrorStateProps = {
  onRetry: () => void;
  isRetrying?: boolean;
};

export function OwnerStatusErrorState({
  onRetry,
  isRetrying = false,
}: OwnerStatusErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <section
        className="w-full max-w-lg rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-sm sm:p-8"
        role="alert"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-semibold">
          We could not check your restaurant status
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Your account is still secure. Check your connection and try again
          before continuing.
        </p>
        <Button
          className="mt-6"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RefreshCw
            className={isRetrying ? "animate-spin" : undefined}
            aria-hidden="true"
          />
          {isRetrying ? "Checking again..." : "Try again"}
        </Button>
      </section>
    </main>
  );
}
