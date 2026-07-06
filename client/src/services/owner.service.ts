import { api } from "@/lib/axios";

export const ownerRestaurantStatuses = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

export type OwnerRestaurantStatus = (typeof ownerRestaurantStatuses)[number];

export type OwnerRestaurantStatusDetails = {
  restaurantId: string;
  name: string;
  slug: string;
  status: OwnerRestaurantStatus;
  rejectionReason: string | null;
  suspensionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export const ownerService = {
  getRestaurantStatus: async (): Promise<OwnerRestaurantStatusDetails> => {
    const response = await api.get("/owner/restaurant/status");
    return response.data?.data;
  },
};
