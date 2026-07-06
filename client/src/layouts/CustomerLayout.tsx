import { NavLink, Link, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function CustomerLayout() {
  // Get the logged-in user's info (name, email, etc.) for the avatar
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ================================================================
          TOP NAVBAR
          ================================================================ */}
      <header className="sticky top-0 z-50 bg-card border-b border-border h-16">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-6">

          {/* Brand — links back to public home */}
          <Link
            to="/"
            className="font-bold text-lg tracking-tight text-foreground shrink-0"
          >
            🍽 RestoManager
          </Link>

          {/* Customer nav links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Browse
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              My Orders
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Profile
            </NavLink>
          </nav>

          {/* ── RIGHT SIDE: Cart icon + avatar ── */}
          <div className="flex items-center gap-3">

            {/*
              Cart icon with badge.
              The badge shows the number of items in the cart.
              Currently hardcoded to 0 — will be replaced with
              real data from CartContext in a future ticket.
            */}
            <Link
              to="/cart"
              className="relative p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
              aria-label="View cart"
            >
              {/* Shopping cart SVG icon (inline — no external dependency needed) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12m-5 4a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>

              {/* Badge — TODO: replace 0 with real cart item count */}
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User avatar — first letter of name in a primary-colored circle */}
            <div
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold select-none"
              title={user?.name ?? "Customer"}
            >
              {user?.name?.[0]?.toUpperCase() ?? "C"}
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================
          PAGE CONTENT
          flex-1 ensures this grows to fill available space so the
          page doesn't feel short on taller screens.
          ================================================================ */}
      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
}
