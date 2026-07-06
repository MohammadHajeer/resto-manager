import type { PublicRestaurant } from "@/services/public/public.service";
import { ImageOff, MapPin, Store } from "lucide-react";
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

  return (
    <Link
      to={`/restaurants/${restaurant.slug}`}
      aria-label={`View ${restaurant.name}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {hasBanner ? (
          <img
            src={restaurant.bannerUrl ?? ""}
            alt={`${restaurant.name} banner`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setBannerError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <ImageOff className="size-8" aria-hidden="true" />
            <span className="text-xs font-medium">Banner not available</span>
          </div>
        )}

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
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-w-0 items-start gap-3">
          {hasLogo ? (
            <img
              src={restaurant.logoUrl ?? ""}
              alt={`${restaurant.name} logo`}
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="size-11 shrink-0 rounded-lg border border-border bg-background object-cover"
            />
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
              <Store className="size-5" aria-hidden="true" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {restaurant.name}
            </h2>

            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
              {restaurant.cuisineTypes.length > 0
                ? restaurant.cuisineTypes.join(" · ")
                : "Cuisine not specified"}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-1 text-sm leading-6 text-muted-foreground">
          {restaurant.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
          <MapPin
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <span className="truncate">
            {addressLabel || "Address not available"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {restaurant.cuisineTypes.slice(0, 3).map((cuisine) => (
            <span
              key={cuisine}
              className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
            >
              {formatCuisine(cuisine)}
            </span>
          ))}

          {restaurant.cuisineTypes.length > 3 && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              +{restaurant.cuisineTypes.length - 3} more
            </span>
          )}
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
