import type { ReactNode } from "react";
import { UtensilsCrossed } from "lucide-react";

type AuthFormCardProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
};

export function AuthFormCard({ title, description, children }: AuthFormCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:py-16">
      <section className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-foreground">{title}</h1>
            <div className="mt-2 text-sm text-muted-foreground">{description}</div>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
