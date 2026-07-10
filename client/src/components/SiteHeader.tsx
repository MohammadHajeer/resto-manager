import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowRight,
  LayoutDashboard,
  Menu,
  ShoppingCart,
  Store,
  UserRound,
  X,
} from "lucide-react";

import {
  getDashboardPath,
  normalizeRole,
  type UserRole,
} from "../auth/auth-types";
import { authClient } from "../lib/auth-client";
import {
  calculateCartItemCount,
  useCartStore,
} from "@/stores/useCartStore";
import { Button } from "./ui/button";
import { LogoutConfirmDialog } from "./common/LogoutConfirmDialog";

type NavigationLink = {
  label: string;
  to: string;
};

const roleLinks: Record<UserRole, NavigationLink[]> = {
  customer: [
    { label: "Restaurants", to: "/restaurants" },
    { label: "My Orders", to: "/orders" },
    { label: "Profile", to: "/profile" },
  ],

  restaurant_owner: [
    { label: "Dashboard", to: "/owner/dashboard" },
    { label: "Orders", to: "/owner/orders" },
    { label: "Menu", to: "/owner/menu" },
  ],

  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Restaurants", to: "/admin/restaurants" },
  ],
};

const guestLinks: NavigationLink[] = [
  { label: "Home", to: "/" },
  { label: "Restaurants", to: "/restaurants" },
];

function formatRole(role: UserRole | null) {
  if (!role) {
    return "Account";
  }

  if (role === "restaurant_owner") {
    return "Restaurant owner";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const cartItemCount = useCartStore((state) =>
    calculateCartItemCount(state.items),
  );

  const user = session?.user;
  const role = normalizeRole(user?.role);

  const links = role ? roleLinks[role] : guestLinks;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="relative z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Go to RestoManager home page"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <span className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent" />

            <Store className="relative size-4.5" aria-hidden="true" />
          </span>

          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight text-foreground">
              <span className="text-primary">Resto</span>Manager
            </span>

            <span className="hidden text-[9px] font-medium tracking-wide text-muted-foreground sm:block">
              Discover. Manage. Grow.
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                [
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium",
                  "transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  {isActive && (
                    <span
                      className="absolute inset-x-3 -bottom-3.25 h-0.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {isPending ? (
            <div className="flex items-center gap-2">
              <span className="hidden h-9 w-24 animate-pulse rounded-full bg-muted sm:block" />
              <span className="size-9 animate-pulse rounded-full bg-muted" />
            </div>
          ) : user ? (
            <>
              {role === "customer" && (
                <Button
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  aria-label={
                    cartItemCount > 0
                      ? `View cart, ${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`
                      : "View cart"
                  }
                  className="relative rounded-full text-muted-foreground hover:bg-accent hover:text-primary"
                  render={<Link to="/cart" onClick={closeMenu} />}
                >
                  <ShoppingCart className="size-4.5" aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Button>
              )}

              <Link
                to={getDashboardPath(role)}
                onClick={closeMenu}
                title={user.name ?? "Account"}
                className="group hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 transition-all hover:border-primary/30 hover:bg-accent/50 sm:flex"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </span>

                <span className="hidden max-w-32 text-left lg:block">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {user.name ?? "My account"}
                  </span>

                  <span className="block truncate text-[10px] text-muted-foreground">
                    {formatRole(role)}
                  </span>
                </span>
              </Link>

              <LogoutConfirmDialog />
            </>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                aria-label="Open login"
                className="rounded-full text-muted-foreground hover:bg-accent hover:text-primary lg:hidden"
                render={<Link to="/login" />}
              >
                <UserRound className="size-4.5" aria-hidden="true" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                nativeButton={false}
                className="hidden h-10 rounded-full px-5 text-muted-foreground hover:bg-accent hover:text-primary lg:inline-flex"
                render={<Link to="/login" />}
              >
                Log in
              </Button>

              <Button
                size="lg"
                nativeButton={false}
                className="group h-10 rounded-full px-5 shadow-sm shadow-primary/15 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20"
                render={<Link to="/sign-up" />}
              >
                Get started
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:bg-accent hover:text-primary md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 right-0 top-full border-b border-border bg-background/98 px-4 py-4 shadow-lg backdrop-blur-xl md:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {user && !isPending && (
              <Link
                to={getDashboardPath(role)}
                onClick={closeMenu}
                className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-accent/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {user.name ?? "My account"}
                  </span>

                  <span className="block truncate text-xs text-muted-foreground">
                    {formatRole(role)}
                  </span>
                </span>

                <LayoutDashboard
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            )}

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-xl px-3.5 py-3",
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>

                    {isActive && (
                      <span
                        className="size-1.5 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {role === "customer" && (
              <NavLink
                to="/cart"
                onClick={closeMenu}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-xl px-3.5 py-3",
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <span>Cart</span>
                <span className="inline-flex items-center gap-2">
                  {cartItemCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                  <ShoppingCart className="size-4" aria-hidden="true" />
                </span>
              </NavLink>
            )}

            {!user && !isPending && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="h-11 rounded-full bg-background"
                  render={<Link to="/login" onClick={closeMenu} />}
                >
                  Log in
                </Button>

                <Button
                  nativeButton={false}
                  className="group h-11 rounded-full"
                  render={<Link to="/sign-up" onClick={closeMenu} />}
                >
                  Get started
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
