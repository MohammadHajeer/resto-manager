import { api } from "@/lib/axios";
import type {
  CreateMenuItemFormInput,
  OwnerMenuItem,
  UpdateMenuItemFormInput,
} from "./owner.types";

const endpoint = "/owner/menu-items";

export const ownerMenuItemsService = {
  getMyMenuItems: async (): Promise<OwnerMenuItem[]> => {
    const response = await api.get(`${endpoint}`);

    return response.data.data;
  },

  getMyMenuItemById: async (menuItemId: string): Promise<OwnerMenuItem> => {
    const response = await api.get(`${endpoint}/${menuItemId}`);

    return response.data.data;
  },

  createMenuItem: async (
    payload: CreateMenuItemFormInput,
  ): Promise<OwnerMenuItem> => {
    const { imageFile, ...menuItemData } = payload;

    const formData = new FormData();

    formData.append("data", JSON.stringify(menuItemData));

    if (imageFile instanceof File) {
      formData.append("imageFile", imageFile);
    }

    const response = await api.post(`${endpoint}`, formData);

    return response.data.data;
  },

  updateMenuItem: async (
    menuItemId: string,
    payload: UpdateMenuItemFormInput,
  ): Promise<OwnerMenuItem> => {
    const { imageFile, ...menuItemData } = payload;

    const formData = new FormData();

    formData.append("data", JSON.stringify(menuItemData));

    if (imageFile instanceof File) {
      formData.append("imageFile", imageFile);
    }

    const response = await api.patch(`${endpoint}/${menuItemId}`, formData);

    return response.data.data;
  },

  deleteMenuItem: async (menuItemId: string): Promise<OwnerMenuItem> => {
    const response = await api.delete(`${endpoint}/${menuItemId}`);

    return response.data.data;
  },

  restoreMenuItem: async (menuItemId: string): Promise<OwnerMenuItem> => {
    const response = await api.patch(`${endpoint}/${menuItemId}/restore`);

    return response.data.data;
  },
};
