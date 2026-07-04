import {
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import type { DashboardNavItem } from "@/components/layouts/DashboardLayout";

export const adminNavItems: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "Restaurants", href: "/admin/restaurants", icon: Store },
  { label: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
];

export const ownerNavItems: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "Restaurant Profile", href: "/owner/profile", icon: Store },
  { label: "Menu Management", href: "/owner/menu", icon: UtensilsCrossed },
  { label: "Orders", href: "/owner/orders", icon: ClipboardList },
  { label: "Settings", href: "/owner/settings", icon: Settings },
];
