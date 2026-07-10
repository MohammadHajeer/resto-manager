import { useState } from "react";
import { ImageIcon, MapPin, ShoppingBag, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PublicRestaurant } from "@/services/public/public.types";

export function RestaurantBrandingHeader({
  logoUrl,
  bannerUrl,
  name,
  description,
  cuisineTypes,
  address,
  isOpen,
}: PublicRestaurant) {
  const [failedBannerUrl, setFailedBannerUrl] = useState<string | null>(null);
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);

  const hasBanner = Boolean(bannerUrl && failedBannerUrl !== bannerUrl);
  const hasLogo = Boolean(logoUrl && failedLogoUrl !== logoUrl);
  const addressLabel = [address?.street, address?.building, address?.city]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      aria-labelledby="restaurant-name"
      className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
    >
      <div className="relative h-48 overflow-hidden border-b border-border bg-muted sm:h-64 lg:h-72">
        {hasBanner ? (
          <img
            src={bannerUrl ?? ""}
            alt={`${name} restaurant banner`}
            referrerPolicy="no-referrer"
            onError={() => setFailedBannerUrl(bannerUrl)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-linear-to-br from-primary/15 via-secondary/60 to-muted text-muted-foreground">
            <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-background/75 text-primary shadow-sm">
              <ImageIcon className="size-6" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">Banner not available</span>
          </div>
        )}

        {hasBanner && (
          <div
            className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-black/10"
            aria-hidden="true"
          />
        )}

        <Badge
          variant="secondary"
          className="absolute right-3 top-3 h-auto gap-1.5 border border-white/40 bg-background/90 px-3 py-1.5 text-secondary-foreground shadow-sm backdrop-blur-md sm:right-5 sm:top-5"
        >
          <span
            className={`size-2 rounded-full ${isOpen ? "bg-primary" : "bg-muted-foreground"}`}
            aria-hidden="true"
          />
          {isOpen ? "Accepting orders" : "Not accepting orders"}
        </Badge>
      </div>

      <div className="px-4 pb-6 sm:px-7 sm:pb-8">
        <div className="relative -mt-12 mb-4 w-fit sm:-mt-15 sm:mb-5">
          <div className="size-24 rounded-2xl border-4 border-card bg-card p-1 shadow-lg sm:size-30">
            {hasLogo ? (
              <img
                src={logoUrl ?? ""}
                alt={`${name} logo`}
                referrerPolicy="no-referrer"
                onError={() => setFailedLogoUrl(logoUrl)}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-secondary text-primary">
                <Store className="size-9 sm:size-10" aria-hidden="true" />
                <span className="sr-only">Restaurant logo not available</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <h1
              id="restaurant-name"
              className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              {name}
            </h1>

            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {addressLabel && (
                <span className="inline-flex min-w-0 items-center gap-2">
                  <MapPin
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{addressLabel}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <ShoppingBag
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {isOpen ? "Orders are currently enabled" : "Orders are currently paused"}
              </span>
            </div>
          </div>

          {cuisineTypes.length > 0 && (
            <div
              className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end"
              aria-label="Cuisine types"
            >
              {cuisineTypes.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant="secondary"
                  className="h-auto border border-primary/10 px-3 py-1.5 font-medium"
                >
                  {formatCuisine(cuisine)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatCuisine(cuisine: string) {
  return cuisine
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
