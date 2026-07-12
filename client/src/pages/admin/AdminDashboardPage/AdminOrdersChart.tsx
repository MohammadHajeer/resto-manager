import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AdminDashboardPeriod,
  AdminDashboardResponse,
} from "@/services/admin/admin.types";

import { formatChartDate } from "./dashboard-utils";

const chartConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig;

type Props = {
  data: AdminDashboardResponse["ordersByDate"];
  period: AdminDashboardPeriod;
  onPeriodChange: (period: AdminDashboardPeriod) => void;
};

export function AdminOrdersChart({ data, period, onPeriodChange }: Props) {
  return (
    <Card className="min-w-0">
      <CardHeader className="grid-cols-[1fr_auto]">
        <div>
          <CardTitle>Orders over time</CardTitle>
          <CardDescription>Daily order count across the platform.</CardDescription>
        </div>
        <Select
          value={String(period)}
          onValueChange={(value) =>
            onPeriodChange(Number(value) as AdminDashboardPeriod)
          }
        >
          <SelectTrigger className="w-32" aria-label="Order chart period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full min-w-0 aspect-auto">
          <BarChart accessibilityLayer data={data} margin={{ left: -16, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={period === 30 ? 28 : 12}
              tickFormatter={(value: string) => formatChartDate(value, period)}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={38} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    formatChartDate(String(value), period)
                  }
                />
              }
            />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
