import { api } from "@/lib/axios";
import type {
  AdminRestaurantDetails,
  PaginatedRestaurantReviewsResponse,
  RejectRestaurantInput,
  RestaurantStatusUpdatePayload,
  SuspendRestaurantInput,
} from "./admin.types";

const endpoint = "/admin/restaurants";

const updateRestaurantStatus = async (
  restaurantId: string,
  payload: RestaurantStatusUpdatePayload,
): Promise<AdminRestaurantDetails> => {
  const response = await api.patch(
    `${endpoint}/${restaurantId}/status`,
    payload,
  );
  return response.data.data;
};

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
    return updateRestaurantStatus(restaurantId, {
      status: "approved",
    });
  },

  rejectRestaurant: async ({
    restaurantId,
    rejectionReason,
  }: RejectRestaurantInput): Promise<AdminRestaurantDetails> => {
    return updateRestaurantStatus(restaurantId, {
      status: "rejected",
      rejectionReason,
    });
  },

  suspendRestaurant: async ({
    restaurantId,
    suspensionReason,
  }: SuspendRestaurantInput): Promise<AdminRestaurantDetails> => {
    return updateRestaurantStatus(restaurantId, {
      status: "suspended",
      suspensionReason,
    });
  },

  reactivateRestaurant: async (
    restaurantId: string,
  ): Promise<AdminRestaurantDetails> => {
    return updateRestaurantStatus(restaurantId, { status: "approved" });
  },
};