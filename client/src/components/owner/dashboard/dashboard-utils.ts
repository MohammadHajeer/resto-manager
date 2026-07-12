import type { OwnerOrderStatus } from "@/services/owner/owner.types";

export const orderStatusConfig: Record<
  OwnerOrderStatus,
  { label: string; color: string; badgeClassName: string }
> = {
  pending: {
    label: "Pending",
    color: "var(--muted-foreground)",
    badgeClassName: "border-border bg-muted text-muted-foreground",
  },
  accepted: {
    label: "Accepted",
    color: "var(--chart-2)",
    badgeClassName: "border-primary/20 bg-primary/10 text-primary",
  },
  preparing: {
    label: "Preparing",
    color: "var(--chart-1)",
    badgeClassName: "border-primary/20 bg-primary/10 text-primary",
  },
  ready: {
    label: "Ready",
    color: "var(--chart-5)",
    badgeClassName: "border-secondary bg-secondary text-secondary-foreground",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
    badgeClassName: "border-foreground/10 bg-foreground/5 text-foreground",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--destructive)",
    badgeClassName: "border-destructive/20 bg-destructive/10 text-destructive",
  },
};

export const formatCount = (value: number) =>
  new Intl.NumberFormat("en").format(value);

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const formatOrderDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const formatChartDate = (value: string, period: 7 | 30) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...(period === 7 ? { weekday: "short" as const } : {}),
  }).format(new Date(`${value}T00:00:00Z`));
