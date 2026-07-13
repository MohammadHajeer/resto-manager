import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EyeOff, Loader2 } from "lucide-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

import { TextField } from "@/components/form/TextField";
import { TextareaField } from "@/components/form/TextareaField";

import {
  useCreateOwnerCategory,
  useDeleteOwnerCategory,
  useRestoreOwnerCategory,
  useUpdateOwnerCategory,
} from "@/hooks/owner/useOwnerCateogories";

import type { OwnerCategorySection } from "@/services/owner/owner.types";
import { cn } from "@/lib/utils";

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
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const createCategoryMutation = useCreateOwnerCategory();
  const updateCategoryMutation = useUpdateOwnerCategory();
  const deactivateCategoryMutation = useDeleteOwnerCategory();
  const restoreCategoryMutation = useRestoreOwnerCategory();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const isEditMode = mode === "edit";

  const isFormPending =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;
  const isStatusPending =
    deactivateCategoryMutation.isPending || restoreCategoryMutation.isPending;
  const isPending = isFormPending || isStatusPending;

  const categoryId = category?._id;
  const categoryName = category?.name;
  const categoryDescription = category?.description;

  useEffect(() => {
    if (!open) return;

    if (isEditMode && categoryId && categoryName) {
      reset({
        name: categoryName,
        description: categoryDescription ?? "",
      });

      return;
    }

    reset({
      name: "",
      description: "",
    });
  }, [
    open,
    isEditMode,
    categoryId,
    categoryName,
    categoryDescription,
    reset,
  ]);

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
    if (!nextOpen && isPending) return;

    if (!nextOpen) {
      reset();
      setIsDeactivateDialogOpen(false);
    }

    onOpenChange(nextOpen);
  };

  const handleStatusChange = (nextIsActive: boolean) => {
    if (!category?._id || isStatusPending) return;

    if (!nextIsActive) {
      setIsDeactivateDialogOpen(true);
      return;
    }

    restoreCategoryMutation.mutate(category._id, {
      onSuccess: () => {
        toast.success("Category restored successfully");
      },
      onError: () => {
        toast.error("Failed to restore category");
      },
    });
  };

  const handleDeactivate = () => {
    if (!category?._id) return;

    deactivateCategoryMutation.mutate(category._id, {
      onSuccess: () => {
        toast.success("Category deactivated successfully");
        setIsDeactivateDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to deactivate category");
      },
    });
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

          {isEditMode && category && (
            <div
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl border p-4 transition-colors",
                category.isActive
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5",
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    Active Category
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      category.isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.isActive
                    ? "This category is available on your customer-facing menu."
                    : "This category and its items are hidden from customers."}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isStatusPending && (
                  <Loader2
                    className="size-4 animate-spin text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                <Switch
                  checked={category.isActive}
                  disabled={isPending}
                  onCheckedChange={handleStatusChange}
                  aria-label="Toggle category active status"
                />
              </div>
            </div>
          )}

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
              {isFormPending
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

      <AlertDialog
        open={isDeactivateDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!deactivateCategoryMutation.isPending) {
            setIsDeactivateDialogOpen(nextOpen);
          }
        }}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 text-card-foreground shadow-xl sm:max-w-md">
          <AlertDialogHeader className="gap-2 p-6 sm:gap-x-4">
            <AlertDialogMedia className="mb-1 size-12 bg-destructive/10 text-destructive sm:mb-0">
              <EyeOff className="size-5" aria-hidden="true" />
            </AlertDialogMedia>

            <AlertDialogTitle className="text-xl font-semibold text-foreground">
              Deactivate {category?.name}?
            </AlertDialogTitle>

            <AlertDialogDescription className="leading-6 text-muted-foreground">
              This category and all of its menu items will be hidden from
              customers. The items will not be deleted, and their availability
              settings will stay the same. Turn the category back on anytime to
              restore them to the menu.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-t border-border bg-muted/30 p-4 sm:px-6">
            <AlertDialogCancel
              size="lg"
              disabled={deactivateCategoryMutation.isPending}
              className="rounded-md"
            >
              Keep active
            </AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              size="lg"
              disabled={deactivateCategoryMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                handleDeactivate();
              }}
              className="rounded-md"
            >
              {deactivateCategoryMutation.isPending ? (
                <>
                  <Loader2
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Deactivating...
                </>
              ) : (
                "Deactivate category"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
