import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import {
  Camera,
  CheckCircle2,
  FileWarning,
  ImageIcon,
  Pencil,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  onRemoveExisting?: () => void;
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
  onRemoveExisting?: () => void;
  variant?: "logo" | "banner" | "document";
  icon?: LucideIcon;
};

type FilePreviewImageProps = {
  file: File | null;
  fallbackPreview?: string;
  alt: string;
  className: string;
};

function FilePreviewImage({
  file,
  fallbackPreview,
  alt,
  className,
}: FilePreviewImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (imageRef.current) {
      imageRef.current.src = objectUrl;
    }

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <img
      ref={imageRef}
      src={file ? undefined : fallbackPreview}
      alt={alt}
      className={className}
    />
  );
}

function fileRejectionMessage(
  rejections: FileRejection[],
  maxSize: number,
  invalidTypeMessage: string,
) {
  const firstError = rejections[0]?.errors[0];

  if (!firstError) return "The selected file could not be uploaded";
  if (firstError.code === "file-invalid-type") return invalidTypeMessage;
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
  onRemoveExisting,
  variant = "document",
  icon: Icon = Upload,
}: FileUploadControlProps) {
  const [dropError, setDropError] = useState<string | null>(null);
  const file = value instanceof File ? value : null;
  const isBanner = variant === "banner";
  const isLogo = variant === "logo";
  const isImage = isLogo || isBanner;
  const isDisabled = disabled || loading;
  const imageFile = file?.type.startsWith("image/") ? file : null;
  const hasPreview = Boolean(imageFile || fallbackPreview);

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        setDropError(
          fileRejectionMessage(fileRejections, maxSize, invalidTypeMessage),
        );
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setDropError(null);
      onChange(selectedFile);
    },
    [invalidTypeMessage, maxSize, onChange],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    accept,
    disabled: isDisabled,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1,
    noClick: isImage,
    noKeyboard: isImage,
    onDrop: handleDrop,
  });

  const visibleError = dropError ?? error;
  const canRemove = Boolean(file || (fallbackPreview && onRemoveExisting));

  const handleRemove = () => {
    setDropError(null);

    if (file) {
      onChange(null);
      return;
    }

    onRemoveExisting?.();
  };

  const removeLabel = file
    ? `Remove selected ${isLogo ? "logo" : "banner"}`
    : `Remove existing ${isLogo ? "logo" : "banner"}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>

      {isLogo ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative mx-auto w-fit rounded-full",
            isDragActive && "ring-4 ring-primary/20",
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              "group/logo relative size-32 overflow-hidden rounded-full border-2 border-dashed bg-background shadow-sm transition sm:size-36",
              hasPreview
                ? "border-border"
                : "border-border hover:border-primary",
              (visibleError || isDragReject) && "border-destructive",
            )}
          >
            {hasPreview ? (
              <>
                <FilePreviewImage
                  file={imageFile}
                  fallbackPreview={fallbackPreview}
                  alt={`${label} preview`}
                  className="size-full rounded-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDisabled}
                  onClick={open}
                  aria-label="Change logo"
                  className="absolute inset-0 h-full w-full flex-col gap-1 rounded-full border-0 bg-black/15 text-white opacity-100 shadow-none transition hover:bg-black/40 hover:text-white focus-visible:bg-black/40 focus-visible:text-white focus-visible:ring-4 focus-visible:ring-white/60"
                >
                  {isDragActive ? (
                    <Upload className="size-5 drop-shadow" aria-hidden="true" />
                  ) : (
                    <Camera className="size-5 drop-shadow" aria-hidden="true" />
                  )}
                  <span className="text-xs font-semibold drop-shadow-md">
                    {isDragActive ? "Drop logo" : "Change logo"}
                  </span>
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                disabled={isDisabled}
                onClick={open}
                className="h-full w-full flex-col gap-2 rounded-full text-muted-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                  <ImageIcon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold">Upload logo</span>
              </Button>
            )}
          </div>

          {canRemove && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    disabled={isDisabled}
                    onClick={handleRemove}
                    aria-label={removeLabel}
                    className="absolute -right-1 -top-1 z-20 border border-destructive/25 bg-card text-destructive shadow-md hover:bg-destructive hover:text-white focus-visible:ring-destructive/30"
                  />
                }
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>{removeLabel}</TooltipContent>
            </Tooltip>
          )}
        </div>
      ) : isBanner ? (
        <div
          {...getRootProps()}
          className={cn(
            "group/banner relative min-h-40 w-full overflow-hidden rounded-xl border border-dashed bg-background shadow-xs transition",
            hasPreview
              ? "aspect-[16/5] border-border"
              : "h-40 border-border",
            isDragActive && "border-primary ring-4 ring-primary/15",
            (visibleError || isDragReject) && "border-destructive",
          )}
        >
          <input {...getInputProps()} />
          {hasPreview ? (
            <>
              <FilePreviewImage
                file={imageFile}
                fallbackPreview={fallbackPreview}
                alt={`${label} preview`}
                className="absolute inset-0 size-full object-cover"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isDisabled}
                  onClick={open}
                  className="h-9 rounded-xl border-white/25 bg-black/55 px-3 text-white shadow-lg backdrop-blur-md hover:border-white/40 hover:bg-black/70 hover:text-white focus-visible:border-white/60 focus-visible:ring-white/50"
                >
                  {isDragActive ? (
                    <Upload className="size-4" aria-hidden="true" />
                  ) : (
                    <Pencil className="size-4" aria-hidden="true" />
                  )}
                  {isDragActive ? "Drop banner" : "Change banner"}
                </Button>

                {canRemove && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          size="icon-lg"
                          variant="destructive"
                          disabled={isDisabled}
                          onClick={handleRemove}
                          aria-label={removeLabel}
                          className="rounded-xl border border-white/25 bg-black/55 text-white shadow-lg backdrop-blur-md hover:border-destructive/70 hover:bg-destructive focus-visible:border-white/60 focus-visible:ring-white/50"
                        />
                      }
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </TooltipTrigger>
                    <TooltipContent>{removeLabel}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Upload className="size-5 text-muted-foreground" aria-hidden="true" />
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isDisabled}
                onClick={open}
                className="rounded-xl"
              >
                {buttonText}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps({
            role: "button",
            "aria-disabled": isDisabled,
            "aria-label": label,
          })}
          className={cn(
            "group flex min-h-36 w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed bg-background p-5 shadow-xs transition-all",
            file
              ? "border-primary/50 bg-primary/5"
              : isDragActive
                ? "border-primary bg-primary/10 ring-3 ring-ring/15"
                : "border-border hover:border-primary hover:bg-primary/5",
            (visibleError || isDragReject) &&
              "border-destructive bg-destructive/5",
            isDisabled && "cursor-not-allowed opacity-70",
          )}
        >
          <input {...getInputProps()} />
          {visibleError ? (
            <FileWarning className="size-10 text-destructive" aria-hidden="true" />
          ) : file ? (
            <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
          ) : (
            <Icon
              className="size-10 text-muted-foreground transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          )}
          <span className="max-w-full truncate text-center text-sm text-muted-foreground transition-colors group-hover:text-primary">
            {loading
              ? "Uploading..."
              : isDragActive
                ? "Drop the file here"
                : file
                  ? file.name
                  : buttonText}
          </span>
        </div>
      )}

      {isImage && file && (
        <p className="flex items-center justify-center gap-2 text-xs font-medium text-primary">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          <span className="max-w-64 truncate">{file.name}</span>
          <span>ready to submit</span>
        </p>
      )}

      {!isImage && file && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={isDisabled}
            onClick={() => {
              setDropError(null);
              onChange(null);
            }}
            className="text-primary hover:text-primary"
          >
            <X className="size-4" aria-hidden="true" />
            Remove file
          </Button>
          <span className="inline-flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Ready to submit
          </span>
        </div>
      )}

      {visibleError && (
        <p role="alert" className="text-sm text-destructive">
          {visibleError}
        </p>
      )}
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
  onRemoveExisting,
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
          onRemoveExisting={onRemoveExisting}
          variant={variant}
          icon={Icon}
        />
      )}
    />
  );
}
