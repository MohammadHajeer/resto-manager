import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { ownerDashboardService } from "@/services/owner/owner.dashboard.service";
import type { OwnerDashboardPeriod } from "@/services/owner/owner.types";

export const useOwnerDashboard = (period: OwnerDashboardPeriod) => {
  return useQuery({
    queryKey: queryKeys.owner.dashboard(period),
    queryFn: () => ownerDashboardService.getDashboard(period),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
};
