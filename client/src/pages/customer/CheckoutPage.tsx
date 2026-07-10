import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Info,
  MapPinPlus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCustomerAddresses } from "@/hooks/customer/useCustomerAddresses";
import { calculateCartSubtotal, useCartStore } from "@/stores/useCartStore";
import type { CustomerAddress } from "@/services/customer/customer.types";

import { AddressFormDialog } from "./AddressesPage/AddressFormDialog";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
 * CheckoutPage — delivery address section (RES-90/91, RES-119..RES-124)
 * -----------------------------------------------------------------------
 * Lets the customer pick (or add) a saved delivery address before placing
 * an order. Order submission itself (RES-93, RES-94, RES-95) is a separate,
 * not-yet-scoped task — the backend endpoint and client hook for it already
 * exist and are ready to wire up, so "Place Order" is intentionally left in
 * the same disabled "coming soon" state already used elsewhere in the
 * customer profile, rather than silently doing nothing on click.
 */
export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const restaurantName = useCartStore((state) => state.restaurantName);

  const { data: addresses, isPending: isLoadingAddresses } =
    useCustomerAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
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

  const hasSelectedAddress = Boolean(selectedAddressId);

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
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{item.quantity}×</span>{" "}
                    {item.name}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {currencyFormatter.format(item.itemTotal)}
                  </p>
                </li>
              ))}
            </ul>
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
            disabled
            title="Order placement is coming in a future update"
            className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
          >
            Place Order
          </Button>

          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {hasSelectedAddress
              ? "Order placement is coming in a future update. Your cart and address are saved."
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
