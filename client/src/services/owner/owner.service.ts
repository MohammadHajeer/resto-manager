import { api } from "@/lib/axios";
import {
  type OwnerRestaurantDetails,
  type OwnerRestaurantStatusDetails,
  type UpdateRestaurantActivityPayload,
} from "./owner.types";
import type { RestaurantProfileUpdateInput } from "@restomanager/validators";

const endpoint = "/owner/restaurant";

export const ownerService = {
  getRestaurantStatus: async (): Promise<OwnerRestaurantStatusDetails> => {
    const response = await api.get(`${endpoint}/status`);
    return response.data?.data;
  },

  getOwnerRestaurant: async (): Promise<OwnerRestaurantDetails> => {
    const response = await api.get(`${endpoint}`);
    return response.data?.data;
  },

  updateOwnerRestaurant: async (
    payload: RestaurantProfileUpdateInput,
  ): Promise<OwnerRestaurantDetails> => {
    const response = await api.patch(`${endpoint}`, payload);
    return response.data?.data;
  },

  toggleRestaurantActivity: async (
    payload: UpdateRestaurantActivityPayload,
  ): Promise<OwnerRestaurantDetails> => {
    const response = await api.patch(`${endpoint}/open-status`, payload);
    return response.data?.data;
  },
};
