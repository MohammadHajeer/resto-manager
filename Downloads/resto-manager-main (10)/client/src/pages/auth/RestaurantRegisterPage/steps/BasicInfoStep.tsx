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
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground">
          Tell us about yourself
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These details will be used to create and secure the owner account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
        <TextField
          control={control}
          name="owner.name"
          label="Full Name"
          placeholder="John Doe"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.phone"
          type="tel"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="owner.confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          className="md:col-span-2"
          required
          disabled={disabled}
        />
      </div>
    </section>
  );
}
