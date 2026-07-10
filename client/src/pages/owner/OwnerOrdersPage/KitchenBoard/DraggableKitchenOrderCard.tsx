import type { ButtonHTMLAttributes } from "react";
import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import type { OwnerKitchenOrder } from "@/services/owner/owner.types";

import { KitchenOrderCard } from "./KitchenOrderCard";

type DraggableKitchenOrderCardProps = {
  order: OwnerKitchenOrder;
};

export function DraggableKitchenOrderCard({
  order,
}: DraggableKitchenOrderCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order._id,
    data: {
      order,
    },
  });

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  } as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <div ref={setNodeRef} className={cn("w-full", isDragging && "z-10")}>
      <KitchenOrderCard
        order={order}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
      />
    </div>
  );
}