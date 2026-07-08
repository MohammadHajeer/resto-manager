import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryDialog } from "./CategoryDialog";

export function MenuHeader() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Menu Editor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your restaurant categories, items, and pricing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            className="rounded-full"
            onClick={() => setIsCategoryDialogOpen(true)}
          >
            <Plus className="size-4" />
            New Category
          </Button>
        </div>
      </div>

      <CategoryDialog
        mode="create"
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />
    </>
  );
}
