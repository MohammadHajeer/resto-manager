import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export const usePendingRestaurants = (page: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.admin.restaurants.pending(page, limit),
    queryFn: () => adminService.getPendingRestaurants({ page, limit }),
  });
};
