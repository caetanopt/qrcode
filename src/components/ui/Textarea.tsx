"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-md border bg-white px-3 py-2 text-sm text-cinza-antracite placeholder:text-cinza-medio",
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
Textarea.displayName = "Textarea";
