import {
  ClipboardList,
  LayoutDashboard,
  Store,
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
];
