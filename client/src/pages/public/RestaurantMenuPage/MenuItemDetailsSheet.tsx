import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ImageIcon,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type {
  PublicMenuAddon,
  PublicMenuItem,
} from "@/services/public/public.types";

type AddToCartPayload = {
  item: PublicMenuItem;
  quantity: number;
  selectedAddons: PublicMenuAddon[];
  removedIngredients: string[];
};

type MenuItemDetailsSheetProps = {
  item: PublicMenuItem | null;
  isRestaurantOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (payload: AddToCartPayload) => void;
};

type MenuItemDetailsContentProps = {
  item: PublicMenuItem;
  quantity: number;
  selectedAddonNames: string[];
  removedIngredients: string[];
  itemTotal: number;
  isRestaurantOpen: boolean;
  showCloseButton?: boolean;
  onClose: () => void;
  onToggleAddon: (addonName: string) => void;
  onToggleIngredient: (ingredientName: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
};

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

export function MenuItemDetailsSheet({
  item,
  isRestaurantOpen,
  onOpenChange,
  onAddToCart,
}: MenuItemDetailsSheetProps) {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddonNames, setSelectedAddonNames] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (!item) return;

    const animationFrame = requestAnimationFrame(() => {
      setQuantity(1);
      setSelectedAddonNames([]);
      setRemovedIngredients([]);
    });

    return () => cancelAnimationFrame(animationFrame);
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
  // Removed ingredients never affect the price — they are a preparation
  // instruction, not a discount (mirrors the server's pricing rule).
  const itemTotal = item ? (item.price + addonsTotal) * quantity : 0;
  const isOpen = item !== null;

  const handleAddToCart = () => {
    if (!item || !item.isAvailable || !isRestaurantOpen) return;

    onAddToCart({
      item,
      quantity,
      selectedAddons,
      removedIngredients,
    });
    onOpenChange(false);
  };

  const accessibleName = item?.name ?? "Menu item details";
  const sharedContent = item ? (
    <MenuItemDetailsContent
      item={item}
      quantity={quantity}
      selectedAddonNames={selectedAddonNames}
      removedIngredients={removedIngredients}
      itemTotal={itemTotal}
      isRestaurantOpen={isRestaurantOpen}
      showCloseButton={!isDesktop}
      onClose={() => onOpenChange(false)}
      onToggleAddon={(addonName) => {
        if (!isRestaurantOpen || !item.isAvailable) return;

        setSelectedAddonNames((current) =>
          current.includes(addonName)
            ? current.filter((name) => name !== addonName)
            : [...current, addonName],
        );
      }}
      onToggleIngredient={(ingredientName) => {
        if (!isRestaurantOpen || !item.isAvailable) return;

        setRemovedIngredients((current) =>
          current.includes(ingredientName)
            ? current.filter((name) => name !== ingredientName)
            : [...current, ingredientName],
        );
      }}
      onQuantityChange={(nextQuantity) => {
        if (!isRestaurantOpen || !item.isAvailable) return;
        setQuantity(nextQuantity);
      }}
      onAddToCart={handleAddToCart}
    />
  ) : null;

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="flex h-full w-full flex-col overflow-hidden p-0 sm:max-w-lg">
          <SheetTitle className="sr-only">{accessibleName}</SheetTitle>
          <SheetDescription className="sr-only">
            Customize this menu item and add it to your cart.
          </SheetDescription>
          {sharedContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent className="max-h-[calc(100dvh-0.75rem)] rounded-b-none border-x-0 border-b-0 [--drawer-inset:0px]">
        <DrawerTitle className="sr-only">{accessibleName}</DrawerTitle>
        <DrawerDescription className="sr-only">
          Customize this menu item and add it to your cart.
        </DrawerDescription>
        {sharedContent}
      </DrawerContent>
    </Drawer>
  );
}

