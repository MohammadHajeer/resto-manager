import { CircleCheck, CircleAlert, PackageOpen } from "lucide-react";

type MenuStatsBarProps = {
  stats?: {
    totalItems: number;
    activeItems: number;
    outOfStockItems: number;
  };
};

export function MenuStatsBar({ stats }: MenuStatsBarProps) {
  return (
    <section className="rounded-3xl border border-border bg-card px-6 py-5 shadow-sm">
      <div className="flex flex-wrap gap-8">
        <StatItem
          icon={<PackageOpen className="size-5" />}
          label="Total Items"
          value={stats?.totalItems ?? 0}
        />

        <StatDivider />

        <StatItem
          icon={<CircleCheck className="size-5" />}
          label="Active"
          value={stats?.activeItems ?? 0}
        />

        <StatDivider />

        <StatItem
          icon={<CircleAlert className="size-5" />}
          label="Out of Stock"
          value={stats?.outOfStockItems ?? 0}
        />
      </div>
    </section>
  );
}

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
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
  );
}

function StatDivider() {
  return <div className="hidden w-px bg-border sm:block" />;
}
