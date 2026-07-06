import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, ExternalLink, LogOut, Menu, Settings, UtensilsCrossed, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

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

type SidebarProps = Pick<DashboardLayoutProps, "navItems" | "title" | "userRole"> & {
  onNavigate?: () => void;
};

const roleLabels = {
  admin: "Administrator",
  restaurant_owner: "Restaurant owner",
} as const;

// ── Search icon ────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg className="size-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function DashboardSidebar({ navItems, title, userRole, onNavigate }: SidebarProps) {
  const homeHref = userRole === "admin" ? "/admin/dashboard" : "/owner/dashboard";

  async function handleLogout() {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  }

  return (
    // Dark sidebar — uses --foreground (#0f172a) as background
    <div className="flex h-full flex-col text-white" style={{ backgroundColor: "var(--foreground)" }}>

      {/* ── Logo ── */}
      <div className="flex h-16 shrink-0 items-center border-b px-5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <Link to={homeHref} onClick={onNavigate} className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-white leading-none">RestoManager</span>
            <span className="mt-0.5 block truncate text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {title}
            </span>
          </span>
        </Link>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label={`${roleLabels[userRole]} navigation`}>
        {navItems.map(({ label, href, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors mb-0.5",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-white/10",
              ].join(" ")
            }
            style={({ isActive }) => isActive ? {} : { color: "rgba(255,255,255,0.65)" }}
          >
            <Icon className="size-4.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: settings + logout ── */}
      <div className="shrink-0 px-3 pb-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Link
          to={userRole === "admin" ? "/admin/settings" : "/owner/settings"}
          onClick={onNavigate}
          className="flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors mb-0.5"
          style={{ color: "rgba(255,255,255,0.65)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
        >
          <Settings className="size-4.5 shrink-0" aria-hidden="true" />
          <span>Settings</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-left"
          style={{ color: "rgba(255,255,255,0.65)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
        >
          <LogOut className="size-4.5 shrink-0" aria-hidden="true" />
          <span>Logout</span>
        </button>
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors mt-0.5"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          <span>View public site</span>
        </Link>
      </div>
    </div>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────
export function DashboardLayout({ children, title, subtitle, navItems, userRole }: DashboardLayoutProps) {
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

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <DashboardSidebar navItems={navItems} title={title} userRole={userRole} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative h-full w-[min(18rem,85vw)] shadow-xl">
            <DashboardSidebar
              navItems={navItems}
              title={title}
              userRole={userRole}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6 lg:px-8">

          {/* Mobile menu toggle + page title */}
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileSidebarOpen((o) => !o)}
            >
              {mobileSidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>

            {/* Search bar — shown on lg+ */}
            <div className="relative hidden w-64 lg:block">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="search"
                placeholder={`Search ${pageTitle.toLowerCase()}...`}
                className="h-9 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Right: bell + user info */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden="true" />
            </button>

            <div className="hidden text-right md:block">
              <p className="max-w-36 truncate text-sm font-semibold text-foreground leading-none">
                {user?.name ?? roleLabels[userRole]}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {roleLabels[userRole]}
              </p>
            </div>

            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground select-none"
              title={user?.name ?? roleLabels[userRole]}
            >
              {user?.name?.[0]?.toUpperCase() ?? (userRole === "admin" ? "A" : "O")}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
