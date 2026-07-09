import { useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { toast } from "sonner";

import type {
  KitchenStatus,
  OwnerKitchenOrder,
} from "@/services/owner/owner.types";

import { KitchenColumn } from "./KitchenColumn";
import { KitchenOrderCard } from "./KitchenOrderCard";
import { useUpdateOwnerOrderStatus } from "@/hooks/owner/userOwnerOrders";

type KitchenBoardProps = {
  columns: Record<KitchenStatus, OwnerKitchenOrder[]>;
};

const kitchenColumns: {
  status: KitchenStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "pending",
    title: "New Orders",
    description: "Orders waiting to be prepared.",
  },
  {
    status: "preparing",
    title: "Preparing",
    description: "Orders currently in the kitchen.",
  },
  {
    status: "ready",
    title: "Ready",
    description: "Orders ready for pickup or delivery.",
  },
];

const isKitchenStatus = (value: string): value is KitchenStatus => {
  return value === "pending" || value === "preparing" || value === "ready";
};

export function KitchenBoard({ columns }: KitchenBoardProps) {
  const [activeOrder, setActiveOrder] = useState<OwnerKitchenOrder | null>(null);
  const [activeOrderWidth, setActiveOrderWidth] = useState<number | null>(null);

  const updateOrderStatusMutation = useUpdateOwnerOrderStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const findOrderById = (orderId: string) => {
    const allOrders = [
      ...columns.pending,
      ...columns.preparing,
      ...columns.ready,
    ];

    return allOrders.find((order) => order._id === orderId) ?? null;
  };

  const resetActiveDrag = () => {
    setActiveOrder(null);
    setActiveOrderWidth(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const orderId = String(event.active.id);
    const order = findOrderById(orderId);

    setActiveOrder(order);

    const width = event.active.rect.current.initial?.width;

    if (typeof width === "number") {
      setActiveOrderWidth(width);
    }
  };

  const handleDragCancel = () => {
    resetActiveDrag();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    resetActiveDrag();

    if (!over) return;

    const orderId = String(active.id);
    const targetStatusValue = String(over.id);

    if (!isKitchenStatus(targetStatusValue)) {
      return;
    }

    const order = findOrderById(orderId);

    if (!order) return;

    if (order.status === targetStatusValue) {
      return;
    }

    if (order.nextStatus !== targetStatusValue) {
      toast.error(
        `Cannot move order from ${order.status} to ${targetStatusValue}`,
      );
      return;
    }

    updateOrderStatusMutation.mutate({
      orderId,
      status: targetStatusValue,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <section className="grid gap-5 xl:grid-cols-3">
        {kitchenColumns.map((column) => (
          <KitchenColumn
            key={column.status}
            status={column.status}
            title={column.title}
            description={column.description}
            orders={columns[column.status]}
          />
        ))}
      </section>

      <DragOverlay zIndex={9999} adjustScale={false} dropAnimation={null}>
        {activeOrder ? (
          <div
            className="pointer-events-none"
            style={{
              width: activeOrderWidth ?? undefined,
            }}
          >
            <KitchenOrderCard order={activeOrder} isOverlay hideActions />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}