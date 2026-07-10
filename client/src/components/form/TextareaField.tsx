import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
type TextareaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
};
export function TextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
  textareaClassName,
  rows = 4,
  maxLength,
  showCharacterCount = false,
  resize = "vertical",
}: TextareaFieldProps<TFieldValues>) {
  const generatedId = useId();
  const textareaId = `${generatedId}-${String(name).replaceAll(".", "-")}`;
  const descriptionId = `${textareaId}-description`;
  const errorId = `${textareaId}-error`;
  const characterCountId = `${textareaId}-character-count`;
  const resizeClass = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  }[resize];
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? "");
        const describedBy = [
          description ? descriptionId : null,
          fieldState.error ? errorId : null,
          showCharacterCount && maxLength ? characterCountId : null,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <div className={cn("space-y-2", className)}>
            {" "}
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-foreground"
            >
              {" "}
              {label}{" "}
              {required && (
                <>
                  {" "}
                  <span className="text-destructive" aria-hidden="true">
                    {" "}
                    *{" "}
                  </span>{" "}
                  <span className="sr-only"> required</span>{" "}
                </>
              )}{" "}
            </label>{" "}
            <Textarea
              {...field}
              id={textareaId}
              value={value}
              rows={rows}
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              maxLength={maxLength}
              aria-required={required}
              aria-invalid={fieldState.invalid}
              aria-describedby={describedBy || undefined}
              className={cn(
                "min-h-24 rounded-lg border-input bg-background px-3 py-2.5 shadow-none",
                "transition-[border-color,box-shadow]",
                "focus-visible:border-primary focus-visible:ring-primary/20",
                fieldState.error &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                resizeClass,
                textareaClassName,
              )}
            />{" "}
            <div
              className={cn(
                "flex items-start gap-3",
                description ? "justify-between" : "justify-end",
              )}
            >
              {" "}
              {description && !fieldState.error && (
                <p
                  id={descriptionId}
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  {" "}
                  {description}{" "}
                </p>
              )}{" "}
              {showCharacterCount && maxLength && (
                <p
                  id={characterCountId}
                  className="shrink-0 text-xs tabular-nums text-muted-foreground"
                  aria-live="polite"
                >
                  {" "}
                  {value.length}/{maxLength}{" "}
                </p>
              )}{" "}
            </div>{" "}
            {fieldState.error && (
              <p
                id={errorId}
                role="alert"
                aria-live="polite"
                className="text-xs leading-relaxed text-destructive"
              >
                {" "}
                {fieldState.error.message}{" "}
              </p>
            )}{" "}
          </div>
        );
      }}
    />
  );
}
