import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { ownerService } from "@/services/owner.service";

export function useOwnerRestaurantStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.owner.restaurantStatus,
    queryFn: ownerService.getRestaurantStatus,
    enabled,
  });
}
