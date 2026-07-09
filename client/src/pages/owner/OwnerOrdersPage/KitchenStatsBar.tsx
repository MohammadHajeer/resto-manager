import { ChefHat, Clock, PackageCheck, ReceiptText } from "lucide-react";

import { Card } from "@/components/ui/card";

type KitchenStatsBarProps = {
  counts: {
    pending: number;
    preparing: number;
    ready: number;
    total: number;
  };
};

export function KitchenStatsBar({ counts }: KitchenStatsBarProps) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KitchenStatCard
        label="Active Orders"
        value={counts.total}
        icon={<ReceiptText className="size-5" />}
      />

      <KitchenStatCard
        label="New Orders"
        value={counts.pending}
        icon={<Clock className="size-5" />}
      />

      <KitchenStatCard
        label="Preparing"
        value={counts.preparing}
        icon={<ChefHat className="size-5" />}
      />

      <KitchenStatCard
        label="Ready"
        value={counts.ready}
        icon={<PackageCheck className="size-5" />}
      />
    </section>
  );
}

type KitchenStatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

function KitchenStatCard({ label, value, icon }: KitchenStatCardProps) {
  return (
    <Card className="rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground">
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold leading-none text-foreground">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
