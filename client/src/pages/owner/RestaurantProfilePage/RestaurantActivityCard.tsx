import { Loader2, Power, Store } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToggleRestaurantActivity } from "@/hooks/owner/useOwnerRestaurant";

type RestaurantActivityCardProps = {
  isOpen: boolean;
};

export default function RestaurantActivityCard({
  isOpen,
}: RestaurantActivityCardProps) {
  const updateActivity = useToggleRestaurantActivity();

  const nextIsOpen = !isOpen;

  const handleToggleActivity = () => {
    updateActivity.mutate(
      {
        isOpen: nextIsOpen,
      },
      {
        onSuccess: () => {
          toast.success(
            nextIsOpen ? "Restaurant is now open" : "Restaurant is now closed",
          );
        },
        onError: () => {
          toast.error("Failed to update restaurant activity");
        },
      },
    );
  };

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "rounded-2xl p-3",
              isOpen
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Store className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Restaurant Activity
              </h2>

              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  isOpen
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {isOpen
                ? "Your restaurant is currently accepting orders from customers."
                : "Your restaurant is currently closed and not accepting orders."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border bg-background/60 p-4 md:min-w-72">
          <div>
            <p className="text-sm font-medium text-foreground">Accept Orders</p>
            <p className="text-xs text-muted-foreground">
              Toggle your restaurant open or closed.
            </p>
          </div>

          <Switch
            checked={isOpen}
            disabled={updateActivity.isPending}
            onCheckedChange={handleToggleActivity}
            aria-label="Toggle restaurant activity"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Power className="mt-0.5 h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-sm font-medium text-foreground">
              {isOpen ? "Close restaurant temporarily" : "Open restaurant"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOpen
                ? "Use this when you are too busy, out of stock, or closed for the day."
                : "Use this when you are ready to receive customer orders."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={isOpen ? "outline" : "default"}
          disabled={updateActivity.isPending}
          onClick={handleToggleActivity}
          className="shrink-0"
        >
          {updateActivity.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : isOpen ? (
            "Close Restaurant"
          ) : (
            "Open Restaurant"
          )}
        </Button>
      </div>
    </section>
  );
}
