import { api } from "@/lib/axios";
import {
  type OwnerRestaurantDetails,
  type OwnerRestaurantMenu,
  type OwnerRestaurantMenuParams,
  type OwnerRestaurantStatusDetails,
  type UpdateRestaurantActivityPayload,
} from "./owner.types";
import type { UpdateOwnerRestaurantFormValues } from "@/pages/owner/RestaurantProfilePage/types";

const endpoint = "/owner/restaurant";

export const ownerRestaurantService = {
  getOwnerRestaurantMenu: async (
    params?: OwnerRestaurantMenuParams,
  ): Promise<OwnerRestaurantMenu> => {
    const response = await api.get(`${endpoint}/menu`, {
      params,
    });

    return response.data.data;
  },

  getRestaurantStatus: async (): Promise<OwnerRestaurantStatusDetails> => {
    const response = await api.get(`${endpoint}/status`);
    return response.data?.data;
  },

  getOwnerRestaurant: async (): Promise<OwnerRestaurantDetails> => {
    const response = await api.get(`${endpoint}`);
    return response.data?.data;
  },

  updateOwnerRestaurant: async (
    payload: UpdateOwnerRestaurantFormValues,
  ): Promise<OwnerRestaurantDetails> => {
    const { logoFile, bannerFile, ...restaurantData } = payload;

    const formData = new FormData();

    formData.append("data", JSON.stringify(restaurantData));

    if (logoFile instanceof File) {
      formData.append("logoFile", logoFile);
    }

    if (bannerFile instanceof File) {
      formData.append("bannerFile", bannerFile);
    }

    const response = await api.patch(endpoint, formData);

    return response.data?.data;
  },

  toggleRestaurantActivity: async (
    payload: UpdateRestaurantActivityPayload,
  ): Promise<OwnerRestaurantDetails> => {
    const response = await api.patch(`${endpoint}/open-status`, payload);
    return response.data?.data;
  },
};
