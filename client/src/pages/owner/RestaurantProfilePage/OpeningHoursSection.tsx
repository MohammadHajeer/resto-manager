import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { CalendarDays, Clock3 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { UpdateOwnerRestaurantFormValues } from "./types";

export default function OpeningHoursSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<UpdateOwnerRestaurantFormValues>();

  const { fields } = useFieldArray({
    control,
    name: "openingHours",
  });

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Clock3 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Opening Hours
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set your standard weekly schedule for customers.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground sm:flex">
          <CalendarDays className="h-3.5 w-3.5" />
          Weekly Schedule
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-background">
        {fields.map((field, index) => (
          <OpeningHourRow
            key={field.id}
            index={index}
            day={field.day}
            isLast={index === fields.length - 1}
          />
        ))}
      </div>

      {errors.openingHours?.message && (
        <p className="mt-3 text-sm text-destructive">
          {errors.openingHours.message}
        </p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Closed days will be visible to customers, but ordering will not be
        available during those days.
      </p>
    </section>
  );
}

type OpeningHourRowProps = {
  index: number;
  day: string;
  isLast: boolean;
};

function OpeningHourRow({ index, day, isLast }: OpeningHourRowProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<UpdateOwnerRestaurantFormValues>();

  const isClosed = useWatch({
    control,
    name: `openingHours.${index}.isClosed`,
  });

  const openTimeError = errors.openingHours?.[index]?.openTime?.message;
  const closeTimeError = errors.openingHours?.[index]?.closeTime?.message;

  return (
    <div
      className={cn(
        "grid gap-4 px-4 py-4 transition sm:grid-cols-[190px_1fr_90px]",
        "items-center",
        !isLast && "border-b",
        isClosed && "bg-muted/30 text-muted-foreground",
      )}
    >
      <div className="flex items-center gap-4">
        <Controller
          control={control}
          name={`openingHours.${index}.isClosed`}
          render={({ field }) => (
            <Switch
              checked={!field.value}
              onCheckedChange={(checked) => {
                field.onChange(!checked);
              }}
              aria-label={`${day} active status`}
            />
          )}
        />

        <p
          className={cn(
            "text-sm font-medium",
            isClosed ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {day}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:max-w-md max-sm:grid-cols-1">
        <Controller
          control={control}
          name={`openingHours.${index}.openTime`}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="time"
                disabled={isClosed}
                className="h-10 rounded-full bg-background px-4 shadow-none disabled:opacity-50"
              />

              {openTimeError && (
                <p className="text-xs text-destructive">{openTimeError}</p>
              )}
            </div>
          )}
        />

        <span className="pt-2 text-sm text-muted-foreground max-sm:text-center">to</span>

        <Controller
          control={control}
          name={`openingHours.${index}.closeTime`}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="time"
                disabled={isClosed}
                className="h-10 rounded-full bg-background px-4 shadow-none disabled:opacity-50"
              />

              {closeTimeError && (
                <p className="text-xs text-destructive">{closeTimeError}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex justify-start sm:justify-end">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium",
            isClosed
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          {isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  );
}
