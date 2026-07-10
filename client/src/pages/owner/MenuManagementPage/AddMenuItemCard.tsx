import { Plus } from "lucide-react";

type AddMenuItemCardProps = {
  onClick: () => void;
};

export function AddMenuItemCard({ onClick }: AddMenuItemCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-background p-6 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
    >
      <Plus className="size-6" />

      <span className="text-xs font-bold uppercase tracking-wide">
        Add New Item
      </span>
    </button>
  );
}
