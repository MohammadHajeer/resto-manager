import { api } from "@/lib/axios";

import type {
  CreateCustomerAddressInput,
  CustomerAddress,
  UpdateCustomerAddressInput,
} from "./customer.types";

const endpoint = "/customer/addresses";

export const customerAddressesService = {
  getMyAddresses: async (): Promise<CustomerAddress[]> => {
    const response = await api.get(endpoint);

    return response.data.data;
  },

  createAddress: async (
    payload: CreateCustomerAddressInput,
  ): Promise<CustomerAddress> => {
    const response = await api.post(endpoint, payload);

    return response.data.data;
  },

  updateAddress: async (
    addressId: string,
    payload: UpdateCustomerAddressInput,
  ): Promise<CustomerAddress> => {
    const response = await api.patch(`${endpoint}/${addressId}`, payload);

    return response.data.data;
  },

  setDefaultAddress: async (addressId: string): Promise<CustomerAddress> => {
    const response = await api.patch(`${endpoint}/${addressId}/default`);

    return response.data.data;
  },

  deleteAddress: async (addressId: string): Promise<CustomerAddress> => {
    const response = await api.delete(`${endpoint}/${addressId}`);

    return response.data.data;
  },
};
