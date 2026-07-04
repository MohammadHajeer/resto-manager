export const queryKeys = {
  admin: {
    restaurants: {
      pending: (page: number, limit: number) =>
        ["admin", "restaurants", "pending", page, limit] as const,
      all: ["admin", "restaurants", "all"] as const,
      detail: (restaurantId: string) =>
        ["admin", "restaurants", restaurantId] as const,
    },
  },
};
