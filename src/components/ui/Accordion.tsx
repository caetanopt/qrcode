"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-cinza-medio-100">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-medium text-cinza-antracite",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
          )}
        >
          {title}
          <span
            aria-hidden="true"
            className={cn("transition-transform", open ? "rotate-180" : "rotate-0")}
          >
            ▾
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open} className="pb-4">
        {children}
      </div>
    </div>
  );
}

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-cinza-medio-100">{children}</div>;
}
