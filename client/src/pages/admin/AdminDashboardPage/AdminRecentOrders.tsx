import { ShoppingBag } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminDashboardResponse } from "@/services/admin/admin.types";

import {
  formatDateTime,
  formatMoney,
  OrderStatusBadge,
} from "./dashboard-utils";

export function AdminRecentOrders({
  orders,
}: {
  orders: AdminDashboardResponse["recentOrders"];
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Latest ordering activity across all restaurants.</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-medium text-foreground">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Recent platform orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Restaurant</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Order total</th>
                  <th className="pb-3 font-medium">Placed</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-mono text-xs font-medium text-foreground">{order.orderCode}</td>
                    <td className="py-3 font-medium text-foreground">{order.restaurantName}</td>
                    <td className="py-3 text-muted-foreground">{order.itemCount}</td>
                    <td className="py-3 font-medium tabular-nums text-foreground">{formatMoney(order.total)}</td>
                    <td className="py-3 text-muted-foreground">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3 text-right"><OrderStatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
