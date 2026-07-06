import { useFormContext } from "react-hook-form";
import { Building2, MapPin, Navigation } from "lucide-react";
import type { UpdateOwnerRestaurantFormValues } from "./types";
import { TextField } from "@/components/form/TextField";

export default function AddressSection() {
  const { control } = useFormContext<UpdateOwnerRestaurantFormValues>();

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Address & Location
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Help customers and delivery drivers find your restaurant easily.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-background/60 p-4">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-foreground">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Restaurant Address
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            control={control}
            name="address.city"
            label="City"
            placeholder="Example: Beirut"
            required
            autoComplete="address-level2"
          />

          <TextField
            control={control}
            name="address.street"
            label="Street"
            placeholder="Example: Hamra Street"
            required
            autoComplete="street-address"
          />

          <TextField
            control={control}
            name="address.building"
            label="Building"
            placeholder="Example: Al Noor Building"
            required
          />

          <TextField
            control={control}
            name="address.floor"
            label="Floor"
            placeholder="Example: Ground floor"
          />
        </div>

        <div className="mt-5 rounded-2xl border bg-muted/30 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            Map Location
          </div>

          <TextField
            control={control}
            name="address.locationUrl"
            label="Google Maps URL"
            placeholder="Paste your restaurant location link"
            type="url"
          />

          <p className="mt-3 text-xs text-muted-foreground">
            Optional, but recommended. Add a Google Maps link to make delivery
            and pickup easier.
          </p>
        </div>
      </div>
    </section>
  );
}
