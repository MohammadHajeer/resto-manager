import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { createMenuItemSchema } from "@restomanager/validators";

import { Button } from "@/components/ui/button";
import {
  useCreateOwnerMenuItem,
  useUpdateOwnerMenuItem,
} from "@/hooks/owner/useOwnerMenuItems";

import type { OwnerMenuItem } from "@/services/owner/owner.types";

import { MenuItemFormHeader } from "./MenuItemFormHeader";
import { MenuItemBasicInfoSection } from "./MenuItemBasicInfoSection";
import { MenuItemPricingSection } from "./MenuItemPricingSection";
import { MenuItemMediaSection } from "./MenuItemMediaSection";
import { MenuItemIngredientsSection } from "./MenuItemIngredientsSection";
import { MenuItemAddonsSection } from "./MenuItemAddonsSection";
import { MenuItemAvailabilitySection } from "./MenuItemAvailabilitySection";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";

const menuItemFormSchema = createMenuItemSchema.extend({
  imageFile: z.instanceof(File).optional().nullable(),
});

export type MenuItemFormValues = z.input<typeof menuItemFormSchema>;

type MenuItemFormSubmitValues = z.output<typeof menuItemFormSchema>;

type MenuItemFormProps = {
  mode: "create" | "edit";
  defaultCategoryId?: string;
  menuItem?: OwnerMenuItem;
};

export function MenuItemForm({
  mode,
  defaultCategoryId,
  menuItem,
}: MenuItemFormProps) {
  const navigate = useNavigate();

  const createMenuItemMutation = useCreateOwnerMenuItem();
  const updateMenuItemMutation = useUpdateOwnerMenuItem();

  const isEditMode = mode === "edit";

  const form = useForm<MenuItemFormValues, unknown, MenuItemFormSubmitValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      categoryId: defaultCategoryId ?? "",
      name: "",
      description: "",
      price: 0,
      imageUrl: null,
      imageFile: null,
      ingredients: [],
      availableAddons: [],
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (!isEditMode || !menuItem) return;

    form.reset({
      categoryId: menuItem.categoryId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
      imageFile: null,
      ingredients: menuItem.ingredients ?? [],
      availableAddons: menuItem.availableAddons ?? [],
      isAvailable: menuItem.isAvailable,
    });
  }, [isEditMode, menuItem, form]);

  const isPending =
    createMenuItemMutation.isPending || updateMenuItemMutation.isPending;

  const isFormDirty = form.formState.isDirty;

  useUnsavedChangesWarning(isFormDirty);

  const onSubmit = (values: MenuItemFormSubmitValues) => {
    if (isEditMode) {
      if (!menuItem?._id) return;

      updateMenuItemMutation.mutate(
        {
          menuItemId: menuItem._id,
          payload: values,
        },
        {
          onSuccess: () => {
            toast.success("Menu item updated successfully");
            navigate("/owner/menu");
          },
          onError: () => {
            toast.error("Failed to update menu item");
          },
        },
      );

      return;
    }

    createMenuItemMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Menu item created successfully");
        navigate("/owner/menu");
      },
      onError: () => {
        toast.error("Failed to create menu item");
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="space-y-6"
      >
        <MenuItemFormHeader mode={mode} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <MenuItemBasicInfoSection />
            <MenuItemPricingSection />
            <MenuItemIngredientsSection />
            <MenuItemAddonsSection />
          </div>

          <div className="space-y-6">
            <MenuItemMediaSection />
            <MenuItemAvailabilitySection />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/owner/menu")}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending || !isFormDirty}>
            {isPending
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save changes"
                : "Create item"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
