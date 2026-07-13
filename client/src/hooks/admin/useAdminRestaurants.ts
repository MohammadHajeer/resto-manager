import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin/admin.service";

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

const invalidateRestaurantStatusQueries = (
  queryClient: QueryClient,
  restaurantId: string,
) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.admin.restaurants.all,
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.admin.restaurants.detail(restaurantId),
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboardAll });
  queryClient.invalidateQueries({
    queryKey: queryKeys.public.restaurants.all,
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.owner.restaurantStatus,
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.owner.restaurant });
};

export const useApproveRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.approveRestaurant,

    onSuccess: (updatedRestaurant) => {
      invalidateRestaurantStatusQueries(queryClient, updatedRestaurant._id);
    },
  });
};

export const useRejectRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.rejectRestaurant,

    onSuccess: (updatedRestaurant) => {
      invalidateRestaurantStatusQueries(queryClient, updatedRestaurant._id);
    },
  });
};

export const useSuspendRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.suspendRestaurant,
    onSuccess: (updatedRestaurant) => {
      invalidateRestaurantStatusQueries(queryClient, updatedRestaurant._id);
    },
  });
};

export const useReactivateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.reactivateRestaurant,
    onSuccess: (updatedRestaurant) => {
      invalidateRestaurantStatusQueries(queryClient, updatedRestaurant._id);
    },
  });
};
