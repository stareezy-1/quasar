import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  type Rgb,
} from "@/lib/engines/color";

const rgbArb = fc.record({
  r: fc.integer({ min: 0, max: 255 }),
  g: fc.integer({ min: 0, max: 255 }),
  b: fc.integer({ min: 0, max: 255 }),
});

/** Channels should survive a round-trip within a small rounding tolerance. */
function closeRgb(a: Rgb, b: Rgb, tol = 6): boolean {
  return (
    Math.abs(a.r - b.r) <= tol &&
    Math.abs(a.g - b.g) <= tol &&
    Math.abs(a.b - b.b) <= tol
  );
}

describe("color round-trips", () => {
  it("RGB → HEX → RGB is exact", () => {
    fc.assert(
      fc.property(rgbArb, (rgb) => {
        const back = hexToRgb(rgbToHex(rgb));
        expect(back).not.toBeNull();
        expect(back).toEqual(rgb);
      }),
    );
  });

  it("RGB → HSL → RGB is stable within tolerance", () => {
    fc.assert(
      fc.property(rgbArb, (rgb) => {
        const back = hslToRgb(rgbToHsl(rgb));
        expect(closeRgb(rgb, back)).toBe(true);
      }),
    );
  });

  it("RGB → HSV → RGB is stable within tolerance", () => {
    fc.assert(
      fc.property(rgbArb, (rgb) => {
        const back = hsvToRgb(rgbToHsv(rgb));
        expect(closeRgb(rgb, back)).toBe(true);
      }),
    );
  });
});
