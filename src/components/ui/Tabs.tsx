"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: (activeValue: string) => React.ReactNode;
  ariaLabel: string;
}

export function Tabs({ items, value, defaultValue, onChange, children, ariaLabel }: TabsProps) {
  const firstItem = items[0];
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstItem?.value ?? "");
  const activeValue = value ?? internalValue;
  const baseId = useId();

  function selectTab(next: string) {
    setInternalValue(next);
    onChange?.(next);
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + items.length) % items.length;
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    selectTab(nextItem.value);
    document.getElementById(`${baseId}-tab-${nextItem.value}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1 border-b border-cinza-medio-100">
        {items.map((item, index) => {
          const selected = item.value === activeValue;
          return (
            <button
              key={item.value}
              id={`${baseId}-tab-${item.value}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex items-center gap-1.5 rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
                selected
                  ? "border-b-2 border-azul-profundo text-azul-profundo"
                  : "text-cinza-antracite-200 hover:text-azul-profundo",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          id={`${baseId}-panel-${item.value}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.value}`}
          hidden={item.value !== activeValue}
          className="pt-4"
        >
          {item.value === activeValue ? children(activeValue) : null}
        </div>
      ))}
    </div>
  );
}
