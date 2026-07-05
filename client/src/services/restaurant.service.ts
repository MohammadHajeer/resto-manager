import { api } from "@/lib/axios";

export type PublicRestaurant = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  cuisineTypes: string[];
  isOpen: boolean;
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
};

export type MenuCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export type PublicMenuItem = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  ingredients: string[];
  availableAddons: Array<{
    name: string;
    price: number;
  }>;
  isAvailable: boolean;
  category: MenuCategory | null;
};

export type RestaurantMenuResponse = {
  restaurant: PublicRestaurant;
  categories: MenuCategory[];
  menuItems: PublicMenuItem[];
};

export const restaurantService = {
  getRestaurantMenu: async (
    restaurantSlug: string,
  ): Promise<RestaurantMenuResponse> => {
    const response = await api.get(
      `/restaurants/${encodeURIComponent(restaurantSlug)}/menu`,
    );
    return response.data.data;
  },
};
