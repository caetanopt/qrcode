"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
}

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function ColorPicker({ label, value, onChange, hideLabel }: ColorPickerProps) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const invalid = draft.length > 0 && !HEX_PATTERN.test(draft);

  function commit(next: string) {
    setDraft(next);
    if (HEX_PATTERN.test(next)) {
      onChange(next);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={cn("text-sm font-medium text-cinza-antracite", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          value={HEX_PATTERN.test(draft) ? draft : value}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange(event.target.value);
          }}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-md border border-cinza-medio-200 p-0.5"
        />
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => commit(event.target.value)}
          aria-invalid={invalid || undefined}
          placeholder="#002E5D"
          className={cn(
            "h-10 w-full rounded-md border bg-white px-3 text-sm text-cinza-antracite",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
            invalid ? "border-red-500" : "border-cinza-medio-200",
          )}
        />
      </div>
    </div>
  );
}
