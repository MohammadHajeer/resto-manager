import { useId, type HTMLInputTypeAttribute } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: Extract<
    HTMLInputTypeAttribute,
    "text" | "email" | "tel" | "password" | "url" | "color" | "number"
  >;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  autoComplete?: string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  min?: number;
  max?: number;
  step?: number | "any";
};

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  required = false,
  disabled = false,
  className,
  inputClassName,
  autoComplete,
  inputMode,
  min,
  max,
  step,
}: TextFieldProps<TFieldValues>) {
  const generatedId = useId();
  const inputId = `${generatedId}-${String(name).replaceAll(".", "-")}`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const describedBy = [
          description ? descriptionId : null,
          fieldState.error ? errorId : null,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className={cn("space-y-2", className)}>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-foreground"
            >
              {label}

              {required && (
                <>
                  <span className="text-destructive" aria-hidden="true">
                    {" "}
                    *
                  </span>
                  <span className="sr-only"> required</span>
                </>
              )}
            </label>

            <Input
              {...field}
              id={inputId}
              type={type}
              value={field.value ?? ""}
              required={required}
              disabled={disabled}
              autoComplete={autoComplete}
              inputMode={inputMode}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              aria-required={required}
              aria-invalid={fieldState.invalid}
              aria-describedby={describedBy || undefined}
              onChange={(event) => {
                if (type === "number") {
                  const value = event.currentTarget.value;

                  field.onChange(
                    value === "" ? "" : event.currentTarget.valueAsNumber,
                  );

                  return;
                }

                field.onChange(event.currentTarget.value);
              }}
              className={cn(
                "h-11 rounded-lg border-input bg-background px-3 shadow-none",
                "transition-[border-color,box-shadow]",
                "focus-visible:border-primary focus-visible:ring-primary/20",
                fieldState.error &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                type === "color" && "cursor-pointer p-1.5",
                inputClassName,
              )}
            />

            {description && !fieldState.error && (
              <p
                id={descriptionId}
                className="text-xs leading-relaxed text-muted-foreground"
              >
                {description}
              </p>
            )}

            {fieldState.error && (
              <p
                id={errorId}
                role="alert"
                aria-live="polite"
                className="text-xs leading-relaxed text-destructive"
              >
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}