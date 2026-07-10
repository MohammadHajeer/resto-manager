import {
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  calculateCartSubtotal,
  useCartStore,
  type CartItem,
} from "@/stores/useCartStore";

/**
 * CartPage (RES-83)
 * -----------------
 * Reviews the customer's current cart before checkout:
 * - line items with add-ons, quantity controls (RES-85), and line totals (RES-87/88)
 * - order summary with subtotal (RES-86) and delivery fee
 * - clear-cart confirmation and empty state
 *
 * Pricing shown here is informational; the server recomputes all totals
 * from the database when the order is submitted.
 */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function CartItemRow({ item }: { item: CartItem }) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const unitPrice =
    item.basePrice +
    item.selectedAddons.reduce((total, addon) => total + addon.price, 0);

  return (
    <li className="flex gap-4 px-5 py-5 sm:px-6">
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {item.name}
            </p>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {currencyFormatter.format(unitPrice)} each
            </p>

            {item.selectedAddons.length > 0 && (
              <ul
                className="mt-2 flex flex-wrap gap-1.5"
                aria-label={`Add-ons for ${item.name}`}
              >
                {item.selectedAddons.map((addon) => (
                  <li
                    key={addon.name}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {addon.name} (+{currencyFormatter.format(addon.price)})
                  </li>
                ))}
              </ul>
            )}

            {item.removedIngredients.length > 0 && (
              <p className="mt-2 text-xs font-medium text-destructive">
                No {item.removedIngredients.join(", ")}
              </p>
            )}
          </div>

          <p className="shrink-0 text-base font-bold text-foreground">
            {currencyFormatter.format(item.itemTotal)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center overflow-hidden rounded-full border border-border bg-background">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.cartItemKey)}
              disabled={item.quantity <= 1}
              className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>

            <span
              className="w-10 text-center text-sm font-bold"
              aria-live="polite"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => increaseQuantity(item.cartItemKey)}
              disabled={item.quantity >= 99}
              className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.cartItemKey)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyCartState() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <ShoppingCart className="size-8" aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-foreground">
        Your cart is empty
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Browse restaurants, customize your favorite dishes, and they will show
        up here, ready to order.
      </p>

      <Button
        nativeButton={false}
        size="lg"
        className="mt-6 rounded-full px-6"
        render={<Link to="/restaurants" />}
      >
        Browse restaurants
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const restaurantSlug = useCartStore((state) => state.restaurantSlug);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = calculateCartSubtotal(items);

  // Delivery fee is fixed to 0 in the MVP; the server applies the same rule
  // when creating the order (see orders customer controller).
  const deliveryFee = 0;
  const totalPrice = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyCartState />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {restaurantSlug && (
        <Link
          to={`/restaurants/${restaurantSlug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to menu
        </Link>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            My Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your items and proceed to checkout.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" className="w-fit text-muted-foreground" />
            }
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Clear cart
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes every item from your cart. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Keep items</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearCart}
                className="bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                Clear cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section
          className="overflow-hidden rounded-2xl border border-border bg-card"
          aria-label="Cart items"
        >
          {restaurantName && (
            <div className="border-b border-border bg-muted/40 px-5 py-3 sm:px-6">
              <p className="text-sm font-semibold text-foreground">
                Your items from{" "}
                <span className="text-primary">{restaurantName}</span>
              </p>
            </div>
          )}

          <ul className="divide-y divide-border">
            {items.map((item) => (
              <CartItemRow key={item.cartItemKey} item={item} />
            ))}
          </ul>
        </section>

        <aside
          className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-20"
          aria-label="Order summary"
        >
          <h2 className="text-lg font-semibold text-foreground">
            Order Summary
          </h2>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">
                Subtotal ({items.length} {items.length === 1 ? "item" : "items"}
                )
              </dt>
              <dd className="font-medium text-foreground">
                {currencyFormatter.format(subtotal)}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Delivery fee</dt>
              <dd className="font-medium text-primary">
                {deliveryFee === 0
                  ? "Free"
                  : currencyFormatter.format(deliveryFee)}
              </dd>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between text-base">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-bold text-foreground">
                  {currencyFormatter.format(totalPrice)}
                </dd>
              </div>
            </div>
          </dl>

          <Button
            type="button"
            size="lg"
            className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            Final prices are confirmed by the restaurant when your order is
            placed.
          </p>
        </aside>
      </div>
    </div>
  );
}
