import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { convertData, parseJson } from "@/lib/engines/data";

/** A JSON-safe value arbitrary (objects, arrays, primitives). */
const jsonValue = fc.letrec((tie) => ({
  value: fc.oneof(
    { depthSize: "small" },
    fc.string(),
    fc.integer(),
    fc.boolean(),
    fc.constant(null),
    fc.array(tie("value"), { maxLength: 4 }),
    fc.dictionary(fc.string({ minLength: 1, maxLength: 6 }), tie("value"), {
      maxKeys: 4,
    }),
  ),
})).value;

describe("data conversion round-trips", () => {
  it("JSON → YAML → JSON preserves the value", () => {
    fc.assert(
      fc.property(jsonValue, (value) => {
        const json = JSON.stringify(value);
        const toYaml = convertData(json, "json", "yaml");
        expect(toYaml.ok).toBe(true);
        if (!toYaml.ok) return;
        const backToJson = convertData(toYaml.value, "yaml", "json");
        expect(backToJson.ok).toBe(true);
        if (!backToJson.ok) return;
        const parsed = parseJson(backToJson.value);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) return;
        expect(parsed.value).toEqual(value);
      }),
    );
  });

  it("formatting JSON is idempotent", () => {
    fc.assert(
      fc.property(jsonValue, (value) => {
        const json = JSON.stringify(value);
        const once = convertData(json, "json", "json");
        expect(once.ok).toBe(true);
        if (!once.ok) return;
        const twice = convertData(once.value, "json", "json");
        expect(twice.ok).toBe(true);
        if (!twice.ok) return;
        expect(twice.value).toBe(once.value);
      }),
    );
  });
});
