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
      className="flex min-h-screen items-center justify-center bg-[#F8FAF9] px-4 py-10 text-[#0F172A]"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-card px-6 py-8 text-center shadow-sm sm:px-8">
        <div className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
          <LoaderCircle
            className="absolute size-12 animate-spin text-primary/70"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-5 text-lg font-semibold text-foreground">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mx-auto mt-6 h-1.5 w-28 overflow-hidden rounded-full bg-primary/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </main>
  );
}
