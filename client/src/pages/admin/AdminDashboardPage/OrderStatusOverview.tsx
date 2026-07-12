import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminDashboardResponse } from "@/services/admin/admin.types";

import { formatCount, orderStatusConfig } from "./dashboard-utils";

export function OrderStatusOverview({
  data,
}: {
  data: AdminDashboardResponse["ordersByStatus"];
}) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order status</CardTitle>
        <CardDescription>Current distribution across all orders.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {total === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
            Order statuses will appear after the first order.
          </div>
        ) : (
          data.map((entry) => {
            const config = orderStatusConfig[entry.status];
            const percentage = Math.round((entry.count / total) * 100);
            return (
              <div key={entry.status}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCount(entry.count)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
