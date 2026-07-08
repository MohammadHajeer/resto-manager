import { Controller, useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextField } from "@/components/form/TextField";
import { TextareaField } from "@/components/form/TextareaField";

import { useOwnerCategories } from "@/hooks/owner/useOwnerCateogories";
import type { MenuItemFormValues } from "./";

export function MenuItemBasicInfoSection() {
  const { control } = useFormContext<MenuItemFormValues>();

  const { data: categories = [], isLoading } = useOwnerCategories();

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <TextField
          control={control}
          name="name"
          label="Item name"
          placeholder="e.g. Truffle Mushroom Pizza"
          required
        />

        <TextareaField
          control={control}
          name="description"
          label="Description"
          placeholder="Describe the item clearly for customers..."
          required
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Category <span className="text-destructive">*</span>
              </label>

              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.error && (
                <p className="text-xs text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}