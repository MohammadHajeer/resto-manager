import { Controller, type Control } from "react-hook-form";
import { Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cuisineOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { RestaurantRegisterFormValues } from "../types";
import { TextField } from "@/components/form/TextField";
import { TextareaField } from "@/components/form/TextareaField";

type RestaurantDetailsStepProps = {
  control: Control<RestaurantRegisterFormValues>;
  disabled?: boolean;
};

export function RestaurantDetailsStep({
  control,
  disabled = false,
}: RestaurantDetailsStepProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-6 border-b border-border/80 pb-5 sm:mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Step 2 of 4
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Tell us about your restaurant
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          This information will be displayed to customers on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-x-5 gap-y-5 lg:grid-cols-2">
        <TextField
          control={control}
          name="restaurant.name"
          label="Restaurant Legal Name"
          placeholder="Gourmet Bistro Inc."
          className="lg:col-span-2"
          required
          disabled={disabled}
        />
        <TextareaField
          control={control}
          name="restaurant.description"
          label="Restaurant Description"
          placeholder="Describe your food, atmosphere, and service style."
          className="lg:col-span-2"
          required
          disabled={disabled}
        />

        <TextField
          control={control}
          name="contact.phone"
          type="tel"
          label="Restaurant Phone"
          placeholder="+1 (555) 111-2222"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="contact.email"
          type="email"
          label="Restaurant Email"
          placeholder="hello@restaurant.com"
          disabled={disabled}
        />
        <TextField
          control={control}
          name="address.city"
          label="City"
          placeholder="New York"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="address.street"
          label="Street"
          placeholder="123 Culinary Ave"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="address.building"
          label="Building"
          placeholder="Building A"
          required
          disabled={disabled}
        />
        <TextField
          control={control}
          name="address.floor"
          label="Floor"
          placeholder="Ground floor"
          disabled={disabled}
        />
        <TextField
          control={control}
          name="address.locationUrl"
          type="url"
          label="Location URL"
          placeholder="https://maps.example.com/your-location"
          disabled={disabled}
        />
        <Controller
          control={control}
          name="restaurant.cuisineTypes"
          render={({ field, fieldState }) => {
            const selectedCuisines = field.value ?? [];

            const toggleCuisine = (cuisine: string) => {
              const nextValue = selectedCuisines.includes(cuisine)
                ? selectedCuisines.filter((item) => item !== cuisine)
                : [...selectedCuisines, cuisine];

              field.onChange(nextValue);
            };

            return (
              <div className="mt-3 space-y-3 lg:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-muted p-2 text-muted-foreground">
                    <Tags className="h-4 w-4" aria-hidden="true" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Cuisine Types <span className="text-destructive">*</span>
                    </label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose up to 8 categories that best describe your
                      restaurant.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((cuisine) => {
                    const isSelected = selectedCuisines.includes(cuisine);
                    const isSelectionLimitReached =
                      selectedCuisines.length >= 8 && !isSelected;

                    return (
                      <Button
                        key={cuisine}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCuisine(cuisine)}
                        disabled={disabled || isSelectionLimitReached}
                        aria-pressed={isSelected}
                        className={cn(
                          "rounded-full px-4",
                          !isSelected && "bg-background hover:bg-muted",
                        )}
                      >
                        {cuisine}
                      </Button>
                    );
                  })}
                </div>

                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}

                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  {selectedCuisines.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Selected:{" "}
                      <span className="font-medium text-foreground">
                        {selectedCuisines.join(", ")}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No cuisines selected yet.
                    </p>
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}
