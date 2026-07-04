import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Menu, UtensilsCrossed, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
};

type DashboardLayoutProps = {
  children?: ReactNode;
  title: string;
  subtitle?: string;
  navItems: DashboardNavItem[];
  userRole: "admin" | "restaurant_owner";
};

type DashboardSidebarProps = Pick<
  DashboardLayoutProps,
  "navItems" | "title" | "userRole"
> & {
  onNavigate?: () => void;
};

const roleLabels = {
  admin: "Administrator",
  restaurant_owner: "Restaurant owner",
} as const;

function DashboardSidebar({
  navItems,
  title,
  userRole,
  onNavigate,
}: DashboardSidebarProps) {
  const homeHref =
    userRole === "admin" ? "/admin/dashboard" : "/owner/dashboard";

  return (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="border-b border-border px-5 h-16 flex items-center">
        <Link
          to={homeHref}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold text-foreground">
              RestoManager
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {title}
            </span>
          </span>
        </Link>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
        aria-label={`${roleLabels[userRole]} navigation`}
      >
        <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">
          Workspace
        </p>
        {navItems.map(({ label, href, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "group flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")
            }
          >
            <Icon className="size-4.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4.5" aria-hidden="true" />
          View public site
        </Link>
      </div>
    </div>
  );
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  navItems,
  userRole,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const location = useLocation();
  const user = session?.user;
  const activeItem = navItems.find(({ href, end }) =>
    end
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(`${href}/`),
  );
  const pageTitle = activeItem?.label ?? title;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="hidden w-68 shrink-0 border-r border-border lg:block">
        <DashboardSidebar
          navItems={navItems}
          title={title}
          userRole={userRole}
        />
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/35 backdrop-blur-xs"
            aria-label="Close dashboard navigation"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside
            id="dashboard-mobile-sidebar"
            className="relative h-full w-[min(18rem,85vw)] border-r border-border shadow-xl"
          >
            <DashboardSidebar
              navItems={navItems}
              title={title}
              userRole={userRole}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              aria-label={
                mobileSidebarOpen ? "Close dashboard menu" : "Open dashboard menu"
              }
              aria-expanded={mobileSidebarOpen}
              aria-controls="dashboard-mobile-sidebar"
              onClick={() => setMobileSidebarOpen((open) => !open)}
            >
              {mobileSidebarOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </Button>

            <div className="min-w-0 py-3">
              <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                {pageTitle}
              </h1>
              {subtitle && (
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-right md:block">
              <p className="max-w-40 truncate text-sm font-medium text-foreground">
                {user?.name ?? roleLabels[userRole]}
              </p>
              <p className="text-xs text-muted-foreground">
                {roleLabels[userRole]}
              </p>
            </div>
            <div
              className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              title={user?.name ?? roleLabels[userRole]}
            >
              {user?.name?.[0]?.toUpperCase() ??
                (userRole === "admin" ? "A" : "O")}
            </div>
            <LogoutConfirmDialog />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
