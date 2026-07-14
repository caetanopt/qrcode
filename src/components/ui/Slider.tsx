"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  hideLabel?: boolean;
}

export function Slider({ label, value, min, max, step = 1, onChange, formatValue, hideLabel }: SliderProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={cn("text-sm font-medium text-cinza-antracite", hideLabel && "sr-only")}>
          {label}
        </label>
        <span className="text-xs text-cinza-antracite-200">{formatValue ? formatValue(value) : value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cinza-medio-100 accent-azul-profundo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan"
      />
    </div>
  );
}
