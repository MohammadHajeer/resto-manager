

import { NavLink, Link, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";


const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: "/admin/dashboard",   label: "Dashboard",   end: true },
  { to: "/admin/restaurants", label: "Restaurants" },
  { to: "/admin/approvals",   label: "Approvals" },
  { to: "/admin/users",       label: "Users" },
  { to: "/admin/orders",      label: "Orders" },
];

export default function AdminLayout() {
  // Get logged-in user info for the top bar
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen flex bg-[#F8FAF9] text-[#0F172A]">

      <aside className="w-64 shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-6">

        {/* Top section: logo + nav links */}
        <div>
          <Link
            to="/admin/dashboard"
            className="block mb-8 text-xl font-bold tracking-tight text-[#0F172A]"
          >
            🍽 Admin Control
          </Link>

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
                      ? "bg-[#DCFCE7] text-[#16A34A] font-semibold" // active: green highlight
                      : "text-slate-600 hover:bg-[#F1F5F9] hover:text-slate-900",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: back to public site */}
        <div className="pt-4 border-t border-[#E2E8F0]">
          <Link
            to="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← View Public Site
          </Link>
        </div>
      </aside>

      {/* ================================================================
          MAIN AREA
          ================================================================ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 shrink-0 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between">
          <span className="font-semibold text-sm text-slate-700">System Administration</span>

          {/* Admin avatar — dark (slate-800) to visually differ from owner (green) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{user?.name ?? "Admin"}</span>
            <div
              className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold select-none"
              title={user?.name ?? "Admin"}
            >
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/*
            <Outlet /> renders the matched admin child route.
            Example: URL = /admin/approvals → <AdminApprovalsPage /> renders here.
          */}
          <Outlet />
        </main>
      </div>

    </div>
  );
}
