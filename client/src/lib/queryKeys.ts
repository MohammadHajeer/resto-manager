export const queryKeys = {
  public: {
    restaurantMenu: (restaurantSlug: string) =>
      ["public", "restaurants", restaurantSlug, "menu"] as const,
  },
  admin: {
    restaurants: {
      all: ["admin", "restaurants"] as const,
      list: (params: {
        page: number;
        limit: number;
        status?: string;
      }) => ["admin", "restaurants", "list", params] as const,
      detail: (restaurantId: string) =>
        ["admin", "restaurants", restaurantId] as const,
    },
  },
};
