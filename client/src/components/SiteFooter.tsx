import { Globe2, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const linkClass = "text-sm text-background/60 transition-colors hover:text-background";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-12 lg:pt-20">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-5">
            <Link to="/" className="block text-xl font-semibold">
              <span className="text-primary">Resto</span>Manager
            </Link>
            <p className="max-w-xs text-sm leading-6 text-background/60">
              Empowering the culinary world with professional tools that bridge
              the gap between passion and profitability.
            </p>
            <div className="flex gap-3">
              <a
                href="#home"
                aria-label="Visit our website"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary"
              >
                <Globe2 className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#footer-links"
                aria-label="Explore footer links"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold text-background">Product</h2>
            <ul className="space-y-3">
              <li><Link to="/restaurant/register" className={linkClass}>Order Management</Link></li>
              <li><Link to="/restaurant/register" className={linkClass}>Menu Builder</Link></li>
              <li><Link to="/restaurant/register" className={linkClass}>POS Integration</Link></li>
              <li><Link to="/login" className={linkClass}>Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold text-background">Company</h2>
            <ul className="space-y-3">
              <li><a href="/#about" className={linkClass}>About us</a></li>
              <li><a href="/#features" className={linkClass}>Features</a></li>
              <li><a href="#privacy" className={linkClass}>Privacy policy</a></li>
              <li><a href="#terms" className={linkClass}>Terms of service</a></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold text-background">Stay Updated</h2>
            <p className="max-w-xs text-sm leading-6 text-background/60">
              Get the latest restaurant management insights and product updates.
            </p>
            <Link
              to="/sign-up"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Join RestoManager
            </Link>
          </div>
        </div>

        <div
          id="footer-links"
          className="flex flex-col gap-4 border-t border-background/15 pt-7 text-xs text-background/50 md:flex-row md:items-center md:justify-between"
        >
          <p>&copy; {new Date().getFullYear()} RestoManager. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Support links">
            <a href="#help" className="transition-colors hover:text-background">Help Center</a>
            <a href="#support" className="transition-colors hover:text-background">Support</a>
            <a href="#api" className="transition-colors hover:text-background">API Docs</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
