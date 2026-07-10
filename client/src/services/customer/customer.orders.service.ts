import { api } from "@/lib/axios";

import type {
  CreateOrderInput,
  CustomerOrder,
  CustomerOrderHistoryParams,
  CustomerOrderHistoryResponse,
} from "./customer.types";

const endpoint = "/customer/orders";

export const customerOrdersService = {
  createOrder: async (payload: CreateOrderInput): Promise<CustomerOrder> => {
    const response = await api.post(endpoint, payload);

    return response.data.data;
  },

  getCurrentOrders: async (): Promise<CustomerOrder[]> => {
    const response = await api.get(`${endpoint}/current`);

    return response.data.data;
  },

  getOrderHistory: async (
    params?: CustomerOrderHistoryParams,
  ): Promise<CustomerOrderHistoryResponse> => {
    const response = await api.get(`${endpoint}/history`, {
      params,
    });

    return response.data.data;
  },

  getOrderById: async (orderId: string): Promise<CustomerOrder> => {
    const response = await api.get(`${endpoint}/${orderId}`);

    return response.data.data;
  },
};
