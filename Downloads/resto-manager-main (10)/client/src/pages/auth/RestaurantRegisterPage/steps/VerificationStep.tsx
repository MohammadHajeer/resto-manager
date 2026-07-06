import type { Control } from "react-hook-form";
import type { Accept } from "react-dropzone";
import { IdCard, Info } from "lucide-react";
import { FileUpload } from "../../../../components/form/FileUpload";
import { DEFAULT_BANNER, type RestaurantRegisterFormValues } from "../types";

const IMAGE_ACCEPT: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const LICENSE_ACCEPT: Accept = {
  ...IMAGE_ACCEPT,
  "application/pdf": [".pdf"],
};

type VerificationStepProps = {
  control: Control<RestaurantRegisterFormValues>;
  disabled?: boolean;
};

export function VerificationStep({
  control,
  disabled = false,
}: VerificationStepProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground">
          Verify and personalize your restaurant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your visual identity and the documents needed for approval.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Restaurant Logo
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Recommended logo size is 500x500px.
            </p>
          </div>

          <FileUpload
            control={control}
            name="uploads.logo"
            label="Restaurant Logo"
            accept={IMAGE_ACCEPT}
            buttonText="Drop your logo here or browse"
            variant="logo"
            disabled={disabled}
          />

        </div>

        <div className="space-y-6 md:border-l md:border-border md:pl-8">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Banner Image
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Used for your digital storefront profile.
            </p>
          </div>

          <FileUpload
            control={control}
            name="uploads.banner"
            label="Restaurant Banner"
            accept={IMAGE_ACCEPT}
            buttonText="Upload Banner"
            fallbackPreview={DEFAULT_BANNER}
            variant="banner"
            disabled={disabled}
          />
        </div>

        <div className="border-t border-border pt-8 md:col-span-2">
          <div className="mb-8 flex items-start gap-3">
            <IdCard className="mt-1 h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Legal Verification
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                To comply with local regulations, please upload your valid
                business operating license.
              </p>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <FileUpload
              control={control}
              name="uploads.businessLicense"
              label="Business Operating License"
              accept={LICENSE_ACCEPT}
              maxSize={10 * 1024 * 1024}
              invalidTypeMessage="Please upload a PDF, JPG, PNG, or WEBP file"
              buttonText="Upload Business License (PDF, JPG, PNG)"
              required
              disabled={disabled}
            />

            <FileUpload
              control={control}
              name="uploads.ownerIdDocument"
              label="Owner ID Document"
              accept={LICENSE_ACCEPT}
              maxSize={10 * 1024 * 1024}
              invalidTypeMessage="Please upload a PDF, JPG, PNG, or WEBP file"
              buttonText="Upload Owner ID Document (PDF, JPG, PNG)"
              required
              disabled={disabled}
            />

            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <Info
                className="mt-0.5 h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm leading-5 text-primary">
                Your information is encrypted and will only be used for identity
                and business verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
