import { useState } from "react";
import { ImageIcon } from "lucide-react";

import type { PublicMenuItem } from "@/services/public/public.types";

type MenuItemCardProps = {
  item: PublicMenuItem;
  onSelect: (item: PublicMenuItem) => void;
};

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasImage = Boolean(
    item.imageUrl && failedImageUrl !== item.imageUrl,
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      aria-label={`View details for ${item.name}`}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {hasImage ? (
          <img
            src={item.imageUrl ?? ""}
            alt={`Photo of ${item.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailedImageUrl(item.imageUrl)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-linear-to-br from-muted to-secondary/40 text-muted-foreground">
            <ImageIcon className="size-8" aria-hidden="true" />
            <span className="text-xs font-medium">Image not available</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full border border-border bg-card/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
          {item.categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {item.name}
          </h2>
          <span className="shrink-0 font-semibold text-primary">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
        <span
          className={`mt-4 w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
            item.isAvailable
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>
    </button>
  );
}
