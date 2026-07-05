import { ArrowLeft, Home, SearchX, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

type ResourceNotFoundProps = {
  resourceName?: string;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionTo?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  fullPage?: boolean;
};

export function ResourceNotFound({
  resourceName = "resource",
  title,
  description,
  icon: Icon = SearchX,
  actionLabel,
  actionTo,
  showBackButton = true,
  showHomeButton = false,
  fullPage = true,
}: ResourceNotFoundProps) {
  const navigate = useNavigate();

  const content = (
    <section className="w-full max-w-2xl text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-10" aria-hidden="true" />
      </div>

      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-destructive">
        Not found
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title ?? `This ${resourceName} does not exist`}
      </h1>

      <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
        {description ??
          `The ${resourceName} you are looking for may have been deleted, moved, or the link you followed is incorrect.`}
      </p>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        {actionLabel && actionTo ? (
          <Link to={actionTo}>
            <Button>{actionLabel}</Button>
          </Link>
        ) : null}

        {showBackButton ? (
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 size-4" />
            Go back
          </Button>
        ) : null}

        {showHomeButton ? (
          <Link to="/">
            <Button variant="outline">
              <Home className="mr-2 size-4" />
              Go home
            </Button>
          </Link>
        ) : null}
      </div>
    </section>
  );

  if (!fullPage) {
    return (
      <div className="flex w-full items-center justify-center px-4 py-16 text-foreground">
        {content}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      {content}
    </main>
  );
}
