"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-md border bg-white px-3 text-sm text-cinza-antracite placeholder:text-cinza-medio",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
          "disabled:cursor-not-allowed disabled:bg-cinza-medio-50",
          invalid ? "border-red-500" : "border-cinza-medio-200",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
