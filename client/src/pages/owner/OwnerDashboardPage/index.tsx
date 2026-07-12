import { useOwnerDashboard } from "@/hooks/owner/useOwnerDashboard";
import type { OwnerDashboardPeriod } from "@/services/owner/owner.types";
import { useState } from "react";
import {
  OwnerDashboardErrorState,
  OwnerDashboardSkeleton,
} from "./OwnerDashboardStates";
import { OwnerDashboardHeader } from "./OwnerDashboardHeader";
import { OwnerDashboardStats } from "./OwnerDashboardStats";
import { OwnerOrdersChart } from "./OwnerOrdersChart";
import { OwnerOrderStatusChart } from "./OwnerOrderStatusChart";
import { OwnerRecentOrders } from "./OwnerRecentOrders";
import { RestaurantHealthCard } from "./RestaurantHealthCard";

export default function OwnerDashboardPage() {
  const [period, setPeriod] = useState<OwnerDashboardPeriod>(7);
  const { data, isLoading, isError, isFetching, refetch } =
    useOwnerDashboard(period);

  if (isLoading) {
    return <OwnerDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <OwnerDashboardErrorState
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  return (
    <main className="space-y-6">
      <OwnerDashboardHeader
        restaurant={data.restaurant}
        isRefreshing={isFetching}
        onRefresh={() => void refetch()}
      />

      <OwnerDashboardStats statistics={data.statistics} />

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <OwnerOrdersChart
          data={data.ordersByDate}
          period={period}
          onPeriodChange={setPeriod}
        />
        <OwnerOrderStatusChart data={data.ordersByStatus} />
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <OwnerRecentOrders orders={data.recentOrders} />
        <RestaurantHealthCard data={data} />
      </section>
    </main>
  );
}
