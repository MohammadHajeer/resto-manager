import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Input } from "../ui/input";

type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "color";
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  className = "",
}: TextFieldProps<TFieldValues>) {
  const inputId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={`space-y-2 ${className}`}>
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
          <Input
            {...field}
            id={inputId}
            value={String(field.value ?? "")}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? `${inputId}-error` : undefined}
            className="h-11 rounded-lg border-input bg-background px-3 shadow-none"
          />
          {fieldState.error && (
            <p id={`${inputId}-error`} className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
