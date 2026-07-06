import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

export const useAdminRestaurants = (
  page: number,
  limit: number,
  status?: string,
) => {
  return useQuery({
    queryKey: queryKeys.admin.restaurants.list({ page, limit, status }),
    queryFn: () => adminService.getAdminRestaurants({ page, limit, status }),
    placeholderData: keepPreviousData,
  });
};

export const useRestaurantById = (restaurantId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.restaurants.detail(restaurantId),
    queryFn: () => adminService.getRestaurantById(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useApproveRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.approveRestaurant,

    onSuccess: (updatedRestaurant) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.restaurants.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.restaurants.detail(updatedRestaurant._id),
      });
    },
  });
};

export const useRejectRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.rejectRestaurant,

    onSuccess: (updatedRestaurant) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.restaurants.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.restaurants.detail(updatedRestaurant._id),
      });
    },
  });
};
