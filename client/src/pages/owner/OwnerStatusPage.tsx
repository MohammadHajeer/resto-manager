import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Clock3,
  FileSearch,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { OwnerStatusErrorState } from "@/components/owner/OwnerStatusErrorState";
import { RouteLoadingState } from "@/components/RouteLoadingState";
import { useOwnerRestaurantStatus } from "@/hooks/owner/useOwnerRestaurant";
import type { OwnerRestaurantStatus } from "@/services/owner/owner.types";

type StatusContent = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  detailTitle: string;
  detailDescription: string;
  iconClassName: string;
  iconBackgroundClassName: string;
};

const statusContent: Record<
  Exclude<OwnerRestaurantStatus, "approved">,
  StatusContent
> = {
  pending: {
    icon: Clock3,
    eyebrow: "Approval pending",
    title: "Your restaurant is under review",
    description:
      "Our admin team is reviewing your restaurant details and verification documents before activation.",
    detailTitle: "Admin review in progress",
    detailDescription:
      "Restaurant management features will unlock as soon as your registration is approved.",
    iconClassName: "text-primary",
    iconBackgroundClassName: "bg-primary/10",
  },
  rejected: {
    icon: XCircle,
    eyebrow: "Registration needs attention",
    title: "Your restaurant registration was not approved",
    description:
      "The admin team could not approve the registration in its current form. Review the feedback below before taking the next step.",
    detailTitle: "Admin feedback",
    detailDescription:
      "Contact the admin team if you need clarification or want to discuss resubmitting your restaurant.",
    iconClassName: "text-destructive",
    iconBackgroundClassName: "bg-destructive/10",
  },
  suspended: {
    icon: ShieldAlert,
    eyebrow: "Restaurant access suspended",
    title: "Your restaurant account is temporarily suspended",
    description:
      "Owner dashboard access is paused while the admin team reviews your restaurant account.",
    detailTitle: "What to do next",
    detailDescription:
      "Please contact support or an administrator for details and help restoring access.",
    iconClassName: "text-destructive",
    iconBackgroundClassName: "bg-destructive/10",
  },
};

export default function OwnerStatusPage() {
  const statusQuery = useOwnerRestaurantStatus();

  if (statusQuery.isPending) {
    return (
      <RouteLoadingState
        title="Checking restaurant status"
        description="We are loading the latest review status for your restaurant."
      />
    );
  }

  if (statusQuery.isError) {
    return (
      <OwnerStatusErrorState
        onRetry={() => void statusQuery.refetch()}
        isRetrying={statusQuery.isFetching}
      />
    );
  }

  const restaurant = statusQuery.data;

  if (restaurant.status === "approved") {
    return <Navigate to="/owner/dashboard" replace />;
  }

  const content = statusContent[restaurant.status];
  const StatusIcon = content.icon;
  const reason =
    restaurant.status === "rejected"
      ? restaurant.rejectionReason
      : restaurant.status === "suspended"
        ? restaurant.suspensionReason
        : null;

  return (
    <main className="min-h-dvh bg-background px-4 py-14 text-foreground sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <header className="text-center">
          <div
            className={`mx-auto flex size-14 items-center justify-center rounded-full ${content.iconBackgroundClassName} ${content.iconClassName}`}
          >
            <StatusIcon className="size-7" aria-hidden="true" />
          </div>

          <p
            className={`mt-5 text-xs font-semibold uppercase tracking-wider ${content.iconClassName}`}
          >
            {content.eyebrow}
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {content.description}
          </p>
        </header>

        <div className="my-10 h-px bg-border" />

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex gap-3">
              <FileSearch
                className={`mt-0.5 size-5 shrink-0 ${content.iconClassName}`}
                aria-hidden="true"
              />

              <div>
                <h2 className="text-sm font-medium">{content.detailTitle}</h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {reason || content.detailDescription}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-muted/30 p-5">
            <div className="flex gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />

              <div>
                <h2 className="text-sm font-medium">Status saved securely</h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  You can leave this page and return later to check for updates
                  to {restaurant.name || "your restaurant"}.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
