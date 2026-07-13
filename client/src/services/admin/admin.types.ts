export type RestaurantReview = {
  _id: string;
  name: string;
  status: AdminRestaurantStatus;
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

export type PaginatedRestaurantReviewsResponse = {
  restaurants: RestaurantReview[];
  pagination: PaginationMeta;
};

export type RejectRestaurantInput = {
  restaurantId: string;
  rejectionReason: string;
};

export type AdminDashboardPeriod = 7 | 30;
export type AdminRestaurantStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";
export type AdminOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type AdminDashboardResponse = {
  statistics: {
    totalRestaurants: number;
    pendingRestaurants: number;
    approvedRestaurants: number;
    rejectedRestaurants: number;
    suspendedRestaurants: number;
    totalCustomers: number;
    totalOrders: number;
    activeOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  period: AdminDashboardPeriod;
  restaurantsByStatus: Array<{
    status: AdminRestaurantStatus;
    count: number;
  }>;
  ordersByStatus: Array<{
    status: AdminOrderStatus;
    count: number;
  }>;
  ordersByDate: Array<{ date: string; orders: number }>;
  pendingRestaurants: Array<{
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    cuisineTypes: string[];
    city: string;
    ownerName?: string;
    createdAt: string;
  }>;
  recentOrders: Array<{
    id: string;
    orderCode: string;
    restaurantName: string;
    itemCount: number;
    total: number;
    status: AdminOrderStatus;
    createdAt: string;
  }>;
};
