import { useState } from "react";

import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import type { AdminDashboardPeriod } from "@/services/admin/admin.types";

import { AdminDashboardHeader } from "./AdminDashboardHeader";
import { AdminDashboardStats } from "./AdminDashboardStats";
import { AdminOrdersChart } from "./AdminOrdersChart";
import { AdminRecentOrders } from "./AdminRecentOrders";
import { OrderStatusOverview } from "./OrderStatusOverview";
import { PendingRestaurantReviews } from "./PendingRestaurantReviews";
import { RestaurantStatusOverview } from "./RestaurantStatusOverview";
import {
  AdminDashboardErrorState,
  AdminDashboardSkeleton,
} from "./AdminDashboardStates";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<AdminDashboardPeriod>(7);
  const { data, isLoading, isError, isFetching, refetch } =
    useAdminDashboard(period);

  if (isLoading) return <AdminDashboardSkeleton />;

  if (isError || !data) {
    return (
      <AdminDashboardErrorState
        isRetrying={isFetching}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <main className="space-y-6">
      <AdminDashboardHeader
        pendingCount={data.statistics.pendingRestaurants}
        isRefreshing={isFetching}
        onRefresh={() => void refetch()}
      />

      <AdminDashboardStats statistics={data.statistics} />

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,1fr)]">
        <AdminOrdersChart
          data={data.ordersByDate}
          period={period}
          onPeriodChange={setPeriod}
        />
        <RestaurantStatusOverview data={data.restaurantsByStatus} />
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,1fr)]">
        <PendingRestaurantReviews restaurants={data.pendingRestaurants} />
        <OrderStatusOverview data={data.ordersByStatus} />
      </section>

      <AdminRecentOrders orders={data.recentOrders} />
    </main>
  );
}
