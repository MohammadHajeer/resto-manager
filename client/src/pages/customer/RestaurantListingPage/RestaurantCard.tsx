import { Clock3, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import type { RestaurantListItem } from "./restaurants.data";

type RestaurantCardProps = {
  restaurant: RestaurantListItem;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${restaurant.slug}`}
      aria-label={`View ${restaurant.name}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={restaurant.bannerUrl}
          alt={`${restaurant.name} food`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${
              restaurant.isOpen
                ? "border-primary/20 bg-card/95 text-primary"
                : "border-border bg-card/95 text-muted-foreground"
            }`}
          >
            {restaurant.isOpen ? "Open now" : "Closed"}
          </span>
          {restaurant.featured && (
            <span className="rounded-full border border-primary/20 bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={restaurant.logoUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="size-10 shrink-0 rounded-md border border-border bg-background object-cover"
            />
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {restaurant.name}
              </h2>
              <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                {restaurant.cuisineTypes.join(" · ")}
              </p>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            <Star className="size-3.5 fill-current" aria-hidden="true" />
            {restaurant.rating}
          </span>
        </div>

        <p className="mt-4 line-clamp-1 text-sm leading-6 text-muted-foreground">
          {restaurant.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
          <MapPin
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate">{restaurant.location}</span>
        </div>

        {restaurant.offer && (
          <p className="mt-3 rounded-md bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
            {restaurant.offer}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs font-medium text-foreground/75">
          <span className="flex items-center gap-1.5">
            <Clock3
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            {restaurant.deliveryTime}
          </span>
          <span>{"$".repeat(restaurant.priceLevel)}</span>
          <span className={restaurant.deliveryFee === 0 ? "text-primary" : ""}>
            {restaurant.deliveryFee === 0
              ? "Free delivery"
              : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
          </span>
        </div>
      </div>
    </Link>
  );
}
