/**
 * PublicLayout.tsx
 * -----------------
 * RES-8: Build base application layouts
 *
 * PURPOSE:
 *   This is the shell (wrapper) for every PUBLIC page in the app.
 *   It renders a sticky top navbar and a footer around whichever
 *   page is currently active (via React Router's <Outlet />).
 *
 * PAGES THAT USE THIS LAYOUT (defined in App.tsx):
 *   /                          → LandingPage
 *   /restaurants               → RestaurantListingPage
 *   /restaurants/:slug         → RestaurantMenuPage
 *   /restaurants/:slug/items/  → MenuItemDetailsPage
 *   /restaurant/register       → RestaurantRegisterPage
 *   /login                     → LoginPage          (inside GuestRoute)
 *   /sign-up                   → CustomerSignUpPage (inside GuestRoute)
 *   *                          → NotFoundPage
 *
 * HOW <Outlet /> WORKS:
 *   React Router replaces <Outlet /> with the matched child page.
 *   Example: URL = /restaurants → <RestaurantListingPage /> appears here.
 *   The navbar and footer stay constant; only the middle changes.
 *
 * AUTH-AWARE NAVBAR BEHAVIOUR:
 *   - Session loading          → grey pulsing circle (skeleton)
 *   - Not logged in (guest)    → "Log in" link + green "Sign up" button
 *   - Logged in as customer    → "My Orders" link + green avatar
 *   - Logged in as owner       → "My Restaurant" link + green avatar
 *   - Logged in as admin       → "Admin Panel" link + green avatar
 *
 * SESSION SOURCE:
 *   authClient.useSession() from better-auth.
 *   Returns { data: session | null, isPending: boolean }.
 *   The user's role is stored as a custom field: session.user.role
 */

import { NavLink, Link, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

// ---------------------------------------------------------------------------
// ROLE MAPS
// Maps each role string to the correct dashboard URL and nav label.
// Add new roles here if the system expands.
// ---------------------------------------------------------------------------
const ROLE_DASHBOARD: Record<string, string> = {
  admin:             "/admin/dashboard",
  restaurant_owner:  "/owner/dashboard",
  customer:          "/orders",
};

const ROLE_LABEL: Record<string, string> = {
  admin:             "Admin Panel",
  restaurant_owner:  "My Restaurant",
  customer:          "My Orders",
};

export default function PublicLayout() {
  // better-auth hook — fetches the current session from the server.
  // isPending = true while the first session request is in flight.
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Role is a custom field added to the user object via better-auth plugins.
  // We cast to include it since the default User type doesn't know about it.
  const role = (user as { role?: string } | undefined)?.role ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#0F172A]">

      {/* ================================================================
          NAVBAR
          - sticky: stays at top when user scrolls
          - z-50:   floats above page content
          - h-16:   fixed height of 64px
          ================================================================ */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] h-16">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-6">

          {/* Brand — always links back to home */}
          <Link
            to="/"
            className="font-bold text-lg tracking-tight text-[#0F172A] shrink-0"
          >
            🍽 RestoManager
          </Link>

          {/* Nav links — hidden on mobile (md:flex shows them on tablet+) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {/*
              NavLink automatically receives isActive=true when the URL matches.
              The `end` prop on Home prevents it matching ALL routes (since all
              routes start with "/").
            */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-[#16A34A] font-semibold"
                  : "text-slate-500 hover:text-slate-900 transition-colors"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                isActive
                  ? "text-[#16A34A] font-semibold"
                  : "text-slate-500 hover:text-slate-900 transition-colors"
              }
            >
              Restaurants
            </NavLink>
          </nav>

          {/* ── RIGHT SIDE: Auth buttons or user info ── */}
          <div className="flex items-center gap-3 shrink-0">
            {isPending ? (
              // Session is still loading — show a grey pulse placeholder
              // so the navbar doesn't jump when the user info arrives
              <span className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />

            ) : user ? (
              // ── USER IS LOGGED IN ──
              <>
                {/* Dashboard link — label and URL depend on the user's role */}
                <Link
                  to={ROLE_DASHBOARD[role] ?? "/"}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {ROLE_LABEL[role] ?? "Dashboard"}
                </Link>

                {/* Avatar circle — shows the first letter of the user's name */}
                <div
                  className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-sm font-bold select-none"
                  title={user.name ?? "User"}
                >
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              </>

            ) : (
              // ── GUEST (not logged in) ──
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/sign-up"
                  className="px-4 py-2 rounded-md bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================================================================
          PAGE CONTENT
          <Outlet /> is replaced by the matched child route's component.
          flex-1 makes this section grow to fill remaining vertical space
          so the footer always stays at the bottom.
          ================================================================ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ================================================================
          FOOTER
          mt-16 adds space above the footer so page content doesn't
          feel cramped right against it.
          ================================================================ */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span className="font-semibold text-[#0F172A]">🍽 RestoManager</span>
          <span>© {new Date().getFullYear()} RestoManager. All rights reserved.</span>
          <nav className="flex gap-4">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link to="/restaurants" className="hover:text-slate-900 transition-colors">Restaurants</Link>
            <Link to="/restaurant/register" className="hover:text-slate-900 transition-colors">Register Restaurant</Link>
          </nav>
        </div>
      </footer>

    </div>
  );
}
