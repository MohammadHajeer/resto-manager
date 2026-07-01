import { Outlet, Link } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#0F172A]">
      <header className="border-b border-[#E2E8F0] bg-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#0F172A]">
            RestoManager
          </Link>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link to="/restaurants" className="hover:text-slate-600">Restaurants</Link>
            <Link to="/cart" className="hover:text-slate-600">Cart</Link>
            <Link to="/orders" className="hover:text-slate-600">Orders</Link>
            <Link to="/profile" className="hover:text-slate-600">Profile</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
