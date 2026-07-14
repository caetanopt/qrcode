function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = hex.trim().replace(/^#/, "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  const [rl, gl, bl] = [channel(r), channel(g), channel(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** WCAG 2.x contrast ratio between two colors, from 1 (no contrast) to 21 (max contrast). */
export function contrastRatio(colorA: string, colorB: string): number {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  if (!rgbA || !rgbB) return 1;
  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Minimum contrast ratio to keep QR modules reliably scannable. */
export const MIN_QR_CONTRAST_RATIO = 2.5;

export function hasSufficientContrast(foreground: string, background: string): boolean {
  return contrastRatio(foreground, background) >= MIN_QR_CONTRAST_RATIO;
}

interface ContrastCheckableDesign {
  foregroundColor: string;
  backgroundColor: string;
  gradient: { enabled: boolean; startColor: string; endColor: string };
}

/**
 * When a gradient is active the modules are painted with the gradient stops,
 * not with foregroundColor — so both stops must clear the threshold or part
 * of the code can fade into the background.
 */
export function designHasSufficientContrast(design: ContrastCheckableDesign): boolean {
  if (design.gradient.enabled) {
    return (
      hasSufficientContrast(design.gradient.startColor, design.backgroundColor) &&
      hasSufficientContrast(design.gradient.endColor, design.backgroundColor)
    );
  }
  return hasSufficientContrast(design.foregroundColor, design.backgroundColor);
}
