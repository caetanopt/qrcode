import { describe, expect, it } from "vitest";
import { contrastRatio, hasSufficientContrast } from "./contrast";

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("#002E5D", "#002E5D")).toBeCloseTo(1, 5);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#002E5D", "#FFFFFF")).toBeCloseTo(contrastRatio("#FFFFFF", "#002E5D"), 5);
  });
});

describe("hasSufficientContrast", () => {
  it("accepts the Caetano deep blue on white", () => {
    expect(hasSufficientContrast("#002E5D", "#FFFFFF")).toBe(true);
  });

  it("rejects two similar light colors", () => {
    expect(hasSufficientContrast("#FFD23F", "#FFF6D9")).toBe(false);
  });
});
