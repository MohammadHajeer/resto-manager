import { api } from "@/lib/axios";

export type PendingRestaurant = {
  _id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;

  owner?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

export type AdminRestaurantDetails = {
  _id: string;

  ownerId: string;

  name: string;
  slug: string;
  description: string;

  logoUrl: string | null;
  bannerUrl: string | null;

  contact: {
    phone: string;
    email: string | null;
  };

  address: {
    city: string;
    street: string;
    building: string;
    floor: string;
    locationUrl: string | null;
  };

  cuisineTypes: string[];

  status: "pending" | "approved" | "rejected" | "suspended";

  isOpen: boolean;

  openingHours?: Array<{
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;

  verification: {
    businessLicensePath: string;
    ownerIdDocumentPath: string;
    businessLicenseSignedUrl: string | null;
    ownerIdDocumentSignedUrl: string | null;
    submittedAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
  };

  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
  } | null;

  createdAt: string;
  updatedAt: string;
};

export type PaginatedPendingRestaurantsResponse = {
  restaurants: PendingRestaurant[];
  pagination: PaginationMeta;
};

export type RejectRestaurantInput = {
  restaurantId: string;
  rejectionReason: string;
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
  getRestaurantById: async (
    restaurantId: string,
  ): Promise<AdminRestaurantDetails> => {
    const response = await api.get(`/admin/restaurants/${restaurantId}`);
    return response.data.data;
  },
  approveRestaurant: async (
    restaurantId: string,
  ): Promise<AdminRestaurantDetails> => {
    const response = await api.patch(
      `/admin/restaurants/${restaurantId}/status`,
      {
        status: "approved",
      },
    );

    return response.data.data;
  },

  rejectRestaurant: async ({
    restaurantId,
    rejectionReason,
  }: RejectRestaurantInput): Promise<AdminRestaurantDetails> => {
    const response = await api.patch(
      `/admin/restaurants/${restaurantId}/status`,
      {
        status: "rejected",
        rejectionReason,
      },
    );

    return response.data.data;
  },
};
