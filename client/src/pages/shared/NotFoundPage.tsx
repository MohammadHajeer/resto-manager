import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-2xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchX className="size-10" aria-hidden="true" />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          The page you are looking for does not exist, may have been moved, or
          the link you followed is incorrect.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 size-4" />
              Go home
            </Link>
          </Button>

          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 size-4" />
            Go back
          </Button>
        </div>
      </section>
    </main>
  );
}
