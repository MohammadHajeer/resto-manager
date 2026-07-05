type RestaurantStatus = "pending" | "approved" | "rejected" | "suspended";

const restaurantStatusStyles: Record<
  RestaurantStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    dotClassName: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dotClassName: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-800",
    dotClassName: "bg-red-500",
  },
  suspended: {
    label: "Suspended",
    className: "border-slate-300 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-500",
  },
};

export default function RestaurantStatusBadge({
  status,
}: {
  status: RestaurantStatus;
}) {
  const style = restaurantStatusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.className}`}
    >
      <span className={`size-1.5 rounded-full ${style.dotClassName}`} />
      {style.label}
    </span>
  );
}
