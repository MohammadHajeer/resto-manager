export const queryKeys = {
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
