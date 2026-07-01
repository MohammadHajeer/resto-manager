import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-[#F8FAF9] text-[#0F172A]">
      <aside className="w-64 border-r border-[#E2E8F0] bg-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight text-[#0F172A]">
              Admin Control
            </Link>
          </div>
          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Dashboard</Link>
            <Link to="/admin/restaurants" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Restaurants</Link>
            <Link to="/admin/approvals" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Approvals</Link>
            <Link to="/admin/users" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Users</Link>
            <Link to="/admin/orders" className="block px-3 py-2 rounded-md hover:bg-[#F1F5F9] font-medium text-sm">Orders</Link>
          </nav>
        </div>
        <div className="pt-4 border-t border-[#E2E8F0]">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">View Public Site</Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-[#E2E8F0] bg-white px-8 flex items-center justify-between">
          <span className="font-semibold text-sm">System Administration</span>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
