import {
  ArrowRight,
  Banknote,
  CircleCheck,
  MapPin,
  ReceiptText,
  StickyNote,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCustomerOrderById } from "@/hooks/customer/useCustomerOrders";

import { OrderStatusBadge } from "./orders/OrderStatusBadge";
import {
  getOrderRestaurant,
  orderCurrencyFormatter,
  orderDateFormatter,
} from "./orders/orderHelpers";

function ConfirmationSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4" aria-hidden="true">
      <div className="h-40 animate-pulse rounded-3xl border border-border bg-muted/40" />
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

/**
 * OrderConfirmationPage (RES-96, RES-97, RES-98)
 * -----------------------------------------------
 * Shown right after checkout succeeds (/orders/success/:orderId).
 * Displays the order number (orderCode), status, receipt summary,
 * delivery address, and next-step links.
 */
export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isPending } = useCustomerOrderById(orderId ?? null);

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ConfirmationSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <OrderNotFound />
      </div>
    );
  }

  const restaurant = getOrderRestaurant(order);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Confirmation hero */}
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleCheck className="size-9" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Order Confirmed!
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Your order{restaurant ? (
            <>
              {" "}
              from{" "}
              <span className="font-medium text-foreground">
                {restaurant.name}
              </span>
            </>
          ) : null}{" "}
          has been received and sent to the restaurant. You'll pay in cash
          when it's delivered.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-bold tracking-wide text-foreground">
            {order.orderCode}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Placed {orderDateFormatter.format(new Date(order.createdAt))}
        </p>
      </div>

      {/* Receipt */}
      <section
        className="mt-8 overflow-hidden rounded-3xl border border-border bg-card"
        aria-label="Receipt summary"
      >
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-4 sm:px-6">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ReceiptText className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold text-foreground">
            Receipt Summary
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

                {(item.selectedAddons?.length ?? 0) > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    + {item.selectedAddons?.map((addon) => addon.name).join(", ")}
                  </p>
                )}

                {(item.removedIngredients?.length ?? 0) > 0 && (
                  <p className="mt-0.5 text-xs font-medium text-destructive">
                    No {item.removedIngredients?.join(", ")}
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
            <dd className="font-medium text-foreground">Cash on Delivery</dd>
          </div>
        </dl>
      </section>

      {/* Delivery details */}
      <section
        className="mt-4 rounded-3xl border border-border bg-card p-5 sm:p-6"
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
              {order.deliveryAddress.building}, {order.deliveryAddress.street}
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

      {/* Next steps */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          nativeButton={false}
          size="lg"
          className="h-12 rounded-xl px-6 text-base font-semibold"
          render={<Link to={`/orders/${order._id}`} />}
        >
          Track this order
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <Button
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-12 rounded-xl px-6 text-base"
          render={<Link to="/restaurants" />}
        >
          Continue browsing
        </Button>
      </div>
    </div>
  );
}
