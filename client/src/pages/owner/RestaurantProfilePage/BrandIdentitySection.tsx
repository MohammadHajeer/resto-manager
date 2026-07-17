import type { Accept } from "react-dropzone";
import { useFormContext, useWatch } from "react-hook-form";

import { FileUpload } from "@/components/form/FileUpload";
import type { UpdateOwnerRestaurantFormValues } from "./types";

const IMAGE_ACCEPT: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export default function BrandIdentitySection() {
  const { control, setValue } =
    useFormContext<UpdateOwnerRestaurantFormValues>();
  const logoUrl = useWatch({ control, name: "logoUrl" });
  const bannerUrl = useWatch({ control, name: "bannerUrl" });

  const removeExistingImage = (field: "logoUrl" | "bannerUrl") => {
    setValue(field, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Brand Identity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your restaurant logo and cover photo to make your profile stand
          out.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-3">
          <FileUpload
            control={control}
            name="bannerFile"
            label="Restaurant banner"
            buttonText="Upload banner"
            accept={IMAGE_ACCEPT}
            fallbackPreview={bannerUrl || undefined}
            onRemoveExisting={() => removeExistingImage("bannerUrl")}
            variant="banner"
          />

          <p className="text-xs text-muted-foreground">
            Wide JPG, PNG, or WEBP up to 5MB. This image appears at the top of
            your public restaurant profile.
          </p>
        </div>

        <div className="min-w-0 flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-5 text-center">
          <FileUpload
            control={control}
            name="logoFile"
            label="Restaurant logo"
            buttonText="Upload logo"
            accept={IMAGE_ACCEPT}
            fallbackPreview={logoUrl || undefined}
            onRemoveExisting={() => removeExistingImage("logoUrl")}
            variant="logo"
          />

          <p className="mt-3 text-xs text-muted-foreground">
            A square JPG, PNG, or WEBP image works best.
          </p>
        </div>
      </div>
    </section>
  );
}
