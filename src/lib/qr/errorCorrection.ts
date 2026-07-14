import type { ErrorCorrectionLevel, LogoDesign } from "@/types/qr";

export const ERROR_CORRECTION_LEVELS: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

export const DEFAULT_ERROR_CORRECTION_LEVEL: ErrorCorrectionLevel = "M";
export const RECOMMENDED_ERROR_CORRECTION_LEVEL_WITH_LOGO: ErrorCorrectionLevel = "H";

/** Maximum logo size, as a fraction of the QR code's width, that keeps the code scannable. */
export const MAX_LOGO_SIZE_RATIO = 0.3;

export function recommendErrorCorrectionLevel(logo: LogoDesign | null): ErrorCorrectionLevel {
  return logo ? RECOMMENDED_ERROR_CORRECTION_LEVEL_WITH_LOGO : DEFAULT_ERROR_CORRECTION_LEVEL;
}

export function isLogoSizeSafe(logoSizeRatio: number): boolean {
  return logoSizeRatio <= MAX_LOGO_SIZE_RATIO;
}
