import { useEffect, useMemo, useRef } from "react";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { MenuItemFormValues } from "./";

export function MenuItemMediaSection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { watch, setValue } = useFormContext<MenuItemFormValues>();

  const imageFile = watch("imageFile");
  const imageUrl = watch("imageUrl");

  const previewUrl = useMemo(() => {
    if (imageFile instanceof File) {
      return URL.createObjectURL(imageFile);
    }

    return imageUrl || null;
  }, [imageFile, imageUrl]);

  useEffect(() => {
    if (!(imageFile instanceof File)) return;

    const objectUrl = URL.createObjectURL(imageFile);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("imageFile", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveImage = () => {
    setValue("imageFile", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("imageUrl", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40">
          {previewUrl ? (
            <div className="relative aspect-4/3">
              <img
                src={previewUrl}
                alt="Menu item preview"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={handleRemoveImage}
                className="absolute right-3 top-3 size-8 rounded-full"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-4/3 w-full flex-col items-center justify-center gap-3 text-muted-foreground transition-colors hover:bg-muted"
            >
              <div className="rounded-2xl bg-background p-4 shadow-sm">
                <ImageIcon className="size-8" />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  Upload item image
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or WebP recommended
                </p>
              </div>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="size-4" />
          {previewUrl ? "Change image" : "Choose image"}
        </Button>
      </CardContent>
    </Card>
  );
}
