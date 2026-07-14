"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, invalid, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-md border bg-white px-3 text-sm text-cinza-antracite",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
          "disabled:cursor-not-allowed disabled:bg-cinza-medio-50",
          invalid ? "border-red-500" : "border-cinza-medio-200",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);
Select.displayName = "Select";
