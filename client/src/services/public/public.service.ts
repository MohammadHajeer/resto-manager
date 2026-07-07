import { api } from "@/lib/axios";
import type {
  GetPublicRestaurantsParams,
  PublicRestaurantSlug,
  PublicRestaurantsResponse,
  RestaurantFilterOptionsResponse,
} from "./public.types";

const endpoint = "/restaurants";

export const publicService = {
  getRestaurantFilterOptions:
    async (): Promise<RestaurantFilterOptionsResponse> => {
      const response = await api.get(`${endpoint}/filter-options`);

      return response.data.data;
    },

  getRestaurants: async ({
    page = 1,
    limit = 12,
    search,
    city = [],
    cuisine = [],
    onlyOpen,
  }: GetPublicRestaurantsParams = {}): Promise<PublicRestaurantsResponse> => {
    const response = await api.get(`${endpoint}`, {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(city.length > 0 ? { city } : {}),
        ...(cuisine.length > 0 ? { cuisine } : {}),
        ...(onlyOpen ? { isOpen: true } : {}),
      },
    });

    return {
      restaurants: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getRestaurantBySlug: async (
    slug: string,
    category?: string | null,
  ): Promise<PublicRestaurantSlug> => {
    const response = await api.get(`${endpoint}/${slug}`, {
      params: {
        category: category ?? undefined,
      },
    });
    return response.data.data;
  },
};
