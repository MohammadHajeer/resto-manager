import { useEffect, useMemo, useState } from "react";
import { Check, ImageIcon, Minus, Plus, ShoppingCart } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type {
  PublicMenuAddon,
  PublicMenuItem,
} from "@/services/public/public.types";

type AddToCartPayload = {
  item: PublicMenuItem;
  quantity: number;
  selectedAddons: PublicMenuAddon[];
};

type MenuItemDetailsSheetProps = {
  item: PublicMenuItem | null;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (payload: AddToCartPayload) => void;
};

export function MenuItemDetailsSheet({
  item,
  onOpenChange,
  onAddToCart,
}: MenuItemDetailsSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddonNames, setSelectedAddonNames] = useState<string[]>([]);

  useEffect(() => {
    if (item) {
      requestAnimationFrame(() => {
        setQuantity(1);
        setSelectedAddonNames([]);
      });
    }
  }, [item]);

  const selectedAddons = useMemo(() => {
    if (!item) return [];

    return item.availableAddons.filter((addon) =>
      selectedAddonNames.includes(addon.name),
    );
  }, [item, selectedAddonNames]);

  const addonsTotal = selectedAddons.reduce((total, addon) => {
    return total + addon.price;
  }, 0);

  const itemTotal = item ? (item.price + addonsTotal) * quantity : 0;

  const toggleAddon = (addonName: string) => {
    setSelectedAddonNames((current) => {
      if (current.includes(addonName)) {
        return current.filter((name) => name !== addonName);
      }

      return [...current, addonName];
    });
  };

  const handleAddToCart = () => {
    if (!item || !item.isAvailable) return;

    onAddToCart({
      item,
      quantity,
      selectedAddons,
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={item !== null} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col overflow-hidden p-0 sm:max-w-lg">
        {item && (
          <>
            <div className="overflow-y-auto">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted sm:aspect-16/10">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-muted/70 text-muted-foreground">
                    <div className="rounded-2xl bg-background p-4 shadow-sm">
                      <ImageIcon className="size-10" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">
                      Image coming soon
                    </span>
                  </div>
                )}
              </div>

              <SheetHeader className="border-b border-border px-6 py-5 text-left">
                <div className="flex items-start justify-between gap-5 pr-8">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {item.categoryName}
                    </span>

                    <SheetTitle className="mt-3 text-2xl font-bold leading-tight">
                      {item.name}
                    </SheetTitle>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-primary/10 px-3 py-2 text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <SheetDescription className="pt-2 text-base leading-7 text-muted-foreground">
                  {item.description}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-7 px-6 py-6">
                <section className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Availability
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.isAvailable
                          ? "This item is ready to order."
                          : "This item is currently unavailable."}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        item.isAvailable
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </section>

                {item.ingredients.length > 0 && (
                  <section>
                    <div className="mb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Ingredients
                      </h3>
                    </div>

                    <ul
                      className="flex flex-wrap gap-2"
                      aria-label="Ingredients"
                    >
                      {item.ingredients.map((ingredient) => (
                        <li
                          key={ingredient}
                          className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground"
                        >
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {item.availableAddons.length > 0 && (
                  <section>
                    <div className="mb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Add-ons
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Customize your item with extras.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {item.availableAddons.map((addon) => {
                        const isSelected = selectedAddonNames.includes(
                          addon.name,
                        );

                        return (
                          <button
                            key={addon.name}
                            type="button"
                            onClick={() => toggleAddon(addon.name)}
                            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex size-5 items-center justify-center rounded-full border ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/40"
                                }`}
                              >
                                {isSelected && (
                                  <Check
                                    className="size-3"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>

                              <span className="font-medium text-foreground">
                                {addon.name}
                              </span>
                            </div>

                            <span className="font-semibold text-primary">
                              +${addon.price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                <section>
                  <div className="mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      Quantity
                    </h3>
                  </div>

                  <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-background">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      className="flex flex-1 size-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" />
                    </button>

                    <span className="w-12 text-center text-base font-bold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.min(99, current + 1))
                      }
                      className="flex flex-1 size-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-auto border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart className="size-5" aria-hidden="true" />
                  {item.isAvailable ? "Add to cart" : "Unavailable"}
                </span>

                <span>${itemTotal.toFixed(2)}</span>
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
