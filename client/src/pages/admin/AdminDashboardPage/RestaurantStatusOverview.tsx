import { Cell, Pie, PieChart } from "recharts";
import { Link } from "react-router-dom";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminDashboardResponse } from "@/services/admin/admin.types";

import {
  formatCount,
  restaurantStatusConfig,
} from "./dashboard-utils";

const chartConfig = Object.fromEntries(
  Object.entries(restaurantStatusConfig).map(([status, config]) => [
    status,
    { label: config.label, color: config.color },
  ]),
) as ChartConfig;

export function RestaurantStatusOverview({
  data,
}: {
  data: AdminDashboardResponse["restaurantsByStatus"];
}) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);
  const chartData = data.map((entry) => ({
    ...entry,
    fill: `var(--color-${entry.status})`,
  }));

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Restaurant status</CardTitle>
        <CardDescription>Registration state across the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-44 items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
            Status distribution will appear after the first registration.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-44 w-full min-w-0 aspect-auto">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <text x="50%" y="48%" textAnchor="middle" className="fill-foreground text-xl font-semibold">
                {formatCount(total)}
              </text>
              <text x="50%" y="59%" textAnchor="middle" className="fill-muted-foreground text-[10px]">
                restaurants
              </text>
            </PieChart>
          </ChartContainer>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          {data.map((entry) => {
            const config = restaurantStatusConfig[entry.status];
            return (
              <Link
                key={entry.status}
                to={`/admin/restaurants?status=${entry.status}`}
                className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {formatCount(entry.count)}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
