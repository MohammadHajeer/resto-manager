import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { ownerRestaurantService } from "@/services/owner/owner.restaurant.service";
import type { OwnerRestaurantMenuParams } from "@/services/owner/owner.types";

export const useOwnerRestaurantMenu = (params?: OwnerRestaurantMenuParams) => {
  return useQuery({
    queryKey: queryKeys.owner.menuList.list(params),
    queryFn: () => ownerRestaurantService.getOwnerRestaurantMenu(params),
    placeholderData: keepPreviousData,
  });
};

export function useOwnerRestaurantStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.owner.restaurantStatus,
    queryFn: ownerRestaurantService.getRestaurantStatus,
    enabled,
  });
}

export const useOwnerRestaurant = () => {
  return useQuery({
    queryKey: queryKeys.owner.restaurant,
    queryFn: ownerRestaurantService.getOwnerRestaurant,
  });
};

export const useUpdateOwnerRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerRestaurantService.updateOwnerRestaurant,
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
    mutationFn: ownerRestaurantService.toggleRestaurantActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.restaurant,
      });
    },
  });
};
