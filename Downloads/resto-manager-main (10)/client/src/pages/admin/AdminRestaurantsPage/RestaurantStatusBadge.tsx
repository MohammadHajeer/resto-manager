type RestaurantStatus = "pending" | "approved" | "rejected" | "suspended";

const styles: Record<RestaurantStatus, { label: string; className: string; dotClass: string }> = {
  pending:   { label: "Pending",   className: "border-amber-200  bg-amber-50  text-amber-800",  dotClass: "bg-amber-500" },
  approved:  { label: "Approved",  className: "border-primary/20 bg-secondary text-secondary-foreground", dotClass: "bg-primary" },
  rejected:  { label: "Rejected",  className: "border-destructive/20 bg-destructive/10 text-destructive", dotClass: "bg-destructive" },
  suspended: { label: "Suspended", className: "border-border bg-muted text-muted-foreground",   dotClass: "bg-muted-foreground" },
};

export default function RestaurantStatusBadge({ status }: { status: RestaurantStatus }) {
  const s = styles[status] ?? styles.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      <span className={`size-1.5 rounded-full ${s.dotClass}`} />
      {s.label}
    </span>
  );
}
