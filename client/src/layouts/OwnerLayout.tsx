/**
 * OwnerLayout.tsx
 * ----------------
 * RES-8: Build base application layouts
 *
 * PURPOSE:
 *   Shell for all PROTECTED restaurant owner pages.
 *   Uses a classic dashboard pattern:
 *     - LEFT SIDEBAR with navigation links
 *     - TOP BAR with section title and user avatar
 *     - MAIN AREA where page content renders via <Outlet />
 *
 * PAGES THAT USE THIS LAYOUT (defined in App.tsx):
 *   /owner/dashboard          → OwnerDashboardPage
 *   /owner/profile            → RestaurantProfilePage
 *   /owner/menu               → MenuManagementPage
 *   /owner/menu/new           → AddMenuItemPage
 *   /owner/menu/:id/edit      → EditMenuItemPage
 *   /owner/orders             → OwnerOrdersPage
 *   /owner/orders/:orderId    → OwnerOrderDetailsPage
 *   /owner/settings           → OwnerSettingsPage
 *
 * ACCESS CONTROL:
 *   Guarded upstream in App.tsx by:
 *     <ProtectedRoute> + <RoleRoute allowedRoles={["restaurant_owner"]}>
 *   This component does NOT handle auth checks itself.
 *
 * ACTIVE LINK HIGHLIGHTING:
 *   We use NavLink (not Link) so React Router automatically sets
 *   isActive=true when the current URL matches the link's `to` prop.
 *   We use this to apply the primary highlight style to the active item.
 *
 *   The `end` prop on Dashboard means it only activates on EXACT
 *   /owner/dashboard — without it, it would highlight on ALL /owner/* URLs.
 *
 * THEMING:
 *   All colors reference the CSS variables defined in index.css
 *   (--background, --foreground, --primary, --border, --muted, etc.)
 *   rather than hardcoded hex values, so a palette change in index.css
 *   propagates here automatically.
 *
 * EXTENDING THE SIDEBAR:
 *   To add a new page, just add a new entry to the NAV_ITEMS array below.
 *   No other changes needed.
 */

import { NavLink, Link, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

// ---------------------------------------------------------------------------
// SIDEBAR NAVIGATION ITEMS
// Add new entries here as new owner pages are built in future tickets.
// `end: true` prevents the link from staying active on child routes.
// ---------------------------------------------------------------------------
const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: "/owner/dashboard", label: "Dashboard",          end: true },
  { to: "/owner/profile",   label: "Restaurant Profile" },
  { to: "/owner/menu",      label: "Menu Management" },
  { to: "/owner/orders",    label: "Orders" },
  { to: "/owner/settings",  label: "Settings" },
];

export default function OwnerLayout() {
  // Get logged-in user info for the top bar avatar and name
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* ================================================================
          LEFT SIDEBAR
          - w-64:     fixed width of 256px
          - shrink-0: prevents it from getting squished by main content
          - flex flex-col justify-between: pushes "View Public Site"
            link to the bottom of the sidebar
          ================================================================ */}
      <aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col justify-between p-6">

        {/* Top section: logo + nav links */}
        <div>
          {/* Brand logo — clicking it goes to owner dashboard */}
          <Link
            to="/owner/dashboard"
            className="block mb-8 text-xl font-bold tracking-tight text-foreground"
          >
            🍽 Owner Portal
          </Link>

          {/* Navigation links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold" // active: primary highlight
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section: back to public site */}
        <div className="pt-4 border-t border-border">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← View Public Site
          </Link>
        </div>
      </aside>

      {/* ================================================================
          MAIN AREA (top bar + scrollable content)
          flex-1:         takes up all remaining width after sidebar
          overflow-hidden: prevents double scrollbars
          ================================================================ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar — sticky within the main area */}
        <header className="h-16 shrink-0 bg-card border-b border-border px-8 flex items-center justify-between">
          <span className="font-semibold text-sm text-foreground">Owner Control Panel</span>

          {/* User name + avatar */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user?.name ?? "Owner"}</span>
            <div
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold select-none"
              title={user?.name ?? "Owner"}
            >
              {user?.name?.[0]?.toUpperCase() ?? "O"}
            </div>
          </div>
        </header>

        {/* Page content — scrollable independently of the sidebar */}
        <main className="flex-1 overflow-y-auto p-8">
          {/*
            <Outlet /> renders the matched child route.
            Example: URL = /owner/menu → <MenuManagementPage /> renders here.
            The sidebar and top bar stay constant.
          */}
          <Outlet />
        </main>
      </div>

    </div>
  );
}
