import { ArrowRight, ChefHat, Search, ShieldCheck, Store } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinkClass =
  "inline-flex text-sm text-background/60 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-foreground";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-background/10 bg-foreground text-background">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-32 -top-40 size-96 rounded-full bg-primary/15 blur-3xl" />

        <div className="absolute -bottom-52 -left-40 size-112 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[28px_28px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-7 pt-14 sm:px-6 lg:px-8 lg:pb-8 lg:pt-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 border-b border-background/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <Link
              to="/"
              aria-label="Go to RestoManager home page"
              className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-foreground"
            >
              <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                <span className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent" />

                <Store className="relative size-5" aria-hidden="true" />
              </span>

              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">Resto</span>Manager
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-background/60">
              A connected platform where customers discover restaurants,
              restaurant owners manage their digital presence, and
              administrators maintain platform quality.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-background/10 bg-background/5 px-3 py-1.5 text-xs text-background/60">
                Discover
              </span>

              <span className="rounded-full border border-background/10 bg-background/5 px-3 py-1.5 text-xs text-background/60">
                Manage
              </span>

              <span className="rounded-full border border-background/10 bg-background/5 px-3 py-1.5 text-xs text-background/60">
                Grow
              </span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <Search className="size-4 text-primary" aria-hidden="true" />

              <h2 className="text-sm font-semibold text-background">Explore</h2>
            </div>

            <ul className="space-y-3">
              <li>
                <Link to="/" className={footerLinkClass}>
                  Home
                </Link>
              </li>

              <li>
                <Link to="/restaurants" className={footerLinkClass}>
                  Browse restaurants
                </Link>
              </li>

              <li>
                <Link to="/login" className={footerLinkClass}>
                  Log in
                </Link>
              </li>

              <li>
                <Link to="/sign-up" className={footerLinkClass}>
                  Create an account
                </Link>
              </li>
            </ul>
          </div>

          {/* Restaurant owners */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <ChefHat className="size-4 text-primary" aria-hidden="true" />

              <h2 className="text-sm font-semibold text-background">
                For restaurants
              </h2>
            </div>

            <ul className="space-y-3">
              <li>
                <Link to="/restaurant/register" className={footerLinkClass}>
                  Register your restaurant
                </Link>
              </li>

              <li>
                <Link to="/login" className={footerLinkClass}>
                  Owner login
                </Link>
              </li>

              <li>
                <Link to="/owner/dashboard" className={footerLinkClass}>
                  Owner dashboard
                </Link>
              </li>

              <li>
                <Link to="/owner/menu" className={footerLinkClass}>
                  Manage menu
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />

              <h2 className="text-sm font-semibold text-background">
                Platform
              </h2>
            </div>

            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className={footerLinkClass}>
                  Privacy policy
                </Link>
              </li>

              <li>
                <Link to="/terms" className={footerLinkClass}>
                  Terms of service
                </Link>
              </li>

              <li>
                <Link to="/support" className={footerLinkClass}>
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Restaurant CTA */}
        <div className="flex flex-col gap-6 border-b border-background/10 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-background">
              Own or manage a restaurant?
            </p>

            <p className="mt-1 text-sm text-background/55">
              Create your restaurant profile and start building your digital
              menu.
            </p>
          </div>

          <Link
            to="/restaurant/register"
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 md:self-auto"
          >
            Register your restaurant
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 pt-7 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} RestoManager. All rights reserved.</p>

          <p>Built to connect customers and restaurants.</p>
        </div>
      </div>
    </footer>
  );
}
