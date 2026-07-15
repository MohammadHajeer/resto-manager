import { LoaderCircle, ShieldCheck } from "lucide-react";

interface RouteLoadingStateProps {
  title?: string;
  description?: string;
}

export function RouteLoadingState({
  title = "Preparing your page",
  description = "Please wait while we check your account.",
}: RouteLoadingStateProps) {
  return (
    <main
      className="flex min-h-dvh items-center justify-center bg-[#F8FAF9] px-4 text-[#0F172A]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="relative flex size-14 items-center justify-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>

          <LoaderCircle
            className="absolute size-14 animate-spin text-primary/50"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-5 text-lg font-semibold text-foreground">{title}</h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 h-1 w-24 overflow-hidden rounded-full bg-primary/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
        </div>

        <span className="sr-only">Loading</span>
      </div>
    </main>
  );
}
