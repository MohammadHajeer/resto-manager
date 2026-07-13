import { ClipboardCheck, ShoppingBag, Store, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminDashboardResponse } from "@/services/admin/admin.types";

import { formatCount } from "./dashboard-utils";

export function AdminDashboardStats({
  statistics,
}: {
  statistics: AdminDashboardResponse["statistics"];
}) {
  const cards = [
    {
      label: "Total restaurants",
      value: statistics.totalRestaurants,
      detail: `${formatCount(statistics.approvedRestaurants)} approved · ${formatCount(statistics.suspendedRestaurants)} suspended`,
      icon: Store,
    },
    {
      label: "Pending reviews",
      value: statistics.pendingRestaurants,
      detail: "Restaurant applications awaiting action",
      icon: ClipboardCheck,
      href: "/admin/restaurants?status=pending",
      emphasized: statistics.pendingRestaurants > 0,
    },
    {
      label: "Total customers",
      value: statistics.totalCustomers,
      detail: "Customer accounts only",
      icon: Users,
    },
    {
      label: "Total orders",
      value: statistics.totalOrders,
      detail: `${formatCount(statistics.activeOrders)} active · ${formatCount(statistics.completedOrders)} completed`,
      icon: ShoppingBag,
    },
  ];

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Platform statistics"
    >
      {cards.map(({ label, value, detail, icon: Icon, href, emphasized }) => {
        const content = (
          <Card
            className={
              emphasized
                ? "h-full border-amber-300 bg-amber-50/60 shadow-sm"
                : "h-full"
            }
          >
            <CardContent className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                  {formatCount(value)}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {detail}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        );

        return href ? (
          <Link
            key={label}
            to={href}
            className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {content}
          </Link>
        ) : (
          <div key={label}>{content}</div>
        );
      })}
    </section>
  );
}
