import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { convertUnit, UNIT_CATEGORIES } from "@/lib/engines/unit";

describe("unit conversion", () => {
  it("converting a value to the same unit is identity", () => {
    fc.assert(
      fc.property(fc.float({ min: -1e6, max: 1e6, noNaN: true }), (value) => {
        const r = convertUnit(value, "m", "m", "length");
        expect(r.ok).toBe(true);
        if (r.ok) expect(r.value).toBeCloseTo(value, 6);
      }),
    );
  });

  it("round-trips through a second unit and back (length)", () => {
    const units = UNIT_CATEGORIES.length.units.map((u) => u.id);
    fc.assert(
      fc.property(
        fc.float({ min: 1, max: 1e5, noNaN: true }),
        fc.constantFrom(...units),
        fc.constantFrom(...units),
        (value, from, to) => {
          const forward = convertUnit(value, from, to, "length");
          expect(forward.ok).toBe(true);
          if (!forward.ok) return;
          const back = convertUnit(forward.value, to, from, "length");
          expect(back.ok).toBe(true);
          if (back.ok) expect(back.value).toBeCloseTo(value, 4);
        },
      ),
    );
  });

  it("celsius → fahrenheit → celsius round-trips", () => {
    fc.assert(
      fc.property(fc.float({ min: -100, max: 100, noNaN: true }), (c) => {
        const f = convertUnit(c, "c", "f", "temperature");
        expect(f.ok).toBe(true);
        if (!f.ok) return;
        const back = convertUnit(f.value, "f", "c", "temperature");
        expect(back.ok).toBe(true);
        if (back.ok) expect(back.value).toBeCloseTo(c, 6);
      }),
    );
  });
});
