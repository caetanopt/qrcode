/**
 * Strips executable content from an uploaded SVG before it is ever used as an
 * image source, so a malicious upload can't run script in the browser.
 */
export function sanitizeSvgMarkup(svgMarkup: string): string {
  return svgMarkup
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
}

export async function sanitizeSvgFile(file: File): Promise<Blob> {
  const text = await file.text();
  const sanitized = sanitizeSvgMarkup(text);
  return new Blob([sanitized], { type: "image/svg+xml" });
}
