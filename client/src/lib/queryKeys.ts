export const queryKeys = {
  admin: {
    restaurants: {
      all: ["admin", "restaurants"] as const,
      pending: (page: number, limit: number) =>
        ["admin", "restaurants", "pending", page, limit] as const,
      detail: (restaurantId: string) =>
        ["admin", "restaurants", restaurantId] as const,
    },
  },
};
