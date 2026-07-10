import type { ButtonHTMLAttributes } from "react";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  GripVertical,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  StickyNote,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OwnerKitchenOrder } from "@/services/owner/owner.types";
import { useUpdateOwnerOrderStatus } from "@/hooks/owner/userOwnerOrders";

type KitchenOrderCardProps = {
  order: OwnerKitchenOrder;
  dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  isOverlay?: boolean;
  hideActions?: boolean;
};

export function KitchenOrderCard({
  order,
  dragHandleProps,
  isDragging = false,
  isOverlay = false,
  hideActions = false,
}: KitchenOrderCardProps) {
  const updateOrderStatusMutation = useUpdateOwnerOrderStatus();

  const styles = getStatusStyles(order.status);

  const handleNextStatus = () => {
    if (!order.nextStatus) return;

    updateOrderStatusMutation.mutate({
      orderId: order._id,
      status: order.nextStatus,
    });
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl border-border bg-background p-0 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-40",
        isOverlay && "shadow-2xl ring-1 ring-primary/20",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-5 h-[calc(100%-2.5rem)] w-1 rounded-r-full",
          styles.rail,
        )}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted",
                    styles.iconText,
                  )}
                >
                  <ReceiptText className="size-4" />
                </div>

                <h3 className="font-bold tracking-tight text-foreground">
                  {order.orderCode}
                </h3>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold capitalize",
                  styles.badge,
                )}
              >
                {order.status}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {formatTime(order.createdAt)}
              </span>

              <span>
                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="text-right">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
                Total
              </p>
              <p className="text-lg font-bold text-primary">
                {formatMoney(order.totalPrice)}
              </p>
            </div>

            {dragHandleProps && (
              <Button
                {...dragHandleProps}
                type="button"
                variant="ghost"
                size="icon"
                className="hidden size-8 cursor-grab touch-none rounded-full text-muted-foreground hover:bg-muted active:cursor-grabbing md:inline-flex"
                aria-label="Drag order"
              >
                <GripVertical className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-border" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Order items
            </p>

            <p className="text-xs font-medium text-muted-foreground">
              Subtotal {formatMoney(order.subtotal)}
            </p>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={`${order._id}-${item.menuItemId}-${index}`}
                className="rounded-2xl border border-border bg-muted/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground shadow-sm">
                      {item.quantity}×
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-foreground">
                        {item.name}
                      </p>

                      {item.selectedAddons.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          +{" "}
                          {item.selectedAddons
                            .map((addon) => addon.name)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-foreground">
                    {formatMoney(item.itemTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.customerNote && (
          <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <StickyNote className="size-4" />
              <p className="text-xs font-bold uppercase tracking-wide">
                Customer note
              </p>
            </div>

            <p className="mt-1 text-sm font-medium text-foreground">
              {order.customerNote}
            </p>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-border bg-background p-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span>
              {order.deliveryAddress.city}, {order.deliveryAddress.street},{" "}
              {order.deliveryAddress.building}
              {order.deliveryAddress.floor
                ? `, Floor ${order.deliveryAddress.floor}`
                : ""}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 shrink-0" />
            <span>{order.deliveryAddress.phoneNumber}</span>
          </div>
        </div>

        {!hideActions && order.nextStatus && order.nextActionLabel && (
          <Button
            type="button"
            className="mt-4 h-11 w-full rounded-full font-semibold shadow-sm"
            onClick={handleNextStatus}
            disabled={updateOrderStatusMutation.isPending}
          >
            {updateOrderStatusMutation.isPending ? (
              "Updating..."
            ) : (
              <>
                {getActionIcon(order.nextStatus)}
                {order.nextActionLabel}
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

function getStatusStyles(status: OwnerKitchenOrder["status"]) {
  if (status === "pending") {
    return {
      rail: "bg-muted-foreground/50",
      iconText: "text-muted-foreground",
      badge: "border-border text-muted-foreground",
    };
  }

  if (status === "preparing") {
    return {
      rail: "bg-primary",
      iconText: "text-primary",
      badge: "border-primary/20 text-primary",
    };
  }

  if (status === "ready") {
    return {
      rail: "bg-emerald-500",
      iconText: "text-emerald-700",
      badge: "border-emerald-200 text-emerald-700",
    };
  }

  return {
    rail: "bg-border",
    iconText: "text-muted-foreground",
    badge: "border-border text-muted-foreground",
  };
}

function getActionIcon(nextStatus: OwnerKitchenOrder["status"]) {
  if (nextStatus === "preparing") {
    return <ChefHat className="size-4" />;
  }

  if (nextStatus === "ready") {
    return <PackageCheck className="size-4" />;
  }

  if (nextStatus === "completed") {
    return <CheckCircle2 className="size-4" />;
  }

  return null;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}