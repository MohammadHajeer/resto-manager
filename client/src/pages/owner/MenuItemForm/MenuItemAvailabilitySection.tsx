import { Controller, useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import type { MenuItemFormValues } from "./";

export function MenuItemAvailabilitySection() {
  const { control } = useFormContext<MenuItemFormValues>();

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Availability</CardTitle>
      </CardHeader>

      <CardContent>
        <Controller
          control={control}
          name="isAvailable"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
              <div>
                <p className="font-medium text-foreground">
                  Available to order
                </p>
                <p className="text-sm text-muted-foreground">
                  Customers can see and order this item.
                </p>
              </div>

              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
