import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "@/components/form/TextField";

import type { MenuItemFormValues } from "./";

export function MenuItemAddonsSection() {
  const { control } = useFormContext<MenuItemFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availableAddons",
  });

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Add-ons</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional extras customers can select, like extra cheese or sauce.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => append({ name: "", price: 0 })}
        >
          <Plus className="size-4" />
          Add add-on
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 rounded-2xl border border-border p-4 sm:grid-cols-[1fr_140px_auto]"
            >
              <TextField
                control={control}
                name={`availableAddons.${index}.name`}
                label="Add-on name"
                placeholder="e.g. Extra cheese"
              />

              <TextField
                control={control}
                name={`availableAddons.${index}.price`}
                label="Price"
                placeholder="0.00"
                type="number"
              />

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mb-1 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            No add-ons yet. Add optional extras customers can choose from.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
