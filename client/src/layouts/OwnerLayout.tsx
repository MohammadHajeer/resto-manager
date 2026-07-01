import { Outlet, Link } from "react-router-dom";

export default function OwnerLayout() {
  return (
    <div className="min-h-screen flex bg-[#F8FAF9] text-[#0F172A]">
      <aside className="w-64 border-r border-[#E2E8F0] bg-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <Link to="/owner/dashboard" className="text-xl font-bold tracking-tight text-[#0F172A]">
              Owner Portal
            </Link>
          </div>
          <nav className="space-y-1">
            <Link to="/owner/dashboard" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Dashboard</Link>
            <Link to="/owner/profile" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Restaurant Profile</Link>
            <Link to="/owner/menu" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Menu Management</Link>
            <Link to="/owner/orders" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Orders</Link>
            <Link to="/owner/settings" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Settings</Link>
          </nav>
        </div>
        <div className="pt-4 border-t border-[#E2E8F0]">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">View Public Site</Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-[#E2E8F0] bg-white px-8 flex items-center justify-between">
          <span className="font-semibold text-sm">Owner Control Panel</span>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
