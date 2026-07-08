import { useNavigate, useSearchParams } from "react-router-dom";
import { MenuHeader } from "./MenuHeader";
import { MenuStatsBar } from "./MenuStatusBar";
import { MenuToolbar } from "./MenuToolbar";
import { MenuCategorySection } from "./MenuCategorySection";
import { useOwnerRestaurantMenu } from "@/hooks/owner/useOwnerRestaurant";
import type { OwnerMenuStatusFilter } from "@/services/owner/owner.types";

export default function MenuManagementPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? undefined;

  const { data, isLoading, isError } = useOwnerRestaurantMenu({
    search: search || undefined,
    status: status as OwnerMenuStatusFilter,
  });

  const stats = data?.stats;
  const sections = data?.sections ?? [];

  const handleAddItem = (categoryId: string) => {
    navigate(`/owner/menu/new?categoryId=${categoryId}`);
  };

  const handleEditItem = (menuItemId: string) => {
    navigate(`/owner/menu/${menuItemId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-20 animate-pulse rounded-3xl bg-muted" />
        <div className="h-16 animate-pulse rounded-3xl bg-muted" />
        <div className="h-72 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="text-lg font-semibold text-destructive">
            Failed to load menu
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-7">
      <MenuHeader />

      <MenuStatsBar stats={stats} />

      <MenuToolbar />

      <div className="space-y-12">
        {sections.map((section) => (
          <MenuCategorySection
            key={section._id}
            section={section}
            onAddItem={() => handleAddItem(section._id)}
            onEditItem={handleEditItem}
          />
        ))}
      </div>
    </main>
  );
}
