import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ownerCategoriesService } from "@/services/owner/owner.categories.service";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@restomanager/validators";
import { queryKeys } from "@/lib/queryKeys";

export const useOwnerCategories = () => {
  return useQuery({
    queryKey: queryKeys.owner.categories,
    queryFn: ownerCategoriesService.getOwnerCategories,
  });
};

export const useCreateOwnerCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryInput) =>
      ownerCategoriesService.createOwnerCategory(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.categories,
      });
    },
  });
};

export const useUpdateOwnerCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: UpdateCategoryInput;
    }) => ownerCategoriesService.updateOwnerCategory(categoryId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.categories,
      });
    },
  });
};

export const useDeleteOwnerCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      ownerCategoriesService.deleteOwnerCategory(categoryId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.categories,
      });
    },
  });
};

export const useRestoreOwnerCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      ownerCategoriesService.restoreOwnerCategory(categoryId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.owner.categories,
      });
    },
  });
};
