import { api } from "@/lib/axios";
import type { OwnerCategory } from "./owner.types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@restomanager/validators";

const endpoint = "/owner/categories";

export const ownerCategoriesService = {
  getOwnerCategories: async (): Promise<OwnerCategory[]> => {
    const response = await api.get(`${endpoint}`);

    return response.data.data;
  },

  createOwnerCategory: async (
    payload: CreateCategoryInput,
  ): Promise<OwnerCategory> => {
    const response = await api.post(`${endpoint}`, payload);

    return response.data.data;
  },

  updateOwnerCategory: async (
    categoryId: string,
    payload: UpdateCategoryInput,
  ): Promise<OwnerCategory> => {
    const response = await api.patch(`${endpoint}/${categoryId}`, payload);

    return response.data.data;
  },

  deleteOwnerCategory: async (categoryId: string): Promise<OwnerCategory> => {
    const response = await api.delete(`${endpoint}/${categoryId}`);

    return response.data.data;
  },

  restoreOwnerCategory: async (categoryId: string): Promise<OwnerCategory> => {
    const response = await api.patch(`${endpoint}/${categoryId}/restore`);

    return response.data.data;
  },
};
