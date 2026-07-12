import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Utensils,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { OwnerDashboardResponse } from "@/services/owner/owner.types";

import { formatCount, formatMoney } from "../../../components/owner/dashboard/dashboard-utils";

type OwnerDashboardStatsProps = {
  statistics: OwnerDashboardResponse["statistics"];
};

export function OwnerDashboardStats({
  statistics,
}: OwnerDashboardStatsProps) {
  const cards = [
    {
      label: "Total orders",
      value: formatCount(statistics.totalOrders),
      detail: `${formatCount(statistics.cancelledOrders)} cancelled`,
      icon: ClipboardList,
    },
    {
      label: "Active orders",
      value: formatCount(statistics.activeOrders),
      detail: `${formatCount(statistics.pendingOrders)} awaiting action`,
      icon: CircleAlert,
    },
    {
      label: "Completed orders",
      value: formatCount(statistics.completedOrders),
      detail: `${formatMoney(statistics.completedOrderValue)} completed order value`,
      icon: CheckCircle2,
    },
    {
      label: "Menu items",
      value: formatCount(statistics.totalMenuItems),
      detail: `${formatCount(statistics.availableMenuItems)} available · ${formatCount(statistics.totalCategories)} categories`,
      icon: Utensils,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard statistics">
      {cards.map(({ label, value, detail, icon: Icon }) => (
        <Card key={label} className="gap-4 py-5">
          <CardContent className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
              <p className="mt-2 truncate text-xs text-muted-foreground" title={detail}>
                {detail}
              </p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
