"use client";

import { useState } from "react";
import type { CornerStyle, ModuleStyle, QRCodeDesign } from "@/types/qr";
import { DEFAULT_DESIGN } from "@/types/qr";
import { designHasSufficientContrast } from "@/lib/qr/contrast";
import { ERROR_CORRECTION_LEVELS, recommendErrorCorrectionLevel } from "@/lib/qr/errorCorrection";
import { MAX_LOGO_FILE_SIZE_BYTES, validateLogoFile } from "@/lib/security/fileValidation";
import { sanitizeSvgFile } from "@/lib/security/sanitizeSvg";
import { useTranslations } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n";
import { Tabs } from "@/components/ui/Tabs";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";

interface DesignPanelProps {
  design: QRCodeDesign;
  onChange: (design: QRCodeDesign) => void;
}

const MODULE_STYLES: ModuleStyle[] = ["square", "rounded", "dots", "extraRounded", "classy"];
const CORNER_STYLES: CornerStyle[] = ["square", "rounded", "dot"];

function bytesToLabel(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

export function DesignPanel({ design, onChange }: DesignPanelProps) {
  const t = useTranslations();
  const { showToast } = useToast();
  const [logoLoading, setLogoLoading] = useState(false);
  const contrastOk = designHasSufficientContrast(design);

  function update(partial: Partial<QRCodeDesign>) {
    onChange({ ...design, ...partial });
  }

  async function handleLogoFile(file: File) {
    const validation = validateLogoFile(file);
    if (!validation.valid) {
      showToast(validation.reason === "size" ? t.design.logoErrorSize : t.design.logoErrorType, "error");
      return;
    }

    setLogoLoading(true);
    try {
      const source = file.type === "image/svg+xml" ? await sanitizeSvgFile(file) : file;
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(source);
      });

      const nextDesign: Partial<QRCodeDesign> = {
        logo: { source: dataUrl, size: 0.4, margin: 4, backgroundEnabled: true, fileName: file.name },
      };
      if (design.errorCorrectionLevel !== "H") {
        nextDesign.errorCorrectionLevel = recommendErrorCorrectionLevel(nextDesign.logo ?? null);
      }
      update(nextDesign);
    } catch {
      showToast(t.errors.upload, "error");
    } finally {
      setLogoLoading(false);
    }
  }

  function removeLogo() {
    update({ logo: null, errorCorrectionLevel: "M" });
  }

  return (
    <Tabs
      ariaLabel={t.design.title}
      items={[
        { value: "colors", label: t.design.colors },
        { value: "shape", label: t.design.moduleStyle },
        { value: "logo", label: t.design.logo },
        { value: "advanced", label: t.design.errorCorrection },
      ]}
    >
      {(active) => {
        if (active === "colors") {
          return (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ColorPicker
                  label={t.design.foreground}
                  value={design.foregroundColor}
                  onChange={(value) => update({ foregroundColor: value })}
                />
                <ColorPicker
                  label={t.design.background}
                  value={design.backgroundColor}
                  onChange={(value) => update({ backgroundColor: value })}
                />
              </div>

              {!contrastOk && <Alert variant="warning">{t.design.contrastWarning}</Alert>}

              <Toggle
                checked={design.gradient.enabled}
                onChange={(enabled) => update({ gradient: { ...design.gradient, enabled } })}
                label={t.design.gradientEnable}
              />

              {design.gradient.enabled && (
                <div className="flex flex-col gap-4 rounded-md border border-cinza-medio-100 p-4">
                  <FormField label={t.design.gradientType}>
                    {({ inputId }) => (
                      <Select
                        id={inputId}
                        options={[
                          { value: "linear", label: t.design.gradientLinear },
                          { value: "radial", label: t.design.gradientRadial },
                        ]}
                        value={design.gradient.type}
                        onChange={(event) =>
                          update({ gradient: { ...design.gradient, type: event.target.value as "linear" | "radial" } })
                        }
                      />
                    )}
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPicker
                      label={t.design.gradientStart}
                      value={design.gradient.startColor}
                      onChange={(value) => update({ gradient: { ...design.gradient, startColor: value } })}
                    />
                    <ColorPicker
                      label={t.design.gradientEnd}
                      value={design.gradient.endColor}
                      onChange={(value) => update({ gradient: { ...design.gradient, endColor: value } })}
                    />
                  </div>
                  <Slider
                    label={t.design.gradientRotation}
                    min={0}
                    max={360}
                    value={design.gradient.rotation}
                    onChange={(rotation) => update({ gradient: { ...design.gradient, rotation } })}
                    formatValue={(value) => `${value}°`}
                  />
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update({
                    foregroundColor: DEFAULT_DESIGN.foregroundColor,
                    backgroundColor: DEFAULT_DESIGN.backgroundColor,
                  })
                }
              >
                {t.design.resetColors}
              </Button>
            </div>
          );
        }

        if (active === "shape") {
          return (
            <div className="flex flex-col gap-4">
              <FormField label={t.design.moduleStyle}>
                {({ inputId }) => (
                  <Select
                    id={inputId}
                    options={MODULE_STYLES.map((style) => ({ value: style, label: t.design.moduleStyles[style] }))}
                    value={design.moduleStyle}
                    onChange={(event) => update({ moduleStyle: event.target.value as ModuleStyle })}
                  />
                )}
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t.design.cornerStyle}>
                  {({ inputId }) => (
                    <Select
                      id={inputId}
                      options={CORNER_STYLES.map((style) => ({ value: style, label: t.design.cornerStyles[style] }))}
                      value={design.cornerStyle}
                      onChange={(event) => update({ cornerStyle: event.target.value as CornerStyle })}
                    />
                  )}
                </FormField>
                <FormField label={t.design.cornerDotStyle}>
                  {({ inputId }) => (
                    <Select
                      id={inputId}
                      options={CORNER_STYLES.map((style) => ({ value: style, label: t.design.cornerStyles[style] }))}
                      value={design.cornerDotStyle}
                      onChange={(event) => update({ cornerDotStyle: event.target.value as CornerStyle })}
                    />
                  )}
                </FormField>
              </div>
            </div>
          );
        }

        if (active === "logo") {
          return (
            <div className="flex flex-col gap-4">
              {design.logo ? (
                <div className="flex flex-col gap-4 rounded-md border border-cinza-medio-100 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={design.logo.source} alt="" className="h-10 w-10 rounded object-contain" />
                      <span className="text-sm text-cinza-antracite">{design.logo.fileName}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeLogo} aria-label={t.a11y.removeLogo}>
                      {t.design.logoRemove}
                    </Button>
                  </div>
                  <Slider
                    label={t.design.logoSize}
                    min={0.1}
                    max={0.4}
                    step={0.01}
                    value={design.logo.size}
                    onChange={(size) => update({ logo: { ...design.logo!, size } })}
                    formatValue={(value) => `${Math.round(value * 100)}%`}
                  />
                  <Slider
                    label={t.design.logoMargin}
                    min={0}
                    max={20}
                    value={design.logo.margin}
                    onChange={(margin) => update({ logo: { ...design.logo!, margin } })}
                  />
                  <Toggle
                    checked={design.logo.backgroundEnabled}
                    onChange={(backgroundEnabled) => update({ logo: { ...design.logo!, backgroundEnabled } })}
                    label={t.design.logoBackground}
                  />
                </div>
              ) : (
                <FileUpload
                  label={t.design.logoUpload}
                  hint={formatMessage(t.design.logoHint, { maxSize: bytesToLabel(MAX_LOGO_FILE_SIZE_BYTES) })}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={logoLoading}
                  onFileSelected={handleLogoFile}
                />
              )}
              {design.logo && design.errorCorrectionLevel !== "H" && (
                <Alert variant="info">{t.design.errorCorrectionRecommendedLogo}</Alert>
              )}
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-4">
            <Slider
              label={t.design.margin}
              min={0}
              max={40}
              value={design.margin}
              onChange={(margin) => update({ margin })}
            />
            <FormField label={t.design.errorCorrection}>
              {({ inputId }) => (
                <Select
                  id={inputId}
                  options={ERROR_CORRECTION_LEVELS.map((level) => ({
                    value: level,
                    label: t.design.errorCorrectionLevels[level],
                  }))}
                  value={design.errorCorrectionLevel}
                  onChange={(event) =>
                    update({ errorCorrectionLevel: event.target.value as QRCodeDesign["errorCorrectionLevel"] })
                  }
                />
              )}
            </FormField>
          </div>
        );
      }}
    </Tabs>
  );
}
