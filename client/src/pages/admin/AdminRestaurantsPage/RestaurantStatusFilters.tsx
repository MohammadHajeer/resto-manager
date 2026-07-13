import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "suspended";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All",       value: "all" },
  { label: "Pending",   value: "pending" },
  { label: "Approved",  value: "approved" },
  { label: "Rejected",  value: "rejected" },
  { label: "Suspended", value: "suspended" },
];

export function RestaurantStatusFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = (searchParams.get("status") as StatusFilter | null) ?? "all";

  const handleChange = (status: StatusFilter) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") params.delete("status");
    else params.set("status", status);
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex min-w-max items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm">
        {STATUS_FILTERS.map(({ label, value }) => {
          const isActive = current === value;
          return (
            <Button
              key={value}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleChange(value)}
              className={[
                "whitespace-nowrap rounded-xl px-4 transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
