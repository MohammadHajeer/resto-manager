export const ownerRestaurantStatuses = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

export type OwnerRestaurantStatus = (typeof ownerRestaurantStatuses)[number];

export type OwnerRestaurantStatusDetails = {
  restaurantId: string;
  name: string;
  slug: string;
  status: OwnerRestaurantStatus;
  rejectionReason: string | null;
  suspensionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OpeningHourDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHour = {
  day: OpeningHourDay;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type RestaurantContact = {
  phone: string;
  email?: string | null;
};

export type RestaurantAddress = {
  city: string;
  street: string;
  building: string;
  floor?: string | null;
  locationUrl?: string | null;
};

export type RestaurantVerification = {
  documents?: string[];
  submittedAt?: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
};

export type OwnerRestaurantDetails = {
  _id: string;
  ownerId: string;

  name: string;
  slug: string;
  description: string;

  logoUrl?: string | null;
  bannerUrl?: string | null;

  contact?: RestaurantContact | null;
  address?: RestaurantAddress | null;

  openingHours: OpeningHour[];
  cuisineTypes: string[];

  status: OwnerRestaurantStatus;
  isOpen: boolean;

  verification?: RestaurantVerification | null;

  createdAt: string;
  updatedAt: string;
};

export type UpdateRestaurantActivityPayload = {
  isOpen: boolean;
};
