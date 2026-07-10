import { useSearchParams } from "react-router-dom";
import { MenuItemForm } from "./MenuItemForm";

export default function AddMenuItemPage() {
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId");

  return (
    <main>
      <MenuItemForm mode="create" defaultCategoryId={categoryId ?? undefined} />
    </main>
  );
}
