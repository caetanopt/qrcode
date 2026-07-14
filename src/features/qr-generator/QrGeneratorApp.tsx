"use client";

import { useCallback, useState } from "react";
import type { QRCodeType } from "@/types/qr";
import { DEFAULT_DESIGN } from "@/types/qr";
import { encodePayload } from "@/lib/qr/payload";
import { useLocalStorageState } from "@/lib/utils/useLocalStorageState";
import { useTranslations } from "@/i18n/I18nProvider";
import { TypeSelector } from "./components/TypeSelector";
import { ContentForm } from "./components/ContentForm";
import { DesignPanel } from "./components/DesignPanel";
import { QRPreview } from "@/components/qr/QRPreview";
import { DownloadOptions } from "@/components/qr/DownloadOptions";
import { Button } from "@/components/ui/Button";

export function QrGeneratorApp() {
  const t = useTranslations();
  const [type, setType] = useLocalStorageState<QRCodeType>("caetano-qr:type", "url");
  const [design, setDesign, resetDesign] = useLocalStorageState("caetano-qr:design", DEFAULT_DESIGN);
  const [encodedValue, setEncodedValue] = useState<string | null>(null);
  const [contentStatus, setContentStatus] = useState<"empty" | "invalid" | "valid">("empty");
  const [drafts, setDrafts] = useState<Partial<Record<QRCodeType, Record<string, unknown>>>>({});

  const handleValidChange = useCallback(
    (payload: Record<string, unknown>) => {
      try {
        // ContentForm's switch guarantees payload matches `type` at runtime;
        // TS can't correlate the union here, so the cast is intentional.
        const encoded = encodePayload(type, payload as never);
        setEncodedValue(encoded);
        setContentStatus("valid");
      } catch {
        setEncodedValue(null);
        setContentStatus("invalid");
      }
    },
    [type],
  );

  const handleInvalid = useCallback(() => {
    setEncodedValue(null);
    setContentStatus("invalid");
  }, []);

  const handleDraftChange = useCallback(
    (payload: Record<string, unknown>) => {
      setDrafts((current) => ({ ...current, [type]: payload }));
    },
    [type],
  );

  function handleTypeChange(nextType: QRCodeType) {
    setType(nextType);
    setEncodedValue(null);
    setContentStatus("empty");
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <div className="flex flex-col gap-8">
        <section aria-labelledby="type-heading">
          <h2 id="type-heading" className="mb-3 text-lg font-semibold text-cinza-antracite">
            {t.form.selectType}
          </h2>
          <TypeSelector value={type} onChange={handleTypeChange} />
        </section>

        <section aria-labelledby="content-heading" className="rounded-lg border border-cinza-medio-100 p-4 sm:p-6">
          <h2 id="content-heading" className="mb-4 text-lg font-semibold text-cinza-antracite">
            {t.form.contentTitle}
          </h2>
          <ContentForm
            key={type}
            type={type}
            initialValues={drafts[type]}
            onValidChange={handleValidChange}
            onInvalid={handleInvalid}
            onDraftChange={handleDraftChange}
          />
        </section>

        <section aria-labelledby="design-heading" className="rounded-lg border border-cinza-medio-100 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="design-heading" className="text-lg font-semibold text-cinza-antracite">
              {t.design.title}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => resetDesign()}>
              {t.common.reset}
            </Button>
          </div>
          <DesignPanel design={design} onChange={setDesign} />
        </section>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
        <section
          aria-labelledby="preview-heading"
          className="rounded-lg border border-cinza-medio-100 bg-cinza-medio-50 p-4 sm:p-6"
        >
          <h2 id="preview-heading" className="mb-4 text-lg font-semibold text-cinza-antracite">
            {t.preview.title}
          </h2>
          <QRPreview encodedValue={encodedValue} status={contentStatus} design={design} />
        </section>

        <section aria-labelledby="download-heading" className="rounded-lg border border-cinza-medio-100 p-4 sm:p-6">
          <h2 id="download-heading" className="mb-4 text-lg font-semibold text-cinza-antracite">
            {t.download.title}
          </h2>
          <DownloadOptions encodedValue={contentStatus === "valid" ? encodedValue : null} design={design} />
        </section>
      </div>
    </div>
  );
}
