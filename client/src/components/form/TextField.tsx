import { useId, useState, type HTMLInputTypeAttribute } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

            <div className="relative">
              <Input
                {...field}
                id={inputId}
                type={
                  type === "password" && isPasswordVisible ? "text" : type
                }
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
                  "h-11 rounded-xl border-input bg-background px-4 shadow-xs",
                  "transition-[border-color,box-shadow]",
                  "focus-visible:border-primary focus-visible:ring-primary/20",
                  fieldState.error &&
                    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                  type === "color" && "cursor-pointer p-1.5",
                  type === "password" && "pr-11",
                  inputClassName,
                )}
              />

              {type === "password" && (
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  disabled={disabled}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isPasswordVisible}
                  className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>

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
