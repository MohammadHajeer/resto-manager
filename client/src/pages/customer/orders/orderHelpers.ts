import type {
  CustomerOrder,
  CustomerOrderRestaurant,
} from "@/services/customer/customer.types";

/**
 * `order.restaurantId` is populated ({_id, name, slug, logoUrl}) on reads
 * but is a plain id string on the create-order response. This normalizes
 * both shapes so pages never have to branch on it.
 */
export function getOrderRestaurant(
  order: CustomerOrder,
): CustomerOrderRestaurant | null {
  if (typeof order.restaurantId === "string") return null;

  return order.restaurantId;
}

export const orderCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const orderDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
