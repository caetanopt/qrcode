export const ALLOWED_LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"] as const;

export const ALLOWED_LOGO_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"] as const;

export const MAX_LOGO_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  reason?: "type" | "size";
}

export function validateLogoFile(file: File): FileValidationResult {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const typeAllowed =
    (ALLOWED_LOGO_MIME_TYPES as readonly string[]).includes(file.type) &&
    (ALLOWED_LOGO_EXTENSIONS as readonly string[]).includes(extension);

  if (!typeAllowed) {
    return { valid: false, reason: "type" };
  }
  if (file.size > MAX_LOGO_FILE_SIZE_BYTES) {
    return { valid: false, reason: "size" };
  }
  return { valid: true };
}
