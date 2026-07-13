import type { PublicRestaurant } from "@/services/public/public.types";
import { ArrowUpRight, ImageOff, MapPin, Store } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type RestaurantCardProps = {
  restaurant: PublicRestaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const hasBanner = Boolean(restaurant.bannerUrl) && !bannerError;
  const hasLogo = Boolean(restaurant.logoUrl) && !logoError;

  const addressLabel = [
    restaurant.address?.street,
    restaurant.address?.building,
    restaurant.address?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const visibleCuisines = restaurant.cuisineTypes.slice(0, 3);
  const remainingCuisines =
    restaurant.cuisineTypes.length - visibleCuisines.length;

  return (
    <Link
      to={`/restaurants/${restaurant.slug}`}
      aria-label={`View ${restaurant.name}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      {/* Banner */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {hasBanner ? (
          <img
            src={restaurant.bannerUrl ?? ""}
            alt={`${restaurant.name} banner`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setBannerError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <ImageOff className="size-7" aria-hidden="true" />

            <span className="text-xs font-medium">
              Banner not available
            </span>
          </div>
        )}

        {/* Status */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-xs font-semibold ${
            restaurant.isOpen
              ? "border-primary/20 text-primary"
              : "border-border text-muted-foreground"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              restaurant.isOpen
                ? "bg-primary"
                : "bg-muted-foreground/60"
            }`}
            aria-hidden="true"
          />

          {restaurant.isOpen ? "Open now" : "Closed"}
        </span>
      </div>

      {/* Restaurant details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-w-0 items-start gap-3">
          {hasLogo ? (
            <img
              src={restaurant.logoUrl ?? ""}
              alt={`${restaurant.name} logo`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="size-12 shrink-0 rounded-xl border border-border bg-background object-cover"
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
              <Store className="size-5" aria-hidden="true" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {restaurant.name}
            </h2>

            <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
              {restaurant.cuisineTypes.length > 0
                ? restaurant.cuisineTypes
                    .map(formatCuisine)
                    .join(" · ")
                : "Cuisine not specified"}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {restaurant.description ||
            "Discover this restaurant and explore its menu."}
        </p>

        {/* Address */}
        <div className="mt-4 flex items-start gap-2 text-sm text-foreground/75">
          <MapPin
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <span className="line-clamp-2">
            {addressLabel || "Address not available"}
          </span>
        </div>

        {/* Cuisine tags */}
        {visibleCuisines.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            {visibleCuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
              >
                {formatCuisine(cuisine)}
              </span>
            ))}

            {remainingCuisines > 0 && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                +{remainingCuisines} more
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">
              View restaurant
            </span>

            <ArrowUpRight
              className="size-4 text-primary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatCuisine(cuisine: string) {
  return cuisine
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
