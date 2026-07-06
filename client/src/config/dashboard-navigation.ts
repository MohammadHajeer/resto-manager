import {
  ClipboardList,
  LayoutDashboard,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import type { DashboardNavItem } from "@/components/layouts/DashboardLayout";

export const adminNavItems: DashboardNavItem[] = [
  { label: "Dashboard",    href: "/admin/dashboard",   icon: LayoutDashboard, end: true },
  { label: "Restaurants",  href: "/admin/restaurants",  icon: Store },
  { label: "Users",        href: "/admin/users",        icon: Users },
];

export const ownerNavItems: DashboardNavItem[] = [
  { label: "Overview",           href: "/owner/dashboard", icon: LayoutDashboard, end: true },
  { label: "Restaurant Profile", href: "/owner/profile",   icon: Store },
  { label: "Menu Management",    href: "/owner/menu",      icon: UtensilsCrossed },
  { label: "Orders",             href: "/owner/orders",    icon: ClipboardList },
];
