import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Check,
  Info,
  Lock,
  MapPinPlus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerAddresses } from "@/hooks/customer/useCustomerAddresses";
import { useCreateOrder } from "@/hooks/customer/useCustomerOrders";
import { calculateCartSubtotal, useCartStore } from "@/stores/useCartStore";
import type { CustomerAddress } from "@/services/customer/customer.types";

import { AddressFormDialog } from "./AddressesPage/AddressFormDialog";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CUSTOMER_NOTE_MAX_LENGTH = 500;

function AddressesSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[1, 2].map((key) => (
        <div
          key={key}
          className="h-24 animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </div>
  );
}

function SelectableAddressCard({
  address,
  isSelected,
  onSelect,
}: {
  address: CustomerAddress;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:bg-muted/40"
      }`}
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40"
        }`}
      >
        {isSelected && <Check className="size-3" aria-hidden="true" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground">{address.label}</p>

          {address.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              <Star className="size-3" aria-hidden="true" />
              Default
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {address.building}, {address.street}
          {address.floor ? `, ${address.floor}` : ""} · {address.city}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {address.phoneNumber}
        </p>
      </div>
    </button>
  );
}

function EmptyCartRedirect() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <ShoppingBag className="size-8" aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-foreground">
        Your cart is empty
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Add items to your cart before proceeding to checkout.
      </p>

      <Button
        nativeButton={false}
        size="lg"
        className="mt-6 rounded-full px-6"
        render={<Link to="/restaurants" />}
      >
        Browse restaurants
      </Button>
    </div>
  );
}

/**
 * CheckoutPage (RES-90/91 address section, RES-93/94/95 order submission)
 * ------------------------------------------------------------------------
 * The customer picks (or adds) a saved delivery address, optionally leaves
 * a note for the restaurant, and places the order.
 *
 * Client-side validation before submitting (RES-95):
 * - cart must not be empty (empty carts never render the form at all)
 * - a delivery address must be selected
 * - the cart must belong to one restaurant (the store enforces this rule)
 * The server independently re-validates the payload shape (zod middleware)
 * and every business rule (item availability, ownership, addon/ingredient
 * names) and recomputes all prices from the database.
 */
