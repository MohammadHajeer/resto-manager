/* eslint-disable react-hooks/static-components */
import { useDroppable } from "@dnd-kit/core";
import { AlertCircle, ChefHat, PackageCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  KitchenStatus,
  OwnerKitchenOrder,
} from "@/services/owner/owner.types";

import { DraggableKitchenOrderCard } from "./DraggableKitchenOrderCard";

type KitchenColumnProps = {
  status: KitchenStatus;
  title: string;
  description: string;
  orders: OwnerKitchenOrder[];
};

export function KitchenColumn({
  status,
  title,
  description,
  orders,
}: KitchenColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const styles = getColumnStyles(status);
  const Icon = getColumnIcon(status);

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex min-h-140 flex-col rounded-3xl border-border bg-background p-4 shadow-sm transition-all",
        isOver && "border-primary/50 bg-primary/5 shadow-md ring-2 ring-primary/10",
      )}
    >
      <div
        className={cn(
          "mb-4 rounded-3xl border px-4 py-4",
          styles.headerBorder,
          styles.headerBackground,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm",
                styles.iconText,
              )}
            >
              <Icon className="size-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {title}
              </h2>

              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="shrink-0 rounded-full px-3 py-1 font-bold"
          >
            {orders.length}
          </Badge>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {orders.length > 0 ? (
          orders.map((order) => (
            <DraggableKitchenOrderCard key={order._id} order={order} />
          ))
        ) : (
          <div
            className={cn(
              "flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center transition-colors",
              isOver
                ? "border-primary/50 bg-primary/10"
                : "border-border bg-muted/30",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-full bg-background shadow-sm",
                styles.iconText,
              )}
            >
              <Icon className="size-5" />
            </div>

            <p className="mt-3 text-sm font-bold text-foreground">
              {isOver ? "Release to move order here" : "No orders here"}
            </p>

            <p className="mt-1 max-w-52 text-xs leading-relaxed text-muted-foreground">
              Drag an order into this column or use the action button on each
              ticket.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function getColumnIcon(status: KitchenStatus) {
  if (status === "pending") return AlertCircle;
  if (status === "preparing") return ChefHat;
  return PackageCheck;
}

function getColumnStyles(status: KitchenStatus) {
  if (status === "pending") {
    return {
      headerBorder: "border-border",
      headerBackground: "bg-muted/40",
      iconText: "text-muted-foreground",
    };
  }

  if (status === "preparing") {
    return {
      headerBorder: "border-primary/20",
      headerBackground: "bg-primary/5",
      iconText: "text-primary",
    };
  }

  return {
    headerBorder: "border-emerald-200/70",
    headerBackground: "bg-emerald-50/60",
    iconText: "text-emerald-700",
  };
}