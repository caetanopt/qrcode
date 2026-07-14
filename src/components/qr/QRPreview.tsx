"use client";

import { useMemo, useState } from "react";
import type { QRCodeDesign } from "@/types/qr";
import { buildQrCodeStylingOptions } from "@/lib/qr/qrCodeStylingOptions";
import { hasSufficientContrast } from "@/lib/qr/contrast";
import { useQrCodeInstance } from "./useQrCodeInstance";
import { useDebouncedValue } from "@/lib/utils/useDebouncedValue";
import { useTranslations } from "@/i18n/I18nProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { cn } from "@/lib/utils/cn";

interface QRPreviewProps {
  encodedValue: string | null;
  isContentValid: boolean;
  design: QRCodeDesign;
}

const PREVIEW_SIZE = 280;
const PRINT_TEST_SIZE_MM = 30;

export function QRPreview({ encodedValue, isContentValid, design }: QRPreviewProps) {
  const t = useTranslations();
  const [printTest, setPrintTest] = useState(false);
  const debouncedValue = useDebouncedValue(encodedValue, 250);
  const debouncedDesign = useDebouncedValue(design, 250);

  const options = useMemo(() => {
    if (!debouncedValue) return null;
    return buildQrCodeStylingOptions(debouncedValue, debouncedDesign, printTest ? 400 : PREVIEW_SIZE);
  }, [debouncedValue, debouncedDesign, printTest]);

  const { containerRef, ready } = useQrCodeInstance(options);
  const contrastOk = hasSufficientContrast(design.foregroundColor, design.backgroundColor);
  const showQr = isContentValid && Boolean(encodedValue);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="img"
        aria-label={t.a11y.qrPreviewLabel}
        className={cn(
          "relative flex items-center justify-center rounded-lg border border-cinza-medio-100 bg-white p-4 shadow-sm",
          printTest && "border-2 border-dashed border-azul-cyan-200",
        )}
        style={
          printTest
            ? { width: `${PRINT_TEST_SIZE_MM * 4}px`, height: `${PRINT_TEST_SIZE_MM * 4}px` }
            : { width: `${PREVIEW_SIZE}px`, height: `${PREVIEW_SIZE}px` }
        }
      >
        {/* Kept mounted at all times so the QR instance always has a live container to attach to. */}
        <div ref={containerRef} className={cn(!showQr || !ready ? "invisible" : undefined, "absolute")} />

        {!showQr && !isContentValid && (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <ErrorState title={t.preview.invalid} />
          </div>
        )}
        {!showQr && isContentValid && (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <EmptyState title={t.preview.empty} />
          </div>
        )}
        {showQr && !ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingState label={t.preview.generating} />
          </div>
        )}
      </div>

      {showQr && (
        <>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn("h-2.5 w-2.5 rounded-full", contrastOk ? "bg-verde-eco" : "bg-laranja-dinamico")}
              aria-hidden="true"
            />
            <span className={contrastOk ? "text-cinza-antracite" : "text-laranja-dinamico"}>
              {contrastOk ? t.preview.qualityGood : t.preview.qualityWarning}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPrintTest((current) => !current)}
            className="text-xs font-medium text-azul-profundo underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan"
          >
            {t.preview.printSize}
          </button>
        </>
      )}
    </div>
  );
}
