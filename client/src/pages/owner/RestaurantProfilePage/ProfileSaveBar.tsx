import { Loader2, RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProfileSaveBarProps = {
  isDirty: boolean;
  isPending: boolean;
  onDiscard: () => void;
};

export function ProfileSaveBar({
  isDirty,
  isPending,
  onDiscard,
}: ProfileSaveBarProps) {
  if (!isDirty) return null;

  return (
    <div className="sticky bottom-4 z-40 mt-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Unsaved changes</p>
          <p className="text-xs text-muted-foreground">
            Save your updates before leaving this page.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={onDiscard}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Discard
          </Button>

          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
