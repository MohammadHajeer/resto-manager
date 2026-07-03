import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

export default function OwnerPendingPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <section className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-sm sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock3 className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
          Your restaurant is under review
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Your registration was submitted successfully. Our team will review
          the restaurant details and verification documents before activation.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="flex gap-3 rounded-md border border-border bg-muted/40 p-4">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-medium">Submission received</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your restaurant profile and documents are safely recorded.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-md border border-border bg-muted/40 p-4">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-medium">Admin review pending</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Restaurant management features unlock after approval.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          You can safely leave this page and return later to check your status.
        </p>
      </section>
    </main>
  );
}
