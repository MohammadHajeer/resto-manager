import type { CustomerOrderStatus } from "@/services/customer/customer.types";

const statusStyles: Record<CustomerOrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-primary/10 text-primary",
  preparing: "bg-primary/10 text-primary",
  ready: "bg-primary/15 text-primary",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<CustomerOrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Consistent order-status pill across confirmation, history, and details. */
export function OrderStatusBadge({ status }: { status: CustomerOrderStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${
        statusStyles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
