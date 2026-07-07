import type { PublicRestaurant } from "@/services/public/public.types";
import { ImageIcon, Store } from "lucide-react";

export function RestaurantBrandingHeader({
  logoUrl,
  bannerUrl,
  name,
  slug,
  description,
  cuisineTypes,
}: PublicRestaurant) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm"
      aria-labelledby="restaurant-name"
    >
      <div className="relative aspect-16/7 min-h-40 w-full overflow-hidden border-b border-border bg-muted sm:aspect-16/6">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`${name} restaurant`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="size-9" aria-hidden="true" />
            <span className="text-sm font-medium">Banner coming soon</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <div className="px-4 pb-6 sm:px-6 sm:pb-7">
        <div className="relative -mt-10 mb-4 size-20 rounded-2xl border-4 border-card bg-card p-1 shadow-md sm:-mt-12 sm:size-24">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              referrerPolicy="no-referrer"
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Store className="size-8" aria-hidden="true" />
              <span className="sr-only">Logo coming soon</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1
                id="restaurant-name"
                className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                {name}
              </h1>
            </div>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              /{slug}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex max-w-lg flex-wrap gap-2 lg:justify-end">
            {cuisineTypes.map((cuisine) => (
              <span
                key={cuisine}
                className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
