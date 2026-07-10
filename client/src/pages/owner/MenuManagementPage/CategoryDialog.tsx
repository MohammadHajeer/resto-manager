import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@restomanager/validators";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TextField } from "@/components/form/TextField";
import { TextareaField } from "@/components/form/TextareaField";

import {
  useCreateOwnerCategory,
  useUpdateOwnerCategory,
} from "@/hooks/owner/useOwnerCateogories";

import type { OwnerCategorySection } from "@/services/owner/owner.types";

type CategoryDialogMode = "create" | "edit";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CategoryDialogMode;
  category?: OwnerCategorySection | null;
};

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
}: CategoryDialogProps) {
  const createCategoryMutation = useCreateOwnerCategory();
  const updateCategoryMutation = useUpdateOwnerCategory();

  const { control, handleSubmit, reset, formState: {isDirty} } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const isEditMode = mode === "edit";

  const isPending =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;


  useEffect(() => {
    if (!open) return;

    if (isEditMode && category) {
      reset({
        name: category.name,
        description: category.description ?? "",
      });

      return;
    }

    reset({
      name: "",
      description: "",
    });
  }, [open, isEditMode, category, reset]);

  const onSubmit = (values: CreateCategoryInput) => {
    const payload = {
      name: values.name,
      description: values.description?.trim() || "",
    };

    if (isEditMode) {
      if (!category?._id) return;

      updateCategoryMutation.mutate(
        {
          categoryId: category._id,
          payload,
        },
        {
          onSuccess: () => {
            toast.success("Category updated successfully");
            reset();
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Failed to update category");
          },
        },
      );

      return;
    }

    createCategoryMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Category created successfully");
        reset();
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Failed to create category");
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit category" : "Create category"}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Update this menu section name or description."
              : "Add a new menu section such as Burgers, Pizza, Drinks, or Desserts."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <TextField
            control={control}
            name="name"
            label="Category name"
            placeholder="e.g. Signature Pizzas"
            required
            disabled={isPending}
          />

          <TextareaField
            control={control}
            name="description"
            label="Description"
            placeholder="Short description for this category..."
            disabled={isPending}
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
