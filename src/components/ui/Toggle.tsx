"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, hideLabel, disabled }: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan focus-visible:ring-offset-2",
          checked ? "bg-azul-profundo" : "bg-cinza-medio-200",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
          aria-hidden="true"
        />
      </button>
      <label htmlFor={id} className={cn("text-sm text-cinza-antracite", hideLabel && "sr-only")}>
        {label}
      </label>
    </div>
  );
}
