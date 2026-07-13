import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-24 size-80 rounded-full bg-primary/8 blur-3xl" />

        <div className="absolute -right-32 bottom-20 size-96 rounded-full bg-secondary/70 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,138,102,0.08)_1px,transparent_0)] bg-size-[28px_28px] mask-[linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      {/* Auth header */}
      <header className="relative z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Go to RestoManager home page"
          >
            <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-tl from-primary via-white to-transparent text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <span className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent" />

              <img src="/logo.png" alt="RestoManager logo" className="" />
            </span>

            <span className="text-lg font-bold tracking-tight text-foreground">
              <span className="text-primary">Resto</span>Manager
            </span>
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

      {/* Auth page */}
      <main className="relative z-10 flex flex-1 flex-col">
        <Outlet />
      </main>

      {/* Minimal auth footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/60 px-4 py-5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {currentYear} RestoManager. All rights reserved.</p>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label="Legal navigation"
          >
            <Link
              to="/privacy"
              className="transition-colors hover:text-primary"
            >
              Privacy
            </Link>

            <Link to="/terms" className="transition-colors hover:text-primary">
              Terms
            </Link>

            <Link
              to="/support"
              className="transition-colors hover:text-primary"
            >
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
