import { ImageIcon, Pencil } from "lucide-react";

import type { OwnerMenuItem } from "@/services/owner/owner.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type MenuItemCardProps = {
  item: OwnerMenuItem;
  onEdit: () => void;
};

export function MenuItemCard({ item, onEdit }: MenuItemCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-6" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-bold text-foreground">
              {item.name}
            </h3>

            <span className="shrink-0 text-sm font-bold text-foreground">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {item.description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onEdit}
                className="size-8 rounded-full"
              >
                <Pencil className="size-4" />
              </Button>
            </div>

            <Badge
              variant={item.isAvailable ? "default" : "secondary"}
              className={item.isAvailable ? "rounded-full" : "rounded-full"}
            >
              {item.isAvailable ? "Available" : "Hidden"}
            </Badge>
          </div>
        </div>
      </div>
    </article>
  );
}
