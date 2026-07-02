import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  className = "",
}: SelectFieldProps<TFieldValues>) {
  const selectId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={`space-y-2 ${className}`}>
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
          <select
            {...field}
            id={selectId}
            value={String(field.value ?? "")}
            disabled={disabled}
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? `${selectId}-error` : undefined}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-none outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldState.error && (
            <p id={`${selectId}-error`} className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
