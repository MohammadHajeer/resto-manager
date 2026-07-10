import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

type MenuItemFormHeaderProps = {
  mode: "create" | "edit";
};

export function MenuItemFormHeader({ mode }: MenuItemFormHeaderProps) {
  const navigate = useNavigate();

  const isEditMode = mode === "edit";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 mb-2 gap-2 text-muted-foreground"
          onClick={() => navigate("/owner/menu")}
        >
          <ArrowLeft className="size-4" />
          Back to menu
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isEditMode ? "Edit menu item" : "Create menu item"}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {isEditMode
            ? "Update item details, pricing, add-ons, and availability."
            : "Add a new item to your restaurant menu."}
        </p>
      </div>
    </div>
  );
}
