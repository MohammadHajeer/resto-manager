import { ImageIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { MockMenuItem } from "./mockMenuData";

type MenuItemDetailsSheetProps = {
  item: MockMenuItem | null;
  onOpenChange: (open: boolean) => void;
};

export function MenuItemDetailsSheet({ item, onOpenChange }: MenuItemDetailsSheetProps) {
  return (
    <Sheet open={item !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {item && (
          <>
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-10" aria-hidden="true" />
                  <span className="text-sm font-medium">Image coming soon</span>
                </div>
              )}
            </div>

            <SheetHeader className="border-b border-border">
              <div className="flex items-start justify-between gap-4 pr-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category}</span>
                  <SheetTitle className="mt-1 text-xl">{item.name}</SheetTitle>
                </div>
                <span className="shrink-0 text-lg font-semibold text-primary">${item.price.toFixed(2)}</span>
              </div>
              <SheetDescription className="pt-2 leading-6">{item.description}</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Availability</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.isAvailable
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.isAvailable ? "Available now" : "Currently unavailable"}
                </span>
              </div>

              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ingredients</p>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Ingredients">
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient} className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
