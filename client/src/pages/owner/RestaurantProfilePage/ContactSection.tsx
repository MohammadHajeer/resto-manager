import { useFormContext } from "react-hook-form";
import { Mail, Phone } from "lucide-react";
import type { UpdateOwnerRestaurantFormValues } from "./types";
import { TextField } from "@/components/form/TextField";


export default function ContactSection() {
  const { control } = useFormContext<UpdateOwnerRestaurantFormValues>();

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Phone className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Contact Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your restaurant contact details updated so customers can reach
            you when needed.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border bg-background/60 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Phone Number
          </div>

          <TextField
            control={control}
            name="contact.phone"
            label="Restaurant Phone"
            placeholder="Example: +961 70 123 456"
            type="tel"
            required
            autoComplete="tel"
          />

          <p className="mt-3 text-xs text-muted-foreground">
            This number may be used by customers or delivery staff to contact
            your restaurant.
          </p>
        </div>

        <div className="rounded-2xl border bg-background/60 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Address
          </div>

          <TextField
            control={control}
            name="contact.email"
            label="Restaurant Email"
            placeholder="Example: restaurant@example.com"
            type="email"
            autoComplete="email"
          />

          <p className="mt-3 text-xs text-muted-foreground">
            Optional, but useful for business communication and support.
          </p>
        </div>
      </div>
    </section>
  );
}