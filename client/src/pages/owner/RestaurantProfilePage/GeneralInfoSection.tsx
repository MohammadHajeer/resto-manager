import { useFormContext, useWatch } from "react-hook-form";
import { Store, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UpdateOwnerRestaurantFormValues } from "./types";
import { TextField } from "@/components/form/TextField";
import { TextareaField } from "@/components/form/TextareaField";
import { cuisineOptions } from "@/lib/constants";

export default function GeneralInfoSection() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<UpdateOwnerRestaurantFormValues>();

  const selectedCuisines =
    useWatch({
      control,
      name: "cuisineTypes",
    }) ?? [];

  const toggleCuisine = (cuisine: string) => {
    const nextValue = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((item) => item !== cuisine)
      : [...selectedCuisines, cuisine];

    setValue("cuisineTypes", nextValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Store className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            General Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the basic information customers will see on your restaurant
            profile.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <TextField
          control={control}
          name="name"
          label="Restaurant Name"
          placeholder="Example: Green Bowl Kitchen"
          required
          autoComplete="organization"
        />

        <TextareaField
          control={control}
          name="description"
          label="Description"
          placeholder="Tell customers what makes your restaurant special..."
          required
        />

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-muted p-2 text-muted-foreground">
              <Tags className="h-4 w-4" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">
                Cuisine Types <span className="text-destructive">*</span>
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose the categories that best describe your restaurant.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => {
              const isSelected = selectedCuisines.includes(cuisine);

              return (
                <Button
                  key={cuisine}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCuisine(cuisine)}
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

          {errors.cuisineTypes && (
            <p className="text-xs text-destructive">
              {errors.cuisineTypes.message}
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
      </div>
    </section>
  );
}
