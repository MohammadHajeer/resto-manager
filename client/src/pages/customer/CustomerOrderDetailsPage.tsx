import {
  ArrowLeft,
  Banknote,
  Check,
  ChefHat,
  CircleCheck,
  MapPin,
  PackageCheck,
  ReceiptText,
  StickyNote,
  Store,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCustomerOrderById } from "@/hooks/customer/useCustomerOrders";
import type {
  CustomerOrder,
  CustomerOrderStatus,
} from "@/services/customer/customer.types";

import { OrderStatusBadge } from "./orders/OrderStatusBadge";
import {
  getOrderRestaurant,
  orderCurrencyFormatter,
  orderDateFormatter,
} from "./orders/orderHelpers";

/**
 * The customer-facing progress steps for a live order. `cancelled` is not
 * a step — a cancelled order shows a notice instead of the timeline.
 */
const progressSteps = [
  { status: "pending", label: "Placed", icon: ReceiptText },
  { status: "accepted", label: "Accepted", icon: Store },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: PackageCheck },
  { status: "completed", label: "Delivered", icon: CircleCheck },
] as const;

const statusRank: Record<CustomerOrderStatus, number> = {
  pending: 0,
  accepted: 1,
  preparing: 2,
  ready: 3,
  completed: 4,
  cancelled: -1,
};

function OrderProgress({ status }: { status: CustomerOrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm leading-6 text-destructive">
        This order was cancelled. If you didn't expect this, please contact
        the restaurant directly.
      </div>
    );
  }

  const currentRank = statusRank[status];

  return (
    <ol className="flex items-start justify-between gap-1" aria-label="Order progress">
      {progressSteps.map((step, index) => {
        const isReached = currentRank >= index;
        const isCurrent = currentRank === index;
        const Icon = step.icon;

        return (
          <li
            key={step.status}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
            aria-current={isCurrent ? "step" : undefined}
          >
            <div className="flex w-full items-center">
              <div
                className={`h-0.5 flex-1 ${
                  index === 0
                    ? "bg-transparent"
                    : isReached
                      ? "bg-primary"
                      : "bg-border"
                }`}
                aria-hidden="true"
              />
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isReached
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {isReached && !isCurrent ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Icon className="size-4" aria-hidden="true" />
                )}
              </span>
              <div
                className={`h-0.5 flex-1 ${
                  index === progressSteps.length - 1
                    ? "bg-transparent"
                    : currentRank > index
                      ? "bg-primary"
                      : "bg-border"
                }`}
                aria-hidden="true"
              />
            </div>

            <span
              className={`truncate text-xs font-medium ${
                isCurrent
                  ? "text-primary"
                  : isReached
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-28 animate-pulse rounded-3xl border border-border bg-muted/40" />
      <div className="h-24 animate-pulse rounded-3xl border border-border bg-muted/40" />
      <div className="h-72 animate-pulse rounded-3xl border border-border bg-muted/40" />
    </div>
  );
}

function OrderNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-16 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        Order not found
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        We couldn't find this order. It may belong to a different account.
      </p>
      <Button
        nativeButton={false}
        size="lg"
        className="mt-6 rounded-full px-6"
        render={<Link to="/orders" />}
      >
        View my orders
      </Button>
    </div>
  );
}

function OrderHeader({ order }: { order: CustomerOrder }) {
  const restaurant = getOrderRestaurant(order);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {restaurant?.logoUrl ? (
          <img
            src={restaurant.logoUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="size-12 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="size-5" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {restaurant ? (
                <Link
                  to={`/restaurants/${restaurant.slug}`}
                  className="hover:text-primary hover:underline"
                >
                  {restaurant.name}
                </Link>
              ) : (
                "Order details"
              )}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {order.orderCode}
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            Placed {orderDateFormatter.format(new Date(order.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * CustomerOrderDetailsPage (RES-98, RES-100)
 * -------------------------------------------
 * /orders/:orderId — full detail view for one order: live progress
 * timeline (the underlying query is shared with the confirmation page),
 * itemized receipt with add-ons and removed ingredients, delivery
 * address, note, and totals.
 */
export default function CustomerOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isPending } = useCustomerOrderById(orderId ?? null);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to my orders
      </Link>

      <div className="mt-4">
        {isPending ? (
          <DetailsSkeleton />
        ) : !order ? (
          <OrderNotFound />
        ) : (
          <div className="space-y-4">
            <OrderHeader order={order} />

            <section
              className="rounded-3xl border border-border bg-card p-5 sm:p-6"
              aria-label="Order progress"
            >
              <OrderProgress status={order.status} />
            </section>

            <section
              className="overflow-hidden rounded-3xl border border-border bg-card"
              aria-label="Order items"
            >
              <div className="border-b border-border bg-muted/40 px-5 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-foreground">
                  Order Items
                </h2>
              </div>

              <ul className="divide-y divide-border px-5 sm:px-6">
                {order.items.map((item, index) => (
                  <li
                    key={`${item.menuItemId}-${index}`}
                    className="flex items-start justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        <span className="font-semibold">{item.quantity}×</span>{" "}
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {orderCurrencyFormatter.format(item.basePrice)} each
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
                              {addon.name} (+
                              {orderCurrencyFormatter.format(addon.price)})
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.removedIngredients.length > 0 && (
                        <p className="mt-1.5 text-xs font-medium text-destructive">
                          No {item.removedIngredients.join(", ")}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-foreground">
                      {orderCurrencyFormatter.format(item.itemTotal)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2.5 border-t border-border bg-muted/20 px-5 py-4 text-sm sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium text-foreground">
                    {orderCurrencyFormatter.format(order.subtotal)}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Delivery fee</dt>
                  <dd className="font-medium text-primary">
                    {order.deliveryFee === 0
                      ? "Free"
                      : orderCurrencyFormatter.format(order.deliveryFee)}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-2.5 text-base">
                  <dt className="font-semibold text-foreground">Total</dt>
                  <dd className="font-bold text-foreground">
                    {orderCurrencyFormatter.format(order.totalPrice)}
                  </dd>
                </div>

                {/* Display-only payment placeholder — Cash on Delivery is the
                    platform's only method; nothing is stored or sent for it. */}
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Banknote className="size-4" aria-hidden="true" />
                    Payment method
                  </dt>
                  <dd className="font-medium text-foreground">
                    Cash on Delivery
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="rounded-3xl border border-border bg-card p-5 sm:p-6"
              aria-label="Delivery details"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground">
                    Delivering to {order.deliveryAddress.label || "your address"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {order.deliveryAddress.building},{" "}
                    {order.deliveryAddress.street}
                    {order.deliveryAddress.floor
                      ? `, ${order.deliveryAddress.floor}`
                      : ""}
                    , {order.deliveryAddress.city}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.deliveryAddress.phoneNumber}
                  </p>
                </div>
              </div>

              {order.customerNote && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
                  <StickyNote
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-muted-foreground">
                    "{order.customerNote}"
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
