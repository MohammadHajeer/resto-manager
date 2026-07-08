import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateMenuItemFormInput,
  UpdateMenuItemFormInput,
} from "@/services/owner/owner.types";
import { ownerMenuItemsService } from "@/services/owner/owner.menuItems.service";
import { queryKeys } from "@/lib/queryKeys";

export const useOwnerMenuItems = () => {
  return useQuery({
    queryKey: queryKeys.owner.menuItems.lists(),
    queryFn: ownerMenuItemsService.getMyMenuItems,
  });
};

export const useOwnerMenuItemById = (menuItemId: string | null) => {
  return useQuery({
    queryKey: queryKeys.owner.menuItems.detail(menuItemId ?? ""),
    queryFn: () => ownerMenuItemsService.getMyMenuItemById(menuItemId!),
    enabled: Boolean(menuItemId),
  });
};

export const useCreateOwnerMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMenuItemFormInput) =>
      ownerMenuItemsService.createMenuItem(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuItems.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuList.all,
      });
    },
  });
};

export const useUpdateOwnerMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      menuItemId,
      payload,
    }: {
      menuItemId: string;
      payload: UpdateMenuItemFormInput;
    }) => ownerMenuItemsService.updateMenuItem(menuItemId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuItems.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuList.all,
      });
    },
  });
};

export const useDeleteOwnerMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuItemId: string) =>
      ownerMenuItemsService.deleteMenuItem(menuItemId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuItems.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuList.all,
      });
    },
  });
};

export const useRestoreOwnerMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuItemId: string) =>
      ownerMenuItemsService.restoreMenuItem(menuItemId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuItems.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.menuList.all,
      });
    },
  });
};