import { useMemo } from "react";
import {
  CreditCard,
  MapPin,
  ReceiptText,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AccountNavigationItem = {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

const accountNavigation: AccountNavigationItem[] = [
  {
    label: "Account Details",
    description: "Personal information",
    to: "/profile",
    icon: UserRound,
    end: true,
  },
  {
    label: "Saved Addresses",
    description: "Delivery locations",
    to: "/addresses",
    icon: MapPin,
    end: true,
  },
  {
    label: "Orders",
    description: "Active and previous orders",
    to: "/orders",
    icon: ReceiptText,
  },
  {
    label: "Payment Methods",
    description: "Payment preferences",
    to: "/payment-methods",
    icon: CreditCard,
    end: true,
  },
];

function getInitials(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toLocaleUpperCase();

  return `${parts[0].charAt(0)}${parts.at(-1)?.charAt(0) ?? ""}`.toLocaleUpperCase();
}

function AccountNavigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      aria-label="Customer account navigation"
      className={cn(
        mobile
          ? "flex min-w-max items-center gap-2 p-1"
          : "space-y-1.5 p-2",
      )}
    >
      {accountNavigation.map(({ label, description, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              mobile ? "h-10 px-3" : "px-3 py-2.5",
              isActive
                ? "bg-secondary font-semibold text-primary"
                : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-lg transition-colors",
                  mobile ? "size-7" : "size-9",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "bg-muted text-muted-foreground group-hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap">{label}</span>
              {!mobile ? (
                <span className="sr-only"> — {description}</span>
              ) : null}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function CustomerAccountLayout() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    const checks = [
      Boolean(user.name),
      Boolean((user as { phone?: string }).phone),
      Boolean(user.image),
      Boolean(user.emailVerified),
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [user]);

  const displayName = isPending ? "Loading..." : (user?.name ?? "Your account");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-7">
        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="h-16 border-b border-primary/10 bg-secondary/65" />
            <div className="px-5 pb-5">
              <Avatar className="-mt-8 size-20 rounded-2xl border border-primary/20 bg-card ring-4 ring-card shadow-md">
                {user?.image ? (
                  <AvatarImage
                    src={user.image}
                    alt={`${user.name ?? "Customer"} profile`}
                    referrerPolicy="no-referrer"
                    className="rounded-2xl"
                  />
                ) : null}
                <AvatarFallback className="rounded-2xl bg-primary/12 text-xl font-bold text-primary">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="mt-3 min-w-0">
                <p className="truncate text-lg font-bold text-foreground">
                  {displayName}
                </p>
                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {user?.email ?? "No email available"}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-primary/10 bg-background p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Profile completion
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {profileCompletion}%
                  </span>
                </div>
                <div
                  className="mt-2.5 h-2 overflow-hidden rounded-full bg-primary/10"
                  role="progressbar"
                  aria-label="Profile completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={profileCompletion}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm lg:block">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Account navigation
              </p>
            </div>
            <AccountNavigation />
          </section>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-sm scrollbar-none lg:hidden">
            <AccountNavigation mobile />
          </div>

          <main className="min-w-0 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6 lg:p-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
