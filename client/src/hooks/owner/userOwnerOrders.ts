import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { ownerOrdersService } from "@/services/owner/owner.orders.service";

import type {
  KitchenStatus,
  OwnerKitchenOrder,
  OwnerKitchenOrdersResponse,
  OwnerOrderStatus,
} from "@/services/owner/owner.types";

export const useOwnerKitchenOrders = () => {
  return useQuery({
    queryKey: queryKeys.owner.orders.kitchen(),
    queryFn: ownerOrdersService.getKitchenOrders,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

const isKitchenStatus = (status: OwnerOrderStatus): status is KitchenStatus => {
  return status === "pending" || status === "preparing" || status === "ready";
};

const getNextStatus = (status: OwnerOrderStatus): OwnerOrderStatus | null => {
  if (status === "pending") return "preparing";
  if (status === "accepted") return "preparing";
  if (status === "preparing") return "ready";
  if (status === "ready") return "completed";

  return null;
};

const getNextActionLabel = (status: OwnerOrderStatus): string | null => {
  if (status === "pending") return "Start Preparing";
  if (status === "accepted") return "Start Preparing";
  if (status === "preparing") return "Mark as Ready";
  if (status === "ready") return "Complete Order";

  return null;
};

const buildCounts = (
  columns: Record<KitchenStatus, OwnerKitchenOrder[]>,
): OwnerKitchenOrdersResponse["counts"] => {
  return {
    pending: columns.pending.length,
    preparing: columns.preparing.length,
    ready: columns.ready.length,
    total:
      columns.pending.length + columns.preparing.length + columns.ready.length,
  };
};

type UpdateOrderStatusVariables = {
  orderId: string;
  status: OwnerOrderStatus;
};

export const useUpdateOwnerOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: UpdateOrderStatusVariables) =>
      ownerOrdersService.updateOrderStatus(orderId, { status }),

    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.owner.orders.kitchen(),
      });

      const previousData =
        queryClient.getQueryData<OwnerKitchenOrdersResponse>(
          queryKeys.owner.orders.kitchen(),
        );

      queryClient.setQueryData<OwnerKitchenOrdersResponse>(
        queryKeys.owner.orders.kitchen(),
        (oldData) => {
          if (!oldData) return oldData;

          let movedOrder: OwnerKitchenOrder | null = null;

          const nextColumns: Record<KitchenStatus, OwnerKitchenOrder[]> = {
            pending: [],
            preparing: [],
            ready: [],
          };

          for (const columnStatus of ["pending", "preparing", "ready"] as const) {
            nextColumns[columnStatus] = oldData.columns[columnStatus].filter(
              (order) => {
                if (order._id === orderId) {
                  movedOrder = order;
                  return false;
                }

                return true;
              },
            );
          }

          if (!movedOrder) return oldData;

          const updatedOrder: OwnerKitchenOrder = {
            ...movedOrder,
            status,
            nextStatus: getNextStatus(status),
            nextActionLabel: getNextActionLabel(status),
            updatedAt: new Date().toISOString(),
          };

          if (isKitchenStatus(status)) {
            nextColumns[status] = [...nextColumns[status], updatedOrder];
          }

          return {
            columns: nextColumns,
            counts: buildCounts(nextColumns),
          };
        },
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.owner.orders.kitchen(),
          context.previousData,
        );
      }

      toast.error("Could not update order status. The order was moved back.");
    },

    onSuccess: () => {
      toast.success("Order status updated");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.orders.kitchen(),
      });
    },
  });
};