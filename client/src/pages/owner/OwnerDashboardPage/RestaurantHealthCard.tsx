import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  MinusCircle,
  Store,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OwnerDashboardResponse } from "@/services/owner/owner.types";

import { formatCount } from "../../../components/owner/dashboard/dashboard-utils";

type RestaurantHealthCardProps = {
  data: OwnerDashboardResponse;
};

export function RestaurantHealthCard({ data }: RestaurantHealthCardProps) {
  const { restaurant, statistics, health } = data;
  const checks = [
    {
      label: "Restaurant availability",
      value: restaurant.isOpen ? "Open for orders" : "Currently closed",
      state: "neutral" as const,
      icon: Store,
    },
    {
      label: "Menu availability",
      value: `${formatCount(statistics.availableMenuItems)} available · ${formatCount(statistics.unavailableMenuItems)} unavailable`,
      state:
        statistics.totalMenuItems === 0 || statistics.availableMenuItems === 0
          ? ("attention" as const)
          : ("healthy" as const),
      icon: Utensils,
    },
    {
      label: "Category coverage",
      value:
        health.categoriesWithoutItems === 0
          ? "Every active category has items"
          : `${formatCount(health.categoriesWithoutItems)} active ${health.categoriesWithoutItems === 1 ? "category has" : "categories have"} no items`,
      state:
        health.categoriesWithoutItems > 0
          ? ("attention" as const)
          : ("healthy" as const),
      icon: CircleAlert,
    },
    {
      label: "Opening hours",
      value: health.hasCompleteOpeningHours
        ? "All seven days configured"
        : "Opening hours need attention",
      state: health.hasCompleteOpeningHours
        ? ("healthy" as const)
        : ("attention" as const),
      icon: Clock3,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant & menu health</CardTitle>
        <CardDescription>Configuration checks based on your current data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map(({ label, value, state, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-3.5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground shadow-sm">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{value}</p>
              </div>
              {state === "attention" ? (
                <CircleAlert className="size-4 shrink-0 text-destructive" aria-label="Needs attention" />
              ) : state === "neutral" ? (
                <MinusCircle className="size-4 shrink-0 text-muted-foreground" aria-label="Current status" />
              ) : (
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-label="Complete" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" render={<Link to="/owner/menu" />}>
            Manage menu
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="ghost" render={<Link to="/owner/profile" />}>
            Edit profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
