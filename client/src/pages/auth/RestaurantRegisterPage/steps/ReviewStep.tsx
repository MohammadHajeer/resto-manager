import {
  Clock3,
  FileCheck2,
  MapPin,
  Store,
  Tags,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { RestaurantRegisterFormValues } from "../types";

type ReviewStepProps = {
  values: RestaurantRegisterFormValues;
};

type ReviewItemProps = {
  label: string;
  value?: string | null;
  fullWidth?: boolean;
};

function ReviewItem({ label, value, fullWidth = false }: ReviewItemProps) {
  return (
    <div className={fullWidth ? "lg:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 wrap-break-word text-sm leading-6 text-foreground">
        {value?.trim() || "Not provided"}
      </dd>
    </div>
  );
}

function ReviewSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/80 bg-background p-4 shadow-xs sm:p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-border/70 pb-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <h3 className="text-sm font-bold text-foreground sm:text-base">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export function ReviewStep({ values }: ReviewStepProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-6 border-b border-border/80 pb-5 sm:mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Step 4 of 4
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Review your application
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Confirm the details below before submitting your restaurant for
          approval.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReviewSection title="Owner information" icon={UserRound}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            <ReviewItem label="Full name" value={values.owner.name} />
            <ReviewItem label="Email" value={values.owner.email} />
            <ReviewItem label="Phone" value={values.owner.phone} />
          </dl>
        </ReviewSection>

        <ReviewSection title="Restaurant details" icon={Store}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            <ReviewItem
              label="Restaurant name"
              value={values.restaurant.name}
            />
            <ReviewItem
              label="Description"
              value={values.restaurant.description}
              fullWidth
            />
          </dl>
        </ReviewSection>

        <ReviewSection title="Contact and address" icon={MapPin}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            <ReviewItem label="Restaurant phone" value={values.contact.phone} />
            <ReviewItem label="Restaurant email" value={values.contact.email} />
            <ReviewItem label="City" value={values.address.city} />
            <ReviewItem label="Street" value={values.address.street} />
            <ReviewItem label="Building" value={values.address.building} />
            <ReviewItem label="Floor" value={values.address.floor} />
            <ReviewItem
              label="Location URL"
              value={values.address.locationUrl}
              fullWidth
            />
          </dl>
        </ReviewSection>

        <div className="grid grid-cols-1 gap-4">
          <ReviewSection title="Cuisine types" icon={Tags}>
            <p className="text-sm leading-6 text-foreground">
              {values.restaurant.cuisineTypes.join(", ") || "Not provided"}
            </p>
          </ReviewSection>

          <ReviewSection title="Opening hours" icon={Clock3}>
            <p className="text-sm leading-6 text-muted-foreground">
              Opening hours can be added from the owner workspace after the
              restaurant is approved.
            </p>
          </ReviewSection>
        </div>

        <div className="lg:col-span-2">
          <ReviewSection title="Verification documents" icon={FileCheck2}>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
              <ReviewItem
                label="Restaurant logo"
                value={values.uploads.logo?.name ?? "No logo selected"}
              />
              <ReviewItem
                label="Restaurant banner"
                value={values.uploads.banner?.name ?? "Default banner"}
              />
              <ReviewItem
                label="Business license"
                value={values.uploads.businessLicense?.name}
              />
              <ReviewItem
                label="Owner ID document"
                value={values.uploads.ownerIdDocument?.name}
              />
            </dl>
          </ReviewSection>
        </div>
      </div>
    </section>
  );
}
