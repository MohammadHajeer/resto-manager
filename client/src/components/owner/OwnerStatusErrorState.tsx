import { AlertCircle, RefreshCw, Store } from "lucide-react";
import { Link } from "react-router-dom";
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
    <main
      className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 text-foreground"
      role="alert"
    >
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-7" aria-hidden="true" />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-destructive">
          Unable to load status
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          We could not check your restaurant status
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Your account is still secure. Check your internet connection and try
          again, or continue browsing restaurants.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onRetry} disabled={isRetrying}>
            <RefreshCw
              className={isRetrying ? "animate-spin" : undefined}
              aria-hidden="true"
            />
            {isRetrying ? "Checking again..." : "Try again"}
          </Button>

          <Link to="/restaurants">
            <Button variant="outline">
              <Store aria-hidden="true" />
              Browse restaurants
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
