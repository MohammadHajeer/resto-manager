import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

type RestaurantStatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

const statusFilters: {
  label: string;
  value: RestaurantStatusFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Suspended", value: "suspended" },
];

export function RestaurantStatusFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus =
    (searchParams.get("status") as RestaurantStatusFilter | null) ?? "all";

  const handleStatusChange = (status: RestaurantStatusFilter) => {
    const params = new URLSearchParams(searchParams);

    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }

    // Reset pagination when changing filter
    params.set("page", "1");

    setSearchParams(params);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex min-w-max items-center gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
        {statusFilters.map((filter) => {
          const isActive =
            filter.value === "all"
              ? currentStatus === "all"
              : currentStatus === filter.value;

          return (
            <Button
              key={filter.value}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusChange(filter.value)}
              className={
                isActive
                  ? "whitespace-nowrap rounded-xl bg-[#00856A] px-4 text-white hover:bg-[#006B55]"
                  : "whitespace-nowrap rounded-xl px-4 text-[#64748B] hover:bg-[#F8FAF9] hover:text-[#0F172A]"
              }
            >
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
