import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

type DocumentPreviewProps = {
  title: string;
  filePath: string;
  signedUrl: string | null;
};

type DocumentCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
  selected: boolean;
  onSelect: () => void;
};

function getDocumentType(path: string) {
  const extension = path.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp"].includes(extension ?? "")) {
    return "image";
  }
  return "unknown";
}

export function DocumentPreview({
  title,
  filePath,
  signedUrl,
}: DocumentPreviewProps) {
  if (!signedUrl) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-6 text-center">
        <FileText className="size-9 text-muted-foreground" aria-hidden="true" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          Document unavailable
        </h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          A secure preview link is not available for this document.
        </p>
      </div>
    );
  }

  const documentType = getDocumentType(filePath);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-border bg-muted/30">
        {documentType === "pdf" && (
          <iframe
            src={signedUrl}
            title={`${title} preview`}
            className="h-128 w-full bg-card"
          />
        )}
        {documentType === "image" && (
          <img
            src={signedUrl}
            alt={`${title} preview`}
            className="max-h-128 w-full object-contain"
          />
        )}
        {documentType === "unknown" && (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <ImageIcon
              className="size-9 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              This file type cannot be previewed here.
            </p>
          </div>
        )}
      </div>

      <Button
        nativeButton={false}
        variant="outline"
        className="w-full rounded-md"
        render={<a href={signedUrl} target="_blank" rel="noreferrer" />}
      >
        <ExternalLink aria-hidden="true" />
        Open document in a new tab
      </Button>
    </div>
  );
}

export function DocumentCard({
  title,
  description,
  icon,
  available,
  selected,
  onSelect,
}: DocumentCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-md border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={`mt-1 size-2 rounded-full ${
          available ? "bg-primary" : "bg-muted-foreground/40"
        }`}
      />
    </button>
  );
}
