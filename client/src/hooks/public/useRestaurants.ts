import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public/public.service";
import { queryKeys } from "@/lib/queryKeys";

export const useRestaurantFilterOptions = () => {
  return useQuery({
    queryKey: queryKeys.public.restaurants.filterOptions,
    queryFn: publicService.getRestaurantFilterOptions,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePublicRestaurants = (params: {
  page: number;
  limit: number;
  search?: string;
  city?: string[];
  cuisine?: string[];
  onlyOpen?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.public.restaurants.list(params),
    queryFn: () => publicService.getRestaurants(params),
    placeholderData: keepPreviousData,
  });
};
