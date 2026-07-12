export type RestaurantStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export const restaurantStatusConfig: Record<
  RestaurantStatus,
  {
    label: string;
    color: string;
    badgeClassName: string;
    dotClassName: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "var(--color-amber-500)",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
    dotClassName: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    color: "var(--color-emerald-500)",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dotClassName: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    color: "var(--destructive)",
    badgeClassName: "border-red-200 bg-red-50 text-red-800",
    dotClassName: "bg-red-500",
  },
  suspended: {
    label: "Suspended",
    color: "var(--color-slate-500)",
    badgeClassName: "border-slate-300 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-500",
  },
};
