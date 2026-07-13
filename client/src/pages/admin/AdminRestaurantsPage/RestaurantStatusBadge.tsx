import {
  restaurantStatusConfig,
  type RestaurantStatus,
} from "@/config/restaurant-status";

export default function RestaurantStatusBadge({
  status,
}: {
  status: RestaurantStatus;
}) {
  const style = restaurantStatusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.badgeClassName}`}
    >
      <span className={`size-1.5 rounded-full ${style.dotClassName}`} />
      {style.label}
    </span>
  );
}
