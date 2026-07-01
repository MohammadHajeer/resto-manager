import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#0F172A]">
      <Outlet />
    </div>
  );
}
