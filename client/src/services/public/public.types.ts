import type { OpeningHour } from "../owner/owner.types";

export type RestaurantFilterOption = {
  name: string;
  count: number;
};

export type RestaurantFilterOptionsResponse = {
  cities: RestaurantFilterOption[];
  cuisines: RestaurantFilterOption[];
};

export type PublicRestaurant = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  cuisineTypes: string[];
  status: "approved";
  isOpen: boolean;
  contact: {
    phone: string;
    email: string | null;
  };
  address: {
    city: string;
    street: string;
    building: string;
    floor?: string;
    locationUrl?: string | null;
  };
  openingHours: OpeningHour[];
  createdAt: string;
  updatedAt: string;
};

export type GetPublicRestaurantsParams = {
  page?: number;
  limit?: number;
  search?: string;
  city?: string[];
  cuisine?: string[];
  onlyOpen?: boolean;
};

export type PublicRestaurantsResponse = {
  restaurants: PublicRestaurant[];
  pagination: PaginationMeta;
};

export type PublicRestaurantCategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
};

export type PublicMenuAddon = {
  name: string;
  price: number;
};

export type PublicMenuItem = {
  _id: string;
  categoryName: string;

  name: string;
  slug: string;
  description: string;
  price: number;

  imageUrl: string | null;

  ingredients: string[];
  availableAddons: PublicMenuAddon[];

  isAvailable: boolean;
};

export type PublicRestaurantSlug = {
  restaurant: PublicRestaurant;

  categories: PublicRestaurantCategory[];

  menuItems: PublicMenuItem[];

  totalItems: number;
};
