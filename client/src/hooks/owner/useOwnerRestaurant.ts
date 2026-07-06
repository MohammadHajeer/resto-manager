import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { ownerService } from "@/services/owner/owner.service";

export function useOwnerRestaurantStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.owner.restaurantStatus,
    queryFn: ownerService.getRestaurantStatus,
    enabled,
  });
}

export const useOwnerRestaurant = () => {
  return useQuery({
    queryKey: queryKeys.owner.restaurant,
    queryFn: ownerService.getOwnerRestaurant,
  });
};

export const useUpdateOwnerRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerService.updateOwnerRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.restaurant,
      });
    },
  });
};

export const useToggleRestaurantActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerService.toggleRestaurantActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.restaurant,
      });
    },
  });
};
