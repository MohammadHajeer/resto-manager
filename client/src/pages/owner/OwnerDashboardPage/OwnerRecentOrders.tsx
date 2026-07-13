import { ArrowRight, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OwnerDashboardResponse } from "@/services/owner/owner.types";

import {
  formatMoney,
  formatOrderDate,
  orderStatusConfig,
} from "../../../components/owner/dashboard/dashboard-utils";

type OwnerRecentOrdersProps = {
  orders: OwnerDashboardResponse["recentOrders"];
};

export function OwnerRecentOrders({ orders }: OwnerRecentOrdersProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="grid-cols-[1fr_auto]">
        <div>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>The latest activity for your restaurant.</CardDescription>
        </div>
        <Button variant="ghost" render={<Link to="/owner/orders" />}>
          View all
          <ArrowRight aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ClipboardList className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-medium">No orders yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              New customer orders will appear here as soon as they are placed.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => {
              const status = orderStatusConfig[order.status];
              const orderContent = (
                <>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{order.orderCode}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.itemCount} {order.itemCount === 1 ? "item" : "items"} · {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full capitalize", status.badgeClassName)}
                  >
                    {status.label}
                  </Badge>
                  <p className="font-semibold tabular-nums text-foreground sm:min-w-24 sm:text-right">
                    {formatMoney(order.total)}
                  </p>
                </>
              );
              const rowClassName =
                "grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-5";
              const isInKitchen =
                order.status === "pending" ||
                order.status === "preparing" ||
                order.status === "ready";

              return isInKitchen ? (
                <Link
                  key={order.id}
                  to="/owner/orders"
                  className={cn(rowClassName, "transition-colors hover:bg-muted/20")}
                >
                  {orderContent}
                </Link>
              ) : (
                <div key={order.id} className={rowClassName}>
                  {orderContent}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
