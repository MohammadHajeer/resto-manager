import type { Control } from "react-hook-form";
import { TextField } from "../../../../components/form/TextField";
import type { RestaurantRegisterFormValues } from "../types";

type BasicInfoStepProps = {
  control: Control<RestaurantRegisterFormValues>;
  disabled?: boolean;
};

export function BasicInfoStep({
  control,
  disabled = false,
}: BasicInfoStepProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-6 border-b border-border/80 pb-5 sm:mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Step 1 of 4
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Tell us about yourself
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          These details will be used to create and secure the owner account.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-x-5 gap-y-5 lg:grid-cols-2">
        <TextField
          control={control}
          name="owner.name"
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          autoComplete="email"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.phone"
          type="tel"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          className="lg:col-span-2"
          autoComplete="new-password"
          required
          disabled={disabled}
        />
      </div>
    </section>
  );
}
