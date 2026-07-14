"use client";

import { useState } from "react";
import type { ExportFormat, QRCodeDesign } from "@/types/qr";
import { EXPORT_SIZES } from "@/types/qr";
import { buildQrCodeStylingOptions } from "@/lib/qr/qrCodeStylingOptions";
import { useTranslations } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";

interface DownloadOptionsProps {
  encodedValue: string | null;
  design: QRCodeDesign;
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "jpeg", label: "JPEG" },
];

export function DownloadOptions({ encodedValue, design }: DownloadOptionsProps) {
  const t = useTranslations();
  const { showToast } = useToast();
  const [format, setFormat] = useState<ExportFormat>("png");
  const [sizeValue, setSizeValue] = useState<number>(512);
  const [customSize, setCustomSize] = useState(false);
  const [fileName, setFileName] = useState("qrcode-caetano");
  const [transparent, setTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const disabled = !encodedValue;

  // Guard against a cleared or out-of-range custom size (e.g. an empty input
  // becomes 0), which would otherwise render a blank or gigantic file.
  const exportSize = Math.min(4096, Math.max(64, Number.isFinite(sizeValue) ? sizeValue : 512));

  async function handleDownload() {
    if (!encodedValue) return;
    setIsDownloading(true);
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const effectiveDesign: QRCodeDesign =
        transparent && format !== "jpeg" ? { ...design, backgroundColor: "transparent" } : design;
      const options = buildQrCodeStylingOptions(encodedValue, effectiveDesign, exportSize);
      const instance = new QRCodeStyling(options);
      await instance.download({ name: fileName || "qrcode-caetano", extension: format });
      showToast(t.download.success, "success");
    } catch {
      showToast(t.download.error, "error");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleCopyImage() {
    if (!encodedValue) return;
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const options = buildQrCodeStylingOptions(encodedValue, design, exportSize);
      const instance = new QRCodeStyling(options);
      const blob = await instance.getRawData("png");
      if (blob instanceof Blob && "clipboard" in navigator && "write" in navigator.clipboard) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        showToast(t.download.copied, "success");
      }
    } catch {
      showToast(t.download.error, "error");
    }
  }

  async function handleCopyContent() {
    if (!encodedValue) return;
    try {
      await navigator.clipboard.writeText(encodedValue);
      showToast(t.download.copied, "success");
    } catch {
      showToast(t.download.error, "error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={t.download.format}>
          {({ inputId }) => (
            <Select
              id={inputId}
              options={FORMAT_OPTIONS}
              value={format}
              onChange={(event) => setFormat(event.target.value as ExportFormat)}
            />
          )}
        </FormField>

        <FormField label={t.download.size}>
          {({ inputId }) =>
            customSize ? (
              <Input
                id={inputId}
                type="number"
                min={64}
                max={4096}
                value={sizeValue}
                onChange={(event) => setSizeValue(Number(event.target.value))}
              />
            ) : (
              <Select
                id={inputId}
                options={EXPORT_SIZES.map((size) => ({ value: String(size.value), label: size.label }))}
                value={String(sizeValue)}
                onChange={(event) => setSizeValue(Number(event.target.value))}
              />
            )
          }
        </FormField>
      </div>

      <Toggle
        checked={customSize}
        onChange={setCustomSize}
        label={t.download.customSize}
      />

      <FormField label={t.download.fileName}>
        {({ inputId }) => (
          <Input
            id={inputId}
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            placeholder={t.download.fileNamePlaceholder}
          />
        )}
      </FormField>

      {format !== "jpeg" && (
        <Toggle checked={transparent} onChange={setTransparent} label={t.download.transparentBackground} />
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDownload} disabled={disabled} loading={isDownloading}>
          {isDownloading ? t.download.downloading : t.download.download}
        </Button>
        <Button variant="secondary" onClick={handleCopyImage} disabled={disabled}>
          {t.download.copyImage}
        </Button>
        <Button variant="secondary" onClick={handleCopyContent} disabled={disabled}>
          {t.download.copyContent}
        </Button>
      </div>
    </div>
  );
}
