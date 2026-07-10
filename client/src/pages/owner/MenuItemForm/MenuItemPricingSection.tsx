import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "@/components/form/TextField";

import type { MenuItemFormValues } from "./";

export function MenuItemPricingSection() {
  const { control } = useFormContext<MenuItemFormValues>();

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>

      <CardContent>
        <TextField
          control={control}
          name="price"
          label="Price"
          placeholder="0.00"
          type="number"
          required
        />
      </CardContent>
    </Card>
  );
}
