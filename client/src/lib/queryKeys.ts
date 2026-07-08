import type { OwnerRestaurantMenuParams } from "@/services/owner/owner.types";

export const queryKeys = {
  owner: {
    restaurantStatus: ["owner", "restaurant-status"] as const,

    restaurant: ["owner", "restaurant"] as const,

    categories: ["owner", "categories"] as const,

    menuItems: {
      all: ["owner", "menu-items"] as const,

      lists: () => [...queryKeys.owner.menuItems.all, "list"] as const,

      detail: (menuItemId: string) =>
        [...queryKeys.owner.menuItems.all, "detail", menuItemId] as const,
    },

    menuList: {
      all: ["owner", "restaurant-menu"] as const,

      list: (params?: OwnerRestaurantMenuParams) =>
        [...queryKeys.owner.menuList.all, params ?? {}] as const,
    },
  },
  public: {
    restaurants: {
      all: ["public", "restaurants"] as const,

      list: (params: {
        page: number;
        limit: number;
        search?: string;
        city?: string[];
        cuisine?: string[];
        onlyOpen?: boolean;
      }) =>
        [
          "public",
          "restaurants",
          "list",
          {
            page: params.page,
            limit: params.limit,
            search: params.search ?? "",
            city: params.city ?? [],
            cuisine: params.cuisine ?? [],
            onlyOpen: params.onlyOpen ?? false,
          },
        ] as const,

      filterOptions: ["public", "restaurants", "filter-options"] as const,

      slug: (slug: string, category?: string | null) =>
        [
          "public",
          "restaurants",
          "slug",
          slug,
          {
            category: category ?? "all",
          },
        ] as const,
    },
  },
  admin: {
    restaurants: {
      all: ["admin", "restaurants"] as const,
      list: (params: { page: number; limit: number; status?: string }) =>
        ["admin", "restaurants", "list", params] as const,
      detail: (restaurantId: string) =>
        ["admin", "restaurants", restaurantId] as const,
    },
  },
};
