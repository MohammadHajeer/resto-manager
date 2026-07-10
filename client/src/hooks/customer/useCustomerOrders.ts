import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { customerOrdersService } from "@/services/customer/customer.orders.service";

import type {
  CreateOrderInput,
  CustomerOrderHistoryParams,
} from "@/services/customer/customer.types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderInput) =>
      customerOrdersService.createOrder(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.orders.all,
      });

      toast.success("Order placed successfully");
    },

    onError: () => {
      toast.error("Failed to place order");
    },
  });
};

export const useCustomerCurrentOrders = () => {
  return useQuery({
    queryKey: queryKeys.customer.orders.current(),
    queryFn: customerOrdersService.getCurrentOrders,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useCustomerOrderHistory = (
  params?: CustomerOrderHistoryParams,
) => {
  return useQuery({
    queryKey: queryKeys.customer.orders.history(params),
    queryFn: () => customerOrdersService.getOrderHistory(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCustomerOrderById = (orderId: string | null) => {
  return useQuery({
    queryKey: queryKeys.customer.orders.detail(orderId ?? ""),
    queryFn: () => customerOrdersService.getOrderById(orderId!),
    enabled: Boolean(orderId),
  });
};
