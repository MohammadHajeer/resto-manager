import { ArrowLeft } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { BrandLogo } from "@/components/BrandLogo";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";

function LegalLinks() {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
      aria-label="Legal navigation"
    >
      <Link to="/privacy" className="transition-colors hover:text-primary">
        Privacy
      </Link>
      <Link to="/terms" className="transition-colors hover:text-primary">
        Terms
      </Link>
      <Link to="/support" className="transition-colors hover:text-primary">
        Support
      </Link>
    </nav>
  );
}

function EnhancedAuthLayout() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground lg:h-dvh lg:overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-20 size-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-10 size-96 rounded-full bg-secondary/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,138,102,0.08)_1px,transparent_0)] bg-size-[28px_28px] mask-[linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <main className="relative z-10 min-h-dvh lg:h-full lg:min-h-0">
        <div className="grid min-h-dvh w-full overflow-hidden bg-card lg:h-full lg:min-h-0 lg:max-w-none lg:grid-cols-[minmax(0,0.9fr)_minmax(31rem,1.1fr)]">
          <AuthVisualPanel />

          <section className="flex min-h-dvh min-w-0 flex-col bg-card lg:min-h-0">
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/70 px-5 py-3.5 sm:px-8 lg:px-7 xl:px-10">
              <Link
                to="/"
                className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Go to RestoManager home page"
              >
                <BrandLogo size="sm" />
              </Link>

              <Link
                to="/"
                className="group inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                <ArrowLeft
                  className="size-4 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Back to home</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </header>

            <div className="min-h-0 flex-1 lg:overflow-y-auto lg:overscroll-contain">
              <Outlet />
            </div>

            <footer className="shrink-0 border-t border-border/70 px-5 py-3 text-[11px] text-muted-foreground sm:px-8">
              <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
                <p>© {currentYear} RestoManager</p>
                <LegalLinks />
              </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}

export function AuthLayout() {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const useEnhancedLayout = pathname === "/login" || pathname === "/sign-up";

  if (useEnhancedLayout) {
    return <EnhancedAuthLayout />;
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-24 size-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-20 size-96 rounded-full bg-secondary/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,138,102,0.08)_1px,transparent_0)] bg-size-[28px_28px] mask-[linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <header className="relative z-20 shrink-0 border-b border-border/60 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Go to RestoManager home page"
          >
            <BrandLogo />
          </Link>

          <Link
            to="/"
            className="group inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary sm:px-4"
          >
            <ArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="relative z-10 shrink-0 border-t border-border/50 bg-background/72 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {currentYear} RestoManager. All rights reserved.</p>
          <LegalLinks />
        </div>
      </footer>
    </div>
  );
}
