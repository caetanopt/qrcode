"use client";

import { useId } from "react";
import type { QRCodeType } from "@/types/qr";
import { QR_CODE_TYPES } from "@/types/qr";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

interface TypeSelectorProps {
  value: QRCodeType;
  onChange: (type: QRCodeType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const t = useTranslations();
  const baseId = useId();

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const delta = moves[event.key];
    if (!delta) return;
    event.preventDefault();
    const nextIndex = (index + delta + QR_CODE_TYPES.length) % QR_CODE_TYPES.length;
    const nextType = QR_CODE_TYPES[nextIndex];
    if (!nextType) return;
    onChange(nextType);
    document.getElementById(`${baseId}-${nextType}`)?.focus();
  }

  return (
    <div role="radiogroup" aria-label={t.form.selectType} className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
      {QR_CODE_TYPES.map((type, index) => {
        const selected = type === value;
        return (
          <button
            key={type}
            id={`${baseId}-${type}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(type)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-md border p-3 text-left transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
              selected
                ? "border-azul-profundo bg-azul-profundo-50 text-azul-profundo"
                : "border-cinza-medio-100 text-cinza-antracite hover:border-azul-profundo-100",
            )}
          >
            <span className="text-sm font-semibold">{t.qrTypes[type]}</span>
            <span className="text-xs text-cinza-antracite-200">{t.qrTypeDescriptions[type]}</span>
          </button>
        );
      })}
    </div>
  );
}
