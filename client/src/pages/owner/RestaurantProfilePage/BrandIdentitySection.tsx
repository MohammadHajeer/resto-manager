import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UpdateOwnerRestaurantFormValues } from "./types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type ImageFieldName = "logoFile" | "bannerFile";
type UrlFieldName = "logoUrl" | "bannerUrl";

function useImagePreview(file: File | null | undefined, fallbackUrl?: string) {
  const [previewUrl, setPreviewUrl] = useState(fallbackUrl ?? "");

  useEffect(() => {
    if (!file) {
      requestAnimationFrame(() => setPreviewUrl(fallbackUrl ?? ""));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    requestAnimationFrame(() => setPreviewUrl(objectUrl));

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file, fallbackUrl]);

  return previewUrl;
}

type ImageDropzoneProps = {
  title: string;
  description: string;
  fieldName: ImageFieldName;
  urlFieldName: UrlFieldName;
  previewUrl: string;
  variant: "banner" | "logo";
  error?: string;
  className?: string;
};

function ImageDropzone({
  title,
  description,
  fieldName,
  urlFieldName,
  previewUrl,
  variant,
  error,
  className,
}: ImageDropzoneProps) {
  const { setValue, setError, clearErrors } =
    useFormContext<UpdateOwnerRestaurantFormValues>();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: MAX_IMAGE_SIZE,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles, rejectedFiles) => {
      const rejection = rejectedFiles[0];

      if (rejection) {
        setError(fieldName, {
          type: "manual",
          message:
            rejection.errors[0]?.message ??
            "Please upload a valid image under 5MB.",
        });
        return;
      }

      const file = acceptedFiles[0];

      if (!file) return;

      setValue(fieldName, file, {
        shouldDirty: true,
        shouldValidate: true,
      });

      clearErrors(fieldName);
    },
  });

  const handleRemove = () => {
    setValue(fieldName, null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(urlFieldName, "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const isBanner = variant === "banner";

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-dashed bg-background transition",
        "hover:border-primary/60 hover:bg-muted/30",
        isDragActive && "border-primary bg-primary/5",
        isBanner ? "h-44 md:h-56" : "h-32 w-32 rounded-full",
        error && "border-destructive",
        className,
      )}
    >
      <input {...getInputProps()} />

      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt={title}
            className={cn(
              "h-full w-full object-cover",
              !isBanner && "rounded-full",
            )}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={open}
              >
                Replace
              </Button>

              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : isBanner ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="rounded-full border bg-background p-3 shadow-sm">
            <UploadCloud className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          <Button type="button" size="sm" variant="outline" onClick={open}>
            Upload Image
          </Button>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center" onClick={open}>
          <div className="rounded-full border bg-background p-3 shadow-sm">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}

      {error && (
        <p className="absolute bottom-2 left-3 right-3 rounded-md bg-destructive px-2 py-1 text-xs text-destructive-foreground">
          {error}
        </p>
      )}
    </div>
  );
}

export default function BrandIdentitySection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<UpdateOwnerRestaurantFormValues>();

  const logoUrl = useWatch({ control, name: "logoUrl" });
  const bannerUrl = useWatch({ control, name: "bannerUrl" });
  const logoFile = useWatch({ control, name: "logoFile" });
  const bannerFile = useWatch({ control, name: "bannerFile" });

  const logoPreviewUrl = useImagePreview(logoFile, logoUrl);
  const bannerPreviewUrl = useImagePreview(bannerFile, bannerUrl);

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Brand Identity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your restaurant logo and cover photo to make your profile stand
          out.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-3">
          <ImageDropzone
            title="Upload Cover Photo"
            description="Recommended: wide image, JPG, PNG, or WEBP. Max 5MB."
            fieldName="bannerFile"
            urlFieldName="bannerUrl"
            previewUrl={bannerPreviewUrl}
            variant="banner"
            error={errors.bannerFile?.message as string | undefined}
          />

          <p className="text-xs text-muted-foreground">
            This image appears at the top of your public restaurant profile.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-5 text-center">
          <ImageDropzone
            title="Upload Logo"
            description="Square image works best."
            fieldName="logoFile"
            urlFieldName="logoUrl"
            previewUrl={logoPreviewUrl}
            variant="logo"
            error={errors.logoFile?.message as string | undefined}
          />

          <div className="mt-4">
            <p className="text-sm font-medium">Restaurant Logo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click the circle to upload or replace the logo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