export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const cartRestaurantId = useCartStore((state) => state.restaurantId);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const clearCart = useCartStore((state) => state.clearCart);

  const { data: addresses, isPending: isLoadingAddresses } =
    useCustomerAddresses();

  const createOrderMutation = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [customerNote, setCustomerNote] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pre-select the default address (or the only address) once addresses
  // load, without overriding a choice the customer already made.
  useEffect(() => {
    if (!addresses || addresses.length === 0 || selectedAddressId) return;

    const defaultAddress = addresses.find((address) => address.isDefault);
    setSelectedAddressId((defaultAddress ?? addresses[0])._id);
  }, [addresses, selectedAddressId]);

  const subtotal = calculateCartSubtotal(items);
  const deliveryFee = 0;
  const totalPrice = subtotal + deliveryFee;

  const selectedAddress =
    addresses?.find((address) => address._id === selectedAddressId) ?? null;

  const isPlacingOrder = createOrderMutation.isPending;

  const handlePlaceOrder = () => {
    // RES-95: validate the cart and selections before hitting the API.
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    if (!cartRestaurantId) {
      toast.error("Your cart is missing its restaurant. Please re-add items.");
      navigate("/cart");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address first.");
      return;
    }

    const trimmedNote = customerNote.trim();

    createOrderMutation.mutate(
      {
        restaurantId: cartRestaurantId,
        deliveryAddress: {
          label: selectedAddress.label,
          city: selectedAddress.city,
          street: selectedAddress.street,
          building: selectedAddress.building,
          floor: selectedAddress.floor ?? "",
          phoneNumber: selectedAddress.phoneNumber,
        },
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedAddonNames: item.selectedAddons.map((addon) => addon.name),
          removedIngredientNames: item.removedIngredients,
        })),
        ...(trimmedNote ? { customerNote: trimmedNote } : {}),
      },
      {
        onSuccess: (order) => {
          // Only clear the cart once the server has accepted the order,
          // so a failed submission never loses the customer's cart.
          clearCart();
          navigate(`/orders/success/${order._id}`, { replace: true });
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyCartRedirect />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <button
        type="button"
        onClick={() => navigate("/cart")}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to cart
      </button>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose where this order from{" "}
          <span className="font-medium text-foreground">
            {restaurantName ?? "your restaurant"}
          </span>{" "}
          should be delivered.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <section
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            aria-label="Delivery address"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Delivery Address
              </h2>

              {addresses && addresses.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(true)}
                  className="w-fit"
                  disabled={isPlacingOrder}
                >
                  <MapPinPlus className="size-4" aria-hidden="true" />
                  Add new
                </Button>
              )}
            </div>

            {isLoadingAddresses ? (
              <AddressesSkeleton />
            ) : !addresses || addresses.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  You don't have any saved addresses yet.
                </p>
                <Button
                  className="mt-4 rounded-full px-5"
                  onClick={() => setIsFormOpen(true)}
                >
                  <MapPinPlus className="size-4" aria-hidden="true" />
                  Add a delivery address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <SelectableAddressCard
                    key={address._id}
                    address={address}
                    isSelected={selectedAddressId === address._id}
                    onSelect={() => setSelectedAddressId(address._id)}
                  />
                ))}
              </div>
            )}
          </section>

          <section
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            aria-label="Order items"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Order Items
              </h2>
              <Link
                to="/cart"
                className="text-sm font-medium text-primary hover:underline"
              >
                Edit cart
              </Link>
            </div>

            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li
                  key={item.cartItemKey}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{item.quantity}×</span>{" "}
                      {item.name}
                    </p>

                    {item.selectedAddons.length > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        +{" "}
                        {item.selectedAddons
                          .map((addon) => addon.name)
                          .join(", ")}
                      </p>
                    )}

                    {item.removedIngredients.length > 0 && (
                      <p className="mt-0.5 text-xs font-medium text-destructive">
                        No {item.removedIngredients.join(", ")}
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    {currencyFormatter.format(item.itemTotal)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Frontend-only payment placeholder: Cash on Delivery is the only
              available method, so it renders as a selected, locked radio-card.
              Nothing about it is sent to the backend or persisted — the
              existing order API has no payment fields, and none are added. */}
          <section
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            aria-label="Payment method"
          >
            <h2 className="text-lg font-semibold text-foreground">
              Payment Method
            </h2>

            <div
              role="radiogroup"
              aria-label="Payment method options"
              className="mt-4"
            >
              <div
                role="radio"
                aria-checked="true"
                aria-disabled="true"
                className="flex w-full items-start gap-3 rounded-2xl border border-primary bg-primary/5 p-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground"
                >
                  <Check className="size-3" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Banknote className="size-4.5" aria-hidden="true" />
                    </span>

                    <p className="font-semibold text-foreground">
                      Cash on Delivery
                    </p>

                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Lock className="size-3" aria-hidden="true" />
                      Only available option
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Pay with cash when your order arrives. The courier will
                    collect the total amount upon delivery.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            aria-label="Note for the restaurant"
          >
            <Label
              htmlFor="checkout-customer-note"
              className="text-lg font-semibold text-foreground"
            >
              Note for the restaurant{" "}
              <span className="text-sm font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Textarea
              id="checkout-customer-note"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
              maxLength={CUSTOMER_NOTE_MAX_LENGTH}
              rows={3}
              disabled={isPlacingOrder}
              placeholder="E.g. ring the doorbell twice, extra napkins please..."
              className="mt-3 min-h-20 resize-y rounded-lg border-input bg-background px-3 py-2.5 shadow-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-primary/20"
            />

            <p
              className="mt-2 text-right text-xs tabular-nums text-muted-foreground"
              aria-live="polite"
            >
              {customerNote.length}/{CUSTOMER_NOTE_MAX_LENGTH}
            </p>
          </section>
        </div>

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
            onClick={handlePlaceOrder}
            disabled={!selectedAddress || isPlacingOrder}
            className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
          >
            {isPlacingOrder
              ? "Placing order..."
              : `Place Order · ${currencyFormatter.format(totalPrice)}`}
          </Button>

          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {selectedAddress
              ? "You'll pay in cash when your order is delivered. Final prices are confirmed by the restaurant."
              : "Select a delivery address above to continue."}
          </p>
        </aside>
      </div>

      <AddressFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSaved={(savedAddress) => setSelectedAddressId(savedAddress._id)}
      />
    </div>
  );
}
