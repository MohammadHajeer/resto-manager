import { api } from "@/lib/axios";

import type {
  OwnerKitchenOrder,
  OwnerKitchenOrdersResponse,
  UpdateOwnerOrderStatusInput,
} from "./owner.types";

const endpoint = "/owner/orders";

export const ownerOrdersService = {
  getKitchenOrders: async (): Promise<OwnerKitchenOrdersResponse> => {
    const response = await api.get(`${endpoint}/kitchen`);

    return response.data.data;
  },

  updateOrderStatus: async (
    orderId: string,
    payload: UpdateOwnerOrderStatusInput,
  ): Promise<OwnerKitchenOrder> => {
    const response = await api.patch(`${endpoint}/${orderId}/status`, payload);

    return response.data.data;
  },
};
