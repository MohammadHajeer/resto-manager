import type { CustomerOrderHistoryParams } from "@/services/customer/customer.types";
import type {
  OwnerDashboardPeriod,
  OwnerRestaurantMenuParams,
} from "@/services/owner/owner.types";
import type { AdminDashboardPeriod } from "@/services/admin/admin.types";

export const queryKeys = {
  admin: {
    dashboardAll: ["admin", "dashboard"] as const,
    dashboard: (period: AdminDashboardPeriod) =>
      ["admin", "dashboard", { period }] as const,
    restaurants: {
      all: ["admin", "restaurants"] as const,
      list: (params: { page: number; limit: number; status?: string }) =>
        ["admin", "restaurants", "list", params] as const,
      detail: (restaurantId: string) =>
        ["admin", "restaurants", restaurantId] as const,
    },
  },
  owner: {
    dashboard: (period: OwnerDashboardPeriod) =>
      ["owner", "dashboard", { period }] as const,

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

    orders: {
      all: ["owner", "orders"] as const,

      kitchen: () => [...queryKeys.owner.orders.all, "kitchen"] as const,

      detail: (orderId: string) =>
        [...queryKeys.owner.orders.all, "detail", orderId] as const,
    },
  },
  customer: {
    orders: {
      all: ["customer", "orders"] as const,

      current: () => [...queryKeys.customer.orders.all, "current"] as const,

      history: (params?: CustomerOrderHistoryParams) =>
        [...queryKeys.customer.orders.all, "history", params ?? {}] as const,

      detail: (orderId: string) =>
        [...queryKeys.customer.orders.all, "detail", orderId] as const,
    },
    addresses: {
      all: ["customer", "addresses"] as const,

      list: () => [...queryKeys.customer.addresses.all, "list"] as const,

      detail: (addressId: string) =>
        [...queryKeys.customer.addresses.all, "detail", addressId] as const,
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
};
