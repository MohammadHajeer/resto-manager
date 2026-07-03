import { Outlet } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 min-h-[calc(100vh-4rem)] flex flex-col">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
