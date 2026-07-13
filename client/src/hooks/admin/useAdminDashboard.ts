import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { adminDashboardService } from "@/services/admin/admin.dashboard.service";
import type { AdminDashboardPeriod } from "@/services/admin/admin.types";

export const useAdminDashboard = (period: AdminDashboardPeriod) =>
  useQuery({
    queryKey: queryKeys.admin.dashboard(period),
    queryFn: () => adminDashboardService.getDashboard(period),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
