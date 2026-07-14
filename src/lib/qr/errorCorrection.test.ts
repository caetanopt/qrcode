import { describe, expect, it } from "vitest";
import { isLogoSizeSafe, recommendErrorCorrectionLevel } from "./errorCorrection";

describe("recommendErrorCorrectionLevel", () => {
  it("recommends M when there is no logo", () => {
    expect(recommendErrorCorrectionLevel(null)).toBe("M");
  });

  it("recommends H when a logo is present", () => {
    expect(
      recommendErrorCorrectionLevel({ source: "data:image/png;base64,", size: 0.3, margin: 4, backgroundEnabled: true, fileName: "logo.png" }),
    ).toBe("H");
  });
});

describe("isLogoSizeSafe", () => {
  it("accepts sizes at or below the maximum ratio", () => {
    expect(isLogoSizeSafe(0.3)).toBe(true);
    expect(isLogoSizeSafe(0.1)).toBe(true);
  });

  it("rejects sizes above the maximum ratio", () => {
    expect(isLogoSizeSafe(0.5)).toBe(false);
  });
});