function MenuItemDetailsContent({
  item,
  quantity,
  selectedAddonNames,
  removedIngredients,
  itemTotal,
  isRestaurantOpen,
  showCloseButton = false,
  onClose,
  onToggleAddon,
  onToggleIngredient,
  onQuantityChange,
  onAddToCart,
}: MenuItemDetailsContentProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasImage = Boolean(
    item.imageUrl && failedImageUrl !== item.imageUrl,
  );
  const canCustomize = isRestaurantOpen && item.isAvailable;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        data-menu-item-details-scroll-area
      >
        <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-muted md:aspect-16/10">
          {hasImage ? (
            <img
              src={item.imageUrl ?? ""}
              alt={`Photo of ${item.name}`}
              referrerPolicy="no-referrer"
              onError={() => setFailedImageUrl(item.imageUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-linear-to-br from-muted via-muted to-secondary/50 text-muted-foreground">
              <div className="rounded-2xl border border-border bg-background/85 p-4 shadow-sm">
                <ImageIcon className="size-9" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium">Image not available</span>
            </div>
          )}

          {showCloseButton && (
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full border border-white/40 bg-background/90 shadow-sm backdrop-blur"
              aria-label="Close item details"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}

          {!item.isAvailable && (
            <Badge
              variant="secondary"
              className="absolute bottom-3 left-3 h-auto gap-1.5 border border-border bg-background/95 px-3 py-1.5 text-muted-foreground shadow-sm"
            >
              <AlertCircle className="size-3.5" aria-hidden="true" />
              Currently unavailable
            </Badge>
          )}
        </div>

        <header className="border-b border-border px-4 py-5 text-left sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-4 md:pr-8">
            <div className="min-w-0">
              <Badge
                variant="secondary"
                className="h-auto border border-primary/10 px-2.5 py-1 text-xs font-semibold"
              >
                {item.categoryName}
              </Badge>
              <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                {item.name}
              </h2>
            </div>

            <p className="shrink-0 text-lg font-bold text-primary sm:text-xl">
              ${item.price.toFixed(2)}
            </p>
          </div>

          {item.description && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {item.description}
            </p>
          )}
        </header>

        <div className="space-y-7 px-4 py-6 sm:px-6">
          {!item.isAvailable && (
            <section
              className="flex gap-3 rounded-xl border border-border bg-muted/70 p-4"
              aria-label="Item availability"
            >
              <AlertCircle
                className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  This item is unavailable
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  It cannot be added to your cart right now.
                </p>
              </div>
            </section>
          )}

          {item.ingredients.length > 0 && (
            <section aria-labelledby={`ingredients-${item._id}`}>
              <div className="mb-3">
                <h3
                  id={`ingredients-${item._id}`}
                  className="font-heading text-base font-semibold text-foreground"
                >
                  What’s included
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {canCustomize
                    ? "Tap an ingredient to remove it from your order."
                    : "The standard ingredients in this item."}
                </p>
              </div>

              <ul className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient) => {
                  const isRemoved = removedIngredients.includes(ingredient);

                  return (
                    <li key={ingredient}>
                      <button
                        type="button"
                        onClick={() => onToggleIngredient(ingredient)}
                        disabled={!canCustomize}
                        aria-pressed={isRemoved}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isRemoved
                            ? "border-destructive/30 bg-destructive/10 text-destructive line-through"
                            : "border-border bg-muted/50 text-foreground hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                        }`}
                      >
                        {isRemoved && (
                          <X className="size-3" aria-hidden="true" />
                        )}
                        {ingredient}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {removedIngredients.length > 0 && (
                <p className="mt-2 text-xs font-medium text-destructive">
                  Removing: {removedIngredients.join(", ")}
                </p>
              )}
            </section>
          )}

          {item.availableAddons.length > 0 && (
            <section aria-labelledby={`addons-${item._id}`}>
              <div className="mb-3">
                <h3
                  id={`addons-${item._id}`}
                  className="font-heading text-base font-semibold text-foreground"
                >
                  Optional add-ons
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select any extras you would like to add.
                </p>
              </div>

              <div className="space-y-2">
                {item.availableAddons.map((addon) => {
                  const isSelected = selectedAddonNames.includes(addon.name);

                  return (
                    <button
                      key={addon.name}
                      type="button"
                      onClick={() => onToggleAddon(addon.name)}
                      disabled={!canCustomize}
                      aria-pressed={isSelected}
                      className={`flex min-h-12 w-full items-center justify-between gap-4 rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 sm:p-4 ${
                        isSelected
                          ? "border-primary bg-primary/8 shadow-sm"
                          : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-background"
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected && <Check className="size-3.5" />}
                        </span>
                        <span className="font-medium text-foreground">
                          {addon.name}
                        </span>
                      </span>

                      <span className="shrink-0 font-semibold text-primary">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section aria-labelledby={`quantity-${item._id}`}>
            <h3
              id={`quantity-${item._id}`}
              className="mb-3 font-heading text-base font-semibold text-foreground"
            >
              Quantity
            </h3>

            <div
              className="flex w-full items-center overflow-hidden rounded-xl border border-border bg-background"
              role="group"
              aria-label="Item quantity"
            >
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={!canCustomize || quantity === 1}
                className="flex h-12 flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>

              <output
                className="w-14 text-center text-base font-bold"
                aria-live="polite"
                aria-label={`Quantity: ${quantity}`}
              >
                {quantity}
              </output>

              <button
                type="button"
                onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
                disabled={!canCustomize || quantity === 99}
                className="flex h-12 flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <footer className="shrink-0 border-t border-border bg-background/95 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6">
        {!isRestaurantOpen ? (
          <div
            className="flex items-start gap-3 rounded-xl border border-border bg-muted/70 px-4 py-3.5 text-left"
            role="status"
          >
            <AlertCircle
              className="mt-0.5 size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-foreground">
                Restaurant currently closed
              </p>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                This restaurant is currently closed and is not accepting
                orders.
              </p>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={onAddToCart}
            disabled={!item.isAvailable}
            className="h-auto w-full justify-between rounded-xl px-5 py-3.5 text-base font-semibold shadow-sm"
          >
            <span className="inline-flex items-center gap-2">
              {item.isAvailable ? (
                <ShoppingCart className="size-5" aria-hidden="true" />
              ) : (
                <AlertCircle className="size-5" aria-hidden="true" />
              )}
              {item.isAvailable ? "Add to cart" : "Item unavailable"}
            </span>
            <span>${itemTotal.toFixed(2)}</span>
          </Button>
        )}
      </footer>
    </div>
  );
}
