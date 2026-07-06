import { api } from "@/lib/axios";
import type {
  AdminRestaurantDetails,
  PaginatedRestaurantReviewsResponse,
  RejectRestaurantInput,
} from "./admin.types";

const endpoint = "/admin/restaurants";

export const adminService = {
  getAdminRestaurants: async ({
    page = 1,
    limit = 10,
    status,
  }: GetQueryParams = {}): Promise<PaginatedRestaurantReviewsResponse> => {
    const response = await api.get(`${endpoint}`, {
      params: {
        page,
        limit,
        status,
      },
    });

    return {
      restaurants: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getRestaurantById: async (
    restaurantId: string,
  ): Promise<AdminRestaurantDetails> => {
    const response = await api.get(`${endpoint}/${restaurantId}`);
    return response.data.data;
  },

  approveRestaurant: async (
    restaurantId: string,
  ): Promise<AdminRestaurantDetails> => {
    const response = await api.patch(`${endpoint}/${restaurantId}/status`, {
      status: "approved",
    });

    return response.data.data;
  },

  rejectRestaurant: async ({
    restaurantId,
    rejectionReason,
  }: RejectRestaurantInput): Promise<AdminRestaurantDetails> => {
    const response = await api.patch(`${endpoint}/${restaurantId}/status`, {
      status: "rejected",
      rejectionReason,
    });

    return response.data.data;
  },
};
