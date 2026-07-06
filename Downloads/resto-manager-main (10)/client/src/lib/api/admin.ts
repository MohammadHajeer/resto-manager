import { api } from "@/lib/axios";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type RestaurantStatus = "pending" | "approved" | "rejected" | "suspended";

export interface AdminRestaurantOwner {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface AdminRestaurantListItem {
  _id: string;
  name: string;
  cuisineTypes: string[];
  status: RestaurantStatus;
  createdAt: string;
  owner: AdminRestaurantOwner | null;
}

export interface AdminRestaurantDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  cuisineTypes: string[];
  status: RestaurantStatus;
  logoUrl: string | null;
  bannerUrl: string | null;
  contact: { phone: string; email: string | null };
  address: {
    city: string;
    street: string;
    building: string;
    floor?: string;
    locationUrl?: string | null;
  };
  verification: {
    businessLicensePath: string;
    ownerIdDocumentPath: string;
    submittedAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
  };
  owner: AdminRestaurantOwner | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ---------------------------------------------------------------------------
// REQUESTS
// ---------------------------------------------------------------------------

/** GET /api/admin/restaurants — pass no status to get all, or a specific status to filter. */
export async function fetchAdminRestaurants(params?: {
  status?: RestaurantStatus | undefined;
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<
    ApiEnvelope<{ restaurants: AdminRestaurantListItem[]; pagination: Pagination }>
  >("/admin/restaurants", { params });

  return data.data;
}

/** GET /api/admin/restaurants/:id — full detail for the review page. */
export async function fetchAdminRestaurantById(restaurantId: string) {
  const { data } = await api.get<ApiEnvelope<AdminRestaurantDetail>>(
    `/admin/restaurants/${restaurantId}`,
  );

  return data.data;
}

/** PATCH /api/admin/restaurants/:id/review — approve or reject. */
export async function reviewAdminRestaurant(
  restaurantId: string,
  payload: { status: "approved" | "rejected"; rejectionReason?: string },
) {
  const { data } = await api.patch<ApiEnvelope<AdminRestaurantDetail>>(
    `/admin/restaurants/${restaurantId}/review`,
    payload,
  );

  return data.data;
}
