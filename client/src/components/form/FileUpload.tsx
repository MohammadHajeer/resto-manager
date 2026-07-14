import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import {
  CheckCircle,
  FileWarning,
  Image,
  Pencil,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";

const DEFAULT_IMAGE_ACCEPT: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

type FileUploadProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  buttonText: string;
  accept?: Accept;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  maxSize?: number;
  maxFiles?: number;
  invalidTypeMessage?: string;
  fallbackPreview?: string;
  variant?: "logo" | "banner" | "document";
  icon?: LucideIcon;
};

type FileUploadControlProps = {
  value: unknown;
  error?: string;
  onChange: (file: File | null) => void;
  label: string;
  buttonText: string;
  accept: Accept;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  maxSize: number;
  maxFiles: number;
  invalidTypeMessage: string;
  fallbackPreview?: string;
  variant?: "logo" | "banner" | "document";
  icon?: LucideIcon;
};

function fileRejectionMessage(
  rejections: FileRejection[],
  maxSize: number,
  invalidTypeMessage: string,
) {
  const firstError = rejections[0]?.errors[0];

  if (!firstError) {
    return "The selected file could not be uploaded";
  }

  if (firstError.code === "file-invalid-type") {
    return invalidTypeMessage;
  }

  if (firstError.code === "file-too-large") {
    return `File must be ${Math.round(maxSize / (1024 * 1024))}MB or smaller`;
  }

  if (firstError.code === "too-many-files") {
    return "Please upload one file only";
  }

  return firstError.message;
}

function FileUploadControl({
  value,
  error,
  onChange,
  label,
  buttonText,
  accept,
  required = false,
  disabled = false,
  loading = false,
  maxSize,
  maxFiles,
  invalidTypeMessage,
  fallbackPreview,
  variant = "document",
  icon: Icon = Upload,
}: FileUploadControlProps) {
  const [dropError, setDropError] = useState<string | null>(null);
  const file = value instanceof File ? value : null;
  const isBanner = variant === "banner";
  const isLogo = variant === "logo";
  const isDisabled = disabled || loading;

  const previewUrl = useMemo(() => {
    if (!file || !file.type.startsWith("image/")) {
      return fallbackPreview ?? null;
    }

    return URL.createObjectURL(file);
  }, [fallbackPreview, file]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== fallbackPreview) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [fallbackPreview, previewUrl]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        setDropError(
          fileRejectionMessage(fileRejections, maxSize, invalidTypeMessage),
        );
        return;
      }

      const selectedFile = acceptedFiles[0];

      if (!selectedFile) {
        return;
      }

      setDropError(null);
      onChange(selectedFile);
    },
    [invalidTypeMessage, maxSize, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept,
      disabled: isDisabled,
      maxFiles,
      maxSize,
      multiple: maxFiles > 1,
      onDrop: handleDrop,
    });

  const visibleError = dropError ?? error;
  const showImagePreview = Boolean(previewUrl && (isLogo || isBanner));
  const UploadIcon = isBanner ? Pencil : file ? CheckCircle : Icon;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>

      <div
        {...getRootProps({
          role: "button",
          "aria-disabled": isDisabled,
          "aria-label": label,
        })}
        className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border border-dashed shadow-xs transition-all ${
          isBanner
            ? "h-40 bg-cover bg-center"
            : "flex min-h-36 flex-col items-center justify-center gap-3 bg-background p-5"
        } ${
          visibleError || isDragReject
            ? "border-destructive bg-destructive/5"
            : file
              ? "border-primary/50 bg-primary/5"
              : isDragActive
                ? "border-primary bg-primary/10 ring-3 ring-ring/15"
                : "border-border bg-background hover:border-primary hover:bg-primary/5"
        } ${isDisabled ? "cursor-not-allowed opacity-70" : ""}`}
        style={
          isBanner && previewUrl
            ? { backgroundImage: `url('${previewUrl}')` }
            : undefined
        }
      >
        <input {...getInputProps()} />

        {isBanner && previewUrl && (
          <span className="absolute inset-0 bg-foreground/35 transition-colors group-hover:bg-foreground/45" />
        )}

        {isLogo && showImagePreview ? (
          <span className="flex flex-col items-center gap-2">
            <img
              src={previewUrl ?? ""}
              alt={`${label} preview`}
              className="h-20 w-20 rounded-lg border border-border object-cover"
            />
            <span className="max-w-60 truncate text-sm font-medium text-primary">
              {file?.name}
            </span>
          </span>
        ) : (
          <span
            className={`relative z-10 flex items-center gap-2 ${
              isBanner
                ? "rounded-full bg-card/90 px-4 py-2 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground"
                : "flex-col"
            } transition-all`}
          >
            {visibleError ? (
              <FileWarning
                className={`${
                  isBanner ? "h-5 w-5" : "h-10 w-10"
                } text-destructive`}
                aria-hidden="true"
              />
            ) : (
              <UploadIcon
                className={`${
                  isBanner ? "h-5 w-5" : "h-10 w-10"
                } ${
                  file
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                } transition-colors`}
                aria-hidden="true"
              />
            )}
            <span className="text-center text-sm text-muted-foreground transition-colors group-hover:text-primary">
              {loading
                ? "Uploading..."
                : isDragActive
                  ? "Drop the image here"
                  : file
                    ? file.name
                    : buttonText}
            </span>
          </span>
        )}
      </div>

      {file && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isDisabled}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              setDropError(null);
              onChange(null);
            }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Remove file
          </button>
          <span className="inline-flex items-center gap-2 text-sm text-primary">
            <Image className="h-4 w-4" aria-hidden="true" />
            Ready to submit
          </span>
        </div>
      )}

      {visibleError && <p className="text-sm text-destructive">{visibleError}</p>}
    </div>
  );
}

export function FileUpload<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  buttonText,
  accept = DEFAULT_IMAGE_ACCEPT,
  required = false,
  disabled = false,
  loading = false,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles = 1,
  invalidTypeMessage = "Please upload a JPG, PNG, or WEBP image",
  fallbackPreview,
  variant = "document",
  icon: Icon = Upload,
}: FileUploadProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <FileUploadControl
          value={value}
          error={fieldState.error?.message}
          onChange={onChange}
          label={label}
          buttonText={buttonText}
          accept={accept}
          required={required}
          disabled={disabled}
          loading={loading}
          maxSize={maxSize}
          maxFiles={maxFiles}
          invalidTypeMessage={invalidTypeMessage}
          fallbackPreview={fallbackPreview}
          variant={variant}
          icon={Icon}
        />
      )}
    />
  );
}
