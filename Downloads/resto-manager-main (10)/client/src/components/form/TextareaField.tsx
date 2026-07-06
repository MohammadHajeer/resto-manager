import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Textarea } from "../ui/textarea";

type TextareaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function TextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = "",
}: TextareaFieldProps<TFieldValues>) {
  const textareaId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={`space-y-2 ${className}`}>
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
          <Textarea
            {...field}
            id={textareaId}
            value={String(field.value ?? "")}
            rows={4}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? `${textareaId}-error` : undefined}
            className="min-h-24 rounded-lg border-input bg-background px-3 py-2.5 shadow-none"
          />
          {fieldState.error && (
            <p id={`${textareaId}-error`} className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
