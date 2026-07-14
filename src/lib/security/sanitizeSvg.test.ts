import { describe, expect, it } from "vitest";
import { sanitizeSvgMarkup } from "./sanitizeSvg";

describe("sanitizeSvgMarkup", () => {
  it("strips script tags", () => {
    const input = '<svg><script>alert(1)</script><circle r="5" /></svg>';
    expect(sanitizeSvgMarkup(input)).not.toContain("<script>");
  });

  it("strips inline event handlers", () => {
    const input = '<svg onload="alert(1)"><rect onclick="alert(2)" /></svg>';
    const result = sanitizeSvgMarkup(input);
    expect(result).not.toContain("onload");
    expect(result).not.toContain("onclick");
  });

  it("strips javascript: URIs", () => {
    const input = '<svg><a href="javascript:alert(1)">link</a></svg>';
    expect(sanitizeSvgMarkup(input)).not.toContain("javascript:");
  });

  it("strips foreignObject content", () => {
    const input = "<svg><foreignObject><body>html</body></foreignObject></svg>";
    expect(sanitizeSvgMarkup(input)).not.toContain("foreignObject");
  });

  it("preserves benign markup", () => {
    const input = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#002E5D" /></svg>';
    expect(sanitizeSvgMarkup(input)).toBe(input);
  });
});
