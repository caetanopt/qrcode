import { describe, expect, it } from "vitest";
import { MAX_LOGO_FILE_SIZE_BYTES, validateLogoFile } from "./fileValidation";

function makeFile(name: string, type: string, size: number): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("validateLogoFile", () => {
  it("accepts a valid PNG within the size limit", () => {
    const file = makeFile("logo.png", "image/png", 1024);
    expect(validateLogoFile(file)).toEqual({ valid: true });
  });

  it("rejects an unsupported MIME type", () => {
    const file = makeFile("logo.gif", "image/gif", 1024);
    expect(validateLogoFile(file)).toEqual({ valid: false, reason: "type" });
  });

  it("rejects a mismatched extension even with an allowed MIME type", () => {
    const file = makeFile("logo.exe", "image/png", 1024);
    expect(validateLogoFile(file)).toEqual({ valid: false, reason: "type" });
  });

  it("rejects a file above the maximum size", () => {
    const file = makeFile("logo.png", "image/png", MAX_LOGO_FILE_SIZE_BYTES + 1);
    expect(validateLogoFile(file)).toEqual({ valid: false, reason: "size" });
  });
});
