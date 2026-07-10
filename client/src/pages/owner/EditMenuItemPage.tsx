import { useParams } from "react-router-dom";

import { useOwnerMenuItemById } from "@/hooks/owner/useOwnerMenuItems";
import { MenuItemForm } from "./MenuItemForm";

export default function EditMenuItemPage() {
  const { menuItemId } = useParams();

  const {
    data: menuItem,
    isLoading,
    isError,
  } = useOwnerMenuItemById(menuItemId ?? null);

  if (isLoading) {
    return (
      <main className="space-y-6 p-6">
        <div className="h-20 animate-pulse rounded-3xl bg-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </main>
    );
  }

  if (isError || !menuItem) {
    return (
      <main className="p-6">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
          <h1 className="text-lg font-semibold text-destructive">
            Menu item not found
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This item may have been deleted or you do not have access to it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <MenuItemForm mode="edit" menuItem={menuItem} />
    </main>
  );
}
