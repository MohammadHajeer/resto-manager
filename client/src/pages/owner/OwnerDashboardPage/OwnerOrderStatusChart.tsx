import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OwnerDashboardResponse } from "@/services/owner/owner.types";

import { formatCount, orderStatusConfig } from "../../../components/owner/dashboard/dashboard-utils";

const chartConfig = Object.fromEntries(
  Object.entries(orderStatusConfig).map(([status, config]) => [
    status,
    { label: config.label, color: config.color },
  ]),
) as ChartConfig;

type OwnerOrderStatusChartProps = {
  data: OwnerDashboardResponse["ordersByStatus"];
};

export function OwnerOrderStatusChart({ data }: OwnerOrderStatusChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);
  const chartData = data.map((entry) => ({
    ...entry,
    fill: `var(--color-${entry.status})`,
  }));

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Order status</CardTitle>
        <CardDescription>Current distribution across all orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
            Status distribution will appear after the first order.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-72 w-full min-w-0 aspect-auto">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={2}
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="flex-wrap gap-x-3 gap-y-2"
              />
              <text x="50%" y="47%" textAnchor="middle" className="fill-foreground text-2xl font-semibold">
                {formatCount(total)}
              </text>
              <text x="50%" y="55%" textAnchor="middle" className="fill-muted-foreground text-xs">
                total orders
              </text>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
