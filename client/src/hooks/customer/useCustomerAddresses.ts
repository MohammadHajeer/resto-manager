import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { customerAddressesService } from "@/services/customer/customer.addresses.service";

import type {
  CreateCustomerAddressInput,
  UpdateCustomerAddressInput,
} from "@/services/customer/customer.types";

export const useCustomerAddresses = () => {
  return useQuery({
    queryKey: queryKeys.customer.addresses.list(),
    queryFn: customerAddressesService.getMyAddresses,
  });
};

export const useCreateCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerAddressInput) =>
      customerAddressesService.createAddress(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses.all,
      });

      toast.success("Address added successfully");
    },

    onError: () => {
      toast.error("Failed to add address");
    },
  });
};

export const useUpdateCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      payload,
    }: {
      addressId: string;
      payload: UpdateCustomerAddressInput;
    }) => customerAddressesService.updateAddress(addressId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses.all,
      });

      toast.success("Address updated successfully");
    },

    onError: () => {
      toast.error("Failed to update address");
    },
  });
};

export const useSetDefaultCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      customerAddressesService.setDefaultAddress(addressId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses.all,
      });

      toast.success("Default address updated");
    },

    onError: () => {
      toast.error("Failed to update default address");
    },
  });
};

export const useDeleteCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      customerAddressesService.deleteAddress(addressId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses.all,
      });

      toast.success("Address deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete address");
    },
  });
};
