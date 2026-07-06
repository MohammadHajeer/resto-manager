import { NavLink, Link, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

// ── icons ──────────────────────────────────────────────────────────────────
const IconGrid = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconShield = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);
const IconStore = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/>
  </svg>
);
const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconSettings = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
  </svg>
);

// ── nav items ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/admin/dashboard",   label: "Dashboard",   icon: IconGrid,   end: true },
  { to: "/admin/approvals",   label: "Approvals",   icon: IconShield },
  { to: "/admin/restaurants", label: "Restaurants", icon: IconStore },
  { to: "/admin/users",       label: "Users",       icon: IconUsers },
];

export default function AdminLayout() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* ══════════════════════════════════════════════
          DARK SIDEBAR  — bg uses the foreground token
          (#0f172a) which is the dark navy in index.css
          ══════════════════════════════════════════════ */}
      <aside
        className="w-64 shrink-0 flex flex-col justify-between py-6"
        style={{ backgroundColor: "var(--foreground)" }}
      >
        <div>
          {/* ── LOGO ── */}
          <div className="px-6 mb-8">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              {/* Green rounded icon box */}
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">RestoManager</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* ── NAV ── */}
          <nav className="px-3 space-y-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-white/60 hover:text-white hover:bg-white/10",
                  ].join(" ")
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ── BOTTOM ── */}
        <div className="px-3 space-y-0.5">
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IconSettings />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════
          MAIN AREA
          ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <header className="h-16 shrink-0 bg-card border-b border-border px-6 flex items-center justify-between gap-4">

          {/* Search */}
          <div className="relative w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="search"
              placeholder="Search approvals..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-full outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground"
            />
          </div>

          {/* Right: bell + user */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <IconBell />
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground leading-none">{user?.name ?? "Admin"}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold select-none">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
