import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "@restomanager/validators";

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

export type OwnerCategory = {
  _id: string;
  name: string;
  description?: string;
  restaurantId: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateMenuItemFormInput = Omit<CreateMenuItemInput, "imageUrl"> & {
  imageFile?: File | null;
  imageUrl?: string | null;
};

export type UpdateMenuItemFormInput = Partial<
  Omit<UpdateMenuItemInput, "imageUrl">
> & {
  imageFile?: File | null;
  imageUrl?: string | null;
};

export type OwnerMenuStatusFilter = "all" | "available" | "out-of-stock";

export type OwnerMenuAddon = {
  name: string;
  price: number;
};

export type OwnerMenuItem = {
  _id: string;
  restaurantId: string;
  categoryId: string;

  name: string;
  slug: string;
  description: string;
  price: number;

  imageUrl: string | null;

  ingredients: string[];
  availableAddons: OwnerMenuAddon[];

  isAvailable: boolean;
  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type OwnerCategorySection = {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
};

export type OwnerMenuSection = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;

  itemCount: number;
  items: OwnerMenuItem[];

  createdAt: string;
  updatedAt: string;
};

export type OwnerRestaurantMenuStats = {
  totalItems: number;
  activeItems: number;
  outOfStockItems: number;
};

export type OwnerRestaurantMenu = {
  stats: OwnerRestaurantMenuStats;
  sections: OwnerMenuSection[];
};

export type OwnerRestaurantMenuParams = {
  search?: string;
  status?: OwnerMenuStatusFilter;
};
