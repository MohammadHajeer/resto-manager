import { Edit, GripVertical } from "lucide-react";

import type {
  OwnerCategorySection,
  OwnerMenuSection,
} from "@/services/owner/owner.types";
import { AddMenuItemCard } from "./AddMenuItemCard";
import { MenuItemCard } from "./MenuItemCard";
import { useState } from "react";
import { CategoryDialog } from "./CategoryDialog";

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
      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GripVertical className="size-5 text-muted-foreground/60" />

            <h2 className="text-xl font-bold text-foreground">
              {section.name}
            </h2>

            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {section.itemCount} Items
            </span>
          </div>

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setIsCategoryDialogOpen(true)}
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
