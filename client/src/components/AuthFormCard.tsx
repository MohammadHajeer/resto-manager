import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthFormCardProps = {
  title: string;
  eyebrow: string;
  description: ReactNode;
  children: ReactNode;
  compact?: boolean;
};

export function AuthFormCard({
  title,
  eyebrow,
  description,
  children,
  compact = false,
}: AuthFormCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-full items-center justify-center px-6 py-8 sm:px-10 lg:px-8 lg:py-6 xl:px-12",
        compact && "py-6 lg:py-4",
      )}
    >
      <section className="w-full max-w-[34rem] text-card-foreground">
        <div className={cn("mb-6 text-left", compact && "mb-5")}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary/65 px-3 py-1.5 text-xs font-bold text-secondary-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
            {title}
          </h1>
          <div className="mt-2.5 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </div>
        </div>

        <div
          className={cn(
            "border-t border-border pt-6",
            compact && "pt-5",
          )}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
