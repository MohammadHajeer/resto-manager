import {
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const capabilities: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Discover approved restaurants",
    description: "Browse clear profiles and organized digital menus.",
    icon: Store,
  },
  {
    title: "Manage restaurant operations",
    description: "Keep profiles, menus, availability, and orders connected.",
    icon: LayoutDashboard,
  },
  {
    title: "Work through trusted roles",
    description: "Customers, owners, and administrators get focused access.",
    icon: ShieldCheck,
  },
];

const workspaceRows: Array<{
  label: string;
  detail: string;
  icon: LucideIcon;
}> = [
  {
    label: "Restaurant profile",
    detail: "Hours and business details",
    icon: Store,
  },
  {
    label: "Menu management",
    detail: "Categories, items, and availability",
    icon: UtensilsCrossed,
  },
  {
    label: "Order workflow",
    detail: "From new order to completion",
    icon: ShoppingBag,
  },
];

export function AuthVisualPanel() {
  return (
    <section
      className="relative hidden h-full min-h-0 overflow-x-hidden overflow-y-auto scrollbar-none overscroll-contain bg-[#005f4c] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35 lg:block"
      aria-label="RestoManager platform overview"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 size-72 rounded-full border border-white/10" />
        <div className="absolute -left-12 -top-12 size-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -right-20 size-80 rounded-full bg-primary/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.09)_1px,transparent_0)] bg-size-[26px_26px] mask-[linear-gradient(to_bottom_right,black,transparent_76%)]" />
      </div>

      <div className="relative z-10 flex min-h-full flex-col justify-between gap-[clamp(1.25rem,4vh,3rem)] p-[clamp(1.25rem,3.5vh,2.5rem)]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-emerald-50 backdrop-blur-sm">
            <ClipboardCheck className="size-4" aria-hidden="true" />
            One connected restaurant platform
          </div>

          <h2 className="mt-[clamp(1rem,2.2vh,1.75rem)] max-w-lg text-2xl font-extrabold leading-tight tracking-[-0.04em] xl:text-3xl 2xl:text-4xl">
            Restaurant work feels clearer when everything stays connected.
          </h2>
          <p className="mt-[clamp(0.5rem,1.4vh,1rem)] max-w-lg text-sm leading-6 text-emerald-50/75">
            RestoManager brings discovery, restaurant management, approval, and
            ordering into focused experiences for every role.
          </p>

          <div className="mt-[clamp(1rem,2.8vh,2rem)] space-y-[clamp(0.625rem,1.5vh,1rem)]">
            {capabilities.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex items-start gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-emerald-50/65">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/95 p-[clamp(0.875rem,2vh,1.25rem)] text-foreground shadow-[0_24px_65px_-28px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <LayoutDashboard className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Restaurant workspace
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Core operations in one place
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-secondary-foreground">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Connected
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            {workspaceRows.map(({ label, detail, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
