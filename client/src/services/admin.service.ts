import { api } from "@/lib/axios";

export type PendingRestaurant = {
  _id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;

  owner?: {
    id?: string;
    name?: string;
  };
};

export type PaginatedPendingRestaurantsResponse = {
  restaurants: PendingRestaurant[];
  pagination: PaginationMeta;
};

export const adminService = {
  getPendingRestaurants: async ({
    page = 1,
    limit = 10,
  }: GetPendingQueryParams = {}): Promise<PaginatedPendingRestaurantsResponse> => {
    const response = await api.get("/admin/restaurants/pending", {
      params: {
        page,
        limit,
      },
    });

    return {
      restaurants: response.data.data,
      pagination: response.data.pagination,
    };
  },
};
