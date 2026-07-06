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
