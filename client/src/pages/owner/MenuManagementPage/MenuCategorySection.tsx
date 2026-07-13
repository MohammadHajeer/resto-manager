import { Edit, EyeOff, GripVertical } from "lucide-react";

import type {
  OwnerCategorySection,
  OwnerMenuSection,
} from "@/services/owner/owner.types";
import { AddMenuItemCard } from "./AddMenuItemCard";
import { MenuItemCard } from "./MenuItemCard";
import { useState } from "react";
import { CategoryDialog } from "./CategoryDialog";
import { cn } from "@/lib/utils";

type MenuCategorySectionProps = {
  section: OwnerMenuSection;
  onAddItem: () => void;
  onEditItem: (menuItemId: string) => void;
};

export function MenuCategorySection({
  section,
  onAddItem,
  onEditItem,
}: MenuCategorySectionProps) {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const category: OwnerCategorySection = {
    _id: section._id,
    name: section.name,
    description: section.description,
    slug: section.slug,
    isActive: section.isActive,
  };
  return (
    <>
      <section
        className={cn(
          !section.isActive &&
            "rounded-3xl border border-dashed border-muted-foreground/30 bg-muted/30 p-5",
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GripVertical className="size-5 text-muted-foreground/60" />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {section.name}
                </h2>

                {!section.isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                    <EyeOff className="size-3" aria-hidden="true" />
                    Inactive
                  </span>
                )}
              </div>

              {!section.isActive && (
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  This category and its items are hidden from customers.
                </p>
              )}
            </div>

            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {section.itemCount} Items
            </span>
          </div>

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setIsCategoryDialogOpen(true)}
            aria-label={`Edit ${section.name} category`}
          >
            <Edit className="size-4" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {section.items.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onEdit={() => onEditItem(item._id)}
            />
          ))}

          <AddMenuItemCard onClick={onAddItem} />
        </div>
      </section>

      <CategoryDialog
        mode="edit"
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={category}
      />
    </>
  );
}
