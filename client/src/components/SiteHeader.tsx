import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import {
  getDashboardPath,
  normalizeRole,
  type UserRole,
} from "../auth/auth-types";
import { authClient } from "../lib/auth-client";
import { Button } from "./ui/button";

const roleLinks: Record<UserRole, Array<{ label: string; to: string }>> = {
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
    { label: "Approvals", to: "/admin/approvals" },
  ],
};

const guestLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "About", to: "/#about" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = normalizeRole(user?.role);
  const links = role ? roleLinks[role] : guestLinks;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-full  items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            to="/"
            className="shrink-0 text-xl font-semibold tracking-normal text-foreground"
          >
            <span className="text-primary">Resto</span>Manager
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="h-8 w-20 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              {role === "customer" && (
                <Button
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  aria-label="View cart"
                  render={<Link to="/cart" />}
                >
                  <ShoppingCart aria-hidden="true" />
                </Button>
              )}
              <Link
                to={getDashboardPath(role)}
                className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground sm:flex"
                title={user.name ?? "Account"}
              >
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                aria-label="Log out"
                onClick={() => authClient.signOut()}
              >
                <LogOut aria-hidden="true" />
              </Button>
            </>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open login"
                render={<Link to="/login" />}
              >
                <UserRound aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                nativeButton={false}
                className="hidden lg:inline-flex"
                render={<Link to="/login" />}
              >
                Log in
              </Button>
              <Button
                size="lg"
                nativeButton={false}
                className="h-9 rounded-full px-5"
                render={<Link to="/sign-up" />}
              >
                Get started
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 shadow-sm md:hidden">
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && !isPending && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="rounded-full"
                  render={<Link to="/login" onClick={closeMenu} />}
                >
                  Log in
                </Button>
                <Button
                  nativeButton={false}
                  className="rounded-full"
                  render={<Link to="/sign-up" onClick={closeMenu} />}
                >
                  Get started
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
