import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { MenuItemFormValues } from "./";

export function MenuItemIngredientsSection() {
  const [ingredientInput, setIngredientInput] = useState("");

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MenuItemFormValues>();

  const ingredients: string[] = watch("ingredients") ?? [];

  const handleAddIngredient = () => {
    const ingredient = ingredientInput.trim();

    if (!ingredient) return;

    const alreadyExists = ingredients.some(
      (item) => item.toLowerCase() === ingredient.toLowerCase(),
    );

    if (alreadyExists) {
      setIngredientInput("");
      return;
    }

    setValue("ingredients", [...ingredients, ingredient], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setIngredientInput("");
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setValue(
      "ingredients",
      ingredients.filter((item) => item !== ingredient),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            value={ingredientInput}
            onChange={(event) => setIngredientInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddIngredient();
              }
            }}
            placeholder="e.g. Mozzarella, tomato sauce, basil"
            className="h-11 rounded-lg"
          />

          <Button type="button" onClick={handleAddIngredient}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>

        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium"
              >
                {ingredient}

                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No ingredients added yet.
          </p>
        )}

        {errors.ingredients && (
          <p className="text-xs text-destructive">
            {errors.ingredients.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
