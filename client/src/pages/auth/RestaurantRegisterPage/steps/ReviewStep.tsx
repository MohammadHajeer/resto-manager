import type { RestaurantRegisterFormValues } from "../types";

type ReviewStepProps = {
  values: RestaurantRegisterFormValues;
};

function ReviewItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="border-b border-border py-4 last:border-b-0 md:nth-last-[-n+2]:border-b-0">
      <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm text-foreground">
        {value?.trim() || "Not provided"}
      </dd>
    </div>
  );
}

export function ReviewStep({ values }: ReviewStepProps) {
  return (
    <section className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground">
            Review Application
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm the details below before submitting your restaurant for
            approval.
          </p>
        </div>

        <dl className="grid grid-cols-1 rounded-lg border border-border px-4 md:grid-cols-2 md:gap-x-8 md:px-6">
          <ReviewItem label="Owner" value={values.owner.name} />
          <ReviewItem label="Owner Email" value={values.owner.email} />
          <ReviewItem label="Restaurant" value={values.restaurant.name} />
          <ReviewItem
            label="Cuisines"
            value={values.restaurant.cuisineTypes.join(", ")}
          />
          <ReviewItem label="Restaurant Phone" value={values.contact.phone} />
          <ReviewItem label="Restaurant Email" value={values.contact.email} />
          <ReviewItem label="City" value={values.address.city} />
          <ReviewItem label="Street" value={values.address.street} />
          <ReviewItem label="Building" value={values.address.building} />
          <ReviewItem label="Floor" value={values.address.floor} />
          <ReviewItem
            label="Logo"
            value={values.uploads.logo?.name ?? "No logo selected"}
          />
          <ReviewItem
            label="Business License"
            value={values.uploads.businessLicense?.name}
          />
          <ReviewItem
            label="Owner ID Document"
            value={values.uploads.ownerIdDocument?.name}
          />
        </dl>
    </section>
  );
}
